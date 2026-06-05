import favicon from "@assets/lensflow-brand/favicon.png";

export function Footer() {
  return (
    <footer className="bg-background py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <img src={favicon} alt="LensFlow Logo" className="w-6 h-6 grayscale opacity-50" />
          <span className="font-serif font-semibold text-lg text-muted-foreground">LensFlow.</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © 2026 LensFlow AI. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <a href="/pricing" className="hover:text-foreground">Pricing</a>
          <a href="/concierge" className="hover:text-foreground">Concierge</a>
          <a href="/twin-avatar" className="hover:text-foreground">Twin Avatar</a>
          <a href="/origin" className="hover:text-foreground">Our Story</a>
          <a href="mailto:hello@lensflow.com.au" className="hover:text-foreground">Contact</a>
        </div>
      </div>
    </footer>
  );
}
