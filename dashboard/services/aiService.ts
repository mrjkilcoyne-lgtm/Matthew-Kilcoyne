// ============================================================
// AI SERVICE ADAPTER - Model-agnostic (Claude / Gemini / etc)
// ============================================================
// Supports multiple AI backends for content suggestions,
// virality prediction, and growth strategy generation.

import { PlatformId, ContentSuggestion, GrowthAnalysis, PostAnalytics, ContentType, RecoveryPlan } from '../types';
import { PLATFORM_BENCHMARKS, ALGORITHM_SIGNALS } from '../utils/engagementFormulas';

type AIProvider = 'claude' | 'gemini' | 'mock';

interface AIConfig {
  provider: AIProvider;
  apiKey?: string;
  model?: string;
}

// Detect available AI providers from environment
const getAIConfig = (): AIConfig => {
  const anthropicKey = (typeof process !== 'undefined' && process.env?.ANTHROPIC_API_KEY) || '';
  const geminiKey = (typeof process !== 'undefined' && process.env?.API_KEY) || '';

  if (anthropicKey) {
    return { provider: 'claude', apiKey: anthropicKey, model: 'claude-sonnet-4-6' };
  }
  if (geminiKey) {
    return { provider: 'gemini', apiKey: geminiKey, model: 'gemini-2.5-flash' };
  }
  return { provider: 'mock' };
};

// --- Claude API Call ---
const callClaude = async (systemPrompt: string, userPrompt: string, apiKey: string, model: string): Promise<string> => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
};

// --- Gemini API Call ---
const callGemini = async (prompt: string, apiKey: string, model: string): Promise<string> => {
  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || '';
  } catch {
    throw new Error('Gemini API call failed');
  }
};

// --- Unified AI Call ---
const callAI = async (systemPrompt: string, userPrompt: string): Promise<string> => {
  const config = getAIConfig();

  switch (config.provider) {
    case 'claude':
      return callClaude(systemPrompt, userPrompt, config.apiKey!, config.model!);
    case 'gemini':
      return callGemini(`${systemPrompt}\n\n${userPrompt}`, config.apiKey!, config.model!);
    case 'mock':
      return generateMockResponse(userPrompt);
  }
};

// ============================================================
// PUBLIC API - Content Suggestions
// ============================================================

export const generateContentSuggestions = async (
  platformId: PlatformId,
  topPosts: PostAnalytics[],
  niche: string,
  tone: string,
): Promise<ContentSuggestion[]> => {
  const benchmarks = PLATFORM_BENCHMARKS[platformId];
  const signals = ALGORITHM_SIGNALS[platformId];

  const systemPrompt = `You are an elite social media strategist. You understand platform algorithms deeply and craft content that maximises organic reach and engagement. You always respond with valid JSON arrays.`;

  const userPrompt = `Generate 5 content suggestions for ${platformId} in the "${niche}" niche with a ${tone} tone.

Platform algorithm priorities:
${signals?.map(s => `- ${s.signal} (weight: ${s.weight}): ${s.howToOptimize}`).join('\n') || 'Standard engagement metrics'}

Benchmark engagement rate: ${benchmarks?.avgEngagementRate || 3}%

Top performing post styles from this account:
${topPosts.slice(0, 3).map(p => `- Type: ${p.contentType}, Engagement: ${p.engagementRate.toFixed(2)}%, Text preview: "${p.text.slice(0, 100)}"`).join('\n') || 'No historical data yet'}

Return a JSON array with exactly 5 objects, each with these fields:
- title: string (compelling working title)
- body: string (full post text ready to publish, with line breaks)
- contentType: "${getOptimalContentTypes(platformId).join('" | "')}"
- hashtags: string[] (3-5 relevant hashtags)
- estimatedReach: string (e.g. "2x-5x average")
- viralityPotential: "low" | "moderate" | "high" | "viral"
- reasoning: string (why this will perform well, referencing algorithm signals)
- basedOn: string (what trend or insight this leverages)
- category: "trending_topic" | "audience_interest" | "content_gap" | "viral_format" | "engagement_recovery" | "cross_platform" | "contrarian" | "evergreen" | "newsjacking"

Respond with ONLY the JSON array, no markdown formatting.`;

  try {
    const response = await callAI(systemPrompt, userPrompt);
    const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const suggestions = JSON.parse(cleaned) as ContentSuggestion[];
    return suggestions.map((s, i) => ({
      ...s,
      id: `suggestion-${Date.now()}-${i}`,
      platformId,
    }));
  } catch (error) {
    console.error('Failed to generate content suggestions:', error);
    return getMockSuggestions(platformId, niche);
  }
};

