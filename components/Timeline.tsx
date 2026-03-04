import React from 'react';
import { timelineEvents } from '../data.ts';

export default function Timeline() {
  return (
    <section id="timeline" className="relative py-24 sm:py-32 bg-navy-950 overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-crimson-600/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-navy-600/20 to-transparent" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-crimson-500 text-sm font-semibold uppercase tracking-[0.2em]">Our Story</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mt-3 mb-4">
            800 Years in the Making
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            This isn't a new idea. It's the oldest alliance in the modern world, waiting to be made official.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-crimson-600/50 via-white/10 to-crimson-600/50 sm:-translate-x-px" />

          <div className="space-y-8 sm:space-y-6">
            {timelineEvents.map((event, i) => {
              const isLeft = i % 2 === 0;
              const isLast = i === timelineEvents.length - 1;

              return (
                <div key={event.year} className={`relative flex items-center ${isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
                  {/* Dot */}
                  <div className={`absolute left-8 sm:left-1/2 w-3 h-3 rounded-full -translate-x-1.5 sm:-translate-x-1.5 z-10 ${
                    isLast
                      ? 'bg-crimson-500 ring-4 ring-crimson-500/20 animate-pulse-slow'
                      : 'bg-white/30 ring-2 ring-white/10'
                  }`} />

                  {/* Content */}
                  <div className={`ml-16 sm:ml-0 sm:w-1/2 ${isLeft ? 'sm:pr-12 sm:text-right' : 'sm:pl-12 sm:text-left'}`}>
                    <div className={`inline-block bg-white/[0.04] rounded-xl px-5 py-3 border border-white/[0.06] hover:border-white/10 transition-colors group ${
                      isLast ? 'bg-crimson-600/10 border-crimson-600/20' : ''
                    }`}>
                      <span className={`font-serif font-bold text-lg ${isLast ? 'text-crimson-500' : 'text-white/70'}`}>
                        {event.year}
                      </span>
                      <span className="text-white/30 mx-2">—</span>
                      <span className={`text-sm ${isLast ? 'text-white font-semibold' : 'text-white/50 group-hover:text-white/70 transition-colors'}`}>
                        {event.event}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
