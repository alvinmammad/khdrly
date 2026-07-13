/** schema.org JSON-LD strukturunu səhifəyə əlavə edir (server komponenti) */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD üçün rəsmi üsul — məzmun yalnız bizim qurduğumuz obyektdir
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
