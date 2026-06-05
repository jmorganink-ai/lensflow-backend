export function V3Cosmic() {
  return (
    <div style={{ margin: 0, color: "#f2ecdf", background: "#0a0d1a", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif", minHeight: "100vh" }}>

      {/* ── Topbar ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, padding: "16px 24px", borderBottom: "1px solid #1a213a" }}>
        <div>
          <div style={{ color: "#8f99b2", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Dashboard</div>
          <div style={{ color: "#f9f3ea", fontSize: 22, fontWeight: 800, marginTop: 2 }}>Create Campaign is the main event</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", border: "1px solid #1a213a", borderRadius: 8, background: "rgba(13,17,32,0.9)" }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg,#1a1f3a,#c99a2e)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, color: "white" }}>M</div>
          <div>
            <div style={{ color: "#f9f3ea", fontSize: 13, fontWeight: 700 }}>AI Presenter Ready</div>
            <div style={{ color: "#c99a2e", fontSize: 12, fontWeight: 700 }}>Mia selected</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 24px", maxWidth: 1220, margin: "0 auto" }}>

        {/* ── Hero ── */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 360px", gap: 22, marginBottom: 20 }}>

          {/* Left: property photo with text overlay */}
          <div style={{
            minHeight: 310,
            padding: 34,
            borderRadius: 8,
            color: "white",
            background: "linear-gradient(90deg, rgba(10,13,26,0.92), rgba(10,13,26,0.48)), url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=82') center / cover",
            display: "flex",
            flexDirection: "column" as const,
            justifyContent: "flex-end",
            boxShadow: "0 18px 45px rgba(0,0,0,0.12)"
          }}>
            <h1 style={{ margin: "0 0 12px", fontSize: "clamp(34px,5vw,58px)", lineHeight: 0.98, letterSpacing: 0, fontWeight: 900 }}>
              Create Luxury Property Campaigns in Minutes
            </h1>
            <p style={{ maxWidth: 620, margin: 0, color: "rgba(255,255,255,0.82)", fontSize: 17, lineHeight: 1.5 }}>
              Turn listings, photos and videos into AI-powered marketing campaigns, social reels and property presentations.
            </p>
          </div>

          {/* Right: launcher panel */}
          <div style={{ padding: 22, borderRadius: 8, background: "#0d1120", border: "1px solid #1a213a", boxShadow: "0 18px 45px rgba(0,0,0,0.12)" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#8d6c20", fontSize: 12, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: 1 }}>
              <div style={{ width: 24, height: 2, background: "#c99a2e" }} />
              Start New Campaign
            </div>
            <h2 style={{ margin: "8px 0 14px", color: "#f9f3ea", fontSize: 24, lineHeight: 1.12, fontWeight: 800 }}>Generate Property Campaign</h2>
            <div style={{ display: "grid", gap: 8, margin: "16px 0" }}>
              <label style={{ color: "#8f99b2", fontSize: 12, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: 0.5 }}>Property URL</label>
              <input
                defaultValue="https://domain.com.au/28-harbour-view"
                style={{ width: "100%", border: "1px solid #1a213a", borderRadius: 8, padding: "12px 14px", background: "#10162a", color: "#f9f3ea", outline: "none", fontSize: 14, boxSizing: "border-box" as const }}
              />
            </div>
            <button style={{
              width: "100%", border: 0, borderRadius: 8, padding: "14px 18px", color: "white",
              background: "linear-gradient(135deg, #dfb44d, #c99a2e 48%, #8d6c20)",
              fontWeight: 800, cursor: "pointer", fontSize: 15,
              boxShadow: "0 14px 28px rgba(143,103,29,0.22)"
            }}>
              Generate Property Campaign
            </button>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
              {[
                { tag: "URL", label: "Property URL" },
                { tag: "IMG", label: "Upload Photos" },
                { tag: "VID", label: "Upload Video" },
                { tag: "REC", label: "Record with Teleprompter" },
              ].map(({ tag, label }) => (
                <div key={tag} style={{ minHeight: 72, border: "1px solid #1a213a", borderRadius: 8, background: "#10162a", padding: 12, display: "flex", flexDirection: "column" as const, justifyContent: "space-between" }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: "#151b31", color: "#8d6c20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900 }}>{tag}</div>
                  <strong style={{ color: "#f9f3ea", fontSize: 13 }}>{label}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Metrics ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 14, marginBottom: 20 }}>
          {[
            { val: "24", label: "Campaigns Created" },
            { val: "18", label: "Listings Processed" },
            { val: "46h", label: "Time Saved" },
            { val: "128k", label: "Estimated Reach" },
          ].map(({ val, label }) => (
            <div key={label} style={{ padding: 18, border: "1px solid #1a213a", borderRadius: 8, background: "rgba(13,17,32,0.92)" }}>
              <strong style={{ display: "block", color: "#f9f3ea", fontSize: 30, lineHeight: 1, marginBottom: 8 }}>{val}</strong>
              <span style={{ color: "#8f99b2", fontSize: 13, fontWeight: 700 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* ── Main grid: campaigns + sidebar ── */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.4fr) minmax(300px,0.6fr)", gap: 20, alignItems: "start" }}>

          {/* Left: campaign cards + market intelligence */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, marginBottom: 14 }}>
              <div>
                <h2 style={{ color: "#f9f3ea", margin: "0 0 4px", fontSize: 22, fontWeight: 800 }}>Recent Campaigns</h2>
                <p style={{ margin: 0, color: "#8f99b2", fontSize: 13, lineHeight: 1.45 }}>Show finished marketing outcomes, not backend jobs.</p>
              </div>
              <button style={{ border: "1px solid #1a213a", borderRadius: 8, padding: "9px 14px", background: "#10162a", color: "#f2ecdf", fontWeight: 700, cursor: "pointer", fontSize: 13, whiteSpace: "nowrap" as const }}>
                View All
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 14, marginBottom: 24 }}>
              {[
                {
                  img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=82",
                  status: "READY", statusColor: "#c99a2e",
                  title: "28 Harbour View, Mosman",
                  tags: ["Reel", "Script", "Voiceover", "Deck"]
                },
                {
                  img: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=900&q=82",
                  status: "EXPORTING", statusColor: "#1269cf",
                  title: "11 Ocean Road, Byron Bay",
                  tags: ["Reel", "Captions", "Mia"]
                },
                {
                  img: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=900&q=82",
                  status: "LIVE", statusColor: "#34d399",
                  title: "7 Palm Court, Noosa",
                  tags: ["Oliver", "Voiceover", "Social Pack"]
                },
              ].map((c, i) => (
                <article key={i} style={{ border: "1px solid #1a213a", borderRadius: 8, overflow: "hidden", background: "#0d1120" }}>
                  <div style={{ aspectRatio: "16/10", backgroundImage: `url('${c.img}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
                  <div style={{ padding: 14 }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 7, color: c.statusColor, fontSize: 12, fontWeight: 850, textTransform: "uppercase" as const, marginBottom: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.statusColor }} />
                      {c.status}
                    </div>
                    <h3 style={{ color: "#f9f3ea", margin: "0 0 10px", fontSize: 16, lineHeight: 1.2, fontWeight: 700 }}>{c.title}</h3>
                    <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, marginBottom: 12 }}>
                      {c.tags.map(t => (
                        <span key={t} style={{ display: "inline-flex", border: "1px solid #1a213a", borderRadius: 999, padding: "4px 9px", background: "#10162a", color: "#8f99b2", fontSize: 12, fontWeight: 700 }}>{t}</span>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={{ flex: 1, border: "1px solid #1a213a", background: "#10162a", borderRadius: 8, padding: "8px 6px", color: "#f2ecdf", fontWeight: 800, cursor: "pointer", fontSize: 12 }}>View Campaign</button>
                      <button style={{ flex: 1, border: "1px solid #1a213a", background: "#10162a", borderRadius: 8, padding: "8px 6px", color: "#f2ecdf", fontWeight: 800, cursor: "pointer", fontSize: 12 }}>Duplicate</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Market Intelligence */}
            <div>
              <div style={{ marginBottom: 12 }}>
                <h2 style={{ color: "#f9f3ea", margin: "0 0 4px", fontSize: 22, fontWeight: 800 }}>Market Intelligence</h2>
                <p style={{ margin: 0, color: "#8f99b2", fontSize: 13 }}>Helpful context, lower on the page after campaign creation.</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                {[
                  { label: "AU Market Brief", val: "Prestige buyer demand is strongest in coastal suburbs." },
                  { label: "Listing Angle", val: "Lead with lifestyle, privacy and indoor-outdoor living." },
                  { label: "Content Tip", val: "Short reels should open with the hero facade or view." },
                ].map(({ label, val }) => (
                  <div key={label} style={{ padding: 14, borderRadius: 8, background: "#10162a", border: "1px solid #1a213a" }}>
                    <span style={{ color: "#8f99b2", fontSize: 12, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: 0.5 }}>{label}</span>
                    <strong style={{ display: "block", marginTop: 8, color: "#f9f3ea", fontSize: 15, fontWeight: 700, lineHeight: 1.35 }}>{val}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div style={{ display: "grid", gap: 20 }}>

            {/* Presenter panel */}
            <div style={{ border: "1px solid #1a213a", borderRadius: 8, background: "#0d1120", padding: 18 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#8d6c20", fontSize: 12, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 14 }}>
                <div style={{ width: 24, height: 2, background: "#c99a2e" }} />
                AI Presenter Ready
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "82px minmax(0,1fr)", gap: 14, alignItems: "center" }}>
                <div style={{
                  width: 82, height: 92, borderRadius: 8, overflow: "hidden",
                  background: "linear-gradient(135deg, #1a1f3a 0%, #2a1f3a 50%, #c99a2e 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 32, fontWeight: 900, color: "#dfb44d"
                }}>M</div>
                <div>
                  <h3 style={{ color: "#f9f3ea", margin: "0 0 6px", fontSize: 18, fontWeight: 800 }}>Mia</h3>
                  <p style={{ margin: 0, color: "#8f99b2", lineHeight: 1.4, fontSize: 13 }}>
                    Polished, warm and premium. Best for luxury homes and prestige brand campaigns.
                  </p>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14 }}>
                <button style={{ border: 0, borderRadius: 8, padding: 10, background: "#c99a2e", color: "white", fontWeight: 800, cursor: "pointer", fontSize: 14 }}>Mia</button>
                <button style={{ border: "1px solid #1a213a", borderRadius: 8, padding: 10, background: "#10162a", color: "#f2ecdf", fontWeight: 800, cursor: "pointer", fontSize: 14 }}>Oliver</button>
              </div>
            </div>

            {/* Value panel */}
            <div style={{ border: "1px solid #1a213a", borderRadius: 8, background: "#0d1120", padding: 18 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#8d6c20", fontSize: 12, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 12 }}>
                <div style={{ width: 24, height: 2, background: "#c99a2e" }} />
                Estimated Marketing Value
              </div>
              <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
                {[
                  { label: "Script Creation", val: "$50" },
                  { label: "Voiceover", val: "$75" },
                  { label: "Video Editing", val: "$250" },
                  { label: "Social Media Package", val: "$150" },
                ].map(({ label, val }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", color: "#8f99b2", paddingBottom: 9, borderBottom: "1px solid #1a213a" }}>
                    <span style={{ fontSize: 14 }}>{label}</span>
                    <strong style={{ color: "#f9f3ea", fontWeight: 800 }}>{val}</strong>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 14, color: "#f9f3ea" }}>
                <span style={{ fontSize: 14, color: "#8f99b2" }}>Total Created Today</span>
                <strong style={{ fontSize: 34, fontWeight: 900, color: "#f9f3ea" }}>$525</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
