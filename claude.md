# VetanLite: End-to-End Implementation Blueprint

**Objective:** Build a highly efficient, automated micro-payroll SaaS for Indian businesses (< 10 employees), focusing strictly on automatic tax/statutory calculations and PDF payslip generation. No direct money movement features in V1.

---

## 1. Absolute Tech Stack
- **Frontend & Backend:** Next.js (App Router, React 18).
- **Database & Auth:** Supabase (PostgreSQL, Row Level Security, Supabase Auth).
- **Styling:** Tailwind CSS + Shadcn UI (Vibrant Modern Purple theme).
- **PDF Generation:** `@react-pdf/renderer` (Server-side rendered PDFs).
- **Email Delivery:** Resend API.
- **Payments (SaaS):** Razorpay Subscriptions (₹999/month flat fee).
- **Hosting:** Vercel.

---

## 2. Absolute Feature Scope (V1)

**A. Authentication & Company Onboarding**
- Supabase Email/Password + Google OAuth login.
- Employer inputs Company Name, Employer PAN, and registered State.

**B. Employee Management**
- **Inputs:** Employee Name, Email, GROSS Annual Salary, State, PF Opt-in (Yes/No), Tax Regime (Old/New - April 2026 rules).
- **Old Regime Fields:** Total 80C Deduction Amount, Total 80D Deduction Amount. (Strictly employer-input, no employee portal).
- **Auto-Salary Structuring Model:**
    - Basic Salary = 50% of Gross.
    - HRA = 50% of Basic (25% of Gross).
    - Special Allowance = Remaining 25% of Gross.

**C. The Payroll Engine (Monthly Run)**
- A data-grid view (table) for the current month.
- **Editable Variables per Employee:**
    - Loss of Pay (LOP) Days.
    - Overtime Hours.
    - One-time Bonus (₹).
    - One-time Deduction (₹).
- **Automatic Calculations:**
    - **PF:** 12% of Basic Salary (if opted in).
    - **PT (Professional Tax):** Mapped dynamically based on Employee State.
    - **TDS:** Computed per employee per month based on the chosen tax regime (incorporating the ₹75K standard deduction for New Regime April 2026, or ₹50k + 80C/80D for Old Regime).
    - **Net Pay:** Gross + Overtime + Bonus - LOP - PF - PT - TDS - Deductions.

**D. Payslip & Reports**
- 1-click generation of Indian-standard Payslip PDFs (Earnings left column, Deductions right column).
- 1-click bulk email to all employees via Resend.
- CSV Export of the final Payroll Run for bank transfer utility.

---

## 3. Database Schema (Supabase PostgreSQL)

**`companies` Table**
- `id` (uuid, PK)
- `owner_id` (uuid, FK to auth.users)
- `name` (text)
- `pan` (text)
- `state` (text)

**`employees` Table**
- `id` (uuid, PK)
- `company_id` (uuid, FK to companies)
- `name` (text)
- `email` (text)
- `annual_gross_salary` (numeric)
- `state` (text)
- `tax_regime` (enum: 'OLD', 'NEW')
- `pf_opt_in` (boolean)
- `sec_80c` (numeric, default 0)
- `sec_80d` (numeric, default 0)

**`payroll_runs` Table**
- `id` (uuid, PK)
- `company_id` (uuid, FK to companies)
- `month` (integer, 1-12)
- `year` (integer)
- `status` (enum: 'DRAFT', 'COMPLETED')

**`payslips` Table**
- `id` (uuid, PK)
- `payroll_run_id` (uuid, FK to payroll_runs)
- `employee_id` (uuid, FK to employees)
- `lop_days` (numeric)
- `overtime_hours` (numeric)
- `bonus` (numeric)
- `deduction` (numeric)
- `calculated_basic_monthly` (numeric)
- `calculated_hra_monthly` (numeric)
- `calculated_special_allowance_monthly` (numeric)
- `pf_deducted` (numeric)
- `pt_deducted` (numeric)
- `tds_deducted` (numeric)
- `net_pay` (numeric)
- `pdf_url` (text, nullable)

---

## 4. Operational Execution Sequence

1. **Backend Initialization:** Create Supabase project, execute SQL schema, and establish Row Level Security (RLS) ensuring `owner_id` isolation.
2. **Frontend Shell:** Initialize Next.js + Tailwind + Shadcn. Build Layout, Auth forms, and Navigation.
3. **The Tax Engine Module:** Build a pure TypeScript `/utils/taxEngine.ts` file containing unit-testable mathematical functions for TDS, PF, and PT.
4. **Data Grid UI:** Build the interactive Next.js Client Component for the Payroll Run table, mutating local state before finalizing the run to Supabase.
5. **PDF Microservice:** Implement `@react-pdf/renderer` within a Next.js API route to return binary PDF streams.
6. **Billing Wall:** Integrate Razorpay Subscription links protecting the `generate` button for >2 payroll runs.
