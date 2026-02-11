"use client";
import { useState, useEffect, useRef, createContext, useContext, useCallback } from "react";

// ═══════════════════════════════════════
// ─── SHARED CONTEXT ───
// ═══════════════════════════════════════
const AppContext = createContext(null);

function useApp() { return useContext(AppContext); }

// ─── ICONS ───
const IC = {
  Home:()=><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Slides:()=><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  Users:()=><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  Plus:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>,
  Play:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>,
  Edit:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14"/></svg>,
  Share:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  Copy:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
  Settings:()=><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  Logout:()=><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
  Star:()=><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  Search:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  Grid:()=><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  List:()=><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Clock:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  Zap:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  Shield:()=><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  ArrowR:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  ArrowL:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
  Eye:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Mail:()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>,
  Lock:()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  User:()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  EyeOff:()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  Check:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>,
  Monitor:()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  Folder:()=><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
  Chart:()=><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
  Activity:()=><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  X:()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ChevL:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>,
  ChevR:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>,
  Text:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>,
  Square:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>,
  Circle:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/></svg>,
  Image:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>,
  Poll:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
};

// ─── MOCK DATA ───
const MOCK_PRES = [
  { id:1, title:"Q4 Strategy Review", slides:12, updated:"2 hours ago", color:"#6366F1", shared:true, starred:true },
  { id:2, title:"Team Onboarding 2026", slides:8, updated:"Yesterday", color:"#EC4899", shared:false, starred:false },
  { id:3, title:"Product Roadmap", slides:15, updated:"3 days ago", color:"#06B6D4", shared:true, starred:true },
  { id:4, title:"Budget Proposal", slides:6, updated:"1 week ago", color:"#F97316", shared:false, starred:false },
  { id:5, title:"Workshop: AI Tools", slides:20, updated:"1 week ago", color:"#22C55E", shared:true, starred:false },
  { id:6, title:"Client Pitch Deck", slides:10, updated:"2 weeks ago", color:"#8B5CF6", shared:false, starred:true },
];

