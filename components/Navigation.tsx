import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '#nations', label: 'Our Nations' },
  { href: '#pillars', label: 'The Pillars' },
  { href: '#timeline', label: 'Our Story' },
  { href: '#community', label: 'Community' },
  { href: '#join', label: 'Join' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-navy-950/95 backdrop-blur-md shadow-lg shadow-navy-950/50 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-crimson-600 to-navy-900 flex items-center justify-center ring-2 ring-white/20 group-hover:ring-white/40 transition-all">
                <span className="text-white font-serif font-bold text-lg">C</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-serif font-bold text-lg leading-tight tracking-wide">
                BACK CANZUK
              </span>
              <span className="text-white/40 text-[10px] uppercase tracking-[0.2em] leading-tight">
                One Family · Four Nations
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#join"
              className="ml-3 px-5 py-2.5 bg-crimson-600 hover:bg-crimson-700 text-white text-sm font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-crimson-600/25"
            >
              Back CANZUK
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white/70 hover:text-white p-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4 animate-fade-in-down">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#join"
              onClick={() => setMobileOpen(false)}
              className="block mt-3 mx-4 px-5 py-3 bg-crimson-600 text-white text-center font-semibold rounded-lg"
            >
              Back CANZUK
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
