import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  let employeeCount = 0;
  let lastRunLabel = "--";
  let totalTax = 0;

  try {
    if (userData?.user) {
      const { data: company } = await supabase
        .from("companies")
        .select("id")
        .eq("owner_id", userData.user.id)
        .single();

      if (company) {
        // Run all queries concurrently using Promise.all
        const [empsPromise, lastRunPromise, runsPromise] = await Promise.all([
          // 1. Employee Count
          supabase
            .from("employees")
            .select("*", { count: "exact", head: true })
            .eq("company_id", company.id),
          
          // 2. Last Payroll Run
          supabase
            .from("payroll_runs")
            .select("month, year")
            .eq("company_id", company.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single(),
            
          // 3. Tax Deducted YTD (Fetch runs list)
          supabase
            .from("payroll_runs")
            .select("id")
            .eq("company_id", company.id)
        ]);

        if (empsPromise.count !== null) {
          employeeCount = empsPromise.count;
        }

        if (lastRunPromise.data) {
          const lastRun = lastRunPromise.data;
          lastRunLabel = `${new Date(0, lastRun.month - 1).toLocaleString("default", {
            month: "long",
          })} ${lastRun.year}`;
        }

        if (runsPromise.data && runsPromise.data.length > 0) {
          const runIds = runsPromise.data.map((r) => r.id);
          const { data: payslips } = await supabase
            .from("payslips")
            .select("tds_deducted, pt_deducted")
            .in("payroll_run_id", runIds);

          if (payslips) {
            totalTax = payslips.reduce(
              (acc, p) =>
                acc + Number(p.tds_deducted || 0) + Number(p.pt_deducted || 0),
              0
            );
          }
        }
      }
    }
  } catch (error) {
    console.error("Dashboard error:", error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your company's payroll and employees.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Total Employees
          </div>
          <div className="mt-2 text-3xl font-bold">{employeeCount}</div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Last Payroll Run
          </div>
          <div className="mt-2 text-3xl font-bold">{lastRunLabel}</div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Total Tax Deducted (YTD)
          </div>
          <div className="mt-2 text-3xl font-bold">
            ₹{Math.round(totalTax).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
