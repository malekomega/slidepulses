import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  // Simple auth check via header
  const authHeader = request.headers.get("x-admin-token");
  if (authHeader !== "sp_admin_access") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    // Fetch all data in parallel
    const [presRes, sessRes, respRes, subRes, authUsersRes] = await Promise.all([
      supabase.from("presentations").select("*").order("created_at", { ascending: false }),
      supabase.from("sessions").select("*").order("created_at", { ascending: false }),
      supabase.from("responses").select("id", { count: "exact", head: true }),
      supabase.from("subscriptions").select("*").order("created_at", { ascending: false }),
      supabase.auth.admin.listUsers({ perPage: 1000 }),
    ]);

    // Build user map from auth users (real names and emails)
    const authUsers = authUsersRes.data?.users || [];
    const authMap = {};
    authUsers.forEach(u => {
      authMap[u.id] = {
        id: u.id,
        email: u.email || "",
        name: u.user_metadata?.full_name || u.email?.split("@")[0] || "Unknown",
        created_at: u.created_at,
        last_sign_in: u.last_sign_in_at,
      };
    });

    // Merge presentation counts into users
    const presentations = presRes.data || [];
    const presCounts = {};
    presentations.forEach(p => {
      if (p.user_id) {
        presCounts[p.user_id] = (presCounts[p.user_id] || 0) + 1;
      }
    });

    // Merge subscription info
    const subscriptions = subRes.data || [];
    const subMap = {};
    subscriptions.forEach(s => {
      if (s.user_id && s.user_id !== "00000000-0000-0000-0000-000000000000") subMap[s.user_id] = s;
      if (s.user_email) subMap[s.user_email] = s;
    });

    // Build complete users list from auth
    const users = authUsers.map(u => {
      const sub = subMap[u.id] || subMap[u.email?.toLowerCase()] || null;
      return {
        id: u.id,
        email: u.email || "",
        name: u.user_metadata?.full_name || u.email?.split("@")[0] || "Unknown",
        created_at: u.created_at,
        last_sign_in: u.last_sign_in_at,
        presentations: presCounts[u.id] || 0,
        plan: (sub?.plan === "pro" && sub?.status === "active") ? "pro" : "free",
        sub_status: sub?.status || "none",
      };
    });

    return new Response(JSON.stringify({
      presentations,
      sessions: sessRes.data || [],
      responses: respRes.count || 0,
      subscriptions,
      users,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Admin API error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// POST: Admin actions (set_plan, delete_presentation, end_session)
export async function POST(request) {
  const authHeader = request.headers.get("x-admin-token");
  if (authHeader !== "sp_admin_access") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const body = await request.json();
    const { action } = body;

    if (action === "set_plan") {
      const { user_id, email, plan } = body;
      // Check if subscription exists
      const { data: existing } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", user_id)
        .single();

      if (existing) {
        await supabase.from("subscriptions").update({
          plan, status: "active", updated_at: new Date().toISOString(),
        }).eq("id", existing.id);
      } else {
        await supabase.from("subscriptions").insert({
          user_id, user_email: email?.toLowerCase() || "", plan, status: "active",
        });
      }
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    if (action === "delete_presentation") {
      const { id } = body;
      await supabase.from("presentations").delete().eq("id", id);
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    if (action === "end_session") {
      const { id } = body;
      await supabase.from("sessions").update({ is_active: false }).eq("id", id);
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400 });
  } catch (err) {
    console.error("Admin action error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
