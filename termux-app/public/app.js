// ============================================================
// MATTHEW KILCOYNE — Frontend Application
// ============================================================
// Pure JavaScript SPA for the Confluation Engine interview.
// No build step required — runs directly in the browser.

(function () {
  'use strict';

  const $ = (sel) => document.querySelector(sel);
  const app = $('#app');

  // ── State ─────────────────────────────────────────────
  let state = {
    phase: 'welcome',    // welcome | interview | loading | report
    language: 'en',
    messages: [],
    question: null,
    typing: false,
    answers: null,
    report: null,
    ws: null,
    languages: [],
  };

  // ── SVG Icons ─────────────────────────────────────────
  const ICONS = {
    compass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  };

  // ── Common Language Options ───────────────────────────
  const COMMON_LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'it', name: 'Italian' },
    { code: 'nl', name: 'Dutch' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'bn', name: 'Bengali' },
    { code: 'tr', name: 'Turkish' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'th', name: 'Thai' },
    { code: 'pl', name: 'Polish' },
    { code: 'sv', name: 'Swedish' },
    { code: 'sw', name: 'Swahili' },
    { code: 'tl', name: 'Tagalog' },
    { code: 'id', name: 'Indonesian' },
    { code: 'uk', name: 'Ukrainian' },
    { code: 'el', name: 'Greek' },
    { code: 'he', name: 'Hebrew' },
    { code: 'fa', name: 'Persian' },
    { code: 'ur', name: 'Urdu' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'ml', name: 'Malayalam' },
  ];

  // ── WebSocket ─────────────────────────────────────────
  function connectWS() {
    const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${proto}//${location.host}`);

    ws.onopen = () => {
      state.ws = ws;
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      handleServerMessage(msg);
    };

    ws.onclose = () => {
      state.ws = null;
      // Reconnect after 2s
      setTimeout(connectWS, 2000);
    };

    ws.onerror = () => {
      ws.close();
    };
  }

  function send(data) {
    if (state.ws && state.ws.readyState === WebSocket.OPEN) {
      state.ws.send(JSON.stringify(data));
    }
  }

  function handleServerMessage(msg) {
    switch (msg.type) {
      case 'interview-start':
        state.phase = 'interview';
        state.messages = msg.messages;
        state.question = msg.question;
        state.typing = false;
        render();
        break;

      case 'question':
        state.typing = true;
        render();
        // Simulate thinking delay
        setTimeout(() => {
          state.messages = [...state.messages, ...msg.messages];
          state.question = msg.question;
          state.typing = false;
          render();
          scrollMessages();
        }, 800 + Math.random() * 700);
        break;

      case 'interview-complete':
        state.answers = msg.answers;
        state.phase = 'loading';
        state.typing = false;
        render();
        // Generate report locally (mock) or via API
        generateReport(msg.answers);
        break;

      case 'translation':
        // Handle inline translations if needed
        break;

      case 'error':
        console.error('Server error:', msg.message);
        break;
    }
  }

  // ── Report Generation ─────────────────────────────────
  async function generateReport(answers) {
    // Try remote API first, fallback to local synthesis
    try {
      const res = await fetch('/api/keys');
      const keys = await res.json();

      if (keys.configured && keys.configured.length > 0) {
        // Could call Gemini/Claude API here
        // For now, generate a local report
      }
    } catch (e) {
      // Offline — that's fine
    }

    // Local report synthesis
    setTimeout(() => {
      state.report = synthesizeReport(answers);
      state.phase = 'report';
      render();
    }, 2500);
  }

  function synthesizeReport(a) {
    return {
      title: `The ${a.superpower || 'Craft'} × ${a.soft_heart || 'Passion'} Confluation`,
      narrative_thread: `Starting from ${a.origin || 'humble beginnings'}, through the defining pivot of "${a.pivot || 'a bold choice'}", resilience was forged through "${a.struggle || 'real adversity'}". This journey built the foundation for a unique intersection of ${a.superpower || 'deep skill'} and ${a.soft_heart || 'genuine passion'} — a combination that the world hasn't seen packaged this way before.`,
      unfair_advantage: `The ability to bridge ${a.superpower || 'technical expertise'} with authentic understanding of ${a.soft_heart || 'a passion domain'} — informed by lived experience that no competitor can replicate. People recognize this as "${a.compliment || 'something special'}", even if it feels effortless.`,
      confluation_thesis: `Apply ${a.superpower || 'deep craft'} to revolutionize ${a.soft_heart || 'a domain you love'}, solving "${a.friction || 'a real problem'}" for ${a.customer || 'people who need it most'}. This isn't just a career — it's a category of one.`,
      immediate_vision: a.forefront || 'The idea that won\'t let go is the one worth building.',
      legacy: a.legacy || 'A headline the world hasn\'t written yet.',
    };
  }

  // ── Render Functions ──────────────────────────────────
  function render() {
    switch (state.phase) {
      case 'welcome': renderWelcome(); break;
      case 'interview': renderInterview(); break;
      case 'loading': renderLoading(); break;
      case 'report': renderReport(); break;
    }
  }

  function renderWelcome() {
    const langOptions = COMMON_LANGUAGES.map(l =>
      `<option value="${l.code}" ${l.code === state.language ? 'selected' : ''}>${l.name}</option>`
    ).join('');

    app.innerHTML = `
      <div class="welcome">
        <div class="welcome-logo">${ICONS.compass}</div>
        <h1>Matthew Kilcoyne</h1>
        <div class="subtitle">The Confluation Engine</div>
        <p class="description">
          10 questions. Your skills, passions, and life story converge into a
          strategic thesis the world has never seen. Speak in any language.
        </p>
        <div class="language-selector">
          <label>Language</label>
          <select id="lang-select">${langOptions}</select>
        </div>
        <button class="start-btn" id="start-btn">Begin the Interview</button>
        <div class="offline-badge">
          <span class="offline-dot"></span>
          <span>Works offline in 100+ languages</span>
        </div>
      </div>
    `;

    $('#lang-select').addEventListener('change', (e) => {
      state.language = e.target.value;
    });

    $('#start-btn').addEventListener('click', () => {
      state.typing = true;
      state.phase = 'interview';
      state.messages = [];
      render();
      send({ type: 'start', language: state.language });
    });
  }

  function renderInterview() {
    const progress = state.question
      ? (state.question.index / state.question.total) * 100
      : 0;
    const chapterName = state.question?.chapterName || '';
    const qNum = state.question
      ? `${state.question.index + 1} / ${state.question.total}`
      : '';

    const msgsHTML = state.messages.map(m => `
      <div class="msg ${m.sender}">
        <div class="msg-avatar">${m.sender === 'bot' ? 'AI' : 'Y'}</div>
        <div class="msg-bubble">${escapeHTML(m.text)}</div>
      </div>
    `).join('');

    const typingHTML = state.typing ? `
      <div class="typing">
        <div class="msg-avatar" style="background:var(--surface-2);border:1px solid var(--border);color:var(--accent);font-family:var(--serif);font-style:italic;font-size:0.6rem;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;">AI</div>
        <div class="typing-dots">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>
    ` : '';

    app.innerHTML = `
      <div class="interview">
        <div class="interview-header">
          <span class="chapter-label">${chapterName}</span>
          <span class="question-count">${qNum}</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${progress}%"></div>
        </div>
        <div class="messages" id="messages">
          ${msgsHTML}
          ${typingHTML}
        </div>
        <div class="input-area">
          <div class="input-wrapper">
            <textarea id="input" rows="1" placeholder="Type your reflection..." ${state.typing ? 'disabled' : ''}></textarea>
            <button class="send-btn" id="send-btn" ${state.typing ? 'disabled' : ''}>
              ${ICONS.send}
            </button>
          </div>
          <div class="input-meta">Press Enter to send</div>
        </div>
      </div>
    `;

    const input = $('#input');
    const sendBtn = $('#send-btn');

    // Auto-resize textarea
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 120) + 'px';
      sendBtn.disabled = !input.value.trim();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    sendBtn.addEventListener('click', sendMessage);

    // Focus input
    if (!state.typing) {
      setTimeout(() => input.focus(), 100);
    }

    scrollMessages();
  }

  function sendMessage() {
    const input = $('#input');
    const text = input.value.trim();
    if (!text || state.typing) return;

    // Add user message immediately
    state.messages.push({ sender: 'user', text });
    state.typing = true;
    render();

    // Send to server
    send({ type: 'answer', text });
  }

  function scrollMessages() {
    requestAnimationFrame(() => {
      const container = $('#messages');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
  }

  function renderLoading() {
    app.innerHTML = `
      <div class="loading">
        <div class="loading-orb"></div>
        <p>Synthesizing your narrative arc into a strategic thesis...</p>
      </div>
    `;
  }

  function renderReport() {
    const r = state.report;
    if (!r) return;

    app.innerHTML = `
      <div class="report">
        <h1>${escapeHTML(r.title)}</h1>

        <div class="report-section">
          <h2>The Narrative Thread</h2>
          <p>${escapeHTML(r.narrative_thread)}</p>
        </div>

        <div class="report-section">
          <h2>Your Unfair Advantage</h2>
          <p>${escapeHTML(r.unfair_advantage)}</p>
        </div>

        <div class="report-thesis">
          <h2>The Confluation Thesis</h2>
          <p>${escapeHTML(r.confluation_thesis)}</p>
        </div>

        <div class="report-section">
          <h2>What's on Your Mind</h2>
          <p>${escapeHTML(r.immediate_vision)}</p>
        </div>

        <div class="report-section">
          <h2>The 10-Year Headline</h2>
          <p>${escapeHTML(r.legacy)}</p>
        </div>

        <button class="restart-btn" id="restart-btn">Start Over</button>
      </div>
    `;

    $('#restart-btn').addEventListener('click', () => {
      state.phase = 'welcome';
      state.messages = [];
      state.question = null;
      state.answers = null;
      state.report = null;
      render();
    });
  }

  // ── Utilities ─────────────────────────────────────────
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Initialize ────────────────────────────────────────
  connectWS();
  render();
})();
