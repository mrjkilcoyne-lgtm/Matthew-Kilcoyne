// ============================================================
// SOCIAL PULSE - Main Dashboard Application
// ============================================================

import React, { useState, useCallback } from 'react';
import {
  DashboardView, PlatformConnection, PlatformMetrics,
  PostAnalytics, ContentSuggestion, GrowthAnalysis,
  DashboardAlert, PlatformId,
} from './types';
import { PLATFORMS, CORE_PLATFORMS } from './utils/platformConfigs';
import { PLATFORM_BENCHMARKS } from './utils/engagementFormulas';
import { Sidebar } from './components/Sidebar';
import { Overview } from './components/Overview';
import { PlatformConnect } from './components/PlatformConnect';
import { ContentSuggestions } from './components/ContentSuggestions';
import { GrowthAdvisor } from './components/GrowthAdvisor';
import { TipsAndTricks } from './components/TipsAndTricks';
import { PostComposer } from './components/PostComposer';
import { getAIProviderStatus } from './services/aiService';
import { BarChart3, X, Bell, Search, Settings } from 'lucide-react';

// --- Generate demo data for showcase ---

const generateDemoConnections = (): PlatformConnection[] => {
  const demoAccounts: Partial<Record<PlatformId, { username: string; followers: number }>> = {
    x: { username: 'yourhandle', followers: 12400 },
    linkedin: { username: 'your-name', followers: 8200 },
    instagram: { username: 'yourname', followers: 15600 },
    youtube: { username: 'YourChannel', followers: 3200 },
    tiktok: { username: 'yourname', followers: 45000 },
    substack: { username: 'yournewsletter', followers: 2100 },
  };

  return Object.keys(PLATFORMS).map(id => {
    const demo = demoAccounts[id as PlatformId];
    return {
      platformId: id as PlatformId,
      connected: !!demo,
      username: demo?.username,
      displayName: demo?.username,
      followerCount: demo?.followers,
      followingCount: Math.round((demo?.followers || 0) * 0.15),
      scopes: PLATFORMS[id as PlatformId]?.scopes || [],
      connectedAt: demo ? Date.now() - 86400000 * 30 : undefined,
      lastSyncAt: demo ? Date.now() - 300000 : undefined,
    };
  });
};

const generateDemoMetrics = (connections: PlatformConnection[]): Record<string, PlatformMetrics> => {
  const metrics: Record<string, PlatformMetrics> = {};
  connections.filter(c => c.connected).forEach(conn => {
    const benchmarks = PLATFORM_BENCHMARKS[conn.platformId];
    const followers = conn.followerCount || 1000;
    metrics[conn.platformId] = {
      platformId: conn.platformId,
      timestamp: Date.now(),
      followers,
      following: conn.followingCount || 200,
      totalPosts: Math.round(followers * 0.03),
      impressions: Math.round(followers * (3 + Math.random() * 5)),
      reach: Math.round(followers * (1.5 + Math.random() * 3)),
      engagementRate: benchmarks?.avgEngagementRate || (2 + Math.random() * 3),
      engagementTotal: Math.round(followers * (benchmarks?.avgEngagementRate || 3) / 100 * 30),
      likes: Math.round(followers * 0.02 * 30),
      comments: Math.round(followers * 0.003 * 30),
      shares: Math.round(followers * 0.001 * 30),
      saves: Math.round(followers * 0.002 * 30),
      clicks: Math.round(followers * 0.005 * 30),
      profileViews: Math.round(followers * 0.01 * 30),
      followerGrowth: Math.round(followers * 0.025),
      followerGrowthRate: 2 + Math.random() * 3,
    };
  });
  return metrics;
};

