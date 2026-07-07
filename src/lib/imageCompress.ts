"use client";

/*
  Brauzerdə şəkil sıxma — pulsuz tier qaydası: server tərəfdə
  transformasiya yoxdur, yükləmədən ƏVVƏL kiçildilir.
  Nəticə: maksimum 1600px, JPEG ~0.8 keyfiyyət.
*/

const MAX_DIMENSION = 1600;
const QUALITY = 0.8;

export async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", QUALITY)
  );
  // Sıxma nəticə verməsə (məs. kiçik PNG) orijinal qalır
  return blob && blob.size < file.size ? blob : file;
}
