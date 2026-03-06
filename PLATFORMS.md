# TARDAI - Multi-Platform Guide

TARDAI (The Confluation Engine) runs on three platforms: **Web App**, **Native App (PWA)**, and **Terminal (CLI)**.

---

## Web App

Visit the deployed app directly in any browser:

**URL:** https://ai.studio/apps/drive/1uFrhO2ryvPjf8Vc-sPyFPDNo9kPPfjiy

Or run locally:
```bash
npm run dev
# Opens at http://localhost:3000
```

---

## Native App (PWA - Install on Phone)

### Android (Chrome)
1. Open the web app URL in Chrome
2. Tap the **"Install TARDAI"** banner that appears, or
3. Tap the three-dot menu → **"Install app"** / **"Add to Home Screen"**
4. TARDAI appears on your home screen as a standalone app

### iOS (Safari)
1. Open the web app URL in Safari
2. Tap the **Share** button (square with arrow)
3. Scroll down → **"Add to Home Screen"**
4. Tap **"Add"**
5. TARDAI appears on your home screen with its own icon

### Desktop (Chrome/Edge)
1. Open the web app URL
2. Click the install icon in the address bar, or
3. Menu → **"Install TARDAI"**

The PWA works offline for cached content and provides a native app experience with no app store required.

---

## Terminal / CLI

Run TARDAI from any terminal — works on phones (Termux, iSH), desktops, servers, and SSH sessions.

### Quick Start
```bash
# Run directly
node cli/tardai.mjs

# Or via npm script
npm run tardai

# With AI-powered reports (get key at https://aistudio.google.com/apikey)
GEMINI_API_KEY=your-key node cli/tardai.mjs
```

### Android (Termux)
1. Install [Termux](https://f-droid.org/en/packages/com.termux/) from F-Droid
2. Run the setup script:
```bash
curl -sL https://raw.githubusercontent.com/mrjkilcoyne-lgtm/Matthew-Kilcoyne/main/cli/setup-termux.sh | bash
```
3. Or manually:
```bash
pkg install nodejs git -y
git clone <repo-url> ~/tardai
node ~/tardai/cli/tardai.mjs
```

### iOS (iSH / a-Shell)
1. Install [iSH](https://apps.apple.com/app/ish-shell/id1436902243) from the App Store
2. In iSH:
```bash
apk add nodejs git
git clone <repo-url> ~/tardai
node ~/tardai/cli/tardai.mjs
```

### Any System with Node.js
```bash
# Global install from the repo
npm install -g .
tardai

# Or npx (no install)
npx tardai
```

---

## Platform Comparison

| Feature | Web App | PWA (Native) | CLI (Terminal) |
|---------|---------|--------------|----------------|
| Full interview | Yes | Yes | Yes |
| AI report generation | Yes | Yes | Yes (with API key) |
| Social Pulse dashboard | Yes | Yes | No |
| Offline support | No | Partial | No |
| Home screen icon | No | Yes | No |
| Works on Android | Yes | Yes | Yes (Termux) |
| Works on iOS | Yes | Yes | Yes (iSH) |
| Works on desktop | Yes | Yes | Yes |
| No browser needed | No | Partial | Yes |
| Works over SSH | No | No | Yes |