// ============================================================
// PUBLIC API - Growth Analysis
// ============================================================

export const analyzeGrowth = async (
  platformId: PlatformId,
  metrics: {
    followers: number;
    weeklyGrowth: number;
    monthlyGrowth: number;
    engagementRate: number;
    postsPerWeek: number;
  },
): Promise<GrowthAnalysis> => {
  const benchmarks = PLATFORM_BENCHMARKS[platformId];
  const signals = ALGORITHM_SIGNALS[platformId];

  const systemPrompt = `You are a social media growth consultant. You diagnose growth problems, identify opportunities, and create actionable recovery plans. Respond with valid JSON.`;

  const userPrompt = `Analyze this ${platformId} account and provide a growth strategy:

Current metrics:
- Followers: ${metrics.followers}
- Weekly growth: ${metrics.weeklyGrowth}%
- Monthly growth: ${metrics.monthlyGrowth}%
- Engagement rate: ${metrics.engagementRate}%
- Posts per week: ${metrics.postsPerWeek}

Platform benchmarks:
- Avg engagement rate: ${benchmarks?.avgEngagementRate || 3}%
- Monthly growth benchmark: ${benchmarks?.growthRateBenchmark || 2}%

Algorithm signals to leverage:
${signals?.map(s => `- ${s.signal}: ${s.description}`).join('\n') || 'Standard engagement signals'}

Return a JSON object with:
- currentPhase: "nadir" | "declining" | "stagnant" | "growing" | "accelerating" | "viral"
- weeklyGrowthRate: number
- monthlyGrowthRate: number
- projectedFollowers30d: number
- projectedFollowers90d: number
- bottlenecks: [{ issue: string, severity: "critical"|"high"|"medium"|"low", impact: string, solution: string }] (2-3 items)
- opportunities: [{ opportunity: string, effort: "low"|"medium"|"high", potentialImpact: string, timeframe: string, steps: string[] }] (2-3 items)
- recoveryPlan: { diagnosis: string, phase1: { name: string, actions: string[], duration: string }, phase2: { name: string, actions: string[], duration: string }, phase3: { name: string, actions: string[], duration: string }, expectedOutcome: string }

Respond with ONLY the JSON object, no markdown.`;

  try {
    const response = await callAI(systemPrompt, userPrompt);
    const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const analysis = JSON.parse(cleaned) as GrowthAnalysis;
    return { ...analysis, platformId };
  } catch (error) {
    console.error('Failed to analyze growth:', error);
    return getMockGrowthAnalysis(platformId, metrics);
  }
};

// ============================================================
// PUBLIC API - Post Optimization
// ============================================================

export const optimizePost = async (
  platformId: PlatformId,
  draft: string,
  contentType: ContentType,
): Promise<{ optimized: string; changes: string[]; predictedLift: string }> => {
  const signals = ALGORITHM_SIGNALS[platformId];

  const systemPrompt = `You are a social media copy optimization expert. You take draft posts and improve them to maximize engagement based on platform algorithm signals. Respond with valid JSON.`;

  const userPrompt = `Optimize this ${platformId} ${contentType} post for maximum engagement:

Draft:
"${draft}"

Algorithm signals to optimize for:
${signals?.map(s => `- ${s.signal} (weight: ${s.weight}): ${s.howToOptimize}`).join('\n') || 'Standard engagement metrics'}

Return a JSON object with:
- optimized: string (the improved post text, ready to publish)
- changes: string[] (list of specific changes made and why)
- predictedLift: string (estimated engagement improvement, e.g. "+40-80%")

Respond with ONLY the JSON object, no markdown.`;

  try {
    const response = await callAI(systemPrompt, userPrompt);
    const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      optimized: draft,
      changes: ['Unable to optimize — AI service unavailable. Try adding an API key in settings.'],
      predictedLift: 'N/A',
    };
  }
};

// ============================================================
// HELPERS
// ============================================================

