/*
  Şəhidlər bölməsi ayrıca vizual kimlik daşıyır: tünd sürməyi-yaşıl fon,
  qızılı vurğular, animasiyasız, sakit və ləyaqətli ton (bax: globals.css
  .memorial-scope). Bu bölmənin məzmunu yalnız ailə nümayəndəsi + admin
  ikiqat təsdiqi ilə dərc olunur.
*/
export default function MemorialLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="memorial-scope -mx-4 -mt-4 min-h-screen bg-bg px-4 pb-8 pt-6 text-ink">
      {children}
    </div>
  );
}
