import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, CreditCard } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your VetanLite subscription.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 mt-8">
        {/* Current Plan Information */}
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>You are currently on the Free Tier.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-muted p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Payroll Runs Remaining</span>
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <div className="mt-2 w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full" style={{ width: '0%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                You have 2 free payroll runs included. Upgrade to continue running payroll seamlessly.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade / Pricing Card */}
        <Card className="border-primary shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold rounded-bl-lg">
            Recommended
          </div>
          <CardHeader>
            <CardTitle className="text-2xl">Pro Plan</CardTitle>
            <CardDescription>Unlimited payroll runs for Indian businesses (< 10 employees).</CardDescription>
            <div className="mt-4 flex items-baseline text-4xl font-extrabold">
              ₹999
              <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                "Unlimited monthly payroll runs",
                "Automatic TDS, PF & PT calculations",
                "1-click bulk payslip generation (PDF)",
                "1-click bulk email to employees",
                "Bank CSV export utility",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            {/* Razorpay Integration Trigger */}
            <Button className="w-full" size="lg">
              <CreditCard className="mr-2 h-4 w-4" /> Subscribe via Razorpay
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
