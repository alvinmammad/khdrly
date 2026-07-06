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
