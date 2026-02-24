import { Sparkles, TrendingUp, Palette, Lightbulb, Tag } from "lucide-react";
import Image from "next/image";
import { AppData } from "@/lib/itunes-api"; // We need this to look up app icons

export interface TrendData {
    dominantStyle: string;
    dominantStyleDescription: string;
    colorPsychology: string;
    colorPsychologyDescription: string;
    visualMetaphors: string;
    keywords: string[];
    appCoordinates: { id: number; x: number; y: number }[];
}

interface TrendAnalysisProps {
    data: TrendData;
    term: string;
    apps: AppData[]; // We need the full app data to get icons
    onKeywordClick?: (keyword: string) => void;
}

export default function TrendAnalysis({ data, term, apps, onKeywordClick }: TrendAnalysisProps) {
    if (!data) return null;

    return (
        <section className="w-full max-w-6xl mx-auto mb-20 px-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 relative overflow-hidden">

                <div className="relative z-10 space-y-8">
                    <h3 className="font-[family-name:var(--font-montserrat)] text-xl font-bold text-slate-900 flex justify-center items-center gap-2">
                        AI Trend Insights for &quot;{term}&quot;
                    </h3>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Text Analysis */}
                        <div className="flex flex-col justify-between space-y-6 h-full">
                            <div className="flex-1 p-6 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-start justify-center">
                                <h4 className="font-[family-name:var(--font-montserrat)] text-sm text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2 font-semibold">
                                    <TrendingUp className="w-4 h-4" /> Dominant Style
                                </h4>
                                <p className="text-lg font-medium text-slate-900 mb-2">{data.dominantStyle}</p>
                                <p className="text-slate-600 leading-relaxed text-sm">
                                    {data.dominantStyleDescription}
                                </p>
                            </div>

                            <div className="flex-1 p-6 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-start justify-center">
                                <h4 className="font-[family-name:var(--font-montserrat)] text-sm text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2 font-semibold">
                                    <Palette className="w-4 h-4" /> Color Psychology
                                </h4>
                                <p className="text-lg font-medium text-slate-900 mb-2">{data.colorPsychology}</p>
                                <p className="text-slate-600 leading-relaxed text-sm">
                                    {data.colorPsychologyDescription}
                                </p>
                            </div>

                            <div className="flex-1 p-6 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-start justify-center">
                                <h4 className="font-[family-name:var(--font-montserrat)] text-sm text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2 font-semibold">
                                    <Lightbulb className="w-4 h-4" /> Visual Metaphors
                                </h4>
                                <p className="text-slate-600 leading-relaxed text-sm">
                                    {data.visualMetaphors}
                                </p>
                            </div>
                        </div>

                        {/* Graph */}
                        <div className="bg-slate-50 rounded-xl p-6 relative h-full min-h-[500px] flex flex-col">
                            <h4 className="font-[family-name:var(--font-montserrat)] text-sm text-slate-500 uppercase tracking-widest mb-4 font-semibold text-center">
                                Competitive Landscape (30 Icons)
                            </h4>

                            {/* Chart Area */}
                            <div className="flex-1 relative border-l border-b border-slate-300 ml-12 mb-10 mr-6 mt-6">
                                {/* Axes Labels */}
                                <div className="absolute -left-12 top-0 bottom-0 flex items-center justify-center w-8 text-xs text-slate-400 font-medium tracking-wider whitespace-nowrap">
                                    <span className="-rotate-90">← Serious · Playful →</span>
                                </div>
                                <div className="absolute left-0 right-0 -bottom-8 flex items-center justify-center text-xs text-slate-400 font-medium tracking-wider">
                                    ← Classic · Modern →
                                </div>

                                {/* Grid Lines */}
                                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                                    <div className="border-r border-b border-slate-200/50"></div>
                                    <div className="border-b border-slate-200/50"></div>
                                    <div className="border-r border-slate-200/50"></div>
                                    <div></div>
                                </div>

                                {/* Plot Points */}
                                {data.appCoordinates?.map((point) => {
                                    const app = apps.find(a => a.trackId === point.id);
                                    if (!app) return null;

                                    return (
                                        <div
                                            key={point.id}
                                            className="absolute w-8 h-8 rounded-lg shadow-md border border-white transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-150 hover:z-50 cursor-pointer group"
                                            style={{
                                                left: `${point.x}%`,
                                                bottom: `${point.y}%`
                                            }}
                                            title={app.trackName}
                                        >
                                            <Image
                                                src={app.artworkUrl512}
                                                alt={app.trackName}
                                                fill
                                                className="rounded-lg object-cover"
                                                unoptimized
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-2 justify-center">
                        {data.keywords?.map((keyword, i) => (
                            <span
                                key={i}
                                onClick={() => onKeywordClick?.(keyword)}
                                className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20 flex items-center gap-1 cursor-pointer hover:bg-primary/20 transition-colors"
                            >
                                <Tag className="w-3 h-3" />
                                {keyword}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
