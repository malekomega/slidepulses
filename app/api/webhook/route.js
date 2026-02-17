import { createClient } from "@supabase/supabase-js";

// Use service role key for webhook (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const event = body.meta?.event_name;
    const data = body.data?.attributes;

    console.log("Webhook event:", event);

    if (!event || !data) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 });
    }

    const email = data.user_email || data.customer_email || "";
    const lsOrderId = String(body.data?.id || "");
    const lsSubId = data.subscription_id ? String(data.subscription_id) : (data.id ? String(data.id) : "");

    // Determine plan from variant or product
    const variantId = data.variant_id || data.first_order_item?.variant_id || "";
    // Monthly variant or Annual variant - both are "pro"
    const plan = "pro";

    if (event === "order_created" || event === "subscription_created") {
      // New purchase - activate Pro
      if (!email) {
        return new Response(JSON.stringify({ error: "No email" }), { status: 400 });
      }

      // Check if subscription already exists for this email
      const { data: existing } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_email", email.toLowerCase())
        .single();

      if (existing) {
        // Update existing
        await supabase
          .from("subscriptions")
          .update({
            plan: plan,
            status: "active",
            lemon_squeezy_id: lsSubId,
            lemon_squeezy_order_id: lsOrderId,
            current_period_end: data.ends_at || data.renews_at || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
      } else {
        // Try to find user_id from Supabase auth by email
        let userId = null;
        const { data: authUsers } = await supabase.auth.admin.listUsers();
        if (authUsers?.users) {
          const found = authUsers.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
          if (found) userId = found.id;
        }

        // Insert new subscription
        await supabase.from("subscriptions").insert({
          user_id: userId || "00000000-0000-0000-0000-000000000000",
          user_email: email.toLowerCase(),
          plan: plan,
          status: "active",
          lemon_squeezy_id: lsSubId,
          lemon_squeezy_order_id: lsOrderId,
          current_period_end: data.ends_at || data.renews_at || null,
        });
      }

      console.log(`Pro activated for ${email}`);
    }

    if (event === "subscription_updated") {
      const status = data.status; // active, past_due, cancelled, expired
      const mappedStatus = ["active", "on_trial"].includes(status) ? "active" : status === "past_due" ? "past_due" : "cancelled";

      await supabase
        .from("subscriptions")
        .update({
          status: mappedStatus,
          plan: mappedStatus === "active" ? "pro" : "free",
          current_period_end: data.ends_at || data.renews_at || null,
          updated_at: new Date().toISOString(),
        })
        .eq("user_email", email.toLowerCase());

      console.log(`Subscription updated for ${email}: ${mappedStatus}`);
    }

    if (event === "subscription_cancelled" || event === "subscription_expired") {
      await supabase
        .from("subscriptions")
        .update({
          status: "cancelled",
          plan: "free",
          updated_at: new Date().toISOString(),
        })
        .eq("user_email", email.toLowerCase());

      console.log(`Pro cancelled for ${email}`);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// Lemon Squeezy may also send GET for verification
export async function GET() {
  return new Response(JSON.stringify({ status: "Webhook endpoint active" }), { status: 200 });
}