// ═══════════════════════════════════════
// ─── MAIN APP ───
// ═══════════════════════════════════════
export default function SlidePulseApp() {
  // Route: landing, login, signup, dashboard, editor, present, audience-join, audience-live, presenter-live, admin, settings
  const [route, setRoute] = useState("landing");
  const [user, setUser] = useState(null);
  const [prevRoute, setPrevRoute] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [editingPresId, setEditingPresId] = useState(null);

  const navigate = useCallback((to) => {
    setTransitioning(true);
    setPrevRoute(route);
    setTimeout(() => { setRoute(to); setTransitioning(false); }, 200);
  }, [route]);

  const login = (userData) => { setUser(userData); navigate("dashboard"); };
  const logout = () => { setUser(null); navigate("landing"); };
  const openEditor = (id) => { setEditingPresId(id); navigate("editor"); };

  const ctx = { route, navigate, user, login, logout, openEditor, editingPresId };

  return (
    <AppContext.Provider value={ctx}>
      <div style={{ minHeight:"100vh", background:"#060810", color:"#E2E8F0", fontFamily:"'DM Sans',sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
          ::selection{background:#6366F140;color:#fff}
          @keyframes fadeIn{from{opacity:0}to{opacity:1}}
          @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
          @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
          @keyframes popIn{0%{opacity:0;transform:scale(.9)}100%{opacity:1;transform:scale(1)}}
          @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
          @keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
          @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
          @keyframes spin{to{transform:rotate(360deg)}}
          @keyframes barGrow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
          .page-enter{animation:fadeIn .3s ease}
          ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#1e2235;border-radius:3px}
        `}</style>

        <div className="page-enter" key={route} style={{ opacity:transitioning?0:1, transition:"opacity .15s ease" }}>
          {route==="landing"&&<LandingPage />}
          {route==="login"&&<AuthPage mode="login" />}
          {route==="signup"&&<AuthPage mode="signup" />}
          {route==="dashboard"&&<DashboardPage />}
          {route==="editor"&&<EditorPage />}
          {route==="present"&&<PresentMode />}
          {route==="audience-join"&&<AudienceJoin />}
          {route==="audience-live"&&<AudienceLive />}
          {route==="presenter-live"&&<PresenterLive />}
          {route==="admin"&&<AdminPage />}
          {route==="settings"&&<SettingsPage />}
        </div>
      </div>
    </AppContext.Provider>
  );
}

// ═══════════════════════════════════════
// ─── LANDING PAGE (Compact) ───
// ═══════════════════════════════════════
function LandingPage() {
  const { navigate } = useApp();
  return (
    <div style={{ minHeight:"100vh" }}>
      {/* Nav */}
      <nav style={{ position:"sticky",top:0,zIndex:100,background:"#060810dd",backdropFilter:"blur(16px)",borderBottom:"1px solid #ffffff06" }}>
        <div style={{ maxWidth:1100,margin:"0 auto",padding:"0 24px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <Logo />
          <div style={{ display:"flex",alignItems:"center",gap:20 }}>
            {["Features","Pricing","About"].map(l=><span key={l} style={{ fontSize:14,color:"#64748B",cursor:"pointer" }} onMouseEnter={e=>e.target.style.color="#E2E8F0"} onMouseLeave={e=>e.target.style.color="#64748B"}>{l}</span>)}
            <button onClick={()=>navigate("login")} style={btnGhost}>Log in</button>
            <button onClick={()=>navigate("signup")} style={btnPrimary}>Get Started Free</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position:"relative",padding:"100px 24px 80px",textAlign:"center",overflow:"hidden" }}>
        <BgEffects />
        <div style={{ position:"relative",maxWidth:800,margin:"0 auto",animation:"slideUp .7s ease" }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",background:"#6366F110",border:"1px solid #6366F125",borderRadius:50,marginBottom:24,fontSize:13,color:"#818CF8",fontWeight:500 }}>
            <span style={{ width:6,height:6,borderRadius:"50%",background:"#6366F1",animation:"pulse 2s infinite" }} /> Developed by Syrian people
          </div>
          <h1 style={{ fontFamily:"'Outfit'",fontSize:"clamp(38px,5.5vw,68px)",fontWeight:800,lineHeight:1.08,letterSpacing:"-0.03em",margin:"0 0 20px" }}>
            Presentations that <span style={{ background:"linear-gradient(135deg,#6366F1,#A78BFA,#EC4899)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundSize:"200%",animation:"gradShift 4s ease infinite" }}>engage</span> your audience
          </h1>
          <p style={{ fontSize:18,color:"#64748B",lineHeight:1.6,maxWidth:560,margin:"0 auto 36px" }}>Build interactive presentations with live polls, quizzes, and word clouds. Engage your audience in real-time — at a fraction of the cost.</p>
          <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
            <button onClick={()=>navigate("signup")} style={{ ...btnPrimary,padding:"14px 32px",fontSize:16 }}>Start Free <IC.ArrowR /></button>
            <button onClick={()=>navigate("audience-join")} style={{ ...btnGhost,padding:"14px 24px",fontSize:16,gap:8,display:"flex",alignItems:"center" }}><IC.Play /> Try Audience Demo</button>
          </div>

          {/* Module Links */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,maxWidth:700,margin:"60px auto 0" }}>
            {[
              ["Editor","editor","#6366F1",<IC.Slides />],
              ["Dashboard","login","#8B5CF6",<IC.Grid />],
              ["Join Session","audience-join","#06B6D4",<IC.Users />],
              ["Presenter","presenter-live","#22C55E",<IC.Monitor />],
              ["Admin","admin","#F97316",<IC.Shield />],
            ].map(([label,to,color,icon],i)=>(
              <button key={label} onClick={()=>navigate(to)}
                style={{ padding:"20px 12px",background:"#0A0C12",border:"1px solid #111420",borderRadius:14,cursor:"pointer",textAlign:"center",transition:"all .25s",animation:`fadeUp .5s ease ${i*.07}s both` }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=`${color}40`;e.currentTarget.style.transform="translateY(-3px)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="#111420";e.currentTarget.style.transform="none";}}>
                <div style={{ width:40,height:40,borderRadius:12,background:`${color}12`,display:"flex",alignItems:"center",justifyContent:"center",color,margin:"0 auto 10px" }}>{icon}</div>
                <div style={{ fontSize:13,fontWeight:600,color:"#E2E8F0" }}>{label}</div>
              </button>
            ))}
          </div>

          {/* Trust */}
          <div style={{ marginTop:50 }}>
            <p style={{ fontSize:11,color:"#4a5070",textTransform:"uppercase",letterSpacing:".12em",fontWeight:600,marginBottom:14 }}>Trusted by organizations across the region</p>
            <div style={{ display:"flex",justifyContent:"center",gap:36,opacity:.3,flexWrap:"wrap" }}>
              {["UNDP","UNESCO","GIZ","USAID","World Bank"].map(n=><span key={n} style={{ fontFamily:"'Outfit'",fontSize:14,fontWeight:700,letterSpacing:".04em",color:"#E2E8F0" }}>{n}</span>)}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════
// ─── AUTH PAGE ───
// ═══════════════════════════════════════
function AuthPage({ mode }) {
  const { navigate, login } = useApp();
  const [email,setEmail]=useState(""); const [pw,setPw]=useState(""); const [name,setName]=useState(""); const [showPw,setShowPw]=useState(false);
  const [loading,setLoading]=useState(false); const [errors,setErrors]=useState({});
  const isLogin = mode==="login";

  const validate = () => {
    const e={};
    if(!isLogin&&!name.trim()) e.name="Required";
    if(!email) e.email="Required"; else if(!/\S+@\S+\.\S+/.test(email)) e.email="Invalid email";
    if(!pw) e.pw="Required"; else if(pw.length<6) e.pw="Min 6 characters";
    setErrors(e); return !Object.keys(e).length;
  };

  const handleSubmit = () => {
    if(!validate()) return;
    setLoading(true);
    setTimeout(()=>{ setLoading(false); login({ name:name||email.split("@")[0], email }); },1200);
  };

  return (
    <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24,position:"relative" }}>
      <BgEffects />
      <div style={{ width:"100%",maxWidth:400,position:"relative",zIndex:1,animation:"fadeUp .5s ease" }}>
        <div style={{ textAlign:"center",marginBottom:32 }}>
          <div style={{ display:"flex",justifyContent:"center",marginBottom:20 }}><Logo /></div>
          <h1 style={{ fontFamily:"'Outfit'",fontSize:28,fontWeight:700,margin:"0 0 6px" }}>{isLogin?"Welcome back":"Create your account"}</h1>
          <p style={{ color:"#4a5070",fontSize:14 }}>{isLogin?"Sign in to continue":"Start building interactive presentations"}</p>
        </div>
        <div style={{ background:"#0A0C12",border:"1px solid #111420",borderRadius:16,padding:"28px 24px" }}>
          <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
            {!isLogin&&<AuthInput icon={<IC.User />} type="text" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} error={errors.name} />}
            <AuthInput icon={<IC.Mail />} type="email" placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)} error={errors.email} />
            <AuthInput icon={<IC.Lock />} type={showPw?"text":"password"} placeholder="Password" value={pw} onChange={e=>setPw(e.target.value)} error={errors.pw} suffix={<button onClick={()=>setShowPw(!showPw)} style={{ background:"none",border:"none",color:"#4a5070",cursor:"pointer",display:"flex",padding:0 }}>{showPw?<IC.EyeOff />:<IC.Eye />}</button>} />
            <button onClick={handleSubmit} disabled={loading} style={{ ...btnPrimary,width:"100%",padding:"13px",justifyContent:"center" }}>
              {loading?<div style={{ width:18,height:18,border:"2px solid #fff4",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .6s linear infinite" }} />:<>{isLogin?"Sign in":"Create account"} <IC.ArrowR /></>}
            </button>
          </div>
        </div>
        <p style={{ textAlign:"center",marginTop:20,fontSize:14,color:"#4a5070" }}>
          {isLogin?"Don't have an account?":"Already have an account?"}{" "}
          <button onClick={()=>navigate(isLogin?"signup":"login")} style={{ background:"none",border:"none",color:"#6366F1",fontSize:14,cursor:"pointer",fontWeight:600,fontFamily:"'DM Sans'" }}>{isLogin?"Create one":"Sign in"}</button>
        </p>
        <button onClick={()=>navigate("landing")} style={{ display:"block",margin:"12px auto 0",background:"none",border:"none",color:"#4a5070",fontSize:13,cursor:"pointer",fontFamily:"'DM Sans'" }}>← Back to home</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// ─── DASHBOARD ───
// ═══════════════════════════════════════
function DashboardPage() {
  const { navigate, user, logout, openEditor } = useApp();
  const [search,setSearch]=useState(""); const [view,setView]=useState("grid"); const [section,setSection]=useState("all");

  const filtered = MOCK_PRES.filter(p=>{
    if(search&&!p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if(section==="starred") return p.starred;
    if(section==="shared") return p.shared;
    return true;
  });

  const initials = user?.name?.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2)||"U";

  return (
    <div style={{ display:"flex",height:"100vh",overflow:"hidden" }}>
      {/* Sidebar */}
      <div style={{ width:220,background:"#0A0C12",borderRight:"1px solid #0F1118",display:"flex",flexDirection:"column",flexShrink:0 }}>
        <div style={{ padding:"18px 16px 24px" }}><Logo size={26} /></div>
        <nav style={{ flex:1,padding:"0 10px",display:"flex",flexDirection:"column",gap:2 }}>
          {[["all","All Presentations",<IC.Home />],["starred","Starred",<IC.Star />],["shared","Shared",<IC.Users />]].map(([k,l,ic])=>(
            <SideBtn key={k} active={section===k} onClick={()=>setSection(k)} icon={ic} label={l} />
          ))}
          <div style={{ height:1,background:"#111420",margin:"10px 0" }} />
          <SideBtn onClick={()=>navigate("admin")} icon={<IC.Shield />} label="Admin Panel" />
          <SideBtn onClick={()=>navigate("audience-join")} icon={<IC.Users />} label="Join Session" />
          <SideBtn onClick={()=>navigate("presenter-live")} icon={<IC.Monitor />} label="Presenter View" />
          <SideBtn onClick={()=>navigate("settings")} icon={<IC.Settings />} label="Settings" />
        </nav>
        <div style={{ padding:14,borderTop:"1px solid #0F1118" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10,padding:"6px" }}>
            <div style={{ width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#6366F1,#8B5CF6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#fff",flexShrink:0 }}>{initials}</div>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{user?.name}</div>
              <div style={{ fontSize:11,color:"#4a5070" }}>{user?.email}</div>
            </div>
          </div>
          <button onClick={logout} style={{ display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 12px",background:"transparent",border:"1px solid #1a1d2e",borderRadius:8,color:"#64748B",fontSize:12,cursor:"pointer",fontFamily:"'DM Sans'",transition:"all .15s" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#F43F5E40";e.currentTarget.style.color="#F43F5E";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#1a1d2e";e.currentTarget.style.color="#64748B";}}>
            <IC.Logout /> Sign out
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 28px",borderBottom:"1px solid #0F1118",flexShrink:0 }}>
          <div style={{ position:"relative",width:280 }}>
            <div style={{ position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#4a5070" }}><IC.Search /></div>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{ ...inputSt,paddingLeft:34,width:"100%" }} />
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <div style={{ display:"flex",background:"#0A0C12",borderRadius:8,border:"1px solid #111420",overflow:"hidden" }}>
              <button onClick={()=>setView("grid")} style={{ padding:"7px 10px",background:view==="grid"?"#111420":"transparent",border:"none",color:view==="grid"?"#6366F1":"#4a5070",cursor:"pointer",display:"flex" }}><IC.Grid /></button>
              <button onClick={()=>setView("list")} style={{ padding:"7px 10px",background:view==="list"?"#111420":"transparent",border:"none",color:view==="list"?"#6366F1":"#4a5070",cursor:"pointer",display:"flex" }}><IC.List /></button>
            </div>
            <button onClick={()=>openEditor(null)} style={{ ...btnPrimary,padding:"9px 18px",fontSize:13 }}><IC.Plus /> New Presentation</button>
          </div>
        </div>

        <div style={{ flex:1,overflow:"auto",padding:"24px 28px" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
            <h2 style={{ fontFamily:"'Outfit'",fontSize:20,fontWeight:600,margin:0 }}>{section==="starred"?"Starred":section==="shared"?"Shared":"All Presentations"}</h2>
            <span style={{ fontSize:12,color:"#4a5070" }}>{filtered.length} items</span>
          </div>

          {view==="grid"?(
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240,1fr))",gap:14 }}>
              {filtered.map((p,i)=>(
                <div key={p.id} style={{ background:"#0A0C12",border:"1px solid #111420",borderRadius:14,overflow:"hidden",cursor:"pointer",transition:"all .2s",animation:`fadeUp .4s ease ${i*.04}s both` }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="#1e2235";e.currentTarget.style.transform="translateY(-2px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="#111420";e.currentTarget.style.transform="none";}}>
                  <div style={{ height:120,background:`linear-gradient(135deg,${p.color},${p.color}80)`,position:"relative",display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <span style={{ fontSize:36,fontWeight:800,color:"#fff2",fontFamily:"'Outfit'" }}>{p.slides}</span>
                    <div style={{ position:"absolute",inset:0,background:"#00000060",display:"flex",alignItems:"center",justifyContent:"center",gap:6,opacity:0,transition:"opacity .2s" }}
                      onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=0}>
                      <MiniBtn onClick={()=>{ openEditor(p.id); }} label="Edit"><IC.Edit /></MiniBtn>
                      <MiniBtn onClick={()=>navigate("present")} label="Present"><IC.Play /></MiniBtn>
                      <MiniBtn onClick={()=>navigate("presenter-live")} label="Live"><IC.Monitor /></MiniBtn>
                    </div>
                  </div>
                  <div style={{ padding:"12px 14px" }}>
                    <div style={{ fontSize:14,fontWeight:600,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{p.title}</div>
                    <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,color:"#4a5070" }}>
                      <span>{p.slides} slides</span>
                      <span style={{ display:"flex",alignItems:"center",gap:4 }}><IC.Clock /> {p.updated}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ):(
            <div style={{ display:"flex",flexDirection:"column",gap:4 }}>
              {filtered.map((p,i)=>(
                <div key={p.id} onClick={()=>openEditor(p.id)} style={{ display:"flex",alignItems:"center",gap:14,padding:"12px 14px",background:"#0A0C12",border:"1px solid #111420",borderRadius:10,cursor:"pointer",transition:"all .15s",animation:`fadeUp .3s ease ${i*.03}s both` }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor="#1e2235"} onMouseLeave={e=>e.currentTarget.style.borderColor="#111420"}>
                  <div style={{ width:40,height:26,borderRadius:6,background:`linear-gradient(135deg,${p.color},${p.color}80)`,flexShrink:0 }} />
                  <div style={{ flex:1,fontSize:14,fontWeight:600 }}>{p.title}</div>
                  <span style={{ fontSize:12,color:"#4a5070" }}>{p.slides} slides</span>
                  <span style={{ fontSize:12,color:"#4a5070",display:"flex",alignItems:"center",gap:4 }}><IC.Clock /> {p.updated}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══ EDITOR PAGE (Simplified but functional) ═══
function EditorPage() {
  const { navigate, editingPresId } = useApp();
  const pres = MOCK_PRES.find(p=>p.id===editingPresId) || { title:"New Presentation", slides:3, color:"#6366F1" };

  // ── Slides state (editable) ──
  const [slides, setSlides] = useState(() => {
    // حاول تحميل آخر عمل محفوظ من المتصفح
    try {
      const saved = localStorage.getItem("slidepulse_draft");
      if (saved) return JSON.parse(saved);
    } catch {}
    // افتراضي
    return [
      { bg:"linear-gradient(135deg,#0D0F14,#1a1d2e)", elements:[
        { id: crypto.randomUUID(), type:"text",x:80,y:100,text:"Presentation Title",size:42,bold:true,color:"#E2E8F0" },
        { id: crypto.randomUUID(), type:"text",x:80,y:180,text:"Subtitle goes here",size:20,bold:false,color:"#64748B" }
      ]},
      { bg:"#0D0F14", elements:[
        { id: crypto.randomUUID(), type:"text",x:60,y:40,text:"Key Insights",size:30,bold:true,color:"#E2E8F0" },
        { id: crypto.randomUUID(), type:"shape",x:60,y:90,w:120,h:4,color:"#6366F1" },
        { id: crypto.randomUUID(), type:"text",x:60,y:120,text:"Add your content here. Click to edit.",size:16,bold:false,color:"#94A3B8" }
      ]},
      { bg:"linear-gradient(160deg,#0D0F14,#0f1129)", elements:[
        { id: crypto.randomUUID(), type:"text",x:80,y:40,text:"What do you think?",size:28,bold:true,color:"#E2E8F0" },
        { id: crypto.randomUUID(), type:"poll",x:80,y:100 }
      ]},
    ];
  });

  const [activeSlide,setActiveSlide] = useState(0);
  const [selectedId, setSelectedId] = useState(null);

  // ── Auto-save to localStorage ──
  useEffect(() => {
    try {
      localStorage.setItem("slidepulse_draft", JSON.stringify(slides));
    } catch {}
  }, [slides]);

  const selectedEl = slides[activeSlide]?.elements?.find(e => e.id === selectedId) || null;

  // ── Helpers ──
  const updateSelected = (patch) => {
    if(!selectedId) return;
    setSlides(prev => prev.map((s, si) => {
      if (si !== activeSlide) return s;
      return {
        ...s,
        elements: s.elements.map(el => el.id === selectedId ? { ...el, ...patch } : el)
      };
    }));
  };

  const addElement = (type) => {
    const base = { id: crypto.randomUUID(), type, x: 120, y: 120 };
    let el = base;
    if (type === "text") el = { ...base, text: "New text", size: 22, bold: false, color:"#E2E8F0" };
    if (type === "shape") el = { ...base, w: 160, h: 8, color:"#6366F1" };
    if (type === "circle") el = { ...base, w: 120, h: 120, color:"#8B5CF6" };
    if (type === "image") el = { ...base, w: 220, h: 140, url: "" };
    if (type === "poll") el = { ...base, options: ["Option A","Option B","Option C","Option D"] };

    setSlides(prev => prev.map((s, si) => {
      if (si !== activeSlide) return s;
      return { ...s, elements: [...s.elements, el] };
    }));
    setSelectedId(el.id);
  };

  const addSlide = () => {
    setSlides(prev => [...prev, { bg:"#0D0F14", elements: [] }]);
    setActiveSlide(slides.length);
    setSelectedId(null);
  };

  const deleteSlide = () => {
    if (slides.length <= 1) return;
    setSlides(prev => prev.filter((_,i)=>i!==activeSlide));
    setActiveSlide(s => Math.max(0, s-1));
    setSelectedId(null);
  };

  const deleteSelected = () => {
    if(!selectedId) return;
    setSlides(prev => prev.map((s, si) => {
      if (si !== activeSlide) return s;
      return { ...s, elements: s.elements.filter(el => el.id !== selectedId) };
    }));
    setSelectedId(null);
  };

  // ── Drag logic ──
  const dragRef = useRef({ dragging:false, id:null, startX:0, startY:0, elX:0, elY:0 });

  const onMouseDownEl = (e, el) => {
    e.stopPropagation();
    setSelectedId(el.id);
    dragRef.current = {
      dragging: true,
      id: el.id,
      startX: e.clientX,
      startY: e.clientY,
      elX: el.x,
      elY: el.y
    };
  };

  const onMouseMove = (e) => {
    if(!dragRef.current.dragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    updateSelected({ x: dragRef.current.elX + dx, y: dragRef.current.elY + dy });
  };

  const onMouseUp = () => {
    dragRef.current.dragging = false;
    dragRef.current.id = null;
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  });

  return (
    <div style={{ display:"flex",flexDirection:"column",height:"100vh" }}>
      {/* Top bar */}
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",height:50,background:"#0A0C12",borderBottom:"1px solid #111420",flexShrink:0 }}>
        <div style={{ display:"flex",alignItems:"center",gap:12 }}>
          <button onClick={()=>navigate("dashboard")} style={{ background:"none",border:"none",color:"#4a5070",cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontSize:13,fontFamily:"'DM Sans'" }}><IC.ArrowL /> Back</button>
          <div style={{ width:1,height:22,background:"#1a1d2e" }} />
          <Logo size={22} />
          <div style={{ width:1,height:22,background:"#1a1d2e" }} />
          <span style={{ fontSize:14,color:"#94A3B8" }}>{pres.title}</span>

          <div style={{ width:1,height:22,background:"#1a1d2e",marginLeft:8 }} />
          <button onClick={addSlide} style={{ ...btnGhost,padding:"6px 12px",fontSize:12 }}>+ Slide</button>
          <button onClick={deleteSlide} style={{ ...btnGhost,padding:"6px 12px",fontSize:12,borderColor:"#F43F5E40",color:"#F43F5E" }}>Delete Slide</button>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:6 }}>
          <button onClick={()=>navigate("presenter-live")} style={{ ...btnGhost,padding:"6px 14px",fontSize:12,gap:6 }}><IC.Users /> Go Live</button>
          <button onClick={()=>navigate("present")} style={{ ...btnPrimary,padding:"6px 16px",fontSize:12 }}><IC.Play /> Present</button>
        </div>
      </div>

      <div style={{ display:"flex",flex:1,overflow:"hidden" }}>
        {/* Slide panel */}
        <div style={{ width:180,background:"#0A0C12",borderRight:"1px solid #111420",overflow:"auto",padding:"10px 8px",flexShrink:0 }}>
          {slides.map((_,i)=>(
            <div key={i} onClick={()=>{setActiveSlide(i);setSelectedId(null);}} style={{ marginBottom:8,borderRadius:8,border:i===activeSlide?"2px solid #6366F1":"2px solid transparent",cursor:"pointer",overflow:"hidden" }}>
              <div style={{ paddingTop:"56.25%",background:slides[i].bg,borderRadius:6,position:"relative" }}>
                <div style={{ position:"absolute",bottom:4,left:6,fontSize:9,color:"#4a5070" }}>{i+1}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Canvas */}
        <div style={{ flex:1,display:"flex",flexDirection:"column" }}>
          <div style={{ display:"flex",alignItems:"center",padding:"8px 16px",gap:6,borderBottom:"1px solid #0F1118",flexShrink:0 }}>
            <button onClick={()=>addElement("text")} style={{ ...btnGhost,padding:"6px 10px",fontSize:12 }}><IC.Text /> Text</button>
            <button onClick={()=>addElement("shape")} style={{ ...btnGhost,padding:"6px 10px",fontSize:12 }}><IC.Square /> Shape</button>
            <button onClick={()=>addElement("circle")} style={{ ...btnGhost,padding:"6px 10px",fontSize:12 }}><IC.Circle /> Circle</button>
            <button onClick={()=>addElement("image")} style={{ ...btnGhost,padding:"6px 10px",fontSize:12 }}><IC.Image /> Image</button>
            <button onClick={()=>addElement("poll")} style={{ ...btnGhost,padding:"6px 10px",fontSize:12 }}><IC.Poll /> Poll</button>

            <div style={{ width:1,height:22,background:"#131520",margin:"0 6px" }} />
            <button onClick={deleteSelected} disabled={!selectedId} style={{ ...btnGhost,padding:"6px 10px",fontSize:12,opacity:selectedId?1:.5,borderColor:"#F43F5E40",color:"#F43F5E" }}><IC.Trash /> Delete element</button>

            <div style={{ marginLeft:"auto",fontSize:12,color:"#4a5070" }}>
              Auto-saved locally ✓
            </div>
          </div>

          <div style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:28 }}>
            <div
              onMouseDown={()=>setSelectedId(null)}
              style={{ position:"relative",width:740,height:416,background:slides[activeSlide].bg,borderRadius:10,boxShadow:"0 0 0 1px #1e223540,0 20px 50px #00000050",overflow:"hidden" }}
            >
              {slides[activeSlide].elements.map((el)=> {
                const isSel = el.id === selectedId;

                if(el.type==="text"){
                  return (
                    <div
                      key={el.id}
                      onMouseDown={(e)=>onMouseDownEl(e, el)}
                      onDoubleClick={()=>{
                        const v = prompt("Edit text:", el.text);
                        if (v !== null) updateSelected({ text: v });
                      }}
                      style={{
                        position:"absolute",left:el.x,top:el.y,
                        fontSize:el.size,fontWeight:el.bold?"700":"400",
                        color:el.color||"#E2E8F0",
                        fontFamily:"'Outfit',sans-serif",
                        cursor:"move",
                        outline: isSel ? "2px solid #6366F1" : "none",
                        outlineOffset: 4,
                        padding: 2,
                        userSelect:"none"
                      }}
                    >
                      {el.text}
                    </div>
                  );
                }

                if(el.type==="shape"){
                  return (
                    <div
                      key={el.id}
                      onMouseDown={(e)=>onMouseDownEl(e, el)}
                      style={{
                        position:"absolute",left:el.x,top:el.y,
                        width:el.w,height:el.h,background:el.color,
                        borderRadius:2,cursor:"move",
                        outline: isSel ? "2px solid #6366F1" : "none",
                        outlineOffset: 4
                      }}
                    />
                  );
                }

                if(el.type==="circle"){
                  return (
                    <div
                      key={el.id}
                      onMouseDown={(e)=>onMouseDownEl(e, el)}
                      style={{
                        position:"absolute",left:el.x,top:el.y,
                        width:el.w,height:el.h,background:el.color,
                        borderRadius:"50%",cursor:"move",
                        outline: isSel ? "2px solid #6366F1" : "none",
                        outlineOffset: 4
                      }}
                    />
                  );
                }

                if(el.type==="image"){
                  return (
                    <div
                      key={el.id}
                      onMouseDown={(e)=>onMouseDownEl(e, el)}
                      style={{
                        position:"absolute",left:el.x,top:el.y,
                        width:el.w,height:el.h,
                        background:"#111420",
                        border:"1px dashed #2a2e45",
                        borderRadius:10,
                        display:"flex",alignItems:"center",justifyContent:"center",
                        color:"#4a5070",fontSize:12,cursor:"move",
                        outline: isSel ? "2px solid #6366F1" : "none",
                        outlineOffset: 4
                      }}
                    >
                      {el.url ? <img src={el.url} alt="" style={{ width:"100%",height:"100%",objectFit:"cover",borderRadius:10 }} /> : "Double-click to set image URL"}
                    </div>
                  );
                }

                if(el.type==="poll"){
                  return (
                    <div
                      key={el.id}
                      onMouseDown={(e)=>onMouseDownEl(e, el)}
                      style={{
                        position:"absolute",left:el.x,top:el.y,width:520,
                        display:"flex",flexDirection:"column",gap:10,
                        cursor:"move",
                        outline: isSel ? "2px solid #6366F1" : "none",
                        outlineOffset: 6,
                        padding: 2
                      }}
                    >
                      {(el.options || ["Option A","Option B","Option C","Option D"]).map((o,j)=>(
                        <div key={j} style={{ position:"relative",background:"#151825",borderRadius:10,padding:"12px 16px",border:"1px solid #1e2235",overflow:"hidden" }}>
                          <div style={{ position:"relative",display:"flex",justifyContent:"space-between" }}>
                            <span style={{ fontSize:14,color:"#E2E8F0" }}>{o}</span>
                            <span style={{ fontSize:13,fontWeight:600,color:"#6366F1",fontFamily:"'JetBrains Mono'" }}>—</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        </div>

        {/* Properties */}
        <div style={{ width:260,background:"#0A0C12",borderLeft:"1px solid #111420",padding:"14px",flexShrink:0,overflow:"auto" }}>
          <div style={{ fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:".08em",color:"#4a5070",marginBottom:12 }}>Properties</div>

          {!selectedEl ? (
            <div style={{ textAlign:"center",padding:"40px 0",color:"#4a5070",fontSize:13 }}>
              Click an element to edit properties
            </div>
          ) : (
            <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
              <div style={{ fontSize:13,color:"#94A3B8" }}>
                <b style={{ color:"#E2E8F0" }}>{selectedEl.type.toUpperCase()}</b>
              </div>

              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                <div>
                  <label style={lbl}>X</label>
                  <input value={Math.round(selectedEl.x)} onChange={e=>updateSelected({ x: Number(e.target.value||0) })} style={{...inputSt,width:"100%"}} />
                </div>
                <div>
                  <label style={lbl}>Y</label>
                  <input value={Math.round(selectedEl.y)} onChange={e=>updateSelected({ y: Number(e.target.value||0) })} style={{...inputSt,width:"100%"}} />
                </div>
              </div>

              {selectedEl.type === "text" && (
                <>
                  <div>
                    <label style={lbl}>Text</label>
                    <textarea value={selectedEl.text} onChange={e=>updateSelected({ text: e.target.value })} style={{...inputSt,width:"100%",minHeight:90,resize:"vertical"}} />
                    <div style={{ fontSize:11,color:"#4a5070",marginTop:6 }}>Tip: double-click text on slide to edit quickly.</div>
                  </div>

                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                    <div>
                      <label style={lbl}>Size</label>
                      <input value={selectedEl.size} onChange={e=>updateSelected({ size: Number(e.target.value||16) })} style={{...inputSt,width:"100%"}} />
                    </div>
                    <div>
                      <label style={lbl}>Bold</label>
                      <select value={selectedEl.bold ? "yes" : "no"} onChange={e=>updateSelected({ bold: e.target.value === "yes" })} style={{...inputSt,width:"100%",cursor:"pointer"}}>
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={lbl}>Color (hex)</label>
                    <input value={selectedEl.color||"#E2E8F0"} onChange={e=>updateSelected({ color: e.target.value })} style={{...inputSt,width:"100%"}} />
                  </div>
                </>
              )}

              {(selectedEl.type === "shape" || selectedEl.type === "circle" || selectedEl.type === "image") && (
                <>
                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                    <div>
                      <label style={lbl}>Width</label>
                      <input value={selectedEl.w} onChange={e=>updateSelected({ w: Number(e.target.value||100) })} style={{...inputSt,width:"100%"}} />
                    </div>
                    <div>
                      <label style={lbl}>Height</label>
                      <input value={selectedEl.h} onChange={e=>updateSelected({ h: Number(e.target.value||100) })} style={{...inputSt,width:"100%"}} />
                    </div>
                  </div>
                </>
              )}

              {(selectedEl.type === "shape" || selectedEl.type === "circle") && (
                <div>
                  <label style={lbl}>Color (hex)</label>
                  <input value={selectedEl.color||"#6366F1"} onChange={e=>updateSelected({ color: e.target.value })} style={{...inputSt,width:"100%"}} />
                </div>
              )}

              {selectedEl.type === "image" && (
                <div>
                  <label style={lbl}>Image URL</label>
                  <input
                    value={selectedEl.url || ""}
                    onChange={e=>updateSelected({ url: e.target.value })}
                    placeholder="https://..."
                    style={{...inputSt,width:"100%"}}
                    onDoubleClick={()=>{
                      const v = prompt("Paste image URL:", selectedEl.url || "");
                      if (v !== null) updateSelected({ url: v });
                    }}
                  />
                  <div style={{ fontSize:11,color:"#4a5070",marginTop:6 }}>Tip: double-click the image box on slide.</div>
                </div>
              )}

              {selectedEl.type === "poll" && (
                <div>
                  <label style={lbl}>Poll options (one per line)</label>
                  <textarea
                    value={(selectedEl.options||[]).join("\n")}
                    onChange={e=>updateSelected({ options: e.target.value.split("\n").filter(Boolean).slice(0,6) })}
                    style={{...inputSt,width:"100%",minHeight:120,resize:"vertical"}}
                  />
                  <div style={{ fontSize:11,color:"#4a5070",marginTop:6 }}>Max 6 options.</div>
                </div>
              )}

              <div style={{ height:1,background:"#111420",margin:"6px 0" }} />
              <button onClick={deleteSelected} style={{ ...btnGhost,justifyContent:"center",borderColor:"#F43F5E40",color:"#F43F5E" }}>
                <IC.Trash /> Remove element
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",height:26,background:"#0A0C12",borderTop:"1px solid #111420",flexShrink:0 }}>
        <span style={{ fontSize:10,color:"#4a5070" }}>Slide {activeSlide+1} of {slides.length}</span>
        <span style={{ fontSize:10,color:"#4a5070" }}>{slides[activeSlide].elements.length} elements</span>
      </div>
    </div>
  );
}

const lbl = { fontSize:11,color:"#4a5070",display:"block",marginBottom:4 };

// ═══ PRESENTATION MODE ═══
function PresentMode() {
  const { navigate } = useApp();
  const [slide,setSlide]=useState(0);
  const titles = ["Presentation Title","Key Insights","What do you think?"];
  useEffect(()=>{
    const h = e=>{ if(e.key==="Escape") navigate("editor"); if(e.key==="ArrowRight"||e.key===" ") setSlide(s=>Math.min(2,s+1)); if(e.key==="ArrowLeft") setSlide(s=>Math.max(0,s-1)); };
    window.addEventListener("keydown",h); return ()=>window.removeEventListener("keydown",h);
  },[]);
  return (
    <div style={{ position:"fixed",inset:0,background:"#000",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ width:"100vw",height:"56.25vw",maxHeight:"100vh",maxWidth:"177.78vh",background:"linear-gradient(135deg,#0D0F14,#1a1d2e)",display:"flex",alignItems:"center",justifyContent:"center" }}>
        <h1 style={{ fontFamily:"'Outfit'",fontSize:"clamp(28px,5vw,56px)",fontWeight:800,color:"#E2E8F0",textAlign:"center",animation:"fadeUp .5s ease" }} key={slide}>{titles[slide]}</h1>
      </div>
      <div style={{ position:"fixed",bottom:20,left:"50%",transform:"translateX(-50%)",display:"flex",gap:10,alignItems:"center",background:"#151825ee",borderRadius:12,padding:"8px 16px",backdropFilter:"blur(10px)" }}>
        <button onClick={()=>setSlide(s=>Math.max(0,s-1))} style={presBtn}><IC.ChevL /></button>
        <span style={{ color:"#94A3B8",fontSize:13,minWidth:50,textAlign:"center" }}>{slide+1}/3</span>
        <button onClick={()=>setSlide(s=>Math.min(2,s+1))} style={presBtn}><IC.ChevR /></button>
        <div style={{ width:1,height:20,background:"#2a2e45" }} />
        <button onClick={()=>navigate("editor")} style={presBtn}><IC.X /></button>
      </div>
    </div>
  );
}

// ═══ AUDIENCE JOIN ═══
function AudienceJoin() {
  const { navigate } = useApp();
  const [code,setCode]=useState(""); const [step,setStep]=useState("code");
  return (
    <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24,position:"relative" }}>
      <BgEffects />
      <div style={{ width:"100%",maxWidth:400,position:"relative",zIndex:1,animation:"fadeUp .5s ease" }}>
        <button onClick={()=>navigate("landing")} style={{ background:"none",border:"none",color:"#4a5070",fontSize:13,cursor:"pointer",fontFamily:"'DM Sans'",marginBottom:16 }}>← Back</button>
        {step==="code"?(
          <div style={{ textAlign:"center" }}>
            <div style={{ display:"flex",justifyContent:"center",marginBottom:16 }}><Logo /></div>
            <h1 style={{ fontFamily:"'Outfit'",fontSize:28,fontWeight:700,margin:"0 0 6px" }}>Join Presentation</h1>
            <p style={{ color:"#4a5070",fontSize:14,marginBottom:24 }}>Enter the session code</p>
            <input value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="SP-4827" maxLength={7}
              style={{ ...inputSt,textAlign:"center",fontSize:22,fontFamily:"'JetBrains Mono'",letterSpacing:".1em",fontWeight:600,padding:"14px",width:"100%",marginBottom:12 }}
              onKeyDown={e=>e.key==="Enter"&&setStep("joining")} />
            <button onClick={()=>setStep("joining")} style={{ ...btnPrimary,width:"100%",padding:"14px",justifyContent:"center" }}>Join Session <IC.ArrowR /></button>
          </div>
        ):step==="joining"?(
          <div style={{ textAlign:"center",animation:"fadeUp .4s ease" }}>
            <div style={{ width:48,height:48,border:"3px solid #1a1d2e",borderTopColor:"#6366F1",borderRadius:"50%",animation:"spin .8s linear infinite",margin:"40px auto 24px" }} />
            <h2 style={{ fontFamily:"'Outfit'",fontSize:22,fontWeight:700 }}>Joining...</h2>
            {setTimeout(()=>navigate("audience-live"),1500)&&null}
          </div>
        ):null}
      </div>
    </div>
  );
}

// ═══ AUDIENCE LIVE ═══
function AudienceLive() {
  const { navigate } = useApp();
  const [voted,setVoted]=useState(false);
  const opts=["Live Polls","Quizzes","Word Clouds","Q&A"];
  return (
    <div style={{ minHeight:"100vh",maxWidth:420,margin:"0 auto",display:"flex",flexDirection:"column" }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 18px",borderBottom:"1px solid #0F1118",background:"#0A0C12" }}>
        <button onClick={()=>navigate("landing")} style={{ background:"none",border:"none",color:"#4a5070",fontSize:13,cursor:"pointer",fontFamily:"'DM Sans'" }}>← Exit</button>
        <div style={{ display:"flex",alignItems:"center",gap:6 }}>
          <span style={{ width:7,height:7,borderRadius:"50%",background:"#22C55E",animation:"pulse 1.5s infinite" }} />
          <span style={{ fontSize:12,color:"#94A3B8" }}>Live • SP-4827</span>
        </div>
      </div>
      <div style={{ flex:1,padding:"24px 18px",animation:"fadeUp .5s ease" }}>
        <span style={{ padding:"3px 10px",borderRadius:50,background:"#6366F115",color:"#6366F1",fontSize:11,fontWeight:600 }}>POLL</span>
        <h2 style={{ fontFamily:"'Outfit'",fontSize:22,fontWeight:700,margin:"8px 0 4px" }}>Which feature excites you most?</h2>
        <p style={{ color:"#4a5070",fontSize:13,marginBottom:20 }}>Tap to vote</p>
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {opts.map((o,i)=>(
            <button key={i} onClick={()=>setVoted(true)} disabled={voted}
              style={{ position:"relative",padding:"16px",background:voted&&i===0?"#6366F110":"#0A0C12",border:`1.5px solid ${voted&&i===0?"#6366F150":"#1a1d2e"}`,borderRadius:14,cursor:voted?"default":"pointer",textAlign:"left",overflow:"hidden",transition:"all .2s",animation:`fadeUp .4s ease ${i*.06}s both` }}>
              {voted&&<div style={{ position:"absolute",left:0,top:0,bottom:0,width:`${[42,28,18,12][i]}%`,background:`${["#6366F1","#8B5CF6","#EC4899","#06B6D4"][i]}10`,borderRadius:14,transition:"width .6s" }} />}
              <div style={{ position:"relative",display:"flex",alignItems:"center",gap:12 }}>
                <div style={{ width:34,height:34,borderRadius:10,background:`${["#6366F1","#8B5CF6","#EC4899","#06B6D4"][i]}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:["#6366F1","#8B5CF6","#EC4899","#06B6D4"][i],fontFamily:"'Outfit'" }}>{voted&&i===0?<IC.Check />:String.fromCharCode(65+i)}</div>
                <span style={{ fontSize:15,fontWeight:600,color:"#E2E8F0" }}>{o}</span>
                {voted&&<span style={{ marginLeft:"auto",fontSize:14,fontWeight:700,color:["#6366F1","#8B5CF6","#EC4899","#06B6D4"][i],fontFamily:"'JetBrains Mono'" }}>{[42,28,18,12][i]}%</span>}
              </div>
            </button>
          ))}
        </div>
        {voted&&<p style={{ color:"#22C55E",fontSize:14,fontWeight:600,textAlign:"center",marginTop:16,animation:"popIn .4s ease" }}>✓ Vote recorded!</p>}
      </div>
      <div style={{ padding:"12px 18px",borderTop:"1px solid #0F1118",background:"#0A0C12",display:"flex",justifyContent:"center",gap:10 }}>
        {["👍","❤️","😂","🤔","👏","🔥"].map(e=><button key={e} style={{ width:42,height:42,borderRadius:12,background:"#111320",border:"1px solid #1a1d2e",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"transform .15s" }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.15)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>{e}</button>)}
      </div>
    </div>
  );
}

