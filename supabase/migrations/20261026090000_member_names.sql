-- Nombres de los miembros para la cinta del home ("ya juegan con nosotros").
--
-- Los perfiles solo los ven usuarios registrados, así que la home (pública y estática) no puede
-- leerlos directamente. Esta función devuelve únicamente el nombre completo de los miembros más
-- recientes con nombre cargado: nada de email, nivel, posición ni ids. La política de
-- privacidad lo menciona.

create function private.member_names(p_limit integer default 40)
returns table (full_name text)
language sql
stable
security definer
set search_path = ''
as $$
    select trim(p.full_name)
    from public.profiles p
    where char_length(trim(p.full_name)) >= 2
    order by p.created_at desc
    limit least(greatest(coalesce(p_limit, 40), 1), 60);
$$;

create function public.member_names(p_limit integer default 40)
returns table (full_name text)
language sql stable security invoker set search_path = ''
as $$ select * from private.member_names(p_limit); $$;

revoke execute on function private.member_names(integer) from public;
revoke execute on function public.member_names(integer) from public;
grant execute on function private.member_names(integer) to anon, authenticated;
grant execute on function public.member_names(integer) to anon, authenticated;
