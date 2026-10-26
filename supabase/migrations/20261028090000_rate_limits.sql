-- Límites de frecuencia contra ataques automáticos (bots).
--
-- Van en la base de datos y no solo en la web: cualquiera con una cuenta puede llamar a la API
-- de Supabase directamente, sin pasar por los botones del sitio.
--
-- - private.rate_limit_hits: un registro por acción, con la clave (acción + usuario o IP).
-- - private.enforce_rate_limit(): para el usuario con sesión; si se pasa del límite corta con
--   el código PT429, que la API (PostgREST) devuelve como HTTP 429 y la web traduce a
--   "demasiados intentos, espera un momento".
-- - public.rate_limit_hit(): para la web (solo con la clave secreta del servidor), que limita
--   por IP los formularios sin sesión: entrar, crear cuenta, enlace por email y nueva contraseña.

create table private.rate_limit_hits (
    key text not null check (char_length(key) <= 200),
    hit_at timestamptz not null default now()
);

create index rate_limit_hits_key_idx on private.rate_limit_hits (key, hit_at);

alter table private.rate_limit_hits enable row level security;
revoke all on private.rate_limit_hits from public, anon, authenticated;

-- Registra un uso de "p_key" y dice si sigue dentro del límite (máximo p_max en p_window).
-- Si ya se llegó al máximo, no registra nada y devuelve false.
create function private.rate_limit_try(p_key text, p_max integer, p_window interval)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
    -- Dos pedidos a la vez de la misma clave no pueden colarse los dos.
    perform pg_advisory_xact_lock(hashtextextended(p_key, 0));

    if (
        select count(*) from private.rate_limit_hits
        where key = p_key and hit_at > now() - p_window
    ) >= p_max then
        return false;
    end if;

    insert into private.rate_limit_hits (key) values (p_key);

    -- Limpieza de vez en cuando: nada de esta tabla hace falta después de un día.
    if random() < 0.01 then
        delete from private.rate_limit_hits where hit_at < now() - interval '1 day';
    end if;
    return true;
end;
$$;

-- Límite para el usuario con sesión. Los admins y el servidor (sin usuario) no tienen límite.
create function private.enforce_rate_limit(p_action text, p_max integer, p_window interval)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_uid uuid := (select auth.uid());
begin
    if v_uid is null or private.is_admin() then
        return;
    end if;
    if not private.rate_limit_try(p_action || ':' || v_uid, p_max, p_window) then
        raise exception 'rate_limited' using errcode = 'PT429';
    end if;
end;
$$;

-- Para la web: límites por IP (la clave llega ya con la IP cifrada, nunca la IP en claro).
create function public.rate_limit_hit(p_key text, p_max integer, p_window_seconds integer)
returns boolean
language sql
security invoker
set search_path = ''
as $$ select private.rate_limit_try(p_key, p_max, make_interval(secs => p_window_seconds)); $$;

revoke execute on function private.rate_limit_try(text, integer, interval) from public, anon, authenticated;
revoke execute on function private.enforce_rate_limit(text, integer, interval) from public, anon;
revoke execute on function public.rate_limit_hit(text, integer, integer) from public, anon, authenticated;
grant usage on schema private to service_role;
grant execute on function private.enforce_rate_limit(text, integer, interval) to authenticated;
grant execute on function private.rate_limit_try(text, integer, interval) to service_role;
grant execute on function public.rate_limit_hit(text, integer, integer) to service_role;

-- ─── Crear partidos: como máximo 3 cada 5 minutos ──────────────────────────────
-- Un partido semanal (hasta 12 filas con el mismo series_id) cuenta como una sola creación.
-- Se mantiene además el tope de 30 partidos al día.

create or replace function private.before_match_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    if (select auth.uid()) is null or private.is_admin() then
        return new;
    end if;
    if new.starts_at < now() or new.starts_at > now() + interval '400 days' then
        raise exception 'The match must start in the future (within a year)' using errcode = '23514';
    end if;
    if (
        select count(*) from public.matches
        where host_id = new.host_id and created_at > now() - interval '1 day'
    ) >= 30 then
        raise exception 'Too many matches created today' using errcode = 'P0001';
    end if;
    -- Las semanas siguientes de un partido semanal no cuentan como creaciones nuevas.
    if new.series_id is null or not exists (
        select 1 from public.matches where series_id = new.series_id
    ) then
        if (
            select count(distinct coalesce(series_id, id)) from public.matches
            where host_id = new.host_id and created_at > now() - interval '5 minutes'
        ) >= 3 then
            raise exception 'rate_limited' using errcode = 'PT429';
        end if;
    end if;
    new.status := 'open';
    new.score_a := null;
    new.score_b := null;
    return new;
end;
$$;

-- ─── Botones de la API ─────────────────────────────────────────────────────────

-- Apuntarse / bajarse: 20 cada 5 minutos (el organizador que se suma a su propio partido al
-- crearlo no cuenta, así un partido semanal de 12 semanas no gasta el cupo).
create or replace function public.join_match(p_match_id uuid)
returns public.participant_status
language sql security invoker set search_path = ''
as $$
    select private.enforce_rate_limit('join_leave', 20, interval '5 minutes')
    where not exists (
        select 1 from public.matches where id = p_match_id and host_id = (select auth.uid())
    );
    select private.join_match(p_match_id);
$$;

create or replace function public.leave_match(p_match_id uuid)
returns void
language sql security invoker set search_path = ''
as $$
    select private.enforce_rate_limit('join_leave', 20, interval '5 minutes');
    select private.leave_match(p_match_id);
$$;

-- Valorar jugadores: 60 cada 10 minutos (un partido de 11 contra 11 son 21 valoraciones).
create or replace function public.rate_player(p_match_id uuid, p_rated_id uuid, p_score integer)
returns void
language sql security invoker set search_path = ''
as $$
    select private.enforce_rate_limit('rate', 60, interval '10 minutes');
    select private.rate_player(p_match_id, p_rated_id, p_score);
$$;

-- Equipos y resultado (solo el organizador): 30 cada 5 minutos.
create or replace function public.record_result(p_match_id uuid, p_score_a integer, p_score_b integer, p_attended uuid[])
returns void
language sql security invoker set search_path = ''
as $$
    select private.enforce_rate_limit('host_tools', 30, interval '5 minutes');
    select private.record_result(p_match_id, p_score_a, p_score_b, p_attended);
$$;

create or replace function public.save_teams(p_match_id uuid, p_team_a uuid[], p_team_b uuid[])
returns void
language sql security invoker set search_path = ''
as $$
    select private.enforce_rate_limit('host_tools', 30, interval '5 minutes');
    select private.save_teams(p_match_id, p_team_a, p_team_b);
$$;

-- Editar el perfil: 20 cada 5 minutos.
create function private.before_profile_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    if (select auth.uid()) = new.id then
        perform private.enforce_rate_limit('profile', 20, interval '5 minutes');
    end if;
    return new;
end;
$$;

create trigger before_profile_update_rate_limit
    before update on public.profiles
    for each row execute function private.before_profile_update();

revoke execute on function private.before_profile_update() from public, anon, authenticated;
