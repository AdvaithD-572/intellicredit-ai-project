"use client";

import { useState } from "react";
import { UploadCloud, FileText, CheckCircle2, XCircle, FileImage, FileCode, Search } from "lucide-react";

export default function UploadPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  const simulateProcessing = () => {
    setIsProcessing(true);
    let current = 0;
    const interval = setInterval(() => {
      current += 5;
      setProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsProcessing(false);
          setUploadComplete(true);
        }, 500);
      }
    }, 150);
  };

  return (
    <div className="space-y-6 animate-in">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Data Ingestion Engine</h1>
        <p className="text-slate-400 mt-1">Upload corporate documents, bank statements, and tax filings.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Area */}
          <div 
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
              ${isProcessing || uploadComplete ? 'border-accent-primary/50 bg-accent-primary/5' : 'border-white/20 hover:border-accent-primary/50 hover:bg-white/5'}
            `}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); if (!isProcessing && !uploadComplete) simulateProcessing(); }}
          >
            {!isProcessing && !uploadComplete && (
              <div className="cursor-pointer" onClick={simulateProcessing}>
                <div className="w-20 h-20 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/10">
                  <UploadCloud size={40} className="text-accent-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Drag & Drop Files Here</h3>
                <p className="text-slate-400 text-sm mb-6">Supports PDF, Excel, scanned images (OCR), CSV</p>
                <button className="px-6 py-2.5 bg-accent-primary text-black font-semibold rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-all">
                  Browse Files
                </button>
              </div>
            )}

            {isProcessing && (
              <div className="py-8">
                <div className="w-16 h-16 mx-auto mb-6 relative">
                  <div className="absolute inset-0 border-4 border-accent-primary/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-accent-primary">Processing Documents...</h3>
                <p className="text-slate-400 text-sm mb-4">Extracting OCR data, financial tables, and segmenting text</p>
                <div className="w-full max-w-md mx-auto bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-accent-primary transition-all duration-200 shadow-[0_0_10px_rgba(16,185,129,0.8)]" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            )}

            {uploadComplete && (
              <div className="py-8">
                <div className="w-20 h-20 mx-auto rounded-full bg-accent-primary/20 flex items-center justify-center mb-6 ring-1 ring-accent-primary">
                  <CheckCircle2 size={40} className="text-accent-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">Extraction Complete</h3>
                <p className="text-slate-400 text-sm mb-6">14 financial tables and 82 entities extracted successfully.</p>
                <button 
                  onClick={() => { setUploadComplete(false); setProgress(0); }}
                  className="px-6 py-2.5 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-all"
                >
                  Upload More Records
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Supported Sources Sidebar */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText size={18} className="text-accent-secondary" />
            Accepted Formats
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <SourceCard icon={<FileText />} title="PDF Reports" desc="Annual returns, Directors report" />
            <SourceCard icon={<FileCode />} title="Structured Data" desc="Excel, CSV, GST XML" />
            <SourceCard icon={<FileImage />} title="Scans & Images" desc="Auto OCR for receipts/invoices" />
          </div>

          <div className="glass-card p-5 mt-6 border-accent-secondary/20 bg-accent-secondary/5">
            <h4 className="font-semibold text-accent-secondary mb-2 flex items-center gap-2">
              <Search size={16} /> Data Verification
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              The AI automatically cross-references uploaded documents with external MCA databases to verify authenticity and detect circular trading anomalies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SourceCard({ icon, title, desc }: any) {
  return (
    <div className="glass-panel p-4 flex items-start gap-4 hover:bg-white/5 transition-colors">
      <div className="p-2 bg-white/5 rounded-lg text-slate-300">{icon}</div>
      <div>
        <h4 className="font-medium text-white text-sm">{title}</h4>
        <p className="text-xs text-slate-400 mt-1">{desc}</p>
      </div>
    </div>
  );
}
