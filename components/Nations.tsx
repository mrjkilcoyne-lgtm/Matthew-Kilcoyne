import React, { useState } from 'react';
import { MapPin, Star } from 'lucide-react';
import { nations } from '../data.ts';

export default function Nations() {
  const [activeNation, setActiveNation] = useState(0);
  const nation = nations[activeNation];

  return (
    <section id="nations" className="relative py-24 sm:py-32 bg-navy-950">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-union-pattern opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-crimson-500 text-sm font-semibold uppercase tracking-[0.2em]">Our Nations</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mt-3 mb-4">
            Four Corners of Home
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Each nation brings its own character, its own story, its own genius. Together, we're something extraordinary.
          </p>
        </div>

        {/* Nation Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {nations.map((n, i) => (
            <button
              key={n.code}
              onClick={() => setActiveNation(i)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                i === activeNation
                  ? 'bg-white/10 text-white ring-1 ring-white/20 shadow-lg'
                  : 'bg-white/[0.03] text-white/50 hover:text-white/80 hover:bg-white/[0.06]'
              }`}
            >
              <span className="text-xl">{n.flag}</span>
              <span className="hidden sm:inline">{n.name}</span>
            </button>
          ))}
        </div>

        {/* Nation Detail Card */}
        <div className="max-w-4xl mx-auto">
          <div
            key={nation.code}
            className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-2xl border border-white/10 p-8 sm:p-12 animate-fade-in"
          >
            <div className="flex flex-col md:flex-row gap-8">
              {/* Flag & Info */}
              <div className="flex-shrink-0 text-center md:text-left">
                <div className="text-8xl mb-4">{nation.flag}</div>
                <div className="flex items-center justify-center md:justify-start gap-2 text-white/40 text-sm">
                  <MapPin size={14} />
                  <span>{nation.capital}</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-1">
                  {nation.name}
                </h3>
                <p className="text-crimson-400 font-serif italic text-lg mb-4">{nation.tagline}</p>
                <p className="text-white/60 leading-relaxed mb-6">{nation.description}</p>

                {/* Greeting */}
                <div className="inline-flex items-center gap-3 bg-white/5 rounded-lg px-4 py-2 mb-6">
                  <span className="text-white/40 text-xs uppercase tracking-widest">{nation.greetingLang}:</span>
                  <span className="text-white font-serif italic text-lg">{nation.greeting}</span>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-2">
                  {nation.highlights.map((h) => (
                    <span
                      key={h}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-white/60 text-xs rounded-full border border-white/5"
                    >
                      <Star size={10} className="text-gold-500" />
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All Four Flags Row */}
        <div className="flex justify-center items-center gap-6 sm:gap-10 mt-16">
          {nations.map((n) => (
            <div key={n.code} className="text-center group cursor-pointer" onClick={() => setActiveNation(nations.indexOf(n))}>
              <div className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform">{n.flag}</div>
              <span className="text-white/30 text-xs mt-2 block group-hover:text-white/60 transition-colors">{n.demonym}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
