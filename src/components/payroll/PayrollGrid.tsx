"use client";

import { useState } from "react";
import { runMonthlyPayroll, EmployeeSalaryInput, MonthlyVariables } from "@/utils/taxEngine";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type PayrollEmployee = EmployeeSalaryInput & {
  id: string;
  name: string;
};

interface PayrollGridProps {
  employees: PayrollEmployee[];
}

export function PayrollGrid({ employees }: PayrollGridProps) {
  const [variables, setVariables] = useState<Record<string, MonthlyVariables>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleVariableChange = (empId: string, field: keyof MonthlyVariables, value: string) => {
    const numValue = value === "" ? 0 : Number(value);
    setVariables((prev) => ({
      ...prev,
      [empId]: {
        ...prev[empId],
        [field]: numValue,
      },
    }));
  };

  const handleFinalize = async () => {
    setIsSaving(true);
    // In a real app, send `variables` and `employees` to a Server Action to save to Supabase
    alert("Payroll run finalized! Check console for payload.");
    console.log("Finalized Payload:", { employees, variables });
    setIsSaving(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Current Month Payroll Run</h2>
        <Button onClick={handleFinalize} disabled={isSaving || employees.length === 0}>
          {isSaving ? "Finalizing..." : "Finalize Run & Generate Payslips"}
        </Button>
      </div>

      <div className="border rounded-md overflow-x-auto bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Gross/Mo (₹)</TableHead>
              <TableHead className="w-24">LOP Days</TableHead>
              <TableHead className="w-24">OT Hrs</TableHead>
              <TableHead className="w-24">Bonus (₹)</TableHead>
              <TableHead className="w-24">Deduction (₹)</TableHead>
              <TableHead>PF</TableHead>
              <TableHead>PT</TableHead>
              <TableHead>TDS</TableHead>
              <TableHead className="text-right">Net Pay (₹)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                  No employees found. Please add employees first.
                </TableCell>
              </TableRow>
            ) : (
              employees.map((emp) => {
                const vars = variables[emp.id] || {};
                const calc = runMonthlyPayroll(emp, vars);

                return (
                  <TableRow key={emp.id}>
                    <TableCell className="font-medium">{emp.name}</TableCell>
                    <TableCell>{Math.round(emp.annualGrossSalary / 12).toLocaleString()}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.5"
                        className="h-8 w-16"
                        value={vars.lopDays || ""}
                        onChange={(e) => handleVariableChange(emp.id, "lopDays", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        className="h-8 w-16"
                        value={vars.overtimeHours || ""}
                        onChange={(e) => handleVariableChange(emp.id, "overtimeHours", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        className="h-8 w-20"
                        value={vars.bonus || ""}
                        onChange={(e) => handleVariableChange(emp.id, "bonus", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        className="h-8 w-20"
                        value={vars.deduction || ""}
                        onChange={(e) => handleVariableChange(emp.id, "deduction", e.target.value)}
                      />
                    </TableCell>
                    <TableCell className="text-red-600">-{Math.round(calc.pf_deducted)}</TableCell>
                    <TableCell className="text-red-600">-{Math.round(calc.pt_deducted)}</TableCell>
                    <TableCell className="text-red-600">-{Math.round(calc.tds_deducted)}</TableCell>
                    <TableCell className="text-right font-bold text-green-600">
                      ₹{Math.round(calc.net_pay).toLocaleString()}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
