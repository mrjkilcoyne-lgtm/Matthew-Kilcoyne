// ============================================================
// SKILLSET 3: REVENUE MODEL GENERATOR
// ============================================================
// Generates viable revenue models and monetization strategies
// based on the user's skills, audience, and market position.

import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SkillsetContext, RevenueModel } from './types';

const apiKey = process.env.API_KEY || '';

const revenueSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    thesis: { type: Type.STRING, description: "Core monetization thesis in 1-2 sentences" },
    primaryModel: { type: Type.STRING, description: "Recommended primary business model" },
    streams: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          model: { type: Type.STRING },
          description: { type: Type.STRING },
          priceRange: { type: Type.STRING },
          timeToRevenue: { type: Type.STRING },
          scalability: { type: Type.STRING },
          recurringRevenue: { type: Type.BOOLEAN },
          estimatedMRR: { type: Type.STRING },
        },
        required: ["name", "model", "description", "priceRange", "timeToRevenue", "scalability", "recurringRevenue", "estimatedMRR"],
      },
    },
    pricingStrategy: { type: Type.STRING },
    year1Projection: { type: Type.STRING },
    year3Projection: { type: Type.STRING },
    breakEvenAnalysis: { type: Type.STRING },
    riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
    monetizationTimeline: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          phase: { type: Type.STRING },
          milestone: { type: Type.STRING },
          revenue: { type: Type.STRING },
          duration: { type: Type.STRING },
        },
        required: ["phase", "milestone", "revenue", "duration"],
      },
    },
  },
  required: ["thesis", "primaryModel", "streams", "pricingStrategy", "year1Projection", "year3Projection", "breakEvenAnalysis", "riskFactors", "monetizationTimeline"],
};

export const generateRevenueModel = async (ctx: SkillsetContext): Promise<RevenueModel> => {
  if (!apiKey) return getMockRevenueModel(ctx);

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
      You are a startup revenue strategist and business model architect.

      Design revenue models for someone building at this intersection:
      - Hard Skill: "${ctx.answers.superpower}"
      - Passion Market: "${ctx.answers.soft_heart}"
      - Problem: "${ctx.answers.friction}"
      - Target Customer: "${ctx.answers.customer}"
      - Confluation Thesis: "${ctx.report.confluation_thesis}"
      - Current Focus: "${ctx.answers.forefront}"

      Create:
      1. A core monetization thesis
      2. 4-5 revenue streams (mix of immediate and long-term, recurring and one-time)
      3. Pricing strategy rationale
      4. Year 1 and Year 3 revenue projections (conservative estimates)
      5. Break-even analysis
      6. Risk factors
      7. A phased monetization timeline (what to launch when)

      Be realistic. Start with what generates revenue fastest, then build toward scale.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: revenueSchema,
      temperature: 0.7,
    },
  });

  if (response.text) {
    return JSON.parse(response.text) as RevenueModel;
  }
  throw new Error("Empty response from Revenue Model skillset");
};

const getMockRevenueModel = (ctx: SkillsetContext): RevenueModel => ({
  thesis: `Monetize the intersection of ${ctx.answers.superpower} and ${ctx.answers.soft_heart} by starting with high-touch consulting, then productizing expertise into scalable digital assets and community access.`,
  primaryModel: "Expertise-as-a-Service with productized tiers",
  streams: [
    {
      name: "1:1 Strategy Consulting",
      model: "consulting",
      description: `Premium consulting applying ${ctx.answers.superpower} expertise to ${ctx.answers.soft_heart} businesses`,
      priceRange: "$200-500/hour or $2,000-5,000/engagement",
      timeToRevenue: "Immediate (week 1)",
      scalability: "low",
      recurringRevenue: false,
      estimatedMRR: "$4,000-8,000 at 2-4 clients/month",
    },
    {
      name: "Digital Course / Cohort",
      model: "one-time",
      description: `Structured program teaching ${ctx.answers.customer} how to apply ${ctx.answers.superpower} principles`,
      priceRange: "$297-997 per student",
      timeToRevenue: "2-3 months to build",
      scalability: "high",
      recurringRevenue: false,
      estimatedMRR: "$5,000-15,000 per launch cycle",
    },
    {
      name: "Community Membership",
      model: "subscription",
      description: "Private community for practitioners — resources, AMAs, peer network",
      priceRange: "$29-99/month",
      timeToRevenue: "1-2 months",
      scalability: "high",
      recurringRevenue: true,
      estimatedMRR: "$2,900-9,900 at 100 members",
    },
    {
      name: "Newsletter Sponsorships",
      model: "advertising",
      description: "Monetize audience attention through targeted sponsor placements",
      priceRange: "$200-2,000 per placement",
      timeToRevenue: "3-6 months (need 2,000+ subscribers)",
      scalability: "medium",
      recurringRevenue: true,
      estimatedMRR: "$800-4,000 at scale",
    },
    {
      name: "Productized Templates & Tools",
      model: "one-time",
      description: `Downloadable frameworks and tools that codify ${ctx.answers.superpower} methodology`,
      priceRange: "$19-149 per product",
      timeToRevenue: "1 month",
      scalability: "high",
      recurringRevenue: false,
      estimatedMRR: "$1,000-5,000 passive",
    },
  ],
  pricingStrategy: "Start high-touch and expensive (consulting) to validate demand and build case studies. Use those wins to build credibility for scalable products. Price on value delivered, not time spent.",
  year1Projection: "$60,000-120,000",
  year3Projection: "$250,000-500,000",
  breakEvenAnalysis: "With minimal overhead (tools + hosting < $200/month), break-even occurs with first consulting client. Positive cash flow expected within 60 days.",
  riskFactors: [
    "Audience building takes longer than expected — plan for 6-12 months before revenue scales",
    "Course completion rates may be low — build community around the course",
    "Consulting can become a time trap — cap at 40% of revenue and productize",
    "Market education needed — target customer may not know they need this yet",
  ],
  monetizationTimeline: [
    { phase: "Month 1-2: Foundation", milestone: "Land 2-3 consulting clients from network", revenue: "$4,000-10,000", duration: "2 months" },
    { phase: "Month 3-4: Content Flywheel", milestone: "Launch newsletter + free community, 500+ subscribers", revenue: "$6,000-12,000", duration: "2 months" },
    { phase: "Month 5-6: First Product", milestone: "Launch flagship course or cohort program", revenue: "$10,000-25,000", duration: "2 months" },
    { phase: "Month 7-12: Scale", milestone: "Paid community + second product + sponsor revenue", revenue: "$8,000-15,000/month recurring", duration: "6 months" },
  ],
});
