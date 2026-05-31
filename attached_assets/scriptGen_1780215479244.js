// STEP 04: SCRIPT GENERATION
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateVideoScript(listing) {
    const systemPrompt = `You are an elite, high-end real estate copywriter. 
Your task is to write a highly compelling, 60-second promotional property voiceover script.
Target length: Exactly 130 to 150 words (to hit a natural 60-second read speed).
Rules:
1. Do not use emojis, stage directions, or sound effect descriptions.
2. Focus on emotional, luxury hook words.
3. Reference the property stats seamlessly: ${listing.bedrooms} bed, ${listing.bathrooms} bath.
4. Output the script as a single, clean prose paragraph ready for text-to-speech.`;

    const userPrompt = `Address: ${listing.address}, ${listing.suburb}
Price Guide: ${listing.priceGuide}
Description Details: ${listing.description}`;

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
}