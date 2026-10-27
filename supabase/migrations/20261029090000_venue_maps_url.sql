-- Link de Google Maps de cada cancha.
--
-- Los admins cargan el link en vez de latitud y longitud: la web saca las coordenadas del
-- link (lat/lng se siguen guardando para el mapa de partidos, el mapa de cada partido y el
-- calendario). Las canchas que ya existían reciben un link armado con sus coordenadas.

alter table public.venues
    add column maps_url text
    check (maps_url is null or (char_length(maps_url) <= 500 and maps_url ~ '^https://'));

update public.venues
set maps_url = 'https://www.google.com/maps/search/?api=1&query=' || lat || ',' || lng
where maps_url is null;
