import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export default async function HomePage() {
  const supabase = getSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main>
        <h1>CRM Lite</h1>
        <p>Please sign in with Google to continue.</p>
        <Link href="/login">Go to login</Link>
      </main>
    );
  }

  return (
    <main>
      <h1>CRM Lite</h1>
      <p>Welcome, {user.email}</p>
      <ul>
        <li>
          <Link href="/accounts">Accounts</Link>
        </li>
        <li>
          <Link href="/admin/users">User Admin</Link>
        </li>
        <li>
          <Link href="/api/export/activities">Export Activities CSV</Link>
        </li>
      </ul>
    </main>
  );
}
