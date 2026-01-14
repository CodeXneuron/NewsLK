"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons/logo";
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <h1 className="font-headline text-xl font-bold text-foreground">
            LankaNow
          </h1>
        </Link>
      </div>
      <div className="ml-auto">
        <Button variant="ghost" size="icon" aria-label="Refresh news feed" onClick={() => window.location.reload()}>
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
