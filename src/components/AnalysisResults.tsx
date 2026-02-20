import { AppData } from "@/lib/itunes-api";
import Image from "next/image";

interface AnalysisResultsProps {
    results: AppData[];
}

export default function AnalysisResults({ results }: AnalysisResultsProps) {
    if (results.length === 0) return null;

    return (
        <section className="w-full max-w-6xl mx-auto mb-24 px-4 mt-12">
            <div className="flex justify-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900">
                    Market Analysis
                </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {results.map((app) => (
                    <div key={app.trackId} className="group relative bg-white border border-slate-200 rounded-xl p-4 hover:border-primary/50 hover:shadow-lg transition-all">
                        <div className="relative aspect-square mb-4 overflow-hidden rounded-[22%] bg-slate-100 block shadow-inner">
                            <Image
                                src={app.artworkUrl512}
                                alt={app.trackName}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                unoptimized
                            />
                        </div>
                        <h3 className="font-semibold text-sm truncate mb-1 text-slate-900" title={app.trackName}>{app.trackName}</h3>
                        <div className="flex flex-wrap gap-1">
                            {app.genres?.slice(0, 2).map((genre) => (
                                <span key={genre} className="text-[10px] uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                    {genre}
                                </span>
                            ))}
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                            <span>⭐ {app.averageUserRating?.toFixed(1) || "N/A"}</span>
                            <span>({app.userRatingCount?.toLocaleString() || 0})</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
