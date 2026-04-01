export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your company's payroll and employees.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {/* Placeholder metric cards */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="text-sm font-medium text-muted-foreground">Total Employees</div>
          <div className="mt-2 text-3xl font-bold">0</div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="text-sm font-medium text-muted-foreground">Last Payroll Run</div>
          <div className="mt-2 text-3xl font-bold">--</div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="text-sm font-medium text-muted-foreground">Total Tax Deducted (YTD)</div>
          <div className="mt-2 text-3xl font-bold">₹0</div>
        </div>
      </div>
    </div>
  );
}
