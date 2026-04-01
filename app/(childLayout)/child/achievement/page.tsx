"use client";
import { useState } from "react";

const MathIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="8" y1="8" x2="16" y2="8" />
        <line x1="8" y1="12" x2="16" y2="12" />
        <line x1="8" y1="16" x2="12" y2="16" />
    </svg>
);

const ScienceIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3h6v10l4 7H5l4-7V3z" />
        <line x1="6.5" y1="8" x2="17.5" y2="8" />
    </svg>
);

const LanguageIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <line x1="8" y1="7" x2="15" y2="7" />
        <line x1="8" y1="11" x2="13" y2="11" />
    </svg>
);

const LockIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const StarIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15" strokeWidth="1">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
);

type Subject = {
    id: number;
    name: string;
    hours: number;
    maxHours: number;
    icon: React.ReactNode;
    ringColor: string;
    iconBg: string;
    locked?: boolean;
    completed?: boolean;
};

const subjects: Subject[] = [
    {
        id: 1,
        name: "Math Master",
        hours: 100,
        maxHours: 100,
        icon: <MathIcon />,
        ringColor: "#f59e0b",
        iconBg: "#d97706",
        completed: true,
    },
    {
        id: 2,
        name: "Science Explorer",
        hours: 62,
        maxHours: 100,
        icon: <ScienceIcon />,
        ringColor: "#6b7280",
        iconBg: "#374151",
    },
    {
        id: 3,
        name: "Language Hero",
        hours: 45,
        maxHours: 100,
        icon: <LanguageIcon />,
        ringColor: "#f97316",
        iconBg: "#ea580c",
    },
    {
        id: 4,
        name: "History Buff",
        hours: 12,
        maxHours: 100,
        icon: <LockIcon />,
        ringColor: "#1f2937",
        iconBg: "#1f2937",
        locked: true,
    },
];

function CircularProgress({
    progress,
    ringColor,
    iconBg,
    locked,
    icon,
}: {
    progress: number;
    ringColor: string;
    iconBg: string;
    locked?: boolean;
    icon: React.ReactNode;
}) {
    const r = 42;
    const circ = 2 * Math.PI * r;
    const offset = circ - (progress / 100) * circ;

    return (
        <div style={{ position: "relative", width: 92, height: 92, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="92" height="92" viewBox="0 0 92 92" style={{ position: "absolute" }}>
                <circle cx="46" cy="46" r={r} fill="none" stroke={locked ? "#1f2937" : ringColor + "30"} strokeWidth="5" />
                {!locked && progress > 0 && (
                    <circle
                        cx="46" cy="46" r={r}
                        fill="none"
                        stroke={ringColor}
                        strokeWidth="5"
                        strokeDasharray={circ}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        transform="rotate(-90 46 46)"
                    />
                )}
            </svg>
            <div style={{
                width: 54,
                height: 54,
                borderRadius: "50%",
                backgroundColor: iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
            }}>
                {icon}
            </div>
        </div>
    );
}

export default function UsageMilestones() {
    const checkin = 4;
    const total = 7;
    const barPct = (checkin / total) * 100;

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#0d1526",
            padding: "28px 28px",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}>
            <div style={{ maxWidth: 980, margin: "0 auto" }}>

                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#22c55e", textTransform: "uppercase", margin: "0 0 4px" }}>
                            Weekly Reset
                        </p>
                        <h1 style={{ fontSize: 25, fontWeight: 800, color: "#ffffff", margin: 0, lineHeight: 1.2 }}>
                            Usage Milestones
                        </h1>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#ffffff", margin: 0 }}>
                            Check-in: <span style={{ color: "#22c55e" }}>{checkin}/{total} Days</span>
                        </p>
                        <p style={{ fontSize: 12, color: "#475569", margin: "3px 0 0" }}>
                            Usage: 12h 30m
                        </p>
                    </div>
                </div>

                {/* Progress bar */}
                <div style={{ width: "100%", height: 6, backgroundColor: "#1e293b", borderRadius: 99, marginBottom: 16, overflow: "hidden" }}>
                    <div style={{
                        width: `${barPct}%`,
                        height: "100%",
                        background: "linear-gradient(90deg, #16a34a, #4ade80)",
                        borderRadius: 99,
                    }} />
                </div>

                {/* Streak banner */}
                <div style={{
                    backgroundColor: "#0f1e33",
                    border: "1px solid #162845",
                    borderRadius: 14,
                    padding: "13px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 38,
                }}>
                    <div style={{ flexShrink: 0 }}><StarIcon /></div>
                    <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>
                        Keep it up! Complete{" "}
                        <strong style={{ color: "#ffffff", fontWeight: 700 }}>3 more days</strong>{" "}
                        this week to maintain your streak.
                    </p>
                </div>

                {/* Section labels */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.13em", color: "#334155", textTransform: "uppercase", margin: 0 }}>
                        Core Subjects
                    </p>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.13em", color: "#334155", textTransform: "uppercase", margin: 0 }}>
                        100 HR Goal
                    </p>
                </div>

                {/* Subject cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                    {subjects.map((s) => {
                        const pct = Math.min((s.hours / s.maxHours) * 100, 100);
                        return (
                            <div
                                key={s.id}
                                style={{
                                    backgroundColor: "#0c1a2e",
                                    border: "1px solid #162845",
                                    borderRadius: 16,
                                    padding: "22px 16px 18px",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 14,
                                    transition: "border-color 0.2s",
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#1e3a5f"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#162845"; }}
                            >
                                <CircularProgress
                                    progress={pct}
                                    ringColor={s.ringColor}
                                    iconBg={s.iconBg}
                                    locked={s.locked}
                                    icon={s.icon}
                                />
                                <div style={{ textAlign: "center" }}>
                                    <p style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", margin: "0 0 5px" }}>
                                        {s.name}
                                    </p>
                                    <p style={{
                                        fontSize: 11,
                                        fontWeight: 700,
                                        letterSpacing: "0.04em",
                                        textTransform: "uppercase",
                                        color: s.completed ? "#4ade80" : s.locked ? "#1f2937" : "#475569",
                                        margin: 0,
                                    }}>
                                        {s.hours}/{s.maxHours} Hours
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}