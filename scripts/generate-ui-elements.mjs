import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const OUTPUT = "public/images";

const images = [
  {
    file: `${OUTPUT}/poe-block-face-up.png`,
    prompt: `A single traditional Chinese wooden poe block (筊杯), crescent moon shape, face-up showing the flat red-painted surface with subtle gold edge detail. Dark atmospheric lighting, warm golden glow around edges. Top-down angle, on near-black background (#1a1a1a). Photorealistic, high detail on red lacquer and wood grain texture. No text, no watermarks.`,
    config: { aspectRatio: "1:1", imageSize: "1K" },
  },
  {
    file: `${OUTPUT}/poe-block-face-down.png`,
    prompt: `A single traditional Chinese wooden poe block (筊杯), crescent moon shape, face-down showing the rounded natural wood grain surface with visible age patina and wear marks. Dark atmospheric lighting, subtle warm golden glow around edges. Top-down angle, on near-black background (#1a1a1a). Photorealistic, high detail on aged wood texture. No text, no watermarks.`,
    config: { aspectRatio: "1:1", imageSize: "1K" },
  },
  {
    file: `${OUTPUT}/talisman-glow.png`,
    prompt: `A traditional Chinese Taoist talisman (符咒) radiating intense golden light from its center. Yellow-brown paper with bold red ink calligraphy and mystical symbols, decorative border patterns with cloud motifs. Surrounded by wisps of golden smoke and faint spark particles. Dark atmospheric background (#1a1a1a). Cinematic supernatural lighting, the talisman appears to glow from within. Front view, centered composition. Ancient and powerful aesthetic. No people, no watermarks.`,
    config: { aspectRatio: "1:1", imageSize: "1K" },
  },
  {
    file: `${OUTPUT}/stamp-saint.png`,
    prompt: `A traditional Chinese square seal stamp impression in bright gold ink on dark paper (#1a1a1a). Inside a decorative square border, the Chinese character 聖 written in ancient seal script (篆書). Radiating warm golden glow, sacred mystical energy. Clean powerful composition, centered, minimal. The seal should look ancient and authoritative. No watermarks.`,
    config: { aspectRatio: "1:1", imageSize: "512" },
  },
  {
    file: `${OUTPUT}/stamp-laugh.png`,
    prompt: `A traditional Chinese square seal stamp impression in silver-gray ink on dark paper (#1a1a1a). Inside a decorative square border, the Chinese character 笑 written in ancient seal script (篆書). Subtle cool silvery glow, enigmatic mysterious energy. Clean minimal composition, centered. No watermarks.`,
    config: { aspectRatio: "1:1", imageSize: "512" },
  },
  {
    file: `${OUTPUT}/stamp-anger.png`,
    prompt: `A traditional Chinese square seal stamp impression in vermillion red ink on dark paper (#1a1a1a). Inside a decorative square border, the Chinese character 怒 written in ancient seal script (篆書). Intense red glow radiating outward, ominous threatening energy. Clean powerful composition, centered, minimal. No watermarks.`,
    config: { aspectRatio: "1:1", imageSize: "512" },
  },
  {
    file: `${OUTPUT}/grain-scatter.png`,
    prompt: `A close-up top-down view of mixed Chinese ritual offering grains scattered on dark stone — white rice grains, red beans, green mung beans, golden sesame seeds, and small peanut halves. Spread naturally in a loose radial scattering pattern as if just thrown by hand. Warm golden overhead lighting, deep shadows between grains. Photorealistic, ultra high detail on each individual grain. Dark moody ritual atmosphere. No people, no text, no watermarks.`,
    config: { aspectRatio: "1:1", imageSize: "1K" },
  },
  {
    file: `${OUTPUT}/gold-ingots-float.png`,
    prompt: `Traditional Chinese gold ingots (元寶) — boat-shaped shiny gold pieces — and strips of gold joss paper (金紙) floating and slowly descending through dark air, trailing small golden light particles and sparks. Warm amber golden glow emanating from each ingot. Dark atmospheric background (#1a1a1a). Cinematic mystical supernatural mood. The ingots should look like traditional Chinese boat-shaped gold ingots with reflective surfaces. No people, no text, no watermarks.`,
    config: { aspectRatio: "3:4", imageSize: "1K" },
  },
];

async function main() {
  console.log(`Generating ${images.length} ritual UI element images...\n`);
  
  let success = 0;
  let failed = 0;

  for (const img of images) {
    if (fs.existsSync(img.file)) {
      console.log(`⏭  ${img.file} exists, skipping`);
      success++;
      continue;
    }

    console.log(`🎨 ${img.file}`);
    const start = Date.now();

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-image-preview",
        contents: img.prompt,
        config: {
          responseModalities: ["TEXT", "IMAGE"],
          imageConfig: img.config,
        },
      });

      let saved = false;
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const buffer = Buffer.from(part.inlineData.data, "base64");
          fs.writeFileSync(img.file, buffer);
          const kb = (buffer.length / 1024).toFixed(0);
          console.log(`  ✅ Saved (${kb}KB, ${Date.now() - start}ms)`);
          saved = true;
          success++;
          break;
        }
      }
      if (!saved) {
        console.error(`  ❌ No image data in response`);
        failed++;
      }
    } catch (err) {
      console.error(`  ❌ ${err.message}`);
      failed++;
    }

    await new Promise((r) => setTimeout(r, 3000));
  }

  console.log(`\nDone! ${success} success, ${failed} failed`);
}

main();
