"use client";
import * as React from "react";
import {
    LayoutDashboard,
    Users,
    ChartColumn,
    Share2,
    Tag,
    TrendingUp,
    HandCoins,
    LifeBuoy,
    Settings,
    CircleHelp,
} from "lucide-react";
import { usePathname } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarRail,
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
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-200 ${isCollapsed ? "justify-center px-2" : ""
                    } ${isActive
                        ? "bg-[#123f4b] text-[#00d39f]"
                        : "text-[#5e7398] hover:bg-white/5 hover:text-[#7f92b4]"
                    }`}
            >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-[#00d39f]" : "text-[#5e7398]"}`} />
                {!isCollapsed && (
                    <span className="font-medium text-[31px] leading-none [zoom:0.45] [transform-origin:left_center]">
                        {item.title}
                    </span>
                )}
            </Link>
        </SidebarMenuItem>
    );
}

// Navigation data matching admin sidebar design
const data = {
    nav: [
        { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
        { title: "Staff Management", url: "/admin/staff-management", icon: Users },
        { title: "User Analytics", url: "/admin/user-analytics", icon: ChartColumn },
        { title: "Referrals", url: "/admin/referrals", icon: Share2 },
        { title: "Price Settings", url: "/admin/price-settings", icon: Tag },
        { title: "Financial Report", url: "/admin/financial-report", icon: TrendingUp },
        { title: "Revenue Reporting", url: "/admin/revenue-reporting", icon: HandCoins },
        { title: "Live Support Console", url: "/admin/live-support", icon: LifeBuoy },
    ],
    system: [
        { title: "Settings", url: "/admin/settings", icon: Settings },
        { title: "Support", url: "/admin/support", icon: CircleHelp },
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
            style={{ background: "#0f172a" } as React.CSSProperties}
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

            {/* Main nav items */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1.5">
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

                <SidebarGroup className="mt-4">
                    {!isCollapsed && (
                        <SidebarGroupLabel className="px-4 pb-2 text-[11px] font-semibold tracking-widest text-[#6f82a3] uppercase">
                            System
                        </SidebarGroupLabel>
                    )}
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1.5">
                            {data.system.map((item) => (
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

            <SidebarRail />
        </Sidebar>
    );
}