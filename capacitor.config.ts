import type { CapacitorConfig } from "@capacitor/cli";

/*
  Capacitor — Google Play / App Store buraxılışı üçün "qabıq" tətbiq.
  Tətbiq canlı saytı yükləyir (server.url): yəni mağaza tətbiqi ilə
  vebsayt həmişə eyni məzmunu göstərir, mağazaya yenidən yükləmə
  yalnız qabığın özü dəyişəndə lazımdır.
  Quraşdırma təlimatı: docs/CAPACITOR.md
*/

const config: CapacitorConfig = {
  appId: "az.xidirli.kend",
  appName: "Xıdırlı",
  // server.url işlədildiyi üçün webDir yalnız formal tələbdir
  webDir: "capacitor-web",
  server: {
    url: "https://xidirli.vercel.app",
    cleartext: false,
  },
  android: {
    backgroundColor: "#faf5ec",
  },
};

export default config;
