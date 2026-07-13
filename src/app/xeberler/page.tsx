import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { getNews } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const metadata = pageMetadata({
  title: "Xıdırlı xəbərləri — kənddən son yeniliklər",
  description:
    "Xıdırlı kəndinin son xəbərləri: kənd həyatı, tədbirlər, elanlar, bərpa işləri və icma yenilikləri — birbaşa kənddən.",
  path: "/xeberler",
});

export const revalidate = 300;

export default async function NewsPage() {
  const news = await getNews();

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold">Xəbərlər</h1>

      {news.length === 0 && (
        <div className="rounded-2xl border border-line bg-surface p-6 text-center">
          <p className="text-4xl" aria-hidden>📰</p>
          <p className="mt-2 font-bold">Hələ xəbər yoxdur</p>
        </div>
      )}

      <ul className="space-y-3">
        {news.map((n) => (
          <li key={n.id}>
            <Link
              href={`/xeberler/${n.id}`}
              className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-sm active:bg-surface-2"
            >
              <span className="text-4xl" aria-hidden>{n.coverEmoji ?? "📰"}</span>
              <span className="min-w-0">
                <span className="block text-lg font-bold leading-snug">{n.title}</span>
                <span className="mt-1 block text-sm text-ink-soft">
                  {formatDate(n.publishedAt)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
