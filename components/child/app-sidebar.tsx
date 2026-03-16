"use client";
import * as React from "react";
import {
    ChevronDown,
    House,
    MessageSquare,
    UsersRound,
    Wrench,
    SquarePlus,
    GraduationCap,
    User
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
import {
    Tooltip,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import ChildMainLogo from "@/public/images/main-logo.png";

// Reusable nav item with tooltip support in collapsed state
function NavItem({
    item,
    isActive,
    isCollapsed,
}: {
    item: { title: string; url: string; icon: React.ElementType };
    isActive: boolean;
    isCollapsed: boolean;
    hasBadge?: boolean;
}) {
    const Icon = item.icon;
    return (
        <SidebarMenuItem>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href={item.url}
                        className={`flex items-center ${isCollapsed ? "justify-center px-0 py-2 w-full" : "justify-between px-4 py-3"
                            } rounded-lg text-sm transition-all duration-300 ease-in-out group ${isActive
                                ? "bg-linear-to-r from-[#EFF6FF] to-[#EFF6FF]/30 backdrop-blur-xl text-white font-medium border border-gray-400/50 shadow-lg shadow-gray-400/20"
                                : "text-gray-300 hover:bg-white/5 hover:backdrop-blur-sm hover:text-white hover:border hover:border-gray-400/30 hover:shadow-md hover:shadow-gray-400/10 border border-transparent"
                            }`}
                    >
                        <div className={`flex items-center ${isCollapsed ? "gap-0" : "gap-3"}`}>
                            <Icon
                                className={`w-5 h-5 shrink-0 transition-all duration-300 ${isActive ? "text-[#2563EB]" : "text-gray-400 group-hover:bg-[#EFF6FF]"
                                    }`}
                            />
                            {!isCollapsed && (
                                <span className={isActive ? "text-[#2563EB] font-inter font-semibold text-[14px] leading-[100%]" : "text-[#191919] font-inter font-semibold text-[14px] leading-[100%]"}>{item.title}</span>
                            )}
                        </div>
                    </Link>
                </TooltipTrigger>
            </Tooltip>
        </SidebarMenuItem>
    );
}

// Navigation data
const data = {
    home: [
        {
            title: "Home",
            url: "/trainer",
            icon: House,
        },
        {
            title: "Messages",
            url: "/trainer/message",
            icon: MessageSquare,
        },
        {
            title: "Forum",
            url: "/trainer/forum",
            icon: UsersRound,
        },
        {
            title: "Tools",
            url: "/trainer/tools",
            icon: Wrench,
        },
        {
            title: "New Course",
            url: "/trainer/new-course",
            icon: SquarePlus,
        },
        {
            title: "My Courses",
            url: "/trainer/my-courses",
            icon: GraduationCap,
        },
        {
            title: "Profile",
            url: "/trainer/profile",
            icon: User,
        }
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";

    return (
        <Sidebar collapsible="icon" {...props} className="bg-[#ffffff]">
            {/* Header with Logo */}
            <SidebarHeader className="p-3">
                <div className="flex items-center justify-center">
                    {isCollapsed ? (
                        <Image
                            src={ChildMainLogo}
                            alt="Child Main Logo"
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                    ) : (
                        <Image
                            src={ChildMainLogo}
                            alt="Child Main Logo"
                            width={88}
                            height={50}
                            className="object-contain"
                        />
                    )}
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup className={isCollapsed ? "" : ""}>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-2">
                            {data.home.map((item) => (
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

            {/* Footer with User Profile */}
            {!isCollapsed &&
                <SidebarFooter className="p-4 bg-[#0f172a]">
                    <div className="relative bg-linear-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden group hover:border-yellow-400/40 transition-all duration-500 hover:shadow-yellow-400/10">
        
                        <div className="relative flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 ring-yellow-400/30 group-hover:ring-yellow-400/60 transition-all duration-300">
                                    {/* <Image
                                    src={profileImage}
                                    alt="Moni Roy"
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                /> */}
                                    <div className="absolute inset-0 bg-linear-to-br from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <div>
                                    <div className="text-white font-semibold text-base tracking-wide">Moni Roy</div>
                                    <div className="text-gray-300/80 text-sm font-medium">Job Seeker</div>
                                </div>
                            </div>
                            <button className="text-white/70 hover:text-yellow-400 transition-all duration-300 hover:scale-110">
                                <ChevronDown className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </SidebarFooter>}
            <SidebarRail />
        </Sidebar>
    );
}
