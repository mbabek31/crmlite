"use server";

import { revalidatePath } from "next/cache";
import { PIPELINE_STAGES } from "@/lib/constants";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function createAccount(formData: FormData) {
  const supabase = getSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const name = String(formData.get("name") ?? "").trim();
  const vertical = String(formData.get("vertical") ?? "").trim();
  const useCase = String(formData.get("use_case") ?? "").trim();
  const pipelineStage = String(formData.get("pipeline_stage") ?? "Lead");

  if (!name) {
    throw new Error("Account name is required");
  }

  if (!PIPELINE_STAGES.includes(pipelineStage as (typeof PIPELINE_STAGES)[number])) {
    throw new Error("Invalid pipeline stage");
  }

  const { error } = await supabase.from("accounts").insert({
    name,
    vertical: vertical || null,
    use_case: useCase || null,
    pipeline_stage: pipelineStage,
    created_by: user.id
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/accounts");
}

export async function deleteAccount(accountId: string) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("accounts").delete().eq("id", accountId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/accounts");
}
