"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calculator,
  Settings,
  LogOut,
  LayoutDashboard,
  CreditCard,
  Menu
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function MobileSidebar({ logoutAction }: { logoutAction: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center justify-between border-b bg-white dark:bg-zinc-900 px-4 h-16 w-full">
      <span className="text-xl font-bold text-primary">VetanLite</span>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button variant="ghost" size="icon" />}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 flex flex-col bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800">
          <div className="flex h-16 items-center border-b px-6">
            <span className="text-xl font-bold text-primary">VetanLite</span>
          </div>
          <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
            <Link onClick={() => setOpen(false)} href="/dashboard" className="flex items-center gap-3 rounded-md px-3 py-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link onClick={() => setOpen(false)} href="/employees" className="flex items-center gap-3 rounded-md px-3 py-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
              <Users className="h-5 w-5" />
              <span>Employees</span>
            </Link>
            <Link onClick={() => setOpen(false)} href="/payroll" className="flex items-center gap-3 rounded-md px-3 py-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
              <Calculator className="h-5 w-5" />
              <span>Payroll Runs</span>
            </Link>
            <Link onClick={() => setOpen(false)} href="/billing" className="flex items-center gap-3 rounded-md px-3 py-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
              <CreditCard className="h-5 w-5" />
              <span>Billing</span>
            </Link>
          </nav>
          <div className="border-t p-4">
            <Link onClick={() => setOpen(false)} href="/settings" className="flex items-center gap-3 rounded-md px-3 py-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 mb-2">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
            <form action={logoutAction} onSubmit={() => setOpen(false)}>
              <button type="submit" className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 w-full text-left">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
