import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import { execSync } from "node:child_process";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const images = [
  {
    file: "what-is-black-magic-dark-altar.jpg",
    prompt: "Dark atmospheric photograph of ancient black magic artifacts arranged on a weathered stone altar. A cracked clay curse tablet with faded inscriptions, three dripping black candles with amber flames, scattered dried herbs and roots, and a small paper human effigy. Warm flickering candlelight casting deep red and gold tones. Dark moody background with charcoal black and deep burgundy. Art style: photorealistic dark fantasy, cinematic chiaroscuro lighting, high contrast. No visible text or English words. 16:9 landscape composition."
  },
  {
    file: "what-is-black-magic-global-traditions.jpg",
    prompt: "Dark atmospheric photograph of global dark magic traditions arranged on a dark velvet surface. A Mesopotamian clay tablet with cuneiform, an Egyptian smashed pottery figurine, a Chinese paper effigy with incense sticks, Voodoo ceremony items including a small doll and bones, and European black candles with dried herbs. All artifacts arranged in a gentle arc. Warm golden and deep red lighting from above. Art style: museum exhibit photography with dark fantasy atmosphere, cinematic lighting, high contrast. No visible text or English words. 16:9 landscape composition."
  },
  {
    file: "what-is-black-magic-ritual-tools.jpg",
    prompt: "Dark atmospheric photograph of curse ritual tools arranged in a circle on dark worn cloth. A paper human effigy in the center, iron nails, a single lit black candle with dripping wax, red thread wrapped around a wooden spool, and scattered sea salt crystals. A single warm amber light source from the left creating dramatic shadows and contrast. Art style: photorealistic still life, cinematic chiaroscuro, high contrast. No visible text or English words. 16:9 landscape composition."
  },
  {
    file: "what-is-black-magic-curse-removal.jpg",
    prompt: "Dark atmospheric photograph of a curse removal ritual scene. A paper effigy dissolving in eerie green flame at the center, scattered salt forming a protective circle, burning sage bundles with wisps of smoke rising, and a small jade protective talisman glowing faintly. Deep green and warm amber lighting with dark shadows suggesting purification and spiritual release. Art style: photorealistic dark fantasy, cinematic lighting, high contrast. No visible text or English words. 16:9 landscape composition."
  }
];

const outDir = "public/blog";
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

for (const img of images) {
  const outPath = `${outDir}/${img.file}`;
  console.log(`Generating: ${img.file}...`);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: img.prompt,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: { aspectRatio: "16:9", imageSize: "2K" }
      }
    });

    let saved = false;
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const buffer = Buffer.from(part.inlineData.data, "base64");
        // Save raw first
        const rawPath = outPath.replace(".jpg", "-raw.png");
        fs.writeFileSync(rawPath, buffer);
        console.log(`  Saved raw: ${rawPath} (${(buffer.length / 1024).toFixed(0)} KB)`);

        // Resize to 1200x630 and convert to JPEG using sips
        execSync(`sips -z 630 1200 -s format jpeg -s formatOptions 0.8 "${rawPath}" --out "${outPath}"`, { stdio: "pipe" });
        // Clean up raw
        fs.unlinkSync(rawPath);

        const finalSize = fs.statSync(outPath).size;
        console.log(`  Saved: ${outPath} (${(finalSize / 1024).toFixed(0)} KB)`);
        saved = true;
        break;
      }
    }
    if (!saved) console.log(`  ERROR: No image data in response`);
  } catch (e) {
    console.log(`  ERROR: ${e.message}`);
  }
}

console.log("\nDone.");
