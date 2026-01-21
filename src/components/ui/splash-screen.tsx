"use client";

import { useEffect, useState } from "react";
import { LoadingScreen } from "@/components/ui/loading-screen";

interface SplashScreenProps {
    children: React.ReactNode;
}

export function SplashScreen({ children }: SplashScreenProps) {
    const [showSplash, setShowSplash] = useState(true);
    const [isFirstVisit, setIsFirstVisit] = useState(false);

    useEffect(() => {
        // Check if this is the first visit
        const hasVisited = sessionStorage.getItem('hasVisited');

        if (!hasVisited) {
            // First visit - show splash screen
            setIsFirstVisit(true);
            sessionStorage.setItem('hasVisited', 'true');

            // Hide splash screen after 2.5 seconds
            const timer = setTimeout(() => {
                setShowSplash(false);
            }, 2500);

            return () => clearTimeout(timer);
        } else {
            // Not first visit - don't show splash
            setShowSplash(false);
        }
    }, []);

    // Show splash screen only on first visit
    if (isFirstVisit && showSplash) {
        return <LoadingScreen />;
    }

    return <>{children}</>;
}
