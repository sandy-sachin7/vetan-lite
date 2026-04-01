import { describe, it } from "node:test";
import assert from "node:assert";
import {
  calculateSalaryStructure,
  calculateAnnualTax,
  calculatePT,
  runMonthlyPayroll,
  EmployeeSalaryInput,
} from "./taxEngine";

describe("Tax Engine Module", () => {
  it("calculates salary structure correctly", () => {
    const structure = calculateSalaryStructure(1200000); // 12 LPA
    assert.strictEqual(structure.basic, 600000);
    assert.strictEqual(structure.hra, 300000);
    assert.strictEqual(structure.specialAllowance, 300000);
  });

  it("calculates Old Regime tax correctly (below rebate)", () => {
    const emp: EmployeeSalaryInput = {
      annualGrossSalary: 550000, // 5.5 LPA
      state: "Delhi",
      taxRegime: "OLD",
      pfOptIn: false,
      sec80C: 0,
      sec80D: 0,
    };
    // 5.5L - 50k standard deduction = 5.0L -> Rebate applies -> 0 Tax
    assert.strictEqual(calculateAnnualTax(emp), 0);
  });

  it("calculates Old Regime tax correctly (above rebate)", () => {
    const emp: EmployeeSalaryInput = {
      annualGrossSalary: 1200000, // 12 LPA
      state: "Delhi",
      taxRegime: "OLD",
      pfOptIn: false,
      sec80C: 150000,
      sec80D: 25000,
    };
    // Gross: 12,00,000
    // Deductions: 50k (std) + 1.5L (80C) + 25k (80D) = 2,25,000
    // Taxable: 9,75,000
    // Tax: (2.5L to 5L @ 5% = 12500) + (5L to 9.75L @ 20% = 95000) = 107500
    // Cess 4%: 107500 * 1.04 = 111800
    assert.strictEqual(calculateAnnualTax(emp), 111800);
  });

  it("calculates New Regime tax correctly (below rebate)", () => {
    const emp: EmployeeSalaryInput = {
      annualGrossSalary: 775000, // 7.75 LPA
      state: "Delhi",
      taxRegime: "NEW",
      pfOptIn: false,
    };
    // 7.75L - 75k standard deduction = 7.0L -> Rebate 87A applies -> 0 Tax
    assert.strictEqual(calculateAnnualTax(emp), 0);
  });

  it("calculates New Regime tax correctly (above rebate)", () => {
    const emp: EmployeeSalaryInput = {
      annualGrossSalary: 1200000, // 12 LPA
      state: "Delhi",
      taxRegime: "NEW",
      pfOptIn: false,
    };
    // Gross: 12L
    // Deductions: 75k
    // Taxable: 11,25,000
    // Tax slabs:
    // 0-3L: 0
    // 3L-7L (4L): 5% = 20,000
    // 7L-10L (3L): 10% = 30,000
    // 10L-11.25L (1.25L): 15% = 18,750
    // Base Tax = 68,750
    // Cess 4%: 68750 * 1.04 = 71500
    assert.strictEqual(calculateAnnualTax(emp), 71500);
  });

  it("calculates PT correctly", () => {
    assert.strictEqual(calculatePT("Maharashtra", 50000), 200);
    assert.strictEqual(calculatePT("Karnataka", 14000), 0); // < 15k
    assert.strictEqual(calculatePT("Karnataka", 20000), 200); // >= 15k
    assert.strictEqual(calculatePT("Tamil Nadu", 50000), 208);
    assert.strictEqual(calculatePT("Delhi", 50000), 0);
  });

  it("runs monthly payroll correctly", () => {
    const emp: EmployeeSalaryInput = {
      annualGrossSalary: 1200000, // 1 Lakh/month
      state: "Maharashtra",
      taxRegime: "NEW",
      pfOptIn: true,
    };

    const run = runMonthlyPayroll(emp, {
      lopDays: 1, // 1 day LOP
      overtimeHours: 2, // 2 hours OT
      bonus: 5000, // 5k bonus
      deduction: 1000, // 1k custom deduction
    });

    // Monthly Gross = 100,000
    // Basic = 50,000
    // LOP Amount = 100,000 / 30 = 3333.33
    const expectedLop = 100000 / 30;
    // Overtime = 2 * (100,000 / 240) * 2 = 1666.66
    const expectedOT = 2 * (100000 / 240) * 2;
    // PF = 12% of (50000 - (50000/30)) = 5800
    const expectedPF = (50000 - (50000 / 30)) * 0.12;
    // PT = 200
    // TDS = 71500 / 12 = 5958.33
    const expectedTDS = 71500 / 12;

    assert.ok(Math.abs(run.lopAmount - expectedLop) < 0.01);
    assert.ok(Math.abs(run.overtimePay - expectedOT) < 0.01);
    assert.ok(Math.abs(run.pf_deducted - expectedPF) < 0.01);
    assert.ok(Math.abs(run.pt_deducted - 200) < 0.01);
    assert.ok(Math.abs(run.tds_deducted - expectedTDS) < 0.01);

    const expectedEarnings = 100000 - expectedLop + 5000 + expectedOT;
    assert.ok(Math.abs(run.totalEarnings - expectedEarnings) < 0.01);

    const expectedDeductions = expectedPF + 200 + expectedTDS + 1000;
    assert.ok(Math.abs(run.totalDeductions - expectedDeductions) < 0.01);

    const expectedNet = expectedEarnings - expectedDeductions;
    assert.ok(Math.abs(run.net_pay - expectedNet) < 0.01);
  });
});
