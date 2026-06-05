import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, LayoutDashboard, Loader2, LogOut } from "lucide-react";
import favicon from "@assets/lensflow-brand/favicon.png";
import { useAuth } from "@workspace/replit-auth-web";

export function Navbar() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const firstName = user?.firstName ?? user?.email?.split("@")[0] ?? null;

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2">
          <img src={favicon} alt="LensFlow Logo" className="h-8 w-8" />
          <span className="font-serif text-xl font-semibold tracking-wide transition-colors group-hover:text-primary">
            LensFlow<span className="text-primary">.</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-muted-foreground lg:flex">
          <a href="/#examples" className="transition-colors hover:text-foreground">
            Examples
          </a>
          <a href="/#presenters" className="transition-colors hover:text-foreground">
            AI Presenters
          </a>
          <a href="/#how-it-works" className="transition-colors hover:text-foreground">
            How It Works
          </a>
          <a href="/#compare" className="transition-colors hover:text-foreground">
            Value
          </a>
          <Link href="/pricing" className="transition-colors hover:text-foreground">
            Pricing
          </Link>
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
              <a href="/#hero-form">
                <Button
                  data-testid="nav-btn-start"
                  className="rounded-full bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Create Campaign <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
