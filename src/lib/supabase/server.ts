import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/*
  Cookie-əsaslı Supabase client — admin panel üçün (sessiya ilə).
  İctimai səhifələrin oxu yolu bundan İSTİFADƏ ETMİR — o, sessiyasız
  client-lə işləyir (bax: ./client.ts). Env boşdursa null qaytarır.
*/

export async function getSupabaseServer(): Promise<SupabaseClient | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component daxilində cookie yazmaq mümkün deyil —
          // sessiya təzələnməsini src/middleware.ts edir.
        }
      },
    },
  });
}

export type SessionUser = {
  id: string;
  email: string | null;
  fullName: string;
  phone: string | null;
  isResident: boolean;
  city: string | null;
  country: string | null;
  isStaff: boolean;
};

/** Daxil olmuş adi istifadəçi + profili (forum, sifariş və s. üçün). */
export async function getSessionUser(): Promise<SessionUser | null> {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, { data: roles }] = await Promise.all([
    sb.from("profiles").select("full_name, phone, is_resident, city, country").eq("id", user.id).maybeSingle(),
    sb.from("user_roles").select("role").eq("user_id", user.id),
  ]);
  const roleList = (roles ?? []).map((r) => r.role as string);

  return {
    id: user.id,
    email: user.email ?? null,
    fullName:
      profile?.full_name ??
      (user.user_metadata?.full_name as string | undefined) ??
      user.email?.split("@")[0] ??
      "Sakin",
    phone: profile?.phone ?? null,
    isResident: profile?.is_resident ?? true,
    city: profile?.city ?? null,
    country: profile?.country ?? null,
    isStaff: roleList.includes("admin") || roleList.includes("moderator"),
  };
}

export type StaffUser = {
  id: string;
  email: string | null;
  roles: string[];
  isStaff: boolean;
};

/** Daxil olmuş istifadəçi + rolları. Giriş yoxdursa null. */
export async function getStaffUser(): Promise<StaffUser | null> {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;

  // RLS: istifadəçi öz rollarını oxuya bilir
  const { data } = await sb.from("user_roles").select("role").eq("user_id", user.id);
  const roles = (data ?? []).map((r) => r.role as string);

  return {
    id: user.id,
    email: user.email ?? null,
    roles,
    isStaff: roles.includes("admin") || roles.includes("moderator"),
  };
}
