// ============================================================
// SKILLSET 5: CONTENT CALENDAR ENGINE
// ============================================================
// Generates a multi-week content calendar with platform-specific
// posts, hooks, and repurposing strategies.

import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SkillsetContext, ContentCalendar } from './types';

const apiKey = process.env.API_KEY || '';

const calendarSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    strategy: { type: Type.STRING, description: "Overall content strategy in 2-3 sentences" },
    contentPillars: { type: Type.ARRAY, items: { type: Type.STRING } },
    targetAudience: { type: Type.STRING },
    postingCadence: { type: Type.STRING },
    weeks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          weekNumber: { type: Type.NUMBER },
          theme: { type: Type.STRING },
          pieces: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                format: { type: Type.STRING },
                platform: { type: Type.STRING },
                hook: { type: Type.STRING },
                outline: { type: Type.ARRAY, items: { type: Type.STRING } },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                bestTimeToPost: { type: Type.STRING },
                pillarAlignment: { type: Type.STRING },
                goal: { type: Type.STRING },
              },
              required: ["title", "format", "platform", "hook", "outline", "hashtags", "bestTimeToPost", "pillarAlignment", "goal"],
            },
          },
        },
        required: ["weekNumber", "theme", "pieces"],
      },
    },
    repurposingPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING },
          repurposedTo: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["original", "repurposedTo"],
      },
    },
    kpiTargets: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          metric: { type: Type.STRING },
          target: { type: Type.STRING },
          timeframe: { type: Type.STRING },
        },
        required: ["metric", "target", "timeframe"],
      },
    },
  },
  required: ["strategy", "contentPillars", "targetAudience", "postingCadence", "weeks", "repurposingPlan", "kpiTargets"],
};

export const generateContentCalendar = async (ctx: SkillsetContext): Promise<ContentCalendar> => {
  if (!apiKey) return getMockContentCalendar(ctx);

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
      You are a content strategist who builds publishing calendars for thought leaders and founders.

      Create a 4-week content calendar for someone with this profile:
      - Hard Skill: "${ctx.answers.superpower}"
      - Passion: "${ctx.answers.soft_heart}"
      - Target Audience: "${ctx.answers.customer}"
      - Problem They Solve: "${ctx.answers.friction}"
      - What They're Known For: "${ctx.answers.compliment}"
      - Current Focus: "${ctx.answers.forefront}"
      - Confluation Thesis: "${ctx.report.confluation_thesis}"
      - Narrative Thread: "${ctx.report.narrative_thread}"

      Create:
      1. An overall content strategy statement
      2. 3-4 content pillars
      3. 4 themed weeks with 5-7 content pieces each
      4. Each piece needs: title, format, platform, hook (first line), outline, hashtags, best time to post, pillar alignment, and goal
      5. A repurposing plan (how to turn 1 piece into 3-5 across platforms)
      6. KPI targets for 30/60/90 days

      Mix formats: threads, posts, carousels, newsletters, short videos.
      Mix platforms: X, LinkedIn, Instagram, YouTube, Substack.
      Every piece should demonstrate expertise or build trust.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: calendarSchema,
      temperature: 0.8,
    },
  });

  if (response.text) {
    return JSON.parse(response.text) as ContentCalendar;
  }
  throw new Error("Empty response from Content Calendar skillset");
};

