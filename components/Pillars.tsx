import React, { useState } from 'react';
import { Plane, TrendingUp, Shield, Scale, ChevronRight, Check } from 'lucide-react';
import { pillars } from '../data.ts';

const iconMap: Record<string, React.ReactNode> = {
  plane: <Plane size={28} />,
  'trending-up': <TrendingUp size={28} />,
  shield: <Shield size={28} />,
  scale: <Scale size={28} />,
};

export default function Pillars() {
  const [activePillar, setActivePillar] = useState(0);
  const pillar = pillars[activePillar];

  return (
    <section id="pillars" className="relative py-24 sm:py-32 bg-gradient-to-b from-navy-950 via-navy-900/50 to-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-crimson-500 text-sm font-semibold uppercase tracking-[0.2em]">The Four Pillars</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mt-3 mb-4">
            What We Stand For
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            CANZUK isn't built on sentiment alone. It's built on four concrete pillars that would transform 136 million lives.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Pillar Selector */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible scrollbar-hide pb-2 lg:pb-0">
            {pillars.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActivePillar(i)}
                className={`flex items-center gap-4 px-5 py-4 rounded-xl text-left transition-all min-w-[200px] lg:min-w-0 ${
                  i === activePillar
                    ? 'bg-crimson-600/10 border border-crimson-600/30 text-white'
                    : 'bg-white/[0.03] border border-transparent text-white/50 hover:text-white/80 hover:bg-white/[0.06]'
                }`}
              >
                <div className={`flex-shrink-0 ${i === activePillar ? 'text-crimson-500' : 'text-white/30'}`}>
                  {iconMap[p.icon]}
                </div>
                <div>
                  <div className="font-semibold text-sm">{p.title}</div>
                  <div className={`text-xs ${i === activePillar ? 'text-white/50' : 'text-white/30'}`}>{p.subtitle}</div>
                </div>
                {i === activePillar && <ChevronRight size={16} className="ml-auto text-crimson-500 hidden lg:block" />}
              </button>
            ))}
          </div>

          {/* Pillar Detail */}
          <div className="lg:col-span-8" key={pillar.id}>
            <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-2xl border border-white/10 p-8 sm:p-10 animate-fade-in card-shine">
              {/* Title */}
              <div className="flex items-center gap-4 mb-2">
                <div className="text-crimson-500">{iconMap[pillar.icon]}</div>
                <h3 className="text-3xl font-serif font-bold text-white">{pillar.title}</h3>
              </div>
              <p className="text-crimson-400 font-serif italic mb-6">{pillar.subtitle}</p>

              {/* Description */}
              <p className="text-white/60 leading-relaxed text-lg mb-8">{pillar.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {pillar.stats.map((stat) => (
                  <div key={stat.label} className="bg-white/[0.04] rounded-xl p-4 text-center border border-white/5">
                    <div className="text-2xl font-serif font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-white/40 uppercase tracking-wider mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Points */}
              <div className="space-y-3">
                {pillar.points.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <Check size={16} className="text-crimson-500" />
                    </div>
                    <span className="text-white/70 text-sm leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
