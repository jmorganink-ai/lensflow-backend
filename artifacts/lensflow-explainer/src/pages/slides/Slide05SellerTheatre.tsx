export default function Slide05SellerTheatre() {
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
            Seller Theatre
          </h2>
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3vw", fontWeight: 700, color: "#C99A2E" }}>
          LensFlow
        </div>
      </div>

      {/* Main layout: left statement + right scenario */}
      <div style={{ display: "flex", gap: "4vw", flex: 1 }}>

        {/* Left: the concept */}
        <div style={{ flex: 1.1, display: "flex", flexDirection: "column", gap: "3vh" }}>
          <p style={{ fontSize: "1.75vw", fontWeight: 500, color: "#8892A4", lineHeight: 1.55, margin: 0 }}>
            Agents who win listings don't just talk about marketing. They show up with the marketing already done.
          </p>

          <div style={{ width: "100%", height: "1px", backgroundColor: "#1E2A3A" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "2.8vh" }}>
            <div style={{ display: "flex", gap: "2vw" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.1vw", color: "#C99A2E", fontWeight: 600, minWidth: "2.5vw" }}>01</div>
              <div>
                <h3 style={{ fontSize: "1.35vw", fontWeight: 700, color: "#F0EDE8", margin: "0 0 0.8vh 0" }}>Before the appointment</h3>
                <p style={{ fontSize: "1.05vw", color: "#8892A4", lineHeight: 1.5, margin: 0 }}>
                  Paste a comparable listing URL. In 10 minutes you have a finished presenter video to take into the room.
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "2vw" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.1vw", color: "#C99A2E", fontWeight: 600, minWidth: "2.5vw" }}>02</div>
              <div>
                <h3 style={{ fontSize: "1.35vw", fontWeight: 700, color: "#F0EDE8", margin: "0 0 0.8vh 0" }}>In the room</h3>
                <p style={{ fontSize: "1.05vw", color: "#8892A4", lineHeight: 1.5, margin: 0 }}>
                  Play the demo. The seller sees exactly what their listing video will look like — professional presenter, their suburb, their property type. Not a promise. Proof.
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "2vw" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.1vw", color: "#C99A2E", fontWeight: 600, minWidth: "2.5vw" }}>03</div>
              <div>
                <h3 style={{ fontSize: "1.35vw", fontWeight: 700, color: "#F0EDE8", margin: "0 0 0.8vh 0" }}>After they sign</h3>
                <p style={{ fontSize: "1.05vw", color: "#8892A4", lineHeight: 1.5, margin: 0 }}>
                  Paste their listing URL. Their real video is ready before the sign goes up. It publishes the same day the listing goes live.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: the pull-quote moment */}
        <div style={{ flex: 0.9, display: "flex", flexDirection: "column", gap: "0" }}>

          {/* Scene card */}
          <div style={{ backgroundColor: "#111827", border: "1px solid #1E2A3A", padding: "4vh 3vw", flex: 1, display: "flex", flexDirection: "column" }}>
            <h4 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "#C99A2E", margin: "0 0 3vh 0" }}>
              The moment
            </h4>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.85vw", fontWeight: 700, color: "#F0EDE8", lineHeight: 1.3, margin: "0 0 3vh 0", letterSpacing: "-0.01em" }}>
              "Every other agent came in with a brochure. You came in with the video already made."
            </p>
            <div style={{ width: "100%", height: "1px", backgroundColor: "#1E2A3A", margin: "0 0 2.5vh 0" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "2vh", flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#8892A4" }}>Comparable demo video</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#C99A2E" }}>10 min to make</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#8892A4" }}>Traditional demo production</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#8892A4", opacity: 0.5 }}>Not practical</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#8892A4" }}>Cost per listing appointment</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8vw", color: "#C99A2E" }}>Included in $79/mo</div>
              </div>
            </div>
          </div>

          {/* Stat strip */}
          <div style={{ backgroundColor: "#C99A2E", padding: "3vh 3vw", display: "flex", flexDirection: "column", gap: "0.5vh" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "3vw", fontWeight: 900, color: "#0A1020", letterSpacing: "-0.03em", lineHeight: 1 }}>
              Win the listing.
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85vw", color: "#7A5C14" }}>
              Then publish the video the day it goes live.
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
          Seller Theatre / LensFlow Explainer
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85vw", color: "#C99A2E", fontWeight: 600 }}>
          05
        </div>
      </div>
    </div>
  );
}
