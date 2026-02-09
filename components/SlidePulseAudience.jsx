"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── ICONS ───
const I = {
  Users:()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  Check:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>,
  Send:()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  ArrowR:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  Zap:()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  Eye:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Clock:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  Trophy:()=><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22h10c0-2-0.85-3.25-2.03-3.79A1.07 1.07 0 0114 17v-2.34M18 2H6v7a6 6 0 1012 0V2z"/></svg>,
  Heart:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  Star:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  Smile:()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
  Expand:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>,
  Share:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  Monitor:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  Phone:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
};

// ─── CONSTANTS ───
const ACCENT = ["#6366F1","#8B5CF6","#EC4899","#F43F5E","#F97316","#EAB308","#22C55E","#06B6D4"];
const NAMES = ["Ahmed","Sara","Omar","Fatima","Khalid","Nour","Layla","Rami","Dina","Yusuf","Hana","Tariq","Mona","Ali","Zeina","Hassan","Reem","Fadi","Jana","Samir","Lina","Karim","Maya","Bilal","Rana"];

const SESSION_CODE = "SP-4827";
const JOIN_URL = "slidepulse.io/join";

// ─── QR CODE (SVG-based simple pattern) ───
function QRCode({ size = 180 }) {
  // Deterministic pattern from session code
  const grid = 21;
  const cellSize = size / grid;
  const cells = [];
  const seed = SESSION_CODE.split("").reduce((a,c) => a + c.charCodeAt(0), 0);
  
  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      // Position detection patterns (corners)
      const inTL = r < 7 && c < 7;
      const inTR = r < 7 && c >= grid - 7;
      const inBL = r >= grid - 7 && c < 7;
      
      if (inTL || inTR || inBL) {
        const lr = inTL ? r : inTR ? r : r - (grid - 7);
        const lc = inTL ? c : inTR ? c - (grid - 7) : c;
        const border = lr === 0 || lr === 6 || lc === 0 || lc === 6;
        const inner = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4;
        if (border || inner) cells.push({ r, c });
      } else {
        // Data area - pseudo-random based on position + seed
        const v = ((r * 31 + c * 17 + seed) * 7) % 13;
        if (v < 5) cells.push({ r, c });
      }
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="#fff" rx="8" />
      {cells.map(({ r, c }, i) => (
        <rect key={i} x={c * cellSize + 1} y={r * cellSize + 1} width={cellSize - 0.5} height={cellSize - 0.5} fill="#0D0F14" rx="1" />
      ))}
    </svg>
  );
}

// ─── SIMULATED PARTICIPANTS ───
function useSimulatedParticipants(active, max = 48) {
  const [participants, setParticipants] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    // Initial burst
    const initial = Array.from({ length: 5 + Math.floor(Math.random() * 4) }, (_, i) => ({
      id: i,
      name: NAMES[i % NAMES.length],
      color: ACCENT[i % ACCENT.length],
      joinedAt: Date.now() - Math.random() * 5000,
    }));
    setParticipants(initial);

    let id = initial.length;
    timerRef.current = setInterval(() => {
      setParticipants(prev => {
        if (prev.length >= max) { clearInterval(timerRef.current); return prev; }
        return [...prev, { id: id++, name: NAMES[id % NAMES.length], color: ACCENT[id % ACCENT.length], joinedAt: Date.now() }];
      });
    }, 800 + Math.random() * 2000);

    return () => clearInterval(timerRef.current);
  }, [active, max]);

  return participants;
}

// ─── SIMULATED VOTING ───
function useSimulatedVotes(active, optionCount, baseVotes) {
  const [votes, setVotes] = useState(baseVotes || Array(optionCount).fill(0));
  const timerRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    timerRef.current = setInterval(() => {
      setVotes(prev => {
        const n = [...prev];
        const idx = Math.floor(Math.random() * optionCount);
        n[idx] += 1;
        return n;
      });
    }, 600 + Math.random() * 1500);
    return () => clearInterval(timerRef.current);
  }, [active, optionCount]);

  return [votes, setVotes];
}

