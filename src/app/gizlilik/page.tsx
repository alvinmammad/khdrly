import type { Metadata } from "next";

export const metadata: Metadata = { title: "Gizlilik siyasəti" };

/*
  Google Play tələbi: tətbiqin gizlilik siyasəti URL-i olmalıdır.
  Sadə, düzgün, kəndə uyğun dildə.
*/
export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-lg space-y-5">
      <h1 className="font-heading text-2xl font-bold">Gizlilik siyasəti</h1>
      <p className="text-ink-soft">Son yenilənmə: iyul 2026</p>

      <section className="space-y-4">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="font-bold">Hansı məlumatları toplayırıq?</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-soft">
            <li>
              <strong>Girişsiz istifadə:</strong> saytı oxumaq üçün heç bir
              şəxsi məlumat tələb olunmur və toplanmır.
            </li>
            <li>
              <strong>Google ilə giriş etsəniz:</strong> adınız və e-poçt
              ünvanınız. Telefon nömrənizi könüllü əlavə edə bilərsiniz —
              o, yalnız sifarişlərinizlə bağlı əlaqə üçün istifadə olunur və
              heç vaxt saytda açıq göstərilmir.
            </li>
            <li>
              <strong>Bildirişlərə abunə olsanız:</strong> cihazınızın anonim
              bildiriş ünvanı (şəxsiyyətinizlə əlaqələndirilmir).
            </li>
            <li>
              <strong>Şəkil paylaşsanız:</strong> yüklədiyiniz şəkil və ona
              yazdığınız məlumatlar — razılıq qutusunu işarələdikdən sonra.
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="font-bold">Məlumatlar harada saxlanılır?</p>
          <p className="mt-2 text-ink-soft">
            Məlumatlar Supabase (verilənlər bazası) və Vercel (hostinq)
            xidmətlərində saxlanılır. Üçüncü tərəflərə satılmır və
            ötürülmür. Reklam və izləmə (tracking) sistemləri istifadə
            olunmur.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="font-bold">Hüquqlarınız</p>
          <p className="mt-2 text-ink-soft">
            İstənilən vaxt hesabınızın və məlumatlarınızın silinməsini,
            paylaşdığınız məzmunun götürülməsini tələb edə bilərsiniz —
            kənd icra nümayəndəliyinə müraciət etmək kifayətdir. Bildiriş
            abunəliyini Parametrlər səhifəsindən özünüz söndürə bilərsiniz.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="font-bold">Uşaqlar</p>
          <p className="mt-2 text-ink-soft">
            Tətbiq bütün yaşlar üçün təhlükəsizdir; uşaqlardan şəxsi məlumat
            toplanmır.
          </p>
        </div>
      </section>
    </div>
  );
}
