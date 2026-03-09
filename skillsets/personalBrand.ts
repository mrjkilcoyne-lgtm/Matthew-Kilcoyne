// ============================================================
// SKILLSET 2: PERSONAL BRAND ARCHITECT
// ============================================================
// Constructs a complete personal brand identity from interview data,
// including voice, visual identity, platform strategy, and pillars.

import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SkillsetContext, PersonalBrand } from './types';

const apiKey = process.env.API_KEY || '';

const brandSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    brandStatement: { type: Type.STRING, description: "1-2 sentence personal brand positioning statement" },
    tagline: { type: Type.STRING, description: "5-8 word tagline for bios and headers" },
    elevatorPitch: { type: Type.STRING, description: "30-second elevator pitch" },
    pillars: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          pillar: { type: Type.STRING },
          description: { type: Type.STRING },
          contentThemes: { type: Type.ARRAY, items: { type: Type.STRING } },
          platforms: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["pillar", "description", "contentThemes", "platforms"],
      },
    },
    voice: {
      type: Type.OBJECT,
      properties: {
        tone: { type: Type.STRING },
        vocabulary: { type: Type.ARRAY, items: { type: Type.STRING } },
        avoidWords: { type: Type.ARRAY, items: { type: Type.STRING } },
        examplePost: { type: Type.STRING },
      },
      required: ["tone", "vocabulary", "avoidWords", "examplePost"],
    },
    visualIdentity: {
      type: Type.OBJECT,
      properties: {
        colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } },
        fontSuggestion: { type: Type.STRING },
        imageryStyle: { type: Type.STRING },
      },
      required: ["colorPalette", "fontSuggestion", "imageryStyle"],
    },
    platformStrategy: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          platform: { type: Type.STRING },
          role: { type: Type.STRING },
          frequency: { type: Type.STRING },
          contentMix: { type: Type.STRING },
        },
        required: ["platform", "role", "frequency", "contentMix"],
      },
    },
  },
  required: ["brandStatement", "tagline", "elevatorPitch", "pillars", "voice", "visualIdentity", "platformStrategy"],
};

export const generatePersonalBrand = async (ctx: SkillsetContext): Promise<PersonalBrand> => {
  if (!apiKey) return getMockPersonalBrand(ctx);

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
      You are an elite personal branding strategist who has built brands for founders, creators, and thought leaders.

      Build a complete personal brand for someone with this profile:
      - Origin: "${ctx.answers.origin}"
      - Key Pivot: "${ctx.answers.pivot}"
      - Hard Skill: "${ctx.answers.superpower}"
      - Passion: "${ctx.answers.soft_heart}"
      - What People Compliment: "${ctx.answers.compliment}"
      - Legacy Vision: "${ctx.answers.legacy}"
      - Confluation Thesis: "${ctx.report.confluation_thesis}"

      Create:
      1. A brand positioning statement and tagline
      2. A 30-second elevator pitch
      3. 3-4 content pillars with themes and platform alignment
      4. A specific brand voice (tone, vocabulary to use/avoid, example post)
      5. Visual identity direction (colors, fonts, imagery style)
      6. Platform-specific strategy (which platforms, what role each plays, posting frequency)

      Make it authentic to their story. No corporate jargon. This should feel like THEM, amplified.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: brandSchema,
      temperature: 0.8,
    },
  });

  if (response.text) {
    return JSON.parse(response.text) as PersonalBrand;
  }
  throw new Error("Empty response from Personal Brand skillset");
};

const getMockPersonalBrand = (ctx: SkillsetContext): PersonalBrand => ({
  brandStatement: `I help ${ctx.answers.customer || 'people'} solve ${ctx.answers.friction || 'complex problems'} by applying ${ctx.answers.superpower || 'deep expertise'} to the world of ${ctx.answers.soft_heart || 'what matters'}.`,
  tagline: `${ctx.answers.superpower || 'Skill'} meets ${ctx.answers.soft_heart || 'passion'} — building what's next.`,
  elevatorPitch: `I started in ${ctx.answers.origin || 'an unexpected place'}, made a pivot that changed everything, and discovered that my ability in ${ctx.answers.superpower || 'my craft'} combined with my obsession with ${ctx.answers.soft_heart || 'my passion'} creates something nobody else is building. I'm here to help ${ctx.answers.customer || 'the right people'} overcome ${ctx.answers.friction || 'their biggest challenge'}.`,
  pillars: [
    {
      pillar: "Origin & Journey",
      description: "Share the path that led to this unique intersection",
      contentThemes: ["Lessons from pivots", "Behind-the-scenes decisions", "Failure stories that built resilience"],
      platforms: ["LinkedIn", "Substack"],
    },
    {
      pillar: "Deep Craft",
      description: `Demonstrate mastery in ${ctx.answers.superpower || 'your core skill'}`,
      contentThemes: ["How-to breakdowns", "Industry analysis", "Contrarian takes on best practices"],
      platforms: ["X", "YouTube", "LinkedIn"],
    },
    {
      pillar: "Passion Lens",
      description: `Bring fresh perspective from ${ctx.answers.soft_heart || 'your passion area'}`,
      contentThemes: ["Cross-pollination insights", "Unusual inspirations", "What this world can learn from that one"],
      platforms: ["Instagram", "TikTok", "X"],
    },
    {
      pillar: "Vision & Future",
      description: "Share the future you're building toward and invite others into it",
      contentThemes: ["Industry predictions", "What I'm building and why", "The world I want to create"],
      platforms: ["LinkedIn", "Substack", "X"],
    },
  ],
  voice: {
    tone: "Authoritative but approachable. Like a mentor who's been through it and speaks plainly.",
    vocabulary: ["first principles", "the real question is", "here's what nobody tells you", "I've seen this pattern", "let me break this down"],
    avoidWords: ["synergy", "leverage", "disrupt", "thought leader", "guru", "hustle"],
    examplePost: `Most people in ${ctx.answers.soft_heart || 'this space'} think you need years of experience to make an impact.\n\nThey're wrong.\n\nWhat you actually need is a different lens.\n\nHere's what ${ctx.answers.superpower || 'my skill'} taught me that changed everything:`,
  },
  visualIdentity: {
    colorPalette: ["#1A1A2E", "#16213E", "#0F3460", "#E94560", "#F5F5F5"],
    fontSuggestion: "Serif headers (Playfair Display) with clean sans-serif body (Inter)",
    imageryStyle: "High-contrast, minimal, documentary-style. Real moments over stock photos.",
  },
  platformStrategy: [
    { platform: "LinkedIn", role: "Authority & professional network", frequency: "3-4x/week", contentMix: "40% deep craft, 30% origin stories, 30% vision" },
    { platform: "X", role: "Real-time thinking & community", frequency: "Daily", contentMix: "Quick takes, threads, engagement with peers" },
    { platform: "Substack", role: "Long-form depth & email list", frequency: "Weekly", contentMix: "Deep dives, original research, personal essays" },
    { platform: "YouTube", role: "Visual authority & SEO", frequency: "2x/month", contentMix: "Tutorials, breakdowns, interviews" },
  ],
});
