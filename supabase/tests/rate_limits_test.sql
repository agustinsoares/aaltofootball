-- Pruebas de los límites de frecuencia (migración rate_limits).
-- Uso: psql -d <db> -f supabase/tests/rate_limits_test.sql (tras migraciones y seed).
-- Cada prueba imprime PASS o FAIL; no debería aparecer ningún FAIL.
\set QUIET on
\pset footer off
\pset tuples_only on

-- Punto de partida limpio (la prueba se puede repetir): sin registros de límites, sin los
-- partidos de una corrida anterior, y los del seed (creados "ahora") pasan a hace una hora.
delete from private.rate_limit_hits;
delete from public.matches where title = 'Rate limit test';
update public.matches set created_at = now() - interval '1 hour';

select id as admin from auth.users where email = 'admin@aaltofootball.test' \gset
select id as player from auth.users where email = 'player@aaltofootball.test' \gset
select id as venue from public.venues order by name limit 1 \gset
-- Otro jugador (ni admin ni "player") para las pruebas de partidos semanales y de perfil.
select p.id as other from public.profiles p join auth.users u on u.id = p.id
where u.email not in ('admin@aaltofootball.test', 'player@aaltofootball.test') order by u.email limit 1 \gset
-- Un partido abierto con lugar libre que no organiza "player".
select m.id as open_match from public.matches m
where m.status = 'open' and m.visibility = 'public' and m.starts_at > now() and m.host_id <> :'player'
  and (select count(*) from public.match_participants mp where mp.match_id = m.id and mp.status = 'confirmed') < m.max_players - 1
  and not exists (select 1 from public.match_participants mp where mp.match_id = m.id and mp.user_id = :'player')
order by m.starts_at limit 1 \gset

create or replace function pg_temp.act_as(uid uuid) returns void language sql as $$
    select set_config('request.jwt.claim.sub', uid::text, false),
           set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated')::text, false);
$$;

-- Crea un partido como el usuario actual; devuelve el código de error ('' si salió bien).
create or replace function pg_temp.try_create(p_host uuid, p_venue uuid, p_series uuid default null, p_rows int default 1)
returns text language plpgsql as $$
begin
    insert into public.matches (venue_id, host_id, title, format, starts_at, max_players, series_id)
    select p_venue, p_host, 'Rate limit test', '7v7', now() + make_interval(days => 3 + 7 * g), 14, p_series
    from generate_series(0, p_rows - 1) g;
    return '';
exception when others then
    return sqlstate;
end;
$$;

create or replace function pg_temp.try(p_sql text) returns text language plpgsql as $$
begin
    execute p_sql;
    return '';
exception when others then
    return sqlstate;
end;
$$;

create or replace function pg_temp.check(p_ok boolean, p_label text) returns text language sql as $$
    select case when p_ok then 'PASS  ' else 'FAIL  ' end || p_label;
$$;

grant execute on all functions in schema pg_temp to authenticated, anon, service_role;

\echo '--- 1. crear partidos: 3 cada 5 minutos'
set role authenticated; select pg_temp.act_as(:'player');
select pg_temp.try_create(:'player', :'venue') as c1 \gset
select pg_temp.try_create(:'player', :'venue') as c2 \gset
select pg_temp.try_create(:'player', :'venue') as c3 \gset
select pg_temp.try_create(:'player', :'venue') as c4 \gset
reset role;
select pg_temp.check(:'c1' = '' and :'c2' = '' and :'c3' = '', 'los 3 primeros partidos se crean');
select pg_temp.check(:'c4' = 'PT429', 'el 4.º partido en 5 minutos se rechaza (PT429)');

\echo '--- 2. un partido semanal (varias filas) cuenta como una sola creación'
set role authenticated; select pg_temp.act_as(:'other');
select pg_temp.try_create(:'other', :'venue', gen_random_uuid(), 4) as s1 \gset
select pg_temp.try_create(:'other', :'venue') as s2 \gset
select pg_temp.try_create(:'other', :'venue') as s3 \gset
select pg_temp.try_create(:'other', :'venue') as s4 \gset
reset role;
select pg_temp.check(:'s1' = '' and :'s2' = '' and :'s3' = '', 'serie de 4 semanas + 2 partidos sueltos = 3 creaciones');
select pg_temp.check(:'s4' = 'PT429', 'la 4.ª creación se rechaza');

\echo '--- 3. los admins no tienen límite'
set role authenticated; select pg_temp.act_as(:'admin');
select pg_temp.try_create(:'admin', :'venue') || pg_temp.try_create(:'admin', :'venue')
    || pg_temp.try_create(:'admin', :'venue') || pg_temp.try_create(:'admin', :'venue') as a4 \gset
reset role;
select pg_temp.check(:'a4' = '', 'un admin crea 4 partidos seguidos');

\echo '--- 4. apuntarse / bajarse: 20 cada 5 minutos'
set role authenticated; select pg_temp.act_as(:'player');
select string_agg(
    pg_temp.try(format(case when g % 2 = 1 then 'select public.join_match(%L)' else 'select public.leave_match(%L)' end, :'open_match')),
    '' order by g) as toggles
from generate_series(1, 20) g \gset
select pg_temp.try(format('select public.join_match(%L)', :'open_match')) as t21 \gset
reset role;
select pg_temp.check(:'toggles' = '', '20 altas/bajas seguidas funcionan');
select pg_temp.check(:'t21' = 'PT429', 'la 21.ª se rechaza (PT429)');

\echo '--- 5. el organizador que se suma a su propio partido no gasta el cupo'
select id as own_match from public.matches where host_id = :'player' and title = 'Rate limit test' limit 1 \gset
set role authenticated; select pg_temp.act_as(:'player');
select pg_temp.try(format('select public.join_match(%L)', :'own_match')) as own \gset
reset role;
select pg_temp.check(:'own' = '', 'con el cupo agotado, el host igual se suma a su partido');

\echo '--- 6. perfil: 20 cambios cada 5 minutos'
set role authenticated; select pg_temp.act_as(:'other');
select string_agg(pg_temp.try(format('update public.profiles set full_name = %L where id = %L', 'Name ' || g, :'other')), '')
    as edits from generate_series(1, 20) g \gset
select pg_temp.try(format('update public.profiles set full_name = %L where id = %L', 'Name 21', :'other')) as e21 \gset
reset role;
select pg_temp.check(:'edits' = '', '20 cambios de perfil seguidos funcionan');
select pg_temp.check(:'e21' = 'PT429', 'el 21.º se rechaza (PT429)');

\echo '--- 7. límite por IP de la web: solo el servidor (service_role) puede usarlo'
set role service_role;
select string_agg(public.rate_limit_hit('test:ip:abc', 3, 60)::text, ',' order by g) as hits from generate_series(1, 4) g \gset
reset role;
select pg_temp.check(:'hits' = 'true,true,true,false', 'máximo 3: los 3 primeros pasan y el 4.º no');
set role anon;
select pg_temp.try('select public.rate_limit_hit(''x'', 1, 60)') as anon_hit \gset
reset role;
set role authenticated;
select pg_temp.try('select public.rate_limit_hit(''x'', 1, 60)') as user_hit \gset
select pg_temp.try('select count(*) from private.rate_limit_hits') as user_read \gset
reset role;
select pg_temp.check(:'anon_hit' = '42501' and :'user_hit' = '42501', 'visitantes y usuarios no pueden llamarlo (permiso denegado)');
select pg_temp.check(:'user_read' = '42501', 'nadie lee la tabla de registros desde la API');
