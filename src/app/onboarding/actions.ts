"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { logger, withLogger } from "@/utils/logger";
import { v4 as uuidv4 } from "uuid";

export async function completeOnboarding(formData: FormData) {
  const traceId = uuidv4();
  return withLogger(traceId, { action: "completeOnboarding" }, async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return redirect("/login");
    }

    const name = formData.get("companyName") as string;
    const pan = formData.get("pan") as string;
    const state = formData.get("state") as string;

    const { error } = await supabase.from("companies").insert({
      owner_id: user.id,
      name,
      pan,
      state,
    });

    if (error) {
      logger.error({ err: error }, "Onboarding Error");
      return redirect(`/onboarding?message=${encodeURIComponent("Failed to create company profile")}`);
    }

    logger.info("Successfully completed onboarding");
    redirect("/employees");
  });
}
