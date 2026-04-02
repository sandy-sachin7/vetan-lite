import Link from "next/link";
import {
  Users,
  Calculator,
  Settings,
  LogOut,
  LayoutDashboard,
  CreditCard
} from "lucide-react";
import { logout } from "@/app/auth/actions";
import { MobileSidebar } from "@/components/layout/MobileSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 flex-col md:flex-row">
      <MobileSidebar logoutAction={logout} />
      
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-white dark:bg-zinc-900 md:flex">
        <div className="flex h-16 items-center border-b px-6">
          <span className="text-xl font-bold text-primary">VetanLite</span>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-4">
          <Link href="/dashboard" className="flex items-center gap-3 rounded-md px-3 py-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/employees" className="flex items-center gap-3 rounded-md px-3 py-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
            <Users className="h-5 w-5" />
            <span>Employees</span>
          </Link>
          <Link href="/payroll" className="flex items-center gap-3 rounded-md px-3 py-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
            <Calculator className="h-5 w-5" />
            <span>Payroll Runs</span>
          </Link>
          <Link href="/billing" className="flex items-center gap-3 rounded-md px-3 py-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
            <CreditCard className="h-5 w-5" />
            <span>Billing</span>
          </Link>
        </nav>
        <div className="border-t p-4">
          <Link href="/settings" className="flex items-center gap-3 rounded-md px-3 py-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 mb-2">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
          <form action={logout}>
            <button type="submit" className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
