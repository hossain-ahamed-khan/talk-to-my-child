"use client";
import * as React from "react";
import {
    House,
    Users,
    History,
    Settings,
    Zap,
} from "lucide-react";
import { usePathname } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarRail,
    SidebarFooter,
    useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import mainLogo from "@/public/images/main-logo.png";

// Nav item matching TalkToMyChild sidebar style
function NavItem({
    item,
    isActive,
    isCollapsed,
}: {
    item: { title: string; url: string; icon: React.ElementType };
    isActive: boolean;
    isCollapsed: boolean;
}) {
    const Icon = item.icon;
    return (
        <SidebarMenuItem>
            <Link
                href={item.url}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${isCollapsed ? "justify-center px-2" : ""
                    } ${isActive
                        ? "bg-[#1b4648] text-white"
                        : "text-[#8b9ab0] hover:bg-[#1b4648] hover:text-white"
                    }`}
            >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-[#8b9ab0]"}`} />
                {!isCollapsed && (
                    <span className="font-medium text-[14px]">{item.title}</span>
                )}
            </Link>
        </SidebarMenuItem>
    );
}

// Navigation data matching the image
const data = {
    nav: [
        { title: "Home", url: "/child", icon: House },
        { title: "Characters", url: "/child/characters", icon: Users },
        { title: "History", url: "/child/history", icon: History },
        { title: "Achievement", url: "/child/achievement", icon: Zap },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";

    return (
        <Sidebar
            collapsible="icon"
            {...props}
            className="border-r-0"
            style={{ background: "#1e293b" } as React.CSSProperties}
        >
            {/* Header: Logo + App Name */}
            <SidebarHeader className="px-4 py-4">
                <div className="w-full">
                    <div className="w-full overflow-hidden">
                        <Image
                            src={mainLogo}
                            alt="TalkToMyChild logo"
                            className="h-auto w-full object-contain"
                            priority
                        />
                    </div>
                </div>
            </SidebarHeader>

            {/* Nav items */}
            <SidebarContent className="px-2">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-2">
                            {data.nav.map((item) => (
                                <NavItem
                                    key={item.title}
                                    item={item}
                                    isActive={pathname === item.url}
                                    isCollapsed={isCollapsed}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer: Current Balance + User Profile */}
            <SidebarFooter className="px-3 pb-4 space-y-3">
                {!isCollapsed && (
                    /* Current Balance card */
                    <div className="rounded-2xl p-3.5" style={{ background: "#1a2535" }}>
                        <div className="text-[10px] font-semibold uppercase tracking-widest mb-2"
                            style={{ color: "#4ade80" }}>
                            Current Balance
                        </div>
                        <div className="flex items-end justify-between mb-2">
                            <span className="text-white font-bold text-2xl">124</span>
                            <span className="text-[#8b9ab0] text-[11px]">AI Credits</span>
                        </div>
                        {/* Progress bar */}
                        <div className="h-1.5 rounded-full mb-1.5" style={{ background: "#2d3f55" }}>
                            <div className="h-full rounded-full" style={{ width: "62%", background: "linear-gradient(90deg, #10b981, #4ade80)" }} />
                        </div>
                        <div className="text-[10px]" style={{ color: "#6b7a8d" }}>Resets on Nov 24, 2023</div>
                    </div>
                )}

                {/* User profile row */}
                <div className={`flex items-center rounded-xl p-2 transition-colors hover:bg-white/5 cursor-pointer ${isCollapsed ? "justify-center" : "justify-between"}`}>
                    <div className="flex items-center gap-2.5">
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full shrink-0 overflow-hidden"
                            style={{ background: "linear-gradient(135deg, #f97316, #ec4899)" }}>
                            <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">S</div>
                        </div>
                        {!isCollapsed && (
                            <div>
                                <div className="text-white font-semibold text-[13px]">Sarah Jenkins</div>
                                <div className="text-[#4ade80] text-[11px]">Premium Member</div>
                            </div>
                        )}
                    </div>
                    {!isCollapsed && (
                        <button className="text-[#8b9ab0] hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                            <Settings className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}