// STEP 08: INFRA & ORCHESTRATION (Inngest Engine)
import { Inngest } from 'inngest';
import { scrapeListing, normalizeListingData } from './scraper.js';
import { generateVideoScript } from './scriptGen.js';
import { generateSpeechFromScript } from './voiceGen.js';
import { triggerPresenterVideo } from './presenterGen.js';
import { renderFinalReel } from './videoComposer.js';

const inngest = new Inngest({ id: "lensflow-video-pipeline" });

export const realEstateVideoWorkflow = inngest.createFunction(
    { id: "generate-real-estate-video-workflow" },
    { event: "lensflow/url.submitted" }, // Triggered the exact moment an agent clicks submit
    async ({ event, step }) => {
        const { listingUrl } = event.data;

        // 1. Run Scraper & Data Cleaners (Steps 01 & 02)
        const rawData = await step.run("scrape-listing-portal", async () => {
            return await scrapeListing(listingUrl);
        });

        const cleanListing = await step.run("normalize-listing-data", async () => {
            return normalizeListingData(rawData);
        });

        // 2. Generate Copywriting Script (Step 04)
        const scriptText = await step.run("generate-ai-script", async () => {
            return await generateVideoScript(cleanListing);
        });

        // 3. Render Voice Over Audio (Step 05)
        const audioBuffer = await step.run("generate-elevenlabs-speech", async () => {
            return await generateSpeechFromScript(scriptText);
        });
        
        // Note: In production, upload audioBuffer to Cloudflare R2 here 
        const mockAudioUrl = "https://cdn.lensflow.ai/temp-audio.mp3"; 

        // 4. Render Talking Head Presenter (Step 06)
        const presenterVideoId = await step.run("trigger-heygen-avatar", async () => {
            return await triggerPresenterVideo(mockAudioUrl);
        });

        // Note: Implement a status polling loop here for HeyGen compilation completion
        const mockPresenterUrl = "https://cdn.lensflow.ai/mia-presenter-output.mp4";

        // 5. Assemble Final MP4 Commercial Reel (Step 07)
        const finalRenderJobId = await step.run("render-final-video", async () => {
            return await renderFinalReel(
                cleanListing.images, 
                mockPresenterUrl, 
                mockAudioUrl
            );
        });

        return {
            status: "success",
            jobId: finalRenderJobId,
            message: "LensFlow automation pipeline completed successfully."
        };
    }
);