/** schema.org JSON-LD strukturunu səhifəyə əlavə edir (server komponenti) */
export default function JsonLd({ data }: { data: object }) {
  // "<" escape olunur ki, məzmundakı "</script>" sətri teqi sındıra bilməsin
  // (xəbər başlığı kimi sahələr JSON-a düşür)
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
