"use client";
import { useState, useRef, useEffect } from "react";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const cannedResponses = [
    "Thank you for reaching out! Let me look into that for you.",
    "Could you please provide more details about the issue?",
    "I'll escalate this to our technical team right away.",
    "Your issue has been resolved. Is there anything else I can help with?",
    "I'm sorry for the inconvenience. Let me fix that immediately.",
];

const queueItems = [
    {
        id: 1,
        name: "Marcus V.",
        preview: "Payment failed on last transaction...",
        tag: "High Priority Action Required",
        tagColor: "#f97316",
        dot: "#f97316",
        active: false,
    },
    {
        id: 2,
        name: "Elena R.",
        preview: "Need help setting up family profile.",
        sub: "Waiting 2m 14s",
        dot: "#94a3b8",
        active: false,
    },
    {
        id: 3,
        name: "Zayn K.",
        preview: "How do I change my email address?",
        sub: "Waiting 5m 45s",
        dot: "#f97316",
        active: false,
    },
];

type Message = {
    id: number;
    from: "user" | "agent";
    text: string;
    time: string;
};

const initialMessages: Message[] = [
    { id: 1, from: "user", text: "Hi, I'm having trouble with the subscription renewal. It says my card is invalid.", time: "14:02" },
    { id: 2, from: "agent", text: "Hello Sarah! Let me look into that for you immediately. Could you confirm the last 4 digits of the card?", time: "14:03" },
    { id: 3, from: "user", text: "It's 4452. I already checked with my bank and they said the block isn't on their end.", time: "14:05" },
];

