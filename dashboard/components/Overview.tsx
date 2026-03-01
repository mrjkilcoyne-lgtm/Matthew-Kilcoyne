import React from 'react';
import { PlatformConnection, PlatformMetrics, PostAnalytics, DashboardAlert, PlatformId } from '../types';
import { MetricCard, PlatformBadge } from './MetricCard';
import { AreaChart, BarChart, DonutChart, GaugeChart } from './MiniChart';
import { PLATFORMS } from '../utils/platformConfigs';
import { Users, Eye, MessageCircle, Share2, Bookmark, TrendingUp, Zap, Award, Sparkles, Lightbulb } from 'lucide-react';

interface OverviewProps {
  connections: PlatformConnection[];
  metrics: Record<string, PlatformMetrics>;
  posts: PostAnalytics[];
  alerts: DashboardAlert[];
  onNavigate: (view: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({
  connections,
  metrics,
  posts,
  alerts,
  onNavigate,
}) => {
  const connectedPlatforms = connections.filter(c => c.connected);
  const allMetrics = Object.values(metrics);

  // Aggregate metrics
  const totalFollowers = allMetrics.reduce((s, m) => s + m.followers, 0);
  const totalImpressions = allMetrics.reduce((s, m) => s + m.impressions, 0);
  const totalEngagement = allMetrics.reduce((s, m) => s + m.engagementTotal, 0);
  const avgEngagementRate = allMetrics.length > 0
    ? allMetrics.reduce((s, m) => s + m.engagementRate, 0) / allMetrics.length
    : 0;
  const totalFollowerGrowth = allMetrics.reduce((s, m) => s + m.followerGrowth, 0);
  const avgGrowthRate = allMetrics.length > 0
    ? allMetrics.reduce((s, m) => s + m.followerGrowthRate, 0) / allMetrics.length
    : 0;

  // Top posts
  const topPosts = [...posts].sort((a, b) => b.engagementRate - a.engagementRate).slice(0, 5);

  // Platform breakdown for charts
  const platformEngagementData = allMetrics.map(m => ({
    label: PLATFORMS[m.platformId]?.name.split(' ')[0] || m.platformId,
    value: m.engagementTotal,
    color: PLATFORMS[m.platformId]?.color || '#6366F1',
  }));

  const platformFollowerData = allMetrics.map(m => ({
    label: PLATFORMS[m.platformId]?.name.split(' ')[0] || m.platformId,
    value: m.followers,
    color: PLATFORMS[m.platformId]?.color || '#6366F1',
  }));

  // Simulated sparkline data (in production, from time series)
  const followerSparkline = generateSparkline(totalFollowers, 14);
  const impressionSparkline = generateSparkline(totalImpressions, 14);
  const engagementSparkline = generateSparkline(totalEngagement, 14);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-stone-900">Dashboard Overview</h2>
          <p className="text-sm text-stone-500 mt-1">
            {connectedPlatforms.length > 0
              ? `Monitoring ${connectedPlatforms.length} platform${connectedPlatforms.length > 1 ? 's' : ''} across ${totalFollowers.toLocaleString()} followers`
              : 'Connect your social accounts to get started'}
          </p>
        </div>
        {connectedPlatforms.length === 0 && (
          <button
            onClick={() => onNavigate('platforms')}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Connect Platforms
          </button>
        )}
      </div>

      {/* Alerts */}
      {alerts.filter(a => !a.read).length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">Recent Alerts</span>
          </div>
          <div className="space-y-1">
            {alerts.filter(a => !a.read).slice(0, 3).map(alert => (
              <p key={alert.id} className="text-xs text-amber-700">
                {alert.platformId && <PlatformBadge name={PLATFORMS[alert.platformId]?.name || ''} color={PLATFORMS[alert.platformId]?.color || '#666'} />}
                {' '}{alert.message}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Followers"
          value={totalFollowers}
          change={avgGrowthRate}
          changeLabel="growth this month"
          sparklineData={followerSparkline}
          color="#6366F1"
          icon={<Users className="w-4 h-4" />}
        />
        <MetricCard
          label="Impressions"
          value={totalImpressions}
          change={12.3}
          sparklineData={impressionSparkline}
          color="#06B6D4"
          icon={<Eye className="w-4 h-4" />}
        />
        <MetricCard
          label="Total Engagement"
          value={totalEngagement}
          change={8.7}
          sparklineData={engagementSparkline}
          color="#10B981"
          icon={<MessageCircle className="w-4 h-4" />}
        />
        <MetricCard
          label="Avg Engagement Rate"
          value={`${avgEngagementRate.toFixed(2)}%`}
          change={2.1}
          color="#F59E0B"
          icon={<TrendingUp className="w-4 h-4" />}
          subtitle="Across all platforms"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Follower Growth Chart */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 lg:col-span-2">
          <h3 className="text-sm font-medium text-stone-700 mb-3">Follower Growth (30 days)</h3>
          <AreaChart
            data={generateTimeSeriesData(30)}
            width={600}
            height={200}
            color="#6366F1"
            className="w-full"
          />
        </div>

        {/* Platform Distribution */}
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <h3 className="text-sm font-medium text-stone-700 mb-3">Followers by Platform</h3>
          {platformFollowerData.length > 0 ? (
            <div className="flex flex-col items-center gap-3">
              <DonutChart
                data={platformFollowerData}
                size={140}
                strokeWidth={20}
                centerValue={formatCompact(totalFollowers)}
                centerLabel="Total"
              />
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                {platformFollowerData.map(d => (
                  <div key={d.label} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-stone-600">{d.label}</span>
                    <span className="text-stone-400 ml-auto">{formatCompact(d.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-stone-400 text-sm">
              Connect platforms to see data
            </div>
          )}
        </div>
      </div>

      {/* Engagement & Virality Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Engagement by Platform */}
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <h3 className="text-sm font-medium text-stone-700 mb-3">Engagement by Platform</h3>
          {platformEngagementData.length > 0 ? (
            <BarChart data={platformEngagementData} width={400} height={160} className="w-full" />
          ) : (
            <div className="flex items-center justify-center h-40 text-stone-400 text-sm">
              No engagement data yet
            </div>
          )}
        </div>

        {/* Virality Score Gauge */}
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <h3 className="text-sm font-medium text-stone-700 mb-3">Overall Health Score</h3>
          <div className="flex items-center justify-around">
            <div className="text-center">
              <GaugeChart value={connectedPlatforms.length > 0 ? 67 : 0} size={120} label="Overall" />
            </div>
            <div className="space-y-3">
              {[
                { label: 'Engagement', score: 72, color: '#10B981' },
                { label: 'Growth', score: 58, color: '#F59E0B' },
                { label: 'Consistency', score: 81, color: '#6366F1' },
                { label: 'Virality', score: 45, color: '#EF4444' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${item.score}%`, backgroundColor: item.color }} />
                  </div>
                  <span className="text-xs text-stone-500 w-20">{item.label}</span>
                  <span className="text-xs font-medium" style={{ color: item.color }}>{item.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Posts */}
      <div className="bg-white rounded-xl border border-stone-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-stone-700">Top Performing Posts</h3>
          <button onClick={() => onNavigate('analytics')} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
            View all
          </button>
        </div>
        {topPosts.length > 0 ? (
          <div className="space-y-2">
            {topPosts.map((post, i) => (
              <div key={post.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-stone-50 transition-colors">
                <span className="text-xs text-stone-400 font-mono w-5">{i + 1}</span>
                <div className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{ backgroundColor: PLATFORMS[post.platformId]?.color + '15', color: PLATFORMS[post.platformId]?.color }}>
                  {PLATFORMS[post.platformId]?.name.charAt(0)}
                </div>
                <p className="text-sm text-stone-700 truncate flex-1">{post.text.slice(0, 80)}...</p>
                <div className="flex items-center gap-3 text-xs text-stone-500">
                  <span title="Engagement rate" className="font-medium text-indigo-600">{post.engagementRate.toFixed(2)}%</span>
                  <span title="Impressions"><Eye className="w-3 h-3 inline mr-0.5" />{formatCompact(post.impressions)}</span>
                  <span title="Likes">{formatCompact(post.likes)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-stone-400 text-sm">
            <Award className="w-8 h-8 mx-auto mb-2 text-stone-300" />
            <p>Your top performing posts will appear here</p>
            <p className="text-xs mt-1">Connect platforms and let us analyze your content</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Get AI Suggestions', view: 'suggestions', icon: Sparkles, color: 'from-indigo-500 to-purple-600' },
          { label: 'Growth Advisor', view: 'growth', icon: Rocket, color: 'from-emerald-500 to-teal-600' },
          { label: 'Compose Post', view: 'content', icon: PenTool, color: 'from-blue-500 to-cyan-600' },
          { label: 'Browse Tips', view: 'tips', icon: Lightbulb, color: 'from-amber-500 to-orange-600' },
        ].map(action => {
          const Icon = action.icon;
          return (
            <button
              key={action.view}
              onClick={() => onNavigate(action.view)}
              className={`bg-gradient-to-br ${action.color} text-white rounded-xl p-4 text-left hover:opacity-90 transition-opacity shadow-lg`}
            >
              <Icon className="w-5 h-5 mb-2 opacity-80" />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// --- Helpers ---

const formatCompact = (n: number): string => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
};

const generateSparkline = (base: number, days: number): number[] => {
  const data: number[] = [];
  let val = base * 0.85;
  for (let i = 0; i < days; i++) {
    val += (base * 0.15 / days) + (Math.random() - 0.4) * (base * 0.02);
    data.push(Math.round(val));
  }
  return data;
};

const generateTimeSeriesData = (days: number) => {
  const data: { label: string; value: number }[] = [];
  let val = 10000;
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 86400000);
    val += Math.round((Math.random() - 0.3) * 150);
    data.push({
      label: `${date.getDate()}/${date.getMonth() + 1}`,
      value: val,
    });
  }
  return data;
};

// Needed for dynamic imports
const Rocket = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
  </svg>
);

const PenTool = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m12 19 7-7 3 3-7 7-3-3z"/>
    <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
    <path d="m2 2 7.586 7.586"/>
    <circle cx="11" cy="11" r="2"/>
  </svg>
);
