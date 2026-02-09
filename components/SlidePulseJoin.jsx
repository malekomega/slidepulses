"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const bg = "#060810";
const card = "#0D0F14";
const border = "#131520";
const primary = "#6366F1";
const textMain = "#E2E8F0";
const textDim = "#4a5070";
const font = "'DM Sans', sans-serif";
const fontTitle = "'Outfit', sans-serif";

function getInteractive(slide) {
  const elements = slide?.elements || [];
  return elements.find((el) => el.type === "interactive");
}

export default function AudienceView() {
  const [joinCode, setJoinCode] = useState("");
  const [session, setSession] = useState(null);
  const [allSlides, setAllSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [voted, setVoted] = useState({});
  const [wordInput, setWordInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async () => {
    if (joinCode.length !== 6) { setError("Enter a 6-digit code"); return; }
    setLoading(true);
    setError("");
    try {
      const { data: sessionData, error: sessErr } = await supabase.from("sessions").select("*").eq("join_code", joinCode).eq("is_active", true).single();
      if (sessErr || !sessionData) throw new Error("Session not found or ended");

      if (sessionData.presentation_id) {
        const { data: presData } = await supabase.from("presentations").select("slides").eq("id", sessionData.presentation_id).single();
        if (presData) {
          let slides;
          try { slides = typeof presData.slides === "string" ? JSON.parse(presData.slides) : presData.slides; } catch { slides = []; }
          setAllSlides(Array.isArray(slides) ? slides : []);
        }
      }
      setSession(sessionData);
      setCurrentSlide(sessionData.current_slide || 0);
    } catch (e) { setError(e?.message || "Session not found"); }
    finally { setLoading(false); }
  };

  // Listen for slide changes
  useEffect(() => {
    if (!session) return;
    const channel = supabase.channel("session-" + session.id)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "sessions", filter: "id=eq." + session.id },
        (payload) => {
          const updated = payload.new;
          if (!updated.is_active) { setSession(null); alert("Session has ended"); return; }
          setCurrentSlide(updated.current_slide);
        })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [session?.id]);

  const submitVote = async (answer) => {
    if (!session || voted[currentSlide]) return;
    try {
      const { error } = await supabase.from("responses").insert({ session_id: session.id, slide_index: currentSlide, answer });
      if (error) throw error;
      setVoted((prev) => ({ ...prev, [currentSlide]: answer }));
    } catch (e) { alert("Failed: " + (e?.message || "")); }
  };

  const submitWord = async () => {
    if (!wordInput.trim() || !session || voted[currentSlide]) return;
    await submitVote(wordInput.trim());
    setWordInput("");
  };

  const slide = allSlides[currentSlide];
  const interactive = slide ? getInteractive(slide) : null;
  const hasVoted = voted[currentSlide] !== undefined;

  // ─── JOIN SCREEN ───
  if (!session) {
    return (
      <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, color: textMain }}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        <div style={{ width: "100%", maxWidth: 400, padding: 20, animation: "fadeUp 0.4s ease" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg, " + primary + ", #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 24, fontWeight: 800, color: "#fff", fontFamily: fontTitle }}>S</div>
            <h1 style={{ fontFamily: fontTitle, fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Join Session</h1>
            <p style={{ color: textDim, fontSize: 15 }}>Enter the 6-digit code from the presenter</p>
          </div>
          <div style={{ background: card, border: "1px solid " + border, borderRadius: 16, padding: "32px 28px" }}>
            <input value={joinCode} onChange={(e) => { setJoinCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }} placeholder="000000" maxLength={6}
              style={{ width: "100%", padding: "18px 16px", background: "#0A0C10", border: "1.5px solid " + (error ? "#F43F5E40" : "#1a1d2e"), borderRadius: 12, color: textMain, fontSize: 32, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", textAlign: "center", letterSpacing: 12, outline: "none", boxSizing: "border-box" }}
              onFocus={(e) => { e.target.style.borderColor = primary; }}
              onBlur={(e) => { e.target.style.borderColor = error ? "#F43F5E40" : "#1a1d2e"; }}
              onKeyDown={(e) => { if (e.key === "Enter") handleJoin(); }}
            />
            {error && <div style={{ fontSize: 12, color: "#F43F5E", marginTop: 8, textAlign: "center" }}>{error}</div>}
            <button onClick={handleJoin} disabled={loading || joinCode.length !== 6}
              style={{ width: "100%", padding: "14px 20px", marginTop: 16, background: joinCode.length === 6 ? "linear-gradient(135deg, " + primary + ", #7C3AED)" : "#2a2e45", border: "none", borderRadius: 12, color: joinCode.length === 6 ? "#fff" : textDim, fontSize: 16, fontWeight: 600, cursor: joinCode.length === 6 ? "pointer" : "not-allowed", fontFamily: font }}>
              {loading ? "Joining..." : "Join"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── CONNECTED - TOP BAR ───
  const topBar = (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: "1px solid " + border }}>
      <div style={{ fontFamily: fontTitle, fontWeight: 700, fontSize: 16 }}><span style={{ color: primary }}>S</span> SlidePulse</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E" }} />
        <span style={{ fontSize: 13, color: textDim }}>Connected</span>
        <span style={{ fontSize: 13, color: primary, fontWeight: 600, fontFamily: "'JetBrains Mono'" }}>#{session.join_code}</span>
      </div>
    </div>
  );

  // ─── NON-INTERACTIVE SLIDE (waiting) ───
  if (!interactive) {
    return (
      <div style={{ minHeight: "100vh", background: bg, fontFamily: font, color: textMain, display: "flex", flexDirection: "column" }}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        {topBar}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: primary + "12", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={primary} strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
            </div>
            <h2 style={{ fontFamily: fontTitle, fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Presenter is showing a slide</h2>
            <p style={{ color: textDim, fontSize: 14 }}>A question will appear here when the presenter shows one.</p>
            <p style={{ color: textDim, fontSize: 13, marginTop: 12 }}>Slide {currentSlide + 1} of {allSlides.length}</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── INTERACTIVE SLIDE (voting) ───
  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: font, color: textMain, display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      {topBar}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 500, width: "100%", animation: "fadeUp 0.3s ease" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <span style={{ padding: "4px 14px", background: primary + "15", borderRadius: 20, fontSize: 11, fontWeight: 600, color: primary, textTransform: "uppercase" }}>
              {interactive.interactiveType === "wordCloud" ? "word cloud" : interactive.interactiveType}
            </span>
          </div>
          <h2 style={{ fontFamily: fontTitle, fontSize: 24, fontWeight: 700, textAlign: "center", marginBottom: 28, lineHeight: 1.4 }}>{interactive.question}</h2>

          {hasVoted ? (
            <div style={{ textAlign: "center", padding: "40px 20px", background: card, border: "1px solid " + border, borderRadius: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#22C55E18", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
              </div>
              <h3 style={{ fontFamily: fontTitle, fontSize: 18, marginBottom: 6 }}>Answer Submitted!</h3>
              <p style={{ color: textDim, fontSize: 14 }}>You answered: <span style={{ color: primary, fontWeight: 600 }}>{voted[currentSlide]}</span></p>
              <p style={{ color: textDim, fontSize: 13, marginTop: 8 }}>Waiting for next question...</p>
            </div>
          ) : interactive.interactiveType === "wordCloud" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input value={wordInput} onChange={(e) => setWordInput(e.target.value.slice(0, 30))} placeholder="Type your word..."
                style={{ width: "100%", padding: "16px 18px", background: card, border: "1.5px solid " + border, borderRadius: 12, color: textMain, fontSize: 18, fontFamily: font, outline: "none", textAlign: "center", boxSizing: "border-box" }}
                onFocus={(e) => { e.target.style.borderColor = primary; }}
                onBlur={(e) => { e.target.style.borderColor = border; }}
                onKeyDown={(e) => { if (e.key === "Enter") submitWord(); }}
              />
              <button onClick={submitWord} disabled={!wordInput.trim()}
                style={{ width: "100%", padding: "14px 20px", background: wordInput.trim() ? "linear-gradient(135deg, " + primary + ", #7C3AED)" : "#2a2e45", border: "none", borderRadius: 12, color: wordInput.trim() ? "#fff" : textDim, fontSize: 16, fontWeight: 600, cursor: wordInput.trim() ? "pointer" : "not-allowed", fontFamily: font }}>
                Submit
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {interactive.options.map((opt, i) => (
                <button key={i} onClick={() => submitVote(opt)}
                  style={{ width: "100%", padding: "16px 20px", background: card, border: "1.5px solid " + border, borderRadius: 12, color: textMain, fontSize: 16, fontWeight: 500, cursor: "pointer", fontFamily: font, textAlign: "left", display: "flex", alignItems: "center", gap: 14, transition: "all 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = primary; e.currentTarget.style.background = primary + "08"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = border; e.currentTarget.style.background = card; }}>
                  <span style={{ width: 32, height: 32, borderRadius: 8, background: primary + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: primary, flexShrink: 0 }}>{String.fromCharCode(65 + i)}</span>
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
