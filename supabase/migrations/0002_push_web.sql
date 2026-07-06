-- =============================================================
-- Web Push (VAPID) dəstəyi.
-- Qərar: FCM əvəzinə standart Web Push istifadə olunur — Firebase
-- hesabı tələb etmir, tam pulsuzdur; brauzer tərəfi eynidir.
-- fcm_token sütunu abunəliyin unikal endpoint URL-ini saxlayır,
-- subscription isə web-push üçün lazım olan tam JSON-u (keys daxil).
-- =============================================================

alter table public.push_subscriptions
  add column if not exists subscription jsonb;

-- Kənd qaydası: baxış üçün giriş tələb olunmur — bildirişə abunəlik də
-- girişsiz mümkün olmalıdır. Endpoint URL-lər təxmin edilə bilməyən
-- gizli dəyərlərdir: SELECT siyasəti olmadığından kənar şəxs sətirləri
-- oxuya/sadalaya bilməz; silmək üçün dəqiq endpoint bilinməlidir.
create policy "push anon subscribe" on public.push_subscriptions
  for insert with check (true);

create policy "push anon unsubscribe" on public.push_subscriptions
  for delete using (true);
