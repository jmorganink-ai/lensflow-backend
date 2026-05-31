import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCaptureLead } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Loader2 } from "lucide-react";

export function LeadCapture({ source = "website" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const captureLead = useCaptureLead();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    captureLead.mutate(
      { data: { email, source } },
      {
        onSuccess: (data) => {
          setEmail("");
          toast({
            title: data.success ? "You're on the list!" : "Welcome back!",
            description: data.message,
          });
        },
        onError: () => {
          toast({
            title: "Something went wrong",
            description: "Please try again later.",
            variant: "destructive"
          });
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center max-w-md w-full gap-2 relative">
      <Input
        type="email"
        placeholder="Enter your work email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-12 bg-background/50 border-white/10 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/50 rounded-full pl-6 pr-32"
        data-testid="input-email-lead"
      />
      <Button
        type="submit"
        disabled={captureLead.isPending}
        className="absolute right-1 top-1 bottom-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 font-medium"
        data-testid="btn-submit-lead"
      >
        {captureLead.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Get Early Access"}
      </Button>
    </form>
  );
}
