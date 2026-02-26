import { getSupabaseServerClient } from "@/lib/supabase-server";

function csvEscape(value: string | null | undefined): string {
  const raw = value ?? "";
  if (raw.includes(",") || raw.includes("\n") || raw.includes('"')) {
    return `"${raw.replaceAll('"', '""')}"`;
  }
  return raw;
}

export async function GET() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("activities")
    .select("id,account_id,type,notes,activity_date,created_at,accounts(name)")
    .order("activity_date", { ascending: false });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  const headers = [
    "activity_id",
    "account_id",
    "account_name",
    "type",
    "activity_date",
    "notes",
    "created_at"
  ];

  const lines = data.map((row: any) =>
    [
      csvEscape(row.id),
      csvEscape(row.account_id),
      csvEscape(row.accounts?.name),
      csvEscape(row.type),
      csvEscape(row.activity_date),
      csvEscape(row.notes),
      csvEscape(row.created_at)
    ].join(",")
  );

  const csv = [headers.join(","), ...lines].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="crm-activities.csv"'
    }
  });
}
