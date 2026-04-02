import { createClient } from "@/utils/supabase/server";
import { SettingsForm } from "@/components/settings/SettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let initialConfig = {};

  if (user) {
    const { data: company } = await supabase
      .from("companies")
      .select("payroll_config")
      .eq("owner_id", user.id)
      .single();

    if (company && company.payroll_config) {
      initialConfig = company.payroll_config;
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Company Settings</h1>
        <p className="text-muted-foreground">
          Manage your payroll configurations and company preferences.
        </p>
      </div>

      <div className="grid gap-6">
        <SettingsForm initialConfig={initialConfig} />
      </div>
    </div>
  );
}
