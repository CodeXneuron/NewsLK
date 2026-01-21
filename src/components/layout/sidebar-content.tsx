import { Home, Newspaper, Building2, Trophy, Briefcase, Cpu, Tv, Mail } from "lucide-react";
import Link from "next/link";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
} from "@/components/ui/sidebar";
import { TrendingTopics } from "@/components/trending/trending-topics";
import { SidebarWeatherWidget } from "@/components/weather/sidebar-weather-widget";
import { Logo } from "@/components/icons/logo";

const navigation = [
    { name: "All News", href: "/", icon: Home },
];

const categories = [
    { name: "Breaking News", href: "/?category=Breaking%20News", icon: Newspaper },
    { name: "Politics", href: "/?category=Politics", icon: Building2 },
    { name: "Sports", href: "/?category=Sports", icon: Trophy },
    { name: "Business", href: "/?category=Business", icon: Briefcase },
    { name: "Technology", href: "/?category=Technology", icon: Cpu },
    { name: "Entertainment", href: "/?category=Entertainment", icon: Tv },
];

export function SidebarContentComponent() {
    return (
        <Sidebar>
            {/* Header with Logo */}
            <SidebarHeader className="p-4 border-b border-border/50">
                <Link href="/" className="flex items-center gap-3 group">
                    <Logo className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                    <div>
                        <h1 className="text-lg font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                            NewsLK
                        </h1>
                        <p className="text-xs text-muted-foreground">Sri Lanka's News Hub</p>
                    </div>
                </Link>
            </SidebarHeader>

            <SidebarContent>
                {/* Navigation */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                        Navigation
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigation.map((item) => (
                                <SidebarMenuItem key={item.name}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.href} className="flex items-center gap-3 text-slate-200 hover:text-white">
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Categories */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                        Categories
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {categories.map((item) => (
                                <SidebarMenuItem key={item.name}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.href} className="flex items-center gap-3 text-slate-200 hover:text-white">
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Compact Weather */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarWeatherWidget />
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Trending Topics */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <TrendingTopics />
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter className="p-4 border-t border-border/50">
                <div className="text-center">
                    <p className="text-xs text-slate-400">
                        © 2024 NewsLK. All rights reserved.
                    </p>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
