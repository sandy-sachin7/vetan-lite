import { createClient } from "@/utils/supabase/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddEmployeeModal } from "@/components/employees/AddEmployeeModal";

export default async function EmployeesPage() {
  const supabase = await createClient();
  let employees: any[] = [];

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
          .order('created_at', { ascending: false });

        if (emps) {
          employees = emps;
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch employees:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">
            Manage your workforce and tax details.
          </p>
        </div>
        <AddEmployeeModal />
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Gross Salary (₹)</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Regime</TableHead>
              <TableHead>PF Opt-in</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No employees found. Click "Add Employee" to get started.
                </TableCell>
              </TableRow>
            ) : (
              employees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell className="font-medium">{emp.name}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{Number(emp.annual_gross_salary).toLocaleString()}</TableCell>
                  <TableCell>{emp.state}</TableCell>
                  <TableCell>{emp.tax_regime}</TableCell>
                  <TableCell>{emp.pf_opt_in ? "Yes" : "No"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
