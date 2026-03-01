// ============================================================
// ENGAGEMENT & VIRALITY SCORING ALGORITHMS
// ============================================================
// Based on academic research (Berger & Milkman), platform-specific
// algorithm analysis, and industry benchmarking data.

import { PlatformId, PostAnalytics, ViralityAnalysis, ViralityFactor, EngagementVelocity, AlgorithmSignal } from '../types';

// --- Engagement Rate Calculations ---

/**
 * Platform-specific engagement rate formulas.
 * Each platform weights interactions differently.
 */
export const calculateEngagementRate = (
  platformId: PlatformId,
  metrics: {
    impressions: number;
    reach: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    clicks: number;
  }
): number => {
  const { impressions, reach, likes, comments, shares, saves, clicks } = metrics;
  if (impressions === 0) return 0;

  switch (platformId) {
    case 'x':
      // X weights: replies most valuable (13.5x in algorithm), then retweets, likes, bookmarks
      return ((likes + comments * 2 + shares * 2 + saves * 1.5 + clicks) / impressions) * 100;

    case 'linkedin':
      // LinkedIn: comments are king (trigger "high quality" classification), shares amplify
      return ((likes + comments * 3 + shares * 2.5 + clicks * 0.5) / impressions) * 100;

    case 'facebook':
      // Facebook MSI: meaningful interactions weighted heavily
      return ((likes + comments * 2.5 + shares * 3 + clicks * 0.5) / reach) * 100;

    case 'instagram':
      // Instagram: saves and shares are the strongest signals (2025+ algorithm)
      return ((likes + comments * 2 + shares * 3 + saves * 3) / reach) * 100;

    case 'youtube':
      // YouTube: watch time is primary, but engagement signals matter for discovery
      return ((likes + comments * 2 + shares * 2) / impressions) * 100;

    case 'tiktok':
      // TikTok: completion rate is king, shares are viral fuel
      return ((likes + comments * 1.5 + shares * 3 + saves * 2) / impressions) * 100;

    case 'substack':
      // Substack: opens and clicks are primary (email metrics)
      return ((likes + comments * 2 + clicks * 1.5) / reach) * 100;

    case 'threads':
      return ((likes + comments * 2.5 + shares * 2) / impressions) * 100;

    case 'bluesky':
      return ((likes + comments * 2 + shares * 2) / impressions) * 100;

    default:
      // Generic formula
      return ((likes + comments * 2 + shares * 2 + saves + clicks * 0.5) / impressions) * 100;
  }
};

// --- Virality Score ---

/**
 * Calculate a 0-100 virality score for a post.
 * Combines engagement velocity, reach multiplier, share ratio,
 * and platform-specific benchmarks.
 */
