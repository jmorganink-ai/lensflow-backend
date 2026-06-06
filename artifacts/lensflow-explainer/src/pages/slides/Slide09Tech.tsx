export default function Slide09Tech() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#0A1020",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        boxSizing: "border-box",
        padding: "5vh 5vw",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6vh" }}>
        <div style={{ position: "relative" }}>
          <div style={{
            position: "absolute",
            left: "-1vw",
            top: "1.5vh",
            width: "13vw",
            height: "3vh",
            backgroundColor: "#C99A2E",
            opacity: 0.15,
            zIndex: 0,
          }} />
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "3.2vw",
            fontWeight: 900,
            color: "#F0EDE8",
            margin: 0,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            position: "relative",
            zIndex: 1,
          }}>
            Built On
          </h2>
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3vw", fontWeight: 700, color: "#C99A2E" }}>
          LensFlow
        </div>
      </div>

      {/* Content: left description + right tech stack */}
      <div style={{ display: "flex", gap: "5vw", flex: 1 }}>
        {/* Left */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "3.5vh" }}>
          <p style={{ fontSize: "1.7vw", fontWeight: 500, color: "#8892A4", lineHeight: 1.55, margin: 0 }}>
            LensFlow connects four best-in-class AI platforms into a single automated pipeline — no stitching, no manual handoffs.
          </p>
          <div style={{ width: "100%", height: "1px", backgroundColor: "#1E2A3A" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "2.8vh" }}>
            <div style={{ display: "flex", gap: "2vw" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.1vw", color: "#C99A2E", fontWeight: 600, minWidth: "2.5vw" }}>01</div>
              <div>
                <h3 style={{ fontSize: "1.3vw", fontWeight: 700, color: "#F0EDE8", margin: "0 0 0.6vh 0" }}>Fully automated end-to-end</h3>
                <p style={{ fontSize: "1.05vw", color: "#8892A4", lineHeight: 1.5, margin: 0 }}>
                  From URL to MP4 without a single human touchpoint. Every step is monitored and retried on failure.
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "2vw" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.1vw", color: "#C99A2E", fontWeight: 600, minWidth: "2.5vw" }}>02</div>
              <div>
                <h3 style={{ fontSize: "1.3vw", fontWeight: 700, color: "#F0EDE8", margin: "0 0 0.6vh 0" }}>Property-specific context</h3>
                <p style={{ fontSize: "1.05vw", color: "#8892A4", lineHeight: 1.5, margin: 0 }}>
                  URL metadata — suburb, type, beds, baths — feeds directly into Claude's prompt for a tailored script every time.
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "2vw" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.1vw", color: "#C99A2E", fontWeight: 600, minWidth: "2.5vw" }}>03</div>
              <div>
                <h3 style={{ fontSize: "1.3vw", fontWeight: 700, color: "#F0EDE8", margin: "0 0 0.6vh 0" }}>API-first architecture</h3>
                <p style={{ fontSize: "1.05vw", color: "#8892A4", lineHeight: 1.5, margin: 0 }}>
                  Webhooks and REST API let enterprise teams embed LensFlow directly into their existing CRM and listing workflows.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: tech stack boxes */}
        <div style={{ flex: 0.85, display: "flex", flexDirection: "column", gap: "2vh' }}>
          <div style={{ flex: 1, backgroundColor: "#111827", border: "1px solid #1E2A3A", padding: "2.5vh 2.5vw", display: "flex", flexDirection: "column", gap: "0.8vh", marginBottom: "1.8vh" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75vw", color: "#C99A2E" }}>Script</div>
            <div style={{ fontSize: "1.4vw", fontWeight: 700, color: "#F0EDE8" }}>Anthropic Claude</div>
            <div style={{ fontSize: "0.95vw", color: "#8892A4" }}>claude-sonnet-4-5 — property-tailored 90-second scripts</div>
          </div>
          <div style={{ flex: 1, backgroundColor: "#111827", border: "1px solid #1E2A3A", padding: "2.5vh 2.5vw", display: "flex", flexDirection: "column", gap: "0.8vh", marginBottom: "1.8vh" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75vw", color: "#C99A2E" }}>Voice</div>
            <div style={{ fontSize: "1.4vw", fontWeight: 700, color: "#F0EDE8" }}>ElevenLabs</div>
            <div style={{ fontSize: "0.95vw", color: "#8892A4" }}>Neural text-to-speech — Mia, Oliver, Sophie, James</div>
          </div>
          <div style={{ flex: 1, backgroundColor: "#111827", border: "1px solid #1E2A3A", padding: "2.5vh 2.5vw", display: "flex", flexDirection: "column", gap: "0.8vh", marginBottom: "1.8vh" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75vw", color: "#C99A2E" }}>Avatar</div>
            <div style={{ fontSize: "1.4vw", fontWeight: 700, color: "#F0EDE8" }}>HeyGen</div>
            <div style={{ fontSize: "0.95vw", color: "#8892A4" }}>Photorealistic lip-sync AI avatar rendering</div>
          </div>
          <div style={{ flex: 1, backgroundColor: "#C99A2E", padding: "2.5vh 2.5vw", display: "flex", flexDirection: "column", gap: "0.8vh" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75vw", color: "#7A5C14" }}>Compose</div>
            <div style={{ fontSize: "1.4vw", fontWeight: 700, color: "#0A1020" }}>Shotstack</div>
            <div style={{ fontSize: "0.95vw", color: "#5C4210" }}>Branded MP4 composition with overlays and outro</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: "absolute",
        bottom: "5vh",
        left: "5vw",
        right: "5vw",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid #1E2A3A",
        paddingTop: "2vh",
      }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85vw", color: "#8892A4" }}>
          Technology / LensFlow Explainer
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85vw", color: "#C99A2E", fontWeight: 600 }}>
          09
        </div>
      </div>
    </div>
  );
}
