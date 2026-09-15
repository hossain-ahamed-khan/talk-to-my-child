"use client";
import { useState, type CSSProperties } from "react";
import {
    ConversationSession,
    useGetCallHistoryListQuery,
    useGetConversationDetailsQuery,
} from "@/redux/features/childSection/callHistoryApi";

type Call = ConversationSession;

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

const HistoryChevronRight = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#11b780" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const EditIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
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
            background: "#11b780",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #0f2027",
        }}>
            <EditIcon />
        </div>
    </div>
);

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

function CallRow({ call, onClick }: { call: Call; onClick: () => void }) {
    return (
        <div
            className="history-call-row"
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
                (e.currentTarget as HTMLDivElement).style.borderColor = "#11b780";
                (e.currentTarget as HTMLDivElement).style.background = "#0d2318";
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "#1a3348";
                (e.currentTarget as HTMLDivElement).style.background = "#0d1e2d";
            }}
        >
            <div className="history-call-left" style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <HistoryDadAvatar />
                <div>
                    <div className="history-call-head" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: 16, color: "#e8f4f8" }}>{call.character_name}</span>
                    </div>
                    <div className="history-call-meta" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#4a7a90" }}>
                            <CalendarIcon /> {formatDate(call.started_at)}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#4a7a90" }}>
                            <ClockIcon /> {formatTime(call.started_at)}
                        </span>
                    </div>
                    <div style={{ fontSize: 13, color: "#4a7a90" }}>
                        <span>Last message: </span>
                        <span style={{ color: "#8aaab8" }}>&quot;{call.last_message.content}&quot;</span>
                    </div>
                    <div style={{ fontSize: 13, color: "#4a7a90", marginTop: 3 }}>
                        <span>Child: </span>
                        <span style={{ color: "#8aaab8" }}>{call.child_name}</span>
                    </div>
                </div>
            </div>

            <div className="history-call-chevron" style={{ paddingLeft: 12 }}>
                <HistoryChevronRight />
            </div>
        </div>
    );
}