// ═══════════════════════════════════════
// ─── MAIN APP ───
// ═══════════════════════════════════════
export default function AudienceParticipation() {
  const [view, setView] = useState("selector"); // selector, join, audience, presenter

  return (
    <div style={{ minHeight: "100vh", background: "#060810", fontFamily: "'DM Sans', sans-serif", color: "#E2E8F0" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideInR{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes popIn{0%{opacity:0;transform:scale(0.8)}50%{transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
        @keyframes pulse{0%,100%{opacity:0.5}50%{opacity:1}}
        @keyframes confetti{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(400px) rotate(720deg);opacity:0}}
        @keyframes ripple{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.5);opacity:0}}
        @keyframes barGrow{from{width:0}to{width:var(--target-width)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes countUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px #6366F120}50%{box-shadow:0 0 40px #6366F140}}
        ::selection{background:#6366F140;color:#fff}
      `}</style>

      {view === "selector" && <ViewSelector onSelect={setView} />}
      {view === "join" && <JoinScreen onJoined={() => setView("audience")} onBack={() => setView("selector")} />}
      {view === "audience" && <AudienceView onBack={() => setView("selector")} />}
      {view === "presenter" && <PresenterView onBack={() => setView("selector")} />}
    </div>
  );
}

// ═══ VIEW SELECTOR ═══
function ViewSelector({ onSelect }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, #6366F110 0%, transparent 70%)", top: "-10%", right: "-5%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, #8B5CF608 0%, transparent 70%)", bottom: "-5%", left: "-5%", pointerEvents: "none" }} />

      <div style={{ textAlign: "center", maxWidth: 700, animation: "fadeUp 0.6s ease" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #6366F1, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#fff", fontFamily: "'Outfit'" }}>S</div>
            <span style={{ fontFamily: "'Outfit'", fontWeight: 700, fontSize: 22, letterSpacing: "-0.02em" }}>SlidePulse</span>
          </div>
        </div>

        <h1 style={{ fontFamily: "'Outfit'", fontSize: 42, fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 12px" }}>Audience Participation</h1>
        <p style={{ fontSize: 18, color: "#64748B", marginBottom: 48 }}>Choose which view you'd like to preview</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {[
            { key: "join", icon: <I.Phone />, title: "Join Screen", desc: "QR code + session code entry page for audience members", color: "#6366F1" },
            { key: "audience", icon: <I.Smile />, title: "Audience View", desc: "Mobile-first voting, quiz, word cloud & reaction interface", color: "#8B5CF6" },
            { key: "presenter", icon: <I.Monitor />, title: "Presenter View", desc: "Live results dashboard with real-time animated data", color: "#EC4899" },
          ].map((v, i) => (
            <button key={v.key} onClick={() => onSelect(v.key)}
              style={{ background: "#0A0C12", border: "1px solid #131520", borderRadius: 16, padding: "36px 24px", cursor: "pointer", textAlign: "center", transition: "all 0.25s", animation: `fadeUp 0.5s ease ${i * 0.1}s both` }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${v.color}50`; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${v.color}15`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#131520"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: `${v.color}12`, display: "flex", alignItems: "center", justifyContent: "center", color: v.color, margin: "0 auto 18px" }}>{v.icon}</div>
              <h3 style={{ fontFamily: "'Outfit'", fontSize: 20, fontWeight: 700, color: "#E2E8F0", marginBottom: 8 }}>{v.title}</h3>
              <p style={{ fontSize: 14, color: "#4a5070", lineHeight: 1.6 }}>{v.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══ JOIN SCREEN ═══
function JoinScreen({ onJoined, onBack }) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState("code"); // code, name, joining, joined
  const [error, setError] = useState("");

  const handleCodeSubmit = () => {
    if (code.toUpperCase().replace(/[- ]/g, "") === "SP4827") {
      setStep("name");
      setError("");
    } else if (code.length < 4) {
      setError("Please enter a valid session code");
    } else {
      setError("Session not found. Check the code and try again.");
    }
  };

  const handleNameSubmit = () => {
    if (!name.trim()) { setError("Please enter your name"); return; }
    setError("");
    setStep("joining");
    setTimeout(() => setStep("joined"), 1800);
    setTimeout(() => onJoined(), 3200);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>
      {/* Background */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, #6366F10d 0%, transparent 70%)", top: "-15%", right: "-10%" }} />
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.02 }}>
          {Array.from({ length: 20 }, (_, i) => <line key={i} x1={`${i * 5}%`} y1="0" x2={`${i * 5}%`} y2="100%" stroke="#6366F1" strokeWidth="0.5" />)}
        </svg>
      </div>

      <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>
        {/* Back button */}
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#4a5070", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans'", marginBottom: 20, display: "flex", alignItems: "center", gap: 4 }}>← Back</button>

        {step === "code" && (
          <div style={{ animation: "fadeUp 0.5s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #6366F1, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#fff", fontFamily: "'Outfit'" }}>S</div>
              </div>
              <h1 style={{ fontFamily: "'Outfit'", fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 8px" }}>Join Presentation</h1>
              <p style={{ color: "#4a5070", fontSize: 15 }}>Scan the QR code or enter the session code</p>
            </div>

            {/* QR Code */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
              <div style={{ padding: 16, background: "#fff", borderRadius: 16, boxShadow: "0 0 0 1px #ffffff10, 0 12px 40px #00000040", animation: "glow 3s ease infinite" }}>
                <QRCode size={180} />
              </div>
            </div>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "24px 0" }}>
              <div style={{ flex: 1, height: 1, background: "#1a1d2e" }} />
              <span style={{ fontSize: 12, color: "#4a5070", fontWeight: 500 }}>or enter code</span>
              <div style={{ flex: 1, height: 1, background: "#1a1d2e" }} />
            </div>

            {/* Code Input */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, background: "#0A0C12", border: "1.5px solid #1a1d2e", borderRadius: 14, padding: "4px 6px" }}>
                {Array.from({ length: 7 }, (_, i) => {
                  if (i === 2) return <span key="dash" style={{ fontSize: 24, color: "#2a2e45", margin: "0 2px" }}>-</span>;
                  const ci = i > 2 ? i - 1 : i;
                  const displayCode = "SP4827";
                  const val = code.toUpperCase().replace(/[- ]/g, "")[ci] || "";
                  return (
                    <div key={i} style={{ width: 44, height: 56, borderRadius: 10, background: val ? "#6366F110" : "#111320", border: `1.5px solid ${val ? "#6366F140" : "#1a1d2e"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, fontFamily: "'JetBrains Mono'", color: val ? "#E2E8F0" : "#2a2e45", transition: "all 0.2s" }}>
                      {val || displayCode[ci]}
                    </div>
                  );
                })}
              </div>
            </div>

            <input
              value={code} onChange={e => setCode(e.target.value.toUpperCase().slice(0, 7))}
              placeholder="SP-4827"
              maxLength={7}
              style={{ width: "100%", padding: "14px 16px", background: "#0A0C12", border: "1.5px solid #1a1d2e", borderRadius: 12, color: "#E2E8F0", fontSize: 18, fontFamily: "'JetBrains Mono'", textAlign: "center", outline: "none", letterSpacing: "0.1em", fontWeight: 600, boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = "#6366F1"}
              onBlur={e => e.target.style.borderColor = "#1a1d2e"}
              onKeyDown={e => e.key === "Enter" && handleCodeSubmit()}
            />
            {error && <div style={{ fontSize: 13, color: "#F43F5E", textAlign: "center", marginTop: 8, animation: "fadeIn 0.3s ease" }}>{error}</div>}

            <button onClick={handleCodeSubmit}
              style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #6366F1, #7C3AED)", border: "none", borderRadius: 12, color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'", marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "transform 0.2s" }}
              onMouseEnter={e => e.target.style.transform = "translateY(-1px)"}
              onMouseLeave={e => e.target.style.transform = "none"}>
              Join Session <I.ArrowR />
            </button>

            <div style={{ textAlign: "center", marginTop: 20 }}>
              <span style={{ fontSize: 12, color: "#4a5070" }}>Go to </span>
              <span style={{ fontSize: 12, color: "#6366F1", fontWeight: 600 }}>{JOIN_URL}</span>
            </div>
          </div>
        )}

        {step === "name" && (
          <div style={{ animation: "fadeUp 0.5s ease", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "#22C55E15", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "#22C55E" }}><I.Check /></div>
            <h2 style={{ fontFamily: "'Outfit'", fontSize: 26, fontWeight: 700, margin: "0 0 6px" }}>Session found!</h2>
            <p style={{ color: "#4a5070", fontSize: 14, marginBottom: 8 }}>Q4 Strategy Review — by Ahmed Al-Rashid</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 28 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", animation: "pulse 1.5s infinite" }} />
              <span style={{ fontSize: 13, color: "#22C55E", fontWeight: 500 }}>Live now • 23 participants</span>
            </div>

            <input
              value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name"
              style={{ width: "100%", padding: "14px 16px", background: "#0A0C12", border: "1.5px solid #1a1d2e", borderRadius: 12, color: "#E2E8F0", fontSize: 16, fontFamily: "'DM Sans'", textAlign: "center", outline: "none", boxSizing: "border-box", marginBottom: 8 }}
              onFocus={e => e.target.style.borderColor = "#6366F1"} onBlur={e => e.target.style.borderColor = "#1a1d2e"}
              onKeyDown={e => e.key === "Enter" && handleNameSubmit()}
            />
            {error && <div style={{ fontSize: 13, color: "#F43F5E", marginTop: 4, animation: "fadeIn 0.3s" }}>{error}</div>}

            <button onClick={handleNameSubmit}
              style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #6366F1, #7C3AED)", border: "none", borderRadius: 12, color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'", marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              Join <I.ArrowR />
            </button>
          </div>
        )}

        {step === "joining" && (
          <div style={{ animation: "fadeUp 0.4s ease", textAlign: "center", padding: "40px 0" }}>
            <div style={{ width: 48, height: 48, border: "3px solid #1a1d2e", borderTopColor: "#6366F1", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 24px" }} />
            <h2 style={{ fontFamily: "'Outfit'", fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>Joining session...</h2>
            <p style={{ color: "#4a5070", fontSize: 14 }}>Connecting as {name}</p>
          </div>
        )}

        {step === "joined" && (
          <div style={{ animation: "popIn 0.5s ease", textAlign: "center", padding: "40px 0" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#22C55E15", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
            </div>
            <h2 style={{ fontFamily: "'Outfit'", fontSize: 24, fontWeight: 700, margin: "0 0 8px" }}>You're in! 🎉</h2>
            <p style={{ color: "#4a5070", fontSize: 14 }}>Waiting for the presenter to start an activity...</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══ AUDIENCE VIEW (Mobile-first) ═══
function AudienceView({ onBack }) {
  const [screen, setScreen] = useState("waiting"); // waiting, poll, quiz, wordcloud, reaction, results
  const [voted, setVoted] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [wordInput, setWordInput] = useState("");
  const [submittedWords, setSubmittedWords] = useState([]);
  const [reactions, setReactions] = useState([]);

  // Auto-advance demo
  useEffect(() => {
    const timers = [
      setTimeout(() => setScreen("poll"), 2000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const addReaction = (emoji) => {
    const id = Date.now();
    setReactions(prev => [...prev, { id, emoji, x: 20 + Math.random() * 60 }]);
    setTimeout(() => setReactions(prev => prev.filter(r => r.id !== id)), 2000);
  };

  const pollOptions = ["Live Polls", "Quizzes", "Word Clouds", "Q&A Sessions"];
  const quizOptions = ["Amman", "Beirut", "Cairo", "Riyadh"];

  return (
    <div style={{ minHeight: "100vh", maxWidth: 420, margin: "0 auto", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      {/* Floating reactions */}
      {reactions.map(r => (
        <div key={r.id} style={{ position: "fixed", left: `${r.x}%`, bottom: 100, fontSize: 28, animation: "confetti 2s ease forwards", pointerEvents: "none", zIndex: 100 }}>
          {r.emoji}
        </div>
      ))}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid #0F1118", background: "#0A0C12", flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#4a5070", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans'" }}>← Exit</button>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", animation: "pulse 1.5s infinite" }} />
          <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>Live • {SESSION_CODE}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "24px 18px", display: "flex", flexDirection: "column" }}>
        {screen === "waiting" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", animation: "fadeUp 0.5s ease" }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: "#6366F112", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366F1", marginBottom: 20, animation: "float 3s ease infinite" }}>
              <I.Zap />
            </div>
            <h2 style={{ fontFamily: "'Outfit'", fontSize: 22, fontWeight: 700, marginBottom: 8, textAlign: "center" }}>Get ready!</h2>
            <p style={{ color: "#4a5070", fontSize: 14, textAlign: "center" }}>The presenter will start an activity shortly...</p>
            <div style={{ display: "flex", gap: 4, marginTop: 24 }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366F1", opacity: 0.3, animation: `pulse 1.2s ease ${i * 0.3}s infinite` }} />)}
            </div>
          </div>
        )}

        {screen === "poll" && (
          <div style={{ animation: "fadeUp 0.5s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ padding: "3px 10px", borderRadius: 50, background: "#6366F115", color: "#6366F1", fontSize: 11, fontWeight: 600 }}>POLL</span>
            </div>
            <h2 style={{ fontFamily: "'Outfit'", fontSize: 24, fontWeight: 700, margin: "0 0 6px" }}>Which feature excites you most?</h2>
            <p style={{ color: "#4a5070", fontSize: 13, marginBottom: 24 }}>Tap to vote • Single choice</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {pollOptions.map((opt, i) => (
                <button key={i} onClick={() => { if (!voted) { setVoted(true); } }}
                  disabled={voted}
                  style={{
                    position: "relative", padding: "16px 18px", background: voted && i === 0 ? "#6366F112" : "#0A0C12",
                    border: `1.5px solid ${voted && i === 0 ? "#6366F150" : "#1a1d2e"}`, borderRadius: 14,
                    cursor: voted ? "default" : "pointer", textAlign: "left", overflow: "hidden",
                    transition: "all 0.2s", animation: `fadeUp 0.4s ease ${i * 0.08}s both`
                  }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative", zIndex: 1 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${ACCENT[i]}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: ACCENT[i], fontFamily: "'Outfit'", flexShrink: 0 }}>
                      {voted && i === 0 ? <I.Check /> : String.fromCharCode(65 + i)}
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 600, color: "#E2E8F0" }}>{opt}</span>
                    {voted && <span style={{ marginLeft: "auto", fontSize: 14, fontWeight: 700, color: ACCENT[i], fontFamily: "'JetBrains Mono'" }}>{[42, 28, 18, 12][i]}%</span>}
                  </div>
                  {voted && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${[42, 28, 18, 12][i]}%`, background: `${ACCENT[i]}08`, transition: "width 0.8s ease", borderRadius: 14 }} />}
                </button>
              ))}
            </div>

            {voted && (
              <div style={{ textAlign: "center", marginTop: 20, animation: "popIn 0.4s ease" }}>
                <p style={{ color: "#22C55E", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><I.Check /> Vote recorded!</p>
                <button onClick={() => { setScreen("quiz"); setVoted(false); }} style={{ marginTop: 12, background: "none", border: "none", color: "#6366F1", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans'", fontWeight: 600 }}>
                  Next activity →
                </button>
              </div>
            )}
          </div>
        )}

        {screen === "quiz" && (
          <div style={{ animation: "fadeUp 0.5s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ padding: "3px 10px", borderRadius: 50, background: "#8B5CF615", color: "#8B5CF6", fontSize: 11, fontWeight: 600 }}>QUIZ</span>
              {!quizRevealed && <span style={{ fontSize: 12, color: "#F97316", display: "flex", alignItems: "center", gap: 4 }}><I.Clock /> 15s</span>}
            </div>
            <h2 style={{ fontFamily: "'Outfit'", fontSize: 24, fontWeight: 700, margin: "0 0 6px" }}>What is the capital of Jordan?</h2>
            <p style={{ color: "#4a5070", fontSize: 13, marginBottom: 24 }}>Tap the correct answer</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {quizOptions.map((opt, i) => {
                const isCorrect = i === 0;
                const isSelected = quizAnswer === i;
                const colors = ["#6366F1", "#EC4899", "#F97316", "#22C55E"];
                return (
                  <button key={i} onClick={() => {
                    if (quizAnswer === null) {
                      setQuizAnswer(i);
                      setTimeout(() => setQuizRevealed(true), 1000);
                    }
                  }}
                    style={{
                      padding: "20px 16px", border: `1.5px solid ${quizRevealed ? (isCorrect ? "#22C55E50" : isSelected ? "#F43F5E40" : "#1a1d2e") : isSelected ? `${colors[i]}60` : "#1a1d2e"}`,
                      borderRadius: 14, cursor: quizAnswer !== null ? "default" : "pointer", textAlign: "center",
                      background: quizRevealed ? (isCorrect ? "#22C55E10" : isSelected && !isCorrect ? "#F43F5E08" : "#0A0C12") : isSelected ? `${colors[i]}10` : "#0A0C12",
                      transition: "all 0.3s", animation: `popIn 0.4s ease ${i * 0.08}s both`
                    }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: quizRevealed && isCorrect ? "#22C55E" : `${colors[i]}20`, margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: quizRevealed && isCorrect ? "#fff" : colors[i], fontFamily: "'Outfit'", transition: "all 0.3s" }}>
                      {quizRevealed && isCorrect ? <I.Check /> : String.fromCharCode(65 + i)}
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 600, color: quizRevealed ? (isCorrect ? "#22C55E" : isSelected && !isCorrect ? "#F43F5E" : "#4a5070") : "#E2E8F0" }}>{opt}</span>
                  </button>
                );
              })}
            </div>

            {quizRevealed && (
              <div style={{ textAlign: "center", marginTop: 24, animation: "popIn 0.4s ease" }}>
                {quizAnswer === 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div style={{ fontSize: 32 }}>🎉</div>
                    <p style={{ color: "#22C55E", fontSize: 16, fontWeight: 700, fontFamily: "'Outfit'" }}>Correct!</p>
                    <p style={{ color: "#4a5070", fontSize: 13 }}>You answered in 3.2 seconds</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <p style={{ color: "#F43F5E", fontSize: 16, fontWeight: 700, fontFamily: "'Outfit'" }}>Not quite!</p>
                    <p style={{ color: "#4a5070", fontSize: 13 }}>The correct answer is <span style={{ color: "#22C55E", fontWeight: 600 }}>Amman</span></p>
                  </div>
                )}
                <button onClick={() => { setScreen("wordcloud"); setQuizAnswer(null); setQuizRevealed(false); }} style={{ marginTop: 12, background: "none", border: "none", color: "#6366F1", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans'", fontWeight: 600 }}>
                  Next activity →
                </button>
              </div>
            )}
          </div>
        )}

        {screen === "wordcloud" && (
          <div style={{ animation: "fadeUp 0.5s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ padding: "3px 10px", borderRadius: 50, background: "#06B6D415", color: "#06B6D4", fontSize: 11, fontWeight: 600 }}>WORD CLOUD</span>
            </div>
            <h2 style={{ fontFamily: "'Outfit'", fontSize: 24, fontWeight: 700, margin: "0 0 6px" }}>Describe SlidePulse in one word</h2>
            <p style={{ color: "#4a5070", fontSize: 13, marginBottom: 24 }}>Submit up to 3 words</p>

            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <input value={wordInput} onChange={e => setWordInput(e.target.value)} placeholder="Type a word..."
                style={{ flex: 1, padding: "14px 16px", background: "#0A0C12", border: "1.5px solid #1a1d2e", borderRadius: 12, color: "#E2E8F0", fontSize: 15, fontFamily: "'DM Sans'", outline: "none", boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = "#6366F1"} onBlur={e => e.target.style.borderColor = "#1a1d2e"}
                onKeyDown={e => { if (e.key === "Enter" && wordInput.trim() && submittedWords.length < 3) { setSubmittedWords(prev => [...prev, wordInput.trim()]); setWordInput(""); } }}
              />
              <button onClick={() => { if (wordInput.trim() && submittedWords.length < 3) { setSubmittedWords(prev => [...prev, wordInput.trim()]); setWordInput(""); } }}
                disabled={!wordInput.trim() || submittedWords.length >= 3}
                style={{ width: 48, height: 48, borderRadius: 12, background: wordInput.trim() ? "linear-gradient(135deg, #6366F1, #7C3AED)" : "#1a1d2e", border: "none", color: "#fff", cursor: wordInput.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <I.Send />
              </button>
            </div>

            {submittedWords.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                {submittedWords.map((w, i) => (
                  <span key={i} style={{ padding: "8px 16px", background: `${ACCENT[i]}15`, border: `1px solid ${ACCENT[i]}30`, borderRadius: 50, fontSize: 14, fontWeight: 600, color: ACCENT[i], animation: "popIn 0.3s ease" }}>
                    {w}
                  </span>
                ))}
              </div>
            )}
            <p style={{ fontSize: 12, color: "#4a5070" }}>{3 - submittedWords.length} submissions remaining</p>

            {submittedWords.length > 0 && (
              <button onClick={() => setScreen("waiting")} style={{ marginTop: 16, background: "none", border: "none", color: "#6366F1", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans'", fontWeight: 600 }}>
                Back to selector →
              </button>
            )}
          </div>
        )}
      </div>

      {/* Reaction Bar */}
      {screen !== "waiting" && (
        <div style={{ padding: "12px 18px", borderTop: "1px solid #0F1118", background: "#0A0C12", display: "flex", justifyContent: "center", gap: 10, flexShrink: 0 }}>
          {["👍", "❤️", "😂", "🤔", "👏", "🔥"].map(emoji => (
            <button key={emoji} onClick={() => addReaction(emoji)}
              style={{ width: 44, height: 44, borderRadius: 12, background: "#111320", border: "1px solid #1a1d2e", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.15)"; e.currentTarget.style.borderColor = "#2a2e45"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "#1a1d2e"; }}>
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══ PRESENTER VIEW (Live Results Dashboard) ═══
function PresenterView({ onBack }) {
  const [activity, setActivity] = useState("poll"); // poll, quiz, wordcloud
  const participants = useSimulatedParticipants(true, 48);
  const [pollVotes, setPollVotes] = useSimulatedVotes(activity === "poll", 4, [18, 12, 6, 4]);
  const [quizVotes] = useSimulatedVotes(activity === "quiz", 4, [22, 8, 5, 3]);
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [wordCloudWords, setWordCloudWords] = useState(["Innovation", "Interactive", "Powerful", "Easy", "Fast", "Modern", "Arabic", "Engaging", "Beautiful", "Smart", "Creative", "Future"]);

  // Simulate word cloud additions
  useEffect(() => {
    if (activity !== "wordcloud") return;
    const newWords = ["Amazing", "Intuitive", "Collaborative", "Dynamic", "Elegant", "Smooth", "Professional", "Clean", "Responsive", "Flexible"];
    let idx = 0;
    const t = setInterval(() => {
      if (idx >= newWords.length) { clearInterval(t); return; }
      setWordCloudWords(prev => [...prev, newWords[idx]]);
      idx++;
    }, 1200);
    return () => clearInterval(t);
  }, [activity]);

  const pollOptions = ["Live Polls", "Quizzes", "Word Clouds", "Q&A Sessions"];
  const totalPollVotes = pollVotes.reduce((a, b) => a + b, 0);
  const maxPollVote = Math.max(...pollVotes, 1);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#060810" }}>
      {/* Top Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: 56, borderBottom: "1px solid #0F1118", background: "#0A0C12", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#4a5070", cursor: "pointer", fontFamily: "'DM Sans'", fontSize: 13 }}>← Back</button>
          <div style={{ width: 1, height: 24, background: "#131520" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg, #6366F1, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff", fontFamily: "'Outfit'" }}>S</div>
            <span style={{ fontFamily: "'Outfit'", fontWeight: 600, fontSize: 14 }}>Presenter Dashboard</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 14px", background: "#22C55E10", border: "1px solid #22C55E25", borderRadius: 50 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", animation: "pulse 1.5s infinite" }} />
            <span style={{ fontSize: 13, color: "#22C55E", fontWeight: 600 }}>LIVE</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#94A3B8", fontSize: 13 }}>
            <I.Users /> <span style={{ fontFamily: "'JetBrains Mono'", fontWeight: 600 }}>{participants.length}</span> joined
          </div>
          <div style={{ padding: "5px 12px", background: "#0D0F14", borderRadius: 8, border: "1px solid #1a1d2e", fontFamily: "'JetBrains Mono'", fontSize: 14, fontWeight: 600, color: "#6366F1", letterSpacing: "0.05em" }}>{SESSION_CODE}</div>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Main Content */}
        <div style={{ flex: 1, padding: "28px 32px", overflow: "auto" }}>
          {/* Activity Selector */}
          <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
            {[["poll", "Live Poll", "#6366F1"], ["quiz", "Quiz", "#8B5CF6"], ["wordcloud", "Word Cloud", "#06B6D4"]].map(([key, label, color]) => (
              <button key={key} onClick={() => { setActivity(key); if (key === "quiz") setQuizRevealed(false); }}
                style={{ padding: "10px 22px", borderRadius: 10, background: activity === key ? `${color}15` : "#0A0C12", border: `1.5px solid ${activity === key ? `${color}50` : "#131520"}`, color: activity === key ? color : "#4a5070", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'", transition: "all 0.2s" }}>
                {label}
              </button>
            ))}
          </div>

          {/* POLL RESULTS */}
          {activity === "poll" && (
            <div style={{ animation: "fadeUp 0.4s ease" }}>
              <h2 style={{ fontFamily: "'Outfit'", fontSize: 28, fontWeight: 800, margin: "0 0 6px" }}>Which feature excites you most?</h2>
              <p style={{ color: "#4a5070", fontSize: 14, marginBottom: 28, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "'JetBrains Mono'", fontWeight: 600, color: "#6366F1" }}>{totalPollVotes}</span> total votes
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {pollOptions.map((opt, i) => {
                  const pct = totalPollVotes > 0 ? Math.round(pollVotes[i] / totalPollVotes * 100) : 0;
                  const isLeading = pollVotes[i] === maxPollVote;
                  return (
                    <div key={i} style={{ position: "relative", background: "#0A0C12", border: `1px solid ${isLeading ? `${ACCENT[i]}30` : "#131520"}`, borderRadius: 14, padding: "18px 22px", overflow: "hidden", transition: "border-color 0.3s" }}>
                      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`, background: `${ACCENT[i]}10`, transition: "width 0.6s ease", borderRadius: 14 }} />
                      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: `${ACCENT[i]}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: ACCENT[i], fontFamily: "'Outfit'" }}>
                            {String.fromCharCode(65 + i)}
                          </div>
                          <span style={{ fontSize: 17, fontWeight: 600 }}>{opt}</span>
                          {isLeading && <span style={{ padding: "2px 8px", borderRadius: 50, background: `${ACCENT[i]}20`, color: ACCENT[i], fontSize: 10, fontWeight: 700 }}>LEADING</span>}
                        </div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                          <span style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Outfit'", color: ACCENT[i], animation: "countUp 0.3s ease" }}>{pct}%</span>
                          <span style={{ fontSize: 13, color: "#4a5070", fontFamily: "'JetBrains Mono'" }}>({pollVotes[i]})</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* QUIZ RESULTS */}
          {activity === "quiz" && (
            <div style={{ animation: "fadeUp 0.4s ease" }}>
              <h2 style={{ fontFamily: "'Outfit'", fontSize: 28, fontWeight: 800, margin: "0 0 6px" }}>What is the capital of Jordan?</h2>
              <p style={{ color: "#4a5070", fontSize: 14, marginBottom: 28 }}>
                <span style={{ fontFamily: "'JetBrains Mono'", fontWeight: 600, color: "#8B5CF6" }}>{quizVotes.reduce((a, b) => a + b, 0)}</span> responses
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {["Amman", "Beirut", "Cairo", "Riyadh"].map((opt, i) => {
                  const isCorrect = i === 0;
                  const total = quizVotes.reduce((a, b) => a + b, 0);
                  const pct = total > 0 ? Math.round(quizVotes[i] / total * 100) : 0;
                  const colors = ["#6366F1", "#EC4899", "#F97316", "#22C55E"];
                  return (
                    <div key={i} style={{
                      padding: "24px 20px", background: quizRevealed ? (isCorrect ? "#22C55E08" : "#0A0C12") : "#0A0C12",
                      border: `1.5px solid ${quizRevealed ? (isCorrect ? "#22C55E40" : "#131520") : "#131520"}`,
                      borderRadius: 14, textAlign: "center", transition: "all 0.4s"
                    }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: quizRevealed && isCorrect ? "#22C55E" : `${colors[i]}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 18, fontWeight: 700, color: quizRevealed && isCorrect ? "#fff" : colors[i], fontFamily: "'Outfit'", transition: "all 0.3s" }}>
                        {quizRevealed && isCorrect ? <I.Check /> : String.fromCharCode(65 + i)}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: quizRevealed ? (isCorrect ? "#22C55E" : "#4a5070") : "#E2E8F0" }}>{opt}</div>
                      <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Outfit'", color: quizRevealed && isCorrect ? "#22C55E" : colors[i] }}>{pct}%</div>
                      <div style={{ fontSize: 12, color: "#4a5070", fontFamily: "'JetBrains Mono'" }}>{quizVotes[i]} answers</div>
                    </div>
                  );
                })}
              </div>

              <button onClick={() => setQuizRevealed(!quizRevealed)}
                style={{ marginTop: 24, padding: "12px 28px", background: quizRevealed ? "#151825" : "linear-gradient(135deg, #8B5CF6, #7C3AED)", border: quizRevealed ? "1px solid #1e2235" : "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'", display: "flex", alignItems: "center", gap: 8, margin: "24px auto 0" }}>
                {quizRevealed ? "Hide Answer" : "Reveal Answer"} <I.Eye />
              </button>
            </div>
          )}

          {/* WORD CLOUD */}
          {activity === "wordcloud" && (
            <div style={{ animation: "fadeUp 0.4s ease" }}>
              <h2 style={{ fontFamily: "'Outfit'", fontSize: 28, fontWeight: 800, margin: "0 0 6px" }}>Describe SlidePulse in one word</h2>
              <p style={{ color: "#4a5070", fontSize: 14, marginBottom: 28, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "'JetBrains Mono'", fontWeight: 600, color: "#06B6D4" }}>{wordCloudWords.length}</span> submissions
              </p>

              <div style={{ background: "#0A0C12", border: "1px solid #131520", borderRadius: 20, padding: "48px 32px", minHeight: 320, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "12px 16px" }}>
                {wordCloudWords.map((word, i) => {
                  const freq = wordCloudWords.filter(w => w === word).length;
                  const size = Math.max(16, Math.min(48, 16 + freq * 8 + (word.length < 6 ? 10 : 0)));
                  const weight = size > 30 ? 800 : size > 22 ? 600 : 500;
                  return (
                    <span key={`${word}-${i}`} style={{
                      fontSize: size, fontWeight: weight, color: ACCENT[i % ACCENT.length],
                      fontFamily: "'Outfit'", opacity: 0.5 + (size / 48) * 0.5,
                      transform: `rotate(${(i % 5 === 0 ? (i % 2 ? 8 : -8) : 0)}deg)`,
                      animation: `popIn 0.5s ease ${i * 0.05}s both`,
                      transition: "all 0.3s", cursor: "default",
                    }}
                      onMouseEnter={e => e.target.style.transform = "scale(1.15)"}
                      onMouseLeave={e => e.target.style.transform = `rotate(${(i % 5 === 0 ? (i % 2 ? 8 : -8) : 0)}deg)`}>
                      {word}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Participants */}
        <div style={{ width: 240, background: "#0A0C12", borderLeft: "1px solid #0F1118", display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px", borderBottom: "1px solid #0F1118" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#4a5070" }}>Participants</span>
              <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'JetBrains Mono'", color: "#6366F1" }}>{participants.length}</span>
            </div>
          </div>

          {/* QR Mini */}
          <div style={{ padding: "14px 16px", borderBottom: "1px solid #0F1118", textAlign: "center" }}>
            <div style={{ display: "inline-block", padding: 8, background: "#fff", borderRadius: 10 }}>
              <QRCode size={100} />
            </div>
            <div style={{ marginTop: 8, fontFamily: "'JetBrains Mono'", fontSize: 16, fontWeight: 700, color: "#6366F1", letterSpacing: "0.08em" }}>{SESSION_CODE}</div>
            <div style={{ fontSize: 11, color: "#4a5070" }}>{JOIN_URL}</div>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflow: "auto", padding: "8px 10px" }}>
            {participants.map((p, i) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 8, animation: `slideInR 0.3s ease ${Math.min(i * 0.05, 1)}s both` }}
                onMouseEnter={e => e.currentTarget.style.background = "#0D0F14"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: p.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                  {p.name[0]}
                </div>
                <span style={{ fontSize: 12, color: "#94A3B8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
