import { FileText, Link as LinkIcon, ExternalLink } from "lucide-react";

export interface Evidence {
  source_document?: string;
  source_name?: string;
  page_number?: number | null;
  url?: string | null;
  snippet: string;
}

export function EvidenceViewer({ evidence }: { evidence: Evidence }) {
  if (!evidence) return null;

  const isWebSource = !!evidence.url || !!evidence.source_name;
  const sourceTitle = evidence.source_document || evidence.source_name || "Unknown Source";

  return (
    <div className="mt-3 p-4 rounded-lg bg-background border border-accent-secondary/30 relative overflow-hidden animate-in fade-in slide-in-from-top-2">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-secondary"></div>
      
      <div className="flex items-center gap-2 mb-2 text-xs font-medium text-accent-secondary">
        {isWebSource ? <LinkIcon size={14} /> : <FileText size={14} />}
        <span>EVIDENCE SOURCE: {sourceTitle}</span>
        {evidence.page_number && (
          <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] ml-2 text-white">
            Page {evidence.page_number}
          </span>
        )}
      </div>
      
      <div className="pl-6 border-l-2 border-slate-700/50 my-2">
        <p className="text-sm text-slate-300 italic">
          "{evidence.snippet}"
        </p>
      </div>
      
      {evidence.url && (
        <a 
          href={evidence.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-accent-secondary hover:text-white transition-colors mt-2"
        >
          View Source URL <ExternalLink size={12} />
        </a>
      )}
    </div>
  );
}
