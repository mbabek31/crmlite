import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export function getSupabaseServerClient() {
  return createServerComponentClient({ cookies });
}
