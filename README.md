# VetanLite: Micro-Payroll SaaS

**VetanLite** is a highly efficient, automated micro-payroll SaaS tailored specifically for Indian businesses with fewer than 10 employees. It focuses strictly on automatic tax/statutory calculations and PDF payslip generation, eliminating the bloat of enterprise payroll software and offering true 1-click processing for tiny teams.

## The Problem It Solves

Small businesses spend hours each month manually calculating employee salaries, factoring in variable elements like paid leave, unpaid absences (Loss of Pay), overtime hours, and festival bonuses. Traditional payroll software is designed for larger organizations and doesn't offer a simple spreadsheet-like grid for immediate 1-click execution. 

VetanLite provides a tabular, instant-calculation interface where variables can be plugged in, instantly updating PF, PT, and TDS obligations before finalizing and auto-generating compliant PDF payslips.

## Tech Stack
- **Frontend & Backend**: Next.js (App Router, React 19)
- **Database & Auth**: Supabase (PostgreSQL, Supabase Auth)
- **Styling**: Tailwind CSS + Shadcn UI
- **PDF Generation**: `@react-pdf/renderer` purely server-side
- **Email Delivery**: Resend API
- **Payments**: Razorpay Subscriptions (Future)

## Setup & Running Locally

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file in the root directory and add your Supabase and Resend keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   RESEND_API_KEY=your_resend_key
   ```

3. **Database Initialization**
   Apply the SQL migration file located in `supabase/migrations/0000_initial_schema.sql` via the Supabase SQL Editor to set up the `companies`, `employees`, `payroll_runs`, and `payslips` tables.

4. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Current Project Status
- ✅ Scaffolding & Routing setup (Auth, Dashboard, Payroll flows)
- ✅ Indian Tax Engine Logic & Test coverage (PF, PT, TDS)
- ✅ Live Data-Grid UI for instant salary calculations
- ⚠️ Employee Management Forms integration pending
- ⚠️ Payroll Finalization (DB writes & PDF generation) pending
- ⚠️ Razorpay integration pending

---

**Built beautifully with Next.js & Tailwind CSS.**
