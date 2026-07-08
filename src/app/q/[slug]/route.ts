import { redirect } from "next/navigation";

/*
  QR yönləndirici: fiziki lövhələrdəki kodlar həmişə /q/<slug> daşıyır.
  Səhifə strukturu dəyişsə belə, çap olunmuş QR-lər işlək qalır —
  yalnız buradakı yönləndirməni yeniləmək kifayətdir.
*/
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  redirect(`/yer/${encodeURIComponent(slug)}`);
}
