"use client";

import { useState } from "react";
import { updateCompanySettings } from "@/app/(dashboard)/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

interface SettingsFormProps {
  initialConfig: {
    basicPercentage?: number;
    hraPercentage?: number;
    workingDaysPerMonth?: number;
    enablePf?: boolean;
    enablePt?: boolean;
  };
}

export function SettingsForm({ initialConfig }: SettingsFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function clientAction(formData: FormData) {
    setIsSaving(true);
    setError(null);
    try {
      const result = await updateCompanySettings(formData);
      if (result.error) {
        setError(result.error);
      } else {
        alert("Settings saved successfully!");
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form action={clientAction}>
      <Card className="bg-white/5 backdrop-blur border-white/10 shadow-xl">
        <CardHeader>
          <CardTitle>Payroll Configuration</CardTitle>
          <CardDescription>
            Customize how salaries and taxes are calculated for your company.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="basicPercentage">Basic Salary (%)</Label>
              <Input
                id="basicPercentage"
                name="basicPercentage"
                type="number"
                min="0"
                max="100"
                required
                defaultValue={initialConfig?.basicPercentage ?? 50}
                className="bg-white/5 border-white/10"
              />
              <p className="text-xs text-muted-foreground">Percentage of Gross Salary used for Basic Pay.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hraPercentage">HRA (%)</Label>
              <Input
                id="hraPercentage"
                name="hraPercentage"
                type="number"
                min="0"
                max="100"
                required
                defaultValue={initialConfig?.hraPercentage ?? 20}
                className="bg-white/5 border-white/10"
              />
              <p className="text-xs text-muted-foreground">Percentage of Gross Salary used for HRA.</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workingDaysPerMonth">Working Days Per Month</Label>
            <Input
              id="workingDaysPerMonth"
              name="workingDaysPerMonth"
              type="number"
              min="20"
              max="31"
              required
              defaultValue={initialConfig?.workingDaysPerMonth ?? 30}
              className="bg-white/5 border-white/10 sm:max-w-[250px]"
            />
            <p className="text-xs text-muted-foreground">Used to calculate LOP (Loss of Pay).</p>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <h4 className="font-medium">Statutory Deductions</h4>
            
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="space-y-0.5">
                <Label htmlFor="pfEnabled" className="text-base">Provident Fund (PF)</Label>
                <p className="text-sm text-muted-foreground">
                  Enforce EPF deduction (12% of Basic) for eligible employees.
                </p>
              </div>
              <Switch
                id="pfEnabled"
                name="pfEnabled"
                value="true"
                defaultChecked={initialConfig?.enablePf ?? true}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="space-y-0.5">
                <Label htmlFor="ptEnabled" className="text-base">Professional Tax (PT)</Label>
                <p className="text-sm text-muted-foreground">
                  Deduct state-level professional tax.
                </p>
              </div>
              <Switch
                id="ptEnabled"
                name="ptEnabled"
                value="true"
                defaultChecked={initialConfig?.enablePt ?? true}
              />
            </div>
          </div>
          
          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
        </CardContent>
        <CardFooter className="border-t border-white/10 bg-black/20 pt-6">
          <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
            {isSaving ? "Saving..." : "Save Configuration"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
