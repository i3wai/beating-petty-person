import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const images = [
  {
    file: "public/images/purification-ground.jpg",
    prompt: `A dark atmospheric ritual scene viewed from above: a rough stone surface scattered with white rice grains and brown beans in a scattered pattern. Dim warm candlelight casts long shadows from the upper left. Faint smoke wisps drift across the surface. The mood is mysterious, sacred, and ancient — like a traditional Chinese 打小人 ritual at night under a bridge. Dark background, high contrast, cinematic lighting. No people, no text, no watermarks. Photorealistic style, dark moody atmosphere with warm golden highlights on the grains.`,
  },
  {
    file: "public/images/blessing-gold.jpg",
    prompt: `A dramatic ritual scene: a pile of traditional Chinese gold ingots (元寶) glowing with warm golden light, surrounded by burning red paper offerings and flickering golden flames. Incense smoke rises softly. The treasure emanates a radiant warm glow against a deep dark background. Rich warm gold and amber tones. Sacred, opulent, mystical atmosphere. No people, no text, no watermarks. Photorealistic, cinematic lighting with deep shadows and golden highlights.`,
  },
  {
    file: "public/images/divination-ground.jpg",
    prompt: `A dark atmospheric temple floor: two crescent-shaped wooden poe blocks (筊杯) lying on weathered stone ground. Dim candlelight flickers from nearby, casting soft warm shadows. A thin trail of incense smoke drifts across the scene. The ground has subtle ritual markings. Mysterious, sacred, and ancient Chinese temple atmosphere. Deep shadows with warm golden candle highlights on the wooden blocks. No people, no text, no watermarks. Photorealistic, moody, cinematic composition.`,
  },
  // Divination result images — temple sacred atmosphere
  {
    file: "public/images/result-saint.jpg",
    prompt: `Inside an ancient Chinese temple at the decisive moment of divine approval: a beam of brilliant golden light pours down from the temple ceiling directly onto the stone altar floor, illuminating swirling incense smoke that transforms into golden particles rising upward. Red paper lanterns glow warmly on both sides. The atmosphere is triumphant, sacred, and awe-inspiring — as if the gods themselves have answered. Rich gold and deep crimson tones against darkness. Dramatic chiaroscuro lighting. No people, no text, no watermarks. Photorealistic, cinematic, vertical composition.`,
  },
  {
    file: "public/images/result-laugh.jpg",
    prompt: `Inside an ancient Chinese temple shrouded in mystery: thick incense smoke fills the air, creating an ethereal fog that obscures the temple altar and candle flames. The atmosphere is ambiguous and uncertain — the deities are present but withholding their answer. Faint candlelight flickers through the smoke creating soft warm highlights. Muted amber and gray tones dominate. Mysterious, suspenseful, otherworldly mood. No people, no text, no watermarks. Photorealistic, cinematic fog and mist, vertical composition.`,
  },
  {
    file: "public/images/result-anger.jpg",
    prompt: `Inside an ancient Chinese temple at a moment of divine displeasure: a red incense stick has broken in half, its ember glowing bright orange-red against the dark stone floor. The candles on the altar have been blown out, leaving only thin trails of smoke rising into darkness. One red paper lantern swings ominously. The atmosphere is foreboding and tense — crimson red and deep black tones with a single point of orange ember light. Ominous, heavy, ritualistic mood. No people, no text, no watermarks. Photorealistic, cinematic low-key lighting, vertical composition.`,
  },
];

for (const img of images) {
  console.log(`Generating: ${img.file}`);
  console.log(`  Prompt: ${img.prompt.slice(0, 80)}...`);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: img.prompt,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: { aspectRatio: "9:16", imageSize: "2K" },
      },
    });

    let saved = false;
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const buffer = Buffer.from(part.inlineData.data, "base64");
        fs.writeFileSync(img.file, buffer);
        const kb = (buffer.length / 1024).toFixed(0);
        console.log(`  Saved: ${img.file} (${kb}KB)`);
        saved = true;
        break;
      }
    }

    if (!saved) {
      console.error(`  ERROR: No image data in response for ${img.file}`);
      // Print text response for debugging
      for (const part of response.candidates[0].content.parts) {
        if (part.text) console.error(`  Text: ${part.text.slice(0, 200)}`);
      }
    }
  } catch (err) {
    console.error(`  FAILED: ${err.message}`);
  }

  // Brief pause between requests
  await new Promise((r) => setTimeout(r, 2000));
}

console.log("\nDone!");
