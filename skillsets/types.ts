// ============================================================
// SKILLSET TYPE DEFINITIONS
// ============================================================

import { InterviewAnswers, ReportData } from '../types';

// --- Shared Context ---

export interface SkillsetContext {
  answers: InterviewAnswers;
  report: ReportData;
}

// --- 1. Competitive Intelligence ---

export interface CompetitorProfile {
  name: string;
  type: 'direct' | 'indirect' | 'emerging';
  description: string;
  strengths: string[];
  weaknesses: string[];
  marketShare: string;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface MarketGap {
  gap: string;
  opportunity: string;
  difficulty: 'low' | 'medium' | 'high';
  timeToCapture: string;
}

export interface CompetitiveIntelligence {
  landscapeSummary: string;
  competitors: CompetitorProfile[];
  marketGaps: MarketGap[];
  defensibilityScore: number;
  moatStrategy: string;
  firstMoverAdvantages: string[];
  keyDifferentiators: string[];
}

// --- 2. Personal Brand Architect ---

export interface BrandPillar {
  pillar: string;
  description: string;
  contentThemes: string[];
  platforms: string[];
}

export interface BrandVoice {
  tone: string;
  vocabulary: string[];
  avoidWords: string[];
  examplePost: string;
}

export interface PersonalBrand {
  brandStatement: string;
  tagline: string;
  elevatorPitch: string;
  pillars: BrandPillar[];
  voice: BrandVoice;
  visualIdentity: {
    colorPalette: string[];
    fontSuggestion: string;
    imageryStyle: string;
  };
  platformStrategy: {
    platform: string;
    role: string;
    frequency: string;
    contentMix: string;
  }[];
}

// --- 3. Revenue Model Generator ---

export interface RevenueStream {
  name: string;
  model: 'subscription' | 'one-time' | 'freemium' | 'marketplace' | 'licensing' | 'consulting' | 'advertising' | 'affiliate';
  description: string;
  priceRange: string;
  timeToRevenue: string;
  scalability: 'low' | 'medium' | 'high';
  recurringRevenue: boolean;
  estimatedMRR: string;
}

export interface RevenueModel {
  thesis: string;
  primaryModel: string;
  streams: RevenueStream[];
  pricingStrategy: string;
  year1Projection: string;
  year3Projection: string;
  breakEvenAnalysis: string;
  riskFactors: string[];
  monetizationTimeline: {
    phase: string;
    milestone: string;
    revenue: string;
    duration: string;
  }[];
}

// --- 4. Network Strategy ---

export interface NetworkTarget {
  persona: string;
  why: string;
  where: string;
  approach: string;
  value_exchange: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface NetworkEvent {
  type: 'conference' | 'meetup' | 'online_community' | 'podcast' | 'mastermind';
  name: string;
  relevance: string;
  action: string;
}

export interface NetworkStrategy {
  networkingThesis: string;
  innerCircle: NetworkTarget[];
  outerCircle: NetworkTarget[];
  events: NetworkEvent[];
  weeklyPlaybook: {
    day: string;
    action: string;
    platform: string;
    timeMinutes: number;
  }[];
  coldOutreachTemplates: {
    scenario: string;
    template: string;
  }[];
  sixMonthGoal: string;
}

// --- 5. Content Calendar Engine ---

export interface ContentPiece {
  title: string;
  format: 'thread' | 'post' | 'article' | 'video' | 'carousel' | 'newsletter' | 'reel' | 'podcast_pitch';
  platform: string;
  hook: string;
  outline: string[];
  hashtags: string[];
  bestTimeToPost: string;
  pillarAlignment: string;
  goal: 'awareness' | 'engagement' | 'conversion' | 'authority' | 'community';
}

export interface ContentWeek {
  weekNumber: number;
  theme: string;
  pieces: ContentPiece[];
}

export interface ContentCalendar {
  strategy: string;
  contentPillars: string[];
  targetAudience: string;
  postingCadence: string;
  weeks: ContentWeek[];
  repurposingPlan: {
    original: string;
    repurposedTo: string[];
  }[];
  kpiTargets: {
    metric: string;
    target: string;
    timeframe: string;
  }[];
}
