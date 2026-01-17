"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/icons/logo";
import Link from 'next/link';
import { useState } from "react";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        {/* Mobile Menu + Logo */}
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <Link href="/" className="flex items-center gap-3 group">
            <Logo className="transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <h1 className="font-headline text-xl md:text-2xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-orange-600 bg-clip-text text-transparent">
                NewsLK Live
              </h1>
              <p className="text-[10px] md:text-xs text-muted-foreground hidden sm:block font-medium">
                Breaking News from Sri Lanka
              </p>
            </div>
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
            className="md:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Refresh news feed"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
