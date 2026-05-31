import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import favicon from "@assets/lensflow-brand/favicon.png";

export function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <img src={favicon} alt="LensFlow Logo" className="w-8 h-8" />
          <span className="font-serif font-semibold text-xl tracking-wide group-hover:text-primary transition-colors">LensFlow<span className="text-primary">.</span></span>
        </Link>
        
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="/#presenters" className="hover:text-foreground transition-colors">Presenters</a>
          <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <a href="/#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
          <a href="/#compare" className="hover:text-foreground transition-colors">Compare</a>
        </div>

        <div className="flex items-center gap-4">
          <a href="/pipeline/" className="hidden md:block text-sm font-medium hover:text-primary transition-colors">
            Dashboard
          </a>
          <a href="/pipeline/">
            <Button data-testid="nav-btn-start" className="rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
              Open AI Studio <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </a>
        </div>
      </div>
    </nav>
  );
}
