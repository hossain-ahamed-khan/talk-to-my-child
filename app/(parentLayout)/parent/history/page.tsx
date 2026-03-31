"use client";
import { useState } from "react";

const tones = ["FRIENDLY", "EXCITED", "CALM", "STERN", "WISE"] as const;
type Tone = (typeof tones)[number];

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

const ChevronRight = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#2dd4bf" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5l8 7-8 7" stroke="#2dd4bf" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const DadAvatar = () => (
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
            {/* Background */}
            <rect width="72" height="72" fill="#c8a882" rx="14" />
            {/* Body */}
            <ellipse cx="36" cy="62" rx="20" ry="14" fill="#1a3a5c" />
            {/* Head */}
            <ellipse cx="36" cy="30" rx="15" ry="17" fill="#d4956a" />
            {/* Hair */}
            <ellipse cx="36" cy="16" rx="15" ry="8" fill="#2d1a0e" />
            <rect x="21" y="16" width="30" height="6" fill="#2d1a0e" rx="2" />
            {/* Beard */}
            <path d="M24 38 Q36 48 48 38 Q46 52 36 54 Q26 52 24 38Z" fill="#2d1a0e" />
            {/* Eyes */}
            <ellipse cx="29" cy="29" rx="2.5" ry="2.5" fill="#1a0a00" />
            <ellipse cx="43" cy="29" rx="2.5" ry="2.5" fill="#1a0a00" />
        </svg>
        {/* Edit badge */}
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

export default function ConfigurationPanel() {
    const [childName, setChildName] = useState("Abdullah");
    const [age, setAge] = useState("10");
    const [selectedTone, setSelectedTone] = useState<Tone>("EXCITED");
    const [instructions, setInstructions] = useState(
        "Dad is very supportive about school and loves to talk about robotics. Currently encouraging Abdullah to finish his chores."
    );

    const inputStyle: React.CSSProperties = {
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

    const labelStyle: React.CSSProperties = {
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.12em",
        color: "#5a8aa0",
        marginBottom: 8,
        display: "block",
        fontFamily: "'DM Sans', sans-serif",
    };

    const sectionStyle: React.CSSProperties = {
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
            {/* Import fonts */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        input::placeholder { color: #3a5a70; }
        textarea::placeholder { color: #3a5a70; }
        input:focus, textarea:focus {
          border-color: #2dd4bf !important;
          box-shadow: 0 0 0 3px rgba(45,212,191,0.08);
        }
        button { cursor: pointer; }
      `}</style>

            <div style={{ maxWidth: 780, margin: "0 auto" }}>
                {/* Header */}
                <div style={{ marginBottom: 28 }}>
                    <h1 style={{ color: "#e8f4f8", fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
                        Configuration
                    </h1>
                    <p style={{ color: "#2dd4bf", fontSize: 13, margin: "4px 0 0", fontWeight: 500 }}>
                        Adjust system preferences and behavior
                    </p>
                </div>

                {/* Character Card */}
                <div style={{ ...sectionStyle, display: "flex", alignItems: "center", gap: 20 }}>
                    <DadAvatar />
                    <div>
                        <span style={{ ...labelStyle, marginBottom: 2 }}>CHARACTER NAME</span>
                        <div style={{ color: "#e8f4f8", fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em" }}>Dad</div>
                    </div>
                </div>

                {/* Child Info */}
                <div style={{ ...sectionStyle }}>
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

                {/* Voice Tone */}
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

                {/* Conversation Transcript */}
                <div style={sectionStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                        <label style={{ ...labelStyle, marginBottom: 0 }}>CONVERSATION TRANSCRIPT</label>
                        <button style={{ background: "none", border: "none", color: "#2dd4bf", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4, padding: 0 }}>
                            VIEW FULL <ChevronRight />
                        </button>
                    </div>

                    {/* Abdullah's message */}
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

                    {/* Dad's message */}
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

                {/* Character Instructions */}
                <div style={sectionStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                        <label style={{ ...labelStyle, marginBottom: 0 }}>CHARACTER INSTRUCTIONS</label>
                        <button style={{ background: "none", border: "none", color: "#2dd4bf", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4, padding: 0, cursor: "pointer" }}>
                            VIEW FULL <ChevronRight />
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

                {/* Action Buttons */}
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
                    <button style={{
                        padding: "13px 26px",
                        borderRadius: 30,
                        border: "1px solid #1e3a50",
                        background: "transparent",
                        color: "#8aaab8",
                        fontWeight: 600,
                        fontSize: 14,
                        fontFamily: "'DM Sans', sans-serif",
                    }}>
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