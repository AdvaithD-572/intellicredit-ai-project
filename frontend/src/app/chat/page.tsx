"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, FileText, CornerDownRight } from "lucide-react";

export default function ChatPage() {
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I am your IntelliCredit AI Analyst. I have processed the uploaded Annual Reports and Financials for Acme Corp. Ask me any questions, like 'What is the company's total debt?' or 'Are there any legal disputes?'"
    }
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query;
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setQuery("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let aiResponse = "I'm analyzing the documents...";
      
      const q = userMsg.toLowerCase();
      if (q.includes("debt") || q.includes("liabilities")) {
        aiResponse = "Based on the FY23 Balance Sheet, Acme Corp's total debt is ₹22 Crore. The debt-to-equity ratio is currently 1.8, which is slightly above the industry average of 1.2.";
      } else if (q.includes("legal") || q.includes("dispute") || q.includes("court")) {
        aiResponse = "I found 4 active litigation cases in the e-Courts database linked to Acme Corp. The most critical one is a civil dispute regarding vendor payment delays filed 1 month ago.";
      } else if (q.includes("revenue") || q.includes("profit")) {
        aiResponse = "The total revenue for FY23 was ₹48 Crore with a net profit of ₹6.2 Crore. However, please note that revenue has declined by 12% over the last two years.";
      } else {
        aiResponse = "Based on the processed documents, the operational history spans 15 years with strong GST compliance, though recent financial health shows some stress indicators.";
      }

      setMessages(prev => [...prev, { role: "assistant", content: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-in">
      <header className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Document Chat</h1>
        <p className="text-slate-400 mt-1">Ask questions directly against the ingested corporate data.</p>
      </header>

      <div className="flex-1 glass-card overflow-hidden flex flex-col border-accent-secondary/20 relative">
        {/* Chat History */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-accent-secondary/20 flex items-center justify-center shrink-0 border border-accent-secondary/40">
                  <Bot size={18} className="text-accent-secondary" />
                </div>
              )}

              <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-accent-primary text-black rounded-tr-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                  : 'bg-white/5 border border-white/10 rounded-tl-sm text-slate-200'
              }`}>
                {msg.content}
                {msg.role === 'assistant' && i !== 0 && (
                  <div className="mt-3 pt-2 border-t border-white/10 flex items-center gap-2 text-xs text-slate-400">
                    <FileText size={12} />
                    <span>Source: FY23_Balance_Sheet.pdf (Page 14)</span>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                  <User size={18} className="text-white" />
                </div>
              )}

            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4 justify-start">
              <div className="w-8 h-8 rounded-full bg-accent-secondary/20 flex items-center justify-center shrink-0 border border-accent-secondary/40">
                <Bot size={18} className="text-accent-secondary" />
              </div>
              <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-background/50 backdrop-blur-md border-t border-white/10">
          <form onSubmit={handleSend} className="relative max-w-4xl mx-auto">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about revenue trends, litigation, debt..." 
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-6 pr-14 text-white focus:outline-none focus:border-accent-secondary/50 focus:bg-white/10 transition-all shadow-inner"
            />
            <button 
              type="submit"
              disabled={!query.trim() || isTyping}
              className="absolute right-2 top-2 p-2.5 bg-accent-secondary text-background rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_15px_rgba(59,130,246,0.4)]"
            >
              <Send size={18} />
            </button>
          </form>
          <div className="text-center mt-2 flex items-center justify-center gap-1 text-xs text-slate-500">
            <CornerDownRight size={12} /> Press Enter to send
          </div>
        </div>
      </div>
    </div>
  );
}
