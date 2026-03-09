// ============================================================
// SKILLSET 4: NETWORK STRATEGY
// ============================================================
// Builds a strategic networking playbook with target personas,
// outreach templates, and a weekly relationship-building system.

import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SkillsetContext, NetworkStrategy } from './types';

const apiKey = process.env.API_KEY || '';

const networkSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    networkingThesis: { type: Type.STRING, description: "Core networking philosophy in 1-2 sentences" },
    innerCircle: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          persona: { type: Type.STRING },
          why: { type: Type.STRING },
          where: { type: Type.STRING },
          approach: { type: Type.STRING },
          value_exchange: { type: Type.STRING },
          priority: { type: Type.STRING },
        },
        required: ["persona", "why", "where", "approach", "value_exchange", "priority"],
      },
    },
    outerCircle: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          persona: { type: Type.STRING },
          why: { type: Type.STRING },
          where: { type: Type.STRING },
          approach: { type: Type.STRING },
          value_exchange: { type: Type.STRING },
          priority: { type: Type.STRING },
        },
        required: ["persona", "why", "where", "approach", "value_exchange", "priority"],
      },
    },
    events: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          name: { type: Type.STRING },
          relevance: { type: Type.STRING },
          action: { type: Type.STRING },
        },
        required: ["type", "name", "relevance", "action"],
      },
    },
    weeklyPlaybook: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING },
          action: { type: Type.STRING },
          platform: { type: Type.STRING },
          timeMinutes: { type: Type.NUMBER },
        },
        required: ["day", "action", "platform", "timeMinutes"],
      },
    },
    coldOutreachTemplates: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          scenario: { type: Type.STRING },
          template: { type: Type.STRING },
        },
        required: ["scenario", "template"],
      },
    },
    sixMonthGoal: { type: Type.STRING },
  },
  required: ["networkingThesis", "innerCircle", "outerCircle", "events", "weeklyPlaybook", "coldOutreachTemplates", "sixMonthGoal"],
};

export const generateNetworkStrategy = async (ctx: SkillsetContext): Promise<NetworkStrategy> => {
  if (!apiKey) return getMockNetworkStrategy(ctx);

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
      You are a strategic networking advisor who builds relationship systems for founders and career pivoters.

      Build a networking strategy for someone with this profile:
      - Origin: "${ctx.answers.origin}"
      - Hard Skill: "${ctx.answers.superpower}"
      - Passion: "${ctx.answers.soft_heart}"
      - Target Customer: "${ctx.answers.customer}"
      - Problem Solving: "${ctx.answers.friction}"
      - Legacy Vision: "${ctx.answers.legacy}"
      - Confluation Thesis: "${ctx.report.confluation_thesis}"

      Create:
      1. A networking thesis
      2. Inner circle targets (3-4 critical relationships)
      3. Outer circle targets (3-4 community connections)
      4. Events and communities to join (5+)
      5. A weekly playbook (daily actions, platforms, time)
      6. Cold outreach templates for 3 scenarios
      7. A 6-month networking goal

      Focus on value-first networking. Every connection should be strategic.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: networkSchema,
      temperature: 0.8,
    },
  });

  if (response.text) {
    return JSON.parse(response.text) as NetworkStrategy;
  }
  throw new Error("Empty response from Network Strategy skillset");
};