const getOptimalContentTypes = (platformId: PlatformId): ContentType[] => {
  const map: Record<string, ContentType[]> = {
    x: ['text', 'thread', 'image', 'video', 'poll'],
    linkedin: ['text', 'carousel', 'article', 'poll', 'video'],
    instagram: ['reel', 'carousel', 'image', 'story'],
    youtube: ['video', 'short'],
    tiktok: ['reel', 'video'],
    facebook: ['text', 'image', 'video', 'reel', 'poll'],
    substack: ['newsletter', 'article'],
    threads: ['text', 'image', 'thread'],
    bluesky: ['text', 'image', 'thread'],
  };
  return map[platformId] || ['text', 'image', 'video'];
};

// --- Mock Responses (for demo/no API key mode) ---

const generateMockResponse = async (prompt: string): Promise<string> => {
  // Simulate API delay
  await new Promise(r => setTimeout(r, 800));

  if (prompt.includes('content suggestions') || prompt.includes('Generate 5')) {
    return JSON.stringify(getMockSuggestions('x', 'general'));
  }
  if (prompt.includes('growth strategy') || prompt.includes('Analyze this')) {
    return JSON.stringify(getMockGrowthAnalysis('x', { followers: 1000, weeklyGrowth: 0.5, monthlyGrowth: 2, engagementRate: 1.5, postsPerWeek: 3 }));
  }
  return '{}';
};

const getMockSuggestions = (platformId: PlatformId, niche: string): ContentSuggestion[] => [
  {
    id: `mock-1-${Date.now()}`,
    platformId,
    contentType: 'thread',
    title: 'Contrarian Take Thread',
    body: `Unpopular opinion: The most successful people in ${niche} aren't the ones working 80-hour weeks.\n\nThey're the ones who mastered these 5 counterintuitive strategies:\n\n(A thread)`,
    hashtags: ['#strategy', '#growth', `#${niche}`],
    estimatedReach: '3x-5x average',
    viralityPotential: 'high',
    reasoning: 'Contrarian takes trigger high-arousal emotions (surprise, curiosity) which are the strongest sharing drivers',
    basedOn: 'Contrarian content format analysis',
    category: 'contrarian',
  },
  {
    id: `mock-2-${Date.now()}`,
    platformId,
    contentType: 'text',
    title: 'Personal Story + Lesson',
    body: `3 years ago I almost quit ${niche} entirely.\n\nWhat changed everything was a single conversation that shifted my entire perspective.\n\nHere's what happened and the lesson I think about every single day:`,
    hashtags: ['#lessons', '#journey'],
    estimatedReach: '2x-4x average',
    viralityPotential: 'high',
    reasoning: 'Personal vulnerability stories create emotional connection and drive replies — replies have 13.5x weight in the X algorithm',
    basedOn: 'Narrative engagement patterns',
    category: 'audience_interest',
  },
  {
    id: `mock-3-${Date.now()}`,
    platformId,
    contentType: 'image',
    title: 'Data-Driven Insight',
    body: `I analysed 1,000+ top-performing posts in ${niche}.\n\nThe #1 pattern that separated viral content from everything else?\n\nIt wasn't what I expected. Here's the data:`,
    hashtags: ['#data', '#insights', `#${niche}`],
    estimatedReach: '4x-8x average',
    viralityPotential: 'viral',
    reasoning: 'Data-backed content with surprising findings triggers awe and practical value — two of the strongest virality emotions',
    basedOn: 'Data-driven content performance analysis',
    category: 'viral_format',
  },
  {
    id: `mock-4-${Date.now()}`,
    platformId,
    contentType: 'poll',
    title: 'Engagement Recovery Poll',
    body: `Quick question for everyone in ${niche}:\n\nWhat's your biggest challenge right now?`,
    hashtags: [`#${niche}`, '#community'],
    estimatedReach: '1.5x-2x average',
    viralityPotential: 'moderate',
    reasoning: 'Polls generate easy engagement which boosts algorithmic distribution — great for recovering from low-engagement periods',
    basedOn: 'Engagement recovery patterns',
    category: 'engagement_recovery',
  },
  {
    id: `mock-5-${Date.now()}`,
    platformId,
    contentType: 'text',
    title: 'Practical Framework',
    body: `The 3-2-1 framework for ${niche} that I wish someone told me on day one:\n\n3 things to focus on daily\n2 things to track weekly\n1 thing to review monthly\n\nBookmark this. You'll need it.`,
    hashtags: ['#framework', '#productivity', `#${niche}`],
    estimatedReach: '2x-3x average',
    viralityPotential: 'high',
    reasoning: 'Frameworks and numbered lists get bookmarked heavily — bookmarks are a strong positive signal across all platforms',
    basedOn: 'Save/bookmark engagement patterns',
    category: 'evergreen',
  },
];

