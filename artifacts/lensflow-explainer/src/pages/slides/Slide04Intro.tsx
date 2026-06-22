export default function Slide04Intro() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#C99A2E",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        boxSizing: "border-box",
        padding: "5vh 5vw",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10vh" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5vw", fontWeight: 900, color: "#0A1020", letterSpacing: "-0.01em" }}>
          LensFlow
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85vw", color: "#7A5C14" }}>
          Introducing the solution
        </div>
      </div>

      {/* Content */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", flex: 1, justifyContent: "center" }}>
        <div style={{ position: "relative", marginBottom: "5vh" }}>
          <div style={{
            position: "absolute",
            left: "-1.5vw",
            top: "3vh",
            width: "28vw",
            height: "7vh",
            backgroundColor: "#0A1020",
            opacity: 0.08,
            zIndex: 0,
          }} />
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "6.5vw",
            fontWeight: 900,
            color: "#0A1020",
            margin: 0,
            lineHeight: 1.0,
            letterSpacing: "-0.04em",
            position: "relative",
            zIndex: 1,
          }}>
            Paste a URL.
          </h2>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "6.5vw",
            fontWeight: 900,
            color: "#0A1020",
            margin: 0,
            lineHeight: 1.0,
            letterSpacing: "-0.04em",
            position: "relative",
            zIndex: 1,
            opacity: 0.55,
          }}>
            Get a video.
          </h2>
        </div>

        <p style={{
          fontSize: "1.8vw",
          fontWeight: 500,
          color: "#5C4210",
          lineHeight: 1.5,
          margin: 0,
          maxWidth: "55vw",
        }}>
          LensFlow reads any property listing URL, writes a property-specific script with Claude AI, synthesises a natural voiceover with ElevenLabs, and renders a professional AI presenter video — in under 10 minutes.
        </p>

        <div style={{
          display: "flex",
          gap: "3vw",
          marginTop: "6vh",
          alignItems: "center",
        }}>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.5vw", fontWeight: 900, color: "#0A1020", letterSpacing: "-0.04em" }}>10 min</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.9vw", color: "#7A5C14" }}>per listing</div>
          </div>
          <div style={{ width: "1px", height: "8vh", backgroundColor: "#0A1020", opacity: 0.2 }} />
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.5vw", fontWeight: 900, color: "#0A1020", letterSpacing: "-0.04em" }}>$79</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.9vw", color: "#7A5C14" }}>per month, unlimited</div>
          </div>
          <div style={{ width: "1px", height: "8vh", backgroundColor: "#0A1020", opacity: 0.2 }} />
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.5vw", fontWeight: 900, color: "#0A1020", letterSpacing: "-0.04em" }}>1 click</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.9vw", color: "#7A5C14" }}>no production team</div>
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
        borderTop: "1px solid rgba(10,16,32,0.2)",
        paddingTop: "2vh",
      }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85vw", color: "#7A5C14" }}>
          The Solution / LensFlow Explainer
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85vw", color: "#0A1020", fontWeight: 600 }}>
          04
        </div>
      </div>
    </div>
  );
}
