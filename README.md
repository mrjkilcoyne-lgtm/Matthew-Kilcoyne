<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1uFrhO2ryvPjf8Vc-sPyFPDNo9kPPfjiy

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Claude Brain (Persistent Memory)

This project is configured with [claude-brain](https://github.com/memvid/claude-brain) for persistent AI memory across Claude Code sessions. Project context is stored in `CLAUDE.md` and session memory lives in `.claude/mind.mv2`.

### Setup

1. Configure Git for GitHub plugins (if not already done):
   ```
   git config --global url."https://github.com/".insteadOf "git@github.com:"
   ```
2. In Claude Code, install the plugin:
   ```
   /plugin add marketplace memvid/claude-brain
   ```
3. Enable the plugin: `/plugins` → Installed → **mind** → Enable Plugin → Restart

### Usage

- `/mind stats` - View memory statistics
- `/mind search <query>` - Search past context
- `/mind ask <question>` - Ask questions about stored memories
- `/mind recent [count]` - Show recent activity
