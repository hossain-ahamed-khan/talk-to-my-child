"use client";

import { useState } from "react";
import { CharacterProfile, useGetCharacterListForChildApiQuery } from "@/redux/features/childSection/getAllCharacters";
import { useCreateCallMutation } from "@/redux/features/childSection/callApi";
import Image from "next/image";
import { toast } from "sonner";
import VoiceCallModal from "@/components/child/VoiceCallModal";

const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "";
const FALLBACK_AVATAR = "/images/character-placeholder.png";

interface ActiveCall {
    wsUrl: string;
    characterName: string;
    characterAvatar?: string;
}

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

function resolveAvatarSrc(profileImage: string | null) {
    if (!profileImage) return FALLBACK_AVATAR;
    if (profileImage.startsWith("http")) return profileImage;
    return `${MEDIA_BASE_URL}${profileImage}`;
}

function CharacterCard({
    character,
    onCallStart,
}: {
    character: CharacterProfile;
    onCallStart: (call: ActiveCall) => void;
}) {
    const avatarSrc = resolveAvatarSrc(character.profile_image);
    const isAvailable = true;
    const [createCall, { isLoading: isCalling }] = useCreateCallMutation();

    const handleCall = async () => {
        try {
            const res = await createCall(character.id).unwrap();
            onCallStart({
                wsUrl: res.data.ws_url,
                characterName: res.data.character.name,
                characterAvatar: character.profile_image ? avatarSrc : undefined,
            });
        } catch (err) {
            console.error(err);
            toast.error("Couldn't start the call. Please try again.");
        }
    };

    return (
        <div
            className="character-card"
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
            <div className="character-card-top" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div className="character-card-profile" style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ position: "relative", flexShrink: 0 }}>
                        {character.profile_image ? (
                            <Image
                                src={avatarSrc}
                                alt={character.name}
                                width={60}
                                height={60}
                                style={{
                                    borderRadius: 10,
                                    objectFit: "cover",
                                    display: "block",
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 10,
                                    backgroundColor: "#1e3a5f",
                                    color: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 22,
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                }}
                            >
                                {character.name
                                    .trim()
                                    .split(/\s+/)
                                    .slice(0, 2)
                                    .map((word) => word[0])
                                    .join("")}
                            </div>
                        )}

                        {isAvailable && (
                            <span
                                style={{
                                    position: "absolute",
                                    bottom: -3,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    width: 10,
                                    height: 10,
                                    backgroundColor: "#11b780",
                                    borderRadius: "50%",
                                    border: "2px solid #0f1e33",
                                }}
                            />
                        )}
                    </div>

                    <div>
                        <p style={{ fontSize: 16, fontWeight: 700, color: "#ffffff", margin: "0 0 4px" }}>
                            {character.name}
                        </p>
                        {isAvailable && (
                            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                <span style={{
                                    width: 8,
                                    height: 8,
                                    backgroundColor: "#11b780",
                                    borderRadius: "50%",
                                    display: "inline-block",
                                }} />
                                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#11b780", textTransform: "uppercase" }}>
                                    Available
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <button
                    className="character-call-btn"
                    onClick={handleCall}
                    disabled={isCalling}
                    style={{
                        width: 46,
                        height: 46,
                        borderRadius: "50%",
                        backgroundColor: "#11b780",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: isCalling ? "default" : "pointer",
                        flexShrink: 0,
                        opacity: isCalling ? 0.6 : 1,
                        transition: "background-color 0.2s, transform 0.15s",
                    }}
                    onMouseEnter={e => {
                        if (isCalling) return;
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0d9668";
                        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.07)";
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#11b780";
                        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                    }}
                >
                    <PhoneIcon />
                </button>
            </div>

            <p style={{ fontSize: 12, color: "#475569", margin: 0, paddingLeft: 2 }}>
                {character.role}
            </p>
        </div>
    );
}

