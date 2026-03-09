#!/usr/bin/env node
// ============================================================
// MODEL DOWNLOADER
// ============================================================
// Downloads the TinyLlama GGUF model for offline grammar support.
// Run: npm run setup-model

const https = require('https');
const fs = require('fs');
const path = require('path');

const MODEL_DIR = path.join(__dirname, '..', 'models');
const MODEL_FILE = 'tinyllama-1.1b-chat.Q4_K_M.gguf';
const MODEL_URL = 'https://huggingface.co/Mozilla/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/TinyLlama-1.1B-Chat-v1.0.Q4_K_M.gguf';

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
  return (bytes / 1073741824).toFixed(2) + ' GB';
}

async function download() {
  const dest = path.join(MODEL_DIR, MODEL_FILE);

  if (fs.existsSync(dest)) {
    const stat = fs.statSync(dest);
    console.log(`Model already exists (${formatBytes(stat.size)})`);
    console.log(`Path: ${dest}`);
    return;
  }

  fs.mkdirSync(MODEL_DIR, { recursive: true });

  console.log('Downloading TinyLlama 1.1B (Q4_K_M)...');
  console.log(`From: ${MODEL_URL}`);
  console.log(`To:   ${dest}`);
  console.log('');

  return new Promise((resolve, reject) => {
    const follow = (url) => {
      https.get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          follow(res.headers.location);
          return;
        }

        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }

        const total = parseInt(res.headers['content-length'], 10) || 0;
        let downloaded = 0;
        const file = fs.createWriteStream(dest);

        res.on('data', (chunk) => {
          downloaded += chunk.length;
          file.write(chunk);

          if (total > 0) {
            const pct = ((downloaded / total) * 100).toFixed(1);
            const bar = '█'.repeat(Math.floor(pct / 2.5)) + '░'.repeat(40 - Math.floor(pct / 2.5));
            process.stdout.write(`\r  [${bar}] ${pct}% (${formatBytes(downloaded)} / ${formatBytes(total)})`);
          }
        });

        res.on('end', () => {
          file.end();
          console.log('\n');
          console.log(`✓ Downloaded: ${formatBytes(downloaded)}`);
          resolve();
        });

        res.on('error', reject);
      }).on('error', reject);
    };

    follow(MODEL_URL);
  });
}

download().catch((err) => {
  console.error(`✗ Download failed: ${err.message}`);
  process.exit(1);
});
