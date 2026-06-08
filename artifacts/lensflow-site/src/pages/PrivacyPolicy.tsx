import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        <h1 className="font-serif text-4xl font-semibold mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: June 2025</p>

        <div className="prose prose-invert max-w-none space-y-8 text-base leading-7 text-muted-foreground">

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Who we are</h2>
            <p>
              LensFlow AI ("LensFlow", "we", "us") is an AI-powered real estate video and campaign platform
              operated by LensFlow Pty Ltd, Australia. Our service is available at{" "}
              <a href="https://www.lensflow.com.au" className="text-primary hover:underline">
                www.lensflow.com.au
              </a>{" "}
              and through our mobile application ("LensFlow App") available on the Google Play Store.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Information we collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Account information:</strong> name, email address and profile data when you sign in via Replit authentication.</li>
              <li><strong className="text-foreground">Listing data:</strong> property listing URLs you paste into LensFlow so we can generate your campaign scripts and videos.</li>
              <li><strong className="text-foreground">Camera and microphone:</strong> only when you choose the self-record feature to film your own presenter video. We never access your camera or microphone in the background.</li>
              <li><strong className="text-foreground">Photos:</strong> only when you voluntarily upload property images. We access your photo library only when you tap the upload button.</li>
              <li><strong className="text-foreground">Usage data:</strong> job history, campaign outputs and feature interactions to improve the service.</li>
              <li><strong className="text-foreground">Device data:</strong> device type, operating system version and app version for diagnostics.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. How we use your information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To generate AI scripts, voiceovers and video campaigns from your listing URL.</li>
              <li>To provide, maintain and improve the LensFlow platform.</li>
              <li>To authenticate your account and keep your jobs secure.</li>
              <li>To send service-related communications (never marketing without consent).</li>
              <li>To detect and prevent fraud or misuse.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Third-party services</h2>
            <p>LensFlow uses the following trusted third parties to deliver the service:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong className="text-foreground">Anthropic Claude</strong> — AI script generation. Your listing URL and property details are sent to Claude to produce the script.</li>
              <li><strong className="text-foreground">ElevenLabs</strong> — Text-to-speech voiceover synthesis.</li>
              <li><strong className="text-foreground">HeyGen</strong> — AI presenter video rendering.</li>
              <li><strong className="text-foreground">Shotstack</strong> — Video assembly and rendering.</li>
              <li><strong className="text-foreground">Replit</strong> — Cloud infrastructure and authentication.</li>
            </ul>
            <p className="mt-3">We do not sell your data to any third party.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Data retention</h2>
            <p>
              Your campaign jobs, scripts and videos are retained while your account is active. You can
              delete individual jobs from your dashboard at any time. To delete your account and all
              associated data, contact us at{" "}
              <a href="mailto:privacy@lensflow.com.au" className="text-primary hover:underline">
                privacy@lensflow.com.au
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Camera, microphone and photo permissions</h2>
            <p>
              The LensFlow mobile app requests access to your camera, microphone and photo library only
              for the self-record feature. These permissions are requested at the moment you choose to
              film yourself, not on app launch. You can revoke permissions at any time in your device
              settings. Revoking permissions does not affect the AI presenter or URL-based campaign features.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Security</h2>
            <p>
              All data is transmitted over HTTPS. Authentication is handled via industry-standard OIDC.
              We follow best practices for data security; however no system is completely immune to risk
              and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Children</h2>
            <p>
              LensFlow is not directed at children under 13. We do not knowingly collect personal
              information from children. If you believe a child has provided us personal information,
              contact us and we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Your rights</h2>
            <p>
              Under Australian Privacy Act 1988 and applicable laws you have the right to access,
              correct or delete your personal data. Email{" "}
              <a href="mailto:privacy@lensflow.com.au" className="text-primary hover:underline">
                privacy@lensflow.com.au
              </a>{" "}
              and we will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Changes to this policy</h2>
            <p>
              We may update this policy from time to time. We will notify you of material changes via
              the app or email. Continued use of LensFlow after changes constitutes acceptance of the
              updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">11. Contact</h2>
            <p>
              Questions about this policy?{" "}
              <a href="mailto:privacy@lensflow.com.au" className="text-primary hover:underline">
                privacy@lensflow.com.au
              </a>
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