export const calculateViralityScore = (
  post: PostAnalytics,
  benchmarks: PlatformBenchmarks
): ViralityAnalysis => {
  const factors: ViralityFactor[] = [];

  // Factor 1: Engagement Rate vs Benchmark
  const engagementBenchmark = benchmarks.avgEngagementRate;
  const engagementRatio = post.engagementRate / Math.max(engagementBenchmark, 0.01);
  const engagementScore = Math.min(100, engagementRatio * 50);
  factors.push({
    name: 'Engagement Rate',
    score: engagementScore,
    weight: 0.25,
    description: `${post.engagementRate.toFixed(2)}% vs ${engagementBenchmark.toFixed(2)}% benchmark`,
    improvementTip: engagementRatio < 1
      ? 'Try asking questions or including a clear call-to-action to boost engagement'
      : 'Strong engagement — keep using this content format',
  });

  // Factor 2: Share/Amplification Ratio
  const totalEngagement = post.likes + post.comments + post.shares + post.saves;
  const shareRatio = totalEngagement > 0 ? post.shares / totalEngagement : 0;
  const shareScore = Math.min(100, shareRatio * 300); // 33%+ shares = max score
  factors.push({
    name: 'Amplification Ratio',
    score: shareScore,
    weight: 0.3,
    description: `${(shareRatio * 100).toFixed(1)}% of engagement is shares/retweets`,
    improvementTip: shareRatio < 0.1
      ? 'Create more "share-worthy" content: surprising stats, relatable takes, or useful frameworks'
      : 'Your content is being actively shared — this is the strongest virality signal',
  });

  // Factor 3: Save/Bookmark Ratio (indicates lasting value)
  const saveRatio = totalEngagement > 0 ? post.saves / totalEngagement : 0;
  const saveScore = Math.min(100, saveRatio * 400);
  factors.push({
    name: 'Save/Bookmark Rate',
    score: saveScore,
    weight: 0.15,
    description: `${(saveRatio * 100).toFixed(1)}% of engagement is saves/bookmarks`,
    improvementTip: saveRatio < 0.05
      ? 'Add practical, reference-worthy content (lists, frameworks, how-tos) that people want to revisit'
      : 'High save rate indicates your content has lasting value — algorithms love this',
  });

  // Factor 4: Comment/Conversation Depth
  const commentRatio = totalEngagement > 0 ? post.comments / totalEngagement : 0;
  const commentScore = Math.min(100, commentRatio * 250);
  factors.push({
    name: 'Conversation Depth',
    score: commentScore,
    weight: 0.15,
    description: `${(commentRatio * 100).toFixed(1)}% of engagement is comments/replies`,
    improvementTip: commentRatio < 0.1
      ? 'End posts with a question or controversial (but thoughtful) take to spark discussion'
      : 'Great conversation generation — reply to comments to multiply this effect',
  });

  // Factor 5: Reach vs Follower Benchmark
  const reachMultiplier = post.reach / Math.max(benchmarks.avgReach, 1);
  const reachScore = Math.min(100, reachMultiplier * 33);
  factors.push({
    name: 'Reach Multiplier',
    score: reachScore,
    weight: 0.15,
    description: `${reachMultiplier.toFixed(1)}x your average reach`,
    improvementTip: reachMultiplier < 1
      ? 'Post during peak hours and engage with others before posting to warm up algorithmic distribution'
      : 'Above-average reach — the algorithm is amplifying this content',
  });

  // Calculate weighted overall score
  const overallScore = factors.reduce((sum, f) => sum + f.score * f.weight, 0);

  // Determine prediction category
  let prediction: ViralityAnalysis['prediction'];
  if (overallScore >= 80) prediction = 'viral';
  else if (overallScore >= 55) prediction = 'high';
  else if (overallScore >= 30) prediction = 'moderate';
  else prediction = 'low';

  // Generate recommendations
  const recommendations = generateViralityRecommendations(factors, post.platformId);

  const benchmarkComparison = ((post.engagementRate - engagementBenchmark) / Math.max(engagementBenchmark, 0.01)) * 100;

  return {
    overallScore: Math.round(overallScore),
    factors,
    prediction,
    recommendations,
    benchmarkComparison: Math.round(benchmarkComparison),
  };
};

// --- Engagement Velocity ---

/**
 * Track how quickly engagement accumulates.
 * High velocity in first hour = algorithmic amplification trigger.
 */
export const calculateEngagementVelocity = (
  engagementOverTime: { minutesElapsed: number; totalEngagement: number }[]
): EngagementVelocity[] => {
  return engagementOverTime.map((point, i) => {
    const prevPoint = i > 0 ? engagementOverTime[i - 1] : { minutesElapsed: 0, totalEngagement: 0 };
    const timeDelta = point.minutesElapsed - prevPoint.minutesElapsed;
    const engagementDelta = point.totalEngagement - prevPoint.totalEngagement;
    const velocity = timeDelta > 0 ? engagementDelta / timeDelta : 0;

    const prevVelocity = i > 1
      ? (engagementOverTime[i - 1].totalEngagement - engagementOverTime[i - 2].totalEngagement) /
        (engagementOverTime[i - 1].minutesElapsed - engagementOverTime[i - 2].minutesElapsed)
      : 0;

    return {
      minutesElapsed: point.minutesElapsed,
      cumulativeEngagement: point.totalEngagement,
      velocity,
      isAccelerating: velocity > prevVelocity,
    };
  });
};

// --- Platform Benchmarks ---

export interface PlatformBenchmarks {
  platformId: PlatformId;
  avgEngagementRate: number;
  avgReach: number;
  avgLikes: number;
  avgComments: number;
  avgShares: number;
  viralThreshold: number; // engagement rate that qualifies as "viral"
  growthRateBenchmark: number; // monthly follower growth %
}

