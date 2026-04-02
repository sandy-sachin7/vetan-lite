import { inngest } from "./client";
import { logger } from "@/utils/logger";
import { generatePayslipPdfBuffer } from "@/utils/pdfGenerator";
import { sendPayslipEmail } from "@/utils/emailSender";

export const processPayrollRun = inngest.createFunction(
  { id: "process-payroll-run" },
  { event: "payroll/run.finalized" },
  // @ts-ignore - Inngest types can be tricky without generating event maps
  async ({ event, step }: { event: any; step: any }) => {
    const { month, year, payslips, companyDetails, employeeMap } = event.data;

    logger.info({ count: payslips.length, month, year }, "Starting background payroll generation");

    // Process all payslips. In a real environment, you might use step.sendEvent to fan-out
    // to individual PDF generation functions and email sending if scaling enormously.
    // For MVPs transitioning to production, sequential/parallel processing here is significantly
    // better than keeping the HTTP request open.
    const results = await step.run("generate-and-send-payslips", async () => {
      let successCount = 0;
      let errorCount = 0;

      await Promise.allSettled(
        payslips.map(async (p: any) => {
          const emp = employeeMap[p.employee_id];
          if (!emp || !emp.email) return;

          try {
            const pdfBuffer = await generatePayslipPdfBuffer({
              companyName: companyDetails.name,
              month,
              year,
              employeeName: emp.name,
              employeeId: emp.id,
              ...p,
            });

            await sendPayslipEmail(emp.email, emp.name, month, year, pdfBuffer);
            successCount++;
          } catch (err: any) {
            logger.error({ err, employeeEmail: emp.email }, "Background Job: Failed to generate/send payslip");
            errorCount++;
            // Don't throw here to avoid failing the entire batch for one employee error
          }
        })
      );

      return { successCount, errorCount };
    });

    return {
      message: `Processed ${payslips.length} payslips.`,
      ...results,
    };
  }
);