const getMockGrowthAnalysis = (platformId: PlatformId, metrics: { followers: number; weeklyGrowth: number; monthlyGrowth: number; engagementRate: number; postsPerWeek: number }): GrowthAnalysis => {
  const isStrugggling = metrics.monthlyGrowth < 1;
  const currentPhase = metrics.monthlyGrowth < 0 ? 'declining' : metrics.monthlyGrowth < 1 ? 'stagnant' : metrics.monthlyGrowth < 3 ? 'growing' : 'accelerating';

  return {
    platformId,
    currentPhase: currentPhase as GrowthAnalysis['currentPhase'],
    weeklyGrowthRate: metrics.weeklyGrowth,
    monthlyGrowthRate: metrics.monthlyGrowth,
    projectedFollowers30d: Math.round(metrics.followers * (1 + metrics.monthlyGrowth / 100)),
    projectedFollowers90d: Math.round(metrics.followers * Math.pow(1 + metrics.monthlyGrowth / 100, 3)),
    bottlenecks: [
      {
        issue: isStrugggling ? 'Low posting consistency' : 'Content format stagnation',
        severity: isStrugggling ? 'critical' : 'medium',
        impact: isStrugggling ? 'Algorithm deprioritises inconsistent accounts' : 'Same format loses novelty with audience',
        solution: isStrugggling ? 'Commit to posting 5x/week for 30 days — consistency rebuilds algorithmic trust' : 'Introduce 1-2 new content formats (carousels, threads, polls) per week',
      },
      {
        issue: 'Under-leveraging replies and conversations',
        severity: 'high',
        impact: 'Missing the highest-weighted algorithm signal (author replies)',
        solution: 'Reply to every comment within 60 minutes of posting — set up notifications',
      },
    ],
    opportunities: [
      {
        opportunity: 'Cross-platform content repurposing',
        effort: 'medium',
        potentialImpact: '2-3x total reach across platforms',
        timeframe: '2-4 weeks to establish',
        steps: ['Identify top-performing content from each platform', 'Adapt format for each target platform', 'Stagger posting times across platforms', 'Track cross-platform attribution'],
      },
      {
        opportunity: 'Engagement pod alternative: genuine community building',
        effort: 'high',
        potentialImpact: 'Sustainable 5-10% monthly growth',
        timeframe: '1-3 months',
        steps: ['Identify 20-30 accounts in your niche', 'Engage genuinely with their content daily', 'Start meaningful conversations in replies', 'Collaborate on content (guest posts, joint threads)'],
      },
    ],
    recoveryPlan: {
      diagnosis: isStrugggling
        ? 'Account is in a low-engagement cycle. The algorithm has likely reduced distribution due to inconsistent posting and declining engagement signals.'
        : 'Account is performing adequately but has significant untapped growth potential.',
      phase1: {
        name: 'Foundation Reset',
        actions: [
          'Post consistently at optimal times for 14 days straight',
          'Engage with 15-20 accounts in your niche daily before posting',
          'Reply to 100% of comments within 60 minutes',
          'Avoid external links in main posts',
        ],
        duration: '2 weeks',
      },
      phase2: {
        name: 'Content Experimentation',
        actions: [
          'Test 3 different content formats and track engagement',
          'Post your best-performing format 2x per week',
          'Start 1 thread per week on your deepest expertise',
          'Begin cross-platform repurposing',
        ],
        duration: '4 weeks',
      },
      phase3: {
        name: 'Growth Acceleration',
        actions: [
          'Double down on top 2 content formats',
          'Launch a content series (weekly thread, daily tips)',
          'Collaborate with 2-3 accounts in adjacent niches',
          'Optimize posting schedule based on 6 weeks of data',
        ],
        duration: '4 weeks',
      },
      expectedOutcome: isStrugggling
        ? `Expected to move from ${currentPhase} to growing within 6-10 weeks, with ${Math.round(metrics.followers * 1.15)}-${Math.round(metrics.followers * 1.30)} projected followers`
        : `Expected to accelerate growth to 4-6% monthly, reaching ${Math.round(metrics.followers * 1.2)} followers in 90 days`,
    },
  };
};

export const getAIProviderStatus = (): { provider: AIProvider; available: boolean; model: string } => {
  const config = getAIConfig();
  return {
    provider: config.provider,
    available: config.provider !== 'mock',
    model: config.model || 'mock (demo mode)',
  };
};
