import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";

export default async function EmployeesPage() {
  const supabase = await createClient();
  let employees: any[] = [];

  try {
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      const { data: company } = await supabase.from('companies').select('id').eq('owner_id', userData.user.id).single();
      if (company) {
        const { data: emps } = await supabase.from('employees').select('*').eq('company_id', company.id);
        if (emps) employees = emps;
      }
    }
  } catch (error) {
    // Fallback for demonstration without DB keys
    employees = [
      { id: "1", name: "Ramesh Kumar", email: "ramesh@example.com", annual_gross_salary: 1200000, state: "Maharashtra", tax_regime: "NEW", pf_opt_in: true },
      { id: "2", name: "Priya Sharma", email: "priya@example.com", annual_gross_salary: 850000, state: "Karnataka", tax_regime: "OLD", pf_opt_in: false }
    ];
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
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Employee
        </Button>
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
                  No employees found.
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
