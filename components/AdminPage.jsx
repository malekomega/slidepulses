"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

/* ─── Hardcoded Admin Credentials ─── */
const ADMIN_USER = "malekomega";
const ADMIN_PASS = "homs.111";

/* ─── Icons ─── */
const Icons = {
  Lock: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  User: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Users: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Grid: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Slides: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>,
  Play: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>,
  BarChart: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
  Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  StopCircle: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><rect x="9" y="9" width="6" height="6"/></svg>,
  RefreshCw: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  LogOut: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Eye: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Shield: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="url(#sg)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#F43F5E"/><stop offset="100%" stopColor="#EC4899"/></linearGradient></defs><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
};

/* ─── Admin Login Screen ─── */
function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (username === ADMIN_USER && password === ADMIN_PASS) {
        sessionStorage.setItem("sp_admin", "true");
        onLogin();
      } else {
        setError("Invalid credentials");
      }
      setLoading(false);
    }, 600);
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px 12px 44px", background: "#0D0F14",
    border: "1px solid #1e2235", borderRadius: 10, color: "#E2E8F0",
    fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none",
    boxSizing: "border-box", transition: "border-color 0.2s",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#060810", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", padding: 20 }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes shieldGlow { 0%, 100% { filter: drop-shadow(0 0 8px #F43F5E30); } 50% { filter: drop-shadow(0 0 20px #F43F5E50); } }
        .admin-input:focus { border-color: #F43F5E !important; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 400, animation: "fadeUp 0.5s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", animation: "shieldGlow 3s ease-in-out infinite", marginBottom: 16 }}>
            <Icons.Shield />
          </div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 26, fontWeight: 700, color: "#E2E8F0", margin: "0 0 6px" }}>Admin Access</h1>
          <p style={{ color: "#4a5070", fontSize: 14, margin: 0 }}>SlidePlus Control Panel</p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: "#0A0C12", border: "1px solid #131520", borderRadius: 16, padding: "32px 28px" }}>
          {error && (
            <div style={{ background: "#F43F5E15", border: "1px solid #F43F5E30", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#F43F5E", textAlign: "center" }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 14, position: "relative" }}>
            <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#4a5070" }}><Icons.User /></div>
            <input
              className="admin-input"
              type="text" placeholder="Username" value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
              autoComplete="off"
            />
          </div>

          <div style={{ marginBottom: 20, position: "relative" }}>
            <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#4a5070" }}><Icons.Lock /></div>
            <input
              className="admin-input"
              type={showPw ? "text" : "password"} placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#4a5070", cursor: "pointer", padding: 0 }}>
              <Icons.Eye />
            </button>
          </div>

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "13px", background: loading ? "#F43F5E80" : "linear-gradient(135deg, #F43F5E, #EC4899)",
            border: "none", borderRadius: 10, color: "#fff", fontSize: 15, fontWeight: 600,
            cursor: loading ? "default" : "pointer", fontFamily: "'DM Sans', sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            {loading ? <div style={{ width: 18, height: 18, border: "2px solid #fff4", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} /> : null}
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>

        <p style={{ textAlign: "center", color: "#2a2d40", fontSize: 12, marginTop: 24 }}>
          This area is restricted to authorized personnel only.
        </p>
      </div>
    </div>
  );
}

/* ─── Stat Card ─── */
function StatCard({ label, value, color, icon }) {
  return (
    <div style={{ background: "#0D0F14", border: "1px solid #131520", borderRadius: 14, padding: "20px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 16, right: 16, color: color + "30" }}>{icon}</div>
      <div style={{ fontSize: 12, color: "#4a5070", marginBottom: 8, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Outfit', sans-serif", color }}>{value}</div>
    </div>
  );
}

/* ─── Main Admin Panel ─── */
function AdminPanel({ onLogout }) {
  const [tab, setTab] = useState("overview");
  const [presentations, setPresentations] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [responses, setResponses] = useState(0);
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, sRes, rRes, subRes] = await Promise.all([
        supabase.from("presentations").select("*").order("created_at", { ascending: false }),
        supabase.from("sessions").select("*").order("created_at", { ascending: false }),
        supabase.from("responses").select("id", { count: "exact", head: true }),
        supabase.from("subscriptions").select("*").order("created_at", { ascending: false }),
      ]);
      setPresentations(pRes.data || []);
      setSessions(sRes.data || []);
      setResponses(rRes.count || 0);
      setSubscriptions(subRes.data || []);

      // Extract unique users from presentations, merge with subscription data
      const subMap = {};
      (subRes.data || []).forEach(s => {
        if (s.user_id) subMap[s.user_id] = s;
        if (s.user_email) subMap[s.user_email] = s;
      });

      const userMap = {};
      (pRes.data || []).forEach(p => {
        if (p.user_id && !userMap[p.user_id]) {
          const sub = subMap[p.user_id];
          userMap[p.user_id] = {
            id: p.user_id,
            presentations: 0,
            lastActive: p.created_at,
            plan: sub?.plan || "free",
            subStatus: sub?.status || "none",
          };
        }
        if (p.user_id) userMap[p.user_id].presentations++;
      });
      setUsers(Object.values(userMap));
    } catch (err) {
      console.error("Load failed:", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const getSlideCount = (p) => {
    try {
      const s = typeof p.slides === "string" ? JSON.parse(p.slides) : p.slides;
      return Array.isArray(s) ? s.length : 0;
    } catch { return 0; }
  };

  const deletePresentation = async (id) => {
    if (!confirm("Delete this presentation? This cannot be undone.")) return;
    await supabase.from("presentations").delete().eq("id", id);
    loadData();
  };

  const endSession = async (id) => {
    await supabase.from("sessions").update({ is_active: false }).eq("id", id);
    loadData();
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <Icons.Grid /> },
    { id: "presentations", label: "Presentations", icon: <Icons.Slides /> },
    { id: "sessions", label: "Sessions", icon: <Icons.Play /> },
    { id: "users", label: "Users", icon: <Icons.Users /> },
    { id: "subscriptions", label: "Subscriptions", icon: <Icons.BarChart /> },
  ];

  const thStyle = { padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#4a5070", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #131520" };
  const tdStyle = { padding: "12px 14px", fontSize: 13, borderBottom: "1px solid #0e1018" };
  const cardStyle = { background: "#0D0F14", border: "1px solid #131520", borderRadius: 14, padding: "24px" };

  const filteredPresentations = presentations.filter(p =>
    !searchTerm || (p.title || "").toLowerCase().includes(searchTerm.toLowerCase()) || (p.user_id || "").includes(searchTerm)
  );

  return (
    <div style={{ minHeight: "100vh", background: "#060810", fontFamily: "'DM Sans', sans-serif", color: "#E2E8F0" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 28px", borderBottom: "1px solid #131520", background: "#0A0C12" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #F43F5E, #EC4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff" }}>A</div>
          <span style={{ fontFamily: "'Outfit'", fontWeight: 700, fontSize: 17 }}>SlidePlus</span>
          <span style={{ fontSize: 10, background: "#F43F5E18", color: "#F43F5E", padding: "3px 10px", borderRadius: 6, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Admin</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a href="/dashboard" style={{ padding: "7px 16px", background: "#151825", border: "1px solid #1e2235", borderRadius: 8, color: "#94A3B8", fontSize: 12, textDecoration: "none", fontWeight: 500 }}>Dashboard</a>
          <button onClick={onLogout} style={{ padding: "7px 16px", background: "#F43F5E12", border: "1px solid #F43F5E25", borderRadius: 8, color: "#F43F5E", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans'", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
            <Icons.LogOut /> Logout
          </button>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 57px)" }}>
        {/* Sidebar */}
        <div style={{ width: 220, borderRight: "1px solid #131520", background: "#0A0C12", padding: "20px 12px", flexShrink: 0 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
              background: tab === t.id ? "#F43F5E15" : "transparent",
              border: tab === t.id ? "1px solid #F43F5E25" : "1px solid transparent",
              borderRadius: 10, color: tab === t.id ? "#F43F5E" : "#64748B",
              fontSize: 13, fontWeight: tab === t.id ? 600 : 500, cursor: "pointer",
              fontFamily: "'DM Sans'", marginBottom: 4, textAlign: "left", transition: "all 0.15s",
            }}>
              {t.icon} {t.label}
            </button>
          ))}

          <div style={{ borderTop: "1px solid #131520", margin: "16px 0", padding: "16px 14px 0" }}>
            <div style={{ fontSize: 10, color: "#2a2d40", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Quick Stats</div>
            <div style={{ fontSize: 12, color: "#4a5070", lineHeight: 2 }}>
              <div>{presentations.length} presentations</div>
              <div>{sessions.filter(s => s.is_active).length} active sessions</div>
              <div>{users.length} users</div>
              <div style={{ color: "#6366F1" }}>{subscriptions.filter(s => s.plan === "pro" && s.status === "active").length} pro subscribers</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: "24px 28px", overflowX: "auto" }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
              <div style={{ width: 32, height: 32, border: "3px solid #1a1d2e", borderTopColor: "#F43F5E", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            </div>
          ) : (
            <>
              {/* OVERVIEW TAB */}
              {tab === "overview" && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <h2 style={{ fontFamily: "'Outfit'", fontSize: 22, fontWeight: 700, margin: 0 }}>Overview</h2>
                    <button onClick={loadData} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#151825", border: "1px solid #1e2235", borderRadius: 8, color: "#94A3B8", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans'" }}>
                      <Icons.RefreshCw /> Refresh
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
                    <StatCard label="Total Users" value={users.length} color="#6366F1" icon={<Icons.Users />} />
                    <StatCard label="Pro Users" value={subscriptions.filter(s => s.plan === "pro" && s.status === "active").length} color="#F59E0B" icon={<Icons.BarChart />} />
                    <StatCard label="Presentations" value={presentations.length} color="#8B5CF6" icon={<Icons.Slides />} />
                    <StatCard label="Sessions" value={sessions.length} color="#06B6D4" icon={<Icons.Play />} />
                    <StatCard label="Total Responses" value={responses} color="#22C55E" icon={<Icons.BarChart />} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div style={cardStyle}>
                      <h3 style={{ fontFamily: "'Outfit'", fontSize: 15, fontWeight: 600, marginBottom: 16, color: "#94A3B8" }}>Recent Presentations</h3>
                      {presentations.slice(0, 6).map(p => (
                        <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #0e1018" }}>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 500 }}>{p.title || "Untitled"}</div>
                            <div style={{ fontSize: 11, color: "#4a5070" }}>{getSlideCount(p)} slides</div>
                          </div>
                          <div style={{ fontSize: 11, color: "#4a5070" }}>{new Date(p.created_at).toLocaleDateString()}</div>
                        </div>
                      ))}
                    </div>

                    <div style={cardStyle}>
                      <h3 style={{ fontFamily: "'Outfit'", fontSize: 15, fontWeight: 600, marginBottom: 16, color: "#94A3B8" }}>Active Sessions</h3>
                      {sessions.filter(s => s.is_active).length === 0 ? (
                        <p style={{ fontSize: 13, color: "#2a2d40" }}>No active sessions</p>
                      ) : (
                        sessions.filter(s => s.is_active).slice(0, 6).map(s => (
                          <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #0e1018" }}>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 600, color: "#6366F1" }}>{s.join_code}</div>
                              <div style={{ fontSize: 11, color: "#4a5070" }}>{new Date(s.created_at).toLocaleString()}</div>
                            </div>
                            <button onClick={() => endSession(s.id)} style={{ background: "#F43F5E12", border: "1px solid #F43F5E25", borderRadius: 6, color: "#F43F5E", fontSize: 11, padding: "4px 10px", cursor: "pointer", fontFamily: "'DM Sans'", display: "flex", alignItems: "center", gap: 4 }}>
                              <Icons.StopCircle /> End
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* PRESENTATIONS TAB */}
              {tab === "presentations" && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <h2 style={{ fontFamily: "'Outfit'", fontSize: 22, fontWeight: 700, margin: 0 }}>Presentations <span style={{ fontSize: 14, color: "#4a5070", fontWeight: 400 }}>({presentations.length})</span></h2>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        type="text" placeholder="Search..." value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: "7px 14px", background: "#0D0F14", border: "1px solid #1e2235", borderRadius: 8, color: "#E2E8F0", fontSize: 12, fontFamily: "'DM Sans'", outline: "none", width: 200 }}
                      />
                      <button onClick={loadData} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#151825", border: "1px solid #1e2235", borderRadius: 8, color: "#94A3B8", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans'" }}>
                        <Icons.RefreshCw /> Refresh
                      </button>
                    </div>
                  </div>

                  <div style={cardStyle}>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                        <thead>
                          <tr>
                            <th style={thStyle}>Title</th>
                            <th style={thStyle}>User ID</th>
                            <th style={thStyle}>Slides</th>
                            <th style={thStyle}>Starred</th>
                            <th style={thStyle}>Shared</th>
                            <th style={thStyle}>Created</th>
                            <th style={thStyle}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPresentations.map(p => (
                            <tr key={p.id} style={{ transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#0e1018"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                              <td style={{ ...tdStyle, fontWeight: 500 }}>{p.title || "Untitled"}</td>
                              <td style={{ ...tdStyle, fontSize: 11, color: "#4a5070", fontFamily: "monospace" }}>{p.user_id?.slice(0, 8)}...</td>
                              <td style={tdStyle}>{getSlideCount(p)}</td>
                              <td style={tdStyle}>{p.is_starred ? "⭐" : "—"}</td>
                              <td style={tdStyle}>
                                {p.is_shared ? <span style={{ color: "#22C55E", fontSize: 11, fontWeight: 600 }}>Shared</span> : <span style={{ color: "#4a5070" }}>—</span>}
                              </td>
                              <td style={{ ...tdStyle, color: "#4a5070", fontSize: 12 }}>{new Date(p.created_at).toLocaleDateString()}</td>
                              <td style={tdStyle}>
                                <button onClick={() => deletePresentation(p.id)} style={{ background: "#F43F5E12", border: "1px solid #F43F5E25", borderRadius: 6, color: "#F43F5E", fontSize: 11, padding: "4px 10px", cursor: "pointer", fontFamily: "'DM Sans'", display: "inline-flex", alignItems: "center", gap: 4 }}>
                                  <Icons.Trash /> Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {filteredPresentations.length === 0 && (
                      <p style={{ textAlign: "center", color: "#2a2d40", fontSize: 13, padding: 20 }}>No presentations found</p>
                    )}
                  </div>
                </>
              )}

              {/* SESSIONS TAB */}
              {tab === "sessions" && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <h2 style={{ fontFamily: "'Outfit'", fontSize: 22, fontWeight: 700, margin: 0 }}>Sessions <span style={{ fontSize: 14, color: "#4a5070", fontWeight: 400 }}>({sessions.length})</span></h2>
                    <button onClick={loadData} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#151825", border: "1px solid #1e2235", borderRadius: 8, color: "#94A3B8", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans'" }}>
                      <Icons.RefreshCw /> Refresh
                    </button>
                  </div>

                  <div style={cardStyle}>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                        <thead>
                          <tr>
                            <th style={thStyle}>Join Code</th>
                            <th style={thStyle}>Presentation ID</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Created</th>
                            <th style={thStyle}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sessions.map(s => (
                            <tr key={s.id} style={{ transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#0e1018"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                              <td style={{ ...tdStyle, fontWeight: 700, color: "#6366F1", fontSize: 15 }}>{s.join_code}</td>
                              <td style={{ ...tdStyle, fontSize: 11, color: "#4a5070", fontFamily: "monospace" }}>{s.presentation_id?.slice(0, 12)}...</td>
                              <td style={tdStyle}>
                                <span style={{
                                  padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                                  background: s.is_active ? "#22C55E15" : "#F43F5E15",
                                  color: s.is_active ? "#22C55E" : "#F43F5E",
                                  border: `1px solid ${s.is_active ? "#22C55E25" : "#F43F5E25"}`,
                                }}>
                                  {s.is_active ? "Active" : "Ended"}
                                </span>
                              </td>
                              <td style={{ ...tdStyle, color: "#4a5070", fontSize: 12 }}>{new Date(s.created_at).toLocaleString()}</td>
                              <td style={tdStyle}>
                                {s.is_active && (
                                  <button onClick={() => endSession(s.id)} style={{ background: "#F43F5E12", border: "1px solid #F43F5E25", borderRadius: 6, color: "#F43F5E", fontSize: 11, padding: "4px 10px", cursor: "pointer", fontFamily: "'DM Sans'", display: "inline-flex", alignItems: "center", gap: 4 }}>
                                    <Icons.StopCircle /> End Session
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {sessions.length === 0 && (
                      <p style={{ textAlign: "center", color: "#2a2d40", fontSize: 13, padding: 20 }}>No sessions yet</p>
                    )}
                  </div>
                </>
              )}

              {/* USERS TAB */}
              {tab === "users" && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <h2 style={{ fontFamily: "'Outfit'", fontSize: 22, fontWeight: 700, margin: 0 }}>Users <span style={{ fontSize: 14, color: "#4a5070", fontWeight: 400 }}>({users.length})</span></h2>
                    <button onClick={loadData} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#151825", border: "1px solid #1e2235", borderRadius: 8, color: "#94A3B8", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans'" }}>
                      <Icons.RefreshCw /> Refresh
                    </button>
                  </div>

                  <div style={cardStyle}>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                        <thead>
                          <tr>
                            <th style={thStyle}>User ID</th>
                            <th style={thStyle}>Plan</th>
                            <th style={thStyle}>Presentations</th>
                            <th style={thStyle}>Last Active</th>
                            <th style={thStyle}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map(u => (
                            <tr key={u.id} style={{ transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#0e1018"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                              <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 12, color: "#94A3B8" }}>{u.id}</td>
                              <td style={tdStyle}>
                                <span style={{
                                  padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                                  background: u.plan === "pro" ? "#6366F115" : "#F59E0B15",
                                  color: u.plan === "pro" ? "#6366F1" : "#F59E0B",
                                  border: `1px solid ${u.plan === "pro" ? "#6366F125" : "#F59E0B25"}`,
                                  textTransform: "uppercase",
                                }}>
                                  {u.plan || "free"}
                                </span>
                              </td>
                              <td style={tdStyle}>
                                <span style={{ background: "#6366F115", color: "#6366F1", padding: "2px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 }}>{u.presentations}</span>
                              </td>
                              <td style={{ ...tdStyle, color: "#4a5070", fontSize: 12 }}>{new Date(u.lastActive).toLocaleDateString()}</td>
                              <td style={tdStyle}>
                                <button onClick={async () => {
                                  const newPlan = u.plan === "pro" ? "free" : "pro";
                                  const { data: existing } = await supabase.from("subscriptions").select("id").eq("user_id", u.id).single();
                                  if (existing) {
                                    await supabase.from("subscriptions").update({ plan: newPlan, status: "active", updated_at: new Date().toISOString() }).eq("id", existing.id);
                                  } else {
                                    await supabase.from("subscriptions").insert({ user_id: u.id, user_email: "", plan: newPlan, status: "active" });
                                  }
                                  loadData();
                                }} style={{
                                  background: u.plan === "pro" ? "#F43F5E12" : "#22C55E12",
                                  border: `1px solid ${u.plan === "pro" ? "#F43F5E25" : "#22C55E25"}`,
                                  borderRadius: 6, color: u.plan === "pro" ? "#F43F5E" : "#22C55E",
                                  fontSize: 11, padding: "4px 10px", cursor: "pointer", fontFamily: "'DM Sans'",
                                }}>
                                  {u.plan === "pro" ? "Downgrade" : "Upgrade to Pro"}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {users.length === 0 && (
                      <p style={{ textAlign: "center", color: "#2a2d40", fontSize: 13, padding: 20 }}>No users yet</p>
                    )}
                  </div>
                </>
              )}

              {/* SUBSCRIPTIONS TAB */}
              {tab === "subscriptions" && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <h2 style={{ fontFamily: "'Outfit'", fontSize: 22, fontWeight: 700, margin: 0 }}>Subscriptions <span style={{ fontSize: 14, color: "#4a5070", fontWeight: 400 }}>({subscriptions.length})</span></h2>
                    <button onClick={loadData} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#151825", border: "1px solid #1e2235", borderRadius: 8, color: "#94A3B8", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans'" }}>
                      <Icons.RefreshCw /> Refresh
                    </button>
                  </div>

                  {/* Summary cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
                    <div style={cardStyle}>
                      <div style={{ fontSize: 11, color: "#4a5070", marginBottom: 6, textTransform: "uppercase", fontWeight: 600 }}>Active Pro</div>
                      <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Outfit'", color: "#22C55E" }}>{subscriptions.filter(s => s.plan === "pro" && s.status === "active").length}</div>
                    </div>
                    <div style={cardStyle}>
                      <div style={{ fontSize: 11, color: "#4a5070", marginBottom: 6, textTransform: "uppercase", fontWeight: 600 }}>Cancelled</div>
                      <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Outfit'", color: "#F43F5E" }}>{subscriptions.filter(s => s.status === "cancelled").length}</div>
                    </div>
                    <div style={cardStyle}>
                      <div style={{ fontSize: 11, color: "#4a5070", marginBottom: 6, textTransform: "uppercase", fontWeight: 600 }}>Free Users</div>
                      <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Outfit'", color: "#F59E0B" }}>{users.length - subscriptions.filter(s => s.plan === "pro" && s.status === "active").length}</div>
                    </div>
                  </div>

                  <div style={cardStyle}>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                        <thead>
                          <tr>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Plan</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Lemon Squeezy ID</th>
                            <th style={thStyle}>Period End</th>
                            <th style={thStyle}>Created</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subscriptions.map(s => (
                            <tr key={s.id} style={{ transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#0e1018"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                              <td style={{ ...tdStyle, fontWeight: 500 }}>{s.user_email || "—"}</td>
                              <td style={tdStyle}>
                                <span style={{
                                  padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                                  background: s.plan === "pro" ? "#6366F115" : "#F59E0B15",
                                  color: s.plan === "pro" ? "#6366F1" : "#F59E0B",
                                  textTransform: "uppercase",
                                }}>{s.plan}</span>
                              </td>
                              <td style={tdStyle}>
                                <span style={{
                                  padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                                  background: s.status === "active" ? "#22C55E15" : "#F43F5E15",
                                  color: s.status === "active" ? "#22C55E" : "#F43F5E",
                                }}>{s.status}</span>
                              </td>
                              <td style={{ ...tdStyle, fontSize: 11, color: "#4a5070", fontFamily: "monospace" }}>{s.lemon_squeezy_id || "—"}</td>
                              <td style={{ ...tdStyle, color: "#4a5070", fontSize: 12 }}>{s.current_period_end ? new Date(s.current_period_end).toLocaleDateString() : "—"}</td>
                              <td style={{ ...tdStyle, color: "#4a5070", fontSize: 12 }}>{new Date(s.created_at).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {subscriptions.length === 0 && (
                      <p style={{ textAlign: "center", color: "#2a2d40", fontSize: 13, padding: 20 }}>No subscriptions yet</p>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Export ─── */
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("sp_admin");
    setAuthed(stored === "true");
    setChecking(false);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("sp_admin");
    setAuthed(false);
  };

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", background: "#060810", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, border: "3px solid #1a1d2e", borderTopColor: "#F43F5E", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;
  return <AdminPanel onLogout={handleLogout} />;
}
