import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, LayoutDashboard, LogOut, Loader2 } from "lucide-react";
import favicon from "@assets/lensflow-brand/favicon.png";
import { useAuth } from "@workspace/replit-auth-web";

export function Navbar() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const firstName = user?.firstName ?? user?.email?.split("@")[0] ?? null;

  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <img src={favicon} alt="LensFlow Logo" className="w-8 h-8" />
          <span className="font-serif font-semibold text-xl tracking-wide group-hover:text-primary transition-colors">
            LensFlow<span className="text-primary">.</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="/#presenters" className="hover:text-foreground transition-colors">Presenters</a>
          <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <a href="/#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
          <a href="/#compare" className="hover:text-foreground transition-colors">Compare</a>
          <Link href="/advantage" className="hover:text-foreground transition-colors font-semibold text-violet-400 hover:text-violet-300">✦ Your Edge</Link>
        </div>

        <div className="flex items-center gap-3">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          ) : isAuthenticated ? (
            <>
              <span className="hidden md:block text-xs text-muted-foreground font-mono">
                {firstName ?? "Agent"}
              </span>
              <a
                href="/pipeline/"
                className="hidden md:flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                My Dashboard
              </a>
              <button
                onClick={logout}
                className="hidden md:flex items-center gap-1 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
              <a href="/pipeline/">
                <Button className="rounded-full px-5 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm">
                  Open Studio <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </a>
            </>
          ) : (
            <>
              <a href="/pipeline/" className="hidden md:block text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Sign In
              </a>
              <a href="#hero-form">
                <Button
                  data-testid="nav-btn-start"
                  className="rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                >
                  Get Started <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
