import React, { useState } from 'react';
import { ContentSuggestion, PlatformId, PostAnalytics } from '../types';
import { generateContentSuggestions } from '../services/aiService';
import { PLATFORMS, CORE_PLATFORMS } from '../utils/platformConfigs';
import { Sparkles, RefreshCw, Copy, Check, TrendingUp, Bookmark, Zap, Target, ArrowRight } from 'lucide-react';

interface ContentSuggestionsProps {
  suggestions: ContentSuggestion[];
  onUpdateSuggestions: (suggestions: ContentSuggestion[]) => void;
  topPosts: PostAnalytics[];
  connections: { platformId: PlatformId; connected: boolean }[];
}

const NICHES = [
  'Technology', 'Business', 'Finance', 'Health', 'Fitness', 'Marketing',
  'AI & Machine Learning', 'Startups', 'Leadership', 'Creativity',
  'Sustainability', 'Education', 'Real Estate', 'Crypto', 'Science',
];

const TONES = ['Professional', 'Conversational', 'Bold', 'Educational', 'Witty', 'Inspirational'];

const CATEGORY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  trending_topic: { bg: 'bg-pink-100', text: 'text-pink-700', label: 'Trending' },
  audience_interest: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Audience Interest' },
  content_gap: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Content Gap' },
  viral_format: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Viral Format' },
  engagement_recovery: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Recovery' },
  cross_platform: { bg: 'bg-cyan-100', text: 'text-cyan-700', label: 'Cross-Platform' },
  contrarian: { bg: 'bg-red-100', text: 'text-red-700', label: 'Contrarian' },
  evergreen: { bg: 'bg-green-100', text: 'text-green-700', label: 'Evergreen' },
  newsjacking: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Newsjacking' },
};

export const ContentSuggestions: React.FC<ContentSuggestionsProps> = ({
  suggestions,
  onUpdateSuggestions,
  topPosts,
  connections,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>('x');
  const [niche, setNiche] = useState('Technology');
  const [tone, setTone] = useState('Professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const connectedPlatforms = connections.filter(c => c.connected).map(c => c.platformId);
  const availablePlatforms = connectedPlatforms.length > 0 ? connectedPlatforms : CORE_PLATFORMS;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const newSuggestions = await generateContentSuggestions(
        selectedPlatform,
        topPosts.filter(p => p.platformId === selectedPlatform),
        niche,
        tone,
      );
      onUpdateSuggestions(newSuggestions);
    } catch (err) {
      console.error('Failed to generate suggestions:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const viralityColors: Record<string, string> = {
    viral: '#EF4444',
    high: '#F59E0B',
    moderate: '#6366F1',
    low: '#6B7280',
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-semibold text-stone-900">AI Content Suggestions</h2>
        <p className="text-sm text-stone-500 mt-1">
          Get algorithm-optimised post ideas based on your niche, performance data, and platform signals
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-stone-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Platform */}
          <div>
            <label className="text-xs text-stone-500 font-medium block mb-1">Platform</label>
            <select
              value={selectedPlatform}
              onChange={e => setSelectedPlatform(e.target.value as PlatformId)}
              className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              {availablePlatforms.map(id => (
                <option key={id} value={id}>{PLATFORMS[id]?.name}</option>
              ))}
            </select>
          </div>

          {/* Niche */}
          <div>
            <label className="text-xs text-stone-500 font-medium block mb-1">Niche / Topic</label>
            <select
              value={niche}
              onChange={e => setNiche(e.target.value)}
              className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          {/* Tone */}
          <div>
            <label className="text-xs text-stone-500 font-medium block mb-1">Tone</label>
            <select
              value={tone}
              onChange={e => setTone(e.target.value)}
              className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              {TONES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Generate button */}
          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Ideas
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Suggestions Grid */}
      {suggestions.length > 0 ? (
        <div className="space-y-3">
          {suggestions.map((suggestion, i) => {
            const catStyle = CATEGORY_STYLES[suggestion.category] || CATEGORY_STYLES.evergreen;
            const isExpanded = expandedId === suggestion.id;

            return (
              <div
                key={suggestion.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : suggestion.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${catStyle.bg} ${catStyle.text}`}>
                          {catStyle.label}
                        </span>
                        <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                          {suggestion.contentType}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] font-medium" style={{ color: viralityColors[suggestion.viralityPotential] }}>
                          <Zap className="w-3 h-3" />
                          {suggestion.viralityPotential} viral potential
                        </div>
                      </div>
                      <h3 className="font-medium text-stone-900">{suggestion.title}</h3>
                      <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                        <Target className="w-3 h-3" /> {suggestion.estimatedReach} estimated reach
                      </p>
                    </div>
                    <ArrowRight className={`w-4 h-4 text-stone-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-stone-100 pt-3 space-y-3">
                    {/* Post body */}
                    <div className="bg-stone-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-stone-400 uppercase font-medium">Ready-to-post content</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCopy(suggestion.body, suggestion.id); }}
                          className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                        >
                          {copiedId === suggestion.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {copiedId === suggestion.id ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <p className="text-sm text-stone-700 whitespace-pre-line">{suggestion.body}</p>
                    </div>

                    {/* Hashtags */}
                    {suggestion.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {suggestion.hashtags.map(tag => (
                          <span key={tag} className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                            {tag.startsWith('#') ? tag : `#${tag}`}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Reasoning */}
                    <div className="text-xs text-stone-500 space-y-1">
                      <p><span className="font-medium text-stone-600">Why this will work:</span> {suggestion.reasoning}</p>
                      <p><span className="font-medium text-stone-600">Based on:</span> {suggestion.basedOn}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <Sparkles className="w-10 h-10 mx-auto text-stone-300 mb-3" />
          <h3 className="text-lg font-medium text-stone-700 mb-1">No suggestions yet</h3>
          <p className="text-sm text-stone-500 mb-4">
            Select your platform, niche, and tone above, then click "Generate Ideas" to get AI-powered content suggestions
          </p>
          <p className="text-xs text-stone-400">
            Suggestions are optimised for each platform's specific algorithm signals
          </p>
        </div>
      )}
    </div>
  );
};
