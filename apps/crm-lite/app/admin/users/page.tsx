import { getSupabaseServerClient } from "@/lib/supabase-server";

export default async function UserAdminPage() {
  const supabase = getSupabaseServerClient();
  const { data: users, error } = await supabase
    .from("users")
    .select("id,email,full_name,role,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <main>
      <h1>User Admin</h1>
      <p>Grant roles in Supabase table editor for MVP (UI management can be added next).</p>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user.id}>
              <td>{user.full_name ?? "—"}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