/**
 * Industry benchmarks for 2025-2026.
 * These represent median performance across accounts.
 */
export const PLATFORM_BENCHMARKS: Record<string, PlatformBenchmarks> = {
  x: {
    platformId: 'x',
    avgEngagementRate: 1.5,
    avgReach: 500,
    avgLikes: 8,
    avgComments: 1,
    avgShares: 2,
    viralThreshold: 10,
    growthRateBenchmark: 2.5,
  },
  linkedin: {
    platformId: 'linkedin',
    avgEngagementRate: 3.2,
    avgReach: 1200,
    avgLikes: 25,
    avgComments: 5,
    avgShares: 3,
    viralThreshold: 15,
    growthRateBenchmark: 3.0,
  },
  facebook: {
    platformId: 'facebook',
    avgEngagementRate: 0.6,
    avgReach: 300,
    avgLikes: 12,
    avgComments: 2,
    avgShares: 1,
    viralThreshold: 5,
    growthRateBenchmark: 0.5,
  },
  instagram: {
    platformId: 'instagram',
    avgEngagementRate: 4.7,
    avgReach: 800,
    avgLikes: 50,
    avgComments: 5,
    avgShares: 3,
    viralThreshold: 20,
    growthRateBenchmark: 3.5,
  },
  youtube: {
    platformId: 'youtube',
    avgEngagementRate: 3.5,
    avgReach: 2000,
    avgLikes: 40,
    avgComments: 8,
    avgShares: 5,
    viralThreshold: 15,
    growthRateBenchmark: 2.0,
  },
  tiktok: {
    platformId: 'tiktok',
    avgEngagementRate: 5.9,
    avgReach: 3000,
    avgLikes: 100,
    avgComments: 10,
    avgShares: 15,
    viralThreshold: 25,
    growthRateBenchmark: 8.0,
  },
  substack: {
    platformId: 'substack',
    avgEngagementRate: 35.0, // open rate
    avgReach: 500,
    avgLikes: 10,
    avgComments: 3,
    avgShares: 2,
    viralThreshold: 50,
    growthRateBenchmark: 5.0,
  },
  threads: {
    platformId: 'threads',
    avgEngagementRate: 2.5,
    avgReach: 600,
    avgLikes: 15,
    avgComments: 3,
    avgShares: 2,
    viralThreshold: 12,
    growthRateBenchmark: 4.0,
  },
  bluesky: {
    platformId: 'bluesky',
    avgEngagementRate: 3.8,
    avgReach: 400,
    avgLikes: 12,
    avgComments: 3,
    avgShares: 4,
    viralThreshold: 15,
    growthRateBenchmark: 5.0,
  },
};

// --- Algorithm Signal Weights ---

/**
 * Known/inferred algorithm ranking signals by platform.
 * Weights are relative (0-1) based on open-sourced code,
 * research, and community reverse-engineering.
 */