const getMockNetworkStrategy = (ctx: SkillsetContext): NetworkStrategy => ({
  networkingThesis: `Lead with generosity: share ${ctx.answers.superpower} insights freely in ${ctx.answers.soft_heart} spaces, and the right doors will open. Your unique intersection makes you inherently interesting.`,
  innerCircle: [
    {
      persona: `Established ${ctx.answers.soft_heart} Founder`,
      why: "Mentorship, industry credibility, potential partnership",
      where: "LinkedIn, industry conferences, podcast appearances",
      approach: "Share a specific insight about their business, then ask for 15 minutes",
      value_exchange: `Offer free ${ctx.answers.superpower} audit of their operations`,
      priority: "critical",
    },
    {
      persona: "Media / Content Creator in Adjacent Space",
      why: "Amplification, audience access, co-creation",
      where: "X, YouTube, podcast directories",
      approach: "Engage consistently for 4 weeks, then pitch a collaboration",
      value_exchange: "Provide unique expertise angle they can't get elsewhere",
      priority: "high",
    },
    {
      persona: "Investor / Advisor in the Vertical",
      why: "Strategic guidance, funding connections, validation",
      where: "AngelList, VC Twitter, founder meetups",
      approach: "Share market insight, ask for feedback (not money)",
      value_exchange: "Proprietary market intelligence from your unique vantage point",
      priority: "high",
    },
  ],
  outerCircle: [
    {
      persona: `Other ${ctx.answers.superpower} Practitioners`,
      why: "Peer learning, referral network, skill sharpening",
      where: "Professional communities, Slack groups, meetups",
      approach: "Share learnings openly, collaborate on projects",
      value_exchange: "Knowledge sharing and mutual referrals",
      priority: "medium",
    },
    {
      persona: `${ctx.answers.customer || 'Target customer'} Community Leaders`,
      why: "Distribution, product feedback, early adopter pipeline",
      where: "Reddit, Discord, Facebook Groups, industry forums",
      approach: "Provide value for 30 days before any pitch",
      value_exchange: "Free expertise in exchange for feedback and testimonials",
      priority: "high",
    },
    {
      persona: "Journalists / Newsletter Writers",
      why: "PR, credibility, SEO backlinks",
      where: "Twitter, HARO, Substack",
      approach: "Pitch yourself as an expert source with a unique angle",
      value_exchange: "Quotable insights and data they can't get elsewhere",
      priority: "medium",
    },
  ],
  events: [
    { type: "conference", name: "Industry-specific annual conference", relevance: "High concentration of targets", action: "Attend, speak if possible, host a small dinner" },
    { type: "online_community", name: "Relevant Slack/Discord community", relevance: "Daily touchpoint with practitioners", action: "Join, contribute weekly, become the go-to expert" },
    { type: "meetup", name: "Local founder/creator meetup", relevance: "Build genuine local relationships", action: "Attend monthly, present once per quarter" },
    { type: "podcast", name: "Niche podcasts in your space", relevance: "Authority building and warm audiences", action: "Pitch as guest with 3 unique story angles" },
    { type: "mastermind", name: "Peer mastermind group (4-6 people)", relevance: "Accountability and strategic thinking", action: "Form or join one, meet bi-weekly for 6 months" },
  ],
  weeklyPlaybook: [
    { day: "Monday", action: "Comment on 5 posts from target connections", platform: "LinkedIn", timeMinutes: 20 },
    { day: "Tuesday", action: "Send 2 value-first DMs to new connections", platform: "X / LinkedIn", timeMinutes: 15 },
    { day: "Wednesday", action: "Publish content showcasing your intersection", platform: "LinkedIn + X", timeMinutes: 30 },
    { day: "Thursday", action: "Engage in 1 community discussion as expert", platform: "Slack / Discord", timeMinutes: 20 },
    { day: "Friday", action: "Follow up with 2 warm connections", platform: "Email / DM", timeMinutes: 15 },
    { day: "Saturday", action: "Research 3 new people to connect with next week", platform: "Research", timeMinutes: 15 },
    { day: "Sunday", action: "Plan content and outreach for the week", platform: "Planning", timeMinutes: 20 },
  ],
  coldOutreachTemplates: [
    {
      scenario: "Reaching out to a potential mentor or advisor",
      template: `Hi [Name], I've been following your work in [their area] and noticed [specific observation]. I'm building at the intersection of ${ctx.answers.superpower} and ${ctx.answers.soft_heart}, and your perspective would be incredibly valuable. Would you have 15 minutes for a quick call?`,
    },
    {
      scenario: "Pitching yourself as a podcast guest",
      template: `Hi [Host], loved your episode on [specific episode]. I have a unique angle — I combine ${ctx.answers.superpower} with ${ctx.answers.soft_heart} to help ${ctx.answers.customer}. Three potential topics: 1) [Contrarian take], 2) [Framework], 3) [Personal story]. Happy to adjust to your audience.`,
    },
    {
      scenario: "Connecting with a peer for collaboration",
      template: `Hey [Name], I noticed we're both working at the intersection of [shared interest]. Would you be open to a virtual coffee? No agenda — just curious to swap notes on what we're both seeing.`,
    },
  ],
  sixMonthGoal: `Build a network of 50 genuine connections, secure 3 podcast appearances, and establish yourself as a recognized voice at the intersection of ${ctx.answers.superpower} and ${ctx.answers.soft_heart}.`,
});
