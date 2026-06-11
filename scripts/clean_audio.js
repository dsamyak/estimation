import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUDIO_DIR = path.join(__dirname, '../public/assets/audio');
const AUDIO_MAP_FILE = path.join(__dirname, '../src/utils/audioMap.js');

async function run() {
  console.log("🧹 Starting Audio Cleanup...\n");

  try {
    const mapContent = await fs.readFile(AUDIO_MAP_FILE, 'utf-8');
    // Extract the JSON object from inside the ES module file
    const jsonMatch = mapContent.match(/export const audioMap = ({[\s\S]*?});/);
    if (!jsonMatch) {
      console.error("❌ Could not parse audioMap.js");
      return;
    }
    
    const audioMap = JSON.parse(jsonMatch[1]);
    const validFiles = new Set(Object.values(audioMap).map(p => path.basename(p)));

    // Ensure directory exists
    try {
      await fs.access(AUDIO_DIR);
    } catch {
      console.log("Audio directory does not exist, nothing to clean.");
      return;
    }

    const existingFiles = await fs.readdir(AUDIO_DIR);
    let deletedCount = 0;

    for (const file of existingFiles) {
      if (file.endsWith('.mp3') && !validFiles.has(file)) {
        await fs.unlink(path.join(AUDIO_DIR, file));
        console.log(`🗑️ Deleted orphaned file: ${file}`);
        deletedCount++;
      }
    }

    console.log(`\n✅ Cleanup complete. Removed ${deletedCount} orphaned files.\n`);
  } catch (err) {
    console.error("❌ Cleanup failed:", err.message);
  }
}

run();
