import React, { useState } from 'react';
import { ForecastPoint } from '../types';
import { 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  Activity, 
  Gauge, 
  Layers, 
  HelpCircle,
  BrainCircuit,
  Sliders
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Area, 
  ComposedChart 
} from 'recharts';

interface ForecastProps {
  forecastData: ForecastPoint[];
}

export const Forecast: React.FC<ForecastProps> = ({ forecastData }) => {
  const [selectedHorizon, setSelectedHorizon] = useState<string>('30m');

  const activePoint = forecastData.find(p => p.timeHorizon === selectedHorizon) || forecastData[1];

  const chartData = [
    { time: 'Current (0m)', volume: 1942, speed: 34.2, lower: 34.2, upper: 34.2 },
    { time: '+15 min', volume: 2420, speed: 34.2, lower: 32.1, upper: 36.8 },
    { time: '+30 min', volume: 2680, speed: 30.5, lower: 28.0, upper: 33.4 },
    { time: '+45 min', volume: 2890, speed: 27.8, lower: 24.5, upper: 30.8 },
    { time: '+60 min', volume: 2710, speed: 31.4, lower: 28.5, upper: 34.2 }
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#28313C] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest text-[#4AA3DF] uppercase bg-[#151B23] px-2 py-0.5 rounded border border-[#28313C]">
              TEMPORAL FORECAST ENGINE
            </span>
            <span className="text-[11px] font-mono text-[#8B98A7]">
              SPATIO-TEMPORAL AUTOREGRESSIVE GRADIENT
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#E8EDF2]">
            Predictive Network Congestion Forecasting
          </h1>
          <p className="text-xs text-[#8B98A7] mt-1 max-w-2xl leading-relaxed">
            Projected traffic volumes, mean traversal velocities, and bottleneck propagation risk up to 60 minutes into the future.
          </p>
        </div>

        {/* Model Transparency Disclaimer */}
        <div className="bg-[#151B23] border border-[#28313C] rounded p-2.5 flex items-center gap-2.5 max-w-sm">
          <BrainCircuit className="w-5 h-5 text-[#4AA3DF] shrink-0" />
          <div className="text-[11px]">
            <div className="font-semibold text-[#E8EDF2]">Model State: Offline Synthetic Baseline</div>
            <div className="text-[#8B98A7]">Calibrated historical diurnal profile with confidence intervals.</div>
          </div>
        </div>
      </div>

      {/* Horizon Selector Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {forecastData.map(pt => {
          const isSelected = selectedHorizon === pt.timeHorizon;
          return (
            <button
              key={pt.timeHorizon}
              onClick={() => setSelectedHorizon(pt.timeHorizon)}
              className={`p-3.5 rounded-lg text-left transition-all border ${
                isSelected
                  ? 'bg-[#1A212B] border-[#4AA3DF] shadow-lg'
                  : 'bg-[#151B23] border-[#28313C] hover:border-[#3B4756]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm font-bold text-[#E8EDF2]">
                  +{pt.timeHorizon}
                </span>
                <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                  pt.bottleneckRisk === 'Low' ? 'bg-[#35C98B]/20 text-[#35C98B]' :
                  pt.bottleneckRisk === 'Moderate' ? 'bg-[#E7C65A]/20 text-[#E7C65A]' :
                  pt.bottleneckRisk === 'High' ? 'bg-[#E58B42]/20 text-[#E58B42]' :
                  'bg-[#E05A5A]/20 text-[#E05A5A]'
                }`}>
                  {pt.bottleneckRisk} Risk
                </span>
              </div>
              <div className="text-xs text-[#8B98A7]">
                Vol: <strong className="text-[#E8EDF2] font-mono">{pt.predictedVolume} v/h</strong>
              </div>
              <div className="text-xs text-[#8B98A7]">
                Speed: <strong className="text-[#E8EDF2] font-mono">{pt.predictedSpeed} km/h</strong>
              </div>
            </button>
          );
        })}
      </div>

      {/* Horizon Focus Spotlight */}
      <div className="bg-[#151B23] border border-[#28313C] rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#28313C] mb-4 gap-2">
          <div>
            <h2 className="text-sm font-semibold text-[#E8EDF2]">
              Forecast Profile: +{activePoint.timeHorizon} Horizon
            </h2>
            <p className="text-xs text-[#8B98A7] mt-0.5">
              Projected corridor state based on current shockwave propagation vectors
            </p>
          </div>
          <div className="font-mono text-xs text-[#4AA3DF] bg-[#11161D] px-2.5 py-1 rounded border border-[#28313C]">
            Confidence Band: {activePoint.confidenceLower} — {activePoint.confidenceUpper} km/h (95% CI)
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#11161D] p-3.5 rounded border border-[#28313C]">
            <div className="flex items-center justify-between text-xs text-[#8B98A7] mb-1">
              <span>Predicted Volume</span>
              <Layers className="w-3.5 h-3.5 text-[#4AA3DF]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#E8EDF2]">
              {activePoint.predictedVolume}
            </div>
            <div className="text-[11px] text-[#E05A5A] mt-1 font-mono">
              +{((activePoint.predictedVolume - 1942) / 1942 * 100).toFixed(1)}% vs current demand
            </div>
          </div>

          <div className="bg-[#11161D] p-3.5 rounded border border-[#28313C]">
            <div className="flex items-center justify-between text-xs text-[#8B98A7] mb-1">
              <span>Expected Mean Velocity</span>
              <Gauge className="w-3.5 h-3.5 text-[#35C98B]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#E8EDF2]">
              {activePoint.predictedSpeed} <span className="text-xs font-normal text-[#8B98A7]">km/h</span>
            </div>
            <div className="text-[11px] text-[#E58B42] mt-1 font-mono">
              Trajectory: {activePoint.predictedSpeed < 34.2 ? 'Decelerating' : 'Recovering'}
            </div>
          </div>

          <div className="bg-[#11161D] p-3.5 rounded border border-[#28313C]">
            <div className="flex items-center justify-between text-xs text-[#8B98A7] mb-1">
              <span>Congestion Level Index</span>
              <Activity className="w-3.5 h-3.5 text-[#E05A5A]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#E8EDF2]">
              {activePoint.predictedCongestionPct}%
            </div>
            <div className="text-[11px] text-[#8B98A7] mt-1 font-mono">
              Bottleneck Risk: <span className="text-[#E05A5A]">{activePoint.bottleneckRisk}</span>
            </div>
          </div>
        </div>

        {/* Contributing Factors */}
        <div className="mt-4 pt-3 border-t border-[#28313C]">
          <div className="text-xs font-semibold text-[#E8EDF2] mb-2">
            Primary Predictive Determinants & Contributing Factors:
          </div>
          <div className="flex flex-wrap gap-2">
            {activePoint.contributingFactors.map((factor, i) => (
              <span key={i} className="text-xs bg-[#1A212B] border border-[#28313C] text-[#8B98A7] px-2.5 py-1 rounded">
                • {factor}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Projection Chart */}
      <div className="bg-[#151B23] border border-[#28313C] rounded-lg p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#28313C] mb-4">
          <div>
            <h2 className="text-sm font-semibold text-[#E8EDF2]">
              60-Minute Predictive Velocity Envelope & Demand Curve
            </h2>
            <p className="text-xs text-[#8B98A7] mt-0.5">
              Visualizing velocity decay and volume growth with 95% Bayesian confidence band
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#28313C" vertical={false} />
              <XAxis dataKey="time" stroke="#5E6A78" fontSize={11} tickLine={false} />
              <YAxis stroke="#5E6A78" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#11161D', borderColor: '#28313C', borderRadius: '6px', fontSize: '11px', color: '#E8EDF2' }}
              />
              <Area type="monotone" dataKey="upper" stroke="none" fill="#4AA3DF" fillOpacity={0.15} />
              <Line type="monotone" dataKey="speed" stroke="#35C98B" strokeWidth={2.5} name="Expected Velocity (km/h)" />
              <Line type="monotone" dataKey="volume" stroke="#4AA3DF" strokeWidth={2} name="Vehicles / Hour" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
