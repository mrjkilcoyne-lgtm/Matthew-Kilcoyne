// ============================================================
// MINI CHART COMPONENTS - Pure SVG, zero dependencies
// ============================================================

import React from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fillColor?: string;
  showDots?: boolean;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 120,
  height = 40,
  color = '#6366F1',
  fillColor,
  showDots = false,
  className = '',
}) => {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 4;

  const points = data.map((value, i) => ({
    x: padding + (i / (data.length - 1)) * (width - padding * 2),
    y: padding + (1 - (value - min) / range) * (height - padding * 2),
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <svg width={width} height={height} className={className} viewBox={`0 0 ${width} ${height}`}>
      {fillColor && (
        <path d={areaPath} fill={fillColor} opacity={0.15} />
      )}
      <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {showDots && points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={2.5} fill={color} />
      ))}
    </svg>
  );
};

// --- Bar Chart ---

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  width?: number;
  height?: number;
  defaultColor?: string;
  className?: string;
  showLabels?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  width = 300,
  height = 150,
  defaultColor = '#6366F1',
  className = '',
  showLabels = true,
}) => {
  if (data.length === 0) return null;

  const max = Math.max(...data.map(d => d.value));
  const barWidth = Math.min(40, (width - 20) / data.length - 8);
  const labelHeight = showLabels ? 20 : 0;
  const chartHeight = height - labelHeight - 10;

  return (
    <svg width={width} height={height} className={className} viewBox={`0 0 ${width} ${height}`}>
      {data.map((d, i) => {
        const barHeight = (d.value / (max || 1)) * chartHeight;
        const x = 10 + i * ((width - 20) / data.length) + ((width - 20) / data.length - barWidth) / 2;
        const y = chartHeight - barHeight + 5;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={3}
              fill={d.color || defaultColor}
              opacity={0.85}
            />
            <text
              x={x + barWidth / 2}
              y={y - 4}
              textAnchor="middle"
              fill="#6B7280"
              fontSize={10}
              fontFamily="Inter, sans-serif"
            >
              {d.value >= 1000 ? `${(d.value / 1000).toFixed(1)}k` : d.value}
            </text>
            {showLabels && (
              <text
                x={x + barWidth / 2}
                y={height - 4}
                textAnchor="middle"
                fill="#9CA3AF"
                fontSize={9}
                fontFamily="Inter, sans-serif"
              >
                {d.label.length > 6 ? d.label.slice(0, 6) : d.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

// --- Donut Chart ---

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
  strokeWidth?: number;
  className?: string;
  centerLabel?: string;
  centerValue?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 120,
  strokeWidth = 16,
  className = '',
  centerLabel,
  centerValue,
}) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return null;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <svg width={size} height={size} className={className} viewBox={`0 0 ${size} ${size}`}>
      {data.map((d, i) => {
        const pct = d.value / total;
        const dashArray = `${pct * circumference} ${circumference}`;
        const rotation = offset * 360 - 90;
        offset += pct;
        return (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={d.color}
            strokeWidth={strokeWidth}
            strokeDasharray={dashArray}
            strokeDashoffset={0}
            strokeLinecap="round"
            transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
            opacity={0.85}
          />
        );
      })}
      {centerValue && (
        <>
          <text x={size / 2} y={size / 2 - 4} textAnchor="middle" fill="#1F2937" fontSize={16} fontWeight="bold" fontFamily="Inter, sans-serif">
            {centerValue}
          </text>
          {centerLabel && (
            <text x={size / 2} y={size / 2 + 12} textAnchor="middle" fill="#9CA3AF" fontSize={10} fontFamily="Inter, sans-serif">
              {centerLabel}
            </text>
          )}
        </>
      )}
    </svg>
  );
};

// --- Area Chart ---

interface AreaChartProps {
  data: { label: string; value: number }[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  showGrid?: boolean;
  showLabels?: boolean;
}

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  width = 400,
  height = 200,
  color = '#6366F1',
  className = '',
  showGrid = true,
  showLabels = true,
}) => {
  if (data.length < 2) return null;

  const padding = { top: 10, right: 10, bottom: showLabels ? 25 : 10, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const min = Math.min(...data.map(d => d.value)) * 0.9;
  const max = Math.max(...data.map(d => d.value)) * 1.1;
  const range = max - min || 1;

  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartW,
    y: padding.top + (1 - (d.value - min) / range) * chartH,
    label: d.label,
    value: d.value,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  // Grid lines
  const gridLines = 4;
  const gridValues = Array.from({ length: gridLines + 1 }, (_, i) => min + (range * i) / gridLines);

  return (
    <svg width={width} height={height} className={className} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {showGrid && gridValues.map((v, i) => {
        const y = padding.top + (1 - (v - min) / range) * chartH;
        return (
          <g key={i}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#E5E7EB" strokeWidth={0.5} />
            <text x={padding.left - 6} y={y + 3} textAnchor="end" fill="#9CA3AF" fontSize={9} fontFamily="Inter, sans-serif">
              {v >= 1000 ? `${(v / 1000).toFixed(0)}k` : Math.round(v)}
            </text>
          </g>
        );
      })}

      <path d={areaPath} fill={`url(#gradient-${color.replace('#', '')})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill="white" stroke={color} strokeWidth={2} opacity={i === points.length - 1 ? 1 : 0} />
      ))}

      {showLabels && points.filter((_, i) => i % Math.max(1, Math.floor(data.length / 6)) === 0 || i === data.length - 1).map((p, i) => (
        <text key={i} x={p.x} y={height - 6} textAnchor="middle" fill="#9CA3AF" fontSize={9} fontFamily="Inter, sans-serif">
          {p.label}
        </text>
      ))}
    </svg>
  );
};

// --- Gauge Chart ---

interface GaugeChartProps {
  value: number; // 0-100
  size?: number;
  color?: string;
  label?: string;
  className?: string;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  size = 100,
  color,
  label,
  className = '',
}) => {
  const clampedValue = Math.max(0, Math.min(100, value));
  const gaugeColor = color || (
    clampedValue >= 70 ? '#10B981' :
    clampedValue >= 40 ? '#F59E0B' :
    '#EF4444'
  );

  const radius = (size - 12) / 2;
  const circumference = Math.PI * radius; // half circle
  const progress = (clampedValue / 100) * circumference;

  return (
    <svg width={size} height={size * 0.65} className={className} viewBox={`0 0 ${size} ${size * 0.65}`}>
      {/* Background arc */}
      <path
        d={`M 6 ${size * 0.6} A ${radius} ${radius} 0 0 1 ${size - 6} ${size * 0.6}`}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth={10}
        strokeLinecap="round"
      />
      {/* Progress arc */}
      <path
        d={`M 6 ${size * 0.6} A ${radius} ${radius} 0 0 1 ${size - 6} ${size * 0.6}`}
        fill="none"
        stroke={gaugeColor}
        strokeWidth={10}
        strokeLinecap="round"
        strokeDasharray={`${progress} ${circumference}`}
      />
      <text x={size / 2} y={size * 0.5} textAnchor="middle" fill="#1F2937" fontSize={18} fontWeight="bold" fontFamily="Inter, sans-serif">
        {clampedValue}
      </text>
      {label && (
        <text x={size / 2} y={size * 0.62} textAnchor="middle" fill="#9CA3AF" fontSize={9} fontFamily="Inter, sans-serif">
          {label}
        </text>
      )}
    </svg>
  );
};
