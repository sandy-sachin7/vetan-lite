import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { PayslipPDF, PayslipData } from "@/components/payslip/PayslipPDF";

export async function POST(req: Request) {
  try {
    const data: PayslipData = await req.json();

    if (!data || !data.employeeName || !data.earnings || !data.deductions) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // @react-pdf/renderer returns a Node.js Readable stream
    const pdfStream = await renderToStream(<PayslipPDF data={data} />);

    return new Response(pdfStream as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Payslip_${data.employeeName}_${data.month}_${data.year}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF payslip" },
      { status: 500 }
    );
  }
}
