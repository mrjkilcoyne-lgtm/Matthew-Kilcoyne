import React from 'react';
import { DashboardView, PlatformConnection } from '../types';
import { PLATFORMS } from '../utils/platformConfigs';
import {
  LayoutDashboard, BarChart3, Link2, Lightbulb, TrendingUp,
  CalendarDays, Rocket, Settings, Sparkles, PenTool, Bell
} from 'lucide-react';

interface SidebarProps {
  currentView: DashboardView;
  onNavigate: (view: DashboardView) => void;
  connections: PlatformConnection[];
  collapsed: boolean;
  onToggleCollapse: () => void;
  alertCount: number;
}

const NAV_ITEMS: { view: DashboardView; icon: React.ElementType; label: string }[] = [
  { view: 'overview', icon: LayoutDashboard, label: 'Overview' },
  { view: 'analytics', icon: BarChart3, label: 'Analytics' },
  { view: 'platforms', icon: Link2, label: 'Platforms' },
  { view: 'suggestions', icon: Sparkles, label: 'AI Suggestions' },
  { view: 'content', icon: PenTool, label: 'Post Composer' },
  { view: 'trends', icon: TrendingUp, label: 'Trends' },
  { view: 'growth', icon: Rocket, label: 'Growth Advisor' },
  { view: 'tips', icon: Lightbulb, label: 'Tips & Tricks' },
  { view: 'calendar', icon: CalendarDays, label: 'Calendar' },
  { view: 'settings', icon: Settings, label: 'Settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  connections,
  collapsed,
  onToggleCollapse,
  alertCount,
}) => {
  const connectedCount = connections.filter(c => c.connected).length;

  return (
    <aside className={`flex flex-col bg-stone-900 text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'} min-h-0`}>
      {/* Logo area */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-stone-700/50">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
          <BarChart3 className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h2 className="text-sm font-semibold tracking-tight truncate">Social Pulse</h2>
            <p className="text-[10px] text-stone-400">{connectedCount} platform{connectedCount !== 1 ? 's' : ''} connected</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto scrollbar-hide">
        {NAV_ITEMS.map(({ view, icon: Icon, label }) => {
          const isActive = currentView === view;
          return (
            <button
              key={view}
              onClick={() => onNavigate(view)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 font-medium'
                  : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
              }`}
              title={collapsed ? label : undefined}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-stone-500 group-hover:text-stone-300'}`} />
              {!collapsed && <span className="truncate">{label}</span>}
              {view === 'platforms' && !collapsed && connectedCount > 0 && (
                <span className="ml-auto text-[10px] bg-indigo-600/30 text-indigo-300 px-1.5 py-0.5 rounded-full">
                  {connectedCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Connected platforms mini-icons */}
      {!collapsed && connectedCount > 0 && (
        <div className="px-4 py-3 border-t border-stone-700/50">
          <p className="text-[10px] text-stone-500 uppercase tracking-wider mb-2">Connected</p>
          <div className="flex flex-wrap gap-1.5">
            {connections.filter(c => c.connected).map(conn => (
              <div
                key={conn.platformId}
                className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold"
                style={{ backgroundColor: PLATFORMS[conn.platformId]?.color + '22', color: PLATFORMS[conn.platformId]?.color }}
                title={PLATFORMS[conn.platformId]?.name}
              >
                {PLATFORMS[conn.platformId]?.name.charAt(0)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={onToggleCollapse}
        className="flex items-center justify-center py-3 border-t border-stone-700/50 text-stone-500 hover:text-stone-300 transition-colors"
      >
        <svg className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </aside>
  );
};
