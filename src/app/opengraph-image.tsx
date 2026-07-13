import { ImageResponse } from "next/og";

/*
  Sosial şəbəkələrdə (WhatsApp, Facebook, Telegram) link paylaşılanda
  görünən 1200×630 şəkil — build zamanı generasiya olunur.
*/

export const alt = "Xıdırlı kəndi — Ağdam rayonu, Qarabağ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6d1f2c 0%, #8e2a3a 35%, #b5542d 100%)",
          color: "#fdfbf6",
          position: "relative",
        }}
      >
        {/* nar motivi */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: 9999,
            background: "#fdfbf6",
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 9999,
              background: "#8e2a3a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 9999,
                background: "#e8a93c",
              }}
            />
          </div>
        </div>
        <div style={{ fontSize: 116, fontWeight: 700, letterSpacing: -2 }}>
          Xıdırlı kəndi
        </div>
        <div style={{ fontSize: 40, marginTop: 12, opacity: 0.92 }}>
          Ağdam rayonu · Qarabağ
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 44,
            fontSize: 28,
            opacity: 0.8,
          }}
        >
          Tarix · Şəhidlərimiz · Xəbərlər · Bazar · Xəritə
        </div>
        {/* günəbaxan zolağı */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 14,
            background: "#e8a93c",
          }}
        />
      </div>
    ),
    size
  );
}
