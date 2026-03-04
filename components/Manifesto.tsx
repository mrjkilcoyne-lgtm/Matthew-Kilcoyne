import React from 'react';
import { Quote } from 'lucide-react';
import { manifestoLines, culturalQuotes } from '../data.ts';

export default function Manifesto() {
  return (
    <section className="relative py-24 sm:py-32 bg-navy-950 overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-crimson-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-crimson-500 text-sm font-semibold uppercase tracking-[0.2em]">The Case</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mt-3 mb-4">
            Right Then. Let's Have It.
          </h2>
          <p className="text-white/40 text-lg">
            No waffle. No platitudes. Just the honest truth about why this matters.
          </p>
        </div>

        {/* Manifesto Lines */}
        <div className="space-y-8 mb-20">
          {manifestoLines.map((line, i) => (
            <div
              key={i}
              className="relative pl-6 border-l-2 border-crimson-600/30 hover:border-crimson-600/60 transition-colors group"
            >
              <p className="text-white/60 group-hover:text-white/80 transition-colors text-lg sm:text-xl leading-relaxed font-light">
                {line}
              </p>
            </div>
          ))}
        </div>

        {/* Cultural Quotes */}
        <div className="grid sm:grid-cols-2 gap-6">
          {culturalQuotes.map((q, i) => (
            <div
              key={i}
              className="bg-white/[0.03] rounded-xl border border-white/5 p-6 hover:border-white/10 transition-colors group"
            >
              <Quote size={18} className="text-crimson-500/40 mb-3" />
              <blockquote className="text-white/60 group-hover:text-white/70 transition-colors italic font-serif text-sm leading-relaxed mb-3">
                "{q.quote}"
              </blockquote>
              <div className="flex items-center gap-2">
                <span className="text-lg">{q.nation}</span>
                <span className="text-white/30 text-xs">— {q.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
