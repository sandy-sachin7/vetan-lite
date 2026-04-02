import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { logger } from "@/utils/logger";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  const traceId = uuidv4();
  
  // Attach correlation ID to webhook
  const childLogger = logger.child({ traceId, type: "razorpay_webhook" });
  
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    );

    const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature || !RAZORPAY_WEBHOOK_SECRET) {
      childLogger.warn("Missing signature or webhook secret");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      childLogger.warn({ received: signature, expected: expectedSignature }, "Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    childLogger.info({ eventType: event.event }, "Received authenticated Razorpay webhook");

    const payload = event.payload;

    if (event.event === "subscription.charged" || event.event === "subscription.authenticated") {
      const subscription = payload.subscription.entity;
      const companyId = subscription.notes?.company_id; // Pass this while creating the subscription link

      if (companyId) {
        childLogger.info({ companyId, subId: subscription.id }, "Updating company subscription status");

        const { error } = await supabaseAdmin
          .from("companies")
          .update({
            subscription_status: "ACTIVE",
            razorpay_subscription_id: subscription.id,
            razorpay_customer_id: subscription.customer_id,
          })
          .eq("id", companyId);

        if (error) {
          childLogger.error({ err: error }, "Failed to update subscription in DB");
          return NextResponse.json({ error: "Database update failed" });
        }
      }
    } else if (event.event === "subscription.cancelled" || event.event === "subscription.halted") {
      const subscription = payload.subscription.entity;
      const { error } = await supabaseAdmin
        .from("companies")
        .update({ subscription_status: "CANCELLED" })
        .eq("razorpay_subscription_id", subscription.id);

      if (error) {
        childLogger.error({ err: error }, "Failed to cancel subscription in DB");
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    childLogger.error({ err: error }, "Razorpay Webhook Error");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
