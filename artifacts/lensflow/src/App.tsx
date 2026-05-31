import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { useAuth } from "@workspace/replit-auth-web";

import { Layout } from "@/components/layout/layout";
import Dashboard from "@/pages/dashboard";
import NewJob from "@/pages/new-job";
import JobDetail from "@/pages/job-detail";
import Webhooks from "@/pages/webhooks";
import Settings from "@/pages/settings";
import JobsList from "@/pages/jobs";
import MorganChat from "@/components/MorganChat";
import { useServiceWorker } from "@/hooks/use-service-worker";
import { Film, Loader2, Sparkles, Mic2, Video } from "lucide-react";

const queryClient = new QueryClient();

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated, login } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 relative overflow-hidden">
        {/* Atmospheric glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/8 blur-[120px]" />
        </div>

        <div className="w-full max-w-sm text-center space-y-8 relative z-10">
          {/* Brand */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 font-mono font-bold text-2xl text-primary">
              <Film className="w-7 h-7" />
              <span>LENSFLOW_AI</span>
            </div>
            <p className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
              AI Video Pipeline for Real Estate
            </p>
          </div>

          {/* Card */}
          <div className="bg-card border border-border rounded-xl p-8 space-y-6 shadow-xl">
            <div>
              <h1 className="text-xl font-bold mb-2">Welcome back</h1>
              <p className="text-sm text-muted-foreground">Sign in to access your AI video pipeline</p>
            </div>

            {/* 3-step feature strip */}
            <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-border">
              {[
                { icon: Sparkles, label: "AI Script" },
                { icon: Mic2, label: "Voiceover" },
                { icon: Video, label: "Video" },
              ].map(({ icon: Icon, label }, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 py-2">
                  <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={login}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono font-medium py-3 px-6 rounded-sm transition-colors text-sm uppercase tracking-wider"
            >
              Sign In to Continue
            </button>
            <p className="text-xs text-muted-foreground">
              Don't have an account? Signing in will create one automatically.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function Router() {
  return (
    <>
      <Layout>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/jobs/new" component={NewJob} />
          <Route path="/jobs/:id" component={JobDetail} />
          <Route path="/jobs" component={JobsList} />
          <Route path="/webhooks" component={Webhooks} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
      <MorganChat />
    </>
  );
}

function App() {
  useServiceWorker();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthGate>
            <Router />
          </AuthGate>
        </WouterRouter>
        <Toaster />
        <SonnerToaster theme="dark" position="bottom-right" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
