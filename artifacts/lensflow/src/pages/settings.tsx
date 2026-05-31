import { useAuth } from "@workspace/replit-auth-web";
import { LogOut, User, Mail, Shield, Film, Key, Copy, Check, Webhook, Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Settings() {
  const { user, logout } = useAuth();
  const [keyCopied, setKeyCopied] = useState(false);

  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}`
    : user?.email ?? "Agent";

  const initials = user?.firstName
    ? (user.firstName[0] + (user.lastName?.[0] ?? "")).toUpperCase()
    : (user?.email?.[0] ?? "?").toUpperCase();

  // Deterministic mock API key derived from user ID
  const mockApiKey = user?.id
    ? `lf_live_${user.id.replace(/-/g, "").slice(0, 24)}`
    : "lf_live_••••••••••••••••••••••••";

  function copyKey() {
    navigator.clipboard.writeText(mockApiKey).then(() => {
      setKeyCopied(true);
      setTimeout(() => setKeyCopied(false), 2000);
    });
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Profile & Settings</h1>
        <p className="text-muted-foreground">Your agent account details and integrations.</p>
      </div>

      {/* Profile Card */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent relative">
          <div className="absolute bottom-0 left-6 translate-y-1/2">
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={displayName}
                className="w-16 h-16 rounded-full border-4 border-card object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full border-4 border-card bg-secondary flex items-center justify-center text-2xl font-bold font-mono text-primary">
                {initials}
              </div>
            )}
          </div>
        </div>
        <div className="pt-12 pb-6 px-6 space-y-4">
          <div>
            <h2 className="text-xl font-bold">{displayName}</h2>
            <p className="text-sm text-muted-foreground font-mono">{user?.email ?? "—"}</p>
          </div>
          <div className="grid gap-3">
            <InfoRow icon={User} label="Full Name" value={displayName} />
            <InfoRow icon={Mail} label="Email" value={user?.email ?? "—"} />
            <InfoRow icon={Film} label="Account Type" value="LensFlow Agent" />
            <InfoRow icon={Shield} label="Session" value="Active · 7-day token" />
          </div>
        </div>
      </div>

      {/* API Access */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <Key className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">API Access</h3>
          <span className="ml-auto text-[10px] font-mono text-primary border border-primary/30 bg-primary/5 px-1.5 py-0.5 rounded">LIVE KEY</span>
        </div>
        <div className="px-6 py-5 space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Use this key to authenticate API requests and webhook integrations with the LensFlow pipeline.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 font-mono text-xs bg-background border border-border rounded px-3 py-2 text-foreground/70 select-all truncate">
              {mockApiKey}
            </code>
            <button
              onClick={copyKey}
              className="shrink-0 flex items-center gap-1.5 text-[10px] font-mono border border-border hover:border-primary/40 hover:text-primary text-muted-foreground px-3 py-2 rounded transition-colors"
            >
              {keyCopied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
              {keyCopied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground font-mono">
            Include as <code className="bg-secondary px-1 rounded">Authorization: Bearer {"{key}"}</code> header on all API requests.
          </p>
        </div>
      </div>

      {/* Webhooks Shortcut */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <Webhook className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Webhook Integrations</h3>
        </div>
        <div className="px-6 py-5 space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Receive real-time HTTP notifications when your pipeline jobs change state (queued, complete, failed).
            Integrate with CRMs, Slack, or any automation platform.
          </p>
          <Link
            href="/webhooks"
            className="inline-flex items-center gap-2 px-4 py-2 border border-border hover:border-primary/40 hover:text-primary text-muted-foreground rounded text-xs font-mono transition-colors"
          >
            <LinkIcon className="w-3.5 h-3.5" /> Manage Webhooks
          </Link>
        </div>
      </div>

      {/* Sign Out */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div>
          <h3 className="font-semibold mb-1">Sign Out</h3>
          <p className="text-sm text-muted-foreground">End your current session on this device.</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 rounded-sm border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors text-sm font-mono font-medium"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
      <span className="text-xs font-mono text-muted-foreground w-24 shrink-0 uppercase tracking-wider">{label}</span>
      <span className="text-sm font-medium truncate">{value}</span>
    </div>
  );
}
