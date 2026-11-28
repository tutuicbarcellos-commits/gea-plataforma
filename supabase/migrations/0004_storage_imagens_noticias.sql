-- Bucket publico para imagens de capa das noticias.
-- Leitura publica. Envio, troca e exclusao restritos a administradores.
-- Limite de 2 MB e apenas JPG, PNG e WebP, aplicados pelo proprio bucket.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('noticias', 'noticias', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "noticias_imagens_leitura_publica" on storage.objects
  for select using (bucket_id = 'noticias');

create policy "noticias_imagens_admin_envio" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'noticias' and public.e_administrador());

create policy "noticias_imagens_admin_troca" on storage.objects
  for update to authenticated
  using (bucket_id = 'noticias' and public.e_administrador())
  with check (bucket_id = 'noticias' and public.e_administrador());

create policy "noticias_imagens_admin_exclusao" on storage.objects
  for delete to authenticated
  using (bucket_id = 'noticias' and public.e_administrador());
