"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import SearchSection from "@/components/SearchSection";
import AnalysisResults from "@/components/AnalysisResults";
import TrendAnalysis, { TrendData } from "@/components/TrendAnalysis";
import GeneratorSection from "@/components/GeneratorSection";
import { searchApps, AppData } from "@/lib/itunes-api";
import { analyzeTrends } from "@/app/actions";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [results, setResults] = useState<AppData[]>([]);
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (term: string) => {
    setIsSearching(true);
    setHasSearched(true);
    setTrendData(null); // Reset previous trends

    try {
      // 1. Fetch apps first to pass to trend analysis
      const appData = await searchApps(term);
      setResults(appData.results);

      // 2. Map results to simplified objects for analysis (to save token usage)
      const appsForAnalysis = appData.results.map(app => ({
        id: app.trackId,
        name: app.trackName
      }));

      // 3. Analyze trends with the apps context
      const trends = await analyzeTrends(term, appsForAnalysis);
      setTrendData(trends);
    } catch (error) {
      console.error("Search failed:", error);
      // In a real app, we'd show a toast or error message here
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-primary/20 pb-20">

      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="relative z-10 px-4">
        <nav className="flex items-center justify-between max-w-7xl mx-auto py-6 mb-10">
          <div className="text-xl font-bold tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-700 rounded-lg flex items-center justify-center text-white font-mono shadow-lg shadow-purple-200">
              A
            </div>
            <span className="text-slate-900">AppIcon<span className="text-primary">.ai</span></span>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
            <a href="#analysis" className="hover:text-primary transition-colors">Analysis</a>
            <a href="#generator" className="hover:text-primary transition-colors">Generator</a>
          </div>
        </nav>

        <Hero />

        <SearchSection onSearch={handleSearch} isSearching={isSearching} />

        {isSearching && (
          <div className="flex justify-center my-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {hasSearched && !isSearching && (
          <div id="analysis" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <AnalysisResults results={results} />
            {trendData && <TrendAnalysis data={trendData} term={results[0]?.genres[0] || "App"} apps={results} />}
          </div>
        )}

        <div className="my-32 border-t border-slate-100 w-full max-w-7xl mx-auto"></div>

        <GeneratorSection />

        <footer className="max-w-7xl mx-auto pt-10 border-t border-slate-100 text-center text-slate-400 text-sm pb-10">
          <p>© SNOW Design</p>
        </footer>
      </div>
    </main>
  );
}
