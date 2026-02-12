"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

// ─── ICONS ───
const I = {
  Eye: ({ off }) => off ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Mail: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>,
  Lock: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  User: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Google: () => <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>,
  Microsoft: () => <svg width="18" height="18" viewBox="0 0 24 24"><rect x="1" y="1" width="10" height="10" fill="#F25022"/><rect x="13" y="1" width="10" height="10" fill="#7FBA00"/><rect x="1" y="13" width="10" height="10" fill="#00A4EF"/><rect x="13" y="13" width="10" height="10" fill="#FFB900"/></svg>,
  Plus: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>,
  Search: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  Grid: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  List: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Clock: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  Play: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>,
  Edit: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14"/></svg>,
  Copy: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
  Share: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  MoreH: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/></svg>,
  Home: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Folder: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
  Star: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  Logout: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
  Check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>,
  Alert: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Slides: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  Users: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  Zap: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  ArrowR: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
};


// ─── GRADIENT COLORS ───
const GRADIENTS = [
  "linear-gradient(135deg, #6366F1, #8B5CF6)",
  "linear-gradient(135deg, #EC4899, #F43F5E)",
  "linear-gradient(135deg, #06B6D4, #3B82F6)",
  "linear-gradient(135deg, #F97316, #EAB308)",
  "linear-gradient(135deg, #22C55E, #06B6D4)",
  "linear-gradient(135deg, #8B5CF6, #EC4899)",
];

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return Math.floor(diff / 60) + " min ago";
  if (diff < 86400) return Math.floor(diff / 3600) + " hours ago";
  if (diff < 604800) return Math.floor(diff / 86400) + " days ago";
  return d.toLocaleDateString();
}

