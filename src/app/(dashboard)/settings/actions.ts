"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { logger, withLogger } from "@/utils/logger";
import { v4 as uuidv4 } from "uuid";

export async function updateCompanySettings(formData: FormData) {
  const traceId = uuidv4();
  return withLogger(traceId, { action: "updateCompanySettings" }, async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Unauthorized" };
    }

    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("id")
      .eq("owner_id", user.id)
      .single();

    if (companyError || !company) {
      return { error: "Company profile not found" };
    }

    const basicPercentage = Number(formData.get("basicPercentage"));
    const hraPercentage = Number(formData.get("hraPercentage"));
    const workingDaysPerMonth = Number(formData.get("workingDaysPerMonth"));
    const pfEnabled = formData.get("pfEnabled") === "true";
    const ptEnabled = formData.get("ptEnabled") === "true";

    if (basicPercentage + hraPercentage > 100) {
      logger.warn({ basicPercentage, hraPercentage }, "Invalid salary percentages");
      return { error: "Basic and HRA percentages cannot exceed 100%" };
    }

    const payrollConfig = {
      basicPercentage,
      hraPercentage,
      workingDaysPerMonth,
      enablePf: pfEnabled,
      enablePt: ptEnabled,
    };

    const { error: updateError } = await supabase
      .from("companies")
      .update({ payroll_config: payrollConfig })
      .eq("id", company.id);

    if (updateError) {
      logger.error({ err: updateError }, "Error updating settings");
      return { error: "Failed to update settings" };
    }
    
    logger.info("Successfully updated company settings");

    revalidatePath("/settings");
    revalidatePath("/payroll");
    return { success: true };
  });
}
