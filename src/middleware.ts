import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/*
  Yalnız /admin marşrutlarında işləyir: vaxtı keçmiş auth tokenini
  təzələyib yenilənmiş cookie-ləri həm request-ə, həm response-a yazır.
  İctimai səhifələrə toxunmur (PWA keşləməsinə mane olmasın deyə).
*/

export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let response = NextResponse.next({ request });
  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  await supabase.auth.getUser();
  return response;
}

export const config = {
  // Sessiya işlədən marşrutlar — ictimai statik səhifələrə toxunulmur
  matcher: ["/admin/:path*", "/profil", "/giris", "/auth/:path*", "/forum/:path*"],
};
