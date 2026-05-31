// STEP 07: VIDEO ASSEMBLY & EXPORT
import fetch from 'node-fetch';

export async function renderFinalReel(images, presenterVideoUrl, audioTrackUrl) {
    const url = 'https://api.shotstack.io/v1/render';
    
    // Create an array of visual image assets timed out across the track length
    const imageClips = images.map((imgUrl, index) => ({
        asset: { type: "image", src: imgUrl },
        start: index * 5, // Display each slide for 5 seconds
        length: 5,
        effect: "zoomIn" // Add subtle movement layout
    }));

    const timeline = {
        background: "#000000",
        tracks: [
            {
                // Layer 1: The Talking-Head AI Avatar Overlayed
                clips: [{
                    asset: { type: "video", src: presenterVideoUrl },
                    start: 0,
                    length: 60,
                    position: "bottomCenter",
                    scale: 0.45 // Scaled naturally in the frame corner
                }]
            },
            {
                // Layer 2: Main B-Roll Listing Slideshow
                clips: imageClips
            },
            {
                // Layer 3: Audio Engine
                clips: [{
                    asset: { type: "audio", src: audioTrackUrl },
                    start: 0,
                    length: 60,
                    volume: 0.15 // Injected cleanly under voice over tracks
                }]
            }
        ]
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'x-api-key': process.env.SHOTSTACK_API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ timeline, output: { format: "mp4", resolution: "hd" } }),
    });

    const data = await response.json();
    return data.response.id; // Final tracking token for output delivery
}