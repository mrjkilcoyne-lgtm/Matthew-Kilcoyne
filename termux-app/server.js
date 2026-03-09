// ============================================================
// MATTHEW KILCOYNE — Server
// ============================================================
// Express server with WebSocket for real-time interview flow
// and local LLM integration for offline multilingual support.

const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const path = require('path');
const { GrammarEngine } = require('./lib/grammar');
const { InterviewEngine } = require('./lib/interview');

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// API key injection endpoint (user provides on open)
let apiKeys = {};
app.post('/api/keys', (req, res) => {
  apiKeys = { ...apiKeys, ...req.body };
  res.json({ ok: true, keys: Object.keys(apiKeys) });
});

app.get('/api/keys', (_req, res) => {
  res.json({ configured: Object.keys(apiKeys) });
});

// Grammar engine (loaded once at startup)
let grammar = null;

async function initGrammar() {
  try {
    grammar = new GrammarEngine();
    await grammar.init();
    console.log('  ✓ Local grammar model loaded — offline multilingual ready');
  } catch (err) {
    console.log('  ⚠ Grammar model not available — using built-in rules');
    console.log(`    ${err.message}`);
    grammar = new GrammarEngine();
    grammar.useFallback();
  }
}

// WebSocket interview sessions
wss.on('connection', (ws) => {
  const session = new InterviewEngine(grammar, apiKeys);

  ws.on('message', async (data) => {
    try {
      const msg = JSON.parse(data.toString());

      switch (msg.type) {
        case 'start': {
          const lang = msg.language || 'en';
          const welcome = await session.start(lang);
          ws.send(JSON.stringify(welcome));
          break;
        }

        case 'answer': {
          const response = await session.answer(msg.text);
          ws.send(JSON.stringify(response));
          break;
        }

        case 'translate': {
          const translated = await session.translate(msg.text, msg.from, msg.to);
          ws.send(JSON.stringify({ type: 'translation', text: translated }));
          break;
        }

        case 'set-language': {
          session.setLanguage(msg.language);
          ws.send(JSON.stringify({ type: 'language-set', language: msg.language }));
          break;
        }

        default:
          ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
      }
    } catch (err) {
      ws.send(JSON.stringify({ type: 'error', message: err.message }));
    }
  });

  ws.on('close', () => {
    session.cleanup();
  });
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    grammar: grammar?.isReady() ?? false,
    model: grammar?.getModelInfo() ?? null,
  });
});

// Start
async function main() {
  console.log('');
  console.log('  ╔══════════════════════════════════════╗');
  console.log('  ║  MATTHEW KILCOYNE                    ║');
  console.log('  ║  The Confluation Engine               ║');
  console.log('  ╚══════════════════════════════════════╝');
  console.log('');

  await initGrammar();

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`  ✓ Server running on http://localhost:${PORT}`);
    console.log('  ✓ Open in Chrome to begin your interview');
    console.log('');
  });
}

main().catch(console.error);
