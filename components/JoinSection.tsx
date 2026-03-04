import React, { useState } from 'react';
import { ArrowRight, Heart, Mail, MapPin } from 'lucide-react';

export default function JoinSection() {
  const [email, setEmail] = useState('');
  const [nation, setNation] = useState('');
  const [role, setRole] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="join" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-crimson-600/30 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-crimson-600/5 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-crimson-500 text-sm font-semibold uppercase tracking-[0.2em]">Join the Movement</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mt-3 mb-4">
            Back CANZUK
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto mb-2">
            This isn't about politics. It's about people. It's about a student in Leeds who dreams of a semester in Melbourne.
            A nurse in Toronto who wants to work in Auckland. A family in Perth with grandparents in Edinburgh.
          </p>
          <p className="text-white/70 text-xl font-serif italic">
            It's about coming home — wherever that is.
          </p>
        </div>

        {submitted ? (
          <div className="max-w-md mx-auto text-center animate-fade-in-up">
            <div className="w-20 h-20 rounded-full bg-crimson-600/20 flex items-center justify-center mx-auto mb-6">
              <Heart size={36} className="text-crimson-500" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-white mb-3">You're In.</h3>
            <p className="text-white/60 mb-4">
              Welcome to the CANZUK community. We'll be in touch when we launch the full network.
              In the meantime, spread the word.
            </p>
            <div className="flex justify-center gap-3">
              {['🇬🇧', '🇨🇦', '🇦🇺', '🇳🇿'].map((flag) => (
                <span key={flag} className="text-3xl animate-float" style={{ animationDelay: `${Math.random() * 2}s` }}>
                  {flag}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
            <div className="bg-white/[0.04] rounded-2xl border border-white/10 p-8 space-y-5">
              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm text-white/60 mb-2">
                  <Mail size={14} />
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-crimson-600/50 focus:ring-1 focus:ring-crimson-600/30 transition-all"
                />
              </div>

              {/* Nation */}
              <div>
                <label className="flex items-center gap-2 text-sm text-white/60 mb-2">
                  <MapPin size={14} />
                  Where are you?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { flag: '🇬🇧', name: 'UK' },
                    { flag: '🇨🇦', name: 'Canada' },
                    { flag: '🇦🇺', name: 'Australia' },
                    { flag: '🇳🇿', name: 'NZ' },
                  ].map((n) => (
                    <button
                      key={n.name}
                      type="button"
                      onClick={() => setNation(n.name)}
                      className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all ${
                        nation === n.name
                          ? 'bg-crimson-600/20 border border-crimson-600/40 text-white'
                          : 'bg-white/[0.04] border border-white/5 text-white/50 hover:text-white/80 hover:bg-white/[0.08]'
                      }`}
                    >
                      <span>{n.flag}</span>
                      <span>{n.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="text-sm text-white/60 mb-2 block">I am a...</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Student', 'Professional', 'Traveller', 'Citizen Abroad'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`px-3 py-2.5 rounded-xl text-sm transition-all ${
                        role === r
                          ? 'bg-crimson-600/20 border border-crimson-600/40 text-white'
                          : 'bg-white/[0.04] border border-white/5 text-white/50 hover:text-white/80 hover:bg-white/[0.08]'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-crimson-600 hover:bg-crimson-700 text-white font-semibold text-lg rounded-xl transition-all hover:shadow-xl hover:shadow-crimson-600/25 hover:scale-[1.01] active:scale-[0.99] mt-6"
              >
                Back CANZUK
                <ArrowRight size={20} />
              </button>

              <p className="text-center text-white/30 text-xs mt-3">
                Join thousands backing free movement across our four nations.
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
