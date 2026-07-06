import Link from "next/link";
import { notFound } from "next/navigation";
import TtsButton from "@/components/ui/TtsButton";
import { getNews, getNewsItem } from "@/lib/data";
import { formatDate } from "@/lib/format";

export async function generateStaticParams() {
  const news = await getNews();
  return news.map((n) => ({ id: n.id }));
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getNewsItem(id);
  if (!item) notFound();

  return (
    <article className="space-y-4">
      <Link href="/xeberler" className="inline-block font-bold text-kerpic">
        ← Xəbərlər
      </Link>
      <p className="text-5xl" aria-hidden>{item.coverEmoji ?? "📰"}</p>
      <h1 className="font-heading text-2xl font-bold leading-snug">{item.title}</h1>
      <p className="text-sm text-ink-soft">{formatDate(item.publishedAt)}</p>

      <TtsButton text={`${item.title}. ${item.body}`} />

      <div className="space-y-4 text-lg leading-relaxed">
        {item.body.split("\n\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </article>
  );
}
