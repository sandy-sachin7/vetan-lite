import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottom: "1px solid #ccc",
    paddingBottom: 10,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  title: {
    fontSize: 14,
    marginTop: 5,
    color: "#555",
  },
  section: {
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  col: {
    width: "50%",
  },
  label: {
    fontWeight: "bold",
    color: "#555",
  },
  table: {
    marginTop: 15,
    borderTop: "1px solid #ccc",
    borderLeft: "1px solid #ccc",
    flexDirection: "column",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #ccc",
  },
  tableColHeader: {
    width: "50%",
    borderRight: "1px solid #ccc",
    backgroundColor: "#f4f4f4",
    padding: 5,
    fontWeight: "bold",
  },
  tableCol: {
    width: "50%",
    borderRight: "1px solid #ccc",
    padding: 5,
  },
  tableCell: {
    marginTop: 2,
  },
  totalRow: {
    flexDirection: "row",
    borderBottom: "1px solid #000",
    borderTop: "1px solid #000",
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 10,
    fontWeight: "bold",
  },
});

export interface PayslipData {
  companyName: string;
  month: number;
  year: number;
  employeeName: string;
  employeeId: string;
  calculated_basic_monthly: number;
  calculated_hra_monthly: number;
  calculated_special_allowance_monthly: number;
  bonus: number;
  deduction: number;
  pf_deducted: number;
  pt_deducted: number;
  tds_deducted: number;
  net_pay: number;
}

export const PayslipDocument = ({ data }: { data: PayslipData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.companyName}>{data.companyName}</Text>
        <Text style={styles.title}>
          Payslip for {data.month}/{data.year}
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Employee Name:</Text>
            <Text>{data.employeeName}</Text>
          </View>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCell}>Earnings</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCell}>Amount (₹)</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Basic Pay</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{Math.round(data.calculated_basic_monthly)}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>HRA</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{Math.round(data.calculated_hra_monthly)}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Special Allowance</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{Math.round(data.calculated_special_allowance_monthly)}</Text>
          </View>
        </View>
        {data.bonus > 0 && (
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Bonus</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{data.bonus}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCell}>Deductions</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCell}>Amount (₹)</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>PF Deduction</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{Math.round(data.pf_deducted)}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Professional Tax</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{Math.round(data.pt_deducted)}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>TDS (Tax)</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{Math.round(data.tds_deducted)}</Text>
          </View>
        </View>
        {data.deduction > 0 && (
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Other Deductions</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{data.deduction}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.totalRow}>
        <View style={styles.col}>
          <Text>Net Pay:</Text>
        </View>
        <View style={styles.col}>
          <Text>₹ {Math.round(data.net_pay).toLocaleString()}</Text>
        </View>
      </View>
    </Page>
  </Document>
);
