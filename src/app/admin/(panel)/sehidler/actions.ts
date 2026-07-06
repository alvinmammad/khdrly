"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getStaffUser, getSupabaseServer } from "@/lib/supabase/server";

/*
  Şəhidlər — həssas bölmə. Qaydalar (məhsul qaydaları + DB constraint):
  - Yalnız admin rolu yaza bilər (RLS "martyrs admin write" də bunu tələb edir).
  - Dərc (status='approved') yalnız İKİQAT təsdiqlə: ailə razılığı + admin
    təsdiqi — DB-dəki dual_approval CHECK bunu ikinci səddlə qoruyur.
  - Dərc üçün ən azı bir rəsmi mənbə istinadı məcburidir.
*/

async function requireAdmin() {
  const sb = await getSupabaseServer();
  const staff = sb ? await getStaffUser() : null;
  if (!sb || !staff?.isStaff) redirect("/admin/login");
  if (!staff.roles.includes("admin")) redirect("/admin?xeta=yalniz-admin");
  return { sb, staff };
}

function revalidateMartyrs(id?: string) {
  revalidatePath("/sehidler");
  if (id) revalidatePath(`/sehidler/${id}`);
}

/** Sətir-sətir mətn sahəsini massivə çevirir (boş sətirlər atılır). */
function toLines(value: string): string[] {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function saveMartyr(formData: FormData) {
  const { sb } = await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const birthDate = String(formData.get("birth_date") ?? "").trim();
  const deathDate = String(formData.get("death_date") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const militaryUnit = String(formData.get("military_unit") ?? "").trim();
  const awards = toLines(String(formData.get("awards") ?? ""));
  const sources = toLines(String(formData.get("sources") ?? ""));
  const photoUrl = String(formData.get("photo_url") ?? "").trim();
  const anniversaryNotify = formData.get("anniversary_notify") === "on";

  const formPath = id ? `/admin/sehidler/${id}` : "/admin/sehidler/yeni";
  if (!fullName) redirect(`${formPath}?xeta=bos`);

  const row: Record<string, unknown> = {
    full_name: fullName,
    birth_date: birthDate || null,
    death_date: deathDate || null,
    bio: bio || null,
    military_unit: militaryUnit || null,
    awards: awards.length ? awards : null,
    sources,
    photo_url: photoUrl || null,
    anniversary_notify: anniversaryNotify,
  };

  if (id) {
    const { error } = await sb.from("martyrs").update(row).eq("id", id);
    if (error) redirect(`${formPath}?xeta=db`);
    revalidateMartyrs(id);
    redirect(`/admin/sehidler/${id}`);
  } else {
    const { data, error } = await sb
      .from("martyrs")
      .insert(row)
      .select("id")
      .single();
    if (error || !data) redirect(`${formPath}?xeta=db`);
    revalidateMartyrs();
    redirect(`/admin/sehidler/${data.id}`);
  }
}

/** Ailənin razılığını qeydə alır (razılıq şəxsən/rəsmi qaydada alınmış olmalıdır). */
export async function approveFamily(formData: FormData) {
  const { sb, staff } = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/sehidler");

  const { error } = await sb
    .from("martyrs")
    .update({ family_rep_approved_by: staff.id, family_rep_approved_at: new Date().toISOString() })
    .eq("id", id);
  if (error) redirect(`/admin/sehidler/${id}?xeta=db`);
  redirect(`/admin/sehidler/${id}`);
}

export async function approveAsAdmin(formData: FormData) {
  const { sb, staff } = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/sehidler");

  const { error } = await sb
    .from("martyrs")
    .update({ admin_approved_by: staff.id, admin_approved_at: new Date().toISOString() })
    .eq("id", id);
  if (error) redirect(`/admin/sehidler/${id}?xeta=db`);
  redirect(`/admin/sehidler/${id}`);
}

/** Təsdiqləri geri götürür — profil dərcdədirsə əvvəlcə qaralamaya salır. */
export async function revokeApprovals(formData: FormData) {
  const { sb } = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/sehidler");

  const { error } = await sb
    .from("martyrs")
    .update({
      status: "draft",
      family_rep_approved_by: null,
      family_rep_approved_at: null,
      admin_approved_by: null,
      admin_approved_at: null,
    })
    .eq("id", id);
  if (error) redirect(`/admin/sehidler/${id}?xeta=db`);
  revalidateMartyrs(id);
  redirect(`/admin/sehidler/${id}`);
}

export async function publishMartyr(formData: FormData) {
  const { sb } = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/sehidler");

  // Server tərəfdə şərtlər yenidən yoxlanılır — düymə görünsə belə
  const { data } = await sb
    .from("martyrs")
    .select("family_rep_approved_at, admin_approved_at, sources")
    .eq("id", id)
    .maybeSingle();
  if (!data) redirect("/admin/sehidler");

  if (!data.family_rep_approved_at || !data.admin_approved_at)
    redirect(`/admin/sehidler/${id}?xeta=tesdiq`);
  if (!data.sources || data.sources.length === 0)
    redirect(`/admin/sehidler/${id}?xeta=menbe`);

  const { error } = await sb.from("martyrs").update({ status: "approved" }).eq("id", id);
  if (error) redirect(`/admin/sehidler/${id}?xeta=db`);

  revalidateMartyrs(id);
  redirect(`/admin/sehidler/${id}`);
}

export async function unpublishMartyr(formData: FormData) {
  const { sb } = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/sehidler");

  const { error } = await sb.from("martyrs").update({ status: "draft" }).eq("id", id);
  if (error) redirect(`/admin/sehidler/${id}?xeta=db`);

  revalidateMartyrs(id);
  redirect(`/admin/sehidler/${id}`);
}

export async function deleteMartyr(formData: FormData) {
  const { sb } = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/sehidler");

  const { error } = await sb.from("martyrs").delete().eq("id", id);
  if (error) redirect(`/admin/sehidler/${id}?xeta=db`);

  revalidateMartyrs(id);
  redirect("/admin/sehidler");
}
