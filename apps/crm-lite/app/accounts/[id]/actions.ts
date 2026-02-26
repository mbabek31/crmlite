"use server";

import { revalidatePath } from "next/cache";
import { PIPELINE_STAGES } from "@/lib/constants";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function updatePipeline(accountId: string, formData: FormData) {
  const pipelineStage = String(formData.get("pipeline_stage") ?? "");

  if (!PIPELINE_STAGES.includes(pipelineStage as (typeof PIPELINE_STAGES)[number])) {
    throw new Error("Invalid pipeline stage");
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("accounts")
    .update({ pipeline_stage: pipelineStage })
    .eq("id", accountId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/accounts/${accountId}`);
  revalidatePath("/accounts");
}

export async function createActivity(accountId: string, formData: FormData) {
  const supabase = getSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const type = String(formData.get("type") ?? "call");
  const notes = String(formData.get("notes") ?? "").trim();
  const activityDate = String(formData.get("activity_date") ?? "");

  if (!(type === "call" || type === "meeting")) {
    throw new Error("Invalid activity type");
  }

  if (!notes || !activityDate) {
    throw new Error("Notes and date are required");
  }

  const { error } = await supabase.from("activities").insert({
    account_id: accountId,
    type,
    notes,
    activity_date: activityDate,
    created_by: user.id
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/accounts/${accountId}`);
}

export async function deleteActivity(accountId: string, activityId: string) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("activities").delete().eq("id", activityId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/accounts/${accountId}`);
}
