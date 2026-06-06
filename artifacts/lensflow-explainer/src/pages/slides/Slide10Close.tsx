export default function Slide10Close() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#080E1A",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        boxSizing: "border-box",
        padding: "5vh 5vw",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12vh" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5vw", fontWeight: 900, color: "#C99A2E", letterSpacing: "-0.01em" }}>
          LensFlow
        </div>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.85vw",
          color: "#8892A4",
          display: "flex",
          gap: "3vw",
        }}>
          <div>lensflow.ai</div>
          <div>hello@lensflow.ai</div>
        </div>
      </div>

      {/* Main message */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", flex: 1, justifyContent: "center" }}>
        <div style={{ position: "relative", marginBottom: "5vh" }}>
          <div style={{
            position: "absolute",
            left: "-1.5vw",
            top: "4vh",
            width: "35vw",
            height: "8vh",
            backgroundColor: "#C99A2E",
            opacity: 0.1,
            zIndex: 0,
          }} />
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "6vw",
            fontWeight: 900,
            color: "#F0EDE8",
            margin: "0",
            lineHeight: 1.0,
            letterSpacing: "-0.04em",
            position: "relative",
            zIndex: 1,
          }}>
            The window is open.
          </h2>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "6vw",
            fontWeight: 900,
            color: "#C99A2E",
            margin: "0",
            lineHeight: 1.0,
            letterSpacing: "-0.04em",
            position: "relative",
            zIndex: 1,
          }}>
            Your video is ready.
          </h2>
        </div>

        <p style={{
          fontSize: "1.7vw",
          fontWeight: 400,
          color: "#8892A4",
          lineHeight: 1.5,
          margin: "0 0 6vh 0",
          maxWidth: "52vw",
        }}>
          Start your first listing video in under 10 minutes. No production team, no scheduling, no waiting.
        </p>

        <div style={{ display: "flex", gap: "4vw", alignItems: "center' }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.8vw", fontWeight: 900, color: "#F0EDE8", letterSpacing: "-0.03em" }}>14-day</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85vw", color: "#8892A4" }}>free trial</div>
          </div>
          <div style={{ width: "1px", height: "7vh", backgroundColor: "#1E2A3A" }} />
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.8vw", fontWeight: 900, color: "#F0EDE8", letterSpacing: "-0.03em" }}>No</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85vw", color: "#8892A4" }}>credit card required</div>
          </div>
          <div style={{ width: "1px", height: "7vh", backgroundColor: "#1E2A3A" }} />
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.8vw", fontWeight: 900, color: "#F0EDE8", letterSpacing: "-0.03em" }}>Cancel</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85vw", color: "#8892A4" }}>anytime</div>
          </div>
        </div>
      </div>

      {/* Decorative gold rule */}
      <div style={{
        position: "absolute",
        right: "5vw",
        top: "15vh",
        width: "1px",
        height: "50vh",
        backgroundColor: "#C99A2E",
        opacity: 0.25,
      }} />

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
          LensFlow / AI Real Estate Video Pipeline
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85vw", color: "#C99A2E", fontWeight: 600 }}>
          10
        </div>
      </div>
    </div>
  );
}
