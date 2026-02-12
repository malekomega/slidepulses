"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

// ─── ICONS ───
const Icons = {
  Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>,
  Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14"/></svg>,
  Copy: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
  Play: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>,
  Text: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>,
  Image: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>,
  Square: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>,
  Circle: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/></svg>,
  Chart: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
  Poll: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  Quiz: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/></svg>,
  Cloud: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg>,
  Settings: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  ChevLeft: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>,
  ChevRight: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>,
  Close: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  Move: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/></svg>,
  Layers: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  Bold: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6zM6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"/></svg>,
  Italic: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>,
  AlignL: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>,
  AlignC: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/></svg>,
  Undo: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6.69 3L3 13"/></svg>,
  Redo: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 019-9 9 9 0 016.69 3L21 13"/></svg>,
  Share: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  Download: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>,
  ArrowUp: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6"/></svg>,
  ArrowDown: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>,
  Grid: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  Star: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  Expand: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>,
};

// ─── UNIQUE ID GENERATOR ───
let _uid = 0;
const uid = () => `el_${++_uid}_${Date.now()}`;

// ─── DEFAULT SLIDE TEMPLATES ───
const SLIDE_TEMPLATES = {
  blank: { name: "Blank", bg: "#0D0F14", elements: [] },
  title: {
    name: "Title Slide",
    bg: "linear-gradient(135deg, #0D0F14 0%, #1a1d2e 100%)",
    elements: [
      { id: uid(), type: "text", x: 80, y: 120, w: 640, h: 80, content: "Presentation Title", fontSize: 48, fontWeight: "700", color: "#E2E8F0", fontFamily: "'Outfit', sans-serif", textAlign: "left" },
      { id: uid(), type: "text", x: 80, y: 220, w: 500, h: 40, content: "Subtitle goes here", fontSize: 22, fontWeight: "400", color: "#64748B", fontFamily: "'DM Sans', sans-serif", textAlign: "left" },
      { id: uid(), type: "shape", x: 80, y: 280, w: 60, h: 4, shapeType: "rect", fill: "#6366F1" },
    ],
  },
  content: {
    name: "Content",
    bg: "#0D0F14",
    elements: [
      { id: uid(), type: "text", x: 60, y: 40, w: 680, h: 50, content: "Section Title", fontSize: 32, fontWeight: "700", color: "#E2E8F0", fontFamily: "'Outfit', sans-serif", textAlign: "left" },
      { id: uid(), type: "shape", x: 60, y: 100, w: 40, h: 3, shapeType: "rect", fill: "#6366F1" },
      { id: uid(), type: "text", x: 60, y: 130, w: 680, h: 240, content: "Add your content here. Click to edit this text block and add your information, bullet points, or any other content you need.", fontSize: 18, fontWeight: "400", color: "#94A3B8", fontFamily: "'DM Sans', sans-serif", textAlign: "left" },
    ],
  },
  twoColumn: {
    name: "Two Column",
    bg: "#0D0F14",
    elements: [
      { id: uid(), type: "text", x: 60, y: 40, w: 680, h: 50, content: "Comparison", fontSize: 32, fontWeight: "700", color: "#E2E8F0", fontFamily: "'Outfit', sans-serif", textAlign: "center" },
      { id: uid(), type: "shape", x: 40, y: 110, w: 350, h: 260, shapeType: "roundRect", fill: "#151825", stroke: "#1e2235" },
      { id: uid(), type: "text", x: 60, y: 125, w: 310, h: 35, content: "Column One", fontSize: 22, fontWeight: "600", color: "#6366F1", fontFamily: "'Outfit', sans-serif", textAlign: "center" },
      { id: uid(), type: "text", x: 60, y: 170, w: 310, h: 180, content: "Description for the first column goes here.", fontSize: 16, fontWeight: "400", color: "#94A3B8", fontFamily: "'DM Sans', sans-serif", textAlign: "center" },
      { id: uid(), type: "shape", x: 410, y: 110, w: 350, h: 260, shapeType: "roundRect", fill: "#151825", stroke: "#1e2235" },
      { id: uid(), type: "text", x: 430, y: 125, w: 310, h: 35, content: "Column Two", fontSize: 22, fontWeight: "600", color: "#818CF8", fontFamily: "'Outfit', sans-serif", textAlign: "center" },
      { id: uid(), type: "text", x: 430, y: 170, w: 310, h: 180, content: "Description for the second column goes here.", fontSize: 16, fontWeight: "400", color: "#94A3B8", fontFamily: "'DM Sans', sans-serif", textAlign: "center" },
    ],
  },
  poll: {
    name: "Live Poll",
    bg: "linear-gradient(160deg, #0D0F14 0%, #0f1129 100%)",
    elements: [
      { id: uid(), type: "text", x: 80, y: 40, w: 640, h: 50, content: "What do you think?", fontSize: 34, fontWeight: "700", color: "#E2E8F0", fontFamily: "'Outfit', sans-serif", textAlign: "center" },
      { id: uid(), type: "interactive", x: 80, y: 110, w: 640, h: 270, interactiveType: "poll", question: "What do you think?", options: ["Option A", "Option B", "Option C", "Option D"], votes: [0, 0, 0, 0] },
    ],
  },
  quiz: {
    name: "Quiz",
    bg: "linear-gradient(160deg, #0D0F14 0%, #1a0f29 100%)",
    elements: [
      { id: uid(), type: "text", x: 80, y: 30, w: 640, h: 50, content: "Quick Quiz", fontSize: 34, fontWeight: "700", color: "#E2E8F0", fontFamily: "'Outfit', sans-serif", textAlign: "center" },
      { id: uid(), type: "interactive", x: 80, y: 100, w: 640, h: 280, interactiveType: "quiz", question: "What is the capital of France?", options: ["London", "Paris", "Berlin", "Madrid"], correctIndex: 1, revealed: false },
    ],
  },
  wordCloud: {
    name: "Word Cloud",
    bg: "#0D0F14",
    elements: [
      { id: uid(), type: "text", x: 80, y: 30, w: 640, h: 50, content: "Share Your Thoughts", fontSize: 34, fontWeight: "700", color: "#E2E8F0", fontFamily: "'Outfit', sans-serif", textAlign: "center" },
      { id: uid(), type: "interactive", x: 60, y: 100, w: 680, h: 280, interactiveType: "wordCloud", words: ["Innovation", "Technology", "Future", "Growth", "AI", "Data", "Cloud", "Speed", "Design", "Impact", "Team", "Vision"] },
    ],
  },
};

