import { Link, useLocation } from "wouter";
import { Film, LayoutDashboard, Webhook, Plus, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@workspace/replit-auth-web";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/webhooks", label: "Webhooks", icon: Webhook },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Sidebar */}
      <aside className="w-64 flex-col hidden md:flex border-r border-border bg-card/50">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <div className="flex items-center gap-2 font-mono font-bold tracking-tight text-lg text-primary">
            <Film className="w-5 h-5" />
            <span>LENSFLOW_AI</span>
          </div>
        </div>

        <div className="flex-1 py-6 px-4 flex flex-col gap-2">
          <Link href="/jobs/new" className="mb-6 flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-sm font-medium transition-colors font-mono text-sm uppercase">
            <Plus className="w-4 h-4" /> New Pipeline
          </Link>

          <nav className="flex flex-col gap-1">
            <div className="text-xs font-mono text-muted-foreground px-2 mb-2 uppercase tracking-wider">Menu</div>
            {navItems.map((item) => {
              const isActive = location === item.href || (location.startsWith("/jobs") && item.href === "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-secondary text-foreground" 
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-border mt-auto">
          <div className="flex items-center gap-3">
            {user?.profileImageUrl ? (
              <img src={user.profileImageUrl} alt="" className="w-8 h-8 rounded border border-border object-cover" />
            ) : (
              <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center text-xs font-mono border border-border text-primary font-bold">
                {(user?.firstName?.[0] ?? user?.email?.[0] ?? "?").toUpperCase()}
              </div>
            )}
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-xs font-medium truncate">{user?.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : (user?.email ?? "Agent")}</span>
              <span className="text-[10px] text-muted-foreground font-mono">System Active</span>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
          <div className="flex items-center gap-2 font-mono font-bold text-primary">
            <Film className="w-5 h-5" />
            <span>LENSFLOW</span>
          </div>
        </header>
        <div className="flex-1 p-6 lg:p-10 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
