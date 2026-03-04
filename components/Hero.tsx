import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { greetings, heroStats } from '../data.ts';

export default function Hero() {
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setGreetingIndex((i) => (i + 1) % greetings.length);
        setVisible(true);
      }, 400);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const g = greetings[greetingIndex];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Red diagonal stripe (Union Jack inspired) */}
        <div className="absolute -top-20 -left-20 w-[600px] h-[120px] bg-crimson-600/5 rotate-[35deg] origin-top-left" />
        <div className="absolute -bottom-20 -right-20 w-[600px] h-[120px] bg-crimson-600/5 rotate-[35deg] origin-bottom-right" />
        {/* Blue cross element */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute top-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        {/* Floating flag emojis */}
        <div className="absolute top-[15%] left-[8%] text-4xl opacity-10 animate-float" style={{ animationDelay: '0s' }}>🇬🇧</div>
        <div className="absolute top-[25%] right-[12%] text-4xl opacity-10 animate-float" style={{ animationDelay: '1.5s' }}>🇨🇦</div>
        <div className="absolute bottom-[30%] left-[15%] text-4xl opacity-10 animate-float" style={{ animationDelay: '3s' }}>🇦🇺</div>
        <div className="absolute bottom-[20%] right-[8%] text-4xl opacity-10 animate-float" style={{ animationDelay: '4.5s' }}>🇳🇿</div>
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-crimson-600/5 blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Rotating Multilingual Greeting */}
        <div className="h-20 mb-6 flex items-center justify-center">
          <div
            className={`transition-all duration-400 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            <span className="text-3xl sm:text-4xl md:text-5xl font-serif italic text-white/90">
              {g.text}
            </span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-lg">{g.nation}</span>
              <span className="text-xs text-white/40 uppercase tracking-widest">{g.lang}</span>
            </div>
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 animate-fade-in leading-[1.1]">
          <span className="text-white">One Family.</span>
          <br />
          <span className="text-gradient-canzuk">Four Nations.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-white/60 max-w-3xl mx-auto mb-4 animate-fade-in-up font-light leading-relaxed" style={{ animationDelay: '0.3s' }}>
          Canada &bull; Australia &bull; New Zealand &bull; United Kingdom
        </p>
        <p className="text-base sm:text-lg text-white/40 max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          Free movement. Free trade. Shared defence. Common law.
          <br className="hidden sm:block" />
          Not a union — a family that never should have drifted apart.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <a
            href="#join"
            className="px-8 py-4 bg-crimson-600 hover:bg-crimson-700 text-white font-semibold text-lg rounded-xl transition-all hover:shadow-xl hover:shadow-crimson-600/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            Back CANZUK
          </a>
          <a
            href="#pillars"
            className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 font-medium text-lg rounded-xl transition-all"
          >
            Learn More
          </a>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
          {heroStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-serif font-bold text-white">
                {stat.prefix}{stat.value}<span className="text-crimson-500">{stat.suffix}</span>
              </div>
              <div className="text-xs text-white/40 uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <a href="#nations" className="text-white/30 hover:text-white/60 transition-colors">
          <ChevronDown size={28} />
        </a>
      </div>
    </section>
  );
}
