import React, { useState } from 'react';
import { PlatformId } from '../types';
import { PLATFORMS, CORE_PLATFORMS, EMERGING_PLATFORMS } from '../utils/platformConfigs';
import { ALGORITHM_SIGNALS, DEFAULT_POSTING_TIMES, PLATFORM_BENCHMARKS } from '../utils/engagementFormulas';
import { Lightbulb, Clock, TrendingUp, AlertTriangle, Zap, BookOpen, CheckCircle } from 'lucide-react';

interface TipsAndTricksProps {
  connections: { platformId: PlatformId; connected: boolean }[];
}

interface TipSection {
  title: string;
  icon: React.ReactNode;
  tips: { text: string; impact: 'high' | 'medium' | 'low' }[];
}

const PLATFORM_TIPS: Record<string, TipSection[]> = {
  x: [
    {
      title: 'Algorithm Signals',
      icon: <Zap className="w-4 h-4 text-amber-500" />,
      tips: [
        { text: 'Reply to every comment within 60 minutes — author replies carry 75x weight in the algorithm', impact: 'high' },
        { text: 'Put links in the first reply, never in the main tweet — external links reduce distribution by ~40%', impact: 'high' },
        { text: 'Engage with 10-15 accounts before posting to "warm up" algorithm visibility', impact: 'high' },
        { text: 'Bookmarks are a strong signal — create reference-worthy content (frameworks, lists, how-tos)', impact: 'medium' },
        { text: 'Premium subscribers get algorithmic priority — consider subscribing if serious about growth', impact: 'medium' },
      ],
    },
    {
      title: 'Content Strategy',
      icon: <BookOpen className="w-4 h-4 text-blue-500" />,
      tips: [
        { text: 'Use threads for complex topics — cumulative engagement across thread boosts the hook tweet', impact: 'high' },
        { text: 'Optimal thread length: 3-7 tweets. Hook tweet must work as a standalone viral tweet', impact: 'medium' },
        { text: 'Self-retweet your best thread 6-12 hours later for a second wave of distribution', impact: 'medium' },
        { text: 'Use 0-1 hashtags max — X relies on semantic understanding, not hashtags, for topic classification', impact: 'low' },
        { text: 'Images boost engagement ~2x vs text-only. Native video outperforms YouTube links', impact: 'medium' },
      ],
    },
    {
      title: 'Virality Patterns',
      icon: <TrendingUp className="w-4 h-4 text-emerald-500" />,
      tips: [
        { text: 'Contrarian takes trigger high-arousal emotions (surprise, curiosity) — strongest sharing drivers', impact: 'high' },
        { text: 'Start with a short, punchy first line that compels a stop-scroll', impact: 'high' },
        { text: '"Open loops" create curiosity gaps: "The answer surprised me" / "Here\'s what happened next"', impact: 'medium' },
        { text: 'Data-driven surprises (stats that contradict expectations) consistently outperform opinions', impact: 'medium' },
      ],
    },
  ],
  linkedin: [
    {
      title: 'Algorithm Signals',
      icon: <Zap className="w-4 h-4 text-amber-500" />,
      tips: [
        { text: 'Dwell time is the #1 ranking signal — write content worth reading, not just scrolling past', impact: 'high' },
        { text: 'Comments are worth 2x more than likes. Meaningful multi-thread discussions carry the most weight', impact: 'high' },
        { text: 'The "golden hour": first 60-90 minutes determine ~70% of total reach. Reply to comments immediately', impact: 'high' },
        { text: 'LinkedIn now uses LLM embeddings to match your expertise to content topics — stay in your lane', impact: 'medium' },
        { text: 'Pod detection is aggressive — LinkedIn catches coordinated engagement and penalises with 97% reach drops', impact: 'high' },
      ],
    },
    {
      title: 'Content Strategy',
      icon: <BookOpen className="w-4 h-4 text-blue-500" />,
      tips: [
        { text: 'Document/carousel posts get 6.6% engagement rate — 278% higher than video, 596% higher than text', impact: 'high' },
        { text: 'Short native video (30-90s) is growing 2x faster than other formats. Vertical video gets highest reach', impact: 'high' },
        { text: 'Write at a 5th-8th grade reading level. Short paragraphs, clear structure, narrative flow', impact: 'medium' },
        { text: 'Personal profiles get 2.75x more impressions and 5x more engagement than company pages', impact: 'medium' },
        { text: 'Avoid external links in posts — add them in the first comment instead (60% distribution penalty)', impact: 'high' },
      ],
    },
    {
      title: 'Hook Writing',
      icon: <Lightbulb className="w-4 h-4 text-purple-500" />,
      tips: [
        { text: 'First ~200 characters determine if people click "see more" — 80% decide based on the hook alone', impact: 'high' },
        { text: 'Contrarian hooks: "Everyone in [industry] is obsessed with X. Here\'s why Y is actually more profitable."', impact: 'high' },
        { text: 'Data hooks: "We analyzed 10,000 [things]. The data shows something counterintuitive."', impact: 'medium' },
        { text: 'Narrative hooks: Start in the middle of the story. "I almost fired my top performer yesterday."', impact: 'medium' },
      ],
    },
  ],
  instagram: [
    {
      title: 'Algorithm Signals',
      icon: <Zap className="w-4 h-4 text-amber-500" />,
      tips: [
        { text: 'Saves and DM shares are the strongest signals — weighted 3-5x higher than likes', impact: 'high' },
        { text: 'Watch time is the #1 Reels signal. First 1.7-3 seconds determine stay-or-scroll', impact: 'high' },
        { text: '55% of Reels views come from non-followers — Reels are your discovery engine', impact: 'high' },
        { text: 'Instagram now functions like a search engine — optimise captions with keywords in first two lines', impact: 'medium' },
        { text: 'Use Trial Reels to A/B test content with non-followers before wider distribution', impact: 'medium' },
      ],
    },
    {
      title: 'Content Mix (2026 Optimal)',
      icon: <BookOpen className="w-4 h-4 text-blue-500" />,
      tips: [
        { text: 'Reels: 60-70% of content mix. Keep 30-90 seconds. Hook in first 3 seconds', impact: 'high' },
        { text: 'Carousels: 20-30% of mix. Up to 20 slides. ~10% engagement rate (highest of any format)', impact: 'high' },
        { text: 'Stories: Post daily. Keep under 5 slides. Use interactive stickers (polls, quizzes, questions)', impact: 'medium' },
        { text: 'Collab posts double your initial audience pool — shared engagement counts for both accounts', impact: 'medium' },
        { text: 'Original content now prioritised over reposts. Instagram penalises visible TikTok watermarks', impact: 'medium' },
      ],
    },
    {
      title: 'Shadowban Recovery',
      icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
      tips: [
        { text: 'Check Account Status in Instagram settings for flagged content', impact: 'high' },
        { text: 'Pause all activity for 48-72 hours to break negative algorithmic feedback loop', impact: 'high' },
        { text: 'Remove all third-party apps via account settings immediately', impact: 'high' },
        { text: 'Resume slowly with high-quality, original content and minimal hashtags (3-5 max)', impact: 'medium' },
        { text: 'Use Instagram\'s "Reset Suggested Content" feature (launched Sept-Oct 2025) to reset your algorithm', impact: 'medium' },
      ],
    },
  ],
  youtube: [
    {
      title: 'Algorithm Signals',
      icon: <Zap className="w-4 h-4 text-amber-500" />,
      tips: [
        { text: 'Click-through rate (CTR) is the primary discovery signal — 5-6%+ is exceptional', impact: 'high' },
        { text: 'Average view duration determines ongoing distribution — 50%+ retention at midpoint is healthy', impact: 'high' },
        { text: 'Session watch time matters — videos that start or extend viewing sessions get more recommendations', impact: 'high' },
        { text: 'Shorts have a completely separate algorithm ranked by swipe-away rate, loop rate, and shares', impact: 'medium' },
        { text: 'Only ~1-2% of subscribers use the notification bell — subscriber engagement matters more', impact: 'low' },
      ],
    },
    {
      title: 'Content Strategy',
      icon: <BookOpen className="w-4 h-4 text-blue-500" />,
      tips: [
        { text: 'Thumbnail is 80% of the battle — expressive faces, minimal text (<12 chars), high-contrast colours', impact: 'high' },
        { text: 'First 30 seconds determine whether the algorithm will push the video further', impact: 'high' },
        { text: 'Post 1-2 quality long-form videos per week + 3-4 Shorts. Consistency > frequency', impact: 'medium' },
        { text: 'Use Shorts to feed the long-form algorithm with new subscribers. Repurpose best moments', impact: 'medium' },
        { text: 'Pin a question as first comment and reply to early comments to boost engagement signals', impact: 'medium' },
      ],
    },
  ],
  tiktok: [
    {
      title: 'Algorithm Signals',
      icon: <Zap className="w-4 h-4 text-amber-500" />,
      tips: [
        { text: 'Completion rate is the #1 factor — 75-100% completion triggers aggressive distribution boost', impact: 'high' },
        { text: 'Shares and saves outweigh likes significantly. "Send this to..." content goes furthest', impact: 'high' },
        { text: 'Rewatches/loops are a powerful subconscious signal. Create content that rewards multiple views', impact: 'high' },
        { text: 'Keywords in captions boost visibility 20-40%. Captions > hashtags for discovery in 2026', impact: 'medium' },
        { text: 'First 200-500 views determine expansion. Optimise for early engagement signals', impact: 'high' },
      ],
    },
    {
      title: 'Content Strategy',
      icon: <BookOpen className="w-4 h-4 text-blue-500" />,
      tips: [
        { text: 'Hook in first 2-4 seconds. Videos with strong hooks have 40% higher completion rates', impact: 'high' },
        { text: 'Sweet spot: 15-30 seconds for virality, up to 60 seconds for educational content', impact: 'medium' },
        { text: 'Series content drives 25% higher follower conversion than standalone videos', impact: 'medium' },
        { text: 'Edutainment (education + entertainment) is the most consistent path to virality in 2026', impact: 'high' },
        { text: 'Use 3-5 strategic hashtags, not 20 generic ones. Quality targeting > volume', impact: 'low' },
      ],
    },
  ],
  substack: [
    {
      title: 'Growth Strategy',
      icon: <TrendingUp className="w-4 h-4 text-emerald-500" />,
      tips: [
        { text: 'Notes are the #1 growth source. 20 min/day writing 1-2 Notes converts 4x better than external traffic', impact: 'high' },
        { text: 'Restacks are the primary distribution signal in the Notes algorithm', impact: 'high' },
        { text: 'The Substack app is now the top source of subscriber growth — even higher than Recommendations', impact: 'high' },
        { text: 'Live Video sends notifications to your entire list with no algorithm filtering', impact: 'high' },
        { text: 'Cross-promote: tease essays on LinkedIn for dozens to hundreds of new subscribers per post', impact: 'medium' },
      ],
    },
    {
      title: 'Content Strategy',
      icon: <BookOpen className="w-4 h-4 text-blue-500" />,
      tips: [
        { text: 'Subject lines determine open rate — A/B test different styles relentlessly', impact: 'high' },
        { text: 'Differentiate with signature content formats (weekly rant, monthly deep dive, recurring series)', impact: 'medium' },
        { text: 'SEO via Substack\'s domain authority means posts can rank on Google. 2-3 deep dives per quarter', impact: 'medium' },
        { text: 'Consistency matters more than frequency — weekly is better than sporadic publishing', impact: 'medium' },
      ],
    },
  ],
};

