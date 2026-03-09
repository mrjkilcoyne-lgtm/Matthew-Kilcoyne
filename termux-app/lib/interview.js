// ============================================================
// INTERVIEW ENGINE
// ============================================================
// Manages the 10-question Confluation interview flow with
// multilingual support via the local grammar engine.

const QUESTIONS = [
  // Chapter 1: The Origin
  {
    id: 'origin',
    chapter: 1,
    chapterName: 'The Origin',
    text: "Let's start at the beginning. Where did you start in life (geographically or culturally), and what was the first 'world' you felt you truly belonged to?",
  },
  {
    id: 'pivot',
    chapter: 1,
    chapterName: 'The Origin',
    text: "Most careers have a strange turn. Tell me about a time you made a decision that seemed illogical to others but felt right to you.",
  },
  {
    id: 'struggle',
    chapter: 1,
    chapterName: 'The Origin',
    text: "Resilience is data. What is the hardest professional challenge you've overcome, and what specific skill did you build to survive it?",
  },

  // Chapter 2: The Arsenal
  {
    id: 'superpower',
    chapter: 2,
    chapterName: 'The Arsenal',
    text: "Chapter 2: Your Arsenal. If we stripped away your job title, what is the one 'Hard Skill' you possess that you could perform in your sleep?",
  },
  {
    id: 'soft_heart',
    chapter: 2,
    chapterName: 'The Arsenal',
    text: "Now the 'Soft Heart'. What is a topic—completely unrelated to work—that you find yourself reading about, watching, or doing when nobody is paying you?",
  },
  {
    id: 'compliment',
    chapter: 2,
    chapterName: 'The Arsenal',
    text: "What is the specific thing people constantly compliment you on, which you tend to dismiss as 'easy' or 'nothing special'?",
  },

  // Chapter 3: The Confluation
  {
    id: 'friction',
    chapter: 3,
    chapterName: 'The Confluation',
    text: "Chapter 3: The Opportunity. In that area you love (your soft heart), what is something that is broken, frustrating, or archaic?",
  },
  {
    id: 'customer',
    chapter: 3,
    chapterName: 'The Confluation',
    text: "If you were to solve that problem, who exactly are you helping? Describe the specific person who would thank you with tears in their eyes.",
  },
  {
    id: 'forefront',
    chapter: 3,
    chapterName: 'The Confluation',
    text: "Right now, today, what is at the absolute forefront of your mind? What idea or feeling is occupying your mental RAM?",
  },
  {
    id: 'legacy',
    chapter: 3,
    chapterName: 'The Confluation',
    text: "Final question. Fast forward 10 years. You built something that combined your skill and your passion. What does the headline say?",
  },
];

const INTERSTITIALS = {
  3: "Excellent context. Now, let's look at your capabilities.",
  6: "I see the pattern forming. Now let's look for the market gap.",
};

class InterviewEngine {
  constructor(grammar, apiKeys) {
    this.grammar = grammar;
    this.apiKeys = apiKeys;
    this.language = 'en';
    this.questionIndex = 0;
    this.answers = {};
    this.started = false;
  }

  setLanguage(lang) {
    this.language = lang;
  }

  async start(language = 'en') {
    this.language = language;
    this.questionIndex = 0;
    this.answers = {};
    this.started = true;

    const welcome = "Welcome to the deep dive. We have 10 questions to uncover your narrative arc. Take your time.";
    const firstQ = QUESTIONS[0].text;

    let welcomeText = welcome;
    let questionText = firstQ;

    if (language !== 'en' && this.grammar) {
      welcomeText = await this.grammar.localizeQuestion(welcome, language);
      questionText = await this.grammar.localizeQuestion(firstQ, language);
    }

    return {
      type: 'interview-start',
      messages: [
        { sender: 'bot', text: welcomeText },
        { sender: 'bot', text: questionText },
      ],
      question: {
        index: 0,
        total: QUESTIONS.length,
        id: QUESTIONS[0].id,
        chapter: QUESTIONS[0].chapter,
        chapterName: QUESTIONS[0].chapterName,
      },
      language: this.language,
      languageName: this.grammar?.getLanguages().find(l => l.code === language)?.name || language,
    };
  }

  async answer(text) {
    if (!this.started) {
      return { type: 'error', message: 'Interview not started. Send { type: "start" } first.' };
    }

    // Detect language of the answer
    let detectedLang = this.language;
    if (this.grammar) {
      const detection = this.grammar.detectLanguage(text);
      if (detection.confidence > 0.5) {
        detectedLang = detection.code;
      }
    }

    // Extract meaning in English for storage
    let englishAnswer = text;
    if (detectedLang !== 'en' && this.grammar) {
      englishAnswer = await this.grammar.extractMeaning(text, detectedLang);
    }

    // Store the answer
    const currentQ = QUESTIONS[this.questionIndex];
    this.answers[currentQ.id] = englishAnswer;

    this.questionIndex++;

    // Interview complete
    if (this.questionIndex >= QUESTIONS.length) {
      return {
        type: 'interview-complete',
        answers: this.answers,
        message: await this._localize("Your narrative arc is complete. Generating your Confluation report..."),
      };
    }

    // Build response messages
    const messages = [];

    // Check for interstitial
    if (INTERSTITIALS[this.questionIndex]) {
      messages.push({
        sender: 'bot',
        text: await this._localize(INTERSTITIALS[this.questionIndex]),
      });
    }

    // Next question
    const nextQ = QUESTIONS[this.questionIndex];
    messages.push({
      sender: 'bot',
      text: await this._localize(nextQ.text),
    });

    return {
      type: 'question',
      messages,
      question: {
        index: this.questionIndex,
        total: QUESTIONS.length,
        id: nextQ.id,
        chapter: nextQ.chapter,
        chapterName: nextQ.chapterName,
      },
      detectedLanguage: detectedLang,
    };
  }

  async translate(text, from, to) {
    if (!this.grammar) return text;
    return this.grammar.translate(text, from, to);
  }

  async _localize(text) {
    if (this.language === 'en' || !this.grammar) return text;
    return this.grammar.localizeQuestion(text, this.language);
  }

  cleanup() {
    // Session cleanup (grammar engine is shared, don't dispose it)
  }
}

module.exports = { InterviewEngine, QUESTIONS };
