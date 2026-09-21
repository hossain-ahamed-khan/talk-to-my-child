"use client";
import * as React from "react";
import {
    House,
    Users,
    History,
    User,
    LogOut,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
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
import mainLogo from "@/public/images/main-logo.png";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectUser, logout } from "@/redux/features/auth/authSlice";
import { useGetProfileInfoQuery } from "@/redux/features/profile/profileInfo/profileInfoApi";
import { selectAuth } from "@/redux/features/auth/authSlice";
import Swal from "sweetalert2";

const getProfileImageUrl = (profilePhoto: string | null) => {
    if (!profilePhoto) return null;
    if (profilePhoto.startsWith("http://") || profilePhoto.startsWith("https://")) return profilePhoto;

    const imageBaseUrl = process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL ?? "";
    return `${imageBaseUrl.replace(/\/$/, "")}/${profilePhoto.replace(/^\//, "")}`;
};

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
        { title: "Home", url: "/parent", icon: House },
        { title: "Characters", url: "/parent/characters", icon: Users },
        { title: "History", url: "/parent/history", icon: History },
        { title: "Account", url: "/parent/account", icon: User },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const user = useAppSelector(selectUser);
    const auth = useAppSelector(selectAuth);
    const { data: profile } = useGetProfileInfoQuery(undefined, {
        skip: !auth.token,
    });
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";
    const profileImageUrl = getProfileImageUrl(profile?.profile_photo ?? null);

    const handleLogout = () => {
        Swal.fire({
            title: "Log out?",
            text: "You will need to sign in again to access your account.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, log out",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(logout());
                router.push("/login");
            }
        });
    };

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
                        <div className="mb-2">
                            <span className="text-[#4ade80] text-md">Credit Balance: {user?.credit_balance}</span>
                            <div className="text-[#4ade80] text-md">Referral Code: {user?.referral_code}</div>
                        </div>
                    </div>
                )}

                {/* User profile row */}
                <div className={`flex items-center rounded-xl p-2 transition-colors hover:bg-white/5 cursor-pointer ${isCollapsed ? "justify-center" : "justify-between"}`}>
                    <div className="flex items-center gap-2.5">
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full shrink-0 overflow-hidden"
                            style={{ background: "linear-gradient(135deg, #f97316, #ec4899)" }}>
                            {profileImageUrl ? (
                                <Image
                                    src={profileImageUrl}
                                    alt={profile?.full_name ?? user?.full_name ?? "Profile picture"}
                                    width={36}
                                    height={36}
                                    unoptimized
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                                    {user?.full_name?.charAt(0).toUpperCase() ?? "S"}
                                </div>
                            )}
                        </div>
                        {!isCollapsed && (
                            <div>
                                <div className="text-white font-semibold text-[13px]">{user?.full_name}</div>
                            </div>
                        )}
                    </div>
                    {!isCollapsed && (
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1 text-[#8b9ab0] hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                            title="Logout"
                        >
                            Logout
                            <LogOut className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}