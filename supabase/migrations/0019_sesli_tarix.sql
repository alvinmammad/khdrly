-- =============================================================
-- Şifahi tarix arxivi (Mərhələ 3-ün son modullarından).
-- Ağsaqqalların söhbətləri: staff telefonla yazıb admin paneldən
-- yükləyir (media bucket, sesli-tarix/ qovluğu). Transkripsiya
-- scripts/stt.mjs ilə (Whisper — Groq pulsuz tier) və ya əllə.
-- =============================================================

create table public.oral_histories (
  id uuid primary key default gen_random_uuid(),
  title text not null,               -- "1993-cü ilin yayı"
  narrator text not null,            -- danışan şəxs (razılığı ilə)
  narrator_info text,                -- "1941-ci il təvəllüdlü" və s.
  audio_path text not null,          -- media bucket daxilində yol
  transcript text,                   -- tam mətn (axtarış + oxu üçün)
  status public.moderation_status not null default 'draft',
  created_at timestamptz not null default now()
);

alter table public.oral_histories enable row level security;

create policy "oral public read" on public.oral_histories
  for select using (status = 'approved' or public.is_staff());
create policy "oral staff write" on public.oral_histories
  for all using (public.is_staff());

-- Media bucket: səs formatlarına icazə + limit 25 MB (uzun söhbətlər)
update storage.buckets
set file_size_limit = 26214400,
    allowed_mime_types = array[
      'image/jpeg', 'image/png', 'image/webp',
      'audio/mpeg', 'audio/mp4', 'audio/webm', 'audio/ogg', 'audio/wav', 'audio/aac'
    ]
where id = 'media';