function CharactersSkeleton() {
    return (
        <div className="characters-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    style={{
                        backgroundColor: "#0f1e33",
                        border: "1px solid #162845",
                        borderRadius: 14,
                        padding: "16px 18px 14px",
                        height: 96,
                        animation: "pulse 1.5s ease-in-out infinite",
                    }}
                />
            ))}
        </div>
    );
}

export default function PopularCharacters() {
    const { data: characters, isLoading, isError, refetch } = useGetCharacterListForChildApiQuery();
    const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#0d1526",
            padding: "clamp(12px, 3vw, 28px) clamp(10px, 3vw, 24px)",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}>
            <style>{`
                * { box-sizing: border-box; }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                .characters-shell { width: 100%; margin: 0; }
                .characters-header { width: 100%; gap: 12px; }
                .characters-grid {
                    width: 100%;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 12px;
                }
                .character-card { width: 100%; }
                .characters-fab {
                    right: clamp(10px, 2.5vw, 28px);
                    bottom: clamp(10px, 2.5vw, 28px);
                }
                @media (max-width: 900px) {
                    .characters-grid { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
                }
                @media (max-width: 640px) {
                    .characters-header { flex-wrap: wrap; align-items: flex-start !important; }
                    .characters-grid { grid-template-columns: 1fr; gap: 10px; }
                    .character-card { padding: 14px; }
                    .character-card-top { align-items: flex-start !important; }
                    .character-card-profile { min-width: 0; }
                    .character-call-btn { width: 42px !important; height: 42px !important; }
                    .characters-fab { width: 48px !important; height: 48px !important; }
                }
                @media (max-width: 380px) {
                    .character-card-top { flex-direction: column; }
                    .character-call-btn { align-self: flex-end; }
                }
            `}</style>

            <div className="characters-shell" style={{ width: "100%", margin: "0 auto" }}>
                <div className="characters-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: "#ffffff", margin: 0 }}>
                        Popular Characters
                    </h2>
                    <button style={{
                        background: "none",
                        border: "none",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#11b780",
                        cursor: "pointer",
                        padding: 0,
                    }}>
                        View All
                    </button>
                </div>

                {isLoading && <CharactersSkeleton />}

                {isError && (
                    <div style={{
                        backgroundColor: "#0f1e33",
                        border: "1px solid #3a1e1e",
                        borderRadius: 14,
                        padding: "24px",
                        textAlign: "center",
                    }}>
                        <p style={{ color: "#f87171", fontSize: 14, margin: "0 0 12px" }}>
                            Couldn&apos;t load characters. Please try again.
                        </p>
                        <button
                            onClick={() => refetch()}
                            style={{
                                background: "none",
                                border: "1px solid #11b780",
                                color: "#11b780",
                                borderRadius: 8,
                                padding: "6px 14px",
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {!isLoading && !isError && characters && characters.length === 0 && (
                    <p style={{ color: "#475569", fontSize: 14 }}>No characters available yet.</p>
                )}

                {!isLoading && !isError && characters && characters.length > 0 && (
                    <div className="characters-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
                        {characters.map(c => (
                            <CharacterCard key={c.id} character={c} onCallStart={setActiveCall} />
                        ))}
                    </div>
                )}
            </div>

            {activeCall && (
                <VoiceCallModal
                    wsUrl={activeCall.wsUrl}
                    characterName={activeCall.characterName}
                    characterAvatar={activeCall.characterAvatar}
                    onClose={() => setActiveCall(null)}
                />
            )}

            <button
                className="characters-fab"
                style={{
                    position: "fixed",
                    bottom: 28,
                    right: 28,
                    width: 54,
                    height: 54,
                    borderRadius: "50%",
                    backgroundColor: "#11b780",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(17,183,128,0.4)",
                    transition: "transform 0.15s, background-color 0.2s",
                }}
                onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0d9668";
                    (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
                }}
                onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#11b780";
                    (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                }}
            >
                <MicIcon />
            </button>
        </div>
    );
}