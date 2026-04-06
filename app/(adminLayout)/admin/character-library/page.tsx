"use client";
import { useState } from "react";
import CreateCharacter from "@/components/admin/create-character";

const grandmaImage = (
    <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        {/* Background */}
        <rect width="120" height="140" fill="#F5C9A0" rx="8" />
        {/* Body - dark jacket */}
        <ellipse cx="60" cy="115" rx="32" ry="30" fill="#2D4A3E" />
        {/* Inner shirt - rust/brown */}
        <ellipse cx="60" cy="118" rx="18" ry="22" fill="#8B4513" />
        {/* Neck */}
        <rect x="53" y="85" width="14" height="16" rx="4" fill="#D4956A" />
        {/* Head */}
        <ellipse cx="60" cy="72" rx="22" ry="24" fill="#D4956A" />
        {/* Hair - white/gray bun */}
        <ellipse cx="60" cy="52" rx="20" ry="12" fill="#C8C8C8" />
        <ellipse cx="72" cy="58" rx="10" ry="9" fill="#B8B8B8" />
        {/* Glasses */}
        <circle cx="52" cy="72" r="7" fill="none" stroke="#4A4A4A" strokeWidth="1.5" />
        <circle cx="68" cy="72" r="7" fill="none" stroke="#4A4A4A" strokeWidth="1.5" />
        <line x1="59" y1="72" x2="61" y2="72" stroke="#4A4A4A" strokeWidth="1.5" />
        <line x1="45" y1="72" x2="42" y2="70" stroke="#4A4A4A" strokeWidth="1.5" />
        <line x1="75" y1="72" x2="78" y2="70" stroke="#4A4A4A" strokeWidth="1.5" />
        {/* Eyes */}
        <circle cx="52" cy="72" r="3" fill="#3D2B1F" />
        <circle cx="68" cy="72" r="3" fill="#3D2B1F" />
        {/* Smile */}
        <path d="M 54 82 Q 60 87 66 82" stroke="#8B4513" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Cane */}
        <line x1="85" y1="100" x2="90" y2="138" stroke="#5C3A1E" strokeWidth="3" strokeLinecap="round" />
        <path d="M 82 100 Q 87 95 92 100" stroke="#5C3A1E" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Left arm */}
        <ellipse cx="35" cy="108" rx="8" ry="18" fill="#2D4A3E" transform="rotate(-10 35 108)" />
    </svg>
);

interface Character {
    id: number;
    name: string;
    description: string;
    category: string;
    createdDate: string;
    chats: string;
}

const characters: Character[] = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    name: "Grandma Jo",
    description: "A warm, storytelling grandmother who shares...",
    category: "FAMILY",
    createdDate: "23 December",
    chats: "1.2k",
}));

const categories = ["Heroes", "Health", "Safety", "Create New"];

