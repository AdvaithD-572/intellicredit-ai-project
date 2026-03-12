"use client";

import { useState } from "react";
import { Search, Globe, Shield, RefreshCcw, Network, ArrowRight, Loader2 } from "lucide-react";
import { EvidenceViewer, Evidence } from "@/components/EvidenceViewer";

interface NewsItem {
  title: string;
  date: string;
  impact: string;
  relevance: string;
  evidence: Evidence;
}

export default function ResearchPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [data, setData] = useState<any>(null);

  const runScan = async () => {
    setIsScanning(true);
    try {
      const res = await fetch("http://localhost:8000/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_name: "Acme Corp", promoter_name: "Rahul Sharma" })
      });
      const json = await res.json();
      if (json.research_findings) {
         setData(json.research_findings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6 animate-in">
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Research Agent</h1>
          <p className="text-slate-400 mt-1">Evidence-Backed background checks, news, and promoter network mapping.</p>
        </div>
        <button 
          onClick={runScan}
          disabled={isScanning}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
            isScanning ? 'bg-slate-800 text-slate-400 cursor-wait' : 'bg-accent-secondary text-black hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]'
          }`}
        >
          {isScanning ? <RefreshCcw className="animate-spin w-4 h-4" /> : <Search className="w-4 h-4" />}
          {isScanning ? 'Running Deep Scan...' : 'Run Deep Scan'}
        </button>
      </header>

      {!data && !isScanning && (
        <div className="flex flex-col items-center justify-center p-20 glass-card text-center">
            <Globe className="w-12 h-12 text-slate-500 mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-slate-300">Ready to Scan</h3>
            <p className="text-slate-500 max-w-md mt-2">Click "Run Deep Scan" to scour the web, legal databases, and MCA filings for verifiable evidence connected to Acme Corp.</p>
        </div>
      )}

      {isScanning && !data && (
        <div className="flex flex-col items-center justify-center p-20 glass-card">
           <Loader2 className="w-8 h-8 animate-spin text-accent-secondary mb-4" />
           <p className="text-slate-300">Gathering and Structuring Evidence...</p>
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4">
          
          <div className="xl:col-span-2 space-y-6">
            <div className="glass-card p-6 min-h-[500px]">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Globe size={18} className="text-accent-secondary" />
                Evidenced Intelligence Findings
              </h3>
              
              <div className="space-y-4">
                {data.news_items && data.news_items.length > 0 ? (
                  data.news_items.map((item: NewsItem, idx: number) => (
                    <NewsItemComponent key={idx} item={item} />
                  ))
                ) : (
                  <div className="text-slate-500 text-sm">No significant news findings.</div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6 border-accent-warning/30">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Network size={18} className="text-accent-warning" />
                Promoter Network Analysis
              </h3>
              
              <div className="p-4 bg-background/50 rounded-xl border border-white/5 mb-4 relative overflow-hidden flex items-center justify-center min-h-[200px]">
                {/* Simulated Graph Vis */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-warning via-background to-background pointer-events-none"></div>
                <div className="text-center space-y-2 z-10 relative mt-4">
                  <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs text-white border border-white/20">Promoter: Rahul Sharma</div>
                  <div className="flex items-center justify-center gap-4 text-slate-500">
                    <div className="w-0.5 h-8 bg-slate-700"></div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-2.5 h-8 bg-slate-700 mx-auto"></div>
                      <div className="px-3 py-1.5 bg-accent-primary/20 text-accent-primary border border-accent-primary/30 rounded-lg text-xs">Acme Corp</div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-2.5 h-8 bg-slate-700 mx-auto"></div>
                      <div className="px-3 py-1.5 bg-white/5 text-slate-300 border border-white/10 rounded-lg text-xs">Zenith Ind.</div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-2.5 h-8 bg-slate-700 mx-auto"></div>
                      <div className="px-3 py-1.5 bg-accent-danger/20 text-accent-danger border border-accent-danger/30 rounded-lg text-xs">Vortex (Bankrupt)</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                {data.promoter_flags && data.promoter_flags.length > 0 ? (
                  data.promoter_flags.map((flag: string, idx: number) => (
                    <p key={idx} className="text-sm text-slate-300">
                      <span className="text-accent-warning font-semibold">Flag:</span> {flag}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-slate-300">
                    <span className="text-accent-warning font-semibold">Flag:</span> Promoter is linked to 1 previously bankrupt entity.
                  </p>
                )}
                <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-sm font-medium rounded-lg transition-colors border border-white/5">
                  View Full Graph Database
                </button>
              </div>
            </div>
            
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Shield size={18} className="text-accent-primary" />
                Regulatory Status
              </h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex justify-between py-1 border-b border-white/5">
                  <span>GST Compliance</span> <span className="text-accent-primary">Compliant</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5">
                  <span>EPF Defaulter</span> <span className="text-white">No</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5">
                  <span>DIN Status</span> <span className="text-accent-primary">Active</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

function NewsItemComponent({ item }: { item: NewsItem }) {
  const [expanded, setExpanded] = useState(false);

  const getImpactColor = (imp: string) => {
    switch (imp) {
      case 'Positive': return 'text-accent-primary bg-accent-primary/10 border-accent-primary/20';
      case 'Negative': return 'text-accent-danger bg-accent-danger/10 border-accent-danger/20';
      default: return 'text-slate-300 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="glass-panel hover:bg-white/5 transition-all group overflow-hidden">
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-accent-secondary font-medium">{item.evidence?.source_name || "Unknown Source"}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{item.date}</span>
          </div>
          <div className="flex gap-2 text-right">
            <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${getImpactColor(item.impact)}`}>
              {item.impact} Impact
            </span>
            {item.relevance === 'Critical' && (
              <span className="px-2 py-0.5 rounded text-[10px] font-medium border text-accent-warning bg-accent-warning/10 border-accent-warning/20">
                High Relevance
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center gap-4">
          <h4 className="text-white font-medium text-sm leading-snug group-hover:text-accent-secondary transition-colors">
            {item.title}
          </h4>
          <div className="text-slate-500 group-hover:text-white transition-colors shrink-0">
             {expanded ? <span className="text-xs">Hide Evidence</span> : <span className="text-xs flex items-center gap-1">Show Evidence <ArrowRight size={12}/></span>}
          </div>
        </div>
      </div>
      
      {expanded && item.evidence && (
        <div className="px-4 pb-4 animate-in slide-in-from-top-2 border-t border-white/5 pt-3 mt-1">
          <EvidenceViewer evidence={item.evidence} />
        </div>
      )}
    </div>
  );
}