export const ALGORITHM_SIGNALS: Record<string, AlgorithmSignal[]> = {
  x: [
    { signal: 'Reply from author', weight: 1.0, description: 'Author replying to comments (75x boost in ranking)', howToOptimize: 'Reply to every comment within the first hour' },
    { signal: 'Replies received', weight: 0.85, description: 'Comments/replies trigger 13.5x weight', howToOptimize: 'End tweets with questions or controversial takes' },
    { signal: 'Retweets', weight: 0.55, description: 'Retweets indicate share-worthiness', howToOptimize: 'Create content with a clear takeaway that people want to share' },
    { signal: 'Bookmarks', weight: 0.5, description: 'Bookmarks signal high-value content', howToOptimize: 'Post frameworks, lists, and reference material' },
    { signal: 'Likes', weight: 0.3, description: 'Baseline positive signal', howToOptimize: 'Relatable, agreeable content gets more likes' },
    { signal: 'Dwell time', weight: 0.4, description: 'Time spent reading the tweet', howToOptimize: 'Write longer, formatted content with line breaks' },
    { signal: 'Profile clicks', weight: 0.45, description: 'Clicking through to your profile', howToOptimize: 'Intrigue people enough to want to know more about you' },
    { signal: 'External links', weight: -0.3, description: 'Links to external sites reduce distribution', howToOptimize: 'Put links in replies, not the main tweet' },
    { signal: 'Premium status', weight: 0.2, description: 'Twitter Premium gives a visibility boost', howToOptimize: 'Subscribe to Premium for algorithmic priority' },
    { signal: 'Engagement velocity', weight: 0.7, description: 'Speed of engagement in first 30-60 minutes', howToOptimize: 'Post when audience is online; engage with others first' },
  ],
  linkedin: [
    { signal: 'Comments', weight: 1.0, description: 'Comments are the strongest signal on LinkedIn', howToOptimize: 'Ask questions, share controversial professional takes' },
    { signal: 'Dwell time', weight: 0.9, description: 'Time spent reading — "golden hour" of dwell time', howToOptimize: 'Write long-form posts with compelling hooks' },
    { signal: 'Content quality classification', weight: 0.85, description: 'LinkedIn classifies posts as spam/low/high quality', howToOptimize: 'Avoid engagement bait, use natural language, provide value' },
    { signal: 'Shares', weight: 0.7, description: 'Reshares amplify to new networks', howToOptimize: 'Create insight-rich content worth sharing with colleagues' },
    { signal: 'Document/carousel posts', weight: 0.6, description: 'Carousel PDFs get higher distribution', howToOptimize: 'Create visual slide-style carousels for key insights' },
    { signal: 'Reactions (beyond like)', weight: 0.5, description: 'Celebrate, love, insightful reactions weighted more', howToOptimize: 'Create content that evokes specific emotions' },
    { signal: 'First-hour engagement', weight: 0.8, description: 'Engagement in first 60 minutes is critical', howToOptimize: 'Post at peak times and engage immediately with early commenters' },
    { signal: 'Pod detection', weight: -0.5, description: 'LinkedIn detects engagement pods and penalises', howToOptimize: 'Avoid coordinated engagement groups' },
  ],
  instagram: [
    { signal: 'Saves', weight: 1.0, description: 'Saves are the strongest ranking signal on Instagram', howToOptimize: 'Create educational, reference-worthy content people want to revisit' },
    { signal: 'Shares (DM + Stories)', weight: 0.95, description: 'Content shared via DM or to Stories is weighted highest', howToOptimize: 'Create relatable, shareable content formats' },
    { signal: 'Comments', weight: 0.7, description: 'Genuine comments boost distribution', howToOptimize: 'Ask questions in captions, reply to every comment' },
    { signal: 'Watch time (Reels)', weight: 0.9, description: 'Reel completion rate is critical for Reels distribution', howToOptimize: 'Hook viewers in first 1-3 seconds, keep Reels under 30s' },
    { signal: 'Relationship closeness', weight: 0.6, description: 'Content from close connections shown first', howToOptimize: 'Build genuine relationships via DMs and consistent interaction' },
    { signal: 'Content freshness', weight: 0.5, description: 'Newer content gets priority', howToOptimize: 'Post consistently at optimal times for your audience' },
    { signal: 'Carousel engagement', weight: 0.7, description: 'Multiple-image carousels increase time-on-post', howToOptimize: 'Use 5-10 slide carousels with a hook on slide 1' },
    { signal: 'Hashtags', weight: 0.15, description: 'Hashtags matter less than before but still help discoverability', howToOptimize: 'Use 5-10 relevant, specific hashtags — avoid generic ones' },
  ],
  youtube: [
    { signal: 'Click-through rate (CTR)', weight: 1.0, description: 'Thumbnail + title CTR is the primary discovery signal', howToOptimize: 'A/B test thumbnails with high-contrast, emotional faces, minimal text' },
    { signal: 'Average view duration', weight: 0.95, description: 'How long viewers watch determines ongoing distribution', howToOptimize: 'Front-load value, use pattern interrupts every 30-60 seconds' },
    { signal: 'Session watch time', weight: 0.8, description: 'Does your video lead to more YouTube watching?', howToOptimize: 'Suggest next videos, create series, avoid sending viewers off-platform' },
    { signal: 'Likes', weight: 0.3, description: 'Positive signal but lower weight than retention', howToOptimize: 'Ask viewers to like — direct CTAs work' },
    { signal: 'Comments', weight: 0.4, description: 'Active comment sections signal engaging content', howToOptimize: 'Pin a question as first comment; reply to early comments' },
    { signal: 'Subscribers from video', weight: 0.5, description: 'New subscribers signals high-value content', howToOptimize: 'Include subscribe CTA in first 30 seconds and end screen' },
    { signal: 'Shorts completion rate', weight: 0.9, description: 'For Shorts: loop/completion rate is the primary signal', howToOptimize: 'Keep Shorts under 30s with a hook in first 2 seconds' },
  ],
  tiktok: [
    { signal: 'Completion rate', weight: 1.0, description: 'Video watched to end (or looped) is the top signal', howToOptimize: 'Keep videos short (15-30s), start with immediate hook' },
    { signal: 'Shares', weight: 0.9, description: 'Shares trigger rapid distribution to new audiences', howToOptimize: 'Create "send this to..." content that people forward to friends' },
    { signal: 'Saves', weight: 0.75, description: 'Saves indicate high-value content', howToOptimize: 'Educational and tutorial content gets saved most' },
    { signal: 'Comments', weight: 0.65, description: 'Comments signal engagement and controversy', howToOptimize: 'Include a "hot take" or question that compels response' },
    { signal: 'Rewatches/loops', weight: 0.85, description: 'Multiple views of the same video = strong signal', howToOptimize: 'Create content that rewards rewatching (hidden details, fast info)' },
    { signal: 'Trending sounds', weight: 0.5, description: 'Using trending audio gets distribution boost', howToOptimize: 'Monitor trending sounds and adapt them to your niche' },
    { signal: 'Batch testing', weight: 0.6, description: 'TikTok shows to small batches first, then expands', howToOptimize: 'Optimise for first 200-500 views — early signals determine expansion' },
  ],
};

