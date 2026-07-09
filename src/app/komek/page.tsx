import type { Metadata } from "next";
import Link from "next/link";
import TtsButton from "@/components/ui/TtsButton";

export const metadata: Metadata = { title: "Kömək və təlimat" };

/*
  Sakinlər üçün təlimat — sadə dil, böyük yazı, addım-addım.
  Hər mövzu açılan qutudadır (details) ki, səhifə uzun görünməsin.
*/

const GIRIS_METNI =
  "Bu sayt Xıdırlı kəndinin rəqəmsal evidir. Burada kəndin xəbərlərini oxuya, havaya baxa, növbətçi həkimi tapa, bazardan məhsul sifariş edə, kəndin tarixini öyrənə bilərsiniz. Saytı oxumaq üçün heç bir qeydiyyat lazım deyil.";

type Movzu = { icon: string; basliq: string; metn: string[] };

const MOVZULAR: Movzu[] = [
  {
    icon: "📱",
    basliq: "Saytı telefona tətbiq kimi necə qurum?",
    metn: [
      "1. Telefonda brauzerdə (Chrome və ya Safari) xidirli.vercel.app ünvanını açın.",
      "2. Brauzerin menyusuna basın (üç nöqtə və ya paylaşma işarəsi).",
      "3. «Ana ekrana əlavə et» seçin.",
      "4. Bundan sonra sayt telefonunuzda adi tətbiq kimi olacaq — bir toxunuşla açılır, xəritə internetsiz də işləyir.",
    ],
  },
  {
    icon: "🔔",
    basliq: "Bildirişləri necə açım?",
    metn: [
      "Vacib xəbərlər, işıq-su kəsintiləri və anım günləri barədə telefonunuza xəbər gəlsin deyə:",
      "1. Aşağıda «Parametrlər» bölməsinə girin.",
      "2. «Bildirişlər» yazısının yanındakı açarı yandırın.",
      "3. Telefon icazə soruşsa, «İcazə ver» deyin.",
      "Qeyd: bunun üçün saytın telefona tətbiq kimi qurulması lazımdır (yuxarıdakı bənd).",
    ],
  },
  {
    icon: "🆘",
    basliq: "Təcili yardım nömrələri haradadır?",
    metn: [
      "Hər səhifənin sağ aşağı küncündə qırmızı SOS düyməsi var — basın, bütün təcili nömrələr çıxacaq: 103 təcili yardım, 101 yanğın, 102 polis, 112 FHN.",
      "Nömrənin üstünə bir dəfə basmaq kifayətdir — telefon özü yığacaq.",
    ],
  },
  {
    icon: "🏥",
    basliq: "Növbətçi həkim və aptek",
    metn: [
      "«Növbətçi» bölməsində bu həftənin növbətçi feldşeri, ən yaxın açıq aptek və planlı işıq-su kəsintiləri göstərilir.",
      "«Zəng et» düyməsinə basın — telefon özü yığacaq.",
    ],
  },
  {
    icon: "🛒",
    basliq: "Bazardan necə alış-veriş edim?",
    metn: [
      "«Bazar» bölməsində kəndin təsərrüfatlarının məhsulları var: qaymaq, süd məhsulları, tərəvəz və s.",
      "Ən asan yol: məhsulun yanındakı «📞 Zəng et» düyməsinə basın və istehsalçı ilə danışın.",
      "İnternetlə sifariş istəsəniz: məhsulu açın → «Onlayn sifariş ver» → nə qədər istədiyinizi və telefonunuzu yazın → «Sifarişi göndər». Sizinlə əlaqə saxlanılacaq. Sifarişin gedişatını «Profilim → Sifarişlərim»dən izləyin.",
      "Ödəniş yoxdur — məhsulu alanda hesablaşırsınız.",
    ],
  },
  {
    icon: "🛠️",
    basliq: "Kənddə problemi necə bildirim?",
    metn: [
      "Küçə lampası yanmır? Yolda çuxur var? Su sızır?",
      "1. «Problemi bildir» bölməsinə girin → «+ Bildir» düyməsi.",
      "2. Problemi yazın, yerini göstərin, mümkünsə şəkil çəkin.",
      "3. Göndərin — icra nümayəndəliyi görəcək və baxacaq.",
      "Probleminizin vəziyyətini («Baxılır», «Həll olunur», «Həll olundu») hamı kimi siz də siyahıda izləyə bilərsiniz.",
    ],
  },
  {
    icon: "👤",
    basliq: "Giriş nə üçün lazımdır?",
    metn: [
      "Saytı OXUMAQ üçün giriş lazım DEYİL — hər şey açıqdır.",
      "Giriş yalnız nəsə YAZMAQ üçündür: sifariş vermək, problem bildirmək, forumda yazmaq, sorğuda səs vermək.",
      "Giriş çox asandır: «Daxil ol» → «Google ilə davam et» → telefonunuzdakı Google hesabınızı seçin. Şifrə yadda saxlamaq lazım deyil.",
    ],
  },
  {
    icon: "📰",
    basliq: "Xəbərləri səsli necə dinləyim?",
    metn: [
      "Gözünüz yorulursa və ya oxumaq çətindirsə: bəzi səhifələrdə «🔊 Səsli dinlə» düyməsi var — basın, telefon mətni sizə oxuyacaq.",
    ],
  },
  {
    icon: "🔠",
    basliq: "Yazılar xırdadır — necə böyüdüm?",
    metn: [
      "«Parametrlər» bölməsində «Yazı ölçüsü»ndən «Böyük» və ya «Ən böyük» seçin.",
      "Orada həmçinin: tünd rejim (gecə üçün), «Asan oxu» (daha aydın yazılar) və «Sadə görünüş» (yalnız əsas düymələr) var.",
      "İnternetiniz zəifdirsə «Az-data rejimi»ni yandırın — şəkillər yalnız siz istəyəndə yüklənəcək.",
    ],
  },
  {
    icon: "🖼️",
    basliq: "Köhnə şəkillərimi kəndin arxivinə necə verim?",
    metn: [
      "Evinizdə köhnə kənd şəkilləri varsa, onlar kəndin yaddaşıdır!",
      "1. «Media arxivi» bölməsində «Siz də paylaşın» düyməsinə basın.",
      "2. Şəkli seçin, nə olduğunu və təxmini ilini yazın.",
      "3. Göndərin — yoxlanılandan sonra arxivdə dərc olunacaq.",
      "Bu, girişsiz də mümkündür. Cavanlardan kömək istəyə bilərsiniz.",
    ],
  },
  {
    icon: "💭",
    basliq: "Xatirə xəritəsi nədir?",
    metn: [
      "Köhnə kəndi birlikdə xəritəyə qaytarırıq: hansı evdə kim yaşayırdı, dəyirman harada idi, bulaq harada idi.",
      "«Kəndimiz → Xatirə xəritəsi»ndə xəritədəki 💭 işarələrə basın — xatirələri oxuyun.",
      "Öz xatirənizi əlavə etmək üçün: daxil olun → «Xatirə əlavə et» → xəritədə yerə toxunun → xatirəni yazın.",
    ],
  },
  {
    icon: "🕯️",
    basliq: "Şəhidlər bölməsi",
    metn: [
      "Şəhidlərimizin xatirə səhifələridir. Hər profildə «Xatirə şamı yandır» düyməsi var — ehtiramınızı bildirə bilərsiniz.",
      "Şəhid haqqında məlumat yalnız ailənin razılığı ilə dərc olunur. Ailə nümayəndələri kənd icra nümayəndəliyinə müraciət edə bilər.",
    ],
  },
  {
    icon: "💬",
    basliq: "Forum və sorğular",
    metn: [
      "«Forum»da kəndlə bağlı istənilən mövzunu açıb müzakirə edə bilərsiniz (giriş lazımdır).",
      "«Sorğular»da kəndin qərarlarına səs verirsiniz — məsələn, meydana nə əkilsin. Bir nəfər bir səs; nəticə hamıya açıqdır.",
      "Tədbirlər səhifəsində «Gələcəm» düyməsinə basıb iştirakınızı bildirin — təşkilatçılar neçə nəfər gələcəyini bilsin.",
    ],
  },
  {
    icon: "🏘️",
    basliq: "Digər faydalı bölmələr",
    metn: [
      "🔧 Xidmətlər — usta, bərbər, taksi telefonları.",
      "🚌 Nəqliyyat — kənddən gediş-gəliş cədvəli.",
      "📢 Elanlar — satış elanları, itmiş-tapılmış.",
      "🌾 Təsərrüfat təqvimi — bu ay bağ-bostanda nə edilməli.",
      "🤝 İanələr — kənd üçün toplanan vəsaitin açıq siyahısı.",
      "🏡 Turizm — qonaq evləri (qohum-tanış gələndə).",
      "📖 Qonaq kitabı — kəndə gələnlərin təəssüratları.",
      "🧒 Uşaqlar üçün — kəndin tarixi sadə dildə + oyun.",
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="space-y-5">
      <header className="text-center">
        <p className="text-4xl" aria-hidden>🤝</p>
        <h1 className="mt-2 font-heading text-2xl font-bold">
          Sayt haqqında və təlimat
        </h1>
      </header>

      <TtsButton text={GIRIS_METNI} />

      <p className="rounded-2xl border border-line bg-surface p-5 text-lg leading-relaxed">
        {GIRIS_METNI}
      </p>

      <div className="space-y-3">
        {MOVZULAR.map((m) => (
          <details
            key={m.basliq}
            className="rounded-2xl border border-line bg-surface p-4"
          >
            <summary className="flex min-h-11 cursor-pointer items-center gap-3 text-lg font-bold">
              <span className="text-2xl" aria-hidden>{m.icon}</span>
              {m.basliq}
            </summary>
            <div className="mt-2 space-y-2 border-t border-line pt-3">
              {m.metn.map((p) => (
                <p key={p} className="leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </details>
        ))}
      </div>

      <div className="rounded-2xl border-2 border-gunebaxan bg-gunebaxan/10 p-5 text-center">
        <p className="font-bold">Sualınız qaldı?</p>
        <p className="mt-1 text-ink-soft">
          Kənd icra nümayəndəliyinə müraciət edin — və ya cavanlardan soruşun,
          bir dəfə göstərsinlər, sonrası asandır. 😊
        </p>
      </div>

      <p className="text-center">
        <Link
          href="/bolmeler"
          className="inline-flex min-h-12 items-center rounded-xl bg-kerpic px-6 font-bold text-white active:bg-kerpic-strong"
        >
          Bütün bölmələrə bax →
        </Link>
      </p>
    </div>
  );
}
