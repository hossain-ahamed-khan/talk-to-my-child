"use client";
import { useState, type CSSProperties } from "react";

type Call = {
    id: number;
    name: string;
    duration: string;
    date: string;
    time: string;
    topic: string;
    child: string;
};

const tones = ["FRIENDLY", "EXCITED", "CALM", "STERN", "WISE"] as const;
type Tone = (typeof tones)[number];

const CalendarIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4a7a90" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const ClockIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4a7a90" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const ConfigChevronRight = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#2dd4bf" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5l8 7-8 7" stroke="#2dd4bf" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const HistoryChevronRight = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const ChevronDown = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const MicIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v6a2 2 0 0 0 4 0V5a2 2 0 0 0-2-2zm7 8a1 1 0 0 1 1 1 8 8 0 0 1-7 7.93V22h2a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h2v-2.07A8 8 0 0 1 4 12a1 1 0 1 1 2 0 6 6 0 0 0 12 0 1 1 0 0 1 1-1z" />
    </svg>
);

const EditIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    </svg>
);

const TrashIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#ff6b6b" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 3h6l1 1h4v2H4V4h4l1-1zM5 7h14l-1 13H6L5 7zm5 2v9h2V9h-2zm4 0v9h2V9h-2z" />
    </svg>
);

const HistoryDadAvatar = () => (
    <div style={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        background: "linear-gradient(145deg, #c8a882, #a07850)",
        overflow: "hidden",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }}>
        <svg viewBox="0 0 52 52" width="52" height="52" xmlns="http://www.w3.org/2000/svg">
            <rect width="52" height="52" rx="26" fill="#c8a882" />
            <ellipse cx="26" cy="44" rx="14" ry="10" fill="#1a3a5c" />
            <ellipse cx="26" cy="22" rx="11" ry="13" fill="#d4956a" />
            <ellipse cx="26" cy="12" rx="11" ry="6" fill="#2d1a0e" />
            <rect x="15" y="12" width="22" height="5" fill="#2d1a0e" rx="2" />
            <path d="M17 28 Q26 36 35 28 Q33 38 26 40 Q19 38 17 28Z" fill="#2d1a0e" />
            <ellipse cx="21" cy="21" rx="2" ry="2" fill="#1a0a00" />
            <ellipse cx="31" cy="21" rx="2" ry="2" fill="#1a0a00" />
        </svg>
    </div>
);

const ConfigDadAvatar = () => (
    <div style={{
        width: 72,
        height: 72,
        borderRadius: 14,
        background: "linear-gradient(145deg, #c8a882, #a07850)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
    }}>
        <svg viewBox="0 0 72 72" width="72" height="72" xmlns="http://www.w3.org/2000/svg">
            <rect width="72" height="72" fill="#c8a882" rx="14" />
            <ellipse cx="36" cy="62" rx="20" ry="14" fill="#1a3a5c" />
            <ellipse cx="36" cy="30" rx="15" ry="17" fill="#d4956a" />
            <ellipse cx="36" cy="16" rx="15" ry="8" fill="#2d1a0e" />
            <rect x="21" y="16" width="30" height="6" fill="#2d1a0e" rx="2" />
            <path d="M24 38 Q36 48 48 38 Q46 52 36 54 Q26 52 24 38Z" fill="#2d1a0e" />
            <ellipse cx="29" cy="29" rx="2.5" ry="2.5" fill="#1a0a00" />
            <ellipse cx="43" cy="29" rx="2.5" ry="2.5" fill="#1a0a00" />
        </svg>
        <div style={{
            position: "absolute",
            bottom: -4,
            right: -4,
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "#2dd4bf",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #0f2027",
        }}>
            <EditIcon />
        </div>
    </div>
);

const UserBubble = ({ letter, color }: { letter: string; color: string }) => (
    <div style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 700,
        color: "white",
        border: "2px solid #1e3040",
        fontFamily: "'DM Sans', sans-serif",
    }}>{letter}</div>
);

const initialCalls: Call[] = [
    { id: 1, name: "Dad", duration: "2 M 45S", date: "Oct 24, 2023", time: "15:20", topic: "Fractions homework help", child: "Abdullah" },
    { id: 2, name: "Dad", duration: "2 M 45S", date: "Oct 24, 2023", time: "15:20", topic: "Fractions homework help", child: "Abdullah" },
    { id: 3, name: "Dad", duration: "2 M 45S", date: "Oct 24, 2023", time: "15:20", topic: "Fractions homework help", child: "Abdullah" },
];

