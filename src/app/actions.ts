'use server';

import { openai } from '@/lib/openai';

export async function generateIcon(motif: string, style: string, primaryColor: string, secondaryColor: string, referenceImageBase64?: string) {
    try {
        let imageDescription = "";

        // If reference image is provided, analyze it first
        if (referenceImageBase64) {
            const visionResponse = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: "Describe this app icon's composition, shape, and key visual elements briefly. Focus on what makes it unique." },
                            {
                                type: "image_url",
                                image_url: {
                                    url: referenceImageBase64,
                                },
                            },
                        ],
                    },
                ],
            });
            imageDescription = visionResponse.choices[0].message.content || "";
        }

        const prompt = `Create a highly minimalist, simple logo graphic.
    Subject: ${motif}. 
    Style: ${style}. 
    Primary Color: ${primaryColor}. 
    Secondary Color: ${secondaryColor}.
    ${imageDescription ? `Reference Inspiration: ${imageDescription}` : ""}
    Extremely clean and simple. Professional modern design.
    NO text, NO words, NO letters.
    IMPORTANT CRITERIA:
    1. Draw ONLY the main subject artwork centered on a flat, solid colored background.
    2. DO NOT draw an app icon frame, border, or rounded square around the artwork.
    3. Keep the design extremely simple, flat, and avoiding overly complex details.`;

        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            quality: "standard",
            style: "vivid",
        });

        const imageUrl = response.data?.[0]?.url;

        if (!imageUrl) {
            throw new Error("Failed to generate image");
        }

        return { success: true, imageUrl };
    } catch (error) {
        console.error("Error generating icon:", error);
        return { success: false, error: "Failed to generate icon. Please try again." };
    }
}

export async function analyzeTrends(term: string, apps: { id: number; name: string }[]) {
    try {
        const prompt = `Analyze the current design trends for mobile app icons in the "${term}" category.
    I have a list of top apps with their IDs: ${JSON.stringify(apps)}.

    1.  **Trend Insights**: Provide a detailed analysis in **Korean** covering:
        -   **Dominant Style**: Detailed description of the prevailing aesthetic.
        -   **Color Usage**: In-depth analysis of color palettes and their psychological impact.
        -   **Visual Metaphors**: Common symbols and motifs used.
        -   **Keywords**: Extract 5-7 key trend keywords (e.g., "Gradient", "Minimal", "Pastel").

    2.  **Competitive Landscape Graph**:
        -   Imagine a 2D scatter plot.
        -   **X-Axis**: "Classic/Traditional" (0) to "Modern/Avant-Garde" (100).
        -   **Y-Axis**: "Serious/Utilitarian" (0) to "Playful/Casual" (100).
        -   Assign a coordinate (x, y) for **EVERY** provided app in the list based on their likely design style.

    Return ONLY valid JSON with this structure:
    {
      "dominantStyle": "string (Korean)",
      "dominantStyleDescription": "long string (Korean)",
      "colorPsychology": "string (Korean)",
      "colorPsychologyDescription": "long string (Korean)",
      "visualMetaphors": "string (Korean)",
      "keywords": ["string", "string", ...],
      "appCoordinates": [
        { "id": number (from input), "x": number, "y": number }
      ]
    }`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are an expert UI/UX designer specializing in mobile app trends. Output JSON only." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error("No content generated");

        return JSON.parse(content);
    } catch (error) {
        console.error("Error analyzing trends:", error);
        return null;
    }
}
