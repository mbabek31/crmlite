import { PIPELINE_STAGES } from "@/lib/constants";
import { createAccount } from "@/app/accounts/actions";

export function AccountCreateForm() {
  return (
    <form action={createAccount} style={{ display: "grid", gap: 8, maxWidth: 520 }}>
      <h2>Create account</h2>
      <input name="name" placeholder="Account name" required />
      <input name="vertical" placeholder="Vertical" />
      <textarea name="use_case" placeholder="Use case" rows={3} />
      <select name="pipeline_stage" defaultValue="Lead">
        {PIPELINE_STAGES.map((stage) => (
          <option key={stage} value={stage}>
            {stage}
          </option>
        ))}
      </select>
      <button type="submit">Add account</button>
    </form>
  );
}
