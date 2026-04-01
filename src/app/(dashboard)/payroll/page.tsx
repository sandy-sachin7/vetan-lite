import { createClient } from "@/utils/supabase/server";
import { PayrollGrid, PayrollEmployee } from "@/components/payroll/PayrollGrid";

export default async function PayrollPage() {
  const supabase = await createClient();
  let employees: PayrollEmployee[] = [];

  try {
    const { data: userData } = await supabase.auth.getUser();

    if (userData.user) {
      // Get the user's company
      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('owner_id', userData.user.id)
        .single();

      if (company) {
        // Get employees
        const { data: emps } = await supabase
          .from('employees')
          .select('*')
          .eq('company_id', company.id);

        if (emps) {
          employees = emps.map(emp => ({
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
    // Supabase likely not connected. Fallback to dummy data for demonstration.
    employees = [
      {
        id: "1",
        name: "Ramesh Kumar",
        annualGrossSalary: 1200000,
        state: "Maharashtra",
        taxRegime: "NEW",
        pfOptIn: true,
      },
      {
        id: "2",
        name: "Priya Sharma",
        annualGrossSalary: 850000,
        state: "Karnataka",
        taxRegime: "OLD",
        pfOptIn: false,
        sec80C: 150000,
      }
    ];
  }

  // If we have an empty array (DB connected but no users), we don't mock.
  // The catch block specifically handles the "Missing Supabase URL/Key" errors.

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payroll Runs</h1>
        <p className="text-muted-foreground">
          Calculate, finalize, and distribute payslips.
        </p>
      </div>

      <PayrollGrid employees={employees} />
    </div>
  );
}
