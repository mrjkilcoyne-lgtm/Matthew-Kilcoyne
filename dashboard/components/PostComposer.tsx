import React, { useState } from 'react';
import { PlatformId, ContentType } from '../types';
import { optimizePost } from '../services/aiService';
import { PLATFORMS, CORE_PLATFORMS } from '../utils/platformConfigs';
import { DEFAULT_POSTING_TIMES, ALGORITHM_SIGNALS } from '../utils/engagementFormulas';
import { PenTool, Sparkles, RefreshCw, Copy, Check, Clock, Zap, Send, AlertCircle } from 'lucide-react';

interface PostComposerProps {
  connections: { platformId: PlatformId; connected: boolean }[];
  onPostDraft?: (platformId: PlatformId, content: string) => void;
}

const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: 'text', label: 'Text Post' },
  { value: 'thread', label: 'Thread' },
  { value: 'image', label: 'Image Post' },
  { value: 'video', label: 'Video' },
  { value: 'carousel', label: 'Carousel' },
  { value: 'reel', label: 'Reel / Short' },
  { value: 'poll', label: 'Poll' },
  { value: 'article', label: 'Article' },
  { value: 'newsletter', label: 'Newsletter' },
];

const CHAR_LIMITS: Partial<Record<PlatformId, number>> = {
  x: 280,
  linkedin: 3000,
  facebook: 63206,
  instagram: 2200,
  threads: 500,
  bluesky: 300,
};

