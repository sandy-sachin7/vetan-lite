"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { logger, withLogger } from "@/utils/logger";
import { v4 as uuidv4 } from "uuid";

export async function addEmployee(formData: FormData) {
  const traceId = uuidv4();
  return withLogger(traceId, { action: "addEmployee" }, async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("id")
      .eq("owner_id", user.id)
      .single();

    if (companyError || !company) {
      throw new Error("Company profile not found");
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const annual_gross_salary = Number(formData.get("annual_gross_salary"));
    const state = formData.get("state") as string;
    const tax_regime = formData.get("tax_regime") as string;
    const pf_opt_in = formData.get("pf_opt_in") === "on";
    const sec_80c = Number(formData.get("sec_80c") || 0);
    const sec_80d = Number(formData.get("sec_80d") || 0);

    const { error } = await supabase.from("employees").insert({
      company_id: company.id,
      name,
      email,
      annual_gross_salary,
      state,
      tax_regime,
      pf_opt_in,
      sec_80c,
      sec_80d,
    });

    if (error) {
      logger.error({ err: error }, "Error inserting employee");
      throw new Error(error.message);
    }
    
    logger.info({ employeeEmail: email }, "Successfully added employee");

    revalidatePath("/employees");
    revalidatePath("/payroll");
    return { success: true };
  });
}
