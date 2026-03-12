"use client";

import { useEffect, useState } from "react";
import {
    Building2, Activity, AlertTriangle, Shield, CheckCircle2,
    XCircle, FileText, UploadCloud, RefreshCcw, ArrowRight, Loader2
} from "lucide-react";
import { useParams } from "next/navigation";

// Reuse the type definition from research page
interface ResearchData {
    promoter_flags?: string[];
    news_items?: Array<{
        title: string;
        date: string;
        impact: "Positive" | "Negative" | "Neutral";
        relevance: "Low" | "Medium" | "High" | "Critical";
        evidence: {
            source_name: string;
            url?: string | null;
            snippet: string;
        };
    }>;
}

export default function CompanyDashboard() {
    const params = useParams();
    const companyName = decodeURIComponent(params.name as string);

    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<ResearchData | null>(null);

    // File Upload State
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/research", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ company_name: companyName, promoter_name: "" })
                });
                const json = await res.json();
                if (json.research_findings) {
                    setData(json.research_findings);
                }
            } catch (err) {
                console.error("Failed to fetch research:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCompanyData();
    }, [companyName]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const selected = Array.from(e.target.files);
        setFiles(selected);

        setIsUploading(true);
        const formData = new FormData();
        selected.forEach(file => formData.append("files", file));

        try {
            const res = await fetch("http://localhost:8000/api/ingest", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            setUploadResult(data.extracted_data);
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRunAnalysis = async () => {
        if (!uploadResult) return;
        setIsAnalyzing(true);
        try {
            const res = await fetch("http://localhost:8000/api/analysis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // Safely pass the extracted data string
                body: JSON.stringify({
                    company_data_summary: typeof uploadResult === 'string' ? uploadResult : JSON.stringify(uploadResult)
                })
            });
            const data = await res.json();
            setAnalysisResult(data.risk_analysis);
        } catch (error) {
            console.error("Analysis failed:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getImpactColor = (impact: string) => {
        switch (impact) {
            case 'Positive': return 'text-accent-success bg-accent-success/10 border-accent-success/20';
            case 'Negative': return 'text-accent-danger bg-accent-danger/10 border-accent-danger/20';
            default: return 'text-accent-warning bg-accent-warning/10 border-accent-warning/20';
        }
    };

    return (
        <div className="flex-1 overflow-auto bg-[#04080F]">
            <div className="p-8 max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-primary/20 to-cyan-500/20 flex items-center justify-center border border-accent-primary/30">
                                <Building2 className="w-6 h-6 text-accent-primary" />
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight text-white">{companyName}</h1>
                        </div>
                        <p className="text-gray-400">AI-powered analytics and risk assessment</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="glass-panel px-6 py-3 flex flex-col items-center justify-center min-w-[150px]">
                            <span className="text-sm text-gray-400 mb-1">Status</span>
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 text-accent-warning animate-spin" />
                            ) : data?.promoter_flags?.length ? (
                                <div className="flex items-center gap-2 text-accent-danger font-medium">
                                    <XCircle className="w-5 h-5" /> High Risk
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-accent-success font-medium">
                                    <CheckCircle2 className="w-5 h-5" /> Verified
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="glass-panel p-12 flex flex-col items-center justify-center text-gray-400">
                        <RefreshCcw className="w-8 h-8 animate-spin mb-4 text-accent-primary" />
                        <p>Generating company analytics report...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Left Column: News & Intel */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="glass-panel p-6">
                                <div className="flex items-center gap-2 mb-6 text-lg font-medium text-white border-b border-white/10 pb-4">
                                    <Activity className="w-5 h-5 text-accent-primary" />
                                    Recent Market Intelligence
                                </div>

                                <div className="space-y-4">
                                    {data?.news_items?.map((item, idx) => (
                                        <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="font-medium text-gray-200">{item.title}</h4>
                                                <span className={`text-xs px-2.5 py-1 rounded-full border ${getImpactColor(item.impact)}`}>
                                                    {item.impact}
                                                </span>
                                            </div>

                                            <div className="relative pl-4 mb-4">
                                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent-primary/50 rounded-full" />
                                                <p className="text-sm text-gray-400 italic">&quot;{item.evidence.snippet}&quot;</p>
                                            </div>

                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Shield className="w-3 h-3" /> {item.evidence.source_name}
                                                </span>
                                                <span>{item.date}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {!data?.news_items?.length && (
                                        <p className="text-gray-400 text-sm">No recent significant news detected.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Promoter Flags & Uploads */}
                        <div className="space-y-6">

                            {/* Promoter Flags */}
                            <div className="glass-panel p-6">
                                <div className="flex items-center gap-2 mb-6 text-lg font-medium text-white border-b border-white/10 pb-4">
                                    <AlertTriangle className="w-5 h-5 text-accent-danger" />
                                    Risk Flags
                                </div>
                                {data?.promoter_flags && data.promoter_flags.length > 0 ? (
                                    <ul className="space-y-3">
                                        {data.promoter_flags.map((flag, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm text-gray-300 bg-accent-danger/10 border border-accent-danger/20 rounded-lg p-3">
                                                <AlertTriangle className="w-4 h-4 text-accent-danger shrink-0 mt-0.5" />
                                                {flag}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="flex items-center gap-2 text-sm text-accent-success bg-accent-success/10 border border-accent-success/20 rounded-lg p-4">
                                        <CheckCircle2 className="w-5 h-5" />
                                        No significant risk flags detected for promoters.
                                    </div>
                                )}
                            </div>

                            {/* Document Upload & Deep Analysis */}
                            <div className="glass-panel p-6">
                                <div className="flex items-center gap-2 mb-4 text-lg font-medium text-white border-b border-white/10 pb-4">
                                    <FileText className="w-5 h-5 text-cyan-400" />
                                    Custom Deep Dive
                                </div>
                                <p className="text-sm text-gray-400 mb-4">
                                    Upload confidential financials or specific notices for custom risk analysis regarding {companyName}.
                                </p>

                                <div className="relative group mb-4">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary to-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                                    <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl hover:bg-white/5 hover:border-accent-primary/50 transition-all cursor-pointer bg-background">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            {isUploading ? (
                                                <RefreshCcw className="w-8 h-8 text-accent-primary animate-spin mb-2" />
                                            ) : (
                                                <UploadCloud className="w-8 h-8 text-gray-400 mb-2 group-hover:text-accent-primary transition-colors" />
                                            )}
                                            <p className="text-sm text-gray-400">
                                                {isUploading ? "Extracting insights..." : <span className="font-semibold text-gray-300">Click to upload</span>}
                                            </p>
                                        </div>
                                        <input type="file" className="hidden" multiple accept=".pdf,.xml,.json,.txt" onChange={handleFileUpload} />
                                    </label>
                                </div>

                                {uploadResult && (
                                    <div className="space-y-4">
                                        <div className="bg-accent-success/10 text-accent-success text-xs p-3 rounded-lg border border-accent-success/20 flex items-center justify-between">
                                            <span>Data extracted successfully.</span>
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>

                                        <button
                                            onClick={handleRunAnalysis}
                                            disabled={isAnalyzing}
                                            className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2"
                                        >
                                            {isAnalyzing ? (
                                                <><RefreshCcw className="w-4 h-4 animate-spin" /> Analyzing Risk...</>
                                            ) : (
                                                <>Run Financial Risk Analysis <ArrowRight className="w-4 h-4" /></>
                                            )}
                                        </button>
                                    </div>
                                )}

                                {/* Analysis Results Display */}
                                {analysisResult && (
                                    <div className="mt-4 pt-4 border-t border-white/10">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-sm text-gray-400">Calculated Risk Score</span>
                                            <span className={`text-xl font-bold ${analysisResult.risk_score > 60 ? 'text-accent-danger' : analysisResult.risk_score > 30 ? 'text-accent-warning' : 'text-accent-success'}`}>
                                                {analysisResult.risk_score}/100
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-sm text-gray-400">Default Probability</span>
                                            <span className="font-medium text-gray-200">{analysisResult.simulated_default_prob_percent}%</span>
                                        </div>

                                        {analysisResult.risk_factors && analysisResult.risk_factors.length > 0 && (
                                            <div className="space-y-2">
                                                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Key Factors</span>
                                                {analysisResult.risk_factors.slice(0, 2).map((factor: any, idx: number) => (
                                                    <div key={idx} className="bg-white/5 rounded-lg p-2 text-xs border border-white/10">
                                                        <div className="text-gray-300 font-medium">{factor.flag}</div>
                                                        <div className="text-gray-500 mt-1 line-clamp-2">{factor.description}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
