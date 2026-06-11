import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ELEVENLABS_VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const NARRATION_FILE = path.join(__dirname, '../src/utils/narration.js');
const AUDIO_DIR = path.join(__dirname, '../public/assets/audio');
const AUDIO_MAP_FILE = path.join(__dirname, '../src/utils/audioMap.js');

// Map helper functions to ElevenLabs styles based on audio.js definitions
const STYLE_MAP = {
  say: 'statement',
  ask: 'question',
  cheer: 'encouragement',
  emphasize: 'emphasis',
  think: 'thinking',
  celebrate: 'celebration',
  instruct: 'instruction'
};

const getElevenLabsSettings = (speechStyle) => {
  switch (speechStyle) {
    case 'celebration': return { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true };
    case 'encouragement': return { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true };
    case 'question': return { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true };
    case 'emphasis': return { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true };
    case 'thinking': return { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true };
    default: return { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true };
  }
};

async function getApiKey() {
  try {
    const envContent = await fs.readFile(path.join(__dirname, '../.env.local'), 'utf-8');
    const match = envContent.match(/VITE_ELEVENLABS_API_KEY=(.*)/);
    if (match) return match[1].trim();
  } catch (e) {
    // ignore
  }
  return null;
}

function sanitizeFilename(text) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 40);
}

async function run() {
  console.log("🎙️ Starting Offline Audio Generation Pipeline...\n");

  const apiKey = await getApiKey();
  if (!apiKey) {
    console.error("❌ ERROR: VITE_ELEVENLABS_API_KEY not found in .env.local");
    console.error("Please create a .env.local file in the root directory and add your ElevenLabs API key:");
    console.error("VITE_ELEVENLABS_API_KEY=your_api_key_here\n");
    process.exit(1);
  }

  // Ensure audio directory exists
  try {
    await fs.access(AUDIO_DIR);
  } catch {
    await fs.mkdir(AUDIO_DIR, { recursive: true });
  }

  // Extract phrases from narration.js
  console.log(`📖 Parsing ${path.basename(NARRATION_FILE)}...`);
  const narrationContent = await fs.readFile(NARRATION_FILE, 'utf-8');
  const regex = /(say|ask|cheer|emphasize|think|celebrate|instruct)\(\s*"([^"]+)"/g;
  
  const phrases = [];
  let match;
  while ((match = regex.exec(narrationContent)) !== null) {
    phrases.push({
      type: match[1],
      text: match[2],
      style: STYLE_MAP[match[1]]
    });
  }

  console.log(`Found ${phrases.length} phrases to process.\n`);

  let audioMap = {};
  let generatedCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const filename = `audio_${sanitizeFilename(text)}_${i}.mp3`;
    const filepath = path.join(AUDIO_DIR, filename);
    const relativePath = `/assets/audio/${filename}`;

    audioMap[text] = relativePath;

    try {
      await fs.access(filepath);
      skippedCount++;
      // File exists, skip generation
      continue;
    } catch {
      // File does not exist, generate it
      console.log(`Generating [${style}]: "${text}"`);
      try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': apiKey
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: getElevenLabsSettings(style)
          })
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const buffer = await response.arrayBuffer();
        await fs.writeFile(filepath, Buffer.from(buffer));
        generatedCount++;
        // Sleep to avoid rate limits
        await new Promise(r => setTimeout(r, 500));
      } catch (err) {
        console.error(`❌ Failed to generate audio for: "${text}"`, err.message);
      }
    }
  }

  console.log(`\n✅ Finished generating audio.`);
  console.log(`   Created: ${generatedCount}`);
  console.log(`   Skipped: ${skippedCount} (already existed)`);

  // Write audioMap.js
  const mapContent = `export const audioMap = ${JSON.stringify(audioMap, null, 2)};\n`;
  await fs.writeFile(AUDIO_MAP_FILE, mapContent);
  console.log(`\n✅ Updated audioMap.js with ${Object.keys(audioMap).length} entries.\n`);
}

run();
