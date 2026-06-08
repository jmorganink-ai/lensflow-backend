import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, LayoutDashboard, Loader2, LogOut, Menu, X } from "lucide-react";
import favicon from "@assets/lensflow-brand/favicon.png";
import { useAuth } from "@workspace/replit-auth-web";

const navLinks = [
  { label: "Examples", href: "/#examples" },
  { label: "AI Presenters", href: "/#presenters" },
  { label: "Twin Avatar", href: "/twin-avatar" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Value", href: "/#compare" },
  { label: "Pricing", href: "/pricing" },
  { label: "Mobile App", href: "/mobile/" },
  { label: "Explainer", href: "/lensflow-explainer/" },
];

export function Navbar() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const firstName = user?.firstName ?? user?.email?.split("@")[0] ?? null;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="group flex items-center gap-2">
            <img src={favicon} alt="LensFlow Logo" className="h-7 w-7" />
            <span className="font-serif text-lg font-semibold tracking-wide transition-colors group-hover:text-primary">
              LensFlow<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-7 text-sm font-medium text-muted-foreground lg:flex">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="transition-colors hover:text-foreground">
                {link.label}
              </a>
            ))}
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
                  <Button className="hidden sm:flex rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    Open Studio <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </a>
              </>
            ) : (
              <a href="/#hero-form" className="hidden sm:block">
                <Button
                  data-testid="nav-btn-start"
                  className="rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Create Campaign <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </a>
            )}

            {/* Hamburger — mobile only */}
            <button
              className="flex items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-background lg:hidden">
          {/* Header row */}
          <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-white/5 px-5">
            <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
              <img src={favicon} alt="LensFlow Logo" className="h-7 w-7" />
              <span className="font-serif text-lg font-semibold">
                LensFlow<span className="text-primary">.</span>
              </span>
            </Link>
            <button
              className="flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto px-5 py-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between border-b border-white/5 py-4 text-xl font-medium text-foreground transition-colors hover:text-primary"
              >
                {link.label}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </a>
            ))}

            {isAuthenticated && (
              <>
                <a
                  href="/pipeline/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between border-b border-white/5 py-4 text-xl font-medium text-primary transition-colors"
                >
                  My Dashboard
                  <ChevronRight className="h-4 w-4 text-primary/60" />
                </a>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="flex w-full items-center justify-between border-b border-white/5 py-4 text-xl font-medium text-muted-foreground/60 transition-colors hover:text-muted-foreground"
                >
                  Sign Out
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            )}
          </nav>

          {/* Bottom CTAs */}
          <div className="flex-shrink-0 border-t border-white/10 p-5">
            {isAuthenticated ? (
              <a href="/pipeline/" onClick={() => setMobileOpen(false)}>
                <Button className="w-full h-13 rounded-xl bg-primary text-base font-semibold text-primary-foreground">
                  Open Studio <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            ) : (
              <div className="flex gap-3">
                <a href="/pipeline/" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button variant="outline" className="w-full h-13 rounded-xl border-white/20 text-base font-medium text-foreground hover:bg-white/5">
                    Sign In
                  </Button>
                </a>
                <a href="/#hero-form" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button className="w-full h-13 rounded-xl bg-primary text-base font-semibold text-primary-foreground">
                    Create Campaign
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
