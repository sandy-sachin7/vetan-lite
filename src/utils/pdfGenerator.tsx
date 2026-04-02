import { renderToBuffer } from "@react-pdf/renderer";
import { PayslipDocument, PayslipData } from "@/components/payroll/PayslipDocument";
import React from "react";

export async function generatePayslipPdfBuffer(data: PayslipData): Promise<Buffer> {
  const buffer = await renderToBuffer(<PayslipDocument data={data} />);
  return buffer;
}
