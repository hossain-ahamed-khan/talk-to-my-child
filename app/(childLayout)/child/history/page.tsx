"use client";
import Image from "next/image";
import { useState } from "react";

interface CallRecord {
    id: number;
    contactName: string;
    contactImage: string;
    duration: string;
    date: string;
    time: string;
    topic: string;
}

const mockCalls: CallRecord[] = [
    {
        id: 1,
        contactName: "Dad",
        contactImage: "https://i.pravatar.cc/150?img=52",
        duration: "2M 45S",
        date: "Oct 24, 2023",
        time: "15:20",
        topic: "Fractions homework help",
    },
    {
        id: 2,
        contactName: "Dad",
        contactImage: "https://i.pravatar.cc/150?img=52",
        duration: "2M 45S",
        date: "Oct 24, 2023",
        time: "15:20",
        topic: "Fractions homework help",
    },
    {
        id: 3,
        contactName: "Dad",
        contactImage: "https://i.pravatar.cc/150?img=52",
        duration: "2M 45S",
        date: "Oct 24, 2023",
        time: "15:20",
        topic: "Fractions homework help",
    },
];

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
        <path d="M6 4l4 4-4 4" stroke="#4ADE80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const MicIcon = () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="7" y="1" width="8" height="13" rx="4" fill="white" />
        <path d="M3 11c0 4.418 3.582 8 8 8s8-3.582 8-8" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M11 19v2" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const ChevronDown = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4 6l4 4 4-4" stroke="#4ADE80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

function CallCard({ call, index }: { call: CallRecord; index: number }) {
    return (
        <div
            className="call-card"
            style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "14px",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                cursor: "pointer",
                transition: "background 0.2s, border-color 0.2s, transform 0.15s",
                animation: `fadeSlideIn 0.4s ease both`,
                animationDelay: `${index * 0.07}s`,
            }}
            onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "rgba(255,255,255,0.07)";
                el.style.borderColor = "rgba(74,222,128,0.2)";
                el.style.transform = "translateX(2px)";
            }}
            onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "rgba(255,255,255,0.04)";
                el.style.borderColor = "rgba(255,255,255,0.07)";
                el.style.transform = "translateX(0)";
            }}
        >
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "2px solid rgba(74,222,128,0.3)",
                }}>
                    <Image
                        src={call.contactImage}
                        alt={call.contactName}
                        width={52}
                        height={52}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 700,
                        fontSize: "16px",
                        color: "#F9FAFB",
                        letterSpacing: "-0.01em",
                    }}>
                        {call.contactName}
                    </span>
                    <span style={{
                        background: "rgba(74,222,128,0.15)",
                        color: "#4ADE80",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "10px",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        padding: "2px 8px",
                        borderRadius: "20px",
                        border: "1px solid rgba(74,222,128,0.25)",
                    }}>
                        {call.duration}
                    </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <CalendarIcon />
                        <span style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "12px",
                            color: "#9CA3AF",
                        }}>{call.date}</span>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <ClockIcon />
                        <span style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "12px",
                            color: "#9CA3AF",
                        }}>{call.time}</span>
                    </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "13px",
                        color: "#6B7280",
                    }}>Topic:</span>
                    <span style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "13px",
                        color: "#D1D5DB",
                        fontStyle: "italic",
                    }}>&quot;{call.topic}&quot;</span>
                </div>
            </div>

            {/* Arrow */}
            <div style={{ flexShrink: 0, opacity: 0.7 }}>
                <ChevronRight />
            </div>
        </div>
    );
}

export default function CallHistory() {
    const [calls, setCalls] = useState<CallRecord[]>(mockCalls);
    const [loading, setLoading] = useState(false);

    const handleLoadMore = () => {
        setLoading(true);
        setTimeout(() => {
            const next = mockCalls.map(c => ({ ...c, id: c.id + calls.length }));
            setCalls(prev => [...prev, ...next]);
            setLoading(false);
        }, 800);
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:wght@500;600&display=swap');

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse-mic {
          0%, 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.4); }
          50% { box-shadow: 0 0 0 10px rgba(74,222,128,0); }
        }

        .mic-btn {
          animation: pulse-mic 2.5s ease-in-out infinite;
        }

        .load-more-btn {
          transition: background 0.2s, border-color 0.2s;
        }

        .load-more-btn:hover {
          background: rgba(255,255,255,0.05) !important;
          border-color: rgba(74,222,128,0.3) !important;
        }
      `}</style>

            <div style={{
                minHeight: "100vh",
                background: "#0B1A24",
                fontFamily: "'DM Sans', sans-serif",
                padding: "40px 24px",
                position: "relative",
                maxWidth: 700,
                margin: "0 auto",
            }}>
                {/* Header */}
                <div style={{ marginBottom: 32, animation: "fadeSlideIn 0.4s ease both" }}>
                    <h1 style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 700,
                        fontSize: "28px",
                        color: "#F9FAFB",
                        margin: 0,
                        letterSpacing: "-0.03em",
                    }}>Call History</h1>
                    <p style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "14px",
                        color: "#4ADE80",
                        margin: "6px 0 0",
                        fontWeight: 400,
                    }}>
                        Review and replay your recent learning conversations.
                    </p>
                </div>

                {/* Cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {calls.map((call, i) => (
                        <CallCard key={`${call.id}-${i}`} call={call} index={i} />
                    ))}
                </div>

                {/* Load More */}
                <button
                    className="load-more-btn"
                    onClick={handleLoadMore}
                    disabled={loading}
                    style={{
                        marginTop: 16,
                        width: "100%",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: "14px",
                        padding: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        cursor: loading ? "not-allowed" : "pointer",
                        color: "#4ADE80",
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: "15px",
                        letterSpacing: "-0.01em",
                        opacity: loading ? 0.6 : 1,
                        animation: "fadeSlideIn 0.4s ease both",
                        animationDelay: "0.3s",
                    }}
                >
                    {loading ? "Loading..." : (
                        <>
                            Load More History
                            <ChevronDown />
                        </>
                    )}
                </button>

                {/* Floating mic button */}
                <button
                    className="mic-btn"
                    style={{
                        position: "fixed",
                        bottom: 32,
                        right: 32,
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #4ADE80, #22C55E)",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 24px rgba(74,222,128,0.3)",
                    }}
                >
                    <MicIcon />
                </button>
            </div>
        </>
    );
}