import React, { useState } from 'react';
import { PlatformConnection, PlatformId } from '../types';
import { PLATFORMS, CORE_PLATFORMS, EMERGING_PLATFORMS, GLOBAL_SOUTH_PLATFORMS } from '../utils/platformConfigs';
import { Check, ExternalLink, Link2, Unlink, Globe, Zap, Users } from 'lucide-react';

interface PlatformConnectProps {
  connections: PlatformConnection[];
  onConnect: (platformId: PlatformId) => void;
  onDisconnect: (platformId: PlatformId) => void;
}

export const PlatformConnect: React.FC<PlatformConnectProps> = ({
  connections,
  onConnect,
  onDisconnect,
}) => {
  const [activeTab, setActiveTab] = useState<'core' | 'emerging' | 'global'>('core');

  const getConnection = (id: PlatformId) => connections.find(c => c.platformId === id);

  const tabs = [
    { id: 'core' as const, label: 'Core Platforms', icon: Zap, platforms: CORE_PLATFORMS },
    { id: 'emerging' as const, label: 'Emerging', icon: Globe, platforms: EMERGING_PLATFORMS },
    { id: 'global' as const, label: 'Global & Regional', icon: Users, platforms: GLOBAL_SOUTH_PLATFORMS },
  ];

  const currentPlatforms = tabs.find(t => t.id === activeTab)?.platforms || [];

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-semibold text-stone-900">Connect Platforms</h2>
        <p className="text-sm text-stone-500 mt-1">
          Link your social media accounts to unlock analytics, suggestions, and growth insights
        </p>
      </div>

      {/* Connection stats */}
      <div className="grid grid-cols-3 gap-3">
        {tabs.map(tab => {
          const connected = tab.platforms.filter(id => getConnection(id)?.connected).length;
          const Icon = tab.icon;
          return (
            <div key={tab.id} className="bg-white rounded-xl border border-stone-200 p-3 text-center">
              <Icon className="w-5 h-5 mx-auto text-stone-400 mb-1" />
              <p className="text-lg font-bold text-stone-900">{connected}/{tab.platforms.length}</p>
              <p className="text-xs text-stone-500">{tab.label}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100 rounded-lg p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 text-sm font-medium py-2 rounded-md transition-all ${
              activeTab === tab.id ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Platform Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {currentPlatforms.map(platformId => {
          const platform = PLATFORMS[platformId];
          const connection = getConnection(platformId);
          const isConnected = connection?.connected;

          return (
            <div
              key={platformId}
              className={`bg-white rounded-xl border-2 p-4 transition-all ${
                isConnected ? 'border-emerald-200 bg-emerald-50/30' : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
                    style={{ backgroundColor: platform.color }}
                  >
                    {platform.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium text-stone-900">{platform.name}</h3>
                    {isConnected ? (
                      <p className="text-xs text-emerald-600 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Connected as @{connection?.username || 'user'}
                      </p>
                    ) : (
                      <p className="text-xs text-stone-400">
                        {platform.regions.slice(0, 3).join(', ')}
                        {platform.regions.length > 3 ? ` +${platform.regions.length - 3}` : ''}
                      </p>
                    )}
                  </div>
                </div>

                {isConnected && connection?.followerCount !== undefined && (
                  <div className="text-right">
                    <p className="text-sm font-bold text-stone-900">{formatCount(connection.followerCount)}</p>
                    <p className="text-[10px] text-stone-400">followers</p>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-1 mt-3 mb-3">
                {platform.features.slice(0, 5).map(feature => (
                  <span key={feature} className="text-[10px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded">
                    {feature}
                  </span>
                ))}
              </div>

              {/* Action */}
              {isConnected ? (
                <div className="flex gap-2">
                  <button className="flex-1 text-xs text-stone-500 py-2 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors flex items-center justify-center gap-1">
                    <ExternalLink className="w-3 h-3" /> View Analytics
                  </button>
                  <button
                    onClick={() => onDisconnect(platformId)}
                    className="text-xs text-red-500 py-2 px-3 rounded-lg border border-red-200 hover:bg-red-50 transition-colors flex items-center gap-1"
                  >
                    <Unlink className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onConnect(platformId)}
                  className="w-full text-sm font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
                  style={{ backgroundColor: platform.color + '15', color: platform.color }}
                >
                  <Link2 className="w-4 h-4" />
                  Connect {platform.name}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Info box */}
      <div className="bg-stone-50 rounded-xl border border-stone-200 p-4">
        <h4 className="text-sm font-medium text-stone-700 mb-2">How Platform Connection Works</h4>
        <ul className="text-xs text-stone-500 space-y-1.5">
          <li>1. Click "Connect" to open the platform's secure OAuth login</li>
          <li>2. Authorize Social Pulse to read your analytics (we never post without permission)</li>
          <li>3. Your data syncs automatically every 15 minutes</li>
          <li>4. You can disconnect at any time — we delete your tokens immediately</li>
        </ul>
      </div>
    </div>
  );
};

const formatCount = (n: number): string => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
};
