export default function Slide02Problem() {
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "7vh" }}>
        <div style={{ position: "relative" }}>
          <div style={{
            position: "absolute",
            left: "-1vw",
            top: "1.5vh",
            width: "16vw",
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
            The Problem
          </h2>
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3vw", fontWeight: 700, color: "#C99A2E" }}>
          LensFlow
        </div>
      </div>

      {/* Content */}
      <div style={{ display: "flex", gap: "4vw", flex: 1 }}>
        {/* Left: key statement */}
        <div style={{ flex: 1.2, display: "flex", flexDirection: "column", gap: "3.5vh" }}>
          <p style={{ fontSize: "1.7vw", fontWeight: 500, color: "#8892A4", lineHeight: 1.55, margin: 0 }}>
            Real estate moves fast. When a listing goes live, buyer attention peaks in the first 48 hours — then drops off a cliff.
          </p>
          <div style={{ width: "100%", height: "1px", backgroundColor: "#1E2A3A" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "2.8vh" }}>
            <div style={{ display: "flex", gap: "2vw" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.1vw", color: "#C99A2E", fontWeight: 600, minWidth: "2.5vw" }}>01</div>
              <div>
                <h3 style={{ fontSize: "1.35vw", fontWeight: 700, color: "#F0EDE8", margin: "0 0 0.8vh 0" }}>Video isn't optional any more</h3>
                <p style={{ fontSize: "1.1vw", color: "#8892A4", lineHeight: 1.5, margin: 0 }}>
                  Listings with professional video receive 403% more enquiries than those without.
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "2vw" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.1vw", color: "#C99A2E", fontWeight: 600, minWidth: "2.5vw" }}>02</div>
              <div>
                <h3 style={{ fontSize: "1.35vw", fontWeight: 700, color: "#F0EDE8", margin: "0 0 0.8vh 0" }}>Traditional production misses the window</h3>
                <p style={{ fontSize: "1.1vw", color: "#8892A4", lineHeight: 1.5, margin: 0 }}>
                  Scheduling a videographer, editing, and delivery takes 5–8 days. The peak window is long gone.
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "2vw" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.1vw", color: "#C99A2E", fontWeight: 600, minWidth: "2.5vw" }}>03</div>
              <div>
                <h3 style={{ fontSize: "1.35vw", fontWeight: 700, color: "#F0EDE8", margin: "0 0 0.8vh 0" }}>Agents lose deals they never knew they lost</h3>
                <p style={{ fontSize: "1.1vw", color: "#8892A4", lineHeight: 1.5, margin: 0 }}>
                  Buyers who scroll past a text-only listing rarely return. The first impression is the only impression.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: pull quote box */}
        <div style={{ flex: 0.8, backgroundColor: "#111827", border: "1px solid #1E2A3A", padding: "4vh 3vw", display: "flex", flexDirection: "column" }}>
          <h4 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85vw", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "#C99A2E", margin: "0 0 3vh 0" }}>
            The Window
          </h4>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "2vw", fontWeight: 700, color: "#F0EDE8", lineHeight: 1.25, margin: "0 0 4vh 0", letterSpacing: "-0.01em" }}>
            "48 hours. That's how long buyers are paying full attention. Miss it and the listing goes stale."
          </p>
          <div style={{ marginTop: "auto" }}>
            <div style={{ width: "100%", height: "1px", backgroundColor: "#1E2A3A", marginBottom: "2.5vh" }} />
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.9vw", color: "#8892A4" }}>
              Industry research · 2024
            </div>
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
          The Problem / LensFlow Explainer
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85vw", color: "#C99A2E", fontWeight: 600 }}>
          02
        </div>
      </div>
    </div>
  );
}
