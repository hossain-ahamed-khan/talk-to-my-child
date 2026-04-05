"use client";

const PRIMARY = "#10996f";

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
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#3d516b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        ringColor: "#f3aa17",
        iconBg: "#d9910a",
        completed: true,
    },
    {
        id: 2,
        name: "Science Explorer",
        hours: 62,
        maxHours: 100,
        icon: <ScienceIcon />,
        ringColor: "#97a9bf",
        iconBg: "#7f93ad",
    },
    {
        id: 3,
        name: "Language Hero",
        hours: 45,
        maxHours: 100,
        icon: <LanguageIcon />,
        ringColor: "#d27416",
        iconBg: "#b55c0b",
    },
    {
        id: 4,
        name: "History Buff",
        hours: 12,
        maxHours: 100,
        icon: <LockIcon />,
        ringColor: "#22324a",
        iconBg: "#1b2a40",
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
        <>
            <style>{`
                :root {
                    --primary: #10996f;
                    --primary-soft: rgba(16,153,111,0.28);
                    --card-bg: #0b1b34;
                    --card-border: #1b3151;
                    --label-color: #6f85a3;
                    --card-hover-border: #2a456b;
                }

                .achievement-page {
                    width: 100%;
                    min-height: 100vh;
                    background-color: #0d1526;
                    padding: 28px;
                    box-sizing: border-box;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                }

                .achievement-container {
                    width: 100%;
                }

                .achievement-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 14px;
                    margin-bottom: 12px;
                }

                .subject-grid {
                    width: 100%;
                    display: grid;
                    grid-template-columns: repeat(4, minmax(0, 1fr));
                    gap: 12px;
                }

                .subject-card {
                    min-width: 0;
                }

                @media (max-width: 1100px) {
                    .subject-grid {
                        grid-template-columns: repeat(3, minmax(0, 1fr));
                    }
                }

                @media (max-width: 860px) {
                    .achievement-page {
                        padding: 20px 16px;
                    }

                    .achievement-header {
                        flex-direction: column;
                    }

                    .header-right {
                        text-align: left !important;
                    }

                    .subject-grid {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }
                }

                @media (max-width: 520px) {
                    .achievement-page {
                        padding: 16px 12px;
                    }

                    .main-title {
                        font-size: 22px !important;
                    }

                    .subject-grid {
                        grid-template-columns: 1fr;
                    }

                    .subject-card {
                        padding: 18px 14px 16px !important;
                    }
                }
            `}</style>

            <div className="achievement-page">
                <div className="achievement-container">

                    {/* Header */}
                    <div className="achievement-header">
                        <div>
                            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: PRIMARY, textTransform: "uppercase", margin: "0 0 4px" }}>
                                Weekly Reset
                            </p>
                            <h1 className="main-title" style={{ fontSize: 25, fontWeight: 800, color: "#ffffff", margin: 0, lineHeight: 1.2 }}>
                                Usage Milestones
                            </h1>
                        </div>
                        <div className="header-right" style={{ textAlign: "right" }}>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "#ffffff", margin: 0 }}>
                                Check-in: <span style={{ color: PRIMARY }}>{checkin}/{total} Days</span>
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
                            background: "linear-gradient(90deg, #0d7f5c, #10996f)",
                            borderRadius: 99,
                        }} />
                    </div>

                    {/* Streak banner */}
                    <div style={{
                        backgroundColor: "#0f1e33",
                        border: "1px solid var(--primary-soft)",
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
                        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.13em", color: "var(--label-color)", textTransform: "uppercase", margin: 0 }}>
                            Core Subjects
                        </p>
                        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.13em", color: "var(--label-color)", textTransform: "uppercase", margin: 0 }}>
                            100 HR Goal
                        </p>
                    </div>

                    {/* Subject cards */}
                    <div className="subject-grid">
                        {subjects.map((s) => {
                            const pct = Math.min((s.hours / s.maxHours) * 100, 100);
                            return (
                                <div
                                    key={s.id}
                                    className="subject-card"
                                    style={{
                                        backgroundColor: "var(--card-bg)",
                                        border: "1px solid var(--card-border)",
                                        borderRadius: 16,
                                        padding: "22px 16px 18px",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 14,
                                        transition: "border-color 0.2s",
                                        width: "100%",
                                        boxSizing: "border-box",
                                    }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--card-hover-border)"; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--card-border)"; }}
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
                                            color: s.completed ? "#f3aa17" : s.locked ? "#344a67" : "#6f85a3",
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
        </>
    );
}