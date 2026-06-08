import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, LayoutDashboard, Loader2, LogOut, Menu, X } from "lucide-react";
import favicon from "@assets/lensflow-brand/favicon.png";
import { useAuth } from "@workspace/replit-auth-web";

const navLinks = [
  { label: "Examples", href: "/#examples", external: false },
  { label: "AI Presenters", href: "/#presenters", external: false },
  { label: "Twin Avatar", href: "/twin-avatar", external: false },
  { label: "How It Works", href: "/#how-it-works", external: false },
  { label: "Value", href: "/#compare", external: false },
  { label: "Pricing", href: "/pricing", external: false },
  { label: "Mobile App", href: "/mobile/", external: true },
  { label: "Explainer", href: "/lensflow-explainer/", external: true },
];

export function Navbar() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const firstName = user?.firstName ?? user?.email?.split("@")[0] ?? null;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2">
          <img src={favicon} alt="LensFlow Logo" className="h-8 w-8" />
          <span className="font-serif text-xl font-semibold tracking-wide transition-colors group-hover:text-primary">
            LensFlow<span className="text-primary">.</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 text-sm font-medium text-muted-foreground lg:flex">
          {navLinks.map((link) =>
            link.external ? (
              <a key={link.label} href={link.href} className="transition-colors hover:text-foreground">
                {link.label}
              </a>
            ) : (
              <a key={link.label} href={link.href} className="transition-colors hover:text-foreground">
                {link.label}
              </a>
            )
          )}
        </div>

        <div className="flex items-center gap-3">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : isAuthenticated ? (
            <>
              <span className="hidden font-mono text-xs text-muted-foreground md:block">
                {firstName ?? "Agent"}
              </span>
              <a
                href="/pipeline/"
                className="hidden items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80 md:flex"
              >
                <LayoutDashboard className="h-4 w-4" />
                My Dashboard
              </a>
              <button
                onClick={logout}
                className="hidden items-center gap-1 text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground md:flex"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
              <a href="/pipeline/">
                <Button className="rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Open Studio <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </a>
            </>
          ) : (
            <>
              <a
                href="/pipeline/"
                className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-primary md:block"
              >
                Sign In
              </a>
              <a href="/#hero-form" className="hidden sm:block">
                <Button
                  data-testid="nav-btn-start"
                  className="rounded-full bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Create Campaign <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </a>
            </>
          )}

          {/* Hamburger — mobile only */}
          <button
            className="flex items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-white/5 bg-background/95 backdrop-blur-md lg:hidden">
          <div className="mx-auto max-w-7xl px-6 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <a
                    href="/pipeline/"
                    className="rounded-lg px-3 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                    onClick={() => setMobileOpen(false)}
                  >
                    <LayoutDashboard className="inline h-4 w-4 mr-2" />
                    My Dashboard
                  </a>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="rounded-lg px-3 py-3 text-left text-sm font-medium text-muted-foreground/60 transition-colors hover:bg-white/5"
                  >
                    <LogOut className="inline h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </>
              ) : (
                <a
                  href="/#hero-form"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
                >
                  Create Campaign →
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
