export default function Slide03Cost() {
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
            width: "20vw",
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
            The Real Cost
          </h2>
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3vw", fontWeight: 700, color: "#C99A2E" }}>
          LensFlow
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: "2vw", marginBottom: "4vh" }}>
        {/* Big stat: time */}
        <div style={{ flex: 1, backgroundColor: "#111827", border: "1px solid #1E2A3A", padding: "3.5vh 2.5vw", display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85vw", color: "#C99A2E", marginBottom: "1.5vh" }}>
            Traditional turnaround
          </div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "5.5vw", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em", color: "#F0EDE8" }}>
            5–8
          </div>
          <div style={{ fontSize: "1.4vw", fontWeight: 700, color: "#8892A4", marginTop: "0.8vh" }}>days</div>
          <div style={{ fontSize: "1.05vw", color: "#8892A4", marginTop: "1.5vh", lineHeight: 1.45 }}>
            From briefing to delivered MP4, if nothing goes wrong.
          </div>
        </div>

        {/* Big stat: cost */}
        <div style={{ flex: 1, backgroundColor: "#111827", border: "1px solid #1E2A3A", padding: "3.5vh 2.5vw", display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85vw", color: "#C99A2E", marginBottom: "1.5vh" }}>
            Per-listing cost
          </div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "5.5vw", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em", color: "#F0EDE8" }}>
            $2,500
          </div>
          <div style={{ fontSize: "1.4vw", fontWeight: 700, color: "#8892A4", marginTop: "0.8vh" }}>average</div>
          <div style={{ fontSize: "1.05vw", color: "#8892A4", marginTop: "1.5vh", lineHeight: 1.45 }}>
            Videographer, editor, voice talent, revisions, and rush fees.
          </div>
        </div>

        {/* Big stat: missed window */}
        <div style={{ flex: 1, backgroundColor: "#C99A2E", padding: "3.5vh 2.5vw", display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85vw", color: "#7A5C14", marginBottom: "1.5vh" }}>
            Attention remaining after day 2
          </div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "5.5vw", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em", color: "#0A1020" }}>
            12%
          </div>
          <div style={{ fontSize: "1.4vw", fontWeight: 700, color: "#7A5C14", marginTop: "0.8vh" }}>of peak</div>
          <div style={{ fontSize: "1.05vw", color: "#7A5C14", marginTop: "1.5vh", lineHeight: 1.45 }}>
            By the time a traditional video is ready, 88% of buyer interest has already moved on.
          </div>
        </div>
      </div>

      {/* Comparison bar */}
      <div style={{ display: "flex", gap: "2vw" }}>
        <div style={{ flex: 1, padding: "2.2vh 0", borderTop: "2px solid #1E2A3A" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#8892A4", marginBottom: "1vh" }}>Traditional</div>
          <div style={{ fontSize: "1.15vw", fontWeight: 700, color: "#F0EDE8", marginBottom: "0.8vh" }}>Videographer + Editor</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2vw", fontWeight: 700, color: "#8892A4", letterSpacing: "-0.03em" }}>$1,000–$2,500</div>
        </div>
        <div style={{ flex: 1, padding: "2.2vh 0", borderTop: "2px solid #1E2A3A" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#8892A4", marginBottom: "1vh" }}>DIY Templates</div>
          <div style={{ fontSize: "1.15vw", fontWeight: 700, color: "#F0EDE8", marginBottom: "0.8vh" }}>Canva / slideshow tools</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2vw", fontWeight: 700, color: "#8892A4", letterSpacing: "-0.03em" }}>Low quality</div>
        </div>
        <div style={{ flex: 1, padding: "2.2vh 0", borderTop: "2px solid #C99A2E" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#C99A2E", marginBottom: "1vh" }}>LensFlow</div>
          <div style={{ fontSize: "1.15vw", fontWeight: 700, color: "#F0EDE8", marginBottom: "0.8vh" }}>AI presenter video</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2vw", fontWeight: 700, color: "#C99A2E", letterSpacing: "-0.03em" }}>$79 / month</div>
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
          The Real Cost / LensFlow Explainer
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85vw", color: "#C99A2E", fontWeight: 600 }}>
          03
        </div>
      </div>
    </div>
  );
}
