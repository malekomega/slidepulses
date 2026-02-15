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

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// Check if slide has interactive element(s)
function getInteractives(slide) {
  const elements = slide?.elements || [];
  return elements.filter((el) => el.type === "interactive");
}

// Render a slide's visual elements (text, shapes, images, interactive placeholders)
function SlidePreview({ slide, width = 700, height = 394 }) {
  const elements = slide?.elements || [];
  const scaleX = width / 800;
  const scaleY = height / 450;
  // Support both 'bg' (editor format) and 'background' property names
  const slideBackground = slide?.bg || slide?.background || "#0F1117";
  return (
    <div style={{ width, height, background: slideBackground, borderRadius: 12, position: "relative", overflow: "hidden", border: "1px solid " + border }}>
      {elements.map((el, i) => {
        if (el.type === "text") {
          return (
            <div key={i} style={{ position: "absolute", left: el.x * scaleX, top: el.y * scaleY, width: (el.w || 200) * scaleX, height: (el.h || 40) * scaleY, fontSize: (el.fontSize || 16) * scaleX, fontWeight: el.fontWeight || "400", color: el.color || textMain, fontFamily: el.fontFamily || font, textAlign: el.textAlign || "left", display: "flex", alignItems: el.verticalAlign === "center" ? "center" : "flex-start", lineHeight: 1.3, overflow: "hidden", wordBreak: "break-word" }}>
              {el.content}
            </div>
          );
        }
        if (el.type === "shape") {
          const isCircle = el.shapeType === "circle";
          const isRound = el.shapeType === "roundRect";
          return (
            <div key={i} style={{ position: "absolute", left: el.x * scaleX, top: el.y * scaleY, width: (el.w || 100) * scaleX, height: (el.h || 100) * scaleY, background: el.fill || primary, borderRadius: isCircle ? "50%" : isRound ? 12 * scaleX : 0, border: el.stroke ? "1px solid " + el.stroke : "none" }} />
          );
        }
        if (el.type === "image" && el.src) {
          return (
            <div key={i} style={{ position: "absolute", left: el.x * scaleX, top: el.y * scaleY, width: (el.w || 200) * scaleX, height: (el.h || 200) * scaleY, overflow: "hidden", borderRadius: 4 * scaleX }}>
              <img src={el.src} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
          );
        }
        if (el.type === "interactive") {
          return (
            <div key={i} style={{ position: "absolute", left: el.x * scaleX, top: el.y * scaleY, width: (el.w || 300) * scaleX, height: (el.h || 200) * scaleY, background: primary + "08", border: "1px dashed " + primary + "30", borderRadius: 10 * scaleX, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: primary, fontSize: 13 * scaleX, fontWeight: 600 }}>
                {el.interactiveType === "poll" ? "📊 Poll" : el.interactiveType === "quiz" ? "❓ Quiz" : "☁️ Word Cloud"}: {el.question || ""}
              </span>
            </div>
          );
        }
        // Chart elements
        if (el.type === "chart") {
          return (
            <div key={i} style={{ position: "absolute", left: el.x * scaleX, top: el.y * scaleY, width: (el.w || 300) * scaleX, height: (el.h || 200) * scaleY, background: "#151825", borderRadius: 8 * scaleX, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #1e2235" }}>
              <span style={{ color: textDim, fontSize: 11 * scaleX }}>📊 Chart</span>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

// ─── Interactive Results Display ───
function InteractiveResults({ interactive, slideResponses }) {
  const totalVotes = slideResponses.length;
  const votes = {};
  if (interactive.options) interactive.options.forEach((o) => { votes[o] = 0; });
  slideResponses.forEach((r) => { votes[r.answer] = (votes[r.answer] || 0) + 1; });

  if (interactive.interactiveType === "wordCloud") {
    return (
      <div style={{ background: card, border: "1px solid " + border, borderRadius: 14, padding: "20px 24px", marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ padding: "3px 10px", background: primary + "15", borderRadius: 8, fontSize: 11, fontWeight: 600, color: primary }}>☁️ Word Cloud</span>
          <span style={{ fontSize: 12, color: textDim }}>{totalVotes} responses</span>
        </div>
        <h3 style={{ fontFamily: fontTitle, fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{interactive.question}</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, minHeight: 50 }}>
          {totalVotes === 0 ? <p style={{ color: textDim, fontSize: 13 }}>Waiting for responses...</p> :
            Object.entries(votes).map(([w, c]) => (
              <span key={w} style={{ padding: "6px 14px", background: primary + "15", border: "1px solid " + primary + "25", borderRadius: 16, fontSize: 11 + c * 3, fontWeight: 600, color: primary }}>{w}</span>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: card, border: "1px solid " + border, borderRadius: 14, padding: "20px 24px", marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ padding: "3px 10px", background: primary + "15", borderRadius: 8, fontSize: 11, fontWeight: 600, color: primary }}>
          {interactive.interactiveType === "quiz" ? "❓ Quiz" : "📊 Poll"}
        </span>
        <span style={{ fontSize: 12, color: textDim }}>{totalVotes} votes</span>
      </div>
      <h3 style={{ fontFamily: fontTitle, fontSize: 18, fontWeight: 700, marginBottom: 14 }}>{interactive.question}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {interactive.options.map((opt, i) => {
          const count = votes[opt] || 0;
          const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
          const isCorrect = interactive.interactiveType === "quiz" && (interactive.correctIndex ?? 0) === i;
          return (
            <div key={i} style={{ background: "#0A0C10", border: "1px solid " + (isCorrect && totalVotes > 0 ? "#22C55E30" : "#1a1d2e"), borderRadius: 10, padding: "12px 16px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: pct + "%", background: isCorrect && totalVotes > 0 ? "#22C55E10" : primary + "10", transition: "width 0.5s ease", borderRadius: 10 }} />
              <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 24, height: 24, borderRadius: 6, background: isCorrect && totalVotes > 0 ? "#22C55E20" : primary + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: isCorrect && totalVotes > 0 ? "#22C55E" : primary }}>{String.fromCharCode(65 + i)}</span>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{opt}</span>
                  {isCorrect && totalVotes > 0 && <span style={{ fontSize: 11, color: "#22C55E", fontWeight: 600 }}>✓ Correct</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: primary, fontFamily: fontTitle }}>{pct}%</span>
                  <span style={{ fontSize: 11, color: textDim }}>({count})</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


export default function PresenterView() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [presentations, setPresentations] = useState([]);
  const [selectedPres, setSelectedPres] = useState(null);
  const [allSlides, setAllSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPres, setLoadingPres] = useState(false);

  // Auth check
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (!u) window.location.href = "/login";
      else setUser(u);
    });
  }, []);

  // Load presentations
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoadingPres(true);
      const { data } = await supabase.from("presentations").select("*").eq("user_id", user.id).order("updated_at", { ascending: false });
      setPresentations(data || []);
      setLoadingPres(false);
    };
    load();
  }, [user]);

  const selectPresentation = (pres) => {
    setSelectedPres(pres);
    let slides = [];
    try {
      let raw = pres.slides;
      // If it's a string, parse it
      if (typeof raw === "string") raw = JSON.parse(raw);
      // If it's STILL a string (double-stringified), parse again
      if (typeof raw === "string") raw = JSON.parse(raw);
      slides = Array.isArray(raw) ? raw : [];
    } catch { slides = []; }
    console.log("[SlidePlus Presenter] Loaded slides:", slides.length, slides);
    setAllSlides(slides);
  };

  const startSession = async () => {
    if (!user || !selectedPres) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.from("sessions").insert({ user_id: user.id, presentation_id: selectedPres.id, join_code: generateCode(), is_active: true, current_slide: 0 }).select().single();
      if (error) throw error;
      setSession(data);
      setCurrentSlide(0);
      setResponses([]);
    } catch (e) { alert("Failed: " + (e?.message || "")); }
    finally { setLoading(false); }
  };

  const endSession = async () => {
    if (!session) return;
    await supabase.from("sessions").update({ is_active: false }).eq("id", session.id);
    setSession(null); setResponses([]); setCurrentSlide(0); setSelectedPres(null); setAllSlides([]);
  };

  const goToSlide = async (index) => {
    if (!session || index < 0 || index >= allSlides.length) return;
    setCurrentSlide(index);
    await supabase.from("sessions").update({ current_slide: index }).eq("id", session.id);
  };

  // Real-time responses
  useEffect(() => {
    if (!session) return;
    const loadR = async () => { const { data } = await supabase.from("responses").select("*").eq("session_id", session.id); if (data) setResponses(data); };
    loadR();
    const channel = supabase.channel("resp-" + session.id)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "responses", filter: "session_id=eq." + session.id }, (p) => { setResponses((prev) => [...prev, p.new]); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [session?.id]);

  const slide = allSlides[currentSlide];
  const interactives = slide ? getInteractives(slide) : [];
  const slideResponses = responses.filter((r) => r.slide_index === currentSlide);

  // ─── SELECT PRESENTATION ───
  if (!session) {
    if (!selectedPres) {
      return (
        <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, color: textMain }}>
          <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
          <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <div style={{ width: "100%", maxWidth: 500, padding: 20, animation: "fadeUp 0.4s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg, " + primary + ", #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <svg width="28" height="28" viewBox="0 0 268.05 270.45" fill="#fff"><path d="M198.37,131.77c-1.87-3.04-4.09-5.85-6.6-8.36-3.15-3.15-6.64-5.84-10.38-8.01v-51.63c0-5.43-1.86-10.12-5.5-13.91-3.51-3.65-7.72-5.71-12.51-6.14h-.06c-1.01-.09-2.03-.14-3.07-.14H62.93c-1.04,0-2.06.05-3.07.14h-.06c-4.79.43-9,2.49-12.51,6.14-3.65,3.79-5.5,8.48-5.5,13.91v133.41c0,5.43,1.86,10.12,5.5,13.91,3.51,3.65,7.72,5.71,12.51,6.14h.06c1.01.09,2.03.14,3.07.14h77.48c2.78,6.1,6.68,11.67,11.58,16.44l.16.15c8.31,8.03,18.22,12.71,29.42,13.89.79.08,1.58.14,2.37.17l2.16.05c.7.01,1.41,0,2.12-.02.85-.04,1.69-.1,2.53-.2,11.2-1.18,21.11-5.87,29.42-13.89,8.55-8.27,13.55-18.49,14.84-30.38.03-.24.05-.48.07-.72.16-1.94.24-3.9.24-5.87,0-11.96-3.55-22.68-10.54-31.82-1.77-2.31-3.72-4.48-5.83-6.47l-.29-.27c-.05-.04-.09-.08-.14-.12Z"/></svg>
              </div>
              <h1 style={{ fontFamily: fontTitle, fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Presenter Mode</h1>
              <p style={{ color: textDim, fontSize: 15 }}>Select a presentation to go live</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {loadingPres ? (
                <div style={{ textAlign: "center", padding: 40 }}>
                  <div style={{ width: 32, height: 32, border: "3px solid #1a1d2e", borderTopColor: primary, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
                </div>
              ) : presentations.length === 0 ? (
                <p style={{ color: textDim, textAlign: "center", padding: 40, fontSize: 14 }}>No presentations found. Create one in the editor first.</p>
              ) : presentations.map((p) => {
                let sc = 0; try { let s = typeof p.slides === "string" ? JSON.parse(p.slides) : p.slides; if (typeof s === "string") s = JSON.parse(s); sc = Array.isArray(s) ? s.length : 0; } catch {}
                return (
                  <button key={p.id} onClick={() => selectPresentation(p)}
                    style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: card, border: "1px solid " + border, borderRadius: 12, cursor: "pointer", fontFamily: font, transition: "all 0.15s", textAlign: "left", width: "100%" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = primary + "40"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = border; }}>
                    <div style={{ width: 42, height: 28, borderRadius: 6, background: "linear-gradient(135deg, " + primary + ", #8B5CF6)", flexShrink: 0, opacity: 0.7 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: textMain }}>{p.title}</div>
                      <div style={{ fontSize: 12, color: textDim }}>{sc} slides</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button onClick={() => window.location.href = "/dashboard"} style={{ display: "block", margin: "20px auto 0", background: "none", border: "none", color: primary, fontSize: 14, cursor: "pointer", fontFamily: font }}>← Back to Dashboard</button>
          </div>
        </div>
      );
    }

    // ─── CONFIRM & START ───
    const interactiveCount = allSlides.filter((s) => getInteractives(s).length > 0).length;
    return (
      <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, color: textMain }}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <div style={{ textAlign: "center", animation: "fadeUp 0.4s ease", maxWidth: 460, padding: 20 }}>
          <h1 style={{ fontFamily: fontTitle, fontSize: 28, fontWeight: 700, marginBottom: 6 }}>{selectedPres.title}</h1>
          <p style={{ color: textDim, fontSize: 15, marginBottom: 20 }}>{allSlides.length} slides • {interactiveCount} interactive</p>
          
          {/* Mini preview */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <SlidePreview slide={allSlides[0]} width={360} height={202} />
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button onClick={() => { setSelectedPres(null); setAllSlides([]); }} style={{ padding: "12px 28px", background: card, border: "1px solid " + border, borderRadius: 10, color: textDim, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: font }}>← Back</button>
            <button onClick={startSession} disabled={loading}
              style={{ padding: "12px 36px", background: "linear-gradient(135deg, " + primary + ", #7C3AED)", border: "none", borderRadius: 10, color: "#fff", fontSize: 16, fontWeight: 700, cursor: loading ? "wait" : "pointer", fontFamily: font }}>
              {loading ? "Starting..." : "🚀 Start Session"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── LIVE SESSION ───
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: bg, fontFamily: font, color: textMain }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>

      {/* Top Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", borderBottom: "1px solid " + border, flexShrink: 0, background: "#0A0C12" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg, " + primary + ", #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 268.05 270.45" fill="#fff"><path d="M198.37,131.77c-1.87-3.04-4.09-5.85-6.6-8.36-3.15-3.15-6.64-5.84-10.38-8.01v-51.63c0-5.43-1.86-10.12-5.5-13.91-3.51-3.65-7.72-5.71-12.51-6.14h-.06c-1.01-.09-2.03-.14-3.07-.14H62.93c-1.04,0-2.06.05-3.07.14h-.06c-4.79.43-9,2.49-12.51,6.14-3.65,3.79-5.5,8.48-5.5,13.91v133.41c0,5.43,1.86,10.12,5.5,13.91,3.51,3.65,7.72,5.71,12.51,6.14h.06c1.01.09,2.03.14,3.07.14h77.48c2.78,6.1,6.68,11.67,11.58,16.44l.16.15c8.31,8.03,18.22,12.71,29.42,13.89.79.08,1.58.14,2.37.17l2.16.05c.7.01,1.41,0,2.12-.02.85-.04,1.69-.1,2.53-.2,11.2-1.18,21.11-5.87,29.42-13.89,8.55-8.27,13.55-18.49,14.84-30.38.03-.24.05-.48.07-.72.16-1.94.24-3.9.24-5.87,0-11.96-3.55-22.68-10.54-31.82-1.77-2.31-3.72-4.48-5.83-6.47l-.29-.27c-.05-.04-.09-.08-.14-.12Z"/></svg>
            </div>
            <span style={{ fontFamily: fontTitle, fontWeight: 700, fontSize: 15 }}>SlidePlus</span>
          </div>
          <div style={{ width: 1, height: 22, background: border }} />
          <span style={{ fontSize: 13, color: textDim }}>{selectedPres?.title}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", animation: "pulse 1.5s infinite" }} />
            <span style={{ fontSize: 12, color: "#22C55E", fontWeight: 600 }}>LIVE</span>
          </div>
          <div style={{ padding: "6px 16px", background: card, border: "1px solid " + primary + "30", borderRadius: 8 }}>
            <span style={{ fontSize: 12, color: textDim }}>Code: </span>
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 18, fontWeight: 700, color: primary, letterSpacing: 4 }}>{session.join_code}</span>
          </div>
          <button onClick={endSession} style={{ padding: "8px 18px", background: "#F43F5E15", border: "1px solid #F43F5E30", borderRadius: 8, color: "#F43F5E", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: font }}>End</button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Slide Thumbnails */}
        <div style={{ width: 160, borderRight: "1px solid " + border, padding: "12px 8px", overflowY: "auto", flexShrink: 0 }}>
          {allSlides.map((s, i) => {
            const hasQ = getInteractives(s).length > 0;
            const firstText = s.elements?.find((e) => e.type === "text")?.content || "Slide";
            return (
              <button key={i} onClick={() => goToSlide(i)}
                style={{ width: "100%", padding: "8px 10px", marginBottom: 4, background: i === currentSlide ? primary + "15" : "transparent", border: i === currentSlide ? "1px solid " + primary + "30" : "1px solid transparent", borderRadius: 8, textAlign: "left", cursor: "pointer", fontFamily: font, color: i === currentSlide ? primary : textDim, fontSize: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontWeight: 600 }}>{i + 1}</span>
                  {hasQ && <span style={{ padding: "1px 5px", background: primary + "20", borderRadius: 4, fontSize: 9, color: primary, fontWeight: 600 }}>Q</span>}
                </div>
                <div style={{ fontSize: 10, marginTop: 2, opacity: 0.7, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {hasQ ? getInteractives(s)[0].question : firstText}
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 32px", overflow: "auto" }}>
          {slide && (
            <div style={{ maxWidth: 800, width: "100%", animation: "fadeUp 0.3s ease" }} key={currentSlide}>
              {/* Always show slide preview */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <SlidePreview slide={slide} width={700} height={394} />
              </div>

              {/* Show interactive results below the preview */}
              {interactives.map((inter, idx) => (
                <InteractiveResults
                  key={idx}
                  interactive={inter}
                  slideResponses={slideResponses}
                />
              ))}
            </div>
          )}

          {/* Navigation */}
          <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 12, flexShrink: 0, paddingBottom: 16 }}>
            <button onClick={() => goToSlide(currentSlide - 1)} disabled={currentSlide === 0}
              style={{ padding: "10px 24px", background: card, border: "1px solid " + border, borderRadius: 10, color: currentSlide === 0 ? textDim : textMain, fontSize: 14, fontWeight: 600, cursor: currentSlide === 0 ? "default" : "pointer", fontFamily: font, opacity: currentSlide === 0 ? 0.5 : 1 }}>← Previous</button>
            <span style={{ color: textDim, fontSize: 14, minWidth: 60, textAlign: "center" }}>{currentSlide + 1} / {allSlides.length}</span>
            <button onClick={() => goToSlide(currentSlide + 1)} disabled={currentSlide === allSlides.length - 1}
              style={{ padding: "10px 24px", background: "linear-gradient(135deg, " + primary + ", #7C3AED)", border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 600, cursor: currentSlide === allSlides.length - 1 ? "default" : "pointer", fontFamily: font, opacity: currentSlide === allSlides.length - 1 ? 0.5 : 1 }}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
