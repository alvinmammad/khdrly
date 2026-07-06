import { VILLAGE_CENTER } from "@/lib/data/mock";

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  humidity: number;
  windKmh: number;
  code: number;
}

export interface DailyForecast {
  date: string;
  code: number;
  tempMax: number;
  tempMin: number;
  precipProb: number;
  windMaxKmh: number;
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast[];
}

// WMO hava kodları → Azərbaycanca izah + ikon
const WEATHER_CODES: Record<number, { label: string; icon: string }> = {
  0: { label: "Aydın", icon: "☀️" },
  1: { label: "Əsasən aydın", icon: "🌤️" },
  2: { label: "Qismən buludlu", icon: "⛅" },
  3: { label: "Buludlu", icon: "☁️" },
  45: { label: "Duman", icon: "🌫️" },
  48: { label: "Qırovlu duman", icon: "🌫️" },
  51: { label: "Yüngül çiskin", icon: "🌦️" },
  53: { label: "Çiskin", icon: "🌦️" },
  55: { label: "Güclü çiskin", icon: "🌧️" },
  61: { label: "Yüngül yağış", icon: "🌦️" },
  63: { label: "Yağış", icon: "🌧️" },
  65: { label: "Güclü yağış", icon: "🌧️" },
  66: { label: "Donan yağış", icon: "🌧️" },
  67: { label: "Güclü donan yağış", icon: "🌧️" },
  71: { label: "Yüngül qar", icon: "🌨️" },
  73: { label: "Qar", icon: "🌨️" },
  75: { label: "Güclü qar", icon: "❄️" },
  77: { label: "Qar dənələri", icon: "❄️" },
  80: { label: "Yüngül leysan", icon: "🌦️" },
  81: { label: "Leysan", icon: "🌧️" },
  82: { label: "Güclü leysan", icon: "⛈️" },
  85: { label: "Qar leysanı", icon: "🌨️" },
  86: { label: "Güclü qar leysanı", icon: "❄️" },
  95: { label: "Tufan", icon: "⛈️" },
  96: { label: "Dolu ilə tufan", icon: "⛈️" },
  99: { label: "Güclü dolu ilə tufan", icon: "⛈️" },
};

export function describeWeather(code: number): { label: string; icon: string } {
  return WEATHER_CODES[code] ?? { label: "Naməlum", icon: "🌡️" };
}

export async function getWeather(): Promise<WeatherData | null> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${VILLAGE_CENTER.lat}&longitude=${VILLAGE_CENTER.lng}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max` +
    `&timezone=Asia/Baku&forecast_days=7`;

  try {
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) return null;
    const j = await res.json();
    const current: CurrentWeather = {
      temp: Math.round(j.current.temperature_2m),
      feelsLike: Math.round(j.current.apparent_temperature),
      humidity: j.current.relative_humidity_2m,
      windKmh: Math.round(j.current.wind_speed_10m),
      code: j.current.weather_code,
    };
    const daily: DailyForecast[] = j.daily.time.map((date: string, i: number) => ({
      date,
      code: j.daily.weather_code[i],
      tempMax: Math.round(j.daily.temperature_2m_max[i]),
      tempMin: Math.round(j.daily.temperature_2m_min[i]),
      precipProb: j.daily.precipitation_probability_max[i] ?? 0,
      windMaxKmh: Math.round(j.daily.wind_speed_10m_max[i]),
    }));
    return { current, daily };
  } catch {
    return null; // offline / API xətası — UI "məlumat yoxdur" göstərir
  }
}

// Fermer üçün sadə qayda-əsaslı tövsiyələr (Mərhələ 3-də genişlənəcək)
export function farmerAdvice(w: WeatherData): string[] {
  const advice: string[] = [];
  const next2 = w.daily.slice(0, 2);
  if (next2.some((d) => d.precipProb >= 60)) {
    advice.push("🌧️ Yaxın 2 gündə yağış ehtimalı yüksəkdir — suvarmanı təxirə salmaq olar.");
  }
  if (next2.some((d) => d.tempMax >= 35)) {
    advice.push("🥵 Güclü isti gözlənilir — suvarmanı səhər tezdən və ya axşam saatlarında aparın.");
  }
  if (next2.some((d) => d.windMaxKmh >= 40)) {
    advice.push("💨 Güclü külək gözlənilir — dərman çiləməsini təxirə salın.");
  }
  if (next2.some((d) => d.tempMin <= 0)) {
    advice.push("🥶 Şaxta ehtimalı var — həssas bitkiləri qoruyun.");
  }
  return advice;
}