// ─── ANIMATED BACKGROUND ───
function AuthBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", background: "#060810" }}>
      <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, #6366F115 0%, transparent 70%)", top: "-15%", right: "-10%", animation: "pulse1 8s ease-in-out infinite" }} />
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, #8B5CF610 0%, transparent 70%)", bottom: "-10%", left: "-5%", animation: "pulse2 10s ease-in-out infinite" }} />
      <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, #EC489908 0%, transparent 70%)", top: "40%", left: "30%", animation: "pulse1 12s ease-in-out infinite reverse" }} />
      {/* Grid lines */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.03 }}>
        {Array.from({ length: 30 }, (_, i) => <line key={`v${i}`} x1={`${i * 3.33}%`} y1="0" x2={`${i * 3.33}%`} y2="100%" stroke="#6366F1" strokeWidth="0.5" />)}
        {Array.from({ length: 20 }, (_, i) => <line key={`h${i}`} x1="0" y1={`${i * 5}%`} x2="100%" y2={`${i * 5}%`} stroke="#6366F1" strokeWidth="0.5" />)}
      </svg>
      <style>{`
        @keyframes pulse1 { 0%, 100% { transform: scale(1) translate(0, 0); } 50% { transform: scale(1.15) translate(20px, -15px); } }
        @keyframes pulse2 { 0%, 100% { transform: scale(1) translate(0, 0); } 50% { transform: scale(1.1) translate(-15px, 20px); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ─── LOGO ───
function Logo({ size = 32 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: size, height: size, borderRadius: size * 0.22, background: "linear-gradient(135deg, #6366F1, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.5, fontWeight: 800, color: "#fff", fontFamily: "'Outfit', sans-serif" }}>S</div>
      <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: size * 0.56, letterSpacing: "-0.02em", color: "#E2E8F0" }}>SlidePulse</span>
    </div>
  );
}

// ─── INPUT COMPONENT ───
function AuthInput({ icon, type: initialType, placeholder, value, onChange, error }) {
  const [showPw, setShowPw] = useState(false);
  const isPw = initialType === "password";
  const type = isPw && showPw ? "text" : initialType;
  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: error ? "#F43F5E" : "#4a5070", display: "flex", transition: "color 0.2s" }}>{icon}</div>
      <input
        type={type} placeholder={placeholder} value={value} onChange={onChange}
        style={{
          width: "100%", padding: "13px 14px 13px 44px", background: "#0D0F14", border: `1.5px solid ${error ? "#F43F5E40" : "#1a1d2e"}`,
          borderRadius: 10, color: "#E2E8F0", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none",
          transition: "border-color 0.2s, box-shadow 0.2s", boxSizing: "border-box",
        }}
        onFocus={e => { e.target.style.borderColor = error ? "#F43F5E" : "#6366F1"; e.target.style.boxShadow = `0 0 0 3px ${error ? "#F43F5E15" : "#6366F115"}`; }}
        onBlur={e => { e.target.style.borderColor = error ? "#F43F5E40" : "#1a1d2e"; e.target.style.boxShadow = "none"; }}
      />
      {isPw && (
        <button onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#4a5070", cursor: "pointer", display: "flex", padding: 4 }}>
          <I.Eye off={!showPw} />
        </button>
      )}
      {error && <div style={{ fontSize: 11, color: "#F43F5E", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><I.Alert /> {error}</div>}
    </div>
  );
}

// ─── PRIMARY BUTTON ───
function PrimaryBtn({ children, onClick, loading, disabled, style: sx }) {
  return (
    <button onClick={onClick} disabled={disabled || loading}
      style={{
        width: "100%", padding: "13px 20px", background: disabled ? "#2a2e45" : "linear-gradient(135deg, #6366F1, #7C3AED)",
        border: "none", borderRadius: 10, color: disabled ? "#4a5070" : "#fff", fontSize: 15, fontWeight: 600,
        fontFamily: "'DM Sans', sans-serif", cursor: disabled ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        transition: "all 0.2s", position: "relative", overflow: "hidden", ...sx,
      }}
      onMouseEnter={e => { if (!disabled) e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 8px 24px #6366F130"; }}
      onMouseLeave={e => { e.target.style.transform = "none"; e.target.style.boxShadow = "none"; }}>
      {loading ? <div style={{ width: 18, height: 18, border: "2px solid #ffffff40", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} /> : children}
    </button>
  );
}

// ─── SOCIAL BUTTON ───
function SocialBtn({ icon, label, onClick }) {
  return (
    <button onClick={onClick}
      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px 16px", background: "#0D0F14", border: "1.5px solid #1a1d2e", borderRadius: 10, color: "#94A3B8", fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "all 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "#2a2e45"; e.currentTarget.style.background = "#111320"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#1a1d2e"; e.currentTarget.style.background = "#0D0F14"; }}>
      {icon} {label}
    </button>
  );
}

// ─── DIVIDER ───
function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "4px 0" }}>
      <div style={{ flex: 1, height: 1, background: "#1a1d2e" }} />
      <span style={{ fontSize: 12, color: "#4a5070", fontWeight: 500 }}>or</span>
      <div style={{ flex: 1, height: 1, background: "#1a1d2e" }} />
    </div>
  );
}

// ─── STRENGTH METER ───
function PasswordStrength({ password }) {
  const getStrength = (pw) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };
  const str = getStrength(password);
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#F43F5E", "#F97316", "#EAB308", "#22C55E"];
  if (!password) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
      <div style={{ flex: 1, display: "flex", gap: 3 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= str ? colors[str] : "#1a1d2e", transition: "background 0.3s" }} />
        ))}
      </div>
      <span style={{ fontSize: 11, color: colors[str], fontWeight: 500, minWidth: 40 }}>{labels[str]}</span>
    </div>
  );
}

// ═══════════════════════════════════════
// ─── LOGIN PAGE ───
// ═══════════════════════════════════════
function LoginPage({ onSwitch, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const validate = () => {
    const e = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Invalid email address";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Minimum 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

 const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      onLogin({ id: data.user.id, email: data.user.email, name: data.user.user_metadata?.full_name || email.split("@")[0] });
    } catch (err) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 420, animation: "fadeUp 0.5s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}><Logo size={36} /></div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 700, color: "#E2E8F0", margin: "0 0 8px" }}>Welcome back</h1>
          <p style={{ color: "#4a5070", fontSize: 15, margin: 0 }}>Sign in to continue to SlidePulse</p>
        </div>

        <div style={{ background: "#0A0C12", border: "1px solid #131520", borderRadius: 16, padding: "32px 28px", backdropFilter: "blur(20px)" }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <SocialBtn icon={<I.Google />} label="Google" />
            <SocialBtn icon={<I.Microsoft />} label="Microsoft" />
          </div>
          <Divider />
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
            <AuthInput icon={<I.Mail />} type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} error={errors.email} />
            <AuthInput icon={<I.Lock />} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} error={errors.password} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#64748B" }}>
                <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} style={{ accentColor: "#6366F1" }} />
                Remember me
              </label>
              <button onClick={() => onSwitch("forgot")} style={{ background: "none", border: "none", color: "#6366F1", fontSize: 13, cursor: "pointer", fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>Forgot password?</button>
            </div>
            <PrimaryBtn onClick={handleSubmit} loading={loading}>Sign in <I.ArrowR /></PrimaryBtn>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#4a5070" }}>
          Don't have an account?{" "}
          <button onClick={() => onSwitch("signup")} style={{ background: "none", border: "none", color: "#6366F1", fontSize: 14, cursor: "pointer", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Create one</button>
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// ─── SIGNUP PAGE ───
// ═══════════════════════════════════════
function SignupPage({ onSwitch, onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Invalid email address";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Minimum 8 characters";
    if (password !== confirmPw) e.confirm = "Passwords don't match";
    if (!agreed) e.agreed = "You must agree to the terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
      if (error) throw error;
      onLogin({ id: data.user.id, email: data.user.email, name });
    } catch (err) {
      alert(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 420, animation: "fadeUp 0.5s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}><Logo size={36} /></div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 700, color: "#E2E8F0", margin: "0 0 8px" }}>Create your account</h1>
          <p style={{ color: "#4a5070", fontSize: 15, margin: 0 }}>Start building interactive presentations</p>
        </div>

        <div style={{ background: "#0A0C12", border: "1px solid #131520", borderRadius: 16, padding: "32px 28px" }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <SocialBtn icon={<I.Google />} label="Google" />
            <SocialBtn icon={<I.Microsoft />} label="Microsoft" />
          </div>
          <Divider />
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
            <AuthInput icon={<I.User />} type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} error={errors.name} />
            <AuthInput icon={<I.Mail />} type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} error={errors.email} />
            <div>
              <AuthInput icon={<I.Lock />} type="password" placeholder="Password (min 8 chars)" value={password} onChange={e => setPassword(e.target.value)} error={errors.password} />
              <PasswordStrength password={password} />
            </div>
            <AuthInput icon={<I.Lock />} type="password" placeholder="Confirm password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} error={errors.confirm} />
            <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer", fontSize: 13, color: "#64748B" }}>
              <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} style={{ accentColor: "#6366F1", marginTop: 2 }} />
              <span>I agree to the <span style={{ color: "#6366F1", cursor: "pointer" }}>Terms of Service</span> and <span style={{ color: "#6366F1", cursor: "pointer" }}>Privacy Policy</span></span>
            </label>
            {errors.agreed && <div style={{ fontSize: 11, color: "#F43F5E", display: "flex", alignItems: "center", gap: 4 }}><I.Alert /> {errors.agreed}</div>}
            <PrimaryBtn onClick={handleSubmit} loading={loading}>Create account <I.ArrowR /></PrimaryBtn>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#4a5070" }}>
          Already have an account?{" "}
          <button onClick={() => onSwitch("login")} style={{ background: "none", border: "none", color: "#6366F1", fontSize: 14, cursor: "pointer", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Sign in</button>
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// ─── FORGOT PASSWORD ───
// ═══════════════════════════════════════
function ForgotPage({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const handleSubmit = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) { setError("Enter a valid email"); return; }
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setSent(true);
    } catch (err) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 420, animation: "fadeUp 0.5s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}><Logo size={36} /></div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 700, color: "#E2E8F0", margin: "0 0 8px" }}>Reset password</h1>
          <p style={{ color: "#4a5070", fontSize: 15, margin: 0 }}>We'll send you a link to reset it</p>
        </div>
        <div style={{ background: "#0A0C12", border: "1px solid #131520", borderRadius: 16, padding: "32px 28px" }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "20px 0", animation: "fadeUp 0.4s ease" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#22C55E18", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
              </div>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", color: "#E2E8F0", margin: "0 0 8px", fontSize: 20 }}>Check your email</h3>
              <p style={{ color: "#64748B", fontSize: 14, margin: "0 0 24px", lineHeight: 1.5 }}>We've sent a password reset link to<br /><span style={{ color: "#6366F1", fontWeight: 500 }}>{email}</span></p>
              <PrimaryBtn onClick={() => onSwitch("login")} style={{ background: "#151825" }}>Back to login</PrimaryBtn>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <AuthInput icon={<I.Mail />} type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} error={error} />
              <PrimaryBtn onClick={handleSubmit} loading={loading}>Send reset link</PrimaryBtn>
            </div>
          )}
        </div>
        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#4a5070" }}>
          <button onClick={() => onSwitch("login")} style={{ background: "none", border: "none", color: "#6366F1", fontSize: 14, cursor: "pointer", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>← Back to login</button>
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// ─── DASHBOARD ───
// ═══════════════════════════════════════
function Dashboard({ user, onLogout }) {
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [sidebarSection, setSidebarSection] = useState("all");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [presentations, setPresentations] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState("");
  const [creating, setCreating] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const loadPresentations = useCallback(async () => {
    setLoadingData(true);
    setDataError("");
    try {
      const { data, error } = await supabase.from("presentations").select("*").eq("user_id", user.id).order("updated_at", { ascending: false });
      if (error) throw error;
      setPresentations(data || []);
    } catch (e) { setDataError(e?.message || "Failed to load"); }
    finally { setLoadingData(false); }
  }, [user.id]);

  useEffect(() => { if (user?.id) loadPresentations(); }, [user?.id, loadPresentations]);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const { data, error } = await supabase.from("presentations").insert({ user_id: user.id, title: "Untitled Presentation", slides: JSON.stringify([{ type: "title", content: { title: "Untitled", subtitle: "" } }]), is_shared: false, is_starred: false }).select().single();
      if (error) throw error;
      setPresentations((prev) => [data, ...prev]); window.location.href = "/editor?id=" + data.id;
    } catch (e) { alert("Failed to create: " + (e?.message || "")); }
    finally { setCreating(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this presentation?")) return;
    try { const { error } = await supabase.from("presentations").delete().eq("id", id); if (error) throw error; setPresentations((prev) => prev.filter((p) => p.id !== id)); }
    catch (e) { alert("Delete failed: " + (e?.message || "")); }
  };

  const handleToggleStar = async (id, val) => {
    try { const { error } = await supabase.from("presentations").update({ is_starred: !val }).eq("id", id); if (error) throw error; setPresentations((prev) => prev.map((p) => p.id === id ? { ...p, is_starred: !val } : p)); }
    catch (e) { alert("Update failed: " + (e?.message || "")); }
  };

  const handleDuplicate = async (pres) => {
    try { const { data, error } = await supabase.from("presentations").insert({ user_id: user.id, title: pres.title + " (Copy)", slides: pres.slides, is_shared: false, is_starred: false }).select().single(); if (error) throw error; setPresentations((prev) => [data, ...prev]); }
    catch (e) { alert("Duplicate failed: " + (e?.message || "")); }
  };

  const filtered = presentations.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (sidebarSection === "starred") return p.is_starred;
    if (sidebarSection === "shared") return p.is_shared;
    return true;
  });

  const totalSlides = presentations.reduce((acc, p) => { try { const s = typeof p.slides === "string" ? JSON.parse(p.slides) : p.slides; return acc + (Array.isArray(s) ? s.length : 0); } catch { return acc; } }, 0);
  const sharedCount = presentations.filter((p) => p.is_shared).length;
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const thisWeek = presentations.filter((p) => new Date(p.updated_at) > weekAgo).length;
  const initials = user?.name ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) : "U";

  if (settingsOpen) {
    return (
      <div style={{ display: "flex", height: "100vh", background: "#090B10", fontFamily: "'DM Sans', sans-serif", color: "#E2E8F0" }}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        {!isMobile && <DashSidebar section={sidebarSection} onSection={setSidebarSection} onSettings={() => setSettingsOpen(true)} onLogout={onLogout} initials={initials} user={user} active="settings" />}
        <div style={{ flex: 1, overflow: "auto", padding: isMobile ? "20px 16px" : "32px 40px" }}>
          <button onClick={() => setSettingsOpen(false)} style={{ background: "none", border: "none", color: "#6366F1", fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: 24 }}>{"← Back to Dashboard"}</button>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 700, margin: "0 0 32px" }}>Account Settings</h1>
          <div style={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: 16 }}>
            <SettingsCard title="Profile">
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg, #6366F1, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#fff" }}>{initials}</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600 }}>{user?.name}</div>
                  <div style={{ fontSize: 13, color: "#64748B" }}>{user?.email}</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <SettingsInput label="First Name" value={(user?.name || "").split(" ")[0] || ""} />
                <SettingsInput label="Last Name" value={(user?.name || "").split(" ").slice(1).join(" ") || ""} />
                <div style={{ gridColumn: "1 / -1" }}>
                  <SettingsInput label="Email" value={user?.email || ""} />
                </div>
              </div>
            </SettingsCard>

            <SettingsCard title="Preferences">
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <ToggleSetting label="Dark Mode" desc="Always use dark theme" defaultOn={true} />
                <ToggleSetting label="Auto-save" desc="Automatically save changes every 30 seconds" defaultOn={true} />
                <ToggleSetting label="Show Grid by Default" desc="Display alignment grid in the editor" defaultOn={false} />
                <div>
                  <label style={{ fontSize: 12, color: "#4a5070", display: "block", marginBottom: 6 }}>Default Slide Transition</label>
                  <select style={{ width: "100%", padding: "10px 14px", background: "#151825", border: "1px solid #1e2235", borderRadius: 8, color: "#E2E8F0", fontSize: 14, fontFamily: "'DM Sans'", outline: "none" }}>
                    <option>None</option><option>Fade</option><option>Slide</option><option>Zoom</option>
                  </select>
                </div>
              </div>
            </SettingsCard>

            <SettingsCard title="Presentation Defaults">
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, color: "#4a5070", display: "block", marginBottom: 6 }}>Default Slide Size</label>
                  <select style={{ width: "100%", padding: "10px 14px", background: "#151825", border: "1px solid #1e2235", borderRadius: 8, color: "#E2E8F0", fontSize: 14, fontFamily: "'DM Sans'", outline: "none" }}>
                    <option>Widescreen (16:9)</option><option>Standard (4:3)</option><option>Custom</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#4a5070", display: "block", marginBottom: 6 }}>Default Font</label>
                  <select style={{ width: "100%", padding: "10px 14px", background: "#151825", border: "1px solid #1e2235", borderRadius: 8, color: "#E2E8F0", fontSize: 14, fontFamily: "'DM Sans'", outline: "none" }}>
                    <option>DM Sans</option><option>Outfit</option><option>Inter</option><option>Arial</option>
                  </select>
                </div>
                <ToggleSetting label="Show Slide Numbers" desc="Display slide numbers during presentation" defaultOn={true} />
              </div>
            </SettingsCard>

            <SettingsCard title="Audience Interaction">
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <ToggleSetting label="Allow Anonymous Responses" desc="Let audience respond without signing in" defaultOn={true} />
                <ToggleSetting label="Show Live Results" desc="Display poll results in real-time to audience" defaultOn={true} />
                <ToggleSetting label="Enable Word Cloud" desc="Allow word cloud submissions from audience" defaultOn={true} />
                <ToggleSetting label="Sound Effects" desc="Play sound when new responses are received" defaultOn={false} />
              </div>
            </SettingsCard>

            <SettingsCard title="Notifications">
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <ToggleSetting label="Email Notifications" desc="Receive emails about session activity" defaultOn={true} />
                <ToggleSetting label="Session Summary" desc="Get a summary report after each session ends" defaultOn={false} />
              </div>
            </SettingsCard>

            <SettingsCard title="Danger Zone" danger={true}>
              <p style={{ fontSize: 13, color: "#64748B", marginBottom: 16 }}>Permanently delete your account and all presentations. This action cannot be undone.</p>
              <button style={{ padding: "10px 20px", background: "#F43F5E15", border: "1px solid #F43F5E30", borderRadius: 10, color: "#F43F5E", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'" }}>Delete Account</button>
            </SettingsCard>
            <div style={{ height: 32 }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#090B10", fontFamily: "'DM Sans', sans-serif", color: "#E2E8F0", position: "relative" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      {/* Mobile overlay */}
      {isMobile && mobileMenu && <div onClick={() => setMobileMenu(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 90 }} />}
      {/* Sidebar - hidden on mobile unless toggled */}
      {(!isMobile || mobileMenu) && <div style={{ position: isMobile ? "fixed" : "relative", left: 0, top: 0, bottom: 0, zIndex: isMobile ? 100 : 1, width: isMobile ? "75vw" : 230, maxWidth: 280 }}>
        <DashSidebar section={sidebarSection} onSection={(s) => { setSidebarSection(s); setSettingsOpen(false); setMobileMenu(false); }} onSettings={() => { setSettingsOpen(true); setMobileMenu(false); }} onLogout={onLogout} initials={initials} user={user} />
      </div>}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", width: "100%" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "12px 16px" : "16px 32px", borderBottom: "1px solid #12141d", flexShrink: 0, gap: 10, flexWrap: isMobile ? "wrap" : "nowrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
            {isMobile && <button onClick={() => setMobileMenu(!mobileMenu)} style={{ background: "none", border: "1px solid #1e2235", borderRadius: 8, padding: "8px 10px", color: "#94A3B8", cursor: "pointer", display: "flex", flexShrink: 0 }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg></button>}
            <div style={{ position: "relative", flex: 1, maxWidth: isMobile ? "100%" : 320 }}>
              <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#4a5070" }}><I.Search /></div>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." style={{ width: "100%", padding: "10px 12px 10px 40px", background: "#0D0F14", border: "1px solid #151825", borderRadius: 10, color: "#E2E8F0", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ display: "flex", background: "#0D0F14", borderRadius: 8, border: "1px solid #151825", overflow: "hidden" }}>
              <button onClick={() => setView("grid")} style={{ padding: "7px 10px", background: view === "grid" ? "#151825" : "transparent", border: "none", color: view === "grid" ? "#6366F1" : "#4a5070", cursor: "pointer", display: "flex" }}><I.Grid /></button>
              <button onClick={() => setView("list")} style={{ padding: "7px 10px", background: view === "list" ? "#151825" : "transparent", border: "none", color: view === "list" ? "#6366F1" : "#4a5070", cursor: "pointer", display: "flex" }}><I.List /></button>
            </div>
            <button onClick={handleCreate} disabled={creating} style={{ display: "flex", alignItems: "center", gap: 6, padding: isMobile ? "9px 14px" : "9px 20px", background: creating ? "#2a2e45" : "linear-gradient(135deg, #6366F1, #7C3AED)", border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 600, cursor: creating ? "wait" : "pointer", fontFamily: "'DM Sans'" }}>
              {creating ? <div style={{ width: 16, height: 16, border: "2px solid #fff4", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} /> : <><I.Plus /> {!isMobile && "New Presentation"}</>}
            </button>
          </div>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: isMobile ? "16px" : "28px 32px" }}>
          {/* Stats cards */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? 10 : 14, marginBottom: isMobile ? 20 : 32 }}>
            {[{ label: "Total Presentations", value: presentations.length, icon: <I.Slides />, color: "#6366F1" }, { label: "Total Slides", value: totalSlides, icon: <I.Folder />, color: "#8B5CF6" }, { label: "Shared", value: sharedCount, icon: <I.Users />, color: "#06B6D4" }, { label: "This Week", value: thisWeek, icon: <I.Zap />, color: "#22C55E" }].map((s, i) => (
              <div key={i} style={{ background: "#0D0F14", border: "1px solid #131520", borderRadius: 14, padding: isMobile ? "14px 16px" : "18px 20px" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: s.color + "15", display: "flex", alignItems: "center", justifyContent: "center", color: s.color, marginBottom: 10 }}>{s.icon}</div>
                <div style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, fontFamily: "'Outfit'" }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#4a5070", marginTop: 2 }}>{s.label}</div>
              </div>))}
          </div>
          {dataError && <div style={{ padding: "16px 20px", background: "#F43F5E10", border: "1px solid #F43F5E25", borderRadius: 12, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "#F43F5E", fontSize: 14 }}>{dataError}</span><button onClick={loadPresentations} style={{ background: "none", border: "1px solid #F43F5E40", borderRadius: 8, padding: "6px 14px", color: "#F43F5E", fontSize: 13, cursor: "pointer" }}>Retry</button></div>}
          {loadingData && <div style={{ textAlign: "center", padding: "60px 0" }}><div style={{ width: 36, height: 36, border: "3px solid #1a1d2e", borderTopColor: "#6366F1", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} /><p style={{ color: "#4a5070", fontSize: 14 }}>Loading presentations...</p></div>}
          {!loadingData && !dataError && presentations.length === 0 && <div style={{ textAlign: "center", padding: "60px 0" }}><div style={{ width: 64, height: 64, borderRadius: 16, background: "#6366F112", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#6366F1" }}><I.Slides /></div><h3 style={{ fontFamily: "'Outfit'", fontSize: 20, fontWeight: 600, margin: "0 0 8px" }}>No presentations yet</h3><p style={{ color: "#4a5070", fontSize: 14, marginBottom: 20 }}>Create your first presentation to get started</p><button onClick={handleCreate} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 24px", background: "linear-gradient(135deg, #6366F1, #7C3AED)", border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}><I.Plus /> Create Presentation</button></div>}
          {!loadingData && filtered.length > 0 && view === "grid" && <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>{filtered.map((p, i) => { const grad = GRADIENTS[i % GRADIENTS.length]; let sc = 0; try { const s = typeof p.slides === "string" ? JSON.parse(p.slides) : p.slides; sc = Array.isArray(s) ? s.length : 0; } catch {} return (<div key={p.id} style={{ background: "#0D0F14", border: "1px solid #131520", borderRadius: 14, overflow: "hidden", transition: "all 0.2s" }}><div style={{ height: 120, background: grad, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 36, fontWeight: 800, color: "#ffffff20", fontFamily: "'Outfit'" }}>{sc}</span><button onClick={() => handleToggleStar(p.id, p.is_starred)} style={{ position: "absolute", top: 8, right: 8, background: p.is_starred ? "#EAB30825" : "#00000040", border: "none", borderRadius: 6, padding: 5, cursor: "pointer", display: "flex", color: p.is_starred ? "#EAB308" : "#ffffff60" }}><svg width="14" height="14" viewBox="0 0 24 24" fill={p.is_starred ? "#EAB308" : "none"} stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></button></div><div style={{ padding: "12px 14px" }}><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div><div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#4a5070" }}><span>{sc} slides</span><span>{timeAgo(p.updated_at)}</span></div><div style={{ display: "flex", gap: 4, marginTop: 8 }}><a href={"/editor?id=" + p.id} style={{ background: "#6366F120", border: "none", borderRadius: 6, padding: "4px 8px", color: "#6366F1", fontSize: 11, cursor: "pointer", textDecoration: "none" }}>Edit</a><button onClick={() => handleDuplicate(p)} style={{ background: "#151825", border: "none", borderRadius: 6, padding: "4px 8px", color: "#64748B", fontSize: 11, cursor: "pointer" }}>Duplicate</button>
<button onClick={() => handleDelete(p.id)} style={{ background: "#151825", border: "none", borderRadius: 6, padding: "4px 8px", color: "#F43F5E", fontSize: 11, cursor: "pointer" }}>Delete</button></div></div></div>); })}</div>}
          {!loadingData && filtered.length > 0 && view === "list" && <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>{filtered.map((p, i) => { const grad = GRADIENTS[i % GRADIENTS.length]; let sc = 0; try { const s = typeof p.slides === "string" ? JSON.parse(p.slides) : p.slides; sc = Array.isArray(s) ? s.length : 0; } catch {} return (<div key={p.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", background: "#0D0F14", border: "1px solid #131520", borderRadius: 10 }}><div style={{ width: 40, height: 26, borderRadius: 6, background: grad, flexShrink: 0 }} /><div style={{ flex: 1, fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div><span style={{ fontSize: 12, color: "#4a5070" }}>{sc} slides</span><span style={{ fontSize: 12, color: "#4a5070" }}>{timeAgo(p.updated_at)}</span><button onClick={() => handleToggleStar(p.id, p.is_starred)} style={{ background: "none", border: "none", cursor: "pointer", color: p.is_starred ? "#EAB308" : "#4a5070", padding: 4, display: "flex" }}><svg width="14" height="14" viewBox="0 0 24 24" fill={p.is_starred ? "#EAB308" : "none"} stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></button><button onClick={() => handleDuplicate(p)} style={{ background: "none", border: "none", cursor: "pointer", color: "#4a5070", padding: 4, display: "flex" }}><I.Copy /></button><button onClick={() => handleDelete(p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#4a5070", padding: 4, display: "flex" }}><I.Trash /></button></div>); })}</div>}
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD SIDEBAR ───
function DashSidebar({ section, onSection, onSettings, onLogout, initials, user, active }) {
  const items = [
    { key: "all", label: "All Presentations", icon: <I.Home /> },
    { key: "starred", label: "Starred", icon: <I.Star /> },
    { key: "shared", label: "Shared", icon: <I.Users /> },
  ];
  return (
    <div style={{ width: 230, height: "100%", background: "#0D0F14", borderRight: "1px solid #12141d", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ padding: "18px 20px 24px" }}><Logo size={28} /></div>
      <nav style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map(it => (
          <button key={it.key} onClick={() => onSection(it.key)}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: section === it.key && active !== "settings" ? "#6366F110" : "transparent", border: "none", borderRadius: 8, color: section === it.key && active !== "settings" ? "#6366F1" : "#64748B", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left", width: "100%", transition: "all 0.15s" }}
            onMouseEnter={e => { if (section !== it.key) e.currentTarget.style.background = "#0e1018"; }} onMouseLeave={e => { if (section !== it.key) e.currentTarget.style.background = "transparent"; }}>
            {it.icon} {it.label}
          </button>
        ))}
        <div style={{ height: 1, background: "#151825", margin: "12px 0" }} />
        <button onClick={onSettings}
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: active === "settings" ? "#6366F110" : "transparent", border: "none", borderRadius: 8, color: active === "settings" ? "#6366F1" : "#64748B", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left", width: "100%" }}>
          <I.Settings /> Settings
        </button>
      </nav>
      {/* User section */}
      <div style={{ padding: "16px", borderTop: "1px solid #12141d" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #6366F1, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
            <div style={{ fontSize: 11, color: "#4a5070", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
          </div>
        </div>
        <button onClick={onLogout}
          style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 12px", background: "transparent", border: "1px solid #1a1d2e", borderRadius: 8, color: "#64748B", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#F43F5E40"; e.currentTarget.style.color = "#F43F5E"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#1a1d2e"; e.currentTarget.style.color = "#64748B"; }}>
          <I.Logout /> Sign out
        </button>
      </div>
    </div>
  );
}

// ─── SETTINGS HELPERS ───
function SettingsCard({ title, children, danger }) {
  return (
    <div style={{ background: "#0D0F14", border: `1px solid ${danger ? "#F43F5E20" : "#131520"}`, borderRadius: 14, padding: "24px" }}>
      <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 600, margin: "0 0 18px", color: danger ? "#F43F5E" : "#E2E8F0" }}>{title}</h3>
      {children}
    </div>
  );
}

function SettingsInput({ label, value }) {
  return (
    <div>
      <label style={{ fontSize: 12, color: "#4a5070", display: "block", marginBottom: 6 }}>{label}</label>
      <input defaultValue={value} style={{ width: "100%", padding: "10px 14px", background: "#151825", border: "1px solid #1e2235", borderRadius: 8, color: "#E2E8F0", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" }}
        onFocus={e => e.target.style.borderColor = "#6366F1"} onBlur={e => e.target.style.borderColor = "#1e2235"} />
    </div>
  );
}

function ToggleSetting({ label, desc, defaultOn }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div><div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div><div style={{ fontSize: 12, color: "#4a5070" }}>{desc}</div></div>
      <button onClick={() => setOn(!on)} style={{ width: 44, height: 24, borderRadius: 12, background: on ? "#6366F1" : "#1e2235", border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s", padding: 0 }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: on ? 23 : 3, transition: "left 0.2s" }} />
      </button>
    </div>
  );
}

function HoverBtn({ icon, label }) {
  return (
    <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "#151825ee", border: "1px solid #2a2e45", borderRadius: 8, color: "#E2E8F0", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", backdropFilter: "blur(8px)" }}
      onMouseEnter={e => e.currentTarget.style.background = "#1e2235"} onMouseLeave={e => e.currentTarget.style.background = "#151825ee"}>
      {icon} {label}
    </button>
  );
}

function SmallIconBtn({ children }) {
  return (
    <button style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", borderRadius: 6, color: "#4a5070", cursor: "pointer" }}
      onMouseEnter={e => { e.currentTarget.style.background = "#151825"; e.currentTarget.style.color = "#E2E8F0"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#4a5070"; }}>
      {children}
    </button>
  );
}

// ═══════════════════════════════════════
// ─── MAIN APP ROUTER ───
// ═══════════════════════════════════════
export default function SlidePulseAuth({ initialPage = "login" }) {
  const [page, setPage] = useState(initialPage);
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const result = await supabase.auth.getSession();
        const session = result?.data?.session;
        if (session && session.user) {
          const u = session.user;
          setUser({ id: u.id, email: u.email, name: u.user_metadata?.full_name || u.email.split("@")[0] });
          setPage("dashboard");
        }
      } catch (err) {
        console.error("Session check failed:", err);
      } finally {
        setCheckingSession(false);
      }
    };
    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") { setUser(null); setPage("login"); }
      if (event === "SIGNED_IN" && session?.user) {
        const u = session.user;
        setUser({ id: u.id, email: u.email, name: u.user_metadata?.full_name || u.email.split("@")[0] });
        setPage("dashboard");
      }
    });
    return () => listener?.subscription?.unsubscribe();
  }, []);

  const handleLogin = (u) => { setUser(u); setPage("dashboard"); };

  const handleLogout = async () => {
    try { await supabase.auth.signOut(); } catch (err) { console.error("Logout:", err); }
    setUser(null);
    setPage("login");
  };

  if (checkingSession) {
    return (
      <div style={{ minHeight: "100vh", background: "#060810", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "3px solid #1a1d2e", borderTopColor: "#6366F1", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "#4a5070", fontSize: 14 }}>Loading...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (page === "dashboard" && user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  // If trying to access dashboard without login, show login page
  const showPage = (page === "dashboard" && !user) ? "login" : page;

  return (
    <>
      <AuthBackground />
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      {showPage === "login" && <LoginPage onSwitch={setPage} onLogin={handleLogin} />}
      {showPage === "signup" && <SignupPage onSwitch={setPage} onLogin={handleLogin} />}
      {showPage === "forgot" && <ForgotPage onSwitch={setPage} />}
    </>
  );
}