// ═══ PRESENTER LIVE ═══
function PresenterLive() {
  const { navigate } = useApp();
  const [count,setCount]=useState(24);
  const [votes,setVotes]=useState([18,12,6,4]);
  useEffect(()=>{
    const t1=setInterval(()=>setCount(c=>Math.min(c+1,50)),1500);
    const t2=setInterval(()=>setVotes(v=>{const n=[...v];n[Math.floor(Math.random()*4)]++;return n;}),800);
    return ()=>{clearInterval(t1);clearInterval(t2);};
  },[]);
  const total=votes.reduce((a,b)=>a+b,0); const opts=["Live Polls","Quizzes","Word Clouds","Q&A"];
  return (
    <div style={{ minHeight:"100vh",display:"flex",flexDirection:"column" }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",height:54,background:"#0A0C12",borderBottom:"1px solid #0F1118",flexShrink:0 }}>
        <div style={{ display:"flex",alignItems:"center",gap:12 }}>
          <button onClick={()=>navigate("dashboard")} style={{ background:"none",border:"none",color:"#4a5070",cursor:"pointer",fontFamily:"'DM Sans'",fontSize:13 }}>← Back</button>
          <div style={{ width:1,height:22,background:"#131520" }} />
          <Logo size={22} /><span style={{ fontSize:14,fontWeight:600,marginLeft:4 }}>Presenter Dashboard</span>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:14 }}>
          <div style={{ display:"flex",alignItems:"center",gap:6,padding:"4px 14px",background:"#22C55E10",border:"1px solid #22C55E25",borderRadius:50 }}>
            <span style={{ width:7,height:7,borderRadius:"50%",background:"#22C55E",animation:"pulse 1.5s infinite" }} />
            <span style={{ fontSize:13,color:"#22C55E",fontWeight:600 }}>LIVE</span>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:6,color:"#94A3B8",fontSize:13 }}><IC.Users /> <span style={{ fontFamily:"'JetBrains Mono'",fontWeight:600 }}>{count}</span></div>
          <span style={{ padding:"4px 12px",background:"#0D0F14",borderRadius:8,border:"1px solid #1a1d2e",fontFamily:"'JetBrains Mono'",fontSize:14,fontWeight:600,color:"#6366F1" }}>SP-4827</span>
        </div>
      </div>
      <div style={{ flex:1,padding:"28px 32px",overflow:"auto" }}>
        <h2 style={{ fontFamily:"'Outfit'",fontSize:28,fontWeight:800,margin:"0 0 6px" }}>Which feature excites you most?</h2>
        <p style={{ color:"#4a5070",fontSize:14,marginBottom:24 }}><span style={{ fontFamily:"'JetBrains Mono'",fontWeight:600,color:"#6366F1" }}>{total}</span> total votes</p>
        <div style={{ display:"flex",flexDirection:"column",gap:14,maxWidth:700 }}>
          {opts.map((o,i)=>{
            const pct=total>0?Math.round(votes[i]/total*100):0;
            const isMax=votes[i]===Math.max(...votes);
            return (
              <div key={i} style={{ position:"relative",background:"#0A0C12",border:`1px solid ${isMax?`${["#6366F1","#8B5CF6","#EC4899","#06B6D4"][i]}30`:"#111420"}`,borderRadius:14,padding:"18px 22px",overflow:"hidden",transition:"all .3s" }}>
                <div style={{ position:"absolute",left:0,top:0,bottom:0,width:`${pct}%`,background:`${["#6366F1","#8B5CF6","#EC4899","#06B6D4"][i]}10`,transition:"width .6s ease",borderRadius:14 }} />
                <div style={{ position:"relative",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:14 }}>
                    <div style={{ width:40,height:40,borderRadius:10,background:`${["#6366F1","#8B5CF6","#EC4899","#06B6D4"][i]}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:["#6366F1","#8B5CF6","#EC4899","#06B6D4"][i],fontFamily:"'Outfit'" }}>{String.fromCharCode(65+i)}</div>
                    <span style={{ fontSize:17,fontWeight:600 }}>{o}</span>
                    {isMax&&<span style={{ padding:"2px 8px",borderRadius:50,background:`${["#6366F1","#8B5CF6","#EC4899","#06B6D4"][i]}20`,color:["#6366F1","#8B5CF6","#EC4899","#06B6D4"][i],fontSize:10,fontWeight:700 }}>LEADING</span>}
                  </div>
                  <div style={{ display:"flex",alignItems:"baseline",gap:6 }}>
                    <span style={{ fontSize:30,fontWeight:800,fontFamily:"'Outfit'",color:["#6366F1","#8B5CF6","#EC4899","#06B6D4"][i] }}>{pct}%</span>
                    <span style={{ fontSize:13,color:"#4a5070",fontFamily:"'JetBrains Mono'" }}>({votes[i]})</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══ ADMIN PAGE (Compact) ═══
function AdminPage() {
  const { navigate } = useApp();
  const stats=[["Users","1,024","+12%","#6366F1",<IC.Users />],["Presentations","2,847","+8%","#8B5CF6",<IC.Slides />],["Active Now","142","+23%","#22C55E",<IC.Zap />],["Flagged","2","-40%","#F43F5E",<IC.Shield />]];
  return (
    <div style={{ display:"flex",height:"100vh",overflow:"hidden" }}>
      <div style={{ width:200,background:"#0A0C12",borderRight:"1px solid #0F1118",display:"flex",flexDirection:"column",flexShrink:0 }}>
        <div style={{ padding:"18px 14px 20px" }}><Logo size={24} /><span style={{ fontSize:10,color:"#4a5070",display:"block",marginTop:2,letterSpacing:".05em" }}>ADMIN</span></div>
        <nav style={{ flex:1,padding:"0 8px",display:"flex",flexDirection:"column",gap:2 }}>
          {[["Dashboard",<IC.Home />],["Users",<IC.Users />],["Content",<IC.Slides />],["Analytics",<IC.Chart />],["Logs",<IC.Activity />],["Settings",<IC.Settings />]].map(([l,ic],i)=>(
            <SideBtn key={l} active={i===0} icon={ic} label={l} />
          ))}
        </nav>
        <div style={{ padding:12,borderTop:"1px solid #0F1118" }}>
          <button onClick={()=>navigate("dashboard")} style={{ ...btnGhost,width:"100%",padding:"8px",fontSize:12,justifyContent:"center" }}><IC.ArrowL /> Back to App</button>
        </div>
      </div>
      <div style={{ flex:1,overflow:"auto",padding:"24px 28px" }}>
        <h1 style={{ fontFamily:"'Outfit'",fontSize:22,fontWeight:700,margin:"0 0 20px" }}>Admin Dashboard</h1>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24 }}>
          {stats.map(([l,v,ch,c,ic],i)=>(
            <div key={i} style={{ background:"#0A0C12",border:"1px solid #111420",borderRadius:14,padding:"18px",animation:`fadeUp .4s ease ${i*.06}s both` }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:12 }}>
                <div style={{ width:38,height:38,borderRadius:10,background:`${c}12`,display:"flex",alignItems:"center",justifyContent:"center",color:c }}>{ic}</div>
                <span style={{ fontSize:12,fontWeight:600,color:ch.startsWith("+")?"#22C55E":"#F43F5E" }}>{ch}</span>
              </div>
              <div style={{ fontFamily:"'Outfit'",fontSize:26,fontWeight:800 }}>{v}</div>
              <div style={{ fontSize:12,color:"#4a5070",marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ background:"#0A0C12",border:"1px solid #111420",borderRadius:14,padding:"20px" }}>
          <h3 style={{ fontFamily:"'Outfit'",fontSize:15,fontWeight:600,margin:"0 0 14px" }}>Recent Activity</h3>
          {[["System","Server health check passed","2 min ago"],["Fatima Zahra","Updated system settings","15 min ago"],["Ahmed Al-Rashid","Banned user Rami Nassar","1 hour ago"],["System","Backup completed","3 hours ago"],["Sarah Mansour","Created presentation","5 hours ago"]].map(([u,a,t],i)=>(
            <div key={i} style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:i<4?"1px solid #0D0F14":"none" }}>
              <div style={{ width:6,height:6,borderRadius:"50%",background:u==="System"?"#64748B":"#6366F1",flexShrink:0 }} />
              <span style={{ fontSize:13,fontWeight:600,minWidth:110 }}>{u}</span>
              <span style={{ fontSize:12,color:"#94A3B8",flex:1 }}>{a}</span>
              <span style={{ fontSize:11,color:"#4a5070" }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══ SETTINGS PAGE ═══
function SettingsPage() {
  const { navigate, user } = useApp();
  const initials = user?.name?.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2)||"U";
  return (
    <div style={{ minHeight:"100vh",maxWidth:600,margin:"0 auto",padding:"40px 24px" }}>
      <button onClick={()=>navigate("dashboard")} style={{ background:"none",border:"none",color:"#6366F1",fontSize:14,cursor:"pointer",fontFamily:"'DM Sans'",marginBottom:24 }}>← Back to Dashboard</button>
      <h1 style={{ fontFamily:"'Outfit'",fontSize:28,fontWeight:700,margin:"0 0 28px" }}>Account Settings</h1>
      <div style={{ background:"#0A0C12",border:"1px solid #111420",borderRadius:14,padding:24,marginBottom:16 }}>
        <h3 style={{ fontFamily:"'Outfit'",fontSize:16,fontWeight:600,margin:"0 0 16px" }}>Profile</h3>
        <div style={{ display:"flex",alignItems:"center",gap:16,marginBottom:18 }}>
          <div style={{ width:56,height:56,borderRadius:14,background:"linear-gradient(135deg,#6366F1,#8B5CF6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:700,color:"#fff" }}>{initials}</div>
          <div><div style={{ fontSize:18,fontWeight:600 }}>{user?.name}</div><div style={{ fontSize:13,color:"#64748B" }}>{user?.email}</div></div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          <div><label style={{ fontSize:12,color:"#4a5070",display:"block",marginBottom:4 }}>Name</label><input defaultValue={user?.name} style={{ ...inputSt,width:"100%" }} /></div>
          <div><label style={{ fontSize:12,color:"#4a5070",display:"block",marginBottom:4 }}>Email</label><input defaultValue={user?.email} style={{ ...inputSt,width:"100%" }} /></div>
        </div>
      </div>
      <div style={{ background:"#0A0C12",border:"1px solid #111420",borderRadius:14,padding:24,marginBottom:16 }}>
        <h3 style={{ fontFamily:"'Outfit'",fontSize:16,fontWeight:600,margin:"0 0 16px" }}>Preferences</h3>
        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <div><div style={{ fontSize:14 }}>Language</div><div style={{ fontSize:12,color:"#4a5070" }}>Interface language</div></div>
            <select style={{ ...inputSt,width:160,cursor:"pointer" }}><option>English</option><option>العربية</option></select>
          </div>
          {[["Dark mode","Always use dark theme",true],["Auto-save","Save changes automatically",true],["Notifications","Email notifications",false]].map(([l,d,on])=>(
            <Toggle key={l} label={l} desc={d} defaultOn={on} />
          ))}
        </div>
      </div>
      <button style={{ ...btnPrimary,padding:"12px 24px" }}><IC.Check /> Save Settings</button>
    </div>
  );
}

// ═══════════════════════════════════════
// ─── SHARED COMPONENTS ───
// ═══════════════════════════════════════
function Logo({ size=28 }) {
  return (
    <div style={{ display:"flex",alignItems:"center",gap:8 }}>
      <div style={{ width:size,height:size,borderRadius:size*.22,background:"linear-gradient(135deg,#6366F1,#8B5CF6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.5,fontWeight:800,color:"#fff",fontFamily:"'Outfit'" }}>S</div>
      <span style={{ fontFamily:"'Outfit'",fontWeight:700,fontSize:size*.56,letterSpacing:"-0.02em" }}>SlidePulse</span>
    </div>
  );
}

function BgEffects() {
  return (
    <div style={{ position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0 }}>
      <div style={{ position:"absolute",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,#6366F10d 0%,transparent 70%)",top:"-15%",right:"-10%" }} />
      <div style={{ position:"absolute",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,#8B5CF608 0%,transparent 70%)",bottom:"-5%",left:"-5%" }} />
      <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",opacity:.02 }}>
        {Array.from({length:20},(_,i)=><line key={i} x1={`${i*5}%`} y1="0" x2={`${i*5}%`} y2="100%" stroke="#6366F1" strokeWidth=".5" />)}
      </svg>
    </div>
  );
}

function AuthInput({ icon, type, placeholder, value, onChange, error, suffix }) {
  return (
    <div>
      <div style={{ position:"relative" }}>
        <div style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#4a5070",display:"flex" }}>{icon}</div>
        <input type={type} placeholder={placeholder} value={value} onChange={onChange}
          style={{ ...inputSt,paddingLeft:42,paddingRight:suffix?42:14,width:"100%" }}
          onFocus={e=>e.target.style.borderColor=error?"#F43F5E":"#6366F1"} onBlur={e=>e.target.style.borderColor=error?"#F43F5E40":"#1a1d2e"} />
        {suffix&&<div style={{ position:"absolute",right:12,top:"50%",transform:"translateY(-50%)" }}>{suffix}</div>}
      </div>
      {error&&<div style={{ fontSize:11,color:"#F43F5E",marginTop:3 }}>{error}</div>}
    </div>
  );
}

function SideBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick}
      style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 12px",background:active?"#6366F110":"transparent",border:"none",borderRadius:8,color:active?"#818CF8":"#4a5070",fontSize:13,fontWeight:active?600:500,cursor:"pointer",fontFamily:"'DM Sans'",textAlign:"left",width:"100%",transition:"all .15s",borderLeft:active?"2px solid #6366F1":"2px solid transparent" }}
      onMouseEnter={e=>{if(!active){e.currentTarget.style.background="#0D0F14";e.currentTarget.style.color="#94A3B8";}}}
      onMouseLeave={e=>{if(!active){e.currentTarget.style.background="transparent";e.currentTarget.style.color="#4a5070";}}}>
      {icon}{label}
    </button>
  );
}

function MiniBtn({ children, onClick, label }) {
  return (
    <button onClick={e=>{e.stopPropagation();onClick&&onClick();}} title={label}
      style={{ display:"flex",alignItems:"center",gap:5,padding:"7px 12px",background:"#151825ee",border:"1px solid #2a2e45",borderRadius:8,color:"#E2E8F0",fontSize:11,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans'",backdropFilter:"blur(8px)" }}>
      {children}{label&&<span>{label}</span>}
    </button>
  );
}

function Toggle({ label, desc, defaultOn }) {
  const [on,setOn]=useState(defaultOn);
  return (
    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
      <div><div style={{ fontSize:14 }}>{label}</div><div style={{ fontSize:12,color:"#4a5070" }}>{desc}</div></div>
      <button onClick={()=>setOn(!on)} style={{ width:42,height:22,borderRadius:11,background:on?"#6366F1":"#1a1d2e",border:"none",cursor:"pointer",position:"relative",transition:"background .2s",padding:0,flexShrink:0 }}>
        <div style={{ width:16,height:16,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:on?23:3,transition:"left .2s" }} />
      </button>
    </div>
  );
}

// ─── STYLES ───
const inputSt = { padding:"12px 14px",background:"#0D0F14",border:"1.5px solid #1a1d2e",borderRadius:10,color:"#E2E8F0",fontSize:14,fontFamily:"'DM Sans'",outline:"none",boxSizing:"border-box",transition:"border-color .2s" };
const btnPrimary = { display:"flex",alignItems:"center",gap:8,padding:"10px 22px",background:"linear-gradient(135deg,#6366F1,#7C3AED)",border:"none",borderRadius:10,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans'",transition:"all .2s" };
const btnGhost = { display:"flex",alignItems:"center",gap:6,padding:"8px 16px",background:"transparent",border:"1px solid #1e2235",borderRadius:8,color:"#94A3B8",fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans'",transition:"all .2s" };
const presBtn = { background:"transparent",border:"none",color:"#94A3B8",cursor:"pointer",padding:6,borderRadius:6,display:"flex",alignItems:"center" };