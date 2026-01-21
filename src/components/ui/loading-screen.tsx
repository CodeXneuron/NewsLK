"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export function LoadingScreen() {
    const [isVisible, setIsVisible] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Smooth progress animation
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 5;
            });
        }, 50);

        // Hide loading screen after animation completes
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2500);

        return () => {
            clearInterval(progressInterval);
            clearTimeout(timer);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Subtle background glow */}
            <div className="absolute inset-0 overflow-hidden opacity-30">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-red-600/30 to-orange-600/30 rounded-full blur-3xl animate-pulse"></div>
            </div>

            {/* Main content */}
            <div className="relative flex flex-col items-center justify-center gap-6 px-4">
                {/* Spinner */}
                <div className="relative">
                    <Loader2 className="w-16 h-16 text-red-500 animate-spin" strokeWidth={2.5} />
                    <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
                </div>

                {/* Brand */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl md:text-5xl font-bold text-white">
                        NewsLK
                    </h1>
                    <p className="text-white/50 text-sm font-medium tracking-wide uppercase">
                        Loading News
                    </p>
                </div>

                {/* Progress bar */}
                <div className="w-64 space-y-2">
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-200 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="text-center">
                        <span className="text-white/30 text-xs font-mono">{progress}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
