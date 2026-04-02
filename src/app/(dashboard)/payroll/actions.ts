"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { generatePayslipPdfBuffer } from "@/utils/pdfGenerator";
import { sendPayslipEmail } from "@/utils/emailSender";
import { logger, withLogger } from "@/utils/logger";
import { v4 as uuidv4 } from "uuid";

export async function finalizePayrollRun(month: number, year: number, payslips: any[]) {
  const traceId = uuidv4();
  return withLogger(traceId, { action: "finalizePayrollRun", month, year }, async () => {
    logger.info("Initializing payroll finalization...");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      logger.warn("Unauthorized payroll run attempt");
      throw new Error("Unauthorized");
    }

    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("id")
      .eq("owner_id", user.id)
      .single();

    if (companyError || !company) {
      logger.warn("Company not found for user");
      throw new Error("Company profile not found");
    }

    // 1. Check if a payroll run for this month/year already exists to avoid duplicates
    const { data: existingRun } = await supabase
      .from("payroll_runs")
      .select("id")
      .eq("company_id", company.id)
      .eq("month", month)
      .eq("year", year)
      .single();

    if (existingRun) {
      logger.warn({ existingRunId: existingRun.id }, "Duplicate payroll run attempt");
      throw new Error(`A payroll run for ${month}/${year} has already been finalized.`);
    }

    // 1b. Enforce Free Tier Limit (Max 2 runs)
    const { count: runCount, error: countError } = await supabase
      .from("payroll_runs")
      .select("*", { count: "exact", head: true })
      .eq("company_id", company.id);

    if (countError) {
      throw new Error("Failed to verify subscription limits");
    }

    if (runCount !== null && runCount >= 2) {
      logger.warn("Free tier limit reached");
      throw new Error("FREE_TIER_LIMIT_REACHED");
    }

    // 2. Create payroll_run entry
    const { data: run, error: runError } = await supabase
      .from("payroll_runs")
      .insert({
        company_id: company.id,
        month,
        year,
        status: "COMPLETED",
      })
      .select("id")
      .single();

    if (runError || !run) {
      logger.error({ err: runError }, "Error creating payroll run");
      throw new Error("Failed to create payroll run");
    }

    // 3. Prepare payslips for bulk insert
    const payslipsToInsert = payslips.map((p) => ({
      payroll_run_id: run.id,
      employee_id: p.employee_id,
      lop_days: p.lop_days,
      overtime_hours: p.overtime_hours,
      bonus: p.bonus,
      deduction: p.deduction,
      calculated_basic_monthly: p.calculated_basic_monthly,
      calculated_hra_monthly: p.calculated_hra_monthly,
      calculated_special_allowance_monthly: p.calculated_special_allowance_monthly,
      pf_deducted: p.pf_deducted,
      pt_deducted: p.pt_deducted,
      tds_deducted: p.tds_deducted,
      net_pay: p.net_pay,
    }));

    // 4. Bulk insert payslips
    const { error: payslipsError } = await supabase
      .from("payslips")
      .insert(payslipsToInsert)
      .select("*");

    if (payslipsError) {
      logger.error({ err: payslipsError }, "Error inserting payslips");
      throw new Error("Failed to insert payslip records");
    }

    // 5. Fetch company details (for PDF header) and employees (for Name/Email)
    const { data: companyDetails } = await supabase
      .from("companies")
      .select("name")
      .eq("id", company.id)
      .single();

    const { data: employees } = await supabase
      .from("employees")
      .select("id, name, email")
      .eq("company_id", company.id);

    // 6. Generate PDFs and Dispatch Emails via Background Job (Inngest)
    if (employees && companyDetails) {
      // Instead of an ES6 Map object, we construct a plain object so that it's JSON serializable for Inngest
      const employeeMap: Record<string, any> = {};
      employees.forEach((emp) => {
        employeeMap[emp.id] = emp;
      });
      
      logger.info({ count: payslipsToInsert.length }, "Queueing background job for PDF generation");

      // Import inngest client dynamically to avoid cyclical deps or keep it top-level
      const { inngest } = await import("@/inngest/client");
      
      await inngest.send({
        name: "payroll/run.finalized",
        data: {
          month,
          year,
          payslips: payslipsToInsert,
          companyDetails,
          employeeMap,
        },
      });
    }
    
    logger.info("Payroll finalization complete. Job Queued.");

    revalidatePath("/payroll");
    revalidatePath("/dashboard");
    return { success: true, runId: run.id };
  });
}
