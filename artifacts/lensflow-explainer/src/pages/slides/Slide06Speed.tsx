export default function Slide06Speed() {
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
            width: "22vw",
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
            Speed Comparison
          </h2>
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3vw", fontWeight: 700, color: "#C99A2E" }}>
          LensFlow
        </div>
      </div>

      {/* Main comparison */}
      <div style={{ display: "flex", gap: "3vw", flex: 1 }}>
        {/* Traditional */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column', gap: '3vh' }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85vw", color: "#8892A4", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2vh" }}>
            Traditional Production
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.8vh" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5vw", padding: "1.8vh 2vw", backgroundColor: "#111827", border: "1px solid #1E2A3A" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#8892A4", minWidth: "5vw" }}>Day 1</div>
              <div style={{ fontSize: "1.05vw", color: "#8892A4" }}>Brief & schedule videographer</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5vw", padding: "1.8vh 2vw", backgroundColor: "#111827", border: "1px solid #1E2A3A" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#8892A4", minWidth: "5vw" }}>Day 2–3</div>
              <div style={{ fontSize: "1.05vw", color: "#8892A4" }}>Shoot on-site</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5vw", padding: "1.8vh 2vw", backgroundColor: "#111827", border: "1px solid #1E2A3A" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#8892A4", minWidth: "5vw" }}>Day 4–5</div>
              <div style={{ fontSize: "1.05vw", color: "#8892A4" }}>Edit, colour grade, add music</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5vw", padding: "1.8vh 2vw", backgroundColor: "#111827", border: "1px solid #1E2A3A" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#8892A4", minWidth: "5vw" }}>Day 6–7</div>
              <div style={{ fontSize: "1.05vw", color: "#8892A4" }}>Revisions, approvals, delivery</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5vw", padding: "1.8vh 2vw", backgroundColor: "#111827", border: "1px solid #1E2A3A" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#8892A4", minWidth: "5vw" }}>Day 8</div>
              <div style={{ fontSize: "1.05vw", color: "#8892A4", opacity: 0.5 }}>Listing peak window: already over</div>
            </div>
          </div>
          <div style={{ marginTop: "auto", paddingTop: "2vh", borderTop: "2px solid #1E2A3A" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.8vw", fontWeight: 900, color: "#8892A4", letterSpacing: "-0.03em" }}>5–8 days</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85vw", color: "#8892A4" }}>$1,000–$2,500 per listing</div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: "1px", backgroundColor: "#1E2A3A", alignSelf: "stretch" }} />

        {/* LensFlow */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85vw", color: "#C99A2E", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2vh" }}>
            LensFlow
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.8vh" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5vw", padding: "1.8vh 2vw", backgroundColor: "#111827", border: "1px solid #C99A2E" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#C99A2E", minWidth: "5vw" }}>00:00</div>
              <div style={{ fontSize: "1.05vw", color: "#F0EDE8" }}>Paste listing URL</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5vw", padding: "1.8vh 2vw", backgroundColor: "#111827", border: "1px solid #1E2A3A" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#C99A2E", minWidth: "5vw" }}>00:30</div>
              <div style={{ fontSize: "1.05vw", color: "#F0EDE8" }}>Claude writes the script</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5vw", padding: "1.8vh 2vw", backgroundColor: "#111827", border: "1px solid #1E2A3A" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#C99A2E", minWidth: "5vw" }}>02:00</div>
              <div style={{ fontSize: "1.05vw", color: "#F0EDE8" }}>ElevenLabs voices the narration</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5vw", padding: "1.8vh 2vw", backgroundColor: "#111827", border: "1px solid #1E2A3A" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#C99A2E", minWidth: "5vw" }}>07:00</div>
              <div style={{ fontSize: "1.05vw", color: "#F0EDE8" }}>HeyGen renders the presenter</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5vw", padding: "1.8vh 2vw", backgroundColor: "#C99A2E" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#7A5C14", minWidth: "5vw" }}>10:00</div>
              <div style={{ fontSize: "1.05vw", color: "#0A1020", fontWeight: 700 }}>Branded MP4 ready to share</div>
            </div>
          </div>
          <div style={{ marginTop: "auto", paddingTop: "2vh", borderTop: "2px solid #C99A2E" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.8vw", fontWeight: 900, color: "#C99A2E", letterSpacing: "-0.03em" }}>Under 10 min</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85vw", color: "#C99A2E" }}>$79 / month, unlimited listings</div>
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
          Speed / LensFlow Explainer
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85vw", color: "#C99A2E", fontWeight: 600 }}>
          06
        </div>
      </div>
    </div>
  );
}
