import Link from "next/link";
import { redirect } from "next/navigation";
import { getStaffUser, getSupabaseServer } from "@/lib/supabase/server";
import { logout } from "../actions";

/*
  Qorunan admin qabığı: sessiya yoxdursa girişə yönləndirir,
  staff (admin/moderator) rolu yoxdursa məzmunu göstərmir.
  RLS onsuz da yazmağa icazə verməzdi — bu, ikinci sədd yox,
  sadəcə anlaşılan interfeysdir.
*/

const NAV = [
  { href: "/admin", label: "Panel" },
  { href: "/admin/xeberler", label: "Xəbərlər" },
  { href: "/admin/tedbirler", label: "Tədbirlər" },
  { href: "/admin/novbetci", label: "Növbətçi" },
  { href: "/admin/yerler", label: "Xəritə" },
  { href: "/admin/sehidler", label: "Şəhidlər" },
  { href: "/admin/bildirisler", label: "Bildirişlər" },
];

export default async function AdminPanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const sb = await getSupabaseServer();
  if (!sb) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6 text-center">
        <p className="font-bold">Supabase qoşulmayıb</p>
        <p className="mt-2 text-ink-soft">
          İdarəetmə paneli üçün <code>.env.local</code> faylında Supabase
          dəyişənləri olmalıdır. Nümunə data (mock) rejimində panel işləmir.
        </p>
      </div>
    );
  }

  const staff = await getStaffUser();
  if (!staff) redirect("/admin/login");

  if (!staff.isStaff) {
    return (
      <div className="space-y-4 rounded-2xl border border-line bg-surface p-6 text-center">
        <p className="font-bold">İcazə yoxdur</p>
        <p className="text-ink-soft">
          Hesabınız ({staff.email}) idarəetmə hüququna malik deyil. Kənd icra
          nümayəndəliyinə müraciət edin.
        </p>
        <form action={logout}>
          <button className="min-h-12 rounded-xl border border-line bg-surface-2 px-5 font-bold">
            Çıxış
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-3">
        <nav className="flex flex-wrap gap-2" aria-label="İdarəetmə">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-11 items-center rounded-xl bg-surface-2 px-4 font-bold"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logout} className="flex items-center gap-2">
          <span className="text-sm text-ink-soft">{staff.email}</span>
          <button className="flex min-h-11 items-center rounded-xl border border-line px-4 font-medium">
            Çıxış
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}
