import { NextResponse } from "next/server";
import { resend } from "@/utils/resend";

export async function POST(req: Request) {
  try {
    const { employeeEmail, employeeName, month, year, payslipPdfBase64 } = await req.json();

    if (!employeeEmail || !employeeName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Prepare attachment if base64 pdf is provided
    const attachments = payslipPdfBase64
      ? [{ filename: `Payslip_${month}_${year}.pdf`, content: Buffer.from(payslipPdfBase64, 'base64') }]
      : [];

    const { data, error } = await resend.emails.send({
      from: "VetanLite Payroll <payroll@vetanlite.com>",
      to: [employeeEmail],
      subject: `Your Payslip for ${month} ${year}`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <p>Dear ${employeeName},</p>
          <p>Your payslip for the month of <strong>${month} ${year}</strong> has been generated and is attached to this email.</p>
          <p>If you have any questions regarding your tax deductions or salary breakdown, please contact your HR or Admin.</p>
          <br/>
          <p>Best regards,</p>
          <p><strong>VetanLite Automated Payroll</strong></p>
        </div>
      `,
      attachments,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ message: "Payslip sent successfully", data });
  } catch (error) {
    console.error("Email sending failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
