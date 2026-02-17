# The Confluation Engine

## Project Overview

An AI-powered career strategy and narrative discovery application that helps users blend their skills, passions, and life experiences into a unified career or business thesis with actionable next steps.

**Deployed at:** https://ai.studio/apps/drive/1uFrhO2ryvPjf8Vc-sPyFPDNo9kPPfjiy

## Tech Stack

- **Frontend:** React 19 with TypeScript
- **Build:** Vite 6
- **AI:** Google Generative AI (`@google/genai`) using Gemini 2.5 Flash
- **Styling:** Tailwind CSS 3 (CDN) with Playfair Display (serif) and Inter (sans-serif)
- **Icons:** Lucide React
- **Markdown:** React Markdown

## Architecture

### Application Flow (4 Phases)

1. **Welcome** - Landing screen with CTA to start interview
2. **Interview** - 10-question conversational AI chat across 3 chapters:
   - Chapter 1: The Origin (questions 1-3) - background, pivots, challenges
   - Chapter 2: The Arsenal (questions 4-6) - skills, passions, strengths
   - Chapter 3: The Confluation (questions 7-10) - opportunities, vision, legacy
3. **Analysis** - Loading state while Gemini synthesizes interview data
4. **Report** - Strategic document with narrative thread, unfair advantage, thesis, and action engine

### Key Files

- `App.tsx` - Main component with phase state management
- `index.tsx` - React root entry point
- `index.html` - HTML shell with Tailwind and font imports
- `types.ts` - TypeScript interfaces (Message, InterviewAnswers, ReportData, Question)
- `vite.config.ts` - Vite config with React plugin and API key injection
- `components/Welcome.tsx` - Welcome screen
- `components/Interview.tsx` - Chat interface with progress tracking
- `components/Report.tsx` - Strategic document display
- `components/ActionTabs.tsx` - Tabbed interface for research, grants, career pivot
- `services/geminiService.ts` - Gemini API integration (report generation + market research)

### Environment

- `GEMINI_API_KEY` required in `.env.local`
- Dev server runs on port 3000

## Conventions

- React functional components with hooks
- TypeScript strict mode
- Tailwind utility classes for styling
- Gemini structured JSON schema for AI responses

## Claude Brain (memvid/claude-brain)

This project uses the [claude-brain](https://github.com/memvid/claude-brain) plugin for persistent memory across Claude Code sessions. Memory is stored in `.claude/mind.mv2`.

### Memory Commands

- `/mind stats` - View memory statistics
- `/mind search <query>` - Search past context
- `/mind ask <question>` - Ask questions about stored memories
- `/mind recent [count]` - Show recent activity
