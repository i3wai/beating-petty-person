/**
 * Blog Image Generator — generates ZH blog images via Gemini API
 * Run: node scripts/generate-blog-images.mjs
 */
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import * as path from "node:path";
import { execSync } from "node:child_process";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const OUTPUT_DIR = path.resolve("public/blog");

const images = [
  // ZH1 打小人完整攻略 (Pillar) — need +2
  {
    file: "villain-paper-burning-fire.jpg",
    prompt: "Dark atmospheric illustration of paper effigies burning in a fire basin during a Da Siu Yan curse ritual, flames and smoke rising from human-shaped paper figures, red and gold firelight illuminating the scene, scattered ashes floating in the air. Dark moody background with deep red, orange and black tones. Art style: dark fantasy illustration, cinematic lighting, high contrast. No visible text or words. 16:9 landscape composition."
  },
  {
    file: "online-digital-ritual-screen.jpg",
    prompt: "Dark atmospheric illustration of a smartphone screen glowing in darkness showing a digital villain-hitting ritual, paper effigy on screen with flickering candle flames, sparks flying from touch interactions, mysterious golden symbols and curse inscriptions floating around the device. Art style: dark fantasy meets modern tech, cinematic lighting, high contrast. No visible text or English words. 16:9 landscape composition."
  },

  // ZH2 驚蟄打小人攻略 (Spoke) — need +1
  {
    file: "jingzhe-spring-thunder-awakening.jpg",
    prompt: "Dark atmospheric illustration of spring thunderstorm with lightning striking over misty mountains, insects and creatures awakening from underground, traditional Chinese seasonal imagery with plum blossoms and bamboo. Purple and blue lightning against dark clouds, golden light breaking through. Art style: dark fantasy illustration, cinematic lighting, high contrast. No visible text or English words. 16:9 landscape composition."
  },

  // ZH3 打小人咒語 (Spoke) — need +2 (1 missing + 1 new)
  {
    file: "curse-spell-chanting-ritual.jpg",
    prompt: "Dark atmospheric illustration of an old woman chanting curse spells while beating a paper effigy with a worn shoe, incense smoke swirling around her hands forming mysterious symbols, candlelight casting dancing shadows on a dark wall, ritual tools scattered on a cloth. Art style: dark fantasy illustration, cinematic lighting, high contrast. No visible text or English words. 16:9 landscape composition."
  },
  {
    file: "paper-effigy-beating-closeup.jpg",
    prompt: "Dark atmospheric close-up illustration of a worn old shoe striking a paper effigy on a stone surface, impact creating golden sparks and dust particles, the paper figure has Chinese characters written on it visible but not readable, candle flames reflecting off the shoe. Art style: dark fantasy illustration, cinematic lighting, high contrast. No visible text or English words. 16:9 landscape composition."
  },

  // ZH4 鵝頸橋打小人 (Spoke) — need +2
  {
    file: "elderly-woman-ritual-service.jpg",
    prompt: "Dark atmospheric illustration of an elderly Chinese woman performing a villain-hitting ritual under a concrete bridge, she sits on a small stool surrounded by paper effigies incense and offerings, her weathered hands hold an old shoe above a paper figure, other stalls visible in the misty background. Art style: dark fantasy illustration, cinematic lighting, high contrast. No visible text or English words. 16:9 landscape composition."
  },
  {
    file: "goose-neck-bridge-panoramic.jpg",
    prompt: "Dark atmospheric illustration of a Hong Kong urban underpass at night with multiple elderly women sitting at small stalls performing villain-hitting rituals, rows of burning candles and incense creating a smoky haze, the concrete bridge structure overhead with neon lights reflecting on wet ground. Art style: dark fantasy illustration, cinematic lighting, high contrast. No visible text or English words. 16:9 landscape composition."
  },

  // ZH5 去霉運方法 (Pillar) — need +3
  {
    file: "bad-luck-removal-overview.jpg",
    prompt: "Dark atmospheric illustration of various Chinese folk fortune-improvement methods arranged on a dark wooden table: salt bowls, red string bracelets, incense sticks, paper talismans, a small mirror, and copper coins, all arranged in a circular pattern around a central candle flame. Art style: dark fantasy illustration, cinematic lighting, high contrast. No visible text or English words. 16:9 landscape composition."
  },
  {
    file: "salt-water-purification-bath.jpg",
    prompt: "Dark atmospheric illustration of a purification ritual with coarse salt crystals dissolving in water, the water glowing with subtle golden light, sea salt grains scattered on a dark stone surface, candles arranged around a bowl of clear water creating reflections, mist rising from the water surface. Art style: dark fantasy illustration, cinematic lighting, high contrast. No visible text or English words. 16:9 landscape composition."
  },
  {
    file: "feng-shui-home-luck.jpg",
    prompt: "Dark atmospheric illustration of a traditional Chinese home interior with feng shui elements: a Bagua mirror near the entrance, red lanterns, a small water fountain, bamboo plants, and a crystal arrangement, warm candlelight and incense creating a peaceful yet mysterious atmosphere. Art style: dark fantasy illustration, cinematic lighting, high contrast. No visible text or English words. 16:9 landscape composition."
  },

  // ZH6 犯太歲化解 (Spoke) — need +3
  {
    file: "taisui-temple-worship.jpg",
    prompt: "Dark atmospheric illustration of a grand Chinese temple interior during Taisui worship ceremony, golden statue of a celestial general on an ornate altar, devotees in traditional dress offering incense, red and gold decorations hanging from ceiling, thick incense smoke filling the temple. Art style: dark fantasy illustration, cinematic lighting, high contrast. No visible text or English words. 16:9 landscape composition."
  },
  {
    file: "zodiac-taisui-animals.jpg",
    prompt: "Dark atmospheric illustration of twelve Chinese zodiac animal symbols carved in jade-like stone arranged in a circle, a celestial warrior figure standing in the center representing Taisui, each animal glowing with different colored mystical light, dark cosmic background with stars. Art style: dark fantasy illustration, cinematic lighting, high contrast. No visible text or English words. 16:9 landscape composition."
  },
  {
    file: "protection-charms-red-rope.jpg",
    prompt: "Dark atmospheric illustration of Chinese protection talismans and charms: red string bracelets, a yellow paper talisman with mystical symbols, a jade pendant, five emperor coins tied with red thread, and a small jade gourd, all arranged on dark silk cloth with candlelight creating warm golden reflections. Art style: dark fantasy illustration, cinematic lighting, high contrast. No visible text or English words. 16:9 landscape composition."
  },

  // ZH7 鬼月禁忌與化解 (Spoke) — need +2 (1 missing + 1 new)
  {
    file: "ghost-month-atmosphere.jpg",
    prompt: "Dark atmospheric illustration of a narrow old Chinese street during Ghost Month, red paper lanterns swaying in wind, incense smoke rising from roadside altars, ghostly silhouettes in the mist between buildings, a lone figure walking carefully avoiding shadows, red and amber light contrasting with deep darkness. Art style: dark fantasy illustration, cinematic lighting, high contrast. No visible text or English words. 16:9 landscape composition."
  },
  {
    file: "zhongyuan-festival-offerings.jpg",
    prompt: "Dark atmospheric illustration of Zhongyuan Festival offerings arranged on a long table: three animal offerings, fruits stacked high, stacks of spirit money and gold paper ready to burn, red candles burning at both ends, incense sticks standing in a bronze censor, ghostly light emanating from the offerings. Art style: dark fantasy illustration, cinematic lighting, high contrast. No visible text or English words. 16:9 landscape composition."
  },

  // ZH8 小人作祟的徵兆 (Spoke) — need +2 (1 missing + 1 new)
  {
    file: "petty-person-signs-surrounded.jpg",
    prompt: "Dark atmospheric illustration of a person standing alone in shadows surrounded by vague dark silhouettes of figures whispering and pointing, the central figure illuminated from below by candlelight showing anxiety on their face, deep red and dark gold color palette, broken mirrors and scattered papers on the ground. Art style: dark fantasy illustration, cinematic lighting, high contrast. No visible text or English words. 16:9 landscape composition."
  },
  {
    file: "villain-protection-defense.jpg",
    prompt: "Dark atmospheric illustration of protective methods against petty persons: a hand holding a mirror reflecting dark shadows away, salt scattered in a line across a doorway, a red string bracelet glowing faintly, and paper talismans pasted on a wall, all connected by threads of golden light forming a protective barrier. Art style: dark fantasy illustration, cinematic lighting, high contrast. No visible text or English words. 16:9 landscape composition."
  },

  // ZH9 詛咒術大比較 (Pillar) — need +1 (1 missing, reuse curse-traditions-world.jpg)
  {
    file: "global-curse-traditions-map.jpg",
    prompt: "Dark atmospheric illustration of an ancient world map on aged parchment showing six curse traditions marked with glowing mystical symbols at their origins: West Africa, Caribbean, Southeast Asia, China, Egypt, and Europe, each location emitting different colored magical energy, connected by faint lines of arcane power. Art style: dark fantasy illustration, cinematic lighting, high contrast. No visible text or English words. 16:9 landscape composition."
  },

  // ZH10 打小人的歷史 (Spoke) — need +1 (1 missing, reuse history-goose-neck-bridge.jpg, history-paper-burning-seal.jpg)
  {
    file: "qing-dynasty-villain-hitting.jpg",
    prompt: "Dark atmospheric illustration of a Qing Dynasty rural village scene at dusk, an elderly woman in traditional clothing beating a paper figure with an old shoe on a dirt path, villagers watching from a distance, thatched-roof farmhouses and green mountains in the background, candle fire illuminating ink marks on the paper figure. Art style: dark fantasy illustration, cinematic lighting, high contrast. No visible text or English words. 16:9 landscape composition."
  },

  // ZH11 台灣打小人文化 (Spoke) — need +2 (1 missing + 1 new)
  {
    file: "taiwan-temple-petty-person.jpg",
    prompt: "Dark atmospheric illustration inside an ancient Taiwanese temple with red lanterns hanging from carved wooden ceiling, paper effigies and offerings arranged on a wooden altar table, incense smoke curling upward, blurred deity statues in the background, warm candlelight creating a mysterious folk religion atmosphere. Art style: dark fantasy illustration, cinematic lighting, high contrast. No visible text or English words. 16:9 landscape composition."
  },
  {
    file: "taiwan-folk-ritual-elements.jpg",
    prompt: "Dark atmospheric illustration of Taiwanese folk ritual elements: a paper effigy with traditional Chinese talisman patterns, a bowl of rice with incense sticks, spirit money in gold and silver, a small statue of a local deity, and a divination crescent blocks, all arranged on a red cloth under warm candlelight. Art style: dark fantasy illustration, cinematic lighting, high contrast. No visible text or English words. 16:9 landscape composition."
  },
];

