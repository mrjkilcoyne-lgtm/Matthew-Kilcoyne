#!/usr/bin/env node

/**
 * TARDAI CLI - The Confluation Engine (Terminal Edition)
 *
 * Run the full career strategy interview from any terminal.
 * Works on Termux (Android), iSH (iOS), or any system with Node.js.
 *
 * Usage:
 *   node cli/tardai.mjs
 *   GEMINI_API_KEY=your-key node cli/tardai.mjs
 */

import { createInterface } from 'readline';

// ── Colors & Formatting ──────────────────────────────────────────────

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  magenta: '\x1b[35m',
  white: '\x1b[97m',
  gray: '\x1b[90m',
  bgDark: '\x1b[48;2;41;37;36m',
  fg: '\x1b[38;2;253;251;247m',
};

const LINE = '─'.repeat(Math.min(process.stdout.columns || 60, 70));
const THIN_LINE = '·'.repeat(Math.min(process.stdout.columns || 60, 70));

function banner() {
  console.clear();
  console.log(`
${c.bold}${c.fg}${c.bgDark}                                                                    ${c.reset}
${c.bold}${c.fg}${c.bgDark}    ████████╗ █████╗ ██████╗ ██████╗  █████╗ ██╗                     ${c.reset}
${c.bold}${c.fg}${c.bgDark}    ╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██╔══██╗██║                     ${c.reset}
${c.bold}${c.fg}${c.bgDark}       ██║   ███████║██████╔╝██║  ██║███████║██║                      ${c.reset}
${c.bold}${c.fg}${c.bgDark}       ██║   ██╔══██║██╔══██╗██║  ██║██╔══██║██║                      ${c.reset}
${c.bold}${c.fg}${c.bgDark}       ██║   ██║  ██║██║  ██║██████╔╝██║  ██║██║                      ${c.reset}
${c.bold}${c.fg}${c.bgDark}       ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝                      ${c.reset}
${c.bold}${c.fg}${c.bgDark}                                                                    ${c.reset}
${c.bold}${c.fg}${c.bgDark}    The Confluation Engine  ·  Career Strategy AI                    ${c.reset}
${c.bold}${c.fg}${c.bgDark}                                                                    ${c.reset}
`);
}

function print(text, color = '') {
  console.log(`${color}${text}${c.reset}`);
}

function printWrapped(text, indent = '  ', maxWidth = 68) {
  const words = text.split(' ');
  let line = indent;
  for (const word of words) {
    if (line.length + word.length + 1 > maxWidth) {
      console.log(line);
      line = indent + word;
    } else {
      line += (line.trim() ? ' ' : '') + word;
    }
  }
  if (line.trim()) console.log(line);
}

// ── Questions ────────────────────────────────────────────────────────

const CHAPTERS = [
  {
    title: 'CHAPTER 1: THE ORIGIN',
    questions: [
      { id: 'origin', text: "Let's start at the beginning. Where did you start in life (geographically or culturally), and what was the first 'world' you felt you truly belonged to?" },
      { id: 'pivot', text: "Most careers have a strange turn. Tell me about a time you made a decision that seemed illogical to others but felt right to you." },
      { id: 'struggle', text: "Resilience is data. What is the hardest professional challenge you've overcome, and what specific skill did you build to survive it?" },
    ]
  },
  {
    title: 'CHAPTER 2: THE ARSENAL',
    questions: [
      { id: 'superpower', text: "If we stripped away your job title, what is the one 'Hard Skill' you possess that you could perform in your sleep? (e.g. negotiation, system architecture, writing)" },
      { id: 'soft_heart', text: "Now the 'Soft Heart'. What is a topic—completely unrelated to work—that you find yourself reading about, watching, or doing when nobody is paying you?" },
      { id: 'compliment', text: "What is the specific thing people constantly compliment you on, which you tend to dismiss as 'easy' or 'nothing special'?" },
    ]
  },
  {
    title: 'CHAPTER 3: THE CONFLUATION',
    questions: [
      { id: 'friction', text: "In that area you love (your soft heart), what is something that is broken, frustrating, or archaic? What makes you angry?" },
      { id: 'customer', text: "If you were to solve that problem, who exactly are you helping? Describe the specific person who would thank you with tears in their eyes." },
      { id: 'forefront', text: "Right now, today, what is at the absolute forefront of your mind? What idea or feeling is occupying your mental RAM?" },
      { id: 'legacy', text: "Final question. Fast forward 10 years. You built something that combined your skill and your passion. What does the headline say?" },
    ]
  }
];

// ── Gemini API ───────────────────────────────────────────────────────

async function callGemini(apiKey, answers) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const body = {
    contents: [{
      parts: [{
        text: `You are "The Confluation Engine", a high-end career strategist and biographer.
Analyze the following interview answers from a user to construct a "Confluation Strategy".

User Data:
${JSON.stringify(answers, null, 2)}

Tone: Professional, insightful, slightly philosophical, encouraging but grounded in reality.

Respond with a JSON object containing exactly these fields:
- title: A catchy, 3-5 word title for the user's new career strategy or business thesis.
- narrative_thread: A 2-sentence summary connecting their origin and pivot to their current state.
- unfair_advantage: Analysis of how their hard skill (superpower) and compliment create a unique edge.
- confluation_thesis: The core opportunity statement: solving the friction for the customer using their specific skills.
- immediate_vision: A directive on how to use their current mental fixation (forefront) to achieve their legacy.`
      }]
    }],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${err}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini');
  return JSON.parse(text);
}

