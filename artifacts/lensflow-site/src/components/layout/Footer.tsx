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
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Support</a>
        </div>
      </div>
    </footer>
  );
}
