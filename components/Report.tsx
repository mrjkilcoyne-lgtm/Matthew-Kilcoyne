import React from 'react';
import { MapPin, Compass, Sparkles, Feather, ChevronLeft } from 'lucide-react';
import { ReportData, InterviewAnswers } from '../types';
import { ActionTabs } from './ActionTabs';

interface ReportProps {
  data: ReportData;
  answers: InterviewAnswers;
  onReset: () => void;
}

export const Report: React.FC<ReportProps> = ({ data, answers, onReset }) => {
  return (
    <div className="flex-1 bg-[#F2F0EB] overflow-y-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="max-w-5xl mx-auto bg-white shadow-xl shadow-stone-300/40 min-h-screen flex flex-col border-x border-stone-200">
        
        {/* Report Header */}
        <div className="bg-stone-900 text-white p-12 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Feather size={200} />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
               <div className="px-3 py-1 border border-white/30 rounded-full text-xs tracking-widest uppercase">
                 Confidential Strategy
               </div>
               <div className="text-stone-400 font-mono text-sm">{new Date().toLocaleDateString()}</div>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif leading-tight mb-6">
              {data.title}
            </h1>
            <p className="text-xl text-stone-300 font-light max-w-2xl">
              A foundational document for your next chapter, synthesized by The Confluation Engine.
            </p>
          </div>
        </div>

        {/* Report Sections */}
        <div className="p-12 md:p-16 space-y-12 border-b border-stone-200">
          
          <div className="flex gap-6 group">
            <div className="flex-shrink-0 mt-1 p-2 bg-stone-100 rounded-lg h-fit group-hover:bg-stone-200 transition-colors">
              <MapPin className="w-5 h-5 text-stone-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">The Narrative Thread</h3>
              <p className="text-stone-600 text-lg font-light leading-relaxed">{data.narrative_thread}</p>
            </div>
          </div>

          <div className="flex gap-6 group">
            <div className="flex-shrink-0 mt-1 p-2 bg-stone-100 rounded-lg h-fit group-hover:bg-stone-200 transition-colors">
              <Compass className="w-5 h-5 text-stone-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">The Unfair Advantage</h3>
              <p className="text-stone-600 text-lg font-light leading-relaxed">{data.unfair_advantage}</p>
            </div>
          </div>

          <div className="flex gap-6 group">
            <div className="flex-shrink-0 mt-1 p-2 bg-stone-100 rounded-lg h-fit group-hover:bg-stone-200 transition-colors">
              <Sparkles className="w-5 h-5 text-stone-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">The Confluation Thesis</h3>
              <p className="text-stone-600 text-lg font-light leading-relaxed">{data.confluation_thesis}</p>
            </div>
          </div>

          <div className="flex gap-6 group">
            <div className="flex-shrink-0 mt-1 p-2 bg-stone-100 rounded-lg h-fit group-hover:bg-stone-200 transition-colors">
              <Feather className="w-5 h-5 text-stone-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">The Immediate Vision</h3>
              <p className="text-stone-600 text-lg font-light leading-relaxed">{data.immediate_vision}</p>
            </div>
          </div>

        </div>

        {/* ACTION ENGINE DASHBOARD */}
        <div className="bg-stone-50 p-12 md:p-16">
          <h2 className="text-2xl font-serif text-stone-900 mb-8">Move from Strategy to Action</h2>
          <ActionTabs answers={answers} report={data} />
        </div>

        {/* Document Footer */}
        <div className="p-8 bg-white border-t border-stone-200 flex justify-between items-center text-stone-400 text-sm">
          <button 
            onClick={onReset}
            className="hover:text-stone-900 transition-colors flex items-center gap-2 font-medium"
          >
            <ChevronLeft size={16} /> Start Over
          </button>
          <span>The Confluation Engine v3.0</span>
        </div>
      </div>
    </div>
  );
};
