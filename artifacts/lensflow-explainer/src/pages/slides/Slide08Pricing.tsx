export default function Slide08Pricing() {
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "5vh" }}>
        <div style={{ position: "relative" }}>
          <div style={{
            position: "absolute",
            left: "-1vw",
            top: "1.5vh",
            width: "8vw",
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
            Pricing
          </h2>
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3vw", fontWeight: 700, color: "#C99A2E" }}>
          LensFlow
        </div>
      </div>

      <p style={{ fontSize: "1.35vw", color: "#8892A4", margin: "0 0 4vh 0", maxWidth: "55vw", lineHeight: 1.5 }}>
        One flat monthly subscription. No per-video fees, no hidden costs, no lock-in.
      </p>

      {/* Pricing cards */}
      <div style={{ display: "flex", gap: "2vw", flex: 1 }}>

        {/* Starter */}
        <div style={{ flex: 1, backgroundColor: "#111827", border: "1px solid #1E2A3A", padding: "4vh 2.5vw", display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#8892A4", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2vh" }}>
            Starter
          </div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "4.5vw", fontWeight: 900, color: "#F0EDE8", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: "0.5vh" }}>
            $79
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#8892A4", marginBottom: "3.5vh" }}>per month</div>
          <div style={{ width: "100%", height: "1px", backgroundColor: "#1E2A3A", marginBottom: "3vh" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "1.8vh", flex: 1 }}>
            <div style={{ display: "flex", gap: "1vw" }}>
              <div style={{ color: "#C99A2E", fontSize: "1vw", lineHeight: 1 }}>—</div>
              <div style={{ fontSize: "1vw", color: "#8892A4", lineHeight: 1.4 }}>5 AI videos / month</div>
            </div>
            <div style={{ display: "flex", gap: "1vw" }}>
              <div style={{ color: "#C99A2E", fontSize: "1vw", lineHeight: 1 }}>—</div>
              <div style={{ fontSize: "1vw", color: "#8892A4", lineHeight: 1.4 }}>All 4 presenters</div>
            </div>
            <div style={{ display: "flex", gap: "1vw" }}>
              <div style={{ color: "#C99A2E", fontSize: "1vw", lineHeight: 1 }}>—</div>
              <div style={{ fontSize: "1vw", color: "#8892A4", lineHeight: 1.4 }}>Script + voiceover download</div>
            </div>
            <div style={{ display: "flex", gap: "1vw" }}>
              <div style={{ color: "#C99A2E", fontSize: "1vw", lineHeight: 1 }}>—</div>
              <div style={{ fontSize: "1vw", color: "#8892A4", lineHeight: 1.4 }}>Standard support</div>
            </div>
          </div>
          <div style={{ marginTop: "auto", paddingTop: "3vh" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#8892A4" }}>Solo agents</div>
          </div>
        </div>

        {/* Elite — highlighted */}
        <div style={{ flex: 1, backgroundColor: "#C99A2E", padding: "4vh 2.5vw", display: "flex", flexDirection: "column", position: "relative' }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#7A5C14", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2vh" }}>
            Elite
          </div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "4.5vw", fontWeight: 900, color: "#0A1020", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: "0.5vh" }}>
            $199
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#7A5C14", marginBottom: "3.5vh" }}>per month</div>
          <div style={{ width: "100%", height: "1px", backgroundColor: "rgba(10,16,32,0.2)", marginBottom: "3vh" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "1.8vh", flex: 1 }}>
            <div style={{ display: "flex", gap: "1vw" }}>
              <div style={{ color: "#7A5C14", fontSize: "1vw", lineHeight: 1 }}>—</div>
              <div style={{ fontSize: "1vw", color: "#5C4210", lineHeight: 1.4 }}>Unlimited videos</div>
            </div>
            <div style={{ display: "flex", gap: "1vw" }}>
              <div style={{ color: "#7A5C14", fontSize: "1vw", lineHeight: 1 }}>—</div>
              <div style={{ fontSize: "1vw", color: "#5C4210", lineHeight: 1.4 }}>Custom branding overlay</div>
            </div>
            <div style={{ display: "flex", gap: "1vw" }}>
              <div style={{ color: "#7A5C14", fontSize: "1vw", lineHeight: 1 }}>—</div>
              <div style={{ fontSize: "1vw", color: "#5C4210", lineHeight: 1.4 }}>API access + webhooks</div>
            </div>
            <div style={{ display: "flex", gap: "1vw" }}>
              <div style={{ color: "#7A5C14", fontSize: "1vw", lineHeight: 1 }}>—</div>
              <div style={{ fontSize: "1vw", color: "#5C4210", lineHeight: 1.4 }}>Priority support</div>
            </div>
            <div style={{ display: "flex", gap: "1vw" }}>
              <div style={{ color: "#7A5C14", fontSize: "1vw", lineHeight: 1 }}>—</div>
              <div style={{ fontSize: "1vw", color: "#5C4210", lineHeight: 1.4 }}>Social media cut-downs</div>
            </div>
          </div>
          <div style={{ marginTop: "auto", paddingTop: "3vh" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#7A5C14" }}>Growing agencies</div>
          </div>
        </div>

        {/* Concierge */}
        <div style={{ flex: 1, backgroundColor: "#111827", border: "1px solid #1E2A3A", padding: "4vh 2.5vw", display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#8892A4", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2vh" }}>
            Concierge
          </div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "4.5vw", fontWeight: 900, color: "#F0EDE8", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: "0.5vh" }}>
            $399
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#8892A4", marginBottom: "3.5vh" }}>per month</div>
          <div style={{ width: "100%", height: "1px", backgroundColor: "#1E2A3A", marginBottom: "3vh" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "1.8vh", flex: 1 }}>
            <div style={{ display: "flex", gap: "1vw" }}>
              <div style={{ color: "#C99A2E", fontSize: "1vw", lineHeight: 1 }}>—</div>
              <div style={{ fontSize: "1vw", color: "#8892A4", lineHeight: 1.4 }}>Everything in Elite</div>
            </div>
            <div style={{ display: "flex", gap: "1vw" }}>
              <div style={{ color: "#C99A2E", fontSize: "1vw", lineHeight: 1 }}>—</div>
              <div style={{ fontSize: "1vw", color: "#8892A4", lineHeight: 1.4 }}>Dedicated account manager</div>
            </div>
            <div style={{ display: "flex", gap: "1vw" }}>
              <div style={{ color: "#C99A2E", fontSize: "1vw", lineHeight: 1 }}>—</div>
              <div style={{ fontSize: "1vw", color: "#8892A4", lineHeight: 1.4 }}>Custom presenter avatar</div>
            </div>
            <div style={{ display: "flex", gap: "1vw" }}>
              <div style={{ color: "#C99A2E", fontSize: "1vw", lineHeight: 1 }}>—</div>
              <div style={{ fontSize: "1vw", color: "#8892A4", lineHeight: 1.4 }}>CRM integration + white-label</div>
            </div>
          </div>
          <div style={{ marginTop: "auto", paddingTop: "3vh" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#8892A4" }}>Enterprise teams</div>
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
          Pricing / LensFlow Explainer
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85vw", color: "#C99A2E", fontWeight: 600 }}>
          08
        </div>
      </div>
    </div>
  );
}
