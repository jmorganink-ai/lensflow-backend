export default function Slide05Pipeline() {
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
            width: "24vw",
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
            How It Works
          </h2>
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3vw", fontWeight: 700, color: "#C99A2E" }}>
          LensFlow
        </div>
      </div>

      {/* Pipeline steps */}
      <div style={{ display: "flex", gap: "0", flex: 1, alignItems: "stretch" }}>

        {/* Step 1 */}
        <div style={{ flex: 1, backgroundColor: "#111827", border: "1px solid #1E2A3A", borderRight: "none", padding: "3.5vh 2vw", display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#C99A2E", fontWeight: 600, marginBottom: "2vh" }}>01</div>
          <div style={{ fontSize: "1.2vw", fontWeight: 700, color: "#F0EDE8", marginBottom: "1.5vh", lineHeight: 1.2 }}>Listing URL</div>
          <div style={{ width: "2vw", height: "1px", backgroundColor: "#C99A2E", opacity: 0.5, marginBottom: "2vh" }} />
          <div style={{ fontSize: "1vw", color: "#8892A4", lineHeight: 1.55, flex: 1 }}>
            Paste any Domain, realestate.com.au, or agency URL. LensFlow extracts suburb, property type, beds, and key features automatically.
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#C99A2E", marginTop: "2.5vh" }}>URL parse</div>
        </div>

        {/* Step 2 */}
        <div style={{ flex: 1, backgroundColor: "#0E1829", border: "1px solid #1E2A3A", borderRight: "none", padding: "3.5vh 2vw", display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#C99A2E", fontWeight: 600, marginBottom: "2vh" }}>02</div>
          <div style={{ fontSize: "1.2vw", fontWeight: 700, color: "#F0EDE8", marginBottom: "1.5vh", lineHeight: 1.2 }}>Claude AI</div>
          <div style={{ width: "2vw", height: "1px", backgroundColor: "#C99A2E", opacity: 0.5, marginBottom: "2vh" }} />
          <div style={{ fontSize: "1vw", color: "#8892A4", lineHeight: 1.55, flex: 1 }}>
            Anthropic Claude writes a property-specific 90-second script. Tone, suburb highlights, and lifestyle cues tailored to each listing.
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#C99A2E", marginTop: "2.5vh" }}>Script generation</div>
        </div>

        {/* Step 3 */}
        <div style={{ flex: 1, backgroundColor: "#111827", border: "1px solid #1E2A3A", borderRight: "none", padding: "3.5vh 2vw", display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#C99A2E", fontWeight: 600, marginBottom: "2vh" }}>03</div>
          <div style={{ fontSize: "1.2vw", fontWeight: 700, color: "#F0EDE8", marginBottom: "1.5vh", lineHeight: 1.2 }}>ElevenLabs</div>
          <div style={{ width: "2vw", height: "1px", backgroundColor: "#C99A2E", opacity: 0.5, marginBottom: "2vh" }} />
          <div style={{ fontSize: "1vw", color: "#8892A4", lineHeight: 1.55, flex: 1 }}>
            The script is voiced by a natural-sounding AI presenter — Mia, Oliver, Sophie, or James — using ElevenLabs neural voice synthesis.
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#C99A2E", marginTop: "2.5vh" }}>Voiceover synthesis</div>
        </div>

        {/* Step 4 */}
        <div style={{ flex: 1, backgroundColor: "#0E1829", border: "1px solid #1E2A3A", borderRight: "none", padding: "3.5vh 2vw", display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#C99A2E", fontWeight: 600, marginBottom: "2vh" }}>04</div>
          <div style={{ fontSize: "1.2vw", fontWeight: 700, color: "#F0EDE8", marginBottom: "1.5vh", lineHeight: 1.2 }}>HeyGen</div>
          <div style={{ width: "2vw", height: "1px", backgroundColor: "#C99A2E", opacity: 0.5, marginBottom: "2vh" }} />
          <div style={{ fontSize: "1vw", color: "#8892A4", lineHeight: 1.55, flex: 1 }}>
            HeyGen syncs the voiceover to a photorealistic AI avatar, producing a lip-synced presenter video indistinguishable from live footage.
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#C99A2E", marginTop: "2.5vh" }}>Lip-sync render</div>
        </div>

        {/* Step 5 */}
        <div style={{ flex: 1, backgroundColor: "#C99A2E", border: "1px solid #C99A2E", padding: "3.5vh 2vw", display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#7A5C14", fontWeight: 600, marginBottom: "2vh" }}>05</div>
          <div style={{ fontSize: "1.2vw", fontWeight: 700, color: "#0A1020", marginBottom: "1.5vh", lineHeight: 1.2 }}>Shotstack</div>
          <div style={{ width: "2vw", height: "1px", backgroundColor: "#0A1020", opacity: 0.4, marginBottom: "2vh" }} />
          <div style={{ fontSize: "1vw", color: "#5C4210", lineHeight: 1.55, flex: 1 }}>
            Shotstack composes the final branded MP4 with property overlays, logo, agent contact info, and a polished outro sequence.
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#7A5C14", marginTop: "2.5vh" }}>Final MP4 ready</div>
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
          Pipeline / LensFlow Explainer
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85vw", color: "#C99A2E", fontWeight: 600 }}>
          05
        </div>
      </div>
    </div>
  );
}
