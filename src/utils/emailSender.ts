import { Resend } from "resend";
import { logger } from "@/utils/logger";

let resend: Resend | null = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

export async function sendPayslipEmail(
  toEmail: string,
  employeeName: string,
  month: number,
  year: number,
  pdfBuffer: Buffer
) {
  if (!resend) {
    logger.warn({ toEmail }, "RESEND_API_KEY not found. Skipping email sending.");
    return;
  }

  const result = await resend.emails.send({
    from: "VetanLite <onboarding@resend.dev>", // Required for Resend dev sandbox
    to: [toEmail],
    subject: `Your Payslip for ${month}/${year}`,
    html: `<p>Hi ${employeeName},</p><p>Please find attached your payslip for the month of ${month}/${year}.</p><p>Best,<br/>VetanLite Team</p>`,
    attachments: [
      {
        filename: `Payslip_${month}_${year}.pdf`,
        content: pdfBuffer,
      },
    ],
  });

  if (result.error) {
    logger.error({ err: result.error }, "Resend error");
    throw new Error(result.error.message);
  }

  return result;
}
