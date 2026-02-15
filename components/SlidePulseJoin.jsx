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

// ─── Parse presentation slides into audience-friendly format ───
// Now includes ALL slides, not just interactive ones
function parseSlides(presentationSlides) {
  const parsed = [];
  if (!Array.isArray(presentationSlides)) return parsed;

  presentationSlides.forEach((slide, slideIndex) => {
    const elements = slide.elements || slide.objects || [];
    if (!Array.isArray(elements)) {
      parsed.push({ slideIndex, type: "content", elements: [] });
      return;
    }

    // Collect interactive elements from this slide
    const interactives = [];
    const contentElements = [];

    elements.forEach((el) => {
      if (el.type === "interactive") {
        if (el.interactiveType === "poll") {
          interactives.push({ type: "poll", question: el.question || "Poll Question", options: el.options || [], elementId: el.id });
        } else if (el.interactiveType === "quiz") {
          interactives.push({ type: "quiz", question: el.question || "Quiz Question", options: el.options || [], correct: el.correctIndex ?? 0, elementId: el.id });
        } else if (el.interactiveType === "wordCloud") {
          interactives.push({ type: "word_cloud", question: el.question || "Share your thoughts", options: [], elementId: el.id });
        }
      } else {
        contentElements.push(el);
      }
    });

    if (interactives.length > 0) {
      // Slide has interactive elements — show them all
      parsed.push({ slideIndex, type: "interactive", interactives, contentElements });
    } else {
      // Content-only slide (title, images, text, shapes, etc.)
      parsed.push({ slideIndex, type: "content", contentElements });
    }
  });

  return parsed;
}

// ─── Render a content element for audience view ───
function ContentElement({ el }) {
  if (el.type === "text") {
    return (
      <div style={{
        fontSize: Math.min(el.fontSize || 16, 32),
        fontWeight: el.fontWeight || "400",
        color: el.color || textMain,
        fontFamily: el.fontFamily || font,
        textAlign: el.textAlign || "left",
        marginBottom: 8,
        lineHeight: 1.5,
        wordBreak: "break-word",
      }}>
        {el.content}
      </div>
    );
  }
  if (el.type === "image" && el.src) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
        <img src={el.src} alt="" style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 10, objectFit: "contain" }} />
      </div>
    );
  }
  if (el.type === "shape") {
    return <div style={{ width: "100%", height: el.h || 3, background: el.fill || primary, borderRadius: 2, marginBottom: 8 }} />;
  }
  return null;
}

