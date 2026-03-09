// ============================================================
// SKILLSET 1: COMPETITIVE INTELLIGENCE
// ============================================================
// Analyzes the competitive landscape around the user's confluation
// thesis, identifies market gaps, and builds a defensibility strategy.

import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SkillsetContext, CompetitiveIntelligence } from './types';

const apiKey = process.env.API_KEY || '';

const competitiveSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    landscapeSummary: { type: Type.STRING, description: "2-3 sentence overview of the competitive landscape" },
    competitors: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          type: { type: Type.STRING, description: "direct, indirect, or emerging" },
          description: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          marketShare: { type: Type.STRING },
          threatLevel: { type: Type.STRING, description: "low, medium, high, or critical" },
        },
        required: ["name", "type", "description", "strengths", "weaknesses", "marketShare", "threatLevel"],
      },
    },
    marketGaps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          gap: { type: Type.STRING },
          opportunity: { type: Type.STRING },
          difficulty: { type: Type.STRING },
          timeToCapture: { type: Type.STRING },
        },
        required: ["gap", "opportunity", "difficulty", "timeToCapture"],
      },
    },
    defensibilityScore: { type: Type.NUMBER, description: "Score 1-100 of how defensible this position is" },
    moatStrategy: { type: Type.STRING, description: "Strategy for building a competitive moat" },
    firstMoverAdvantages: { type: Type.ARRAY, items: { type: Type.STRING } },
    keyDifferentiators: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["landscapeSummary", "competitors", "marketGaps", "defensibilityScore", "moatStrategy", "firstMoverAdvantages", "keyDifferentiators"],
};

export const generateCompetitiveIntelligence = async (ctx: SkillsetContext): Promise<CompetitiveIntelligence> => {
  if (!apiKey) return getMockCompetitiveIntelligence(ctx);

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
      You are a competitive intelligence analyst and venture strategist.

      A person has identified a unique market position — their "Confluation":
      - Hard Skill: "${ctx.answers.superpower}"
      - Passion Area: "${ctx.answers.soft_heart}"
      - Problem Identified: "${ctx.answers.friction}"
      - Target Customer: "${ctx.answers.customer}"
      - Confluation Thesis: "${ctx.report.confluation_thesis}"
      - Unfair Advantage: "${ctx.report.unfair_advantage}"

      Perform a competitive intelligence analysis:
      1. Map 4-5 competitors (mix of direct, indirect, and emerging threats)
      2. Identify 3+ market gaps that this person's unique combination could fill
      3. Score the defensibility of their position (1-100)
      4. Design a moat strategy leveraging their specific background
      5. List first-mover advantages and key differentiators

      Be specific, grounded, and brutally honest. Name real competitor archetypes.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: competitiveSchema,
      temperature: 0.7,
    },
  });

  if (response.text) {
    return JSON.parse(response.text) as CompetitiveIntelligence;
  }
  throw new Error("Empty response from Competitive Intelligence skillset");
};

const getMockCompetitiveIntelligence = (ctx: SkillsetContext): CompetitiveIntelligence => ({
  landscapeSummary: `The intersection of ${ctx.answers.superpower} and ${ctx.answers.soft_heart} is an emerging space with fragmented competition. Most incumbents lack the deep domain expertise that comes from genuine passion combined with professional-grade skill.`,
  competitors: [
    {
      name: "Generic SaaS Incumbents",
      type: "indirect",
      description: "Large platforms that touch this space but treat it as a feature, not a mission",
      strengths: ["Scale", "Funding", "Brand recognition"],
      weaknesses: ["No domain expertise", "Slow to adapt", "Generic solutions"],
      marketShare: "60% of adjacent market",
      threatLevel: "medium",
    },
    {
      name: "Passion-Driven Solopreneurs",
      type: "direct",
      description: `Others in ${ctx.answers.soft_heart} building solutions, but without the ${ctx.answers.superpower} expertise`,
      strengths: ["Community trust", "Authentic voice"],
      weaknesses: ["Limited technical capability", "Can't scale"],
      marketShare: "15%",
      threatLevel: "low",
    },
    {
      name: "AI-Native Startups",
      type: "emerging",
      description: "New entrants using AI to disrupt the space generically",
      strengths: ["Speed", "Technology", "VC funding"],
      weaknesses: ["No domain depth", "Commoditized approach"],
      marketShare: "5% and growing",
      threatLevel: "high",
    },
    {
      name: "Traditional Consultancies",
      type: "indirect",
      description: "Established firms offering high-touch but expensive solutions",
      strengths: ["Relationships", "Track record", "Enterprise clients"],
      weaknesses: ["Expensive", "Slow", "Not technology-forward"],
      marketShare: "20%",
      threatLevel: "low",
    },
  ],
  marketGaps: [
    {
      gap: `No one combines ${ctx.answers.superpower} expertise with genuine ${ctx.answers.soft_heart} understanding at scale`,
      opportunity: "Build the definitive expert-led platform for this intersection",
      difficulty: "medium",
      timeToCapture: "6-12 months",
    },
    {
      gap: "Current solutions are either too generic or too expensive",
      opportunity: "Mid-market offering with expert depth at accessible pricing",
      difficulty: "low",
      timeToCapture: "3-6 months",
    },
    {
      gap: "Community building around this specific intersection is non-existent",
      opportunity: "Create the community hub where these two worlds meet",
      difficulty: "medium",
      timeToCapture: "6-18 months",
    },
  ],
  defensibilityScore: 68,
  moatStrategy: `Build a knowledge moat by documenting proprietary insights from applying ${ctx.answers.superpower} to ${ctx.answers.soft_heart}. Compound this with a community network effect — the more practitioners join, the more valuable the ecosystem becomes. Your personal narrative and authenticity are non-replicable assets.`,
  firstMoverAdvantages: [
    "Define the category vocabulary and frameworks",
    "Build the initial community and set the culture",
    "Establish thought leadership before AI commoditizes the space",
    "Lock in early partnerships with key industry players",
  ],
  keyDifferentiators: [
    `Genuine dual expertise in ${ctx.answers.superpower} AND ${ctx.answers.soft_heart}`,
    "Lived experience with the problem (authenticity)",
    `Understanding of ${ctx.answers.customer}'s specific pain points`,
    "Ability to bridge technical and creative worlds",
  ],
});
