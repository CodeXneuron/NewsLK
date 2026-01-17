"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import {
  Home,
  Bookmark,
  Settings,
  LogIn,
  LogOut,
  UserPlus,
  Newspaper,
  Globe,
  Landmark,
  Clapperboard,
  Trophy,
  AlertTriangle,
  Briefcase,
  Cpu,
  Heart,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { auth } from "@/lib/firebase/config";
import { ALL_CATEGORIES } from "@/types";
import { Separator } from "@/components/ui/separator";
import type { NewsCategory } from "@/types";

const categoryIcons: Record<NewsCategory, React.ElementType> = {
  'Breaking News': AlertTriangle,
  'Politics': Landmark,
  'Sports': Trophy,
  'Entertainment': Clapperboard,
  'Local News': Newspaper,
  'International': Globe,
  'Business': Briefcase,
  'Technology': Cpu,
  'Lifestyle': Heart,
};

export function SidebarContentComponent() {
  const pathname = usePathname();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isActive = (path: string) => pathname === path;
  const isCategoryActive = (category: string) => pathname === `/category/${category.toLowerCase().replace(' ', '-')}`;

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 p-4">
          <h2 className="font-headline text-lg font-bold text-foreground">
            Menu
          </h2>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/")}>
              <Link href="/">
                <Home />
                All News
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {user && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/bookmarks")}>
                <Link href="/bookmarks">
                  <Bookmark />
                  Bookmarks
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>

        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarMenu>
            {ALL_CATEGORIES.map((category) => {
              const Icon = categoryIcons[category];
              return (
                <SidebarMenuItem key={category}>
                  <SidebarMenuButton
                    asChild
                    isActive={isCategoryActive(category)}
                  >
                    <Link href={`/?category=${encodeURIComponent(category)}`}>
                      <Icon />
                      {category}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/settings")}>
              <Link href="/settings">
                <Settings />
                Settings
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {user ? (
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <LogOut />
                Logout
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/login")}>
                  <Link href="/login">
                    <LogIn />
                    Login
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/signup")}>
                  <Link href="/signup">
                    <UserPlus />
                    Sign Up
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
