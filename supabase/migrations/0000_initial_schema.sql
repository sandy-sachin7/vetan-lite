-- Initial VetanLite Schema

CREATE TYPE tax_regime_type AS ENUM ('OLD', 'NEW');
CREATE TYPE payroll_status_type AS ENUM ('DRAFT', 'COMPLETED');

-- 1. Companies Table
CREATE TABLE public.companies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    pan text NOT NULL,
    state text NOT NULL,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own companies"
    ON public.companies FOR ALL
    USING (auth.uid() = owner_id);

-- 2. Employees Table
CREATE TABLE public.employees (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text NOT NULL,
    annual_gross_salary numeric NOT NULL,
    state text NOT NULL,
    tax_regime tax_regime_type DEFAULT 'NEW',
    pf_opt_in boolean DEFAULT false,
    sec_80c numeric DEFAULT 0,
    sec_80d numeric DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage employees of their companies"
    ON public.employees FOR ALL
    USING (company_id IN (SELECT id FROM public.companies WHERE owner_id = auth.uid()));

-- 3. Payroll Runs Table
CREATE TABLE public.payroll_runs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    month integer NOT NULL CHECK (month >= 1 AND month <= 12),
    year integer NOT NULL,
    status payroll_status_type DEFAULT 'DRAFT',
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.payroll_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage payroll runs of their companies"
    ON public.payroll_runs FOR ALL
    USING (company_id IN (SELECT id FROM public.companies WHERE owner_id = auth.uid()));

-- 4. Payslips Table
CREATE TABLE public.payslips (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_run_id uuid NOT NULL REFERENCES public.payroll_runs(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    lop_days numeric DEFAULT 0,
    overtime_hours numeric DEFAULT 0,
    bonus numeric DEFAULT 0,
    deduction numeric DEFAULT 0,
    calculated_basic_monthly numeric NOT NULL,
    calculated_hra_monthly numeric NOT NULL,
    calculated_special_allowance_monthly numeric NOT NULL,
    pf_deducted numeric DEFAULT 0,
    pt_deducted numeric DEFAULT 0,
    tds_deducted numeric DEFAULT 0,
    net_pay numeric NOT NULL,
    pdf_url text,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.payslips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage payslips of their companies"
    ON public.payslips FOR ALL
    USING (payroll_run_id IN (
        SELECT id FROM public.payroll_runs WHERE company_id IN (
            SELECT id FROM public.companies WHERE owner_id = auth.uid()
        )
    ));
