import React, { useState } from 'react';
import { Search, Coins, Briefcase, ArrowRight, Copy, Loader2 } from 'lucide-react';
import { InterviewAnswers, ReportData } from '../types';
import { runMarketResearch } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface ActionTabsProps {
  answers: InterviewAnswers;
  report: ReportData;
}

type TabType = 'research' | 'grants' | 'jobs';

export const ActionTabs: React.FC<ActionTabsProps> = ({ answers, report }) => {
  const [activeTab, setActiveTab] = useState<TabType>('research');
  const [researchResult, setResearchResult] = useState<string | null>(null);
  const [isLoadingResearch, setIsLoadingResearch] = useState(false);

  const handleRunAnalysis = async () => {
    setIsLoadingResearch(true);
    const result = await runMarketResearch(answers);
    setResearchResult(result);
    setIsLoadingResearch(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
      <div className="flex border-b border-stone-200">
        <button 
          onClick={() => setActiveTab('research')}
          className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'research' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-stone-50 text-stone-500 hover:bg-stone-100'}`}
        >
          <div className="flex items-center justify-center gap-2">
            <Search size={16} /> Deep Research
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('grants')}
          className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'grants' ? 'bg-white text-emerald-600 border-b-2 border-emerald-600' : 'bg-stone-50 text-stone-500 hover:bg-stone-100'}`}
        >
          <div className="flex items-center justify-center gap-2">
            <Coins size={16} /> Grants & Capital
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('jobs')}
          className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'jobs' ? 'bg-white text-purple-600 border-b-2 border-purple-600' : 'bg-stone-50 text-stone-500 hover:bg-stone-100'}`}
        >
          <div className="flex items-center justify-center gap-2">
            <Briefcase size={16} /> Career Pivot
          </div>
        </button>
      </div>

      <div className="p-8 min-h-[300px]">
        {activeTab === 'research' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <p className="text-stone-600">
              Validate the market viability of your thesis: <strong>{answers.superpower}</strong> applied to <strong>{answers.soft_heart}</strong>.
            </p>
            
            {!researchResult && !isLoadingResearch && (
              <div className="bg-stone-50 p-6 rounded-lg border border-stone-200 text-center space-y-4">
                 <p className="text-stone-500 italic">Ready to run a live market simulation using Gemini 2.5 Flash?</p>
                 <button 
                    onClick={handleRunAnalysis}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                 >
                   <Search className="w-4 h-4 mr-2" />
                   Run Market Analysis
                 </button>
              </div>
            )}

            {isLoadingResearch && (
               <div className="flex flex-col items-center justify-center py-12 space-y-4">
                 <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                 <p className="text-stone-400 text-sm">Consulting the oracle...</p>
               </div>
            )}

            {researchResult && (
               <div className="bg-stone-900 text-stone-300 p-6 rounded-lg font-mono text-sm leading-relaxed overflow-x-auto">
                 <ReactMarkdown className="prose prose-invert prose-sm max-w-none">
                    {researchResult}
                 </ReactMarkdown>
               </div>
            )}
            
            <div className="border-t border-stone-100 pt-6">
                 <div className="text-xs font-bold uppercase text-stone-400 mb-2">Prompt Used</div>
                 <div className="bg-stone-50 p-4 rounded text-xs text-stone-500 font-mono">
                    "Act as a Venture Capitalist... Critique this idea brutally..."
                 </div>
            </div>
          </div>
        )}

        {activeTab === 'grants' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <p className="text-stone-600">Based on your inputs, here are the types of funding that fit your profile:</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border border-stone-200 rounded-lg hover:border-emerald-500 transition-colors cursor-pointer group bg-white">
                 <div className="flex justify-between mb-2">
                   <span className="font-bold text-stone-800">Innovate UK / NSF Grants</span>
                   <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 text-emerald-600 transition-opacity" />
                 </div>
                 <p className="text-sm text-stone-500">Best if your "{answers.superpower}" involves R&D or technical innovation. Non-dilutive funding.</p>
              </div>
              <div className="p-4 border border-stone-200 rounded-lg hover:border-emerald-500 transition-colors cursor-pointer group bg-white">
                 <div className="flex justify-between mb-2">
                   <span className="font-bold text-stone-800">Niche VC / Micro-Funds</span>
                   <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 text-emerald-600 transition-opacity" />
                 </div>
                 <p className="text-sm text-stone-500">Seek investors who specialize in {answers.soft_heart || 'your specific vertical'}.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <p className="text-stone-600">If you aren't ready to found a company, here are job titles that mix <strong>{answers.superpower}</strong> with <strong>{answers.soft_heart}</strong>:</p>
            <div className="space-y-3">
               {['Product Lead', 'Strategic Partnerships', 'Head of Operations'].map((role, i) => (
                 <div key={i} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-100 hover:border-purple-200 transition-colors">
                   <div className="flex items-center gap-3">
                     <Briefcase size={16} className="text-stone-400" />
                     <span className="font-medium text-stone-800">{role} at {answers.soft_heart || 'Industry'} Tech</span>
                   </div>
                   <button className="text-xs font-bold text-purple-600 uppercase hover:underline">Search Roles</button>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
