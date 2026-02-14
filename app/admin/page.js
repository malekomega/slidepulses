"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [presentations, setPresentations] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({ users: 0, presentations: 0, sessions: 0, responses: 0 });

  useEffect(() => {
    const check = async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) { window.location.href = "/login"; return; }
      setUser(u);
      const { data: admin } = await supabase.from("admin_users").select("id").eq("email", u.email).single();
      if (!admin) { window.location.href = "/dashboard"; return; }
      setIsAdmin(true);
      setLoading(false);
    };
    check();
  }, []);

  const loadData = useCallback(async () => {
    const [p, s, r] = await Promise.all([
      supabase.from("presentations").select("*").order("created_at", { ascending: false }),
      supabase.from("sessions").select("*").order("created_at", { ascending: false }),
      supabase.from("responses").select("id", { count: "exact", head: true }),
    ]);
    setPresentations(p.data || []);
    setSessions(s.data || []);
    const uniqueUsers = [...new Set((p.data || []).map(x => x.user_id))].length;
    setStats({ users: uniqueUsers, presentations: (p.data || []).length, sessions: (s.data || []).length, responses: r.count || 0 });
  }, []);

  useEffect(() => { if (isAdmin) loadData(); }, [isAdmin, loadData]);

  if (loading) return <div style={{ minHeight: "100vh", background: "#060810", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 36, height: 36, border: "3px solid #1a1d2e", borderTopColor: "#6366F1", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;

  const cardStyle = { background: "#0D0F14", border: "1px solid #131520", borderRadius: 14, padding: "20px 24px" };
  const thStyle = { padding: "10px 14px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#4a5070", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #131520" };
  const tdStyle = { padding: "12px 14px", fontSize: 13, borderBottom: "1px solid #0D0F14" };

  return (
    <div style={{ minHeight: "100vh", background: "#060810", fontFamily: "'DM Sans', sans-serif", color: "#E2E8F0" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", borderBottom: "1px solid #131520", background: "#0A0C12" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #F43F5E, #EC4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff" }}>A</div>
          <span style={{ fontFamily: "'Outfit'", fontWeight: 700, fontSize: 18 }}>SlidePlus Admin</span>
          <span style={{ fontSize: 11, background: "#F43F5E20", color: "#F43F5E", padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>Admin Panel</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <a href="/dashboard" style={{ padding: "8px 16px", background: "#151825", border: "1px solid #1e2235", borderRadius: 8, color: "#94A3B8", fontSize: 13, textDecoration: "none", cursor: "pointer" }}>Dashboard</a>
          <button onClick={async () => { await supabase.auth.signOut(); window.location.href = "/login"; }} style={{ padding: "8px 16px", background: "#F43F5E15", border: "1px solid #F43F5E30", borderRadius: 8, color: "#F43F5E", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans'" }}>Logout</button>
        </div>
      </div>

      <div style={{ padding: "24px 32px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {["overview", "presentations", "sessions"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 20px", background: tab === t ? "#6366F1" : "#0D0F14", border: tab === t ? "none" : "1px solid #131520", borderRadius: 8, color: tab === t ? "#fff" : "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'", textTransform: "capitalize" }}>{t}</button>
          ))}
        </div>

        {tab === "overview" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
              {[{ label: "Total Users", value: stats.users, color: "#6366F1" }, { label: "Presentations", value: stats.presentations, color: "#8B5CF6" }, { label: "Sessions", value: stats.sessions, color: "#06B6D4" }, { label: "Total Responses", value: stats.responses, color: "#22C55E" }].map((s, i) => (
                <div key={i} style={cardStyle}>
                  <div style={{ fontSize: 12, color: "#4a5070", marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Outfit'", color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
            <div style={cardStyle}>
              <h3 style={{ fontFamily: "'Outfit'", fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Recent Presentations</h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr><th style={thStyle}>Title</th><th style={thStyle}>User ID</th><th style={thStyle}>Slides</th><th style={thStyle}>Created</th></tr></thead>
                <tbody>
                  {presentations.slice(0, 10).map(p => { let sc = 0; try { const s = typeof p.slides === "string" ? JSON.parse(p.slides) : p.slides; sc = Array.isArray(s) ? s.length : 0; } catch {} return (
                    <tr key={p.id}><td style={tdStyle}>{p.title}</td><td style={{ ...tdStyle, fontSize: 11, color: "#4a5070" }}>{p.user_id?.slice(0, 8)}...</td><td style={tdStyle}>{sc}</td><td style={{ ...tdStyle, color: "#4a5070" }}>{new Date(p.created_at).toLocaleDateString()}</td></tr>
                  ); })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "presentations" && (
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "'Outfit'", fontSize: 16, fontWeight: 600 }}>All Presentations ({presentations.length})</h3>
              <button onClick={loadData} style={{ padding: "6px 14px", background: "#151825", border: "1px solid #1e2235", borderRadius: 8, color: "#94A3B8", fontSize: 12, cursor: "pointer" }}>Refresh</button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr><th style={thStyle}>Title</th><th style={thStyle}>User ID</th><th style={thStyle}>Slides</th><th style={thStyle}>Starred</th><th style={thStyle}>Shared</th><th style={thStyle}>Created</th><th style={thStyle}>Actions</th></tr></thead>
              <tbody>
                {presentations.map(p => { let sc = 0; try { const s = typeof p.slides === "string" ? JSON.parse(p.slides) : p.slides; sc = Array.isArray(s) ? s.length : 0; } catch {} return (
                  <tr key={p.id}>
                    <td style={tdStyle}>{p.title}</td>
                    <td style={{ ...tdStyle, fontSize: 11, color: "#4a5070" }}>{p.user_id?.slice(0, 8)}...</td>
                    <td style={tdStyle}>{sc}</td>
                    <td style={tdStyle}>{p.is_starred ? "⭐" : "—"}</td>
                    <td style={tdStyle}>{p.is_shared ? "✓" : "—"}</td>
                    <td style={{ ...tdStyle, color: "#4a5070" }}>{new Date(p.created_at).toLocaleDateString()}</td>
                    <td style={tdStyle}>
                      <button onClick={async () => { if (confirm("Delete this presentation?")) { await supabase.from("presentations").delete().eq("id", p.id); loadData(); } }} style={{ background: "none", border: "none", color: "#F43F5E", cursor: "pointer", fontSize: 12 }}>Delete</button>
                    </td>
                  </tr>
                ); })}
              </tbody>
            </table>
          </div>
        )}

        {tab === "sessions" && (
          <div style={cardStyle}>
            <h3 style={{ fontFamily: "'Outfit'", fontSize: 16, fontWeight: 600, marginBottom: 16 }}>All Sessions ({sessions.length})</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr><th style={thStyle}>Join Code</th><th style={thStyle}>Presentation ID</th><th style={thStyle}>Active</th><th style={thStyle}>Created</th><th style={thStyle}>Actions</th></tr></thead>
              <tbody>
                {sessions.map(s => (
                  <tr key={s.id}>
                    <td style={{ ...tdStyle, fontWeight: 600, color: "#6366F1" }}>{s.join_code}</td>
                    <td style={{ ...tdStyle, fontSize: 11, color: "#4a5070" }}>{s.presentation_id?.slice(0, 8)}...</td>
                    <td style={tdStyle}><span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: s.is_active ? "#22C55E20" : "#F43F5E20", color: s.is_active ? "#22C55E" : "#F43F5E" }}>{s.is_active ? "Active" : "Ended"}</span></td>
                    <td style={{ ...tdStyle, color: "#4a5070" }}>{new Date(s.created_at).toLocaleDateString()}</td>
                    <td style={tdStyle}>
                      {s.is_active && <button onClick={async () => { await supabase.from("sessions").update({ is_active: false }).eq("id", s.id); loadData(); }} style={{ background: "none", border: "none", color: "#F43F5E", cursor: "pointer", fontSize: 12 }}>End Session</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}