const moreCalls: Call[] = [
    { id: 4, name: "Dad", duration: "1 M 20S", date: "Oct 22, 2023", time: "10:05", topic: "Science project ideas", child: "Abdullah" },
    { id: 5, name: "Dad", duration: "3 M 10S", date: "Oct 20, 2023", time: "09:30", topic: "Reading comprehension", child: "Abdullah" },
];

function CallRow({ call, onClick }: { call: Call; onClick: () => void }) {
    return (
        <div
            style={{
                background: "#0d1e2d",
                border: "1px solid #1a3348",
                borderRadius: 14,
                padding: "18px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                transition: "border-color 0.18s, background 0.18s",
            }}
            onClick={onClick}
            onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "#10b981";
                (e.currentTarget as HTMLDivElement).style.background = "#0d2318";
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "#1a3348";
                (e.currentTarget as HTMLDivElement).style.background = "#0d1e2d";
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <HistoryDadAvatar />
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: 16, color: "#e8f4f8" }}>{call.name}</span>
                        <span style={{
                            background: "#10b981",
                            color: "#091520",
                            fontSize: 9,
                            fontWeight: 800,
                            letterSpacing: "0.1em",
                            padding: "3px 9px",
                            borderRadius: 99,
                        }}>
                            {call.duration}
                        </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#4a7a90" }}>
                            <CalendarIcon /> {call.date}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#4a7a90" }}>
                            <ClockIcon /> {call.time}
                        </span>
                    </div>
                    <div style={{ fontSize: 13, color: "#4a7a90" }}>
                        <span>Topic: </span>
                        <span style={{ color: "#8aaab8" }}>&quot;{call.topic}&quot;</span>
                    </div>
                    <div style={{ fontSize: 13, color: "#4a7a90", marginTop: 3 }}>
                        <span>Child: </span>
                        <span style={{ color: "#8aaab8" }}>{call.child}</span>
                    </div>
                </div>
            </div>

            <div style={{ paddingLeft: 12 }}>
                <HistoryChevronRight />
            </div>
        </div>
    );
}

