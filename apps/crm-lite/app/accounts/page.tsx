import Link from "next/link";
import { AccountCreateForm } from "@/components/account-create-form";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { deleteAccount } from "./actions";

type SearchParams = {
  q?: string;
};

export default async function AccountsPage({ searchParams }: { searchParams: SearchParams }) {
  const supabase = getSupabaseServerClient();
  const q = searchParams.q?.trim() ?? "";

  let query = supabase.from("accounts").select("*").order("updated_at", { ascending: false });

  if (q) {
    query = query.or(`name.ilike.%${q}%,vertical.ilike.%${q}%,use_case.ilike.%${q}%`);
  }

  const { data: accounts, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (
    <main style={{ display: "grid", gap: 20 }}>
      <h1>Accounts</h1>

      <form method="get">
        <input name="q" defaultValue={q} placeholder="Search by name, vertical, or use case" />
        <button type="submit">Search</button>
      </form>

      <AccountCreateForm />

      <section>
        <h2>Results</h2>
        <ul>
          {accounts?.map((account) => (
            <li key={account.id} style={{ marginBottom: 12 }}>
              <Link href={`/accounts/${account.id}`}>{account.name}</Link> — {account.pipeline_stage}
              <form
                action={async () => {
                  "use server";
                  await deleteAccount(account.id);
                }}
                style={{ display: "inline", marginLeft: 8 }}
              >
                <button type="submit">Delete</button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