function generateFallbackReport(answers) {
  return {
    title: `${answers.superpower || 'Skill'} for ${answers.soft_heart || 'Passion'}`,
    narrative_thread: `You started in ${answers.origin} and navigated through ${answers.pivot}. This path built the context for your mission.`,
    unfair_advantage: `Your arsenal combines ${answers.superpower} with ${answers.compliment}. This is your unique wedge in the market.`,
    confluation_thesis: `The Opportunity: Solve the frustration of "${answers.friction}" by applying professional-grade "${answers.superpower}" standards.`,
    immediate_vision: `Your mind is fixated on "${answers.forefront}". Use this energy to build towards "${answers.legacy}".`,
  };
}

// ── Interview Engine ─────────────────────────────────────────────────

async function ask(rl, prompt) {
  return new Promise((resolve) => {
    rl.question(`${c.cyan}  > ${c.reset}`, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function runInterview(rl) {
  const answers = {};
  let qNum = 0;

  for (const chapter of CHAPTERS) {
    console.log();
    print(`  ${LINE}`, c.dim);
    print(`  ${chapter.title}`, `${c.bold}${c.yellow}`);
    print(`  ${LINE}`, c.dim);
    console.log();

    for (const q of chapter.questions) {
      qNum++;
      print(`  ${c.dim}[${qNum}/10]${c.reset}`);
      console.log();
      printWrapped(q.text, `  ${c.italic}${c.white}`);
      console.log(`${c.reset}`);

      let answer = '';
      while (!answer) {
        answer = await ask(rl);
        if (!answer) print('  Please provide an answer to continue.', c.dim);
      }
      answers[q.id] = answer;
      console.log();
    }

    // Chapter transition
    if (chapter === CHAPTERS[0]) {
      print('  Excellent context. Now, let\'s look at your capabilities.', `${c.green}${c.italic}`);
      await sleep(800);
    } else if (chapter === CHAPTERS[1]) {
      print('  I see the pattern forming. Now let\'s look for the market gap.', `${c.green}${c.italic}`);
      await sleep(800);
    }
  }

  return answers;
}

// ── Report Display ───────────────────────────────────────────────────

function printReport(report) {
  console.log();
  print(`  ${LINE}`, c.dim);
  print(`  YOUR CONFLUATION STRATEGY`, `${c.bold}${c.magenta}`);
  print(`  ${LINE}`, c.dim);
  console.log();

  const sections = [
    { label: 'TITLE', value: report.title, color: c.bold + c.white },
    { label: 'NARRATIVE THREAD', value: report.narrative_thread, color: c.white },
    { label: 'UNFAIR ADVANTAGE', value: report.unfair_advantage, color: c.cyan },
    { label: 'CONFLUATION THESIS', value: report.confluation_thesis, color: c.yellow },
    { label: 'IMMEDIATE VISION', value: report.immediate_vision, color: c.green },
  ];

  for (const s of sections) {
    print(`  ${s.label}`, `${c.dim}${c.underline}`);
    printWrapped(s.value, `  ${s.color}`);
    console.log(`${c.reset}`);
    console.log(`  ${THIN_LINE}${c.dim}${c.reset}`);
    console.log();
  }
}

// ── Main ─────────────────────────────────────────────────────────────

async function main() {
  banner();

  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';

  print('  Welcome to TARDAI — The Confluation Engine', `${c.bold}${c.white}`);
  print('  Career strategy powered by AI, right from your terminal.', c.dim);
  console.log();

  if (!apiKey) {
    print('  ⚠ No GEMINI_API_KEY found. Will generate a basic report.', c.yellow);
    print('  Set it: export GEMINI_API_KEY=your-key-here', c.dim);
    console.log();
  }

  print('  We have 10 questions to uncover your narrative arc.', c.white);
  print('  Take your time with each answer.', c.dim);
  console.log();

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  try {
    const answers = await runInterview(rl);

    console.log();
    print(`  ${LINE}`, c.dim);
    print('  Synthesizing your narrative...', `${c.italic}${c.magenta}`);

    if (apiKey) {
      try {
        const report = await callGemini(apiKey, answers);
        printReport(report);
      } catch (err) {
        print(`  API Error: ${err.message}`, c.yellow);
        print('  Generating fallback report...', c.dim);
        const report = generateFallbackReport(answers);
        printReport(report);
      }
    } else {
      const report = generateFallbackReport(answers);
      printReport(report);
    }

    print(`  ${LINE}`, c.dim);
    print('  Thank you for using TARDAI.', `${c.bold}${c.white}`);
    print('  Web app: https://ai.studio/apps/drive/1uFrhO2ryvPjf8Vc-sPyFPDNo9kPPfjiy', c.dim);
    console.log();

  } finally {
    rl.close();
  }
}

main().catch((err) => {
  console.error(`${c.yellow}Error: ${err.message}${c.reset}`);
  process.exit(1);
});