const generateDemoPosts = (connections: PlatformConnection[]): PostAnalytics[] => {
  const posts: PostAnalytics[] = [];
  const templates = [
    { text: 'Just shipped a major update to our product. Here\'s what changed and why it matters for your workflow:', type: 'text' as const },
    { text: 'The 5 biggest mistakes I see in content strategy (and how to fix each one):', type: 'thread' as const },
    { text: 'Behind the scenes of our latest campaign. The numbers surprised even us:', type: 'image' as const },
    { text: 'Unpopular opinion: Most growth hacks are just procrastination in disguise. Here\'s what actually works:', type: 'text' as const },
    { text: 'I analysed 500 viral posts in our niche. The pattern was unmistakable:', type: 'carousel' as const },
    { text: 'Quick tip that saved us 10 hours per week. Bookmark this:', type: 'text' as const },
    { text: 'The future of our industry in 3 charts. Thread:', type: 'thread' as const },
    { text: 'We A/B tested our content format for 90 days. The winner was clear:', type: 'video' as const },
  ];

  connections.filter(c => c.connected).forEach(conn => {
    templates.forEach((tmpl, i) => {
      const impressions = Math.round(1000 + Math.random() * 20000);
      const likes = Math.round(impressions * (0.01 + Math.random() * 0.05));
      const comments = Math.round(likes * (0.05 + Math.random() * 0.15));
      const shares = Math.round(likes * (0.02 + Math.random() * 0.1));
      const saves = Math.round(likes * (0.03 + Math.random() * 0.08));
      const clicks = Math.round(impressions * (0.005 + Math.random() * 0.02));
      const totalEngagement = likes + comments + shares + saves + clicks;
      const engagementRate = impressions > 0 ? (totalEngagement / impressions) * 100 : 0;

      posts.push({
        id: `${conn.platformId}-${i}`,
        platformId: conn.platformId,
        contentType: tmpl.type,
        text: tmpl.text,
        publishedAt: new Date(Date.now() - (i + 1) * 86400000 * 2).toISOString(),
        impressions,
        reach: Math.round(impressions * 0.7),
        likes,
        comments,
        shares,
        saves,
        clicks,
        engagementRate,
        viralityScore: Math.round(engagementRate * 15),
        sentimentScore: 0.3 + Math.random() * 0.5,
        topPerforming: engagementRate > 5,
        hashtags: ['#growth', '#strategy'],
        mentions: [],
      });
    });
  });

  return posts.sort((a, b) => b.engagementRate - a.engagementRate);
};

const generateDemoAlerts = (): DashboardAlert[] => [
  {
    id: 'alert-1',
    type: 'spike',
    title: 'Engagement Spike',
    message: 'Your latest thread is getting 3.5x normal engagement — consider replying to comments now to amplify reach',
    platformId: 'x',
    timestamp: Date.now() - 3600000,
    read: false,
  },
  {
    id: 'alert-2',
    type: 'milestone',
    title: 'Follower Milestone',
    message: 'Congratulations! You passed 15,000 followers on Instagram',
    platformId: 'instagram',
    timestamp: Date.now() - 86400000,
    read: false,
  },
  {
    id: 'alert-3',
    type: 'tip',
    title: 'Optimal Posting Window',
    message: 'Your LinkedIn audience is most active in 2 hours — consider posting now',
    platformId: 'linkedin',
    timestamp: Date.now() - 7200000,
    read: true,
  },
];

// ============================================================
// DASHBOARD APP COMPONENT
// ============================================================

interface DashboardAppProps {
  onBackToEngine: () => void;
}

