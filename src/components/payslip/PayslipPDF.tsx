import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

export interface PayslipData {
  companyName: string;
  employeeName: string;
  month: string;
  year: number;
  earnings: {
    basic: number;
    hra: number;
    specialAllowance: number;
    bonus: number;
    overtime: number;
  };
  deductions: {
    pf: number;
    pt: number;
    tds: number;
    lop: number;
    other: number;
  };
  netPay: number;
}

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica" },
  header: { textAlign: "center", marginBottom: 20 },
  companyName: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  payslipTitle: { fontSize: 14, color: "#555" },
  empDetails: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: "#ccc", paddingBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  table: { flexDirection: "row", borderWidth: 1, borderColor: "#ccc" },
  colHalf: { width: "50%", padding: 10 },
  borderRight: { borderRightWidth: 1, borderRightColor: "#ccc" },
  sectionTitle: { fontSize: 12, fontWeight: "bold", marginBottom: 10, textDecoration: "underline" },
  itemRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10, borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 5, fontWeight: "bold" },
  netPayBox: { marginTop: 20, padding: 10, backgroundColor: "#f4f4f5", textAlign: "center" },
  netPayText: { fontSize: 14, fontWeight: "bold" },
});

export const PayslipPDF = ({ data }: { data: PayslipData }) => {
  const totalEarnings =
    data.earnings.basic +
    data.earnings.hra +
    data.earnings.specialAllowance +
    data.earnings.bonus +
    data.earnings.overtime;

  const totalDeductions =
    data.deductions.pf +
    data.deductions.pt +
    data.deductions.tds +
    data.deductions.lop +
    data.deductions.other;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>{data.companyName}</Text>
          <Text style={styles.payslipTitle}>
            Payslip for the month of {data.month} {data.year}
          </Text>
        </View>

        <View style={styles.empDetails}>
          <View style={styles.row}>
            <Text>Employee Name: {data.employeeName}</Text>
          </View>
        </View>

        <View style={styles.table}>
          {/* EARNINGS COLUMN */}
          <View style={[styles.colHalf, styles.borderRight]}>
            <Text style={styles.sectionTitle}>Earnings</Text>
            <View style={styles.itemRow}>
              <Text>Basic Salary</Text>
              <Text>₹ {Math.round(data.earnings.basic).toLocaleString()}</Text>
            </View>
            <View style={styles.itemRow}>
              <Text>HRA</Text>
              <Text>₹ {Math.round(data.earnings.hra).toLocaleString()}</Text>
            </View>
            <View style={styles.itemRow}>
              <Text>Special Allowance</Text>
              <Text>₹ {Math.round(data.earnings.specialAllowance).toLocaleString()}</Text>
            </View>
            <View style={styles.itemRow}>
              <Text>Bonus</Text>
              <Text>₹ {Math.round(data.earnings.bonus).toLocaleString()}</Text>
            </View>
            <View style={styles.itemRow}>
              <Text>Overtime</Text>
              <Text>₹ {Math.round(data.earnings.overtime).toLocaleString()}</Text>
            </View>

            <View style={styles.totalRow}>
              <Text>Total Earnings</Text>
              <Text>₹ {Math.round(totalEarnings).toLocaleString()}</Text>
            </View>
          </View>

          {/* DEDUCTIONS COLUMN */}
          <View style={styles.colHalf}>
            <Text style={styles.sectionTitle}>Deductions</Text>
            <View style={styles.itemRow}>
              <Text>Provident Fund (PF)</Text>
              <Text>₹ {Math.round(data.deductions.pf).toLocaleString()}</Text>
            </View>
            <View style={styles.itemRow}>
              <Text>Professional Tax (PT)</Text>
              <Text>₹ {Math.round(data.deductions.pt).toLocaleString()}</Text>
            </View>
            <View style={styles.itemRow}>
              <Text>Income Tax (TDS)</Text>
              <Text>₹ {Math.round(data.deductions.tds).toLocaleString()}</Text>
            </View>
            <View style={styles.itemRow}>
              <Text>Loss of Pay (LOP)</Text>
              <Text>₹ {Math.round(data.deductions.lop).toLocaleString()}</Text>
            </View>
            <View style={styles.itemRow}>
              <Text>Other Deductions</Text>
              <Text>₹ {Math.round(data.deductions.other).toLocaleString()}</Text>
            </View>

            <View style={styles.totalRow}>
              <Text>Total Deductions</Text>
              <Text>₹ {Math.round(totalDeductions).toLocaleString()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.netPayBox}>
          <Text style={styles.netPayText}>
            Net Pay: ₹ {Math.round(data.netPay).toLocaleString()}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