export const TipsAndTricks: React.FC<TipsAndTricksProps> = ({ connections }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>('x');
  const allPlatforms = [...CORE_PLATFORMS, ...EMERGING_PLATFORMS.filter(p => PLATFORM_TIPS[p])];

  const tips = PLATFORM_TIPS[selectedPlatform] || [];
  const signals = ALGORITHM_SIGNALS[selectedPlatform] || [];
  const timings = DEFAULT_POSTING_TIMES[selectedPlatform];

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-semibold text-stone-900">Tips & Tricks</h2>
        <p className="text-sm text-stone-500 mt-1">
          Platform-specific strategies based on 2025-2026 algorithm research
        </p>
      </div>

      {/* Platform selector tabs */}
      <div className="flex flex-wrap gap-1.5">
        {allPlatforms.map(id => {
          const platform = PLATFORMS[id];
          return (
            <button
              key={id}
              onClick={() => setSelectedPlatform(id)}
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full transition-all border ${
                selectedPlatform === id
                  ? 'font-medium shadow-sm'
                  : 'text-stone-500 border-stone-200 hover:border-stone-300'
              }`}
              style={selectedPlatform === id ? {
                backgroundColor: platform?.color + '15',
                borderColor: platform?.color + '40',
                color: platform?.color,
              } : undefined}
            >
              <div className="w-4 h-4 rounded flex items-center justify-center text-[8px] font-bold text-white" style={{ backgroundColor: platform?.color }}>
                {platform?.name.charAt(0)}
              </div>
              {platform?.name.split('(')[0].trim().split(' ')[0]}
            </button>
          );
        })}
      </div>

      {/* Algorithm Signal Weights */}
      {signals.length > 0 && (
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <h3 className="text-sm font-medium text-stone-700 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            Algorithm Signal Weights — {PLATFORMS[selectedPlatform]?.name}
          </h3>
          <div className="space-y-2">
            {signals.sort((a, b) => b.weight - a.weight).map((signal, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-24 text-xs text-stone-600 font-medium truncate" title={signal.signal}>
                  {signal.signal}
                </div>
                <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.max(5, (signal.weight > 0 ? signal.weight : 0) * 100)}%`,
                      backgroundColor: signal.weight > 0
                        ? signal.weight > 0.7 ? '#EF4444' : signal.weight > 0.4 ? '#F59E0B' : '#6366F1'
                        : '#EF4444',
                    }}
                  />
                </div>
                <span className="text-xs text-stone-400 w-10 text-right">
                  {signal.weight > 0 ? `${(signal.weight * 100).toFixed(0)}%` : 'neg'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Best Posting Times */}
      {timings && (
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <h3 className="text-sm font-medium text-stone-700 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" /> Best Posting Times
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-stone-500 mb-1.5">Best Days</p>
              <div className="flex flex-wrap gap-1">
                {timings.bestDays.map(day => (
                  <span key={day} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg font-medium">
                    {day}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-stone-500 mb-1.5">Best Hours (UTC)</p>
              <div className="flex flex-wrap gap-1">
                {timings.bestHoursUtc.map(hour => (
                  <span key={hour} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg font-medium">
                    {hour}:00
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p className="text-xs text-stone-400 mt-2">{timings.reasoning}</p>
        </div>
      )}

      {/* Tips sections */}
      {tips.map((section, i) => (
        <div key={i} className="bg-white rounded-xl border border-stone-200 p-4">
          <h3 className="text-sm font-medium text-stone-700 mb-3 flex items-center gap-2">
            {section.icon} {section.title}
          </h3>
          <div className="space-y-2">
            {section.tips.map((tip, j) => (
              <div key={j} className="flex items-start gap-2 p-2 rounded-lg hover:bg-stone-50 transition-colors">
                <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                  tip.impact === 'high' ? 'text-emerald-500' :
                  tip.impact === 'medium' ? 'text-blue-500' :
                  'text-stone-300'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-stone-700">{tip.text}</p>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 ${
                  tip.impact === 'high' ? 'bg-emerald-100 text-emerald-700' :
                  tip.impact === 'medium' ? 'bg-blue-100 text-blue-700' :
                  'bg-stone-100 text-stone-500'
                }`}>
                  {tip.impact}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
