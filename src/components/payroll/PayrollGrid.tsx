"use client";

import { useState } from "react";
import { runMonthlyPayroll, EmployeeSalaryInput, MonthlyVariables } from "@/utils/taxEngine";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { finalizePayrollRun } from "@/app/(dashboard)/payroll/actions";

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
  const [showBillingWall, setShowBillingWall] = useState(false);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const [month, setMonth] = useState<number>(currentMonth);
  const [year, setYear] = useState<number>(currentYear);

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
    try {
      const payslips = employees.map(emp => {
        const vars = variables[emp.id] || {};
        const calc = runMonthlyPayroll(emp, vars);
        return {
          employee_id: emp.id,
          lop_days: vars.lopDays || 0,
          overtime_hours: vars.overtimeHours || 0,
          bonus: vars.bonus || 0,
          deduction: vars.deduction || 0,
          calculated_basic_monthly: calc.calculated_basic_monthly,
          calculated_hra_monthly: calc.calculated_hra_monthly,
          calculated_special_allowance_monthly: calc.calculated_special_allowance_monthly,
          pf_deducted: calc.pf_deducted,
          pt_deducted: calc.pt_deducted,
          tds_deducted: calc.tds_deducted,
          net_pay: calc.net_pay
        };
      });

      await finalizePayrollRun(month, year, payslips);
      alert("Payroll run finalized successfully!");
      setVariables({}); // Reset grid
    } catch (err: any) {
      console.error(err);
      if (err.message === "FREE_TIER_LIMIT_REACHED") {
        setShowBillingWall(true);
      } else {
        alert(err.message || "Failed to finalize payroll run.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-4 rounded-md border">
        <div className="flex gap-4 items-center">
          <h2 className="text-xl font-semibold">Payroll Run Details</h2>
          <div className="flex gap-2 items-center ml-4">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              {Array.from({length: 12}).map((_, i) => (
                <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
              ))}
            </select>
            <Input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-24 h-9"
            />
          </div>
        </div>
        <Button onClick={handleFinalize} disabled={isSaving || employees.length === 0}>
          {isSaving ? "Finalizing..." : "Finalize Run & Save"}
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

      <Dialog open={showBillingWall} onOpenChange={setShowBillingWall}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upgrade to Pro</DialogTitle>
            <DialogDescription>
              You have reached your limit of 2 free payroll runs. Upgrade to Pro for unlimited payroll runs, automated tax calculations, and 1-click bulk payslip distribution.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <p className="text-3xl font-bold">₹999<span className="text-sm text-muted-foreground font-normal">/month</span></p>
            <ul className="text-sm space-y-2 text-muted-foreground list-disc pl-4">
              <li>Up to 10 Employees</li>
              <li>Unlimited Payroll Runs</li>
              <li>1-Click Emails + PDFs</li>
            </ul>
          </div>
          <DialogFooter className="sm:justify-between">
            <DialogClose render={<Button type="button" variant="secondary" />}>
              Cancel
            </DialogClose>
            <a href="https://razorpay.com/" target="_blank" rel="noopener noreferrer">
              <Button type="button" className="bg-purple-600 hover:bg-purple-700">
                Upgrade Now
              </Button>
            </a>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
