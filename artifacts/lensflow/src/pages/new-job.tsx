import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useCreateJob, getGetJobStatsQueryKey, getListJobsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  listingUrl: z.string().url("Please enter a valid URL"),
});

export default function NewJob() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createJob = useCreateJob();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      listingUrl: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createJob.mutate({ data: { listingUrl: values.listingUrl } }, {
      onSuccess: (job) => {
        queryClient.invalidateQueries({ queryKey: getGetJobStatsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListJobsQueryKey() });
        toast({
          title: "Pipeline Initiated",
          description: "Job successfully queued for processing.",
        });
        setLocation(`/jobs/${job.id}`);
      },
      onError: () => {
        toast({
          title: "Submission Failed",
          description: "Could not start the pipeline. Please try again.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">New Pipeline Run</h1>
        <p className="text-muted-foreground">Submit a property listing URL to automatically generate a professional presenter video.</p>
      </div>

      <div className="bg-card border border-border p-6 rounded-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="listingUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-wider font-mono text-muted-foreground">Target URL</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Link2 className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input 
                        placeholder="https://zillow.com/homedetails/..." 
                        className="pl-10 h-12 bg-background border-border font-mono text-sm"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={createJob.isPending}
                className="font-mono uppercase tracking-wider h-12 px-8"
              >
                {createJob.isPending ? "Initializing..." : "Engage Pipeline"}
                {!createJob.isPending && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <div className="text-xs text-muted-foreground font-mono space-y-2">
        <div className="uppercase tracking-widest text-foreground mb-4">Pipeline Stages:</div>
        <div className="flex items-center gap-4 opacity-50">
          <span className="text-primary">01</span> Scrape Listing Data
        </div>
        <div className="flex items-center gap-4 opacity-50">
          <span className="text-primary">02</span> Generate AI Script
        </div>
        <div className="flex items-center gap-4 opacity-50">
          <span className="text-primary">03</span> Synthesize Voiceover
        </div>
        <div className="flex items-center gap-4 opacity-50">
          <span className="text-primary">04</span> Render Presenter Avatar
        </div>
        <div className="flex items-center gap-4 opacity-50">
          <span className="text-primary">05</span> Final Video Composition
        </div>
      </div>
    </div>
  );
}
