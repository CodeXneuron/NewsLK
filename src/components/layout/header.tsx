"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { RefreshCw, Search, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/icons/logo";
import Link from 'next/link';
import { useState, useEffect } from "react";
import { getCurrentWeather, type WeatherData } from "@/lib/weather-api";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const data = await getCurrentWeather();
      if (data) {
        setWeather(data);
      }
    };
    fetchWeather();

    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-14 sm:h-16 items-center gap-2 sm:gap-4 px-3 sm:px-4 md:px-6">
        {/* Mobile Menu + Logo */}
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <Link href="/" className="flex items-center group" aria-label="NewsLK Home">
            <Logo className="transition-transform group-hover:scale-105" />
          </Link>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search breaking news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50 border-muted-foreground/20 focus-visible:ring-red-600 focus-visible:border-red-600 transition-all"
            />
          </div>
        </form>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden min-w-[44px] min-h-[44px]"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Weather Button - Icon only on mobile, with temp on larger screens */}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="flex items-center gap-2 hover:bg-blue-500/10 hover:text-blue-600 transition-all min-w-[44px] min-h-[44px]"
          >
            <Link href="/weather">
              <Cloud className="h-5 w-5" />
              {weather && (
                <span className="font-semibold hidden sm:inline">{weather.temperature}°C</span>
              )}
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Refresh news feed"
            onClick={() => window.location.reload()}
            className="min-w-[44px] min-h-[44px]"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
