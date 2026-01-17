"use client";

import { useEffect, useState } from "react";

export function LoadingScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Hide loading screen after a short delay
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-900 animate-fade-in">
            <div className="flex flex-col items-center gap-6">
                {/* Animated Logo */}
                <div className="relative animate-pulse-slow">
                    <svg
                        viewBox="0 0 200 80"
                        className="h-20 w-auto"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <linearGradient id="loadingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: '#DC2626', stopOpacity: 1 }}>
                                    <animate attributeName="stop-color" values="#DC2626; #EF4444; #DC2626" dur="2s" repeatCount="indefinite" />
                                </stop>
                                <stop offset="100%" style={{ stopColor: '#991B1B', stopOpacity: 1 }}>
                                    <animate attributeName="stop-color" values="#991B1B; #DC2626; #991B1B" dur="2s" repeatCount="indefinite" />
                                </stop>
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Play Button Icon */}
                        <g filter="url(#glow)">
                            <rect x="5" y="15" width="50" height="50" rx="8" fill="url(#loadingGradient)" />
                            <path d="M 22 28 L 22 52 L 42 40 Z" fill="white">
                                <animateTransform
                                    attributeName="transform"
                                    type="scale"
                                    values="1; 1.1; 1"
                                    dur="1s"
                                    repeatCount="indefinite"
                                    additive="sum"
                                />
                            </path>
                        </g>

                        {/* LIVE Text Box */}
                        <g filter="url(#glow)">
                            <rect x="65" y="15" width="130" height="50" rx="8" fill="url(#loadingGradient)" />
                            <text x="130" y="50" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fill="white" textAnchor="middle">
                                LIVE
                            </text>
                        </g>
                    </svg>
                </div>

                {/* Loading Text */}
                <div className="flex flex-col items-center gap-2">
                    <p className="text-white text-lg font-semibold animate-pulse">
                        Loading News...
                    </p>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
