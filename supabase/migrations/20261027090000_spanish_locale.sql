-- Español como tercer idioma del sitio (en, nb, es).
--
-- El perfil guarda el idioma preferido: lo usan los emails de recordatorio y el idioma por
-- defecto al iniciar sesión. Los usuarios nuevos que se registran desde /es quedan en español.

alter type public.app_locale add value if not exists 'es';

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.profiles (id, full_name, avatar_url, locale)
    values (
        new.id,
        coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
        new.raw_user_meta_data ->> 'avatar_url',
        case
            when new.raw_user_meta_data ->> 'locale' in ('nb', 'es')
                then (new.raw_user_meta_data ->> 'locale')::public.app_locale
            else 'en'::public.app_locale
        end
    );
    return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
