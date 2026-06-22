// STEP 05: VOICE (TTS)
import fetch from 'node-fetch';

export async function generateSpeechFromScript(scriptText, voiceId = "EXAVITQu4vr4xnSDxMaL") { // Default Mia Voice ID token
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'accept': 'audio/mpeg',
            'xi-api-key': process.env.ELEVENLABS_API_KEY,
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            text: scriptText,
            model_id: "eleven_monolingual_v1",
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
            }
        }),
    });

    if (!response.ok) {
        throw new Error(`ElevenLabs failure: ${response.statusText}`);
    }

    // Returns audio stream buffer to pass along to storage or directly to the video composer
    return await response.buffer();
}