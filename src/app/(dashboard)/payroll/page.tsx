import { createClient } from "@/utils/supabase/server";
import { PayrollGrid, PayrollEmployee } from "@/components/payroll/PayrollGrid";

export default async function PayrollPage() {
  const supabase = await createClient();
  let employees: PayrollEmployee[] = [];

  try {
    const { data: userData } = await supabase.auth.getUser();

    if (userData.user) {
      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('owner_id', userData.user.id)
        .single();

      if (company) {
        const { data: emps } = await supabase
          .from('employees')
          .select('*')
          .eq('company_id', company.id)
          .order('name');

        if (emps) {
          employees = emps.map((emp: any) => ({
            id: emp.id,
            name: emp.name,
            annualGrossSalary: Number(emp.annual_gross_salary),
            state: emp.state,
            taxRegime: emp.tax_regime,
            pfOptIn: emp.pf_opt_in,
            sec80C: Number(emp.sec_80c || 0),
            sec80D: Number(emp.sec_80d || 0),
          }));
        }
      }
    }
  } catch (error) {
    console.error("Error fetching employees for payroll:", error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payroll Runs</h1>
        <p className="text-muted-foreground">
          Calculate, finalize, and securely store payslips in the database.
        </p>
      </div>

      <PayrollGrid employees={employees} />
    </div>
  );
}