// --- Recommendation Generation ---

const generateViralityRecommendations = (factors: ViralityFactor[], platformId: PlatformId): string[] => {
  const recommendations: string[] = [];

  // Sort factors by potential improvement (low score + high weight = high priority)
  const sortedFactors = [...factors].sort((a, b) => (a.score * a.weight) - (b.score * b.weight));

  // Take top 3 improvement areas
  for (const factor of sortedFactors.slice(0, 3)) {
    if (factor.score < 60) {
      recommendations.push(factor.improvementTip);
    }
  }

  // Platform-specific recommendations
  const platformTips = PLATFORM_SPECIFIC_TIPS[platformId];
  if (platformTips) {
    recommendations.push(platformTips[Math.floor(Math.random() * platformTips.length)]);
  }

  return recommendations.length > 0 ? recommendations : ['Keep creating consistent, high-quality content — your metrics are strong'];
};

const PLATFORM_SPECIFIC_TIPS: Record<string, string[]> = {
  x: [
    'Reply to every comment on your tweets within 60 minutes — author replies have 75x weight in the algorithm',
    'Post links in the first reply, not the main tweet — external links reduce distribution',
    'Use threads for complex topics — cumulative engagement boosts the hook tweet',
    'Engage with 10-15 accounts before posting to "warm up" the algorithm',
  ],
  linkedin: [
    'Use carousel/document posts — they get 3x more engagement than text-only',
    'Write a compelling first 2-3 lines — 80% of readers decide to click "see more" based on the hook',
    'Comment on 5-10 posts from your network before publishing to boost your visibility',
    'Avoid external links in the main post — put them in the first comment instead',
  ],
  instagram: [
    'Saves and shares now outweigh likes in the algorithm — create reference-worthy content',
    'Use carousel posts with 7-10 slides for maximum dwell time',
    'Post Reels with hooks in the first 1-3 seconds for Explore page distribution',
    'Reply to every comment and DM — relationship signals boost your visibility',
  ],
  youtube: [
    'Your thumbnail is 80% of the battle — test multiple versions and track CTR',
    'The first 30 seconds determine if viewers stay — front-load value and curiosity',
    'Post Shorts consistently to feed the long-form algorithm with new subscribers',
    'End videos with a question to boost comment engagement',
  ],
  tiktok: [
    'First 2 seconds are everything — start with motion, text, or a surprising statement',
    'Keep videos under 30 seconds for maximum completion rate',
    'Use trending sounds but add your unique niche spin',
    'Post 1-3 times daily for optimal algorithm consideration',
  ],
  substack: [
    'Your subject line determines open rate — A/B test different styles',
    'Cross-post Notes to build discovery through the Substack network',
    'Recommend other Substacks to get recommendation reciprocity',
    'Consistency matters more than frequency — weekly is better than sporadic',
  ],
};

