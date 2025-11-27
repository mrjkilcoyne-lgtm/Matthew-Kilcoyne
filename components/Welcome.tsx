import React from 'react';
import { Feather, ArrowRight } from 'lucide-react';

interface WelcomeProps {
  onStart: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-700">
      <div className="max-w-xl space-y-8">
        <div className="inline-block p-4 rounded-full bg-stone-100 mb-4 shadow-sm">
           <Feather className="w-8 h-8 text-stone-600" />
        </div>
        <h2 className="text-4xl md:text-5xl font-serif font-medium text-stone-800 leading-tight">
          Where did you start,<br/>and how did you get here?
        </h2>
        <p className="text-lg text-stone-600 font-light leading-relaxed">
          We will conduct a 10-question deep dive interview to explore your life's narrative. 
          At the end, our AI engine will conflate your history into a future strategy.
        </p>
        <div className="pt-4">
          <button 
            onClick={onStart}
            className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-stone-800 rounded-full hover:bg-stone-700 transition-all hover:scale-105 shadow-xl shadow-stone-200"
          >
            Start the Interview
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
