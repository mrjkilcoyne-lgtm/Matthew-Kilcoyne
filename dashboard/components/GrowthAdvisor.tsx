import React, { useState } from 'react';
import { PlatformId, GrowthAnalysis, PlatformConnection } from '../types';
import { analyzeGrowth } from '../services/aiService';
import { PLATFORMS, CORE_PLATFORMS } from '../utils/platformConfigs';
import { PLATFORM_BENCHMARKS } from '../utils/engagementFormulas';
import { GaugeChart } from './MiniChart';
import {
  Rocket, AlertTriangle, CheckCircle, ArrowRight, ChevronDown, ChevronUp,
  RefreshCw, Target, Zap, TrendingUp, Shield
} from 'lucide-react';

interface GrowthAdvisorProps {
  connections: PlatformConnection[];
  growthData: Record<string, GrowthAnalysis>;
  onUpdateGrowth: (platformId: PlatformId, data: GrowthAnalysis) => void;
}

const PHASE_STYLES: Record<string, { color: string; bg: string; label: string; emoji: string }> = {
  nadir: { color: '#EF4444', bg: 'bg-red-50', label: 'At Nadir', emoji: '' },
  declining: { color: '#F97316', bg: 'bg-orange-50', label: 'Declining', emoji: '' },
  stagnant: { color: '#F59E0B', bg: 'bg-amber-50', label: 'Stagnant', emoji: '' },
  growing: { color: '#10B981', bg: 'bg-emerald-50', label: 'Growing', emoji: '' },
  accelerating: { color: '#6366F1', bg: 'bg-indigo-50', label: 'Accelerating', emoji: '' },
  viral: { color: '#EC4899', bg: 'bg-pink-50', label: 'Viral Growth', emoji: '' },
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#EF4444',
  high: '#F97316',
  medium: '#F59E0B',
  low: '#6B7280',
};