// --- Optimal Posting Times ---

export interface PostingTimeRecommendation {
  platformId: PlatformId;
  bestDays: string[];
  bestHoursUtc: number[];
  timezone: string;
  reasoning: string;
}

/**
 * General best posting times by platform (UTC).
 * Should be personalised based on the user's actual audience analytics.
 */
export const DEFAULT_POSTING_TIMES: Record<string, PostingTimeRecommendation> = {
  x: {
    platformId: 'x',
    bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
    bestHoursUtc: [8, 9, 12, 17, 18],
    timezone: 'UTC',
    reasoning: 'X engagement peaks during morning commute and evening wind-down. Mid-week sees highest activity.',
  },
  linkedin: {
    platformId: 'linkedin',
    bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
    bestHoursUtc: [7, 8, 9, 12, 17],
    timezone: 'UTC',
    reasoning: 'LinkedIn is a professional platform — engagement peaks during work hours, especially early morning.',
  },
  instagram: {
    platformId: 'instagram',
    bestDays: ['Monday', 'Wednesday', 'Friday'],
    bestHoursUtc: [11, 12, 17, 18, 19],
    timezone: 'UTC',
    reasoning: 'Instagram engagement peaks during lunch breaks and evening browsing.',
  },
  youtube: {
    platformId: 'youtube',
    bestDays: ['Thursday', 'Friday', 'Saturday'],
    bestHoursUtc: [14, 15, 16, 17],
    timezone: 'UTC',
    reasoning: 'Publish in afternoon to build initial engagement before the evening viewing peak.',
  },
  tiktok: {
    platformId: 'tiktok',
    bestDays: ['Tuesday', 'Thursday', 'Friday'],
    bestHoursUtc: [10, 11, 14, 15, 19, 20],
    timezone: 'UTC',
    reasoning: 'TikTok has multiple daily peaks — morning, afternoon, and prime evening hours.',
  },
  facebook: {
    platformId: 'facebook',
    bestDays: ['Wednesday', 'Thursday', 'Friday'],
    bestHoursUtc: [9, 10, 12, 13],
    timezone: 'UTC',
    reasoning: 'Facebook engagement is highest mid-morning to early afternoon during the work week.',
  },
  substack: {
    platformId: 'substack',
    bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
    bestHoursUtc: [7, 8, 9],
    timezone: 'UTC',
    reasoning: 'Newsletter open rates peak in early morning when people check email.',
  },
};

// --- Content Emotional Analysis ---

/**
 * Emotional valence scores for content virality prediction.
 * Based on Berger & Milkman (2012) research on what makes content go viral.
 * High-arousal emotions (positive or negative) drive sharing.
 */
export const VIRAL_EMOTION_WEIGHTS: Record<string, number> = {
  awe: 0.95,           // Most shared
  anxiety: 0.85,       // High arousal negative
  anger: 0.80,         // High arousal negative
  humor: 0.90,         // High arousal positive
  surprise: 0.85,      // High arousal
  inspiration: 0.88,   // High arousal positive
  practical_value: 0.75, // Useful content gets shared
  nostalgia: 0.60,     // Moderate sharing trigger
  sadness: 0.30,       // Low arousal — deactivating emotion, low share rate
  contentment: 0.25,   // Low arousal — pleasant but no urgency to share
};

/**
 * Content format multipliers for virality potential.
 */
export const FORMAT_VIRALITY_MULTIPLIERS: Record<string, number> = {
  thread: 1.3,
  carousel: 1.4,
  reel: 1.6,
  short: 1.5,
  video: 1.4,
  image: 1.2,
  text: 1.0,
  article: 0.9,
  poll: 1.3,
  story: 0.7, // Stories are ephemeral, less viral
  newsletter: 0.6, // Newsletters are push-based, less viral
  live: 1.1,
};
