import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-navy-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-crimson-600 to-navy-900 flex items-center justify-center ring-2 ring-white/10">
                <span className="text-white font-serif font-bold text-lg">C</span>
              </div>
              <div>
                <span className="text-white font-serif font-bold text-lg">BACK CANZUK</span>
              </div>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              One family, four nations. Advocating for free movement, free trade, shared defence,
              and the common values that bind Canada, Australia, New Zealand, and the United Kingdom.
            </p>
          </div>

          {/* The Pillars */}
          <div>
            <h4 className="text-white/70 font-semibold text-sm uppercase tracking-wider mb-4">The Pillars</h4>
            <ul className="space-y-2">
              {['Free Movement', 'Free Trade', 'Shared Defence', 'Common Law & Values'].map((item) => (
                <li key={item}>
                  <a href="#pillars" className="text-white/40 hover:text-white/70 text-sm transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-white/70 font-semibold text-sm uppercase tracking-wider mb-4">Community</h4>
            <ul className="space-y-2">
              {['Students', 'Professionals', 'Travellers', 'Citizens Abroad'].map((item) => (
                <li key={item}>
                  <a href="#community" className="text-white/40 hover:text-white/70 text-sm transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Domains */}
          <div>
            <h4 className="text-white/70 font-semibold text-sm uppercase tracking-wider mb-4">Find Us</h4>
            <ul className="space-y-2">
              {['backcanzuk.com', 'backcanzuk.co.uk', 'back-canzuk.com'].map((domain) => (
                <li key={domain}>
                  <span className="text-white/40 text-sm">{domain}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {['🇬🇧', '🇨🇦', '🇦🇺', '🇳🇿'].map((flag) => (
              <span key={flag} className="text-2xl opacity-40 hover:opacity-100 transition-opacity cursor-default">{flag}</span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-white/30 text-sm">
            <span>Made with</span>
            <Heart size={12} className="text-crimson-500" />
            <span>across four time zones</span>
          </div>

          <div className="text-white/20 text-xs">
            &copy; {new Date().getFullYear()} Back CANZUK
          </div>
        </div>
      </div>
    </footer>
  );
}
