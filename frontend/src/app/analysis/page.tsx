"use client";

import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { TrendingDown, AlertCircle, FileSpreadsheet, Percent, Calculator, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { EvidenceViewer, Evidence } from "@/components/EvidenceViewer";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface RiskFactor {
  category: string;
  flag: string;
  description: string;
  severity: string;
  evidence: Evidence;
}

export default function AnalysisPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // We are keeping the static charts since they depend on the external data source, 
  // but replacing the Anomaly lists with our shiny, evidence-backed EBCR module.
  const anomalyData = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        label: "Declared Revenue",
        data: [12.5, 14.2, 11.8, 15.6],
        backgroundColor: "rgba(16, 185, 129, 0.8)",
      },
      {
        label: "Bank Deposits",
        data: [12.0, 13.9, 11.5, 10.2], // Anomaly in Q4
        backgroundColor: "rgba(225, 29, 72, 0.8)",
      }
    ]
  };

  useEffect(() => {
    async function runAnalysis() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/api/analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ company_data_summary: "Acme Corp shows a 34% discrepancy between Q4 declared GST revenue and bank deposits. Total unsecured loans increased 150% in FY23." })
        });
        const json = await res.json();
        if (json.risk_analysis) {
           setData(json.risk_analysis);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    // Auto-run analysis for demo purposes
    runAnalysis();
  }, []);

  return (
    <div className="space-y-6 animate-in">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Financial & Risk Analysis Engine</h1>
        <p className="text-slate-400 mt-1">Evidence-Backed AI-driven cross-validation of GST, Tax filings, and Bank Statements.</p>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 glass-card">
           <Loader2 className="w-8 h-8 animate-spin text-accent-secondary mb-4" />
           <p className="text-slate-300">Generating Evidence-Backed Risk Snapshot...</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Fraud Pattern Detector & EBCR Display */}
        <div className="glass-card p-6 border-accent-danger/20 relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-danger/10 rounded-full blur-3xl" />
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle size={18} className="text-accent-danger" />
            Evidenced Risk Factors
          </h3>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="text-5xl font-bold text-accent-danger">
              {data?.fraud_probability_percent || 68}<span className="text-2xl">%</span>
            </div>
            <div>
              <div className="font-semibold text-white">Fraud Probability</div>
              <div className="text-sm text-slate-400">High variance backed by source documents.</div>
            </div>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto">
            {data?.risk_factors ? data.risk_factors.map((factor: RiskFactor, idx: number) => (
              <AnomalyItem 
                key={idx}
                flag={factor.flag} 
                desc={factor.description} 
                severe={factor.severity === 'High' || factor.severity === 'Critical'} 
                evidence={factor.evidence}
              />
            )) : (
               <div className="text-slate-500 text-sm">No risk factors evaluated yet.</div>
            )}
          </div>
        </div>

        {/* Loan Stress Simulator */}
        <div className="glass-card p-6 border-accent-secondary/20 relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-secondary/10 rounded-full blur-3xl" />
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calculator size={18} className="text-accent-secondary" />
            Loan Stress Simulator
          </h3>
          
          <div className="space-y-4 mb-6 flex-1">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-300">Revenue Drop (20%)</span>
              <span className="font-medium text-accent-danger">+14% Default Prob</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-300">Interest Rate Rise (+2%)</span>
              <span className="font-medium text-accent-warning">+6% Default Prob</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-300">Sector Demand Plunges</span>
              <span className="font-medium text-accent-danger">+22% Default Prob</span>
            </div>
          </div>

          <div className="p-4 bg-background/50 rounded-xl border border-white/5 mt-auto">
            <div className="text-sm text-slate-400 mb-1">Simulated Peak Default Probability</div>
            <div className="text-2xl font-bold text-accent-warning">
              {data?.simulated_default_prob_percent || 28.4}%
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
              <div 
                className="bg-accent-warning h-1.5 rounded-full shadow-[0_0_8px_hsl(var(--accent-warning))]" 
                style={{ width: `${Math.min(data?.simulated_default_prob_percent || 28.4, 100)}%` }}>
              </div>
            </div>
          </div>
        </div>

        {/* GST vs Bank Analysis Chart */}
        <div className="glass-card p-6 xl:col-span-2">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileSpreadsheet size={18} className="text-accent-primary" />
            Cross-Data Validation: GST vs Bank Deposits
          </h3>
          <div className="h-64">
            <Bar 
              data={anomalyData}
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                scales: {
                  y: { grid: { color: "rgba(255,255,255,0.05)" } },
                  x: { grid: { color: "rgba(255,255,255,0.05)" } }
                },
                plugins: {
                  legend: { labels: { color: "rgba(255,255,255,0.7)" } }
                }
              }} 
            />
          </div>
          <p className="text-sm text-slate-400 mt-4 text-center">
            Notice the significant divergence in Q4 where declared revenue spiked but actual bank deposits fell.
          </p>
        </div>

      </div>
      )}
    </div>
  );
}

function AnomalyItem({ flag, desc, severe = false, evidence }: { flag: string, desc: string, severe?: boolean, evidence?: Evidence }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-xl border transition-colors ${severe ? 'bg-accent-danger/5 border-accent-danger/20 hover:bg-accent-danger/10' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
      <div 
        className="p-4 cursor-pointer flex justify-between items-start"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <div className={`font-semibold text-sm ${severe ? 'text-accent-danger' : 'text-accent-warning'}`}>{flag}</div>
          <div className="text-xs text-slate-300 mt-1.5">{desc}</div>
        </div>
        <button className="text-slate-400 hover:text-white mt-1 shrink-0 ml-2">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      
      {expanded && evidence && (
        <div className="px-4 pb-4 animate-in slide-in-from-top-2">
          <EvidenceViewer evidence={evidence} />
        </div>
      )}
    </div>
  );
}
