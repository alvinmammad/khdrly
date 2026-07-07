"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getStaffUser, getSupabaseServer } from "@/lib/supabase/server";

const ERAS = ["isgal", "azadliq", "berpa"];

async function requireStaff() {
  const sb = await getSupabaseServer();
  const staff = sb ? await getStaffUser() : null;
  if (!sb || !staff?.isStaff) redirect("/admin/login");
  return { sb, staff };
}

function revalidateTimeline() {
  revalidatePath("/haqqinda/azadliq");
  revalidatePath("/haqqinda/isgal-dovru");
}

export async function saveTimelineEntry(formData: FormData) {
  const { sb, staff } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  const era = String(formData.get("era") ?? "");
  const eventDate = String(formData.get("event_date") ?? "").trim();
  const dateDisplay = String(formData.get("date_display") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const sources = String(formData.get("sources") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const status = formData.get("status") === "approved" ? "approved" : "draft";

  const formPath = id ? `/admin/tarix/${id}` : "/admin/tarix/yeni";
  if (!title || !body || !eventDate || !ERAS.includes(era))
    redirect(`${formPath}?xeta=bos`);
  // Məhsul qaydası: işğal dövrü faktı mənbəsiz dərc oluna bilməz
  if (era === "isgal" && status === "approved" && sources.length === 0)
    redirect(`${formPath}?xeta=menbe`);

  const row: Record<string, unknown> = {
    era,
    event_date: eventDate,
    date_display: dateDisplay || null,
    title,
    body,
    sources,
    status,
  };

  if (id) {
    const { error } = await sb.from("timeline_entries").update(row).eq("id", id);
    if (error) redirect(`${formPath}?xeta=db`);
  } else {
    row.created_by = staff.id;
    const { error } = await sb.from("timeline_entries").insert(row);
    if (error) redirect(`${formPath}?xeta=db`);
  }

  revalidateTimeline();
  redirect("/admin/tarix");
}

export async function deleteTimelineEntry(formData: FormData) {
  const { sb } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/tarix");

  const { error } = await sb.from("timeline_entries").delete().eq("id", id);
  if (error) redirect(`/admin/tarix/${id}?xeta=db`);

  revalidateTimeline();
  redirect("/admin/tarix");
}
