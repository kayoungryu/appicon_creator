"use client";

import { Wand2, RefreshCw, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { generateIcon } from "@/app/actions";
import Image from "next/image";

interface GeneratorSectionProps {
    initialMotif?: string;
}

export default function GeneratorSection({ initialMotif = "" }: GeneratorSectionProps) {
    const [motif, setMotif] = useState(initialMotif);

    // Update local state if prop changes
    useEffect(() => {
        if (initialMotif) {
            setMotif(initialMotif);
            // Scroll to generator when clicked
            const el = document.getElementById('generator');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [initialMotif]);

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
            <div className="flex justify-center mb-10">
                <h2 className="font-[family-name:var(--font-montserrat)] text-3xl font-bold text-slate-900">
                    Icon Studio
                </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-stretch">

                {/* Controls */}
                <div className="flex flex-col h-full">

                    <div className="flex-1 bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between">
                        <div className="space-y-8">

                            <div className="space-y-3">
                                <label className="font-[family-name:var(--font-montserrat)] text-sm font-medium text-slate-600 block mb-1">Core Motif / Subject</label>
                                <input
                                    type="text"
                                    value={motif}
                                    onChange={(e) => setMotif(e.target.value)}
                                    placeholder="예: 여우, 로켓, 말풍선"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:border-primary focus:outline-none transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <label className="font-[family-name:var(--font-montserrat)] text-sm font-medium text-slate-600 block mb-1">Primary Color</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={color}
                                            onChange={(e) => setColor(e.target.value)}
                                            className="h-10 w-10 cursor-pointer bg-transparent border-none p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border [&::-webkit-color-swatch]:border-slate-200 [&::-webkit-color-swatch]:rounded-full [&::-moz-color-swatch]:border [&::-moz-color-swatch]:border-slate-200 [&::-moz-color-swatch]:rounded-full"
                                        />
                                        <span className="text-slate-500 font-mono text-sm uppercase">{color}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="font-[family-name:var(--font-montserrat)] text-sm font-medium text-slate-600 block mb-1">Secondary Color</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={secondaryColor}
                                            onChange={(e) => setSecondaryColor(e.target.value)}
                                            className="h-10 w-10 cursor-pointer bg-transparent border-none p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border [&::-webkit-color-swatch]:border-slate-200 [&::-webkit-color-swatch]:rounded-full [&::-moz-color-swatch]:border [&::-moz-color-swatch]:border-slate-200 [&::-moz-color-swatch]:rounded-full"
                                        />
                                        <span className="text-slate-500 font-mono text-sm uppercase">{secondaryColor}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="font-[family-name:var(--font-montserrat)] text-sm font-medium text-slate-600 block mb-1">Design Style</label>
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

                            <div className="space-y-3">
                                <label className="font-[family-name:var(--font-montserrat)] text-sm font-medium text-slate-600 block mb-1">Reference Image (Optional)</label>
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
                                className="font-[family-name:var(--font-montserrat)] w-full py-4 bg-gradient-to-r from-primary to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center mt-6"
                            >
                                {isGenerating ? "Designing..." : "Generate Icon"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Preview Area */}
                <div className="relative aspect-square md:aspect-auto md:h-full min-h-[400px] bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden">

                    {!isGenerating && !generatedImage ? (
                        <div className="relative w-[150px] h-[150px] bg-white rounded-[22%] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]"></div>
                    ) : isGenerating ? (
                        <div className="text-center space-y-4 relative z-10">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
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
