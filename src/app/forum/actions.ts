"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionUser, getSupabaseServer } from "@/lib/supabase/server";

async function requireUser() {
  const sb = await getSupabaseServer();
  const user = sb ? await getSessionUser() : null;
  if (!sb || !user) redirect("/giris?next=/forum");
  return { sb, user };
}

export async function createTopic(formData: FormData) {
  const { sb, user } = await requireUser();

  const title = String(formData.get("title") ?? "").trim().slice(0, 150);
  const body = String(formData.get("body") ?? "").trim().slice(0, 3000);
  if (title.length < 3 || body.length < 3) redirect("/forum/yeni?xeta=bos");

  const { data, error } = await sb
    .from("forum_topics")
    .insert({
      title,
      body,
      author_id: user.id,
      author_name: user.fullName,
    })
    .select("id")
    .single();
  if (error || !data) redirect("/forum/yeni?xeta=db");

  revalidatePath("/forum");
  redirect(`/forum/${data.id}`);
}

export async function createReply(formData: FormData) {
  const { sb, user } = await requireUser();

  const topicId = String(formData.get("topic_id") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim().slice(0, 2000);
  if (!topicId) redirect("/forum");
  if (body.length < 2) redirect(`/forum/${topicId}?xeta=bos`);

  const { error } = await sb.from("forum_posts").insert({
    topic_id: topicId,
    body,
    author_id: user.id,
    author_name: user.fullName,
  });
  if (error) redirect(`/forum/${topicId}?xeta=db`);

  revalidatePath(`/forum/${topicId}`);
  revalidatePath("/forum");
  redirect(`/forum/${topicId}`);
}

/** Öz yazısını hər kəs, istənilən yazını staff silə bilər (RLS qoruyur). */
export async function deleteTopic(formData: FormData) {
  const { sb } = await requireUser();
  const id = String(formData.get("id") ?? "").trim();
  if (id) await sb.from("forum_topics").delete().eq("id", id);
  revalidatePath("/forum");
  redirect("/forum");
}

export async function deleteReply(formData: FormData) {
  const { sb } = await requireUser();
  const id = String(formData.get("id") ?? "").trim();
  const topicId = String(formData.get("topic_id") ?? "").trim();
  if (id) await sb.from("forum_posts").delete().eq("id", id);
  revalidatePath(`/forum/${topicId}`);
  redirect(topicId ? `/forum/${topicId}` : "/forum");
}
