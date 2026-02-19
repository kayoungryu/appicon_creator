"use client";

import { Wand2, RefreshCw, AlertCircle } from "lucide-react";
import { useState } from "react";
import { generateIcon } from "@/app/actions";
import Image from "next/image";

export default function GeneratorSection() {
    const [motif, setMotif] = useState("");
    const [color, setColor] = useState("#8b5cf6");
    const [secondaryColor, setSecondaryColor] = useState("#ffffff");
    const [style, setStyle] = useState("Minimalist");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [referenceImageBase64, setReferenceImageBase64] = useState<string | undefined>(undefined);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setReferenceImageBase64(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setReferenceImageBase64(undefined);
        }
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const result = await generateIcon(motif, style, color, secondaryColor, referenceImageBase64);
            if (result.success && result.imageUrl) {
                setGeneratedImage(result.imageUrl);
            } else {
                setError(result.error || "Failed to generate icon");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <section className="w-full max-w-6xl mx-auto mb-32 px-4 scroll-mt-20" id="generator">
            <div className="grid md:grid-cols-2 gap-12 items-start">

                {/* Controls */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
                        <span className="text-primary">02.</span> Icon Studio
                    </h2>

                    <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-6 shadow-xl shadow-slate-200/50">

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600">Core Motif / Subject</label>
                            <input
                                type="text"
                                value={motif}
                                onChange={(e) => setMotif(e.target.value)}
                                placeholder="e.g. Fox, Rocket, Chat Bubble"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:border-primary focus:outline-none transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600">Primary Color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="h-10 w-10 rounded cursor-pointer bg-transparent border-none p-0"
                                    />
                                    <span className="text-slate-500 font-mono text-sm uppercase">{color}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600">Secondary Color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={secondaryColor}
                                        onChange={(e) => setSecondaryColor(e.target.value)}
                                        className="h-10 w-10 rounded cursor-pointer bg-transparent border-none p-0"
                                    />
                                    <span className="text-slate-500 font-mono text-sm uppercase">{secondaryColor}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600">Design Style</label>
                            <div className="grid grid-cols-2 gap-2">
                                {["Minimalist", "3D Render", "Neon Glow", "Paper Cut", "Gradient", "Pixel Art"].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setStyle(s)}
                                        className={`px-4 py-2 text-sm rounded-lg border transition-all ${style === s
                                            ? "bg-primary/10 border-primary text-primary"
                                            : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600">Reference Image (Optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                            />
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !motif}
                            className="w-full py-4 bg-gradient-to-r from-primary to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                            {isGenerating ? "Designing..." : "Generate Icon"}
                        </button>
                    </div>
                </div>

                {/* Preview Area */}
                <div className="relative aspect-square md:aspect-auto md:h-full min-h-[400px] bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center overflow-hidden">

                    {!isGenerating && !generatedImage ? (
                        <div className="text-center space-y-4 relative z-10 p-8">
                            <div className="w-32 h-32 mx-auto bg-white rounded-3xl border border-slate-200 flex items-center justify-center shadow-lg">
                                <div className="w-20 h-20 rounded-2xl bg-slate-100"></div>
                            </div>
                            <p className="text-slate-400 text-sm">Preview will appear here</p>
                        </div>
                    ) : isGenerating ? (
                        <div className="text-center space-y-4 relative z-10">
                            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-slate-500 animate-pulse">Dreaming up ideas based on &quot;{motif}&quot;...</p>
                        </div>
                    ) : (
                        <div className="relative w-full h-full p-8 flex items-center justify-center z-10">
                            <div className="relative w-64 h-64 md:w-80 md:h-80 shadow-2xl rounded-3xl overflow-hidden border border-slate-200">
                                <Image
                                    src={generatedImage!}
                                    alt={`Generated icon for ${motif}`}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                            <div className="absolute bottom-4 right-4 space-x-2">
                                <a
                                    href={generatedImage!}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/80 backdrop-blur hover:bg-slate-50 text-slate-900 text-xs px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
                                >
                                    Download High-Res
                                </a>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}