const getMockContentCalendar = (ctx: SkillsetContext): ContentCalendar => ({
  strategy: `Position yourself as the bridge between ${ctx.answers.superpower} and ${ctx.answers.soft_heart}. Lead with insights nobody else can provide because nobody else sits at this intersection. Build trust through consistency, teach through experience, and convert through demonstrated expertise.`,
  contentPillars: [
    `Deep ${ctx.answers.superpower} Expertise`,
    `${ctx.answers.soft_heart} Industry Insights`,
    "Personal Journey & Lessons",
    "Future Vision & Predictions",
  ],
  targetAudience: ctx.answers.customer || "Professionals at the intersection of skill and passion",
  postingCadence: "12-15 pieces per week across all platforms",
  weeks: [
    {
      weekNumber: 1,
      theme: "Establishing Authority",
      pieces: [
        {
          title: "The Insight That Changed Everything",
          format: "thread",
          platform: "X",
          hook: `Most people in ${ctx.answers.soft_heart} are doing it wrong. Here's what ${ctx.answers.superpower} taught me that they're missing:`,
          outline: ["Hook: Contrarian observation", "The standard approach and why it fails", "What my background revealed", "The framework I now use", "Call to action"],
          hashtags: [`#${(ctx.answers.soft_heart || 'passion').replace(/\s+/g, '')}`, "#expertise"],
          bestTimeToPost: "Tuesday 9am UTC",
          pillarAlignment: `Deep ${ctx.answers.superpower} Expertise`,
          goal: "authority",
        },
        {
          title: "My Unlikely Path",
          format: "post",
          platform: "LinkedIn",
          hook: `I started in ${ctx.answers.origin}. Nobody would have predicted I'd end up here.`,
          outline: ["Where I started", "The pivot moment", "What I learned", "How it shapes what I build today", "Lesson for others considering a pivot"],
          hashtags: ["#careerpivot", "#journey"],
          bestTimeToPost: "Tuesday 8am UTC",
          pillarAlignment: "Personal Journey & Lessons",
          goal: "engagement",
        },
        {
          title: "The Problem Nobody's Solving",
          format: "carousel",
          platform: "Instagram",
          hook: `${ctx.answers.friction} — and here's why it matters more than you think.`,
          outline: ["Slide 1: Bold problem statement", "Slide 2: Why it exists", "Slide 3: Who it hurts most", "Slide 4: Current bad solutions", "Slide 5: A better way (hint)", "Slide 6: CTA to follow for the solution"],
          hashtags: [`#${(ctx.answers.soft_heart || 'industry').replace(/\s+/g, '')}`, "#problemsolving", "#innovation"],
          bestTimeToPost: "Wednesday 12pm UTC",
          pillarAlignment: `${ctx.answers.soft_heart} Industry Insights`,
          goal: "awareness",
        },
        {
          title: "Weekly Deep Dive",
          format: "newsletter",
          platform: "Substack",
          hook: `This week: Why ${ctx.answers.superpower} principles are the missing ingredient in ${ctx.answers.soft_heart}.`,
          outline: ["The observation", "Deep analysis with examples", "Practical framework", "Action items for the reader", "What I'm working on this week"],
          hashtags: [],
          bestTimeToPost: "Thursday 8am UTC",
          pillarAlignment: `Deep ${ctx.answers.superpower} Expertise`,
          goal: "authority",
        },
        {
          title: "Quick Win Framework",
          format: "post",
          platform: "X",
          hook: `Here's a 5-minute exercise that will change how you think about ${ctx.answers.soft_heart}:`,
          outline: ["The exercise (step by step)", "Why it works (the science/logic)", "What you'll discover", "Share your results"],
          hashtags: ["#framework", "#quickwin"],
          bestTimeToPost: "Friday 5pm UTC",
          pillarAlignment: `Deep ${ctx.answers.superpower} Expertise`,
          goal: "engagement",
        },
      ],
    },
    {
      weekNumber: 2,
      theme: "Building Trust Through Vulnerability",
      pieces: [
        {
          title: "The Biggest Mistake I Made",
          format: "thread",
          platform: "X",
          hook: `I almost gave up on ${ctx.answers.soft_heart} entirely. Here's what happened and what it taught me:`,
          outline: ["The situation", "What went wrong", "The rock-bottom moment", "The lesson", "How it made me better", "What I'd tell past me"],
          hashtags: ["#lessons", "#resilience"],
          bestTimeToPost: "Monday 9am UTC",
          pillarAlignment: "Personal Journey & Lessons",
          goal: "engagement",
        },
        {
          title: "Industry Prediction",
          format: "post",
          platform: "LinkedIn",
          hook: `Bold prediction: ${ctx.answers.soft_heart} will look completely different in 3 years. Here's why:`,
          outline: ["Current state", "Forces of change", "My prediction", "What to do about it", "Agree or disagree?"],
          hashtags: ["#futureofwork", "#predictions"],
          bestTimeToPost: "Wednesday 8am UTC",
          pillarAlignment: "Future Vision & Predictions",
          goal: "authority",
        },
        {
          title: "Behind the Scenes",
          format: "reel",
          platform: "Instagram",
          hook: "What my morning actually looks like when I'm building at this intersection...",
          outline: ["Quick cuts of real work", "Narrate thought process", "Show the messy middle", "End with a takeaway"],
          hashtags: ["#behindthescenes", "#buildinpublic", "#dayinthelife"],
          bestTimeToPost: "Thursday 6pm UTC",
          pillarAlignment: "Personal Journey & Lessons",
          goal: "community",
        },
        {
          title: "The Counter-Intuitive Truth",
          format: "post",
          platform: "X",
          hook: `Everyone in ${ctx.answers.soft_heart} thinks more [common approach] = better results. The data says otherwise.`,
          outline: ["The common belief", "The data/evidence against it", "What actually works", "How to apply this"],
          hashtags: ["#contrarian"],
          bestTimeToPost: "Tuesday 12pm UTC",
          pillarAlignment: `${ctx.answers.soft_heart} Industry Insights`,
          goal: "authority",
        },
        {
          title: "Deep Dive: Applied Framework",
          format: "newsletter",
          platform: "Substack",
          hook: `This week I'm breaking down the exact framework I use when clients ask me about ${ctx.answers.friction}.`,
          outline: ["The problem in context", "Step-by-step framework", "Real example walkthrough", "Common pitfalls", "Template/worksheet for readers"],
          hashtags: [],
          bestTimeToPost: "Thursday 8am UTC",
          pillarAlignment: `Deep ${ctx.answers.superpower} Expertise`,
          goal: "conversion",
        },
      ],
    },
    {
      weekNumber: 3,
      theme: "Social Proof & Case Studies",
      pieces: [
        {
          title: "How I Helped Someone Transform",
          format: "thread",
          platform: "X",
          hook: `A client came to me with [problem]. 90 days later, everything changed. Here's exactly what we did:`,
          outline: ["The starting point", "The diagnosis", "The strategy", "Implementation", "Results", "Key takeaway anyone can apply"],
          hashtags: ["#casestudy", "#results"],
          bestTimeToPost: "Tuesday 9am UTC",
          pillarAlignment: `Deep ${ctx.answers.superpower} Expertise`,
          goal: "conversion",
        },
        {
          title: "What I Wish I Knew",
          format: "carousel",
          platform: "LinkedIn",
          hook: `10 things I wish someone told me before I started combining ${ctx.answers.superpower} with ${ctx.answers.soft_heart}:`,
          outline: ["1 lesson per slide", "Mix practical and philosophical", "End with invitation to share theirs"],
          hashtags: ["#lessonslearned", "#advice"],
          bestTimeToPost: "Wednesday 8am UTC",
          pillarAlignment: "Personal Journey & Lessons",
          goal: "engagement",
        },
        {
          title: "Tool/Resource Breakdown",
          format: "post",
          platform: "X",
          hook: `The 5 tools I use every single day to operate at the intersection of ${ctx.answers.superpower} and ${ctx.answers.soft_heart}:`,
          outline: ["Tool 1 + why", "Tool 2 + why", "Tool 3 + why", "Tool 4 + why", "Tool 5 + why", "Bonus: the one I'm testing"],
          hashtags: ["#tools", "#productivity"],
          bestTimeToPost: "Friday 12pm UTC",
          pillarAlignment: `Deep ${ctx.answers.superpower} Expertise`,
          goal: "engagement",
        },
        {
          title: "AMA / Community Q&A",
          format: "post",
          platform: "Instagram",
          hook: "Drop your questions below — I'm answering everything about [topic] today.",
          outline: ["Announce the AMA", "Seed with 2-3 common questions", "Answer in Stories throughout the day"],
          hashtags: ["#askme", "#ama"],
          bestTimeToPost: "Saturday 11am UTC",
          pillarAlignment: `${ctx.answers.soft_heart} Industry Insights`,
          goal: "community",
        },
        {
          title: "The Intersection Essay",
          format: "newsletter",
          platform: "Substack",
          hook: "Why the most interesting things happen where two worlds collide — and how to engineer those collisions.",
          outline: ["The concept of intersection thinking", "Examples from history", "My personal intersection", "How readers can find theirs", "A challenge for the week"],
          hashtags: [],
          bestTimeToPost: "Thursday 8am UTC",
          pillarAlignment: "Future Vision & Predictions",
          goal: "authority",
        },
      ],
    },
    {
      weekNumber: 4,
      theme: "Vision & Call to Action",
      pieces: [
        {
          title: "The Future I'm Building",
          format: "thread",
          platform: "X",
          hook: `In 10 years, ${ctx.answers.legacy || 'the headline will read...'}\n\nHere's the roadmap:`,
          outline: ["The vision", "Why it matters", "What exists today vs. what's needed", "My role in building it", "How you can be part of it"],
          hashtags: ["#vision", "#buildinpublic"],
          bestTimeToPost: "Monday 9am UTC",
          pillarAlignment: "Future Vision & Predictions",
          goal: "community",
        },
        {
          title: "Month 1 Retrospective",
          format: "post",
          platform: "LinkedIn",
          hook: "30 days of building in public. Here's what worked, what didn't, and what's next:",
          outline: ["Wins", "Failures", "Surprises", "Metrics", "Next month's focus", "Thank you to the community"],
          hashtags: ["#buildinpublic", "#retrospective", "#month1"],
          bestTimeToPost: "Friday 8am UTC",
          pillarAlignment: "Personal Journey & Lessons",
          goal: "engagement",
        },
        {
          title: "The Manifesto",
          format: "article",
          platform: "Substack",
          hook: `Why the world needs more people who combine deep expertise with genuine passion — a manifesto for the confluation generation.`,
          outline: ["The problem with specialization-only thinking", "The problem with passion-only thinking", "The power of the intersection", "A call to arms", "Specific actions readers can take"],
          hashtags: [],
          bestTimeToPost: "Thursday 8am UTC",
          pillarAlignment: "Future Vision & Predictions",
          goal: "authority",
        },
        {
          title: "Data Drop",
          format: "carousel",
          platform: "Instagram",
          hook: `I analyzed [X] data points in ${ctx.answers.soft_heart}. The results will change how you think about [topic].`,
          outline: ["Slide 1: Bold claim", "Slides 2-6: Data visualization", "Slide 7: So what?", "Slide 8: What to do about it", "Slide 9: Follow for more"],
          hashtags: ["#data", "#insights", "#research"],
          bestTimeToPost: "Wednesday 12pm UTC",
          pillarAlignment: `${ctx.answers.soft_heart} Industry Insights`,
          goal: "awareness",
        },
        {
          title: "Invitation Post",
          format: "post",
          platform: "X",
          hook: `I'm building something for ${ctx.answers.customer || 'people like you'}. Want early access?`,
          outline: ["What it is (1 sentence)", "Who it's for", "What makes it different", "How to get involved", "DM or link"],
          hashtags: ["#buildinpublic", "#earlyaccess"],
          bestTimeToPost: "Friday 5pm UTC",
          pillarAlignment: `Deep ${ctx.answers.superpower} Expertise`,
          goal: "conversion",
        },
      ],
    },
  ],
  repurposingPlan: [
    {
      original: "Weekly Substack newsletter",
      repurposedTo: [
        "Extract key insight → X thread",
        "Pull 3 quotes → LinkedIn carousel",
        "Record key section → Instagram Reel / TikTok",
        "Create infographic → Pinterest / Instagram post",
        "Tease next week → X post with newsletter link in reply",
      ],
    },
    {
      original: "X thread (high-performing)",
      repurposedTo: [
        "Expand into LinkedIn article",
        "Turn into carousel slides for Instagram",
        "Record as short talking-head video",
        "Add to newsletter as a section",
      ],
    },
    {
      original: "Client case study",
      repurposedTo: [
        "Full write-up → Substack",
        "Summary thread → X",
        "Before/after visual → Instagram carousel",
        "Lessons learned → LinkedIn post",
        "Pitch as podcast episode topic",
      ],
    },
  ],
  kpiTargets: [
    { metric: "Total followers (all platforms)", target: "+1,000", timeframe: "30 days" },
    { metric: "Newsletter subscribers", target: "500", timeframe: "30 days" },
    { metric: "Avg engagement rate", target: "3%+", timeframe: "30 days" },
    { metric: "Total followers (all platforms)", target: "+5,000", timeframe: "90 days" },
    { metric: "Newsletter subscribers", target: "2,000", timeframe: "90 days" },
    { metric: "Inbound leads / DMs", target: "10+ per week", timeframe: "60 days" },
    { metric: "Podcast appearances", target: "3", timeframe: "90 days" },
  ],
});
