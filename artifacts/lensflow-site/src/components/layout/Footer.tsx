import favicon from "@assets/lensflow-brand/favicon.png";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <div className="flex items-center gap-2">
          <img src={favicon} alt="LensFlow Logo" className="h-6 w-6" />
          <span className="font-serif text-lg font-semibold text-muted-foreground">
            LensFlow.
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Copyright 2026 LensFlow AI. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <a href="mailto:hello@lensflow.com.au" className="hover:text-foreground">
            Contact
          </a>
          <a href="mailto:hello@lensflow.com.au" className="hover:text-foreground">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
