import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-primary">Complete your Company Profile</CardTitle>
          <CardDescription>
            Enter your company details to get started with VetanLite payroll.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input id="companyName" placeholder="Acme Corp Pvt Ltd" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pan">Employer PAN</Label>
            <Input id="pan" placeholder="ABCDE1234F" className="uppercase" required maxLength={10} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">Registered State</Label>
            <select
              id="state"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              required
            >
              <option value="">Select State</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Delhi">Delhi</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg">Complete Onboarding</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
