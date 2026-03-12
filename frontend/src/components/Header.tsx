"use client";

import { Bell, Search, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Header({ className = "" }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        setShowDropdown(false);
        return;
      }

      setIsSearching(true);
      setShowDropdown(true);

      try {
        const res = await fetch(`http://localhost:8000/api/research/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSelect = (company: string) => {
    setQuery(company);
    setShowDropdown(false);
    router.push(`/company/${encodeURIComponent(company)}`);
  };

  return (
    <header className={`relative z-[100] glass-panel border-x-0 border-t-0 rounded-none flex items-center justify-between px-6 ${className}`}>
      <div className="flex-1 max-w-xl">
        <div className="relative group" ref={dropdownRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-accent-primary transition-colors" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (query.length >= 2) setShowDropdown(true); }}
            placeholder="Search companies by name..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent-primary/50 focus:bg-white/10 transition-all shadow-inner"
          />

          {/* Autocomplete Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0B1120]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 transform origin-top transition-all">
              {isSearching ? (
                <div className="p-4 flex items-center justify-center text-gray-400 text-sm">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Fetching options...
                </div>
              ) : results.length > 0 ? (
                <ul className="max-h-64 overflow-y-auto">
                  {results.map((comp, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleSelect(comp)}
                      className="px-4 py-3 text-sm text-gray-200 hover:bg-white/10 hover:text-white cursor-pointer transition-colors border-b border-white/5 last:border-0"
                    >
                      <Search className="w-3 h-3 inline-block mr-2 opacity-50" />
                      {comp}
                    </li>
                  ))}
                </ul>
              ) : query.length >= 2 ? (
                <div className="p-4 text-center text-gray-400 text-sm">
                  No company found matching &quot;{query}&quot;
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 ml-4">
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-danger rounded-full shadow-[0_0_8px_hsl(var(--accent-danger))]" />
        </button>
      </div>
    </header>
  );
}
