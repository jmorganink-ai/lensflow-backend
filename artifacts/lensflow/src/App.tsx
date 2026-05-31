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
import { useServiceWorker } from "@/hooks/use-service-worker";
import { Film, Loader2 } from "lucide-react";

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
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center space-y-8">
          <div className="flex items-center justify-center gap-2 font-mono font-bold text-2xl text-primary">
            <Film className="w-7 h-7" />
            <span>LENSFLOW_AI</span>
          </div>
          <div className="bg-card border border-border rounded-xl p-8 space-y-6">
            <div>
              <h1 className="text-xl font-bold mb-2">Welcome back</h1>
              <p className="text-sm text-muted-foreground">Sign in to access your AI video pipeline</p>
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
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/jobs/new" component={NewJob} />
        <Route path="/jobs/:id" component={JobDetail} />
        <Route path="/webhooks" component={Webhooks} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
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
