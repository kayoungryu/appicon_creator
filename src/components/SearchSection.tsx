"use client";

import { Search, Loader2 } from "lucide-react";
import { useState } from "react";

interface SearchSectionProps {
    onSearch: (term: string) => Promise<void>;
    isSearching: boolean;
}

export default function SearchSection({ onSearch, isSearching }: SearchSectionProps) {
    const [term, setTerm] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (term.trim()) {
            onSearch(term);
        }
    };

    return (
        <section className="w-full max-w-2xl mx-auto mb-16 px-4">
            <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl group-hover:bg-primary/30 transition-all opacity-0 group-hover:opacity-100" />
                <div className="relative flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:border-primary/50 shadow-xl shadow-slate-200/50 transition-colors">
                    <Search className="w-5 h-5 text-slate-400 ml-4" />
                    <input
                        type="text"
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        placeholder="앱스토어 키워드를 검색해보세요 (예: 데이팅, 가계부, 피트니스)"
                        className="w-full bg-transparent px-4 py-4 text-slate-900 placeholder-slate-400 focus:outline-none"
                    />
                    <button
                        type="submit"
                        disabled={isSearching}
                        className="mr-2 px-4 py-2 bg-primary hover:bg-primary/90 font-semibold text-white text-sm rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
                    </button>
                </div>
            </form>
        </section>
    );
}