export const PostComposer: React.FC<PostComposerProps> = ({ connections }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>('x');
  const [contentType, setContentType] = useState<ContentType>('text');
  const [draft, setDraft] = useState('');
  const [optimizedContent, setOptimizedContent] = useState<{ optimized: string; changes: string[]; predictedLift: string } | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [copied, setCopied] = useState(false);

  const connectedPlatforms = connections.filter(c => c.connected).map(c => c.platformId);
  const availablePlatforms = connectedPlatforms.length > 0 ? connectedPlatforms : CORE_PLATFORMS;
  const charLimit = CHAR_LIMITS[selectedPlatform] || 5000;
  const signals = ALGORITHM_SIGNALS[selectedPlatform];
  const timings = DEFAULT_POSTING_TIMES[selectedPlatform];

  const handleOptimize = async () => {
    if (!draft.trim()) return;
    setIsOptimizing(true);
    try {
      const result = await optimizePost(selectedPlatform, draft, contentType);
      setOptimizedContent(result);
    } catch (err) {
      console.error('Optimization failed:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const charCount = draft.length;
  const isOverLimit = charCount > charLimit;

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-semibold text-stone-900">Post Composer</h2>
        <p className="text-sm text-stone-500 mt-1">
          Draft, optimise, and preview posts with AI-powered algorithm alignment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Compose area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Platform + type selectors */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-stone-500 font-medium block mb-1">Platform</label>
              <select
                value={selectedPlatform}
                onChange={e => { setSelectedPlatform(e.target.value as PlatformId); setOptimizedContent(null); }}
                className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {availablePlatforms.map(id => (
                  <option key={id} value={id}>{PLATFORMS[id]?.name}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs text-stone-500 font-medium block mb-1">Content Type</label>
              <select
                value={contentType}
                onChange={e => setContentType(e.target.value as ContentType)}
                className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {CONTENT_TYPES.map(ct => (
                  <option key={ct.value} value={ct.value}>{ct.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Draft textarea */}
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="p-4">
              <textarea
                value={draft}
                onChange={e => { setDraft(e.target.value); setOptimizedContent(null); }}
                placeholder={`Write your ${PLATFORMS[selectedPlatform]?.name} post here...`}
                className="w-full min-h-[200px] text-sm text-stone-800 placeholder-stone-400 resize-none focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between px-4 py-2 border-t border-stone-100 bg-stone-50">
              <span className={`text-xs ${isOverLimit ? 'text-red-500 font-medium' : 'text-stone-400'}`}>
                {charCount}/{charLimit} characters
                {isOverLimit && <AlertCircle className="w-3 h-3 inline ml-1" />}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleOptimize}
                  disabled={!draft.trim() || isOptimizing}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 disabled:opacity-50"
                >
                  {isOptimizing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  {isOptimizing ? 'Optimizing...' : 'AI Optimize'}
                </button>
              </div>
            </div>
          </div>

          {/* Optimized version */}
          {optimizedContent && (
            <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-emerald-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> AI-Optimised Version
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                    {optimizedContent.predictedLift} predicted lift
                  </span>
                  <button
                    onClick={() => handleCopy(optimizedContent.optimized)}
                    className="text-xs text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3">
                <p className="text-sm text-stone-800 whitespace-pre-line">{optimizedContent.optimized}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-emerald-700 mb-1">Changes made:</p>
                <ul className="space-y-0.5">
                  {optimizedContent.changes.map((change, i) => (
                    <li key={i} className="text-xs text-emerald-600 flex items-start gap-1">
                      <Check className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      {change}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setDraft(optimizedContent.optimized)}
                className="text-xs text-emerald-700 font-medium hover:text-emerald-800 flex items-center gap-1"
              >
                <Send className="w-3 h-3" /> Use this version
              </button>
            </div>
          )}
        </div>

        {/* Right: Tips sidebar */}
        <div className="space-y-4">
          {/* Posting tips */}
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <h3 className="text-sm font-medium text-stone-700 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Quick Tips — {PLATFORMS[selectedPlatform]?.name.split('(')[0].trim()}
            </h3>
            <div className="space-y-2">
              {(signals || []).slice(0, 4).map((signal, i) => (
                <div key={i} className="text-xs text-stone-600 flex items-start gap-1.5 p-1.5 rounded hover:bg-stone-50">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: signal.weight > 0.7 ? '#EF4444' : signal.weight > 0.4 ? '#F59E0B' : '#6366F1' }} />
                  <span>{signal.howToOptimize}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Best posting times */}
          {timings && (
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <h3 className="text-sm font-medium text-stone-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" /> Best Times to Post
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-stone-500 mb-1">Days</p>
                  <div className="flex flex-wrap gap-1">
                    {timings.bestDays.map(day => (
                      <span key={day} className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                        {day.slice(0, 3)}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-stone-500 mb-1">Hours (UTC)</p>
                  <div className="flex flex-wrap gap-1">
                    {timings.bestHoursUtc.map(h => (
                      <span key={h} className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-medium">
                        {h}:00
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Character guidelines */}
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <h3 className="text-sm font-medium text-stone-700 mb-2">Content Guidelines</h3>
            <div className="space-y-1.5 text-xs text-stone-500">
              {selectedPlatform === 'x' && (
                <>
                  <p>70-100 characters optimal for engagement</p>
                  <p>0-1 hashtags (X uses semantic classification)</p>
                  <p>Put links in replies, not main tweet</p>
                </>
              )}
              {selectedPlatform === 'linkedin' && (
                <>
                  <p>First 200 chars are the hook (before "see more")</p>
                  <p>1-3 hashtags maximum</p>
                  <p>Put links in first comment</p>
                  <p>5th-8th grade reading level performs best</p>
                </>
              )}
              {selectedPlatform === 'instagram' && (
                <>
                  <p>Keywords in first 2 lines for search</p>
                  <p>3-5 relevant hashtags (not 20+)</p>
                  <p>Include a CTA in caption</p>
                </>
              )}
              {selectedPlatform === 'tiktok' && (
                <>
                  <p>Concise captions with keywords</p>
                  <p>3-5 strategic hashtags</p>
                  <p>Keywords beat hashtags for discovery in 2026</p>
                </>
              )}
              {selectedPlatform === 'youtube' && (
                <>
                  <p>Primary keyword in first 50 characters</p>
                  <p>Create curiosity gap in title</p>
                  <p>Description: key info in first 2-3 lines</p>
                </>
              )}
              {selectedPlatform === 'substack' && (
                <>
                  <p>Subject line is everything for open rate</p>
                  <p>A/B test different subject line styles</p>
                  <p>Use Notes for discovery and engagement</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
