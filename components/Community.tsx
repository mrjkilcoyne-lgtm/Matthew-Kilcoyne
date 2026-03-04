import React, { useState } from 'react';
import { GraduationCap, Briefcase, Compass, Home, Check, Users, Globe, MessageCircle } from 'lucide-react';
import { communityRoles } from '../data.ts';

const iconMap: Record<string, React.ReactNode> = {
  'graduation-cap': <GraduationCap size={32} />,
  briefcase: <Briefcase size={32} />,
  compass: <Compass size={32} />,
  home: <Home size={32} />,
};

export default function Community() {
  const [activeRole, setActiveRole] = useState(0);

  return (
    <section id="community" className="relative py-24 sm:py-32 bg-gradient-to-b from-navy-950 via-navy-900/30 to-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-crimson-500 text-sm font-semibold uppercase tracking-[0.2em]">The Network</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mt-3 mb-4">
            Your Community Awaits
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Not expats. Not immigrants. Family. A network of students, professionals, travellers, and citizens
            who believe these four nations are stronger together.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {communityRoles.map((role, i) => (
            <button
              key={role.id}
              onClick={() => setActiveRole(i)}
              className={`text-left p-6 rounded-2xl transition-all ${
                i === activeRole
                  ? 'bg-crimson-600/10 border border-crimson-600/30 ring-1 ring-crimson-600/10'
                  : 'bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10'
              }`}
            >
              <div className={`mb-4 ${i === activeRole ? 'text-crimson-500' : 'text-white/30'}`}>
                {iconMap[role.icon]}
              </div>
              <h3 className={`font-semibold text-lg mb-2 ${i === activeRole ? 'text-white' : 'text-white/70'}`}>
                {role.title}
              </h3>
              <p className={`text-sm leading-relaxed ${i === activeRole ? 'text-white/60' : 'text-white/40'}`}>
                {role.description}
              </p>
            </button>
          ))}
        </div>

        {/* Active Role Detail */}
        <div className="max-w-3xl mx-auto" key={communityRoles[activeRole].id}>
          <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-2xl border border-white/10 p-8 animate-fade-in">
            <h3 className="text-2xl font-serif font-bold text-white mb-2">
              For {communityRoles[activeRole].title}
            </h3>
            <p className="text-white/50 mb-6">{communityRoles[activeRole].description}</p>
            <div className="space-y-3">
              {communityRoles[activeRole].benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <Check size={16} className="text-crimson-500 flex-shrink-0 mt-1" />
                  <span className="text-white/70 text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Community Features Preview */}
        <div className="grid sm:grid-cols-3 gap-6 mt-16">
          <div className="text-center p-6">
            <div className="w-14 h-14 rounded-2xl bg-crimson-600/10 flex items-center justify-center mx-auto mb-4">
              <Users size={24} className="text-crimson-500" />
            </div>
            <h4 className="font-semibold text-white mb-2">Connect</h4>
            <p className="text-white/40 text-sm">Find your people in any CANZUK city. Flatmates, colleagues, friends who get it.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-14 h-14 rounded-2xl bg-navy-700/30 flex items-center justify-center mx-auto mb-4">
              <Globe size={24} className="text-navy-300" />
            </div>
            <h4 className="font-semibold text-white mb-2">Explore</h4>
            <p className="text-white/40 text-sm">City guides, job boards, visa info — all written by people who've done it.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-14 h-14 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={24} className="text-gold-500" />
            </div>
            <h4 className="font-semibold text-white mb-2">Advocate</h4>
            <p className="text-white/40 text-sm">Join the conversation. Write to your MP. Share the vision. Make it happen.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
