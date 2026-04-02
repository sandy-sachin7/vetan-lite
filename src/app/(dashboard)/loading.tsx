import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 w-full animate-in fade-in duration-500">
      <div className="space-y-2">
        <Skeleton className="h-9 w-[250px] bg-zinc-200 dark:bg-zinc-800" />
        <Skeleton className="h-4 w-[400px] bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <div className="space-y-4 pt-4">
        <Skeleton className="h-[125px] w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        <Skeleton className="h-[250px] w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}
