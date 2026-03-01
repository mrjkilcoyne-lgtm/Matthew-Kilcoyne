import React, { useState } from 'react';
import { Welcome } from './components/Welcome';
import { Interview } from './components/Interview';
import { Report } from './components/Report';
import { InterviewAnswers, ReportData } from './types';
import { generateConfluationReport } from './services/geminiService';
import { DashboardApp } from './dashboard/DashboardApp';

type Phase = 'welcome' | 'interview' | 'analysis' | 'report' | 'dashboard';

const App: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('welcome');
  const [answers, setAnswers] = useState<InterviewAnswers>({});
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const startInterview = () => {
    setPhase('interview');
  };

  const openDashboard = () => {
    setPhase('dashboard');
  };

  const handleInterviewComplete = async (completedAnswers: InterviewAnswers) => {
    setAnswers(completedAnswers);
    setPhase('analysis');

    try {
      const report = await generateConfluationReport(completedAnswers);
      setReportData(report);
      setPhase('report');
    } catch (error) {
      console.error("Failed to generate report", error);
      alert("Something went wrong generating your strategy. Please try again.");
      setPhase('welcome');
    }
  };

  const resetApp = () => {
    setPhase('welcome');
    setAnswers({});
    setReportData(null);
  };

  // Dashboard gets full-screen treatment
  if (phase === 'dashboard') {
    return <DashboardApp onBackToEngine={() => setPhase('welcome')} />;
  }

  return (
    <div className="flex flex-col h-screen bg-[#FDFBF7] font-sans text-stone-900 overflow-hidden selection:bg-stone-200 selection:text-stone-900">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white/50 backdrop-blur-md border-b border-stone-200 z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-stone-800 rounded-lg flex items-center justify-center shadow-lg shadow-stone-300">
            <span className="text-white font-serif font-bold italic">C</span>
          </div>
          <h1 className="font-serif font-medium text-lg tracking-tight text-stone-800 hidden md:block">The Confluation Engine</h1>
        </div>
        <button
          onClick={openDashboard}
          className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity shadow-md"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
          </svg>
          Social Pulse
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col">

        {phase === 'welcome' && <Welcome onStart={startInterview} />}

        {phase === 'interview' && <Interview onComplete={handleInterviewComplete} />}

        {phase === 'analysis' && (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#FDFBF7]">
            <div className="max-w-md text-center space-y-6 animate-in fade-in duration-1000">
              <h3 className="text-2xl font-serif font-medium text-stone-800">Synthesizing Narrative...</h3>
              <p className="text-stone-500 font-light">
                Connecting {Object.keys(answers).length} data points to identify your Confluation.
              </p>
              <div className="flex justify-center gap-2">
                <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {phase === 'report' && reportData && (
          <Report
            data={reportData}
            answers={answers}
            onReset={resetApp}
          />
        )}

      </main>
    </div>
  );
};

export default App;
