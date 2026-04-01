export type TaxRegime = "OLD" | "NEW";

export interface EmployeeSalaryInput {
  annualGrossSalary: number;
  state: string;
  taxRegime: TaxRegime;
  pfOptIn: boolean;
  sec80C?: number;
  sec80D?: number;
}

export interface MonthlyVariables {
  lopDays?: number;
  overtimeHours?: number;
  bonus?: number;
  deduction?: number;
  workingDaysInMonth?: number; // default 30
}

/**
 * Calculates standard salary components from Annual Gross.
 * Basic = 50%, HRA = 25%, Special = 25%
 */
export function calculateSalaryStructure(annualGross: number) {
  const basic = annualGross * 0.5;
  const hra = basic * 0.5; // 25% of gross
  const specialAllowance = annualGross - basic - hra; // 25% of gross
  return { basic, hra, specialAllowance };
}

/**
 * Calculates annual tax based on chosen regime.
 * Old Regime: Standard Deduction ₹50,000 + 80C + 80D
 * New Regime (April 2026): Standard Deduction ₹75,000
 */
export function calculateAnnualTax(input: EmployeeSalaryInput): number {
  const { annualGrossSalary, taxRegime, sec80C = 0, sec80D = 0 } = input;

  if (taxRegime === "NEW") {
    const standardDeduction = 75000;
    let taxableIncome = annualGrossSalary - standardDeduction;
    if (taxableIncome <= 700000) return 0; // Rebate 87A

    let tax = 0;
    if (taxableIncome > 300000) tax += (Math.min(taxableIncome, 700000) - 300000) * 0.05;
    if (taxableIncome > 700000) tax += (Math.min(taxableIncome, 1000000) - 700000) * 0.10;
    if (taxableIncome > 1000000) tax += (Math.min(taxableIncome, 1200000) - 1000000) * 0.15;
    if (taxableIncome > 1200000) tax += (Math.min(taxableIncome, 1500000) - 1200000) * 0.20;
    if (taxableIncome > 1500000) tax += (taxableIncome - 1500000) * 0.30;

    return tax * 1.04; // +4% Health & Education Cess
  } else {
    // OLD Regime
    const standardDeduction = 50000;
    const deductions = standardDeduction + sec80C + sec80D;
    let taxableIncome = annualGrossSalary - deductions;

    if (taxableIncome <= 500000) return 0; // Rebate 87A

    let tax = 0;
    if (taxableIncome > 250000) tax += (Math.min(taxableIncome, 500000) - 250000) * 0.05;
    if (taxableIncome > 500000) tax += (Math.min(taxableIncome, 1000000) - 500000) * 0.20;
    if (taxableIncome > 1000000) tax += (taxableIncome - 1000000) * 0.30;

    return tax * 1.04; // +4% Health & Education Cess
  }
}

/**
 * Calculates Professional Tax based on state.
 */
export function calculatePT(state: string, monthlyGross: number): number {
  const s = state.toLowerCase();
  if (s.includes("maharashtra")) return 200;
  if (s.includes("karnataka")) return monthlyGross >= 15000 ? 200 : 0;
  if (s.includes("tamil")) return 208;
  if (s.includes("delhi") || s.includes("haryana")) return 0;
  return 200; // Generic fallback
}

/**
 * Main Payroll Engine function. Runs monthly calculations.
 */
export function runMonthlyPayroll(
  employee: EmployeeSalaryInput,
  variables: MonthlyVariables = {}
) {
  const {
    lopDays = 0,
    overtimeHours = 0,
    bonus = 0,
    deduction = 0,
    workingDaysInMonth = 30,
  } = variables;

  const annual = calculateSalaryStructure(employee.annualGrossSalary);
  const monthlyGross = employee.annualGrossSalary / 12;

  // Monthly breakdown
  const basicMonthly = annual.basic / 12;
  const hraMonthly = annual.hra / 12;
  const specialAllowanceMonthly = annual.specialAllowance / 12;

  // 1. Loss of Pay (LOP) Amount
  const lopAmount = (monthlyGross / workingDaysInMonth) * lopDays;

  // 2. Overtime Pay (Assume double rate on standard 240 hours/month)
  const hourlyRate = monthlyGross / 240;
  const overtimePay = overtimeHours * hourlyRate * 2;

  // 3. Gross Earnings
  const totalEarnings = monthlyGross - lopAmount + bonus + overtimePay;

  // 4. Statutory Deductions
  let pfDeducted = 0;
  if (employee.pfOptIn) {
    // PF is 12% of basic (adjusted for LOP if we want strictly accurate, but let's base on adjusted basic)
    const adjustedBasicMonthly = basicMonthly - ((basicMonthly / workingDaysInMonth) * lopDays);
    pfDeducted = adjustedBasicMonthly * 0.12;
  }

  const ptDeducted = calculatePT(employee.state, totalEarnings);

  // TDS is annualized divided by 12.
  const annualTax = calculateAnnualTax(employee);
  const tdsDeducted = annualTax / 12;

  // 5. Total Deductions & Net Pay
  const totalDeductions = pfDeducted + ptDeducted + tdsDeducted + deduction;
  const netPay = totalEarnings - totalDeductions;

  return {
    lopAmount,
    overtimePay,
    calculated_basic_monthly: basicMonthly,
    calculated_hra_monthly: hraMonthly,
    calculated_special_allowance_monthly: specialAllowanceMonthly,
    pf_deducted: pfDeducted,
    pt_deducted: ptDeducted,
    tds_deducted: tdsDeducted,
    totalEarnings,
    totalDeductions,
    net_pay: netPay,
  };
}
