"use client";

import { useState } from "react";
import { ChevronDown, Phone, Paperclip, Mic, Send, Waves } from "lucide-react";

// Mock characters for the selector
const CHARACTERS = [
    { id: 1, name: "Dad", avatar: null, initials: "D", color: "#3b82f6" },
    { id: 2, name: "Mom", avatar: null, initials: "M", color: "#ec4899" },
    { id: 3, name: "Teacher", avatar: null, initials: "T", color: "#8b5cf6" },
];

export default function ParentHomePage() {
    const [message, setMessage] = useState("");
    const [selectedChar, setSelectedChar] = useState(CHARACTERS[0]);
    const [showCharPicker, setShowCharPicker] = useState(false);
    const [isRecording, setIsRecording] = useState(false);

    // Greeting based on time of day
    const hour = new Date().getHours();
    const greeting =
        hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

    return (
        <div
            className="relative flex flex-col"
            style={{
                minHeight: "calc(100vh - 60px)",
                background: "#0f172a",
                fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            }}
        >
            {/* Subtle radial glow in background */}
            <div
                style={{
                    position: "absolute",
                    top: "20%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 600,
                    height: 400,
                    borderRadius: "50%",
                    background: "radial-gradient(ellipse, rgba(16,185,129,0.04) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />

            {/* Phone call FAB — top right */}
            <button
                style={{
                    position: "absolute",
                    top: 24,
                    right: 24,
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 20px rgba(16,185,129,0.4)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    zIndex: 10,
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.08)";
                    e.currentTarget.style.boxShadow = "0 6px 28px rgba(16,185,129,0.55)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(16,185,129,0.4)";
                }}
            >
                <Phone className="w-5 h-5 text-white" />
            </button>

            {/* Center content area */}
            <div
                className="flex-1 flex flex-col items-center justify-center"
                style={{ paddingBottom: 120, paddingTop: 48 }}
            >
                {/* Greeting */}
                <h1
                    style={{
                        fontSize: 36,
                        fontWeight: 800,
                        color: "#ffffff",
                        margin: "0 0 10px",
                        letterSpacing: "-0.5px",
                        textAlign: "center",
                    }}
                >
                    {greeting}, Sarah
                </h1>
                <p
                    style={{
                        fontSize: 15,
                        color: "#4ade80",
                        margin: "0 0 36px",
                        textAlign: "center",
                        fontWeight: 500,
                    }}
                >
                    How can we help you and your child today?
                </p>

                {/* Character selector pill */}
                <div style={{ position: "relative" }}>
                    <button
                        onClick={() => setShowCharPicker((v) => !v)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            borderRadius: 99,
                            padding: "8px 16px 8px 8px",
                            cursor: "pointer",
                            transition: "background 0.2s, border-color 0.2s",
                            backdropFilter: "blur(8px)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                            e.currentTarget.style.borderColor = "rgba(74,222,128,0.4)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                        }}
                    >
                        <span
                            style={{
                                fontSize: 13,
                                color: "rgba(255,255,255,0.6)",
                                fontWeight: 500,
                                marginRight: 4,
                            }}
                        >
                            Character in use :
                        </span>
                        {/* Avatar */}
                        <div
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                background: selectedChar.color,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontSize: 13,
                                fontWeight: 700,
                                flexShrink: 0,
                            }}
                        >
                            {selectedChar.initials}
                        </div>
                        <ChevronDown
                            className="w-4 h-4"
                            style={{ color: "rgba(255,255,255,0.5)" }}
                        />
                    </button>

                    {/* Character dropdown */}
                    {showCharPicker && (
                        <div
                            style={{
                                position: "absolute",
                                top: "calc(100% + 8px)",
                                left: "50%",
                                transform: "translateX(-50%)",
                                background: "#1a2535",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: 16,
                                padding: "8px",
                                minWidth: 180,
                                boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
                                zIndex: 20,
                            }}
                        >
                            {CHARACTERS.map((char) => (
                                <button
                                    key={char.id}
                                    onClick={() => {
                                        setSelectedChar(char);
                                        setShowCharPicker(false);
                                    }}
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                        padding: "10px 12px",
                                        borderRadius: 10,
                                        border: "none",
                                        background:
                                            selectedChar.id === char.id
                                                ? "rgba(16,185,129,0.12)"
                                                : "transparent",
                                        cursor: "pointer",
                                        transition: "background 0.15s",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (selectedChar.id !== char.id)
                                            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                                    }}
                                    onMouseLeave={(e) => {
                                        if (selectedChar.id !== char.id)
                                            e.currentTarget.style.background = "transparent";
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 30,
                                            height: 30,
                                            borderRadius: "50%",
                                            background: char.color,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "#fff",
                                            fontSize: 12,
                                            fontWeight: 700,
                                        }}
                                    >
                                        {char.initials}
                                    </div>
                                    <span
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 600,
                                            color:
                                                selectedChar.id === char.id ? "#4ade80" : "#c5d1de",
                                        }}
                                    >
                                        {char.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Audio waveform FAB — bottom right above input */}
            <button
                style={{
                    position: "absolute",
                    bottom: 88,
                    right: 24,
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 20px rgba(59,130,246,0.4)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    zIndex: 10,
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.08)";
                    e.currentTarget.style.boxShadow = "0 6px 28px rgba(59,130,246,0.55)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(59,130,246,0.4)";
                }}
            >
                <Waves className="w-5 h-5 text-white" />
            </button>

            {/* Bottom message input bar */}
            <div
                style={{
                    position: "sticky",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "16px 24px 20px",
                    background:
                        "linear-gradient(to top, #0d1826 60%, transparent)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 99,
                        padding: "8px 8px 8px 16px",
                        backdropFilter: "blur(12px)",
                        transition: "border-color 0.2s",
                    }}
                    onFocus={() => { }}
                >
                    {/* Attachment button */}
                    <button
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 6,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "rgba(255,255,255,0.4)",
                            transition: "color 0.15s, background 0.15s",
                            flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                            e.currentTarget.style.background = "none";
                        }}
                    >
                        <Paperclip className="w-4 h-4" />
                    </button>

                    {/* Text input */}
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && message.trim()) setMessage("");
                        }}
                        placeholder={`Message ${selectedChar.name}...`}
                        style={{
                            flex: 1,
                            background: "none",
                            border: "none",
                            outline: "none",
                            fontSize: 14,
                            color: "#c5d1de",
                            caretColor: "#4ade80",
                        }}
                        className="placeholder:text-[rgba(255,255,255,0.3)]"
                    />

                    {/* Send button (teal) */}
                    <button
                        onClick={() => setMessage("")}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background:
                                message.trim()
                                    ? "linear-gradient(135deg, #10b981, #059669)"
                                    : "rgba(255,255,255,0.08)",
                            border: "none",
                            cursor: message.trim() ? "pointer" : "default",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            transition: "background 0.2s, transform 0.15s",
                            boxShadow: message.trim()
                                ? "0 2px 12px rgba(16,185,129,0.35)"
                                : "none",
                        }}
                    >
                        <Send
                            className="w-4 h-4"
                            style={{
                                color: message.trim()
                                    ? "#fff"
                                    : "rgba(255,255,255,0.3)",
                                transform: "rotate(-5deg)",
                            }}
                        />
                    </button>

                    {/* Mic button */}
                    <button
                        onClick={() => setIsRecording((v) => !v)}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background: isRecording
                                ? "linear-gradient(135deg, #ef4444, #dc2626)"
                                : "rgba(255,255,255,0.08)",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            transition: "background 0.2s",
                            boxShadow: isRecording
                                ? "0 2px 12px rgba(239,68,68,0.4)"
                                : "none",
                        }}
                    >
                        <Mic
                            className="w-4 h-4"
                            style={{
                                color: isRecording ? "#fff" : "rgba(255,255,255,0.5)",
                            }}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}