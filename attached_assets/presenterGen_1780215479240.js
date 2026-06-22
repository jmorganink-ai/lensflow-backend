// STEP 06: AI PRESENTER VIDEO
import fetch from 'node-fetch';

export async function triggerPresenterVideo(audioUrl, avatarId = "Mia_RealEstate_9:16") {
    const url = 'https://api.heygen.com/v2/video/generate';
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'X-Api-Key': process.env.HEYGEN_API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            video_setting: {
                ratio: "9:16",
                video_quality: "high"
            },
            dimension: { width: 1080, height: 1920 },
            character: {
                type: "avatar",
                avatar_id: avatarId,
                avatar_style: "normal"
            },
            input_text: null, // Using external audio file instead
            audio_url: audioUrl
        }),
    });

    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(`HeyGen error: ${data.error?.message || response.statusText}`);
    }

    return data.data.video_id; // Keep checking status until render completes
}