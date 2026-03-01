// ============================================================
// SOCIAL MEDIA ANALYTICS DASHBOARD - TYPE DEFINITIONS
// ============================================================

// --- Platform Definitions ---

export type PlatformId =
  | 'x' | 'linkedin' | 'facebook' | 'instagram' | 'youtube'
  | 'tiktok' | 'substack' | 'threads' | 'bluesky' | 'mastodon'
  | 'snapchat' | 'telegram' | 'wechat' | 'weibo' | 'vk'
  | 'whatsapp' | 'line' | 'reddit' | 'pinterest';

export type PlatformCategory = 'core' | 'emerging' | 'global_south' | 'messaging';

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  category: PlatformCategory;
  color: string;
  bgColor: string;
  icon: string;
  authUrl: string;
  apiBaseUrl: string;
  scopes: string[];
  regions: string[]; // UK, US, EU, UAE, CANZUK, LATAM, AFRICA, APAC
  features: PlatformFeature[];
}

export type PlatformFeature =
  | 'posting' | 'analytics' | 'scheduling' | 'stories'
  | 'reels' | 'shorts' | 'threads' | 'polls'
  | 'newsletters' | 'live' | 'spaces' | 'dm';

// --- Connection & Auth ---

export interface PlatformConnection {
  platformId: PlatformId;
  connected: boolean;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiry?: number;
  scopes: string[];
  connectedAt?: number;
  lastSyncAt?: number;
  followerCount?: number;
  followingCount?: number;
}

// --- Unified Metrics ---

export interface PlatformMetrics {
  platformId: PlatformId;
  timestamp: number;
  followers: number;
  following: number;
  totalPosts: number;
  impressions: number;
  reach: number;
  engagementRate: number;
  engagementTotal: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks: number;
  profileViews: number;
  followerGrowth: number; // net change
  followerGrowthRate: number; // percentage
}

export interface TimeSeriesPoint {
  date: string; // ISO date
  value: number;
  label?: string;
}

export interface MetricTimeSeries {
  metric: string;
  platformId: PlatformId;
  data: TimeSeriesPoint[];
  trend: 'up' | 'down' | 'flat';
  changePercent: number;
}

// --- Post Analytics ---

export type ContentType = 'text' | 'image' | 'video' | 'carousel' | 'reel' | 'short' | 'story' | 'thread' | 'article' | 'poll' | 'newsletter' | 'live';

export interface PostAnalytics {
  id: string;
  platformId: PlatformId;
  contentType: ContentType;
  text: string;
  mediaUrls?: string[];
  publishedAt: string;
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks: number;
  engagementRate: number;
  viralityScore: number;
  sentimentScore: number; // -1 to 1
  topPerforming: boolean;
  hashtags: string[];
  mentions: string[];
}

// --- Virality & Scoring ---

export interface ViralityAnalysis {
  overallScore: number; // 0-100
  factors: ViralityFactor[];
  prediction: 'low' | 'moderate' | 'high' | 'viral';
  recommendations: string[];
  benchmarkComparison: number; // percentage above/below benchmark
}

export interface ViralityFactor {
  name: string;
  score: number; // 0-100
  weight: number; // how much this factor matters
  description: string;
  improvementTip: string;
}

export interface EngagementVelocity {
  minutesElapsed: number;
  cumulativeEngagement: number;
  velocity: number; // engagement per minute
  isAccelerating: boolean;
}

// --- Algorithm Insights ---

export interface AlgorithmInsight {
  platformId: PlatformId;
  factor: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
  currentScore: number;
  optimalRange: { min: number; max: number };
  description: string;
  actionItem: string;
}

export interface PlatformAlgorithm {
  platformId: PlatformId;
  name: string;
  lastUpdated: string;
  keySignals: AlgorithmSignal[];
  bestPractices: string[];
  avoidList: string[];
  optimalTiming: PostingWindow[];
}

