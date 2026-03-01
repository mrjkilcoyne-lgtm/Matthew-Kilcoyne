import React from 'react';
import { Sparkline } from './MiniChart';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  sparklineData?: number[];
  color?: string;
  icon?: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  changeLabel = 'vs last period',
  sparklineData,
  color = '#6366F1',
  icon,
  subtitle,
  className = '',
}) => {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const trendColor = isPositive ? '#10B981' : isNegative ? '#EF4444' : '#6B7280';

  return (
    <div className={`bg-white rounded-xl border border-stone-200 p-4 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon && <div className="text-stone-400">{icon}</div>}
          <span className="text-xs text-stone-500 font-medium uppercase tracking-wider">{label}</span>
        </div>
        {sparklineData && sparklineData.length > 1 && (
          <Sparkline data={sparklineData} width={64} height={24} color={color} fillColor={color} />
        )}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-stone-900 tracking-tight">
            {typeof value === 'number' ? formatNumber(value) : value}
          </p>
          {subtitle && <p className="text-xs text-stone-400 mt-0.5">{subtitle}</p>}
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-full`} style={{ backgroundColor: trendColor + '15', color: trendColor }}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : isNegative ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
            <span>{isPositive ? '+' : ''}{change.toFixed(1)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

const formatNumber = (n: number): string => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toLocaleString();
};

// --- Platform Badge ---

interface PlatformBadgeProps {
  name: string;
  color: string;
  size?: 'sm' | 'md';
}

export const PlatformBadge: React.FC<PlatformBadgeProps> = ({ name, color, size = 'sm' }) => (
  <span
    className={`inline-flex items-center font-medium rounded-full ${size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}
    style={{ backgroundColor: color + '15', color }}
  >
    {name}
  </span>
);