export default function SupportChat() {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(true);
    const [showCanned, setShowCanned] = useState(false);
    const [selectedQueue, setSelectedQueue] = useState<number | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const now = () => {
        const d = new Date();
        return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
    };

    const send = () => {
        const text = input.trim();
        if (!text) return;
        setMessages((prev) => [...prev, { id: Date.now(), from: "agent", text, time: now() }]);
        setInput("");
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
    };

    const handleCanned = (text: string) => {
        setInput(text);
        setShowCanned(false);
    };

    return (
        <div
            style={{
                background: "#0f1623",
                minHeight: "100vh",
                fontFamily: dmSans.style.fontFamily,
                color: "#e2e8f0",
                display: "grid",
                gridTemplateColumns: "268px 1fr",
                boxSizing: "border-box",
            }}
        >
            {/* Left — Priority Queue */}
            <div style={{ borderRight: "1px solid #1e2d42", display: "flex", flexDirection: "column" }}>
                {/* Queue Header */}
                <div
                    style={{
                        padding: "18px 20px 14px",
                        borderBottom: "1px solid #1e2d42",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, color: "#94a3b8" }}>
                        PRIORITY QUEUE
                    </span>
                    <span style={{ fontSize: 12, color: "#64748b" }}>Wait Time: 4m</span>
                </div>

                {/* Queue Items */}
                <div style={{ flex: 1, overflowY: "auto" }}>
                    {queueItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setSelectedQueue(item.id)}
                            style={{
                                padding: "18px 20px",
                                borderBottom: "1px solid #1e2d42",
                                cursor: "pointer",
                                background: selectedQueue === item.id ? "#161e2e" : "transparent",
                                transition: "background 0.15s",
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                                <span style={{ fontWeight: 600, fontSize: 15 }}>{item.name}</span>
                                <div
                                    style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: "50%",
                                        background: item.dot,
                                        flexShrink: 0,
                                    }}
                                />
                            </div>
                            <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: item.tag || item.sub ? 6 : 0 }}>
                                {item.preview}
                            </div>
                            {item.tag && (
                                <div style={{ fontSize: 11, fontWeight: 600, color: item.tagColor }}>
                                    {item.tag}
                                </div>
                            )}
                            {item.sub && (
                                <div style={{ fontSize: 11, color: "#64748b" }}>{item.sub}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right — Chat */}
            <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                {/* Chat Header */}
                <div
                    style={{
                        padding: "14px 24px",
                        borderBottom: "1px solid #1e2d42",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#0f1623",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #b45309, #92400e)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 16,
                                fontWeight: 700,
                                color: "#fff",
                                overflow: "hidden",
                                flexShrink: 0,
                            }}
                        >
                            SJ
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 16 }}>Sarah Jenkins</div>
                            <div style={{ fontSize: 12, color: "#38bdf8", fontWeight: 600, letterSpacing: 0.5 }}>
                                ENTERPRISE
                            </div>
                        </div>
                    </div>
                    <button
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "#94a3b8",
                            fontSize: 20,
                            cursor: "pointer",
                            padding: "4px 8px",
                        }}
                    >
                        ⋮
                    </button>
                </div>

                {/* Messages */}
                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "24px 28px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 0,
                    }}
                >
                    {messages.map((msg, i) => {
                        const isUser = msg.from === "user";
                        const showTime =
                            i === 0 || messages[i - 1].from !== msg.from || messages[i - 1].time !== msg.time;

                        return (
                            <div key={msg.id}>
                                {showTime && isUser && (
                                    <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6, marginTop: i > 0 ? 20 : 0 }}>
                                        {msg.time}
                                    </div>
                                )}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: isUser ? "flex-start" : "flex-end",
                                        marginBottom: 4,
                                        marginTop: showTime && !isUser ? 20 : 0,
                                    }}
                                >
                                    {!isUser && showTime && (
                                        <div style={{ fontSize: 11, color: "#64748b", alignSelf: "flex-end", marginRight: 8, marginBottom: 2 }}>
                                            {msg.time}
                                        </div>
                                    )}
                                    <div
                                        style={{
                                            maxWidth: "42%",
                                            background: isUser ? "#1e2d42" : "#2563eb",
                                            color: "#e2e8f0",
                                            borderRadius: isUser ? "4px 14px 14px 14px" : "14px 4px 14px 14px",
                                            padding: "12px 16px",
                                            fontSize: 14,
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {isTyping && (
                        <div style={{ marginTop: 12 }}>
                            <span style={{ fontSize: 13, color: "#64748b", fontStyle: "italic" }}>
                                ••• Sarah is typing...
                            </span>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Canned Responses Dropdown */}
                <div style={{ padding: "0 20px", position: "relative" }}>
                    <button
                        onClick={() => setShowCanned(!showCanned)}
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background: "#161e2e",
                            border: "1px solid #1e2d42",
                            borderRadius: 8,
                            padding: "12px 16px",
                            color: "#64748b",
                            fontSize: 13,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            marginBottom: 8,
                        }}
                    >
                        <span>Canned Responses...</span>
                        <span style={{ fontSize: 11 }}>{showCanned ? "▲" : "▼"}</span>
                    </button>

                    {showCanned && (
                        <div
                            style={{
                                position: "absolute",
                                bottom: "calc(100% + 4px)",
                                left: 20,
                                right: 20,
                                background: "#1e2d42",
                                border: "1px solid #2d3f56",
                                borderRadius: 8,
                                overflow: "hidden",
                                zIndex: 10,
                            }}
                        >
                            {cannedResponses.map((r, i) => (
                                <div
                                    key={i}
                                    onClick={() => handleCanned(r)}
                                    style={{
                                        padding: "12px 16px",
                                        fontSize: 13,
                                        color: "#e2e8f0",
                                        cursor: "pointer",
                                        borderBottom: i < cannedResponses.length - 1 ? "1px solid #2d3f56" : "none",
                                        transition: "background 0.1s",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "#2d3f56")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                >
                                    {r}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Input */}
                <div
                    style={{
                        padding: "0 20px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && send()}
                        placeholder="Type a message..."
                        style={{
                            flex: 1,
                            background: "#161e2e",
                            border: "1px solid #1e2d42",
                            borderRadius: 8,
                            padding: "12px 16px",
                            color: "#e2e8f0",
                            fontSize: 14,
                            outline: "none",
                            fontFamily: "inherit",
                        }}
                    />
                    <button
                        onClick={send}
                        style={{
                            width: 42,
                            height: 42,
                            borderRadius: 8,
                            background: "#2563eb",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}