import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center py-32 px-16 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
          <span className="text-primary">VetanLite</span>
        </h1>
        <p className="text-xl leading-8 text-zinc-600 dark:text-zinc-400 mb-8 max-w-xl">
          The highly efficient, automated micro-payroll SaaS for Indian businesses. Automatic tax & statutory calculations with 1-click PDF payslips.
        </p>
        <div className="flex gap-4">
          <Link href="/login">
            <Button size="lg" className="px-8 text-lg">
              Get Started
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="px-8 text-lg">
              Log In
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
