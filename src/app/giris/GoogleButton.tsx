"use client";

import { useState } from "react";
import { getSupabaseBrowserAuth } from "@/lib/supabase/browserAuth";

export default function GoogleButton({ next }: { next: string }) {
  const [busy, setBusy] = useState(false);
  const [xeta, setXeta] = useState(false);

  async function signIn() {
    const sb = getSupabaseBrowserAuth();
    if (!sb) {
      setXeta(true);
      return;
    }
    setBusy(true);
    const { error } = await sb.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setXeta(true);
      setBusy(false);
    }
    // uğurlu halda brauzer Google-a yönlənir
  }

  return (
    <div className="space-y-3">
      {xeta && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          Giriş alınmadı — bir azdan yenidən cəhd edin.
        </p>
      )}
      <button
        type="button"
        onClick={signIn}
        disabled={busy}
        className={`flex min-h-14 w-full items-center justify-center gap-3 rounded-xl border-2 border-line bg-surface text-lg font-bold active:bg-surface-2 ${
          busy ? "opacity-60" : ""
        }`}
      >
        <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden>
          <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.4 17.7 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
          <path fill="#FBBC05" d="M10.4 28.7a14.5 14.5 0 0 1 0-9.4l-7.8-6.1a24 24 0 0 0 0 21.6l7.8-6.1z" />
          <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2.1 1.4-4.7 2.2-7.7 2.2-6.3 0-11.7-3.9-13.6-9.4l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
        </svg>
        {busy ? "Yönləndirilir..." : "Google ilə davam et"}
      </button>
    </div>
  );
}