function CallHistory({ onSelectCall }: { onSelectCall: (call: Call) => void }) {
    const { data, isLoading, isError } = useGetCallHistoryListQuery();
    const calls = data?.data ?? [];

    return (
        <div style={{
            background: "#091520",
            minHeight: "100vh",
            padding: "clamp(16px, 3vw, 40px) clamp(12px, 3vw, 24px)",
            fontFamily: "'DM Sans', sans-serif",
            position: "relative",
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
                * { box-sizing: border-box; }
                .history-shell {
                    width: 100%;
                    margin: 0;
                }
                .history-call-row {
                    width: 100%;
                    gap: 12px;
                }
                @media (max-width: 900px) {
                    .history-call-row {
                        align-items: flex-start !important;
                    }
                    .history-call-left {
                        width: 100%;
                    }
                }
                @media (max-width: 640px) {
                    .history-call-row {
                        flex-direction: column;
                        align-items: stretch !important;
                    }
                    .history-call-head {
                        flex-wrap: wrap;
                    }
                    .history-call-meta {
                        flex-wrap: wrap;
                        row-gap: 6px;
                    }
                    .history-call-chevron {
                        display: none;
                    }
                }
            `}</style>

            <div className="history-shell" style={{ width: "100%", margin: "0 auto" }}>
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
                    <p style={{ margin: "6px 0 0", fontSize: 14, color: "#11b780", fontWeight: 500 }}>
                        Review and replay your recent learning conversations.
                    </p>
                </div>

                {isLoading && <p style={{ color: "#8aaab8", fontSize: 14 }}>Loading call history...</p>}
                {isError && <p style={{ color: "#ff8b8b", fontSize: 14 }}>Failed to load call history. Please try again.</p>}
                {!isLoading && !isError && calls.length === 0 && (
                    <p style={{ color: "#8aaab8", fontSize: 14 }}>No calls yet.</p>
                )}
                {!isLoading && !isError && calls.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {calls.map(call => (
                            <CallRow key={call.id} call={call} onClick={() => onSelectCall(call)} />
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}

function ConfigurationPanel({ call, onBack }: { call: Call; onBack: () => void }) {
    const { data, isLoading, isError } = useGetConversationDetailsQuery(call.id);

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
            padding: "clamp(16px, 3vw, 32px) clamp(12px, 3vw, 24px)",
            fontFamily: "'DM Sans', sans-serif",
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
                input::placeholder { color: #3a5a70; }
                textarea::placeholder { color: #3a5a70; }
                input:focus, textarea:focus {
                    border-color: #11b780 !important;
                    box-shadow: 0 0 0 3px rgba(17,183,128,0.12);
                }
                button { cursor: pointer; }
                .config-shell {
                    width: 100%;
                    margin: 0;
                }
                .config-profile {
                    width: 100%;
                }
                .config-fields {
                    width: 100%;
                }
                .config-actions {
                    width: 100%;
                }
                .config-actions > button {
                    flex: 1;
                    min-width: 160px;
                }
                @media (max-width: 900px) {
                    .config-profile {
                        flex-wrap: wrap;
                        align-items: flex-start;
                    }
                }
                @media (max-width: 640px) {
                    .config-fields {
                        flex-direction: column;
                    }
                    .config-age {
                        width: 100% !important;
                    }
                    .config-bubble {
                        max-width: 100% !important;
                    }
                    .config-actions {
                        flex-direction: column;
                    }
                    .config-actions > button {
                        width: 100%;
                    }
                }
            `}</style>

            <div className="config-shell" style={{ width: "100%", margin: "0 auto" }}>
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
                        Conversation Details
                    </h1>
                    <p style={{ color: "#11b780", fontSize: 13, margin: "4px 0 0", fontWeight: 500 }}>
                        Review the conversation with {call.character_name}
                    </p>
                </div>

                <div className="config-profile" style={{ ...sectionStyle, display: "flex", alignItems: "center", gap: 20 }}>
                    <ConfigDadAvatar />
                    <div>
                        <span style={{ ...labelStyle, marginBottom: 2 }}>CHARACTER NAME</span>
                        <div style={{ color: "#e8f4f8", fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em" }}>{call.character_name}</div>
                    </div>
                </div>

                <div style={sectionStyle}>
                    <div className="config-fields" style={{ display: "flex", gap: 16 }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>CHILD NAME</label>
                            <div style={{ ...inputStyle, minHeight: 45 }}>{call.child_name}</div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>STARTED</label>
                            <div style={{ ...inputStyle, minHeight: 45 }}>{formatDate(call.started_at)} at {formatTime(call.started_at)}</div>
                        </div>
                    </div>
                </div>

                <div style={sectionStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                        <label style={{ ...labelStyle, marginBottom: 0 }}>CONVERSATION TRANSCRIPT</label>
                        <span style={{ fontSize: 12, color: "#11b780", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#11b780", display: "inline-block" }} />
                            {isLoading ? "Loading" : isError ? "Unavailable" : "Loaded"}
                        </span>
                    </div>
                    {isLoading && <p style={{ color: "#8aaab8", fontSize: 14 }}>Loading conversation...</p>}
                    {isError && <p style={{ color: "#ff8b8b", fontSize: 14 }}>Failed to load this conversation. Please try again.</p>}
                    {!isLoading && !isError && data?.data.length === 0 && (
                        <p style={{ color: "#8aaab8", fontSize: 14 }}>No messages in this conversation.</p>
                    )}
                    {!isLoading && !isError && data?.data.map((message, index) => (
                        <div key={`${message.timestamp}-${index}`} style={{ display: "flex", justifyContent: message.role === "user" ? "flex-end" : "flex-start", marginBottom: 14 }}>
                            <div className="config-bubble" style={{ maxWidth: "80%" }}>
                                <div style={{
                                    background: message.role === "user" ? "#1a3a52" : "#132535",
                                    border: message.role === "user" ? "none" : "1px solid #1a3a52",
                                    borderRadius: message.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                                    padding: "12px 16px",
                                    color: "#e8f4f8",
                                    fontSize: 14,
                                    lineHeight: 1.5,
                                }}>
                                    {message.content}
                                </div>
                                <div style={{ marginTop: 6, textAlign: message.role === "user" ? "right" : "left" }}>
                                    <span style={{ fontSize: 11, color: "#3a5a70" }}>{message.role.toUpperCase()} • {formatTime(message.timestamp)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default function ParentHistoryPage() {
    const [selectedCall, setSelectedCall] = useState<Call | null>(null);

    if (selectedCall) {
        return <ConfigurationPanel call={selectedCall} onBack={() => setSelectedCall(null)} />;
    }

    return <CallHistory onSelectCall={setSelectedCall} />;
}