export default function CharacterLibrary() {
    const [activeCategory, setActiveCategory] = useState("Create New");
    const [showCreateCharacter, setShowCreateCharacter] = useState(false);

    if (showCreateCharacter) {
        return <CreateCharacter />;
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#0f172a",
                color: "#FFFFFF",
                fontFamily: "'Segoe UI', sans-serif",
                padding: "32px",
            }}
        >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
                <div>
                    <h1 style={{ fontSize: "28px", fontWeight: "800", margin: 0, lineHeight: 1.1 }}>Character Library</h1>
                    <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#8A9BAE" }}>
                        Choose an AI companion for your child&apos;s learning journey
                    </p>
                </div>
                <button
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        backgroundColor: "transparent",
                        border: "1px solid #2A3D52",
                        borderRadius: "10px",
                        color: "#FFFFFF",
                        padding: "8px 16px",
                        fontSize: "14px",
                        cursor: "pointer",
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <line x1="2" y1="4" x2="14" y2="4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="4" y1="8" x2="12" y2="8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="6" y1="12" x2="10" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    Filter
                </button>
            </div>

            {/* Grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: "16px",
                    marginBottom: "36px",
                }}
            >
                {characters.map((char) => (
                    <div
                        key={char.id}
                        style={{
                            backgroundColor: "#16232F",
                            borderRadius: "14px",
                            overflow: "hidden",
                            cursor: "pointer",
                            transition: "transform 0.15s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                    >
                        {/* Image area */}
                        <div style={{ position: "relative", backgroundColor: "#F5C9A0", height: "160px" }}>
                            <div style={{ width: "100%", height: "100%" }}>{grandmaImage}</div>
                            <span
                                style={{
                                    position: "absolute",
                                    top: "10px",
                                    right: "10px",
                                    backgroundColor: "#2DBE8C",
                                    color: "#FFFFFF",
                                    fontSize: "10px",
                                    fontWeight: "700",
                                    padding: "3px 8px",
                                    borderRadius: "6px",
                                    letterSpacing: "0.5px",
                                }}
                            >
                                {char.category}
                            </span>
                        </div>

                        {/* Info */}
                        <div style={{ padding: "12px 14px" }}>
                            <h3 style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: "700" }}>{char.name}</h3>
                            <p style={{ margin: "0 0 10px", fontSize: "12px", color: "#8A9BAE", lineHeight: 1.4 }}>
                                &quot;{char.description}&quot;
                            </p>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <rect x="1" y="2" width="10" height="9" rx="1.5" stroke="#5A6A7A" strokeWidth="1.2" />
                                    <line x1="4" y1="1" x2="4" y2="3" stroke="#5A6A7A" strokeWidth="1.2" strokeLinecap="round" />
                                    <line x1="8" y1="1" x2="8" y2="3" stroke="#5A6A7A" strokeWidth="1.2" strokeLinecap="round" />
                                </svg>
                                <span style={{ fontSize: "11px", color: "#5A6A7A" }}>Created {char.createdDate}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M2 2h8a1 1 0 011 1v5a1 1 0 01-1 1H7L4 11V9H2a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="#5A6A7A" strokeWidth="1.2" />
                                    </svg>
                                    <span style={{ fontSize: "12px", color: "#5A6A7A" }}>{char.chats} chats</span>
                                </div>
                                <button
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "#8A9BAE",
                                        fontSize: "12px",
                                        cursor: "pointer",
                                        padding: 0,
                                    }}
                                >
                                    Select &rsaquo;
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Create Custom card */}
                <div
                    style={{
                        backgroundColor: "transparent",
                        border: "2px dashed #2A3D52",
                        borderRadius: "14px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                        minHeight: "260px",
                        cursor: "pointer",
                        transition: "border-color 0.15s ease",
                    }}
                    onClick={() => setShowCreateCharacter(true)}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2DBE8C")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2A3D52")}
                >
                    <div
                        style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "50%",
                            backgroundColor: "#1E3040",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <line x1="10" y1="4" x2="10" y2="16" stroke="#2DBE8C" strokeWidth="2" strokeLinecap="round" />
                            <line x1="4" y1="10" x2="16" y2="10" stroke="#2DBE8C" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <p style={{ margin: "0 0 4px", fontWeight: "700", fontSize: "15px" }}>Create Custom</p>
                        <p style={{ margin: 0, fontSize: "12px", color: "#5A6A7A" }}>Bring a new personality to life</p>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div>
                <h2 style={{ fontSize: "22px", fontWeight: "800", margin: "0 0 16px" }}>Categories</h2>
                <div style={{ display: "flex", gap: "10px" }}>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                setActiveCategory(cat);
                                if (cat === "Create New") {
                                    setShowCreateCharacter(true);
                                }
                            }}
                            style={{
                                padding: "8px 18px",
                                borderRadius: "20px",
                                border: activeCategory === cat ? "1.5px solid #FFFFFF" : "1.5px solid #2A3D52",
                                backgroundColor: "transparent",
                                color: activeCategory === cat ? "#FFFFFF" : "#8A9BAE",
                                fontSize: "13px",
                                fontWeight: "500",
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}