function CallHistory({ onSelectCall }: { onSelectCall: (call: Call) => void }) {
    const [calls, setCalls] = useState(initialCalls);
    const [loaded, setLoaded] = useState(false);

    const handleLoadMore = () => {
        if (!loaded) {
            setCalls(prev => [...prev, ...moreCalls]);
            setLoaded(true);
        }
    };

    return (
        <div style={{
            background: "#091520",
            minHeight: "100vh",
            padding: "40px 24px",
            fontFamily: "'DM Sans', sans-serif",
            position: "relative",
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
                * { box-sizing: border-box; }
            `}</style>

            <div style={{ maxWidth: 940, margin: "0 auto" }}>
                <div style={{ marginBottom: 28 }}>
                    <h1 style={{
                        margin: 0,
                        fontSize: 28,
                        fontWeight: 800,
                        color: "#e8f4f8",
                        letterSpacing: "-0.03em",
                    }}>
                        Call History
                    </h1>
                    <p style={{ margin: "6px 0 0", fontSize: 14, color: "#10b981", fontWeight: 500 }}>
                        Review and replay your recent learning conversations.
                    </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                    {calls.map(call => (
                        <CallRow key={call.id} call={call} onClick={() => onSelectCall(call)} />
                    ))}
                </div>

                <button
                    onClick={handleLoadMore}
                    disabled={loaded}
                    style={{
                        width: "100%",
                        padding: "16px",
                        background: "#0d1e2d",
                        border: "1px solid #1a3348",
                        borderRadius: 14,
                        color: loaded ? "#4a7a90" : "#10b981",
                        fontWeight: 700,
                        fontSize: 15,
                        fontFamily: "'DM Sans', sans-serif",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        cursor: loaded ? "default" : "pointer",
                        transition: "background 0.18s, border-color 0.18s",
                    }}
                    onMouseEnter={e => {
                        if (!loaded) {
                            (e.currentTarget as HTMLButtonElement).style.background = "#0d2318";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "#10b981";
                        }
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = "#0d1e2d";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "#1a3348";
                    }}
                >
                    {loaded ? "All history loaded" : <>Load More History <ChevronDown /></>}
                </button>
            </div>

            <button style={{
                position: "fixed",
                bottom: 32,
                right: 32,
                width: 54,
                height: 54,
                borderRadius: "50%",
                border: "none",
                background: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 6px 24px rgba(16,185,129,0.4)",
                cursor: "pointer",
            }}>
                <MicIcon />
            </button>
        </div>
    );
}

function ConfigurationPanel({ onBack }: { onBack: () => void }) {
    const [childName, setChildName] = useState("Abdullah");
    const [age, setAge] = useState("10");
    const [selectedTone, setSelectedTone] = useState<Tone>("EXCITED");
    const [instructions, setInstructions] = useState(
        "Dad is very supportive about school and loves to talk about robotics. Currently encouraging Abdullah to finish his chores."
    );

    const inputStyle: CSSProperties = {
        background: "#0f2130",
        border: "1px solid #1e3a50",
        borderRadius: 10,
        color: "#e8f4f8",
        padding: "12px 16px",
        fontSize: 14,
        fontFamily: "'DM Sans', sans-serif",
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
    };

    const labelStyle: CSSProperties = {
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.12em",
        color: "#5a8aa0",
        marginBottom: 8,
        display: "block",
        fontFamily: "'DM Sans', sans-serif",
    };

    const sectionStyle: CSSProperties = {
        background: "#0d1e2d",
        border: "1px solid #1a3348",
        borderRadius: 14,
        padding: "20px",
        marginBottom: 16,
    };

    return (
        <div style={{
            background: "#091520",
            minHeight: "100vh",
            padding: "32px 24px",
            fontFamily: "'DM Sans', sans-serif",
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
                input::placeholder { color: #3a5a70; }
                textarea::placeholder { color: #3a5a70; }
                input:focus, textarea:focus {
                    border-color: #2dd4bf !important;
                    box-shadow: 0 0 0 3px rgba(45,212,191,0.08);
                }
                button { cursor: pointer; }
            `}</style>

            <div style={{ maxWidth: 780, margin: "0 auto" }}>
                <div style={{ marginBottom: 20 }}>
                    <button
                        onClick={onBack}
                        style={{
                            background: "transparent",
                            border: "1px solid #1e3a50",
                            color: "#8aaab8",
                            borderRadius: 30,
                            padding: "10px 16px",
                            fontSize: 13,
                            fontWeight: 600,
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        Back To History
                    </button>
                </div>

                <div style={{ marginBottom: 28 }}>
                    <h1 style={{ color: "#e8f4f8", fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
                        Configuration
                    </h1>
                    <p style={{ color: "#2dd4bf", fontSize: 13, margin: "4px 0 0", fontWeight: 500 }}>
                        Adjust system preferences and behavior
                    </p>
                </div>

                <div style={{ ...sectionStyle, display: "flex", alignItems: "center", gap: 20 }}>
                    <ConfigDadAvatar />
                    <div>
                        <span style={{ ...labelStyle, marginBottom: 2 }}>CHARACTER NAME</span>
                        <div style={{ color: "#e8f4f8", fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em" }}>Dad</div>
                    </div>
                </div>

                <div style={sectionStyle}>
                    <div style={{ display: "flex", gap: 16 }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>CHILD NAME</label>
                            <input
                                style={inputStyle}
                                value={childName}
                                onChange={e => setChildName(e.target.value)}
                                placeholder="Enter child name"
                            />
                        </div>
                        <div style={{ width: 130 }}>
                            <label style={labelStyle}>AGE</label>
                            <input
                                style={inputStyle}
                                value={age}
                                onChange={e => setAge(e.target.value)}
                                placeholder="Age"
                            />
                        </div>
                    </div>
                </div>

                <div style={sectionStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                        <label style={{ ...labelStyle, marginBottom: 0 }}>VOICE TONE</label>
                        <span style={{ fontSize: 12, color: "#2dd4bf", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#2dd4bf", display: "inline-block" }} />
                            Preview Ready
                        </span>
                    </div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        {tones.map(tone => (
                            <button
                                key={tone}
                                onClick={() => setSelectedTone(tone)}
                                style={{
                                    padding: "8px 18px",
                                    borderRadius: 30,
                                    border: selectedTone === tone ? "none" : "1px solid #1e3a50",
                                    background: selectedTone === tone ? "#2dd4bf" : "transparent",
                                    color: selectedTone === tone ? "#091520" : "#5a8aa0",
                                    fontWeight: 700,
                                    fontSize: 12,
                                    letterSpacing: "0.08em",
                                    fontFamily: "'DM Sans', sans-serif",
                                    transition: "all 0.18s ease",
                                }}
                            >
                                {tone}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={sectionStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                        <label style={{ ...labelStyle, marginBottom: 0 }}>CONVERSATION TRANSCRIPT</label>
                        <button style={{ background: "none", border: "none", color: "#2dd4bf", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4, padding: 0 }}>
                            VIEW FULL <ConfigChevronRight />
                        </button>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                        <div style={{ maxWidth: "80%" }}>
                            <div style={{
                                background: "#1a3a52",
                                borderRadius: "14px 14px 4px 14px",
                                padding: "12px 16px",
                                color: "#e8f4f8",
                                fontSize: 14,
                                lineHeight: 1.5,
                            }}>
                                Yes! Can we go to the park and play football? I want to practice my strikes.
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 6, marginTop: 6 }}>
                                <div style={{ display: "flex" }}>
                                    <UserBubble letter="M" color="#e67e22" />
                                    <UserBubble letter="A" color="#2980b9" />
                                </div>
                                <span style={{ fontSize: 11, color: "#3a5a70" }}>ABDULLAH • 2:15 PM</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-start" }}>
                        <div style={{ maxWidth: "80%" }}>
                            <div style={{
                                background: "#132535",
                                border: "1px solid #1a3a52",
                                borderRadius: "14px 14px 14px 4px",
                                padding: "12px 16px",
                                color: "#c8dde8",
                                fontSize: 14,
                                lineHeight: 1.5,
                            }}>
                                That sounds like a great plan. I&apos;ll bring the new ball we got last week. Should we invite your cousins too, or just keep it a father-son match?
                            </div>
                            <div style={{ marginTop: 6 }}>
                                <span style={{ fontSize: 11, color: "#3a5a70" }}>DAD • 2:15 PM</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={sectionStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                        <label style={{ ...labelStyle, marginBottom: 0 }}>CHARACTER INSTRUCTIONS</label>
                        <button style={{ background: "none", border: "none", color: "#2dd4bf", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4, padding: 0, cursor: "pointer" }}>
                            VIEW FULL <ConfigChevronRight />
                        </button>
                    </div>
                    <div style={{ position: "relative" }}>
                        <textarea
                            style={{
                                ...inputStyle,
                                resize: "none",
                                height: 90,
                                paddingRight: 60,
                            }}
                            value={instructions}
                            onChange={e => setInstructions(e.target.value)}
                        />
                        <button style={{
                            position: "absolute",
                            bottom: 14,
                            right: 14,
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #2dd4bf, #0ea5e9)",
                            border: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 14px rgba(45,212,191,0.35)",
                        }}>
                            <MicIcon />
                        </button>
                    </div>
                    <div style={{ marginTop: 8, fontSize: 11, color: "#3a5a70", letterSpacing: "0.05em" }}>
                        LAST UPDATED: TODAY AT 10:45 AM
                    </div>
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                    <button style={{
                        padding: "13px 26px",
                        borderRadius: 30,
                        border: "none",
                        background: "#2dd4bf",
                        color: "#091520",
                        fontWeight: 700,
                        fontSize: 14,
                        fontFamily: "'DM Sans', sans-serif",
                        letterSpacing: "0.02em",
                    }}>
                        Save Changes
                    </button>
                    <button
                        onClick={onBack}
                        style={{
                            padding: "13px 26px",
                            borderRadius: 30,
                            border: "1px solid #1e3a50",
                            background: "transparent",
                            color: "#8aaab8",
                            fontWeight: 600,
                            fontSize: 14,
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        Cancel
                    </button>
                    <button style={{
                        padding: "13px 26px",
                        borderRadius: 30,
                        border: "none",
                        background: "rgba(255,80,80,0.12)",
                        color: "#ff6b6b",
                        fontWeight: 700,
                        fontSize: 14,
                        fontFamily: "'DM Sans', sans-serif",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                    }}>
                        <TrashIcon /> DELETE
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ParentHistoryPage() {
    const [selectedCall, setSelectedCall] = useState<Call | null>(null);

    if (selectedCall) {
        return <ConfigurationPanel onBack={() => setSelectedCall(null)} />;
    }

    return <CallHistory onSelectCall={setSelectedCall} />;
}