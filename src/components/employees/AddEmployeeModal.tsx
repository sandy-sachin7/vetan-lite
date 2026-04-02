"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { addEmployee } from "@/app/(dashboard)/employees/actions";

export function AddEmployeeModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      await addEmployee(formData);
      setOpen(false);
    } catch (err: any) {
      console.error(err);
      alert("Failed to add employee: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-2 h-4 w-4" /> Add Employee
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Enter the employee's payroll details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="annual_gross_salary">Annual Gross (₹)</Label>
              <Input id="annual_gross_salary" name="annual_gross_salary" type="number" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <select id="state" name="state" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" required>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Delhi">Delhi</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tax_regime">Tax Regime</Label>
              <select id="tax_regime" name="tax_regime" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                <option value="NEW">New Regime</option>
                <option value="OLD">Old Regime</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <input type="checkbox" id="pf_opt_in" name="pf_opt_in" className="h-4 w-4 rounded border-gray-300" />
              <Label htmlFor="pf_opt_in">PF Opt-In</Label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="sec_80c" className="text-xs">Sec 80C (Old Regime)</Label>
              <Input id="sec_80c" name="sec_80c" type="number" defaultValue="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sec_80d" className="text-xs">Sec 80D (Old Regime)</Label>
              <Input id="sec_80d" name="sec_80d" type="number" defaultValue="0" />
            </div>
          </div>
          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Adding..." : "Save Employee"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