// ─── COLOR PRESETS ───
const ACCENT_COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#F43F5E", "#F97316", "#EAB308", "#22C55E", "#06B6D4", "#3B82F6", "#E2E8F0"];
const BG_PRESETS = ["#0D0F14", "#151825", "#1a1d2e", "#0f1129", "#1a0f29", "#0f2922", "#291a0f", "#290f1a"];

// ─── MAIN APP ───
export default function SlidePulseEditor() {
  const [slides, setSlides] = useState([
    { ...JSON.parse(JSON.stringify(SLIDE_TEMPLATES.title)), id: uid() },
    { ...JSON.parse(JSON.stringify(SLIDE_TEMPLATES.content)), id: uid() },
    { ...JSON.parse(JSON.stringify(SLIDE_TEMPLATES.poll)), id: uid() },
  ]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [dragState, setDragState] = useState(null);
  const [resizeState, setResizeState] = useState(null);
  const [presenting, setPresenting] = useState(false);
  const [presentSlideIndex, setPresentSlideIndex] = useState(0);
  const [showTemplatePanel, setShowTemplatePanel] = useState(false);
  const [editingTextId, setEditingTextId] = useState(null);
  const [rightPanel, setRightPanel] = useState("properties");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const m = window.innerWidth < 900;
      setIsMobile(m);
      if (m) { setShowLeftPanel(false); setShowRightPanel(false); }
      else { setShowLeftPanel(true); setShowRightPanel(true); }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [presentationId, setPresentationId] = useState(null);
  const [presentationTitle, setPresentationTitle] = useState("Untitled Presentation");
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const searchParams = useSearchParams();

  // Load presentation from Supabase if ?id= is in URL
  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) return;
    setPresentationId(id);
    const load = async () => {
      const { data, error } = await supabase.from("presentations").select("*").eq("id", id).single();
      if (error || !data) return;
      setPresentationTitle(data.title || "Untitled Presentation");
      try {
        const parsed = typeof data.slides === "string" ? JSON.parse(data.slides) : data.slides;
if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].elements) setSlides(parsed);      } catch {}
    };
    load();
  }, [searchParams]);

  // Save to Supabase
  const handleSave = async () => {
    if (!presentationId) { alert("No presentation to save. Create one from Dashboard first."); return; }
    setSaving(true);
    try {
      const { error } = await supabase.from("presentations").update({ title: presentationTitle, slides: JSON.stringify(slides), updated_at: new Date().toISOString() }).eq("id", presentationId);
      if (error) throw error;
      setLastSaved(new Date());
    } catch (e) { alert("Save failed: " + (e?.message || "")); }
    finally { setSaving(false); }
  };
  const canvasRef = useRef(null);

  const activeSlide = slides[activeSlideIndex];
  const selectedElement = activeSlide?.elements.find(e => e.id === selectedElementId);

  // ─── HISTORY ───
  const pushHistory = useCallback((newSlides) => {
    setHistory(prev => [...prev.slice(0, historyIndex + 1), JSON.stringify(newSlides)]);
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSlides(JSON.parse(history[historyIndex - 1]));
    }
  };
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSlides(JSON.parse(history[historyIndex + 1]));
    }
  };

  const updateSlides = (newSlides) => {
    setSlides(newSlides);
    pushHistory(newSlides);
  };

  // ─── SLIDE OPS ───
  const addSlide = (templateKey = "blank") => {
    const tpl = SLIDE_TEMPLATES[templateKey];
    const newSlide = { ...JSON.parse(JSON.stringify(tpl)), id: uid() };
    newSlide.elements.forEach(el => el.id = uid());
    const ns = [...slides, newSlide];
    updateSlides(ns);
    setActiveSlideIndex(ns.length - 1);
    setShowTemplatePanel(false);
  };

  const duplicateSlide = (idx) => {
    const clone = JSON.parse(JSON.stringify(slides[idx]));
    clone.id = uid();
    clone.elements.forEach(e => e.id = uid());
    const ns = [...slides];
    ns.splice(idx + 1, 0, clone);
    updateSlides(ns);
    setActiveSlideIndex(idx + 1);
  };

  const deleteSlide = (idx) => {
    if (slides.length <= 1) return;
    const ns = slides.filter((_, i) => i !== idx);
    updateSlides(ns);
    setActiveSlideIndex(Math.min(idx, ns.length - 1));
  };

  const moveSlide = (idx, dir) => {
    const ni = idx + dir;
    if (ni < 0 || ni >= slides.length) return;
    const ns = [...slides];
    [ns[idx], ns[ni]] = [ns[ni], ns[idx]];
    updateSlides(ns);
    setActiveSlideIndex(ni);
  };

  // ─── ELEMENT OPS ───
  const addElement = (type, extra = {}) => {
    const defaults = {
      text: { x: 100, y: 150, w: 400, h: 60, content: "New text", fontSize: 24, fontWeight: "400", color: "#E2E8F0", fontFamily: "'DM Sans', sans-serif", textAlign: "left" },
      shape: { x: 200, y: 150, w: 120, h: 120, shapeType: "rect", fill: "#6366F1", stroke: "none", opacity: 1 },
      image: { x: 150, y: 100, w: 250, h: 180, src: "", placeholder: true },
      interactive: { x: 80, y: 110, w: 640, h: 270, interactiveType: "poll", question: "Your question?", options: ["Option A", "Option B", "Option C"], votes: [0, 0, 0] },
    };
    const el = { id: uid(), type, ...defaults[type], ...extra };
    const ns = slides.map((s, i) => i === activeSlideIndex ? { ...s, elements: [...s.elements, el] } : s);
    updateSlides(ns);
    setSelectedElementId(el.id);
  };

  const updateElement = (id, updates) => {
    const ns = slides.map((s, i) => i === activeSlideIndex ? {
      ...s,
      elements: s.elements.map(e => e.id === id ? { ...e, ...updates } : e)
    } : s);
    updateSlides(ns);
  };

  const deleteElement = (id) => {
    const ns = slides.map((s, i) => i === activeSlideIndex ? {
      ...s,
      elements: s.elements.filter(e => e.id !== id)
    } : s);
    updateSlides(ns);
    setSelectedElementId(null);
  };

  const updateSlideBg = (bg) => {
    const ns = slides.map((s, i) => i === activeSlideIndex ? { ...s, bg } : s);
    updateSlides(ns);
  };

  // ─── DRAG & RESIZE ───
  const handleCanvasMouseDown = (e) => {
    if (e.target === canvasRef.current || e.target.dataset.canvas) {
      setSelectedElementId(null);
      setEditingTextId(null);
    }
  };

  const handleElementMouseDown = (e, elId) => {
    e.stopPropagation();
    if (editingTextId === elId) return;
    setSelectedElementId(elId);
    const el = activeSlide.elements.find(x => x.id === elId);
    const rect = canvasRef.current.getBoundingClientRect();
    const scale = rect.width / 800;
    setDragState({ id: elId, startX: e.clientX, startY: e.clientY, origX: el.x, origY: el.y, scale });
  };

  const handleResizeMouseDown = (e, elId, handle) => {
    e.stopPropagation();
    const el = activeSlide.elements.find(x => x.id === elId);
    const rect = canvasRef.current.getBoundingClientRect();
    const scale = rect.width / 800;
    setResizeState({ id: elId, handle, startX: e.clientX, startY: e.clientY, origX: el.x, origY: el.y, origW: el.w, origH: el.h, scale });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragState) {
        const dx = (e.clientX - dragState.startX) / dragState.scale;
        const dy = (e.clientY - dragState.startY) / dragState.scale;
        const ns = slides.map((s, i) => i === activeSlideIndex ? {
          ...s, elements: s.elements.map(el => el.id === dragState.id ? { ...el, x: Math.round(dragState.origX + dx), y: Math.round(dragState.origY + dy) } : el)
        } : s);
        setSlides(ns);
      }
      if (resizeState) {
        const dx = (e.clientX - resizeState.startX) / resizeState.scale;
        const dy = (e.clientY - resizeState.startY) / resizeState.scale;
        const { handle, origX, origY, origW, origH } = resizeState;
        let nx = origX, ny = origY, nw = origW, nh = origH;
        if (handle.includes("e")) nw = Math.max(40, origW + dx);
        if (handle.includes("w")) { nw = Math.max(40, origW - dx); nx = origX + (origW - nw); }
        if (handle.includes("s")) nh = Math.max(20, origH + dy);
        if (handle.includes("n")) { nh = Math.max(20, origH - dy); ny = origY + (origH - nh); }
        const ns = slides.map((s, i) => i === activeSlideIndex ? {
          ...s, elements: s.elements.map(el => el.id === resizeState.id ? { ...el, x: Math.round(nx), y: Math.round(ny), w: Math.round(nw), h: Math.round(nh) } : el)
        } : s);
        setSlides(ns);
      }
    };
    const handleMouseUp = () => {
      if (dragState || resizeState) pushHistory(slides);
      setDragState(null);
      setResizeState(null);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => { window.removeEventListener("mousemove", handleMouseMove); window.removeEventListener("mouseup", handleMouseUp); };
  }, [dragState, resizeState, slides, activeSlideIndex]);

  // ─── KEYBOARD SHORTCUTS ───
  useEffect(() => {
    const handler = (e) => {
      if (presenting) {
        if (e.key === "Escape") setPresenting(false);
        if (e.key === "ArrowRight" || e.key === " ") setPresentSlideIndex(i => Math.min(i + 1, slides.length - 1));
        if (e.key === "ArrowLeft") setPresentSlideIndex(i => Math.max(i - 1, 0));
        return;
      }
      if (editingTextId) return;
     if (e.key === "Delete") {
        if (selectedElementId) { e.preventDefault(); deleteElement(selectedElementId); }
      }
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z") { e.preventDefault(); undo(); }
        if (e.key === "y") { e.preventDefault(); redo(); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [presenting, selectedElementId, editingTextId, slides.length]);

  // ─── RENDER ELEMENT ───
  const renderElement = (el, isPresentation = false) => {
    const isSelected = el.id === selectedElementId && !isPresentation;
    const isEditing = editingTextId === el.id;

    const wrapStyle = {
      position: "absolute",
      left: el.x,
      top: el.y,
      width: el.w,
      height: el.h,
      cursor: isPresentation ? "default" : (dragState?.id === el.id ? "grabbing" : "grab"),
      outline: isSelected ? "2px solid #6366F1" : "none",
      outlineOffset: "2px",
      zIndex: isSelected ? 50 : 1,
    };

    const resizeHandles = isSelected && !isPresentation && (
      <>
        {["nw","ne","sw","se","n","s","e","w"].map(h => {
          const s = { position: "absolute", width: h.length === 1 ? (h === "n" || h === "s" ? 20 : 8) : 8, height: h.length === 1 ? (h === "e" || h === "w" ? 20 : 8) : 8, background: "#6366F1", borderRadius: 2, zIndex: 100 };
          if (h.includes("n")) s.top = -4;
          if (h.includes("s")) s.bottom = -4;
          if (h.includes("w")) s.left = -4;
          if (h.includes("e")) s.right = -4;
          if (h === "n" || h === "s") { s.left = "50%"; s.transform = "translateX(-50%)"; }
          if (h === "e" || h === "w") { s.top = "50%"; s.transform = "translateY(-50%)"; }
          if (h === "nw") s.cursor = "nwse-resize";
          if (h === "ne") s.cursor = "nesw-resize";
          if (h === "sw") s.cursor = "nesw-resize";
          if (h === "se") s.cursor = "nwse-resize";
          if (h === "n" || h === "s") s.cursor = "ns-resize";
          if (h === "e" || h === "w") s.cursor = "ew-resize";
          return <div key={h} style={s} onMouseDown={(e) => handleResizeMouseDown(e, el.id, h)} />;
        })}
      </>
    );

    if (el.type === "text") {
      return (
        <div key={el.id} style={wrapStyle} onMouseDown={(e) => !isPresentation && handleElementMouseDown(e, el.id)} onDoubleClick={() => !isPresentation && setEditingTextId(el.id)}>
          {isEditing ? (
            <textarea
              autoFocus
              value={el.content}
              onChange={(e) => updateElement(el.id, { content: e.target.value })}
              onBlur={() => setEditingTextId(null)}
              style={{ width: "100%", height: "100%", background: "transparent", border: "1px dashed #6366F166", color: el.color, fontSize: el.fontSize, fontWeight: el.fontWeight, fontFamily: el.fontFamily, textAlign: el.textAlign, resize: "none", outline: "none", padding: 4, lineHeight: 1.4 }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", color: el.color, fontSize: el.fontSize, fontWeight: el.fontWeight, fontFamily: el.fontFamily, textAlign: el.textAlign, lineHeight: 1.4, overflow: "hidden", whiteSpace: "pre-wrap", wordBreak: "break-word", padding: 4 }}>
              {el.content}
            </div>
          )}
          {resizeHandles}
        </div>
      );
    }

    if (el.type === "shape") {
      const shapeContent = () => {
        if (el.shapeType === "circle") return <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: el.fill, border: el.stroke && el.stroke !== "none" ? `2px solid ${el.stroke}` : "none", opacity: el.opacity ?? 1 }} />;
        if (el.shapeType === "roundRect") return <div style={{ width: "100%", height: "100%", borderRadius: 12, background: el.fill, border: el.stroke && el.stroke !== "none" ? `1px solid ${el.stroke}` : "none", opacity: el.opacity ?? 1 }} />;
        return <div style={{ width: "100%", height: "100%", borderRadius: 2, background: el.fill, border: el.stroke && el.stroke !== "none" ? `2px solid ${el.stroke}` : "none", opacity: el.opacity ?? 1 }} />;
      };
      return (
        <div key={el.id} style={wrapStyle} onMouseDown={(e) => !isPresentation && handleElementMouseDown(e, el.id)}>
          {shapeContent()}
          {resizeHandles}
        </div>
      );
    }

    if (el.type === "image") {
      return (
        <div key={el.id} style={wrapStyle} onMouseDown={(e) => !isPresentation && handleElementMouseDown(e, el.id)}>
          {el.placeholder || !el.src ? (
            <div style={{ width: "100%", height: "100%", background: "#151825", border: "2px dashed #2a2e45", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#4a5070", gap: 8 }}>
              <Icons.Image />
              <span style={{ fontSize: 12 }}>Click to add image</span>
            </div>
          ) : (
            <img src={el.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
          )}
          {resizeHandles}
        </div>
      );
    }

    if (el.type === "interactive") {
      return (
        <div key={el.id} style={wrapStyle} onMouseDown={(e) => !isPresentation && handleElementMouseDown(e, el.id)}>
          <InteractiveElement el={el} isPresentation={isPresentation} onUpdate={(updates) => updateElement(el.id, updates)} />
          {resizeHandles}
        </div>
      );
    }

    return null;
  };

  // ─── PRESENTATION MODE ───
  if (presenting) {
    const slide = slides[presentSlideIndex];
    return (
      <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <div style={{ position: "relative", width: "100vw", height: "56.25vw", maxHeight: "100vh", maxWidth: "177.78vh", background: slide.bg, overflow: "hidden" }}>
          {slide.elements.map(el => {
            const scaleX = (typeof window !== 'undefined' ? Math.min(window.innerWidth, window.innerHeight * 16/9) : 800) / 800;
            const scaleY = (typeof window !== 'undefined' ? Math.min(window.innerHeight, window.innerWidth * 9/16) : 450) / 450;
            return renderElement({ ...el, x: el.x * scaleX, y: el.y * scaleY, w: el.w * scaleX, h: el.h * scaleY, fontSize: el.fontSize ? el.fontSize * scaleX : undefined }, true);
          })}
        </div>
        {/* Controls */}
        <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 12, alignItems: "center", background: "#151825ee", borderRadius: 12, padding: "8px 16px", backdropFilter: "blur(10px)" }}>
          <button onClick={() => setPresentSlideIndex(i => Math.max(0, i - 1))} style={presBtn}><Icons.ChevLeft /></button>
          <span style={{ color: "#94A3B8", fontSize: 14, minWidth: 60, textAlign: "center" }}>{presentSlideIndex + 1} / {slides.length}</span>
          <button onClick={() => setPresentSlideIndex(i => Math.min(slides.length - 1, i + 1))} style={presBtn}><Icons.ChevRight /></button>
          <div style={{ width: 1, height: 20, background: "#2a2e45" }} />
          <button onClick={() => setPresenting(false)} style={presBtn}><Icons.Close /></button>
        </div>
      </div>
    );
  }

  // ─── MAIN EDITOR UI ───
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#090B10", color: "#E2E8F0", fontFamily: "'DM Sans', sans-serif", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* ─── TOP BAR ─── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px", height: 52, background: "#0D0F14", borderBottom: "1px solid #151825", flexShrink: 0, gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 }}>
          <a href="/dashboard" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: isMobile ? 14 : 16, color: "#E2E8F0", textDecoration: "none", cursor: "pointer", whiteSpace: "nowrap" }}>← S</a>
          <input value={presentationTitle} onChange={(e) => setPresentationTitle(e.target.value)} style={{ padding: "5px 8px", background: "#0D0F14", border: "1px solid #1a1d2e", borderRadius: 6, color: "#E2E8F0", fontSize: 13, fontFamily: "'DM Sans'", outline: "none", width: isMobile ? 100 : 200, minWidth: 60 }} />
          <button onClick={handleSave} disabled={saving} style={{ padding: "6px 12px", background: saving ? "#2a2e45" : "linear-gradient(135deg, #6366F1, #7C3AED)", border: "none", borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 600, cursor: saving ? "wait" : "pointer", fontFamily: "'DM Sans'", whiteSpace: "nowrap" }}>{saving ? "..." : "Save"}</button>
          {!isMobile && lastSaved && <span style={{ fontSize: 11, color: "#4a5070" }}>Saved {lastSaved.toLocaleTimeString()}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
          {!isMobile && <ToolBtn icon={<Icons.Undo />} label="Undo" onClick={undo} />}
          {!isMobile && <ToolBtn icon={<Icons.Redo />} label="Redo" onClick={redo} />}
          {!isMobile && <div style={{ width: 1, height: 24, background: "#1e2235", margin: "0 6px" }} />}
          {!isMobile && <ToolBtn icon={<Icons.Grid />} label="Grid" active={showGrid} onClick={() => setShowGrid(!showGrid)} />}
          {!isMobile && <div style={{ width: 1, height: 24, background: "#1e2235", margin: "0 6px" }} />}
          <ToolBtn icon={<Icons.Share />} label={isMobile ? "" : "Share"} onClick={() => { if (!presentationId) { return; } const url = window.location.origin + "/join"; navigator.clipboard.writeText(url); const toast = document.createElement("div"); toast.textContent = "✓ Link copied"; toast.style.cssText = "position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#22C55E;color:#fff;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;font-family:'DM Sans',sans-serif;z-index:99999"; document.body.appendChild(toast); setTimeout(() => toast.remove(), 2500); }} />
          <ToolBtn icon={<Icons.Download />} label={isMobile ? "" : "Export"} onClick={async () => { const PptxGenJS = (await import("pptxgenjs")).default; const pptx = new PptxGenJS(); pptx.layout = "LAYOUT_WIDE"; slides.forEach((s, si) => { const sl = pptx.addSlide(); sl.background = { color: "0F1117" }; (s.elements || []).forEach((el) => { if (el.type === "text") { sl.addText(el.content || "", { x: el.x / 100, y: el.y / 100, w: el.w / 100, h: el.h / 100, fontSize: (el.fontSize || 16) * 0.6, color: (el.color || "#E2E8F0").replace("#", ""), fontFace: "Arial", bold: el.fontWeight === "700" || el.fontWeight === "600", align: el.textAlign || "left" }); } else if (el.type === "shape") { sl.addShape(pptx.ShapeType.rect, { x: el.x / 100, y: el.y / 100, w: el.w / 100, h: el.h / 100, fill: { color: (el.fill || "#6366F1").replace("#", "") } }); } else if (el.type === "interactive") { sl.addText((el.interactiveType === "poll" ? "📊 " : el.interactiveType === "quiz" ? "❓ " : "☁️ ") + (el.question || ""), { x: el.x / 100, y: el.y / 100, w: el.w / 100, h: 0.5, fontSize: 14, color: "6366F1", fontFace: "Arial", bold: true }); if (el.options) { el.options.forEach((opt, oi) => { sl.addText(String.fromCharCode(65 + oi) + ". " + opt, { x: el.x / 100, y: (el.y + 50 + oi * 35) / 100, w: el.w / 100, h: 0.35, fontSize: 12, color: "E2E8F0", fontFace: "Arial" }); }); } } }); }); pptx.writeFile({ fileName: (presentationTitle || "presentation") + ".pptx" }); }} />
          <button onClick={() => { if (presentationId) { window.location.href = "/presenter"; } else { setPresenting(true); setPresentSlideIndex(activeSlideIndex); } }} style={{ display: "flex", alignItems: "center", gap: 4, padding: isMobile ? "6px 10px" : "6px 16px", background: "linear-gradient(135deg, #6366F1, #7C3AED)", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            <Icons.Play /> {!isMobile && "Present"}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
        {/* ─── LEFT: SLIDE PANEL ─── */}
        {showLeftPanel && <div style={{ width: isMobile ? "75vw" : 210, maxWidth: 280, background: "#0D0F14", borderRight: "1px solid #151825", display: "flex", flexDirection: "column", flexShrink: 0, position: isMobile ? "absolute" : "relative", left: 0, top: 0, bottom: 0, zIndex: isMobile ? 50 : 1, height: isMobile ? "100%" : "auto" }}>
          <div style={{ padding: "10px 12px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#4a5070" }}>Slides</span>
            <button onClick={() => setShowTemplatePanel(!showTemplatePanel)} style={{ background: showTemplatePanel ? "#6366F122" : "#151825", border: "1px solid #1e2235", borderRadius: 6, color: showTemplatePanel ? "#6366F1" : "#94A3B8", padding: "3px 8px", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              <Icons.Plus /> Add
            </button>
          </div>

          {showTemplatePanel && (
            <div style={{ padding: "4px 10px 10px", borderBottom: "1px solid #151825" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                {Object.entries(SLIDE_TEMPLATES).map(([key, tpl]) => (
                  <button key={key} onClick={() => addSlide(key)} style={{ padding: "6px 4px", background: "#151825", border: "1px solid #1e2235", borderRadius: 6, color: "#94A3B8", fontSize: 10, cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.target.style.borderColor = "#6366F1"; e.target.style.color = "#E2E8F0"; }}
                    onMouseLeave={e => { e.target.style.borderColor = "#1e2235"; e.target.style.color = "#94A3B8"; }}>
                    {tpl.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ flex: 1, overflow: "auto", padding: "6px 10px" }}>
            {slides.map((slide, idx) => (
              <div key={slide.id} onClick={() => { setActiveSlideIndex(idx); setSelectedElementId(null); }}
                style={{ position: "relative", marginBottom: 8, borderRadius: 8, border: idx === activeSlideIndex ? "2px solid #6366F1" : "2px solid transparent", cursor: "pointer", overflow: "hidden", transition: "border-color 0.15s" }}>
                {/* Thumbnail */}
                <div style={{ position: "relative", paddingTop: "56.25%", background: slide.bg, borderRadius: 6, overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, transform: "scale(0.22)", transformOrigin: "top left", width: 800, height: 450, pointerEvents: "none" }}>
                    {slide.elements.map(el => renderElement(el, true))}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 6px" }}>
                  <span style={{ fontSize: 10, color: "#64748B" }}>{idx + 1}</span>
                  <div style={{ display: "flex", gap: 2 }}>
                    <MiniBtn onClick={(e) => { e.stopPropagation(); moveSlide(idx, -1); }}><Icons.ArrowUp /></MiniBtn>
                    <MiniBtn onClick={(e) => { e.stopPropagation(); moveSlide(idx, 1); }}><Icons.ArrowDown /></MiniBtn>
                    <MiniBtn onClick={(e) => { e.stopPropagation(); duplicateSlide(idx); }}><Icons.Copy /></MiniBtn>
                    <MiniBtn onClick={(e) => { e.stopPropagation(); deleteSlide(idx); }}><Icons.Trash /></MiniBtn>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>}
        {isMobile && showLeftPanel && <div onClick={() => setShowLeftPanel(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }} />}

        {/* ─── CENTER: CANVAS ─── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#090B10", overflow: "hidden", position: "relative" }}>
          {/* Toolbar */}
          <div style={{ display: "flex", alignItems: "center", padding: "8px 12px", gap: 2, borderBottom: "1px solid #12141d", flexShrink: 0, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <ToolBtn icon={<Icons.Text />} label="Text" onClick={() => addElement("text")} />
            <ToolBtn icon={<Icons.Square />} label="Rectangle" onClick={() => addElement("shape", { shapeType: "rect" })} />
            <ToolBtn icon={<Icons.Circle />} label="Circle" onClick={() => addElement("shape", { shapeType: "circle", w: 120, h: 120 })} />
            <ToolBtn icon={<Icons.Image />} label="Image" onClick={() => addElement("image")} />
            <div style={{ width: 1, height: 24, background: "#1e2235", margin: "0 6px" }} />
            <ToolBtn icon={<Icons.Poll />} label="Poll" onClick={() => addElement("interactive", { interactiveType: "poll", question: "Your question?", options: ["Option A", "Option B", "Option C"], votes: [0, 0, 0] })} />
            <ToolBtn icon={<Icons.Quiz />} label="Quiz" onClick={() => addElement("interactive", { interactiveType: "quiz", question: "Your question?", options: ["Answer A", "Answer B", "Answer C", "Answer D"], correctIndex: 0, revealed: false })} />
            <ToolBtn icon={<Icons.Cloud />} label="Word Cloud" onClick={() => addElement("interactive", { interactiveType: "wordCloud", words: ["Word 1", "Word 2", "Word 3", "Word 4", "Word 5"] })} />
            <div style={{ flex: 1 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} style={{ ...zoomBtn }}>−</button>
              <span style={{ fontSize: 12, color: "#64748B", minWidth: 40, textAlign: "center" }}>{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} style={{ ...zoomBtn }}>+</button>
              <button onClick={() => setZoom(1)} style={{ ...zoomBtn, width: "auto", padding: "2px 8px", fontSize: 10 }}>Fit</button>
            </div>
          </div>

          {/* Canvas Area */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflow: "auto", padding: 32 }}>
            <div
              ref={canvasRef}
              onMouseDown={handleCanvasMouseDown}
              data-canvas="true"
              style={{
                position: "relative",
                width: 800 * zoom,
                height: 450 * zoom,
                background: activeSlide?.bg || "#0D0F14",
                borderRadius: 10,
                boxShadow: "0 0 0 1px #1e223540, 0 20px 60px #00000060",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "top left", width: 800, height: 450 }}>
                {showGrid && (
                  <svg style={{ position: "absolute", inset: 0, width: 800, height: 450, pointerEvents: "none", opacity: 0.15 }}>
                    {Array.from({ length: 16 }, (_, i) => <line key={`v${i}`} x1={i * 50} y1={0} x2={i * 50} y2={450} stroke="#6366F1" strokeWidth="0.5" />)}
                    {Array.from({ length: 9 }, (_, i) => <line key={`h${i}`} x1={0} y1={i * 50} x2={800} y2={i * 50} stroke="#6366F1" strokeWidth="0.5" />)}
                  </svg>
                )}
                {activeSlide?.elements.map(el => renderElement(el, false))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT: PROPERTIES PANEL ─── */}
        {showRightPanel && <div style={{ width: isMobile ? "75vw" : 260, maxWidth: 300, background: "#0D0F14", borderLeft: "1px solid #151825", display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden", position: isMobile ? "absolute" : "relative", right: 0, top: 0, bottom: 0, zIndex: isMobile ? 50 : 1, height: isMobile ? "100%" : "auto" }}>
          <div style={{ display: "flex", borderBottom: "1px solid #151825" }}>
            {["properties", "slide"].map(tab => (
              <button key={tab} onClick={() => setRightPanel(tab)}
                style={{ flex: 1, padding: "10px 8px", background: "transparent", border: "none", borderBottom: rightPanel === tab ? "2px solid #6366F1" : "2px solid transparent", color: rightPanel === tab ? "#E2E8F0" : "#4a5070", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                {tab === "properties" ? "Element" : "Slide"}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflow: "auto", padding: "12px" }}>
            {rightPanel === "slide" ? (
              <SlideProperties slide={activeSlide} onBgChange={updateSlideBg} />
            ) : selectedElement ? (
              <ElementProperties el={selectedElement} onUpdate={(u) => updateElement(selectedElement.id, u)} onDelete={() => deleteElement(selectedElement.id)} />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 200, color: "#4a5070", fontSize: 13, textAlign: "center", gap: 8 }}>
                <Icons.Layers />
                <span>Select an element to<br />edit its properties</span>
              </div>
            )}
          </div>
        </div>}
        {isMobile && showRightPanel && <div onClick={() => setShowRightPanel(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }} />}
      </div>

      {/* ─── BOTTOM STATUS BAR ─── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", height: 36, background: "#0D0F14", borderTop: "1px solid #151825", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isMobile && <button onClick={() => { setShowLeftPanel(!showLeftPanel); setShowRightPanel(false); }} style={{ background: showLeftPanel ? "#6366F120" : "transparent", border: "1px solid #1e2235", borderRadius: 6, padding: "4px 8px", color: showLeftPanel ? "#6366F1" : "#64748B", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'" }}>Slides</button>}
          <span style={{ fontSize: 10, color: "#4a5070" }}>Slide {activeSlideIndex + 1} of {slides.length}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, color: "#4a5070" }}>{activeSlide?.elements.length} elements</span>
          {isMobile && <button onClick={() => { setShowRightPanel(!showRightPanel); setShowLeftPanel(false); }} style={{ background: showRightPanel ? "#6366F120" : "transparent", border: "1px solid #1e2235", borderRadius: 6, padding: "4px 8px", color: showRightPanel ? "#6366F1" : "#64748B", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'" }}>Properties</button>}
        </div>
      </div>
    </div>
  );
}

// ─── INTERACTIVE ELEMENT COMPONENT ───
function InteractiveElement({ el, isPresentation, onUpdate }) {
  if (el.interactiveType === "poll") {
    const totalVotes = el.votes.reduce((a, b) => a + b, 0);
    const maxVote = Math.max(...el.votes, 1);
    return (
      <div style={{ width: "100%", height: "100%", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#E2E8F0", fontFamily: "'Outfit', sans-serif" }}>{el.question}</div>
        {el.options.map((opt, i) => {
          const pct = totalVotes > 0 ? Math.round(el.votes[i] / totalVotes * 100) : 0;
          return (
            <div key={i} onClick={() => {
              if (isPresentation) {
                const nv = [...el.votes];
                nv[i] += Math.floor(Math.random() * 5) + 1;
                onUpdate({ votes: nv });
              }
            }} style={{ position: "relative", background: "#151825", borderRadius: 8, padding: "10px 14px", cursor: isPresentation ? "pointer" : "default", overflow: "hidden", border: "1px solid #1e2235", transition: "all 0.2s" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`, background: `${ACCENT_COLORS[i % ACCENT_COLORS.length]}20`, transition: "width 0.5s ease", borderRadius: 8 }} />
              <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, color: "#E2E8F0" }}>{opt}</span>
                <span style={{ fontSize: 13, color: ACCENT_COLORS[i % ACCENT_COLORS.length], fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{pct}%</span>
              </div>
            </div>
          );
        })}
        <div style={{ fontSize: 11, color: "#4a5070", textAlign: "center" }}>{totalVotes} votes{isPresentation ? " • Click to vote" : ""}</div>
      </div>
    );
  }

  if (el.interactiveType === "quiz") {
    return (
      <div style={{ width: "100%", height: "100%", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#E2E8F0", fontFamily: "'Outfit', sans-serif" }}>{el.question}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, flex: 1 }}>
          {el.options.map((opt, i) => {
            const isCorrect = i === el.correctIndex;
            const colors = ["#6366F1", "#EC4899", "#F97316", "#22C55E"];
            const revealed = el.revealed;
            return (
              <div key={i} onClick={() => {
                if (isPresentation && !revealed) onUpdate({ revealed: true });
              }} style={{
                background: revealed ? (isCorrect ? "#22C55E18" : "#F43F5E10") : `${colors[i]}15`,
                border: revealed ? (isCorrect ? "2px solid #22C55E" : "1px solid #2a2e45") : `1px solid ${colors[i]}40`,
                borderRadius: 10, padding: "12px 14px", cursor: isPresentation ? "pointer" : "default",
                display: "flex", alignItems: "center", gap: 10, transition: "all 0.3s"
              }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: revealed && isCorrect ? "#22C55E" : colors[i], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span style={{ fontSize: 14, color: revealed ? (isCorrect ? "#22C55E" : "#64748B") : "#E2E8F0" }}>{opt}</span>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: "#4a5070", textAlign: "center" }}>{el.revealed ? "✓ Answer revealed" : isPresentation ? "Click any option to reveal answer" : "Quiz element"}</div>
      </div>
    );
  }

  if (el.interactiveType === "wordCloud") {
    const maxLen = Math.max(...el.words.map(w => w.length), 1);
    return (
      <div style={{ width: "100%", height: "100%", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 10, padding: 20 }}>
        {el.words.map((word, i) => {
          const size = Math.max(14, Math.min(36, 36 - (word.length / maxLen) * 16 + Math.random() * 10));
          const color = ACCENT_COLORS[i % ACCENT_COLORS.length];
          return (
            <span key={i} style={{ fontSize: size, fontWeight: Math.random() > 0.5 ? 700 : 500, color, fontFamily: "'Outfit', sans-serif", opacity: 0.7 + Math.random() * 0.3, transform: `rotate(${(Math.random() - 0.5) * 12}deg)`, transition: "all 0.3s" }}>
              {word}
            </span>
          );
        })}
      </div>
    );
  }

  return null;
}

// ─── SLIDE PROPERTIES ───
function SlideProperties({ slide, onBgChange }) {
  if (!slide) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PropSection title="Background">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
          {BG_PRESETS.map(bg => (
            <div key={bg} onClick={() => onBgChange(bg)} style={{ width: "100%", paddingTop: "100%", borderRadius: 6, background: bg, cursor: "pointer", border: slide.bg === bg ? "2px solid #6366F1" : "2px solid #1e2235", boxSizing: "border-box" }} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          <label style={{ fontSize: 11, color: "#64748B", flex: 1 }}>Custom:
            <input type="color" value={slide.bg?.startsWith("#") ? slide.bg : "#0D0F14"} onChange={e => onBgChange(e.target.value)} style={{ width: "100%", height: 28, border: "none", borderRadius: 4, cursor: "pointer", marginTop: 4 }} />
          </label>
        </div>
      </PropSection>
      <PropSection title="Info">
        <div style={{ fontSize: 12, color: "#64748B" }}>{slide.elements.length} elements on this slide</div>
      </PropSection>
    </div>
  );
}

// ─── ELEMENT PROPERTIES ───
function ElementProperties({ el, onUpdate, onDelete }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#6366F1", textTransform: "uppercase", letterSpacing: "0.06em" }}>{el.type}{el.interactiveType ? ` / ${el.interactiveType}` : ""}</span>
        <button onClick={onDelete} style={{ background: "#F43F5E15", border: "1px solid #F43F5E30", borderRadius: 6, color: "#F43F5E", padding: "3px 8px", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
          <Icons.Trash /> Delete
        </button>
      </div>

      <PropSection title="Position & Size">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          <PropInput label="X" value={el.x} onChange={v => onUpdate({ x: parseInt(v) || 0 })} />
          <PropInput label="Y" value={el.y} onChange={v => onUpdate({ y: parseInt(v) || 0 })} />
          <PropInput label="W" value={el.w} onChange={v => onUpdate({ w: parseInt(v) || 40 })} />
          <PropInput label="H" value={el.h} onChange={v => onUpdate({ h: parseInt(v) || 20 })} />
        </div>
      </PropSection>

      {el.type === "text" && (
        <>
          <PropSection title="Typography">
            <PropInput label="Content" value={el.content} onChange={v => onUpdate({ content: v })} textarea />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 6 }}>
              <PropInput label="Size" value={el.fontSize} onChange={v => onUpdate({ fontSize: parseInt(v) || 16 })} />
              <div>
                <span style={{ fontSize: 10, color: "#4a5070" }}>Weight</span>
                <select value={el.fontWeight} onChange={e => onUpdate({ fontWeight: e.target.value })} style={selectStyle}>
                  <option value="300">Light</option>
                  <option value="400">Regular</option>
                  <option value="500">Medium</option>
                  <option value="600">SemiBold</option>
                  <option value="700">Bold</option>
                  <option value="800">ExtraBold</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: 6 }}>
              <span style={{ fontSize: 10, color: "#4a5070" }}>Font</span>
              <select value={el.fontFamily} onChange={e => onUpdate({ fontFamily: e.target.value })} style={selectStyle}>
                <option value="'Outfit', sans-serif">Outfit</option>
                <option value="'DM Sans', sans-serif">DM Sans</option>
                <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
              {["left", "center", "right"].map(a => (
                <button key={a} onClick={() => onUpdate({ textAlign: a })} style={{ flex: 1, padding: "5px", background: el.textAlign === a ? "#6366F120" : "#151825", border: `1px solid ${el.textAlign === a ? "#6366F1" : "#1e2235"}`, borderRadius: 4, color: el.textAlign === a ? "#6366F1" : "#64748B", fontSize: 11, cursor: "pointer", textTransform: "capitalize" }}>{a}</button>
              ))}
            </div>
          </PropSection>
          <PropSection title="Color">
            <ColorPicker value={el.color} onChange={v => onUpdate({ color: v })} />
          </PropSection>
        </>
      )}

      {el.type === "shape" && (
        <>
          <PropSection title="Shape">
            <div style={{ display: "flex", gap: 4 }}>
              {["rect", "roundRect", "circle"].map(s => (
                <button key={s} onClick={() => onUpdate({ shapeType: s })} style={{ flex: 1, padding: "5px", background: el.shapeType === s ? "#6366F120" : "#151825", border: `1px solid ${el.shapeType === s ? "#6366F1" : "#1e2235"}`, borderRadius: 4, color: el.shapeType === s ? "#6366F1" : "#64748B", fontSize: 10, cursor: "pointer" }}>
                  {s === "roundRect" ? "Rounded" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </PropSection>
          <PropSection title="Fill">
            <ColorPicker value={el.fill} onChange={v => onUpdate({ fill: v })} />
          </PropSection>
          <PropSection title="Opacity">
            <input type="range" min="0" max="1" step="0.05" value={el.opacity ?? 1} onChange={e => onUpdate({ opacity: parseFloat(e.target.value) })} style={{ width: "100%" }} />
            <span style={{ fontSize: 11, color: "#64748B" }}>{Math.round((el.opacity ?? 1) * 100)}%</span>
          </PropSection>
        </>
      )}

      {el.type === "image" && (
        <PropSection title="Image">
          <input value={el.src || ""} onChange={e => onUpdate({ src: e.target.value, placeholder: !e.target.value })} placeholder="Paste image URL..." style={inputStyle} />
          <button onClick={() => { const inp = document.createElement("input"); inp.type = "file"; inp.accept = "image/*"; inp.onchange = (e) => { const file = e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = (ev) => { onUpdate({ src: ev.target.result, placeholder: false }); }; reader.readAsDataURL(file); }; inp.click(); }} style={{ marginTop: 6, width: "100%", padding: "8px 12px", background: "#6366F115", border: "1px solid #6366F130", borderRadius: 8, color: "#6366F1", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Upload from Computer</button>
        </PropSection>
      )}

      {el.type === "interactive" && el.interactiveType === "poll" && (
        <>
          <PropSection title="Question">
            <input value={el.question} onChange={e => onUpdate({ question: e.target.value })} style={inputStyle} />
          </PropSection>
          <PropSection title="Options">
            {el.options.map((opt, i) => (
              <div key={i} style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                <input value={opt} onChange={e => { const no = [...el.options]; no[i] = e.target.value; onUpdate({ options: no }); }} style={{ ...inputStyle, flex: 1 }} />
                {el.options.length > 2 && (
                  <button onClick={() => { const no = el.options.filter((_, j) => j !== i); const nv = el.votes.filter((_, j) => j !== i); onUpdate({ options: no, votes: nv }); }} style={{ background: "transparent", border: "none", color: "#F43F5E", cursor: "pointer", padding: "0 4px" }}>×</button>
                )}
              </div>
            ))}
            {el.options.length < 6 && (
              <button onClick={() => onUpdate({ options: [...el.options, `Option ${el.options.length + 1}`], votes: [...el.votes, 0] })} style={{ width: "100%", padding: "5px", background: "#151825", border: "1px dashed #1e2235", borderRadius: 4, color: "#4a5070", fontSize: 11, cursor: "pointer" }}>+ Add Option</button>
            )}
          </PropSection>
          <PropSection title="Reset Votes">
            <button onClick={() => onUpdate({ votes: el.votes.map(() => 0) })} style={{ width: "100%", padding: "6px", background: "#151825", border: "1px solid #1e2235", borderRadius: 6, color: "#94A3B8", fontSize: 11, cursor: "pointer" }}>Reset All Votes</button>
          </PropSection>
        </>
      )}

      {el.type === "interactive" && el.interactiveType === "quiz" && (
        <>
          <PropSection title="Question">
            <input value={el.question} onChange={e => onUpdate({ question: e.target.value })} style={inputStyle} />
          </PropSection>
          <PropSection title="Answers">
            {el.options.map((opt, i) => (
              <div key={i} style={{ display: "flex", gap: 4, marginBottom: 4, alignItems: "center" }}>
                <input type="radio" name="correct" checked={el.correctIndex === i} onChange={() => onUpdate({ correctIndex: i })} style={{ accentColor: "#22C55E" }} />
                <input value={opt} onChange={e => { const no = [...el.options]; no[i] = e.target.value; onUpdate({ options: no }); }} style={{ ...inputStyle, flex: 1 }} />
              </div>
            ))}
          </PropSection>
          <PropSection title="State">
            <button onClick={() => onUpdate({ revealed: !el.revealed })} style={{ width: "100%", padding: "6px", background: el.revealed ? "#22C55E15" : "#151825", border: `1px solid ${el.revealed ? "#22C55E40" : "#1e2235"}`, borderRadius: 6, color: el.revealed ? "#22C55E" : "#94A3B8", fontSize: 11, cursor: "pointer" }}>
              {el.revealed ? "Hide Answer" : "Reveal Answer"}
            </button>
          </PropSection>
        </>
      )}

      {el.type === "interactive" && el.interactiveType === "wordCloud" && (
        <PropSection title="Words">
          <PropInput label="Words (comma separated)" value={el.words.join(", ")} onChange={v => onUpdate({ words: v.split(",").map(w => w.trim()).filter(Boolean) })} textarea />
        </PropSection>
      )}
    </div>
  );
}

// ─── REUSABLE COMPONENTS ───
function PropSection({ title, children }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#4a5070", marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

function PropInput({ label, value, onChange, textarea }) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <div>
      <span style={{ fontSize: 10, color: "#4a5070" }}>{label}</span>
      <Tag value={value} onChange={e => onChange(e.target.value)} style={{ ...inputStyle, ...(textarea ? { minHeight: 60, resize: "vertical" } : {}) }} />
    </div>
  );
}

function ColorPicker({ value, onChange }) {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4, marginBottom: 6 }}>
        {ACCENT_COLORS.map(c => (
          <div key={c} onClick={() => onChange(c)} style={{ width: "100%", paddingTop: "100%", borderRadius: 4, background: c, cursor: "pointer", border: value === c ? "2px solid #fff" : "2px solid transparent", boxSizing: "border-box" }} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <input type="color" value={value} onChange={e => onChange(e.target.value)} style={{ width: 28, height: 28, border: "none", borderRadius: 4, cursor: "pointer" }} />
        <input value={value} onChange={e => onChange(e.target.value)} style={{ ...inputStyle, flex: 1, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }} />
      </div>
    </div>
  );
}

function ToolBtn({ icon, label, onClick, active }) {
  return (
    <button onClick={onClick} title={label}
      style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, background: active ? "#6366F118" : "transparent", border: "none", borderRadius: 6, color: active ? "#6366F1" : "#64748B", cursor: "pointer", transition: "all 0.15s" }}
      onMouseEnter={e => { if (!active) e.target.style.background = "#151825"; e.target.style.color = "#E2E8F0"; }}
      onMouseLeave={e => { if (!active) e.target.style.background = "transparent"; e.target.style.color = active ? "#6366F1" : "#64748B"; }}>
      {icon}
    </button>
  );
}

function MiniBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{ background: "transparent", border: "none", color: "#4a5070", cursor: "pointer", padding: 2, display: "flex", borderRadius: 3 }}
      onMouseEnter={e => e.target.style.color = "#E2E8F0"}
      onMouseLeave={e => e.target.style.color = "#4a5070"}>
      {children}
    </button>
  );
}

// ─── SHARED STYLES ───
const inputStyle = { width: "100%", padding: "6px 8px", background: "#151825", border: "1px solid #1e2235", borderRadius: 6, color: "#E2E8F0", fontSize: 12, outline: "none", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" };
const selectStyle = { ...inputStyle, cursor: "pointer" };
const presBtn = { background: "transparent", border: "none", color: "#94A3B8", cursor: "pointer", padding: 6, borderRadius: 6, display: "flex", alignItems: "center" };
const zoomBtn = { width: 26, height: 26, background: "#151825", border: "1px solid #1e2235", borderRadius: 4, color: "#94A3B8", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" };
