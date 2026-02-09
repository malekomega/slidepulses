"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

function generateCode() { return Math.floor(100000 + Math.random() * 900000).toString(); }

const bg = "#060810";
const card = "#0D0F14";
const border = "#131520";
const primary = "#6366F1";
const textMain = "#E2E8F0";
const textDim = "#4a5070";
const font = "'DM Sans', sans-serif";
const fontTitle = "'Outfit', sans-serif";

// Check if slide has interactive element
function getInteractive(slide) {
  const elements = slide?.elements || [];
  return elements.find((el) => el.type === "interactive");
}

// Render a slide's visual elements (text, shapes)
function SlidePreview({ slide, width = 700, height = 394 }) {
  const elements = slide?.elements || [];
  const scaleX = width / 800;
  const scaleY = height / 450;
  return (
    <div style={{ width, height, background: slide?.background || "#0F1117", borderRadius: 12, position: "relative", overflow: "hidden", border: "1px solid " + border }}>
      {elements.map((el, i) => {
        if (el.type === "text") {
          return (
            <div key={i} style={{ position: "absolute", left: el.x * scaleX, top: el.y * scaleY, width: el.w * scaleX, height: el.h * scaleY, fontSize: (el.fontSize || 16) * scaleX, fontWeight: el.fontWeight || "400", color: el.color || textMain, fontFamily: el.fontFamily || font, textAlign: el.textAlign || "left", display: "flex", alignItems: el.verticalAlign === "center" ? "center" : "flex-start", lineHeight: 1.3, overflow: "hidden" }}>
              {el.content}
            </div>
          );
        }
        if (el.type === "shape") {
          return (
            <div key={i} style={{ position: "absolute", left: el.x * scaleX, top: el.y * scaleY, width: el.w * scaleX, height: el.h * scaleY, background: el.fill || primary, borderRadius: el.shapeType === "roundRect" ? 12 * scaleX : el.shapeType === "circle" ? "50%" : 0, border: el.stroke ? "1px solid " + el.stroke : "none" }} />
          );
        }
        if (el.type === "interactive") {
          return (
            <div key={i} style={{ position: "absolute", left: el.x * scaleX, top: el.y * scaleY, width: el.w * scaleX, height: el.h * scaleY, background: primary + "08", border: "1px dashed " + primary + "30", borderRadius: 10 * scaleX, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: primary, fontSize: 13 * scaleX, fontWeight: 600 }}>
                {el.interactiveType === "poll" ? "📊 Poll" : el.interactiveType === "quiz" ? "❓ Quiz" : "☁️ Word Cloud"}: {el.question || ""}
              </span>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export default function PresenterView() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [presentations, setPresentations] = useState([]);
  const [loadingPres, setLoadingPres] = useState(true);
  const [selectedPres, setSelectedPres] = useState(null);
  const [allSlides, setAllSlides] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      const result = await supabase.auth.getSession();
      if (result?.data?.session?.user) setUser(result.data.session.user);
    };
    getUser();
  }, []);

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
    let slides;
    try { slides = typeof pres.slides === "string" ? JSON.parse(pres.slides) : pres.slides; } catch { slides = []; }
    setAllSlides(Array.isArray(slides) ? slides : []);
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
  const interactive = slide ? getInteractive(slide) : null;
  const slideResponses = responses.filter((r) => r.slide_index === currentSlide);
  const totalVotes = slideResponses.length;

  const getVoteCounts = () => {
    const c = {};
    if (interactive?.options) interactive.options.forEach((o) => { c[o] = 0; });
    slideResponses.forEach((r) => { c[r.answer] = (c[r.answer] || 0) + 1; });
    return c;
  };
  const votes = interactive ? getVoteCounts() : {};

  // ─── NOT LOGGED IN ───
  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, color: textMain }}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: fontTitle, fontSize: 28, marginBottom: 16 }}>Presenter Mode</h1>
          <p style={{ color: textDim, marginBottom: 24 }}>You need to login first</p>
          <a href="/login" style={{ padding: "12px 32px", background: primary, borderRadius: 10, color: "#fff", fontWeight: 600, textDecoration: "none", display: "inline-block" }}>Go to Login</a>
        </div>
      </div>
    );
  }

  // ─── SELECT PRESENTATION ───
  if (!session && !selectedPres) {
    return (
      <div style={{ minHeight: "100vh", background: bg, fontFamily: font, color: textMain, padding: 40 }}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ maxWidth: 600, margin: "0 auto", animation: "fadeUp 0.4s ease" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg, " + primary + ", #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 24, fontWeight: 800, color: "#fff", fontFamily: fontTitle }}>S</div>
            <h1 style={{ fontFamily: fontTitle, fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Start a Live Session</h1>
            <p style={{ color: textDim, fontSize: 15 }}>Choose a presentation to present</p>
          </div>
          {loadingPres ? (
            <div style={{ textAlign: "center", padding: 40 }}><div style={{ width: 32, height: 32, border: "3px solid #1a1d2e", borderTopColor: primary, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} /></div>
          ) : presentations.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, background: card, border: "1px solid " + border, borderRadius: 16 }}>
              <p style={{ color: textDim, fontSize: 14, marginBottom: 16 }}>No presentations found.</p>
              <a href="/dashboard" style={{ padding: "10px 24px", background: primary, borderRadius: 10, color: "#fff", fontWeight: 600, textDecoration: "none", display: "inline-block", fontSize: 14 }}>Go to Dashboard</a>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {presentations.map((p, i) => {
                let sc = 0; try { const s = typeof p.slides === "string" ? JSON.parse(p.slides) : p.slides; sc = Array.isArray(s) ? s.length : 0; } catch {}
                const grads = ["linear-gradient(135deg, #6366F1, #8B5CF6)", "linear-gradient(135deg, #EC4899, #F43F5E)", "linear-gradient(135deg, #06B6D4, #3B82F6)", "linear-gradient(135deg, #F97316, #EAB308)", "linear-gradient(135deg, #22C55E, #06B6D4)"];
                return (
                  <button key={p.id} onClick={() => selectPresentation(p)}
                    style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: card, border: "1px solid " + border, borderRadius: 12, cursor: "pointer", fontFamily: font, textAlign: "left", width: "100%", transition: "all 0.15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = primary + "50"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = border; }}>
                    <div style={{ width: 44, height: 30, borderRadius: 6, background: grads[i % grads.length], flexShrink: 0 }} />
                    <div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 600, color: textMain }}>{p.title}</div><div style={{ fontSize: 12, color: textDim }}>{sc} slides</div></div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={textDim} strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                  </button>);
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── READY TO START ───
  if (!session && selectedPres) {
    const interactiveCount = allSlides.filter((s) => getInteractive(s)).length;
    return (
      <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, color: textMain }}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        <div style={{ maxWidth: 480, width: "100%", padding: 20, textAlign: "center", animation: "fadeUp 0.4s ease" }}>
          <h1 style={{ fontFamily: fontTitle, fontSize: 28, fontWeight: 700, marginBottom: 8 }}>{selectedPres.title}</h1>
          <p style={{ color: textDim, fontSize: 15, marginBottom: 20 }}>{allSlides.length} slides • {interactiveCount} interactive questions</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button onClick={() => { setSelectedPres(null); setAllSlides([]); }} style={{ padding: "12px 28px", background: card, border: "1px solid " + border, borderRadius: 10, color: textDim, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: font }}>← Back</button>
            <button onClick={startSession} disabled={loading} style={{ padding: "12px 32px", background: "linear-gradient(135deg, " + primary + ", #7C3AED)", border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 600, cursor: loading ? "wait" : "pointer", fontFamily: font }}>{loading ? "Starting..." : "Start Session"}</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── ACTIVE SESSION ───
  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: font, color: textMain }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      {/* Top Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 28px", borderBottom: "1px solid " + border }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontFamily: fontTitle, fontWeight: 700, fontSize: 18 }}><span style={{ color: primary }}>S</span> SlidePulse</div>
          <div style={{ height: 20, width: 1, background: border }} />
          <span style={{ color: textDim, fontSize: 14 }}>{selectedPres?.title}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ background: primary + "15", border: "1px solid " + primary + "30", borderRadius: 10, padding: "6px 18px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: textDim, fontSize: 12 }}>Code:</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 700, color: primary, letterSpacing: 4 }}>{session.join_code}</span>
          </div>
          {interactive && <div style={{ fontSize: 13, color: textDim }}><span style={{ color: "#22C55E", fontWeight: 600 }}>{totalVotes}</span> responses</div>}
          <button onClick={endSession} style={{ padding: "7px 18px", background: "#F43F5E15", border: "1px solid #F43F5E30", borderRadius: 8, color: "#F43F5E", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: font }}>End</button>
        </div>
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 57px)" }}>
        {/* Slide Thumbnails */}
        <div style={{ width: 180, borderRight: "1px solid " + border, padding: "16px 10px", overflowY: "auto" }}>
          {allSlides.map((s, i) => {
            const hasQ = !!getInteractive(s);
            return (
              <button key={i} onClick={() => goToSlide(i)}
                style={{ width: "100%", padding: "8px 10px", marginBottom: 4, background: i === currentSlide ? primary + "15" : "transparent", border: i === currentSlide ? "1px solid " + primary + "30" : "1px solid transparent", borderRadius: 8, textAlign: "left", cursor: "pointer", fontFamily: font, color: i === currentSlide ? primary : textDim, fontSize: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontWeight: 600 }}>{i + 1}</span>
                  {hasQ && <span style={{ padding: "1px 6px", background: primary + "20", borderRadius: 4, fontSize: 9, color: primary, fontWeight: 600 }}>Q</span>}
                </div>
                <div style={{ fontSize: 10, marginTop: 2, opacity: 0.7, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {hasQ ? getInteractive(s).question : (s.elements?.find((e) => e.type === "text")?.content || "Slide")}
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, overflow: "auto" }}>
          {slide && !interactive && (
            /* Normal slide - show visual preview */
            <div style={{ animation: "fadeUp 0.3s ease" }}>
              <SlidePreview slide={slide} width={700} height={394} />
            </div>
          )}

          {slide && interactive && (
            /* Interactive slide - show question + results */
            <div style={{ maxWidth: 700, width: "100%", animation: "fadeUp 0.3s ease" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                <span style={{ padding: "4px 14px", background: primary + "15", borderRadius: 20, fontSize: 12, fontWeight: 600, color: primary, textTransform: "uppercase" }}>
                  {interactive.interactiveType === "wordCloud" ? "word cloud" : interactive.interactiveType}
                </span>
              </div>
              <h2 style={{ fontFamily: fontTitle, fontSize: 32, fontWeight: 700, textAlign: "center", marginBottom: 36, lineHeight: 1.3 }}>{interactive.question}</h2>

              {interactive.interactiveType === "wordCloud" ? (
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, minHeight: 100 }}>
                  {slideResponses.length === 0 ? <p style={{ color: textDim, fontSize: 14 }}>Waiting for responses...</p> :
                    Object.entries(votes).map(([w, c]) => (<span key={w} style={{ padding: "8px 18px", background: primary + "15", border: "1px solid " + primary + "25", borderRadius: 20, fontSize: 12 + c * 4, fontWeight: 600, color: primary }}>{w}</span>))}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {interactive.options.map((opt, i) => {
                    const count = votes[opt] || 0;
                    const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                    const isC = interactive.interactiveType === "quiz" && (interactive.correctIndex ?? 0) === i;
                    return (
                      <div key={i} style={{ background: card, border: "1px solid " + (isC && totalVotes > 0 ? "#22C55E30" : border), borderRadius: 12, padding: "14px 18px", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: pct + "%", background: isC && totalVotes > 0 ? "#22C55E10" : primary + "10", transition: "width 0.5s ease", borderRadius: 12 }} />
                        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ width: 26, height: 26, borderRadius: 7, background: isC && totalVotes > 0 ? "#22C55E20" : primary + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: isC && totalVotes > 0 ? "#22C55E" : primary }}>{String.fromCharCode(65 + i)}</span>
                            <span style={{ fontSize: 15, fontWeight: 500 }}>{opt}</span>
                            {isC && totalVotes > 0 && <span style={{ fontSize: 11, color: "#22C55E", fontWeight: 600 }}>✓</span>}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 18, fontWeight: 700, color: primary, fontFamily: fontTitle }}>{pct}%</span>
                            <span style={{ fontSize: 12, color: textDim }}>{count}</span>
                          </div>
                        </div>
                      </div>);
                  })}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 12 }}>
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