export const GrowthAdvisor: React.FC<GrowthAdvisorProps> = ({
  connections,
  growthData,
  onUpdateGrowth,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>('x');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showRecoveryPlan, setShowRecoveryPlan] = useState(false);

  const connectedPlatforms = connections.filter(c => c.connected).map(c => c.platformId);
  const availablePlatforms = connectedPlatforms.length > 0 ? connectedPlatforms : CORE_PLATFORMS;
  const currentGrowth = growthData[selectedPlatform];
  const benchmarks = PLATFORM_BENCHMARKS[selectedPlatform];

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const conn = connections.find(c => c.platformId === selectedPlatform);
      const result = await analyzeGrowth(selectedPlatform, {
        followers: conn?.followerCount || 1000,
        weeklyGrowth: 0.5,
        monthlyGrowth: 2.0,
        engagementRate: benchmarks?.avgEngagementRate || 2,
        postsPerWeek: 3,
      });
      onUpdateGrowth(selectedPlatform, result);
    } catch (err) {
      console.error('Growth analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const phaseStyle = currentGrowth ? PHASE_STYLES[currentGrowth.currentPhase] || PHASE_STYLES.stagnant : null;

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-semibold text-stone-900">Growth Advisor</h2>
        <p className="text-sm text-stone-500 mt-1">
          AI-powered diagnosis of your growth trajectory with actionable recovery plans
        </p>
      </div>

      {/* Platform selector + analyze */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-end gap-3">
        <div className="flex-1">
          <label className="text-xs text-stone-500 font-medium block mb-1">Select Platform</label>
          <select
            value={selectedPlatform}
            onChange={e => setSelectedPlatform(e.target.value as PlatformId)}
            className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {availablePlatforms.map(id => (
              <option key={id} value={id}>{PLATFORMS[id]?.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50"
        >
          {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
          {isAnalyzing ? 'Analyzing...' : 'Analyze Growth'}
        </button>
      </div>

      {currentGrowth ? (
        <>
          {/* Growth Phase Banner */}
          <div className={`rounded-xl p-4 border ${phaseStyle?.bg} border-stone-200`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GaugeChart
                  value={
                    currentGrowth.currentPhase === 'viral' ? 95 :
                    currentGrowth.currentPhase === 'accelerating' ? 80 :
                    currentGrowth.currentPhase === 'growing' ? 60 :
                    currentGrowth.currentPhase === 'stagnant' ? 40 :
                    currentGrowth.currentPhase === 'declining' ? 20 : 10
                  }
                  size={80}
                  color={phaseStyle?.color}
                />
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: phaseStyle?.color }}>
                    {phaseStyle?.label}
                  </h3>
                  <p className="text-sm text-stone-600">
                    {currentGrowth.monthlyGrowthRate > 0 ? '+' : ''}{currentGrowth.monthlyGrowthRate.toFixed(1)}% monthly growth
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-stone-500">30-day projection</p>
                <p className="text-lg font-bold text-stone-900">{currentGrowth.projectedFollowers30d.toLocaleString()}</p>
                <p className="text-xs text-stone-500">90-day projection</p>
                <p className="text-lg font-bold text-stone-900">{currentGrowth.projectedFollowers90d.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Bottlenecks & Opportunities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Bottlenecks */}
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <h3 className="text-sm font-medium text-stone-700 flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Growth Bottlenecks
              </h3>
              <div className="space-y-3">
                {currentGrowth.bottlenecks.map((bottleneck, i) => (
                  <div key={i} className="border-l-2 pl-3 py-1" style={{ borderColor: SEVERITY_COLORS[bottleneck.severity] }}>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{
                        backgroundColor: SEVERITY_COLORS[bottleneck.severity] + '15',
                        color: SEVERITY_COLORS[bottleneck.severity]
                      }}>
                        {bottleneck.severity}
                      </span>
                      <h4 className="text-sm font-medium text-stone-800">{bottleneck.issue}</h4>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">{bottleneck.impact}</p>
                    <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> {bottleneck.solution}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Opportunities */}
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <h3 className="text-sm font-medium text-stone-700 flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-indigo-500" /> Growth Opportunities
              </h3>
              <div className="space-y-3">
                {currentGrowth.opportunities.map((opp, i) => (
                  <div key={i} className="bg-stone-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-stone-800">{opp.opportunity}</h4>
                      <div className="flex gap-1">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          opp.effort === 'low' ? 'bg-green-100 text-green-700' :
                          opp.effort === 'medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {opp.effort} effort
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-stone-500">{opp.potentialImpact}</p>
                    <p className="text-[10px] text-stone-400 mt-1">Timeframe: {opp.timeframe}</p>
                    <div className="mt-2 space-y-0.5">
                      {opp.steps.map((step, j) => (
                        <p key={j} className="text-xs text-stone-600 flex items-start gap-1">
                          <ArrowRight className="w-3 h-3 mt-0.5 text-indigo-400 flex-shrink-0" />
                          {step}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recovery Plan */}
          {currentGrowth.recoveryPlan && (
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
              <button
                onClick={() => setShowRecoveryPlan(!showRecoveryPlan)}
                className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-500" />
                  <div className="text-left">
                    <h3 className="text-sm font-medium text-stone-700">10-Week Recovery & Growth Plan</h3>
                    <p className="text-xs text-stone-500">{currentGrowth.recoveryPlan.diagnosis.slice(0, 100)}...</p>
                  </div>
                </div>
                {showRecoveryPlan ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
              </button>

              {showRecoveryPlan && (
                <div className="px-4 pb-4 border-t border-stone-100">
                  <p className="text-sm text-stone-600 my-3">{currentGrowth.recoveryPlan.diagnosis}</p>

                  <div className="space-y-4">
                    {[currentGrowth.recoveryPlan.phase1, currentGrowth.recoveryPlan.phase2, currentGrowth.recoveryPlan.phase3].map((phase, i) => (
                      <div key={i} className="relative pl-8 pb-4">
                        {/* Timeline line */}
                        {i < 2 && <div className="absolute left-3 top-6 w-px h-full bg-stone-200" />}
                        {/* Timeline dot */}
                        <div className="absolute left-0 top-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ backgroundColor: i === 0 ? '#6366F1' : i === 1 ? '#10B981' : '#F59E0B' }}>
                          {i + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-stone-800">{phase.name}</h4>
                            <span className="text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">{phase.duration}</span>
                          </div>
                          <ul className="space-y-1">
                            {phase.actions.map((action, j) => (
                              <li key={j} className="text-xs text-stone-600 flex items-start gap-1.5">
                                <CheckCircle className="w-3 h-3 text-stone-300 mt-0.5 flex-shrink-0" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-indigo-50 rounded-lg p-3 mt-2">
                    <p className="text-xs text-indigo-700 font-medium flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Expected Outcome
                    </p>
                    <p className="text-sm text-indigo-800 mt-1">{currentGrowth.recoveryPlan.expectedOutcome}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Benchmark comparison */}
          {benchmarks && (
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <h3 className="text-sm font-medium text-stone-700 mb-3">Platform Benchmarks ({PLATFORMS[selectedPlatform]?.name})</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Avg Engagement', value: `${benchmarks.avgEngagementRate}%`, benchmark: true },
                  { label: 'Monthly Growth', value: `${benchmarks.growthRateBenchmark}%`, benchmark: true },
                  { label: 'Viral Threshold', value: `${benchmarks.viralThreshold}%`, benchmark: true },
                  { label: 'Avg Reach', value: benchmarks.avgReach.toLocaleString(), benchmark: true },
                ].map(item => (
                  <div key={item.label} className="bg-stone-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-stone-500">{item.label}</p>
                    <p className="text-lg font-bold text-stone-900">{item.value}</p>
                    <p className="text-[10px] text-stone-400">industry avg</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <Rocket className="w-10 h-10 mx-auto text-stone-300 mb-3" />
          <h3 className="text-lg font-medium text-stone-700 mb-1">Ready to analyze your growth</h3>
          <p className="text-sm text-stone-500 mb-2">
            Select a platform and click "Analyze Growth" to get a detailed diagnosis with a personalised recovery plan
          </p>
          <p className="text-xs text-stone-400">Works even without connected accounts (uses benchmark data)</p>
        </div>
      )}
    </div>
  );
};
