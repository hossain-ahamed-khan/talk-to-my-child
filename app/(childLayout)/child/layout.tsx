"use client";
import { usePathname } from "next/navigation";
import { Search, Bell } from "lucide-react";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/child/app-sidebar";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const getPageTitle = () => {
        if (pathname === "/parent") return "Dashboard";
        const segments = pathname.split("/").filter(Boolean);
        const lastSegment = segments[segments.length - 1];
        return lastSegment
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset style={{ background: "#0f172a" }}>
                {/* Top header bar matching the image */}
                <header
                    className="flex h-[60px] shrink-0 items-center gap-3 px-4 border-b"
                    style={{ borderColor: "#1e2d3e", background: "#111c2b" }}
                >
                    <SidebarTrigger
                        className="text-[#8b9ab0] hover:text-white hover:bg-white/10 -ml-1"
                    />

                    {/* Search bar */}
                    <div className="flex-1 max-w-xl relative">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                            style={{ color: "#6b7a8d" }}
                        />
                        <input
                            type="text"
                            placeholder="Search AI characters, history, or guides..."
                            className="w-full rounded-full pl-9 pr-4 py-2 text-sm outline-none transition-all"
                            style={{
                                background: "#1a2535",
                                color: "#c5d1de",
                                border: "1px solid #2d3f55",
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = "#10b981";
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = "#2d3f55";
                            }}
                        />
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Notification bell with badge */}
                    <div className="relative">
                        <button
                            className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors"
                            style={{ background: "#1a2535", color: "#c5d1de", border: "1px solid #2d3f55" }}
                        >
                            <Bell className="w-4 h-4" />
                            <span className="text-[13px]">2</span>
                        </button>
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 w-full overflow-auto" style={{ background: "#0f172a" }}>
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}