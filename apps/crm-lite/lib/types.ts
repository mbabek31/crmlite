export type Role = "viewer" | "editor" | "admin";

export type Account = {
  id: string;
  name: string;
  vertical: string | null;
  use_case: string | null;
  pipeline_stage: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type Activity = {
  id: string;
  account_id: string;
  type: "call" | "meeting";
  notes: string;
  activity_date: string;
  created_by: string;
  created_at: string;
};
