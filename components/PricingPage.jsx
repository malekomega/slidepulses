"use client";

import { useState, useEffect } from "react";

const LS_MONTHLY = "https://slidepulse.lemonsqueezy.com/checkout/buy/49782a2e-5ff4-4b99-be54-4187b74b2650";
const LS_ANNUAL = "https://slidepulse.lemonsqueezy.com/checkout/buy/8c111683-8c52-4253-a0cb-622d46f4109f";

const Check = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>;

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(true), []);

  const plans = [
    {
      name: "Free",
      desc: "For individuals getting started",
      price: 0,
      period: "forever",
      features: ["5 presentations", "Unlimited audience", "Basic templates", "Live polls & quizzes", "Community support", "SlidePlus branding"],
      cta: "Get Started",
      href: "/signup",
      popular: false,
    },
    {
      name: "Pro",
      desc: "For professionals and teams",
      price: isAnnual ? 6 : 9.99,
      period: isAnnual ? "/mo (billed $72/yr)" : "/month",
      features: ["Unlimited presentations", "Up to 500 participants", "Premium templates", "All interactive tools", "Analytics dashboard", "Priority support", "Custom branding", "Export to PDF/PPTX"],
      cta: "Upgrade to Pro",
      href: isAnnual ? LS_ANNUAL : LS_MONTHLY,
      popular: true,
    },
    {
      name: "Enterprise",
      desc: "For large organizations",
      price: null,
      period: "",
      features: ["Everything in Pro", "Unlimited participants", "SSO & SAML", "Admin panel", "Regional data hosting", "Dedicated support", "Custom integrations", "SLA guarantee"],
      cta: "Contact Sales",
      href: "mailto:contact@slideplus.io",
      popular: false,
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#060810", fontFamily: "'DM Sans', sans-serif", color: "#E2E8F0" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 30px #6366F115; } 50% { box-shadow: 0 0 50px #6366F125; } }
      `}</style>

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", borderBottom: "1px solid #131520" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg, #6366F1, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 268.05 270.45" fill="#fff"><path d="M198.37,131.77c-1.87-3.04-4.09-5.85-6.6-8.36-3.15-3.15-6.64-5.84-10.38-8.01v-51.63c0-5.43-1.86-10.12-5.5-13.91-3.51-3.65-7.72-5.71-12.51-6.14h-.06c-1.01-.09-2.03-.14-3.07-.14H62.93c-1.04,0-2.06.05-3.07.14h-.06c-4.79.43-9,2.49-12.51,6.14-3.65,3.79-5.5,8.48-5.5,13.91v133.41c0,5.43,1.86,10.12,5.5,13.91,3.51,3.65,7.72,5.71,12.51,6.14h.06c1.01.09,2.03.14,3.07.14h77.48c2.78,6.1,6.68,11.67,11.58,16.44l.16.15c8.31,8.03,18.22,12.71,29.42,13.89.79.08,1.58.14,2.37.17l2.16.05c.7.01,1.41,0,2.12-.02.85-.04,1.69-.1,2.53-.2,11.2-1.18,21.11-5.87,29.42-13.89,8.55-8.27,13.55-18.49,14.84-30.38.03-.24.05-.48.07-.72.16-1.94.24-3.9.24-5.87,0-11.96-3.55-22.68-10.54-31.82-1.77-2.31-3.72-4.48-5.83-6.47l-.29-.27c-.05-.04-.09-.08-.14-.12Z"/></svg>
          </div>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, color: "#E2E8F0" }}>SlidePlus</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/login" style={{ padding: "8px 18px", background: "transparent", border: "1px solid #1e2235", borderRadius: 8, color: "#94A3B8", fontSize: 14, fontWeight: 500, textDecoration: "none", fontFamily: "'DM Sans'" }}>Log in</a>
          <a href="/signup" style={{ padding: "8px 18px", background: "linear-gradient(135deg, #6366F1, #7C3AED)", border: "none", borderRadius: 8, color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none", fontFamily: "'DM Sans'" }}>Sign up</a>
        </div>
      </nav>

      {/* Header */}
      <div style={{ textAlign: "center", padding: "64px 20px 0", animation: loaded ? "fadeUp 0.5s ease" : "none" }}>
        <div style={{ display: "inline-block", padding: "5px 16px", background: "#6366F112", border: "1px solid #6366F125", borderRadius: 20, fontSize: 13, fontWeight: 600, color: "#6366F1", marginBottom: 20 }}>
          Simple, transparent pricing
        </div>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, margin: "0 0 12px", lineHeight: 1.15 }}>
          Choose the plan that<br />fits your needs
        </h1>
        <p style={{ color: "#4a5070", fontSize: 17, maxWidth: 500, margin: "0 auto 36px" }}>
          Start free, upgrade when you need more power
        </p>

        {/* Toggle */}
        <div style={{ display: "inline-flex", alignItems: "center", background: "#0D0F14", border: "1px solid #131520", borderRadius: 12, padding: 4, marginBottom: 48 }}>
          <button onClick={() => setIsAnnual(false)} style={{ padding: "9px 22px", borderRadius: 10, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'", background: !isAnnual ? "#6366F1" : "transparent", color: !isAnnual ? "#fff" : "#4a5070", transition: "all 0.2s" }}>Monthly</button>
          <button onClick={() => setIsAnnual(true)} style={{ padding: "9px 22px", borderRadius: 10, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'", background: isAnnual ? "#6366F1" : "transparent", color: isAnnual ? "#fff" : "#4a5070", transition: "all 0.2s" }}>
            Annual <span style={{ fontSize: 11, opacity: 0.8, marginLeft: 4 }}>Save 40%</span>
          </button>
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, maxWidth: 960, margin: "0 auto", padding: "0 20px 80px" }}>
        {plans.map((p, i) => (
          <div key={p.name} style={{
            background: "#0D0F14",
            border: p.popular ? "1.5px solid #6366F150" : "1px solid #131520",
            borderRadius: 20,
            padding: "36px 28px",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.3s",
            animation: loaded ? `fadeUp 0.5s ease ${0.1 + i * 0.1}s both` : "none",
            ...(p.popular ? { animation: loaded ? `fadeUp 0.5s ease 0.2s both, glow 3s ease-in-out infinite` : "none" } : {}),
          }}>
            {p.popular && (
              <div style={{ position: "absolute", top: 16, right: -28, background: "linear-gradient(135deg, #6366F1, #7C3AED)", padding: "4px 36px", fontSize: 11, fontWeight: 700, color: "#fff", transform: "rotate(45deg)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Popular</div>
            )}

            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>{p.name}</h3>
            <p style={{ fontSize: 14, color: "#4a5070", marginBottom: 20 }}>{p.desc}</p>

            <div style={{ marginBottom: 24 }}>
              {p.price !== null ? (
                <>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 48, fontWeight: 800 }}>${p.price}</span>
                  <span style={{ fontSize: 15, color: "#4a5070" }}>{p.period}</span>
                </>
              ) : (
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 32, fontWeight: 800 }}>Custom</span>
              )}
            </div>

            <a href={p.href} style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "100%", padding: "13px 20px",
              background: p.popular ? "linear-gradient(135deg, #6366F1, #7C3AED)" : "transparent",
              border: p.popular ? "none" : "1px solid #1e2235",
              borderRadius: 12, color: p.popular ? "#fff" : "#94A3B8",
              fontSize: 15, fontWeight: 600, textDecoration: "none",
              fontFamily: "'DM Sans'", cursor: "pointer",
              marginBottom: 24, boxSizing: "border-box",
              transition: "all 0.2s",
            }}>
              {p.cta}
            </a>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {p.features.map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#94A3B8" }}>
                  <Check />
                  {f}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ mini */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 20px 80px" }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 24, fontWeight: 700, textAlign: "center", marginBottom: 32 }}>Frequently asked questions</h2>
        {[
          ["Can I switch plans anytime?", "Yes! Upgrade or downgrade at any time. Changes take effect immediately."],
          ["Is there a free trial for Pro?", "The Free plan lets you try core features. When you're ready, upgrade to Pro for full access."],
          ["What payment methods do you accept?", "We accept all major credit cards, Apple Pay, and Google Pay through our secure payment partner."],
          ["Can I cancel anytime?", "Absolutely. No lock-in contracts. Cancel your subscription at any time from your account settings."],
        ].map(([q, a], i) => (
          <details key={i} style={{ background: "#0D0F14", border: "1px solid #131520", borderRadius: 12, padding: "16px 20px", marginBottom: 8 }}>
            <summary style={{ fontSize: 15, fontWeight: 600, cursor: "pointer", color: "#E2E8F0", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {q}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a5070" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </summary>
            <p style={{ fontSize: 14, color: "#4a5070", marginTop: 10, lineHeight: 1.6 }}>{a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
