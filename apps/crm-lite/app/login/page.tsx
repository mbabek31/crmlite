"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const supabase = getSupabaseBrowserClient();

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/accounts`
      }
    });
  }

  return (
    <main>
      <h1>Sign in</h1>
      <p>Use your Google account to access CRM Lite.</p>
      <button type="button" onClick={signInWithGoogle}>
        Continue with Google
      </button>
    </main>
  );
}