// ─── Interactive element (poll/quiz/wordcloud) ───
function InteractiveBlock({ item, voteKey, voted, onVote, wordInput, setWordInput }) {
  const hasVoted = voted[voteKey] !== undefined;

  return (
    <div style={{ background: card, border: "1px solid " + border, borderRadius: 16, padding: "24px 20px", marginBottom: 12 }}>
      {/* Type badge */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
        <span style={{ padding: "3px 12px", background: primary + "15", borderRadius: 20, fontSize: 10, fontWeight: 600, color: primary, textTransform: "uppercase" }}>
          {item.type === "word_cloud" ? "Word Cloud" : item.type}
        </span>
      </div>

      {/* Question */}
      <h3 style={{ fontFamily: fontTitle, fontSize: 20, fontWeight: 700, textAlign: "center", marginBottom: 18, lineHeight: 1.4 }}>
        {item.question}
      </h3>

      {/* Already voted */}
      {hasVoted ? (
        <div style={{ textAlign: "center", padding: "20px 16px" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#22C55E18", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#22C55E", marginBottom: 4 }}>Submitted!</p>
          <p style={{ color: textDim, fontSize: 13 }}>
            Your answer: <span style={{ color: primary, fontWeight: 600 }}>{voted[voteKey]}</span>
          </p>
        </div>
      ) : item.type === "word_cloud" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            value={wordInput}
            onChange={(e) => setWordInput(e.target.value.slice(0, 30))}
            placeholder="Type your word..."
            style={{
              width: "100%", padding: "14px 16px", background: "#0A0C10", border: "1.5px solid #1a1d2e",
              borderRadius: 10, color: textMain, fontSize: 16, fontFamily: font, outline: "none",
              textAlign: "center", boxSizing: "border-box",
            }}
            onFocus={(e) => { e.target.style.borderColor = primary; }}
            onBlur={(e) => { e.target.style.borderColor = "#1a1d2e"; }}
            onKeyDown={(e) => { if (e.key === "Enter" && wordInput.trim()) { onVote(wordInput.trim()); setWordInput(""); } }}
          />
          <button onClick={() => { if (wordInput.trim()) { onVote(wordInput.trim()); setWordInput(""); } }} disabled={!wordInput.trim()}
            style={{
              width: "100%", padding: "12px 18px",
              background: wordInput.trim() ? `linear-gradient(135deg, ${primary}, #7C3AED)` : "#2a2e45",
              border: "none", borderRadius: 10, color: wordInput.trim() ? "#fff" : textDim,
              fontSize: 15, fontWeight: 600, cursor: wordInput.trim() ? "pointer" : "not-allowed", fontFamily: font,
            }}>
            Submit
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {item.options.map((opt, i) => (
            <button key={i} onClick={() => onVote(opt)}
              style={{
                width: "100%", padding: "14px 16px", background: "#0A0C10",
                border: "1.5px solid #1a1d2e", borderRadius: 10,
                color: textMain, fontSize: 15, fontWeight: 500,
                cursor: "pointer", fontFamily: font, textAlign: "left",
                display: "flex", alignItems: "center", gap: 12,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = primary; e.currentTarget.style.background = primary + "08"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1a1d2e"; e.currentTarget.style.background = "#0A0C10"; }}>
              <span style={{
                width: 30, height: 30, borderRadius: 7,
                background: primary + "15", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, color: primary, flexShrink: 0,
              }}>
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
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
      const { data: sessionData, error: sessErr } = await supabase
        .from("sessions")
        .select("*")
        .eq("join_code", joinCode)
        .eq("is_active", true)
        .single();
      if (sessErr || !sessionData) throw new Error("Session not found or ended");

      // Load presentation slides
      if (sessionData.presentation_id) {
        const { data: presData } = await supabase
          .from("presentations")
          .select("slides")
          .eq("id", sessionData.presentation_id)
          .single();
        if (presData) {
          let slides;
          try { slides = typeof presData.slides === "string" ? JSON.parse(presData.slides) : presData.slides; } catch { slides = []; }
          setAllSlides(parseSlides(slides));
        }
      }

      setSession(sessionData);
      setCurrentSlide(sessionData.current_slide || 0);
    } catch (e) {
      setError(e?.message || "Session not found");
    } finally {
      setLoading(false);
    }
  };

  // Listen for slide changes from presenter
  useEffect(() => {
    if (!session) return;
    const channel = supabase
      .channel("session-" + session.id)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "sessions", filter: "id=eq." + session.id },
        (payload) => {
          const updated = payload.new;
          if (!updated.is_active) { setSession(null); return; }
          setCurrentSlide(updated.current_slide);
        })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [session?.id]);

  // Submit vote to Supabase
  const submitVote = async (voteKey, answer) => {
    if (!session || voted[voteKey]) return;
    try {
      const { error } = await supabase.from("responses").insert({
        session_id: session.id,
        slide_index: currentSlide,
        answer: answer,
      });
      if (error) throw error;
      setVoted((prev) => ({ ...prev, [voteKey]: answer }));
    } catch (e) {
      alert("Failed to submit: " + (e?.message || ""));
    }
  };

  // Current slide data
  const slideData = allSlides[currentSlide];

  // ─── JOIN SCREEN ───
  if (!session) {
    return (
      <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, color: textMain }}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
        <div style={{ width: "100%", maxWidth: 400, padding: 20, animation: "fadeUp 0.4s ease" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${primary}, #8B5CF6)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="28" height="28" viewBox="0 0 268.05 270.45" fill="#fff"><path d="M198.37,131.77c-1.87-3.04-4.09-5.85-6.6-8.36-3.15-3.15-6.64-5.84-10.38-8.01v-51.63c0-5.43-1.86-10.12-5.5-13.91-3.51-3.65-7.72-5.71-12.51-6.14h-.06c-1.01-.09-2.03-.14-3.07-.14H62.93c-1.04,0-2.06.05-3.07.14h-.06c-4.79.43-9,2.49-12.51,6.14-3.65,3.79-5.5,8.48-5.5,13.91v133.41c0,5.43,1.86,10.12,5.5,13.91,3.51,3.65,7.72,5.71,12.51,6.14h.06c1.01.09,2.03.14,3.07.14h77.48c2.78,6.1,6.68,11.67,11.58,16.44l.16.15c8.31,8.03,18.22,12.71,29.42,13.89.79.08,1.58.14,2.37.17l2.16.05c.7.01,1.41,0,2.12-.02.85-.04,1.69-.1,2.53-.2,11.2-1.18,21.11-5.87,29.42-13.89,8.55-8.27,13.55-18.49,14.84-30.38.03-.24.05-.48.07-.72.16-1.94.24-3.9.24-5.87,0-11.96-3.55-22.68-10.54-31.82-1.77-2.31-3.72-4.48-5.83-6.47l-.29-.27c-.05-.04-.09-.08-.14-.12Z"/></svg>
            </div>
            <h1 style={{ fontFamily: fontTitle, fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Join Session</h1>
            <p style={{ color: textDim, fontSize: 15 }}>Enter the 6-digit code from the presenter</p>
          </div>

          <div style={{ background: card, border: "1px solid " + border, borderRadius: 16, padding: "32px 28px" }}>
            <input
              value={joinCode}
              onChange={(e) => { setJoinCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
              placeholder="000000"
              maxLength={6}
              style={{
                width: "100%", padding: "18px 16px", background: "#0A0C10", border: "1.5px solid " + (error ? "#F43F5E40" : "#1a1d2e"),
                borderRadius: 12, color: textMain, fontSize: 32, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                textAlign: "center", letterSpacing: 12, outline: "none", boxSizing: "border-box",
              }}
              onFocus={(e) => { e.target.style.borderColor = primary; }}
              onBlur={(e) => { e.target.style.borderColor = error ? "#F43F5E40" : "#1a1d2e"; }}
              onKeyDown={(e) => { if (e.key === "Enter") handleJoin(); }}
            />
            {error && <div style={{ fontSize: 12, color: "#F43F5E", marginTop: 8, textAlign: "center" }}>{error}</div>}

            <button onClick={handleJoin} disabled={loading || joinCode.length !== 6}
              style={{
                width: "100%", padding: "14px 20px", marginTop: 16,
                background: joinCode.length === 6 ? `linear-gradient(135deg, ${primary}, #7C3AED)` : "#2a2e45",
                border: "none", borderRadius: 12, color: joinCode.length === 6 ? "#fff" : textDim,
                fontSize: 16, fontWeight: 600, cursor: joinCode.length === 6 ? "pointer" : "not-allowed", fontFamily: font,
              }}>
              {loading ? "Joining..." : "Join"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── WAITING SCREEN ───
  if (!slideData) {
    return (
      <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, color: textMain }}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "3px solid #1a1d2e", borderTopColor: primary, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: textDim, fontSize: 14 }}>Waiting for presenter...</p>
          <p style={{ color: primary, fontSize: 13, marginTop: 8, fontFamily: "'JetBrains Mono'" }}>#{session.join_code}</p>
        </div>
      </div>
    );
  }

  // ─── MAIN VIEW (Content + Interactive) ───
  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: font, color: textMain, display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>

      {/* Top Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: "1px solid " + border, background: "#0A0C12", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: `linear-gradient(135deg, ${primary}, #8B5CF6)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 268.05 270.45" fill="#fff"><path d="M198.37,131.77c-1.87-3.04-4.09-5.85-6.6-8.36-3.15-3.15-6.64-5.84-10.38-8.01v-51.63c0-5.43-1.86-10.12-5.5-13.91-3.51-3.65-7.72-5.71-12.51-6.14h-.06c-1.01-.09-2.03-.14-3.07-.14H62.93c-1.04,0-2.06.05-3.07.14h-.06c-4.79.43-9,2.49-12.51,6.14-3.65,3.79-5.5,8.48-5.5,13.91v133.41c0,5.43,1.86,10.12,5.5,13.91,3.51,3.65,7.72,5.71,12.51,6.14h.06c1.01.09,2.03.14,3.07.14h77.48c2.78,6.1,6.68,11.67,11.58,16.44l.16.15c8.31,8.03,18.22,12.71,29.42,13.89.79.08,1.58.14,2.37.17l2.16.05c.7.01,1.41,0,2.12-.02.85-.04,1.69-.1,2.53-.2,11.2-1.18,21.11-5.87,29.42-13.89,8.55-8.27,13.55-18.49,14.84-30.38.03-.24.05-.48.07-.72.16-1.94.24-3.9.24-5.87,0-11.96-3.55-22.68-10.54-31.82-1.77-2.31-3.72-4.48-5.83-6.47l-.29-.27c-.05-.04-.09-.08-.14-.12Z"/></svg>
          </div>
          <span style={{ fontFamily: fontTitle, fontWeight: 700, fontSize: 15 }}>SlidePlus</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", animation: "pulse 1.5s infinite" }} />
            <span style={{ fontSize: 12, color: "#22C55E", fontWeight: 600 }}>Live</span>
          </div>
          <span style={{ fontSize: 12, color: primary, fontWeight: 600, fontFamily: "'JetBrains Mono'", padding: "3px 10px", background: primary + "10", borderRadius: 6 }}>#{session.join_code}</span>
          <span style={{ fontSize: 11, color: textDim }}>{currentSlide + 1}/{allSlides.length}</span>
        </div>
      </div>

      {/* Slide Content */}
      <div style={{ flex: 1, overflow: "auto", padding: "20px 16px", maxWidth: 540, margin: "0 auto", width: "100%" }} key={currentSlide}>
        <div style={{ animation: "fadeUp 0.3s ease" }}>

          {/* Content elements (text, images, shapes) */}
          {slideData.contentElements && slideData.contentElements.length > 0 && (
            <div style={{ marginBottom: slideData.type === "interactive" ? 20 : 0, padding: "16px 12px" }}>
              {slideData.contentElements.map((el, i) => (
                <ContentElement key={i} el={el} />
              ))}
            </div>
          )}

          {/* Interactive elements */}
          {slideData.type === "interactive" && slideData.interactives.map((item, idx) => {
            const voteKey = `${currentSlide}_${idx}`;
            return (
              <InteractiveBlock
                key={voteKey}
                item={item}
                voteKey={voteKey}
                voted={voted}
                onVote={(answer) => submitVote(voteKey, answer)}
                wordInput={wordInput}
                setWordInput={setWordInput}
              />
            );
          })}

          {/* Content-only slide message */}
          {slideData.type === "content" && slideData.contentElements.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: primary + "12", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={primary} strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
              </div>
              <p style={{ color: textDim, fontSize: 14 }}>Viewing presentation...</p>
              <p style={{ color: textDim, fontSize: 12, marginTop: 4 }}>The presenter is showing content</p>
            </div>
          )}

          {/* Content-only slide with content — show "viewing" indicator */}
          {slideData.type === "content" && slideData.contentElements.length > 0 && (
            <div style={{ textAlign: "center", padding: "16px 0", marginTop: 12, borderTop: "1px solid " + border }}>
              <span style={{ fontSize: 11, color: textDim }}>📺 Viewing slide — no interaction needed</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom reaction bar */}
      <div style={{ padding: "10px 16px", borderTop: "1px solid " + border, background: "#0A0C12", display: "flex", justifyContent: "center", gap: 8, flexShrink: 0 }}>
        {["👍", "❤️", "😂", "🤔", "👏", "🔥"].map(e => (
          <button key={e} style={{
            width: 40, height: 40, borderRadius: 10, background: "#111320", border: "1px solid #1a1d2e",
            fontSize: 17, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "transform .15s",
          }}
            onMouseEnter={ev => ev.currentTarget.style.transform = "scale(1.15)"}
            onMouseLeave={ev => ev.currentTarget.style.transform = "scale(1)"}>
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}
