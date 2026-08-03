"use client";

import { ConversationSession, useGetCallHistoryListQuery } from "@/redux/features/childSection/callHistoryApi";


const CalendarIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="2" width="12" height="11" rx="2" stroke="#9CA3AF" strokeWidth="1.2" fill="none" />
        <path d="M1 5h12" stroke="#9CA3AF" strokeWidth="1.2" />
        <path d="M4 1v2M10 1v2" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
);

const ClockIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="5.5" stroke="#9CA3AF" strokeWidth="1.2" />
        <path d="M7 4v3l2 1.5" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ChevronRight = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M6 4l4 4-4 4" stroke="#10996f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const MicIcon = () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="7" y="1" width="8" height="13" rx="4" fill="white" />
        <path d="M3 11c0 4.418 3.582 8 8 8s8-3.582 8-8" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M11 19v2" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

function CallCard({ call, index }: { call: ConversationSession; index: number }) {
    return (
        <div
            className="call-card flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.04] px-5 py-4 transition-all duration-200 hover:translate-x-0.5 hover:border-[rgba(16,153,111,0.4)] hover:bg-white/[0.07] max-[768px]:gap-3 max-[768px]:p-3.5 max-[480px]:rounded-xl max-[480px]:p-3"
            style={{
                animation: "fadeSlideIn 0.4s ease both",
                animationDelay: `${index * 0.07}s`,
            }}
        >
            {/* Avatar (initials, since API doesn't return an image) */}
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border-2 border-[rgba(16,153,111,0.45)] bg-[rgba(16,153,111,0.15)] font-['DM_Sans',sans-serif] text-base font-bold text-[#10996f]">
                {getInitials(call.character_name)}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex items-center gap-2.5">
                    <span className="font-['DM_Sans',sans-serif] text-base font-bold tracking-[-0.01em] text-gray-50">
                        {call.character_name}
                    </span>
                </div>

                <div className="call-meta mb-2 flex items-center gap-3.5 max-[768px]:flex-wrap max-[768px]:gap-y-1.5">
                    <span className="flex items-center gap-1.5">
                        <CalendarIcon />
                        <span className="font-['DM_Sans',sans-serif] text-xs text-gray-400">
                            {formatDate(call.started_at)}
                        </span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <ClockIcon />
                        <span className="font-['DM_Sans',sans-serif] text-xs text-gray-400">
                            {formatTime(call.started_at)}
                        </span>
                    </span>
                </div>

                <div className="flex items-center gap-1.5">
                    <span className="shrink-0 font-['DM_Sans',sans-serif] text-[13px] text-gray-500">
                        Last message:
                    </span>
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap font-['DM_Sans',sans-serif] text-[13px] italic text-gray-300">
                        &quot;{call.last_message.content}&quot;
                    </span>
                </div>
            </div>

            {/* Arrow */}
            <div className="shrink-0 opacity-70">
                <ChevronRight />
            </div>
        </div>
    );
}

export default function CallHistory() {
    const { data, isLoading, isError } = useGetCallHistoryListQuery();

    const calls = data?.data ?? [];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:wght@500;600&display=swap');

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse-mic {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,153,111,0.45); }
          50% { box-shadow: 0 0 0 10px rgba(16,153,111,0); }
        }

        .mic-btn {
          animation: pulse-mic 2.5s ease-in-out infinite;
        }
      `}</style>

            <div className="history-page relative box-border min-h-screen w-full bg-[#0B1A24] px-2.5 py-5 font-['DM_Sans',sans-serif] sm:px-3.5 sm:py-6 md:px-5 md:py-8 lg:px-6 lg:py-10">
                {/* Header */}
                <div
                    className="mb-8"
                    style={{ animation: "fadeSlideIn 0.4s ease both" }}
                >
                    <h1 className="history-title m-0 font-['DM_Sans',sans-serif] text-xl font-bold tracking-[-0.03em] text-gray-50 sm:text-2xl lg:text-[28px]">
                        Call History
                    </h1>
                    <p className="mt-1.5 font-['DM_Sans',sans-serif] text-sm font-normal text-[#10996f]">
                        Review and replay your recent learning conversations.
                    </p>
                </div>

                {/* Loading state */}
                {isLoading && (
                    <p className="font-['DM_Sans',sans-serif] text-sm text-gray-400">
                        Loading call history...
                    </p>
                )}

                {/* Error state */}
                {isError && (
                    <p className="font-['DM_Sans',sans-serif] text-sm text-red-400">
                        Failed to load call history. Please try again.
                    </p>
                )}

                {/* Empty state */}
                {!isLoading && !isError && calls.length === 0 && (
                    <p className="font-['DM_Sans',sans-serif] text-sm text-gray-400">
                        No calls yet.
                    </p>
                )}

                {/* Cards */}
                {!isLoading && !isError && calls.length > 0 && (
                    <div className="flex flex-col gap-3">
                        {calls.map((call, i) => (
                            <CallCard key={call.id} call={call} index={i} />
                        ))}
                    </div>
                )}

                {/* Floating mic button */}
                <button className="mic-btn fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full border-none bg-gradient-to-br from-[#10996f] to-[#0d7f5c] shadow-[0_4px_24px_rgba(16,153,111,0.35)] max-[768px]:bottom-3.5 max-[768px]:right-3.5 max-[768px]:h-[50px] max-[768px]:w-[50px]">
                    <MicIcon />
                </button>
            </div>
        </>
    );
}