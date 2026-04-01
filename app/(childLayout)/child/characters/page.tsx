"use client";

import Image from "next/image";

const PhoneIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const MicIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
);

type Character = {
    id: number;
    name: string;
    specialty: string;
    available: boolean;
    avatar: string;
};

const characters: Character[] = [
    { id: 1, name: "Dr. Sarah", specialty: "Medical & Hygiene Expert", available: true, avatar: "https://i.pravatar.cc/150?img=47" },
    { id: 2, name: "Dr. Emily", specialty: "Medical & Hygiene Expert", available: true, avatar: "https://i.pravatar.cc/150?img=44" },
    { id: 3, name: "Dr. James", specialty: "Medical & Hygiene Expert", available: true, avatar: "https://i.pravatar.cc/150?img=68" },
    { id: 4, name: "Dr. Maria", specialty: "Medical & Hygiene Expert", available: true, avatar: "https://i.pravatar.cc/150?img=49" },
    { id: 5, name: "Dr. Aiden", specialty: "Medical & Hygiene Expert", available: true, avatar: "https://i.pravatar.cc/150?img=52" },
    { id: 6, name: "Dr. Priya", specialty: "Medical & Hygiene Expert", available: true, avatar: "https://i.pravatar.cc/150?img=45" },
];

function CharacterCard({ character }: { character: Character }) {
    return (
        <div
            style={{
                backgroundColor: "#0f1e33",
                border: "1px solid #162845",
                borderRadius: 14,
                padding: "16px 18px 14px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                transition: "border-color 0.2s",
                cursor: "pointer",
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "#1e3a5f")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "#162845")}
        >
            {/* Top row: avatar + name + call button */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    {/* Avatar */}
                    <div style={{ position: "relative", flexShrink: 0 }}>
                        <Image
                            src={character.avatar}
                            alt={character.name}
                            width={60}
                            height={60}
                            style={{
                                borderRadius: 10,
                                objectFit: "cover",
                                display: "block",
                            }}
                        />
                        {character.available && (
                            <span style={{
                                position: "absolute",
                                bottom: -3,
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: 10,
                                height: 10,
                                backgroundColor: "#22c55e",
                                borderRadius: "50%",
                                border: "2px solid #0f1e33",
                            }} />
                        )}
                    </div>

                    {/* Name + availability */}
                    <div>
                        <p style={{ fontSize: 16, fontWeight: 700, color: "#ffffff", margin: "0 0 4px" }}>
                            {character.name}
                        </p>
                        {character.available && (
                            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                <span style={{
                                    width: 8,
                                    height: 8,
                                    backgroundColor: "#22c55e",
                                    borderRadius: "50%",
                                    display: "inline-block",
                                }} />
                                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#22c55e", textTransform: "uppercase" }}>
                                    Available
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Call button */}
                <button
                    style={{
                        width: 46,
                        height: 46,
                        borderRadius: "50%",
                        backgroundColor: "#16a34a",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        flexShrink: 0,
                        transition: "background-color 0.2s, transform 0.15s",
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#15803d";
                        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.07)";
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#16a34a";
                        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                    }}
                >
                    <PhoneIcon />
                </button>
            </div>

            {/* Specialty */}
            <p style={{ fontSize: 12, color: "#475569", margin: 0, paddingLeft: 2 }}>
                {character.specialty}
            </p>
        </div>
    );
}

export default function PopularCharacters() {
    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#0d1526",
            padding: "28px 24px",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}>
            <div style={{ maxWidth: 980, margin: "0 auto" }}>

                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: "#ffffff", margin: 0 }}>
                        Popular Characters
                    </h2>
                    <button style={{
                        background: "none",
                        border: "none",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#22c55e",
                        cursor: "pointer",
                        padding: 0,
                    }}>
                        View All
                    </button>
                </div>

                {/* 2-column grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {characters.map(c => (
                        <CharacterCard key={c.id} character={c} />
                    ))}
                </div>

            </div>

            {/* Floating mic button */}
            <button
                style={{
                    position: "fixed",
                    bottom: 28,
                    right: 28,
                    width: 54,
                    height: 54,
                    borderRadius: "50%",
                    backgroundColor: "#16a34a",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(22,163,74,0.4)",
                    transition: "transform 0.15s, background-color 0.2s",
                }}
                onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#15803d";
                    (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
                }}
                onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#16a34a";
                    (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                }}
            >
                <MicIcon />
            </button>
        </div>
    );
}