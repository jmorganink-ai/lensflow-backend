const base = import.meta.env.BASE_URL;

export default function Slide01Title() {
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
      }}
    >
      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6vw", fontWeight: 900, color: "#C99A2E", letterSpacing: "-0.01em" }}>
          LensFlow
        </div>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.85vw",
          color: "#8892A4",
          display: "flex",
          flexDirection: "column",
          gap: "0.8vh",
          textAlign: "right"
        }}>
          <div><span style={{ color: "#C99A2E", marginRight: "0.8vw" }}>Product:</span>AI Video Pipeline</div>
          <div><span style={{ color: "#C99A2E", marginRight: "0.8vw" }}>Market:</span>Real Estate</div>
          <div><span style={{ color: "#C99A2E", marginRight: "0.8vw" }}>Year:</span>2026</div>
        </div>
      </div>

      {/* Decorative gold line left edge */}
      <div style={{
        position: "absolute",
        left: "5vw",
        top: "20vh",
        width: "2px",
        height: "40vh",
        backgroundColor: "#C99A2E",
        opacity: 0.4,
      }} />

      {/* Main title block */}
      <div style={{ position: "absolute", bottom: "14vh", left: "5vw", width: "90vw" }}>
        <div style={{ position: "relative" }}>
          <div style={{
            position: "absolute",
            left: "-1vw",
            top: "3vh",
            width: "32vw",
            height: "6vh",
            backgroundColor: "#C99A2E",
            opacity: 0.12,
            zIndex: 0,
          }} />
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "7.5vw",
            fontWeight: 900,
            color: "#F0EDE8",
            margin: 0,
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            position: "relative",
            zIndex: 1,
          }}>
            Your Listing
          </h1>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "7.5vw",
            fontWeight: 900,
            color: "#C99A2E",
            margin: 0,
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            position: "relative",
            zIndex: 1,
          }}>
            Goes Live Today.
          </h1>
        </div>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginTop: "4vh",
        }}>
          <p style={{
            fontSize: "1.8vw",
            fontWeight: 500,
            color: "#8892A4",
            margin: 0,
            maxWidth: "52vw",
            lineHeight: 1.45,
          }}>
            The 48-hour listing window is closing. Your video should already be there.
          </p>
          <div style={{ width: "28vw", height: "1px", backgroundColor: "#C99A2E", opacity: 0.35 }} />
        </div>
      </div>
    </div>
  );
}