async function generateImage(img, index, total) {
  const outputPath = path.join(OUTPUT_DIR, img.file);

  // Skip if already exists
  if (fs.existsSync(outputPath)) {
    console.log(`[${index + 1}/${total}] SKIP (exists): ${img.file}`);
    return true;
  }

  console.log(`[${index + 1}/${total}] Generating: ${img.file}`);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: img.prompt,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: { aspectRatio: "16:9", imageSize: "2K" }
      }
    });

    let imageData = null;
    let mimeType = "image/png";

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageData = Buffer.from(part.inlineData.data, "base64");
        mimeType = part.inlineData.mimeType || "image/png";
      }
    }

    if (!imageData) {
      console.log(`  FAILED: No image data in response`);
      return false;
    }

    // Save as PNG first
    const tempPath = outputPath.replace(".jpg", ".tmp.png");
    fs.writeFileSync(tempPath, imageData);

    // Convert to JPG and resize using sips (macOS)
    try {
      execSync(`sips -s format jpeg -s formatOptions 80 -z 630 1200 "${tempPath}" --out "${outputPath}" 2>/dev/null`);
      fs.unlinkSync(tempPath);
    } catch {
      // If sips fails, just rename the PNG to JPG (browser can handle it)
      fs.renameSync(tempPath, outputPath);
    }

    const stats = fs.statSync(outputPath);
    console.log(`  OK: ${(stats.size / 1024).toFixed(0)}KB → ${img.file}`);
    return true;
  } catch (err) {
    console.log(`  ERROR: ${err.message?.slice(0, 100)}`);
    return false;
  }
}

async function main() {
  console.log(`\n=== Blog Image Generator ===`);
  console.log(`Images to generate: ${images.length}`);
  console.log(`Output: ${OUTPUT_DIR}\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < images.length; i++) {
    const ok = await generateImage(images[i], i, images.length);
    if (ok) success++;
    else failed++;

    // Rate limit: wait 2s between requests
    if (i < images.length - 1) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log(`\n=== Done: ${success} success, ${failed} failed ===`);
}

main().catch(console.error);