export interface AlgorithmSignal {
  signal: string;
  weight: number; // relative importance 0-1
  description: string;
  howToOptimize: string;
}

export interface PostingWindow {
  dayOfWeek: number; // 0=Sunday
  hourUtc: number;
  score: number; // 0-100 predicted performance
  timezone?: string;
}

// --- Content Suggestions ---

export interface ContentSuggestion {
  id: string;
  platformId: PlatformId;
  contentType: ContentType;
  title: string;
  body: string;
  hashtags: string[];
  estimatedReach: string;
  viralityPotential: 'low' | 'moderate' | 'high' | 'viral';
  reasoning: string;
  basedOn: string; // what data/trend this is based on
  category: SuggestionCategory;
}

export type SuggestionCategory =
  | 'trending_topic' | 'audience_interest' | 'content_gap'
  | 'viral_format' | 'engagement_recovery' | 'cross_platform'
  | 'contrarian' | 'evergreen' | 'newsjacking';

export interface ContentCalendarEntry {
  date: string;
  time: string;
  platformId: PlatformId;
  suggestion: ContentSuggestion;
  status: 'draft' | 'scheduled' | 'published' | 'missed';
}

// --- Trends ---

export interface TrendingTopic {
  topic: string;
  platformId: PlatformId;
  volume: number;
  velocity: number; // rate of growth
  sentiment: number; // -1 to 1
  category: string;
  relatedTopics: string[];
  peakPrediction: string; // when it will peak
  relevanceScore: number; // how relevant to user's niche
  region: string;
}

// --- Growth & Recovery ---

export interface GrowthAnalysis {
  platformId: PlatformId;
  currentPhase: 'nadir' | 'declining' | 'stagnant' | 'growing' | 'accelerating' | 'viral';
  weeklyGrowthRate: number;
  monthlyGrowthRate: number;
  projectedFollowers30d: number;
  projectedFollowers90d: number;
  bottlenecks: GrowthBottleneck[];
  opportunities: GrowthOpportunity[];
  recoveryPlan?: RecoveryPlan;
}

export interface GrowthBottleneck {
  issue: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  impact: string;
  solution: string;
}

export interface GrowthOpportunity {
  opportunity: string;
  effort: 'low' | 'medium' | 'high';
  potentialImpact: string;
  timeframe: string;
  steps: string[];
}

export interface RecoveryPlan {
  diagnosis: string;
  phase1: { name: string; actions: string[]; duration: string };
  phase2: { name: string; actions: string[]; duration: string };
  phase3: { name: string; actions: string[]; duration: string };
  expectedOutcome: string;
}

// --- Dashboard State ---

export type DashboardView =
  | 'overview' | 'analytics' | 'platforms' | 'content'
  | 'suggestions' | 'trends' | 'calendar' | 'growth'
  | 'settings' | 'tips';

export interface DashboardState {
  currentView: DashboardView;
  connections: PlatformConnection[];
  metrics: Record<PlatformId, PlatformMetrics>;
  timeSeries: MetricTimeSeries[];
  posts: PostAnalytics[];
  suggestions: ContentSuggestion[];
  trends: TrendingTopic[];
  algorithms: Record<PlatformId, PlatformAlgorithm>;
  growth: Record<PlatformId, GrowthAnalysis>;
  selectedPlatform: PlatformId | 'all';
  dateRange: DateRange;
  isLoading: boolean;
}

export interface DateRange {
  start: string;
  end: string;
  label: string;
}

// --- Hints & Tips ---

export interface PlatformTip {
  id: string;
  platformId: PlatformId;
  category: 'algorithm' | 'content' | 'timing' | 'engagement' | 'growth' | 'recovery';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'medium' | 'hard';
  implemented: boolean;
}

// --- Notifications ---

export interface DashboardAlert {
  id: string;
  type: 'spike' | 'drop' | 'milestone' | 'trend' | 'tip' | 'warning';
  title: string;
  message: string;
  platformId?: PlatformId;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
}
