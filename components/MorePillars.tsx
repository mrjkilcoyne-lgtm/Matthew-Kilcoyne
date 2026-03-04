import React from 'react';
import { Leaf, Cpu, Music, Check } from 'lucide-react';
import { additionalPillars } from '../data.ts';

const iconMap: Record<string, React.ReactNode> = {
  leaf: <Leaf size={28} />,
  cpu: <Cpu size={28} />,
  music: <Music size={28} />,
};

const bgColors: Record<string, string> = {
  environment: 'from-emerald-900/20 to-emerald-950/10',
  tech: 'from-blue-900/20 to-blue-950/10',
  culture: 'from-amber-900/20 to-amber-950/10',
};

const accentColors: Record<string, string> = {
  environment: 'text-emerald-400',
  tech: 'text-blue-400',
  culture: 'text-amber-400',
};

const borderColors: Record<string, string> = {
  environment: 'border-emerald-500/20',
  tech: 'border-blue-500/20',
  culture: 'border-amber-500/20',
};

export default function MorePillars() {
  return (
    <section className="relative py-24 sm:py-32 bg-gradient-to-b from-navy-950 to-navy-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-crimson-500 text-sm font-semibold uppercase tracking-[0.2em]">And There's More</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mt-3 mb-4">
            Beyond the Basics
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Trade and defence are just the start. Environment, technology, and culture —
            the bits that make life actually worth living.
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-8">
          {additionalPillars.map((pillar, i) => (
            <div
              key={pillar.id}
              className={`bg-gradient-to-br ${bgColors[pillar.id]} rounded-2xl border ${borderColors[pillar.id]} p-8 sm:p-10 card-shine`}
            >
              <div className={`flex flex-col lg:flex-row gap-8 ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={accentColors[pillar.id]}>{iconMap[pillar.icon]}</div>
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">{pillar.title}</h3>
                  </div>
                  <p className={`${accentColors[pillar.id]} font-serif italic text-sm mb-4`}>{pillar.tagline}</p>
                  <p className="text-white/60 leading-relaxed mb-6">{pillar.description}</p>
                </div>

                {/* Points */}
                <div className="flex-1 space-y-3">
                  {pillar.points.map((point) => (
                    <div key={point} className="flex items-start gap-3">
                      <Check size={16} className={`flex-shrink-0 mt-1 ${accentColors[pillar.id]}`} />
                      <span className="text-white/60 text-sm leading-relaxed">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cheeky callout */}
        <div className="text-center mt-12">
          <p className="text-white/30 text-sm italic">
            "Brilliant. So when do we start?" — You, probably, right about now.
          </p>
        </div>
      </div>
    </section>
  );
}