export const DashboardApp: React.FC<DashboardAppProps> = ({ onBackToEngine }) => {
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [connections, setConnections] = useState<PlatformConnection[]>(generateDemoConnections);
  const [metrics, setMetrics] = useState<Record<string, PlatformMetrics>>(() => generateDemoMetrics(generateDemoConnections()));
  const [posts] = useState<PostAnalytics[]>(() => generateDemoPosts(generateDemoConnections()));
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);
  const [growthData, setGrowthData] = useState<Record<string, GrowthAnalysis>>({});
  const [alerts] = useState<DashboardAlert[]>(generateDemoAlerts);

  const aiStatus = getAIProviderStatus();

  const handleConnect = useCallback((platformId: PlatformId) => {
    // In production: trigger OAuth flow
    // For demo: simulate connection
    setConnections(prev => prev.map(c =>
      c.platformId === platformId
        ? {
            ...c,
            connected: true,
            username: 'demo_user',
            followerCount: Math.round(1000 + Math.random() * 10000),
            connectedAt: Date.now(),
            lastSyncAt: Date.now(),
          }
        : c
    ));
  }, []);

  const handleDisconnect = useCallback((platformId: PlatformId) => {
    setConnections(prev => prev.map(c =>
      c.platformId === platformId
        ? { ...c, connected: false, username: undefined, followerCount: undefined, accessToken: undefined }
        : c
    ));
    setMetrics(prev => {
      const next = { ...prev };
      delete next[platformId];
      return next;
    });
  }, []);

  const handleUpdateGrowth = useCallback((platformId: PlatformId, data: GrowthAnalysis) => {
    setGrowthData(prev => ({ ...prev, [platformId]: data }));
  }, []);

  const handleNavigate = useCallback((view: string) => {
    setCurrentView(view as DashboardView);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <Overview connections={connections} metrics={metrics} posts={posts} alerts={alerts} onNavigate={handleNavigate} />;
      case 'platforms':
        return <PlatformConnect connections={connections} onConnect={handleConnect} onDisconnect={handleDisconnect} />;
      case 'suggestions':
        return <ContentSuggestions suggestions={suggestions} onUpdateSuggestions={setSuggestions} topPosts={posts} connections={connections} />;
      case 'growth':
        return <GrowthAdvisor connections={connections} growthData={growthData} onUpdateGrowth={handleUpdateGrowth} />;
      case 'tips':
        return <TipsAndTricks connections={connections} />;
      case 'content':
        return <PostComposer connections={connections} />;
      case 'analytics':
        return (
          <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-6">
            <h2 className="text-2xl font-serif font-semibold text-stone-900">Deep Analytics</h2>
            <p className="text-sm text-stone-500">Detailed per-platform analytics with time series data, audience demographics, and content performance breakdowns.</p>
            <div className="bg-white rounded-xl border border-stone-200 p-8 text-center">
              <BarChart3 className="w-10 h-10 mx-auto text-stone-300 mb-3" />
              <h3 className="text-lg font-medium text-stone-700">Coming Soon</h3>
              <p className="text-sm text-stone-500 mt-1">
                Deep analytics with audience retention curves, demographic breakdowns, competitor benchmarking, and content performance matrices will be available once platform APIs are connected.
              </p>
            </div>
          </div>
        );
      case 'trends':
        return (
          <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-6">
            <h2 className="text-2xl font-serif font-semibold text-stone-900">Trends Explorer</h2>
            <p className="text-sm text-stone-500">Real-time trending topics across all connected platforms with relevance scoring and ride-the-wave recommendations.</p>
            <div className="bg-white rounded-xl border border-stone-200 p-8 text-center">
              <svg className="w-10 h-10 mx-auto text-stone-300 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              <h3 className="text-lg font-medium text-stone-700">Coming Soon</h3>
              <p className="text-sm text-stone-500 mt-1">
                Trend detection uses engagement velocity analysis across platforms to identify topics before they peak — connect your platforms to activate.
              </p>
            </div>
          </div>
        );
      case 'calendar':
        return (
          <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-6">
            <h2 className="text-2xl font-serif font-semibold text-stone-900">Content Calendar</h2>
            <p className="text-sm text-stone-500">Schedule and visualise your content pipeline across all platforms.</p>
            <div className="bg-white rounded-xl border border-stone-200 p-8 text-center">
              <svg className="w-10 h-10 mx-auto text-stone-300 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <h3 className="text-lg font-medium text-stone-700">Coming Soon</h3>
              <p className="text-sm text-stone-500 mt-1">
                Drag-and-drop content calendar with optimal time slot suggestions and cross-platform scheduling.
              </p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-6">
            <h2 className="text-2xl font-serif font-semibold text-stone-900">Settings</h2>
            <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-stone-700 mb-2">AI Provider</h3>
                <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${aiStatus.available ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <div>
                    <p className="text-sm font-medium text-stone-800 capitalize">{aiStatus.provider}</p>
                    <p className="text-xs text-stone-500">{aiStatus.model}</p>
                  </div>
                </div>
                {!aiStatus.available && (
                  <p className="text-xs text-amber-600 mt-2">
                    Running in demo mode. Add ANTHROPIC_API_KEY or GEMINI_API_KEY to .env.local for live AI features.
                  </p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-stone-700 mb-2">API Keys</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500 w-28">Anthropic (Claude)</span>
                    <div className="flex-1 h-8 bg-stone-100 rounded-lg flex items-center px-3 text-xs text-stone-400">
                      {aiStatus.provider === 'claude' ? '****configured****' : 'Not configured'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500 w-28">Google (Gemini)</span>
                    <div className="flex-1 h-8 bg-stone-100 rounded-lg flex items-center px-3 text-xs text-stone-400">
                      {aiStatus.provider === 'gemini' ? '****configured****' : 'Not configured'}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-stone-700 mb-2">Connected Platforms</h3>
                <p className="text-xs text-stone-500">
                  {connections.filter(c => c.connected).length} of {Object.keys(PLATFORMS).length} platforms connected
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return <Overview connections={connections} metrics={metrics} posts={posts} alerts={alerts} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F7F4] font-sans text-stone-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        connections={connections}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        alertCount={alerts.filter(a => !a.read).length}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-md border-b border-stone-200 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToEngine}
              className="text-xs text-stone-500 hover:text-stone-700 flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-stone-100 transition-colors"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Confluation Engine
            </button>
            <div className="w-px h-4 bg-stone-200" />
            <h1 className="text-sm font-medium text-stone-700">
              Social Pulse
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className={`text-[10px] px-2 py-0.5 rounded-full ${aiStatus.available ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              AI: {aiStatus.provider}
            </div>
            <button className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 relative">
              <Bell className="w-4 h-4" />
              {alerts.filter(a => !a.read).length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {alerts.filter(a => !a.read).length}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* View content */}
        {renderView()}
      </div>
    </div>
  );
};

export default DashboardApp;
