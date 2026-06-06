const base = import.meta.env.BASE_URL;

export default function Slide07Presenters() {
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
        padding: "5vh 5vw 9vh 5vw",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "3vh" }}>
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
            The Presenters
          </h2>
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3vw", fontWeight: 700, color: "#C99A2E" }}>
          LensFlow
        </div>
      </div>

      <p style={{ fontSize: "1.2vw", color: "#8892A4", margin: "0 0 3vh 0", maxWidth: "60vw", lineHeight: 1.5 }}>
        Choose the presenter that fits the property — and your brand. Every voice is distinct, every avatar professional.
      </p>

      {/* Presenter cards — equal flex, fixed image height */}
      <div style={{ display: "flex", gap: "1.8vw", flex: 1, minHeight: 0 }}>

        {/* Mia */}
        <div style={{ flex: 1, backgroundColor: "#111827", border: "1px solid #1E2A3A", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ height: "28vh", flexShrink: 0, overflow: "hidden", position: "relative" }}>
            <img
              src={`${base}mia-poster.jpg`}
              crossOrigin="anonymous"
              alt="Mia"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 15%" }}
            />
          </div>
          <div style={{ padding: "2vh 1.5vw", flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1vh" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.7vw", fontWeight: 700, color: "#F0EDE8" }}>Mia</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7vw", color: "#C99A2E" }}>Residential</div>
            </div>
            <div style={{ fontSize: "0.95vw", color: "#8892A4", lineHeight: 1.5 }}>Warm, confident, approachable. Ideal for family homes and first-home buyers.</div>
          </div>
        </div>

        {/* Oliver */}
        <div style={{ flex: 1, backgroundColor: "#111827", border: "1px solid #1E2A3A", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ height: "28vh", flexShrink: 0, overflow: "hidden", position: "relative" }}>
            <img
              src={`${base}oliver-poster.jpg`}
              crossOrigin="anonymous"
              alt="Oliver"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 10%" }}
            />
          </div>
          <div style={{ padding: "2vh 1.5vw", flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1vh" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.7vw", fontWeight: 700, color: "#F0EDE8" }}>Oliver</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7vw", color: "#C99A2E" }}>Luxury</div>
            </div>
            <div style={{ fontSize: "0.95vw", color: "#8892A4", lineHeight: 1.5 }}>Authoritative and measured. Premium listings, prestige suburbs, high-end buyers.</div>
          </div>
        </div>

        {/* Sophie */}
        <div style={{ flex: 1, backgroundColor: "#111827", border: "1px solid #1E2A3A", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ height: "28vh", flexShrink: 0, overflow: "hidden", position: "relative" }}>
            <img
              src={`${base}sophie-poster.jpg`}
              crossOrigin="anonymous"
              alt="Sophie"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 10%" }}
            />
          </div>
          <div style={{ padding: "2vh 1.5vw", flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1vh" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.7vw", fontWeight: 700, color: "#F0EDE8" }}>Sophie</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7vw", color: "#C99A2E" }}>Investment</div>
            </div>
            <div style={{ fontSize: "0.95vw", color: "#8892A4", lineHeight: 1.5 }}>Clear, analytical, data-driven. Connects with investors and savvy professionals.</div>
          </div>
        </div>

        {/* James */}
        <div style={{ flex: 1, backgroundColor: "#111827", border: "1px solid #1E2A3A", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ height: "28vh", flexShrink: 0, overflow: "hidden", position: "relative" }}>
            <img
              src={`${base}james-poster.jpg`}
              crossOrigin="anonymous"
              alt="James"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 10%" }}
            />
          </div>
          <div style={{ padding: "2vh 1.5vw", flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1vh" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.7vw", fontWeight: 700, color: "#F0EDE8" }}>James</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7vw", color: "#C99A2E" }}>Commercial / Rural</div>
            </div>
            <div style={{ fontSize: "0.95vw", color: "#8892A4", lineHeight: 1.5 }}>Direct and knowledgeable. Commercial, acreage, and rural property specialists.</div>
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
          Presenters / LensFlow Explainer
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85vw", color: "#C99A2E", fontWeight: 600 }}>
          07
        </div>
      </div>
    </div>
  );
}
