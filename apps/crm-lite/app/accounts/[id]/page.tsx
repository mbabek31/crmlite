import { PIPELINE_STAGES } from "@/lib/constants";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { createActivity, deleteActivity, updatePipeline } from "./actions";

export default async function AccountDetailPage({ params }: { params: { id: string } }) {
  const supabase = getSupabaseServerClient();

  const [{ data: account, error: accountError }, { data: activities, error: activitiesError }] =
    await Promise.all([
      supabase.from("accounts").select("*").eq("id", params.id).single(),
      supabase
        .from("activities")
        .select("*")
        .eq("account_id", params.id)
        .order("activity_date", { ascending: false })
    ]);

  if (accountError) {
    throw new Error(accountError.message);
  }

  if (activitiesError) {
    throw new Error(activitiesError.message);
  }

  return (
    <main style={{ display: "grid", gap: 20 }}>
      <section>
        <h1>{account.name}</h1>
        <p>
          <strong>Vertical:</strong> {account.vertical ?? "—"}
        </p>
        <p>
          <strong>Use Case:</strong> {account.use_case ?? "—"}
        </p>
      </section>

      <section>
        <h2>Pipeline Stage</h2>
        <form
          action={async (formData) => {
            "use server";
            await updatePipeline(params.id, formData);
          }}
        >
          <select name="pipeline_stage" defaultValue={account.pipeline_stage}>
            {PIPELINE_STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
          <button type="submit">Update stage</button>
        </form>
      </section>

      <section>
        <h2>Add Activity</h2>
        <form
          action={async (formData) => {
            "use server";
            await createActivity(params.id, formData);
          }}
          style={{ display: "grid", gap: 8, maxWidth: 520 }}
        >
          <select name="type" defaultValue="call">
            <option value="call">Call</option>
            <option value="meeting">Meeting</option>
          </select>
          <input name="activity_date" type="date" required />
          <textarea name="notes" placeholder="Activity notes" rows={4} required />
          <button type="submit">Add activity</button>
        </form>
      </section>

      <section>
        <h2>Activity timeline</h2>
        <ul>
          {activities?.map((activity) => (
            <li key={activity.id} style={{ marginBottom: 12 }}>
              <strong>{activity.type.toUpperCase()}</strong> ({activity.activity_date})
              <div>{activity.notes}</div>
              <form
                action={async () => {
                  "use server";
                  await deleteActivity(params.id, activity.id);
                }}
              >
                <button type="submit">Delete activity</button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
