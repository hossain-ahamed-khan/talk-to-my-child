"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

import { selectToken } from "@/redux/features/auth/authSlice";
import {
    type CharacterProfile,
    useGetCharacterListApiQuery,
} from "@/redux/features/parent/characters/characterList";
import { useAppSelector } from "@/redux/hooks";

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL ?? "";

function resolveImageSrc(value: string | null) {
    if (!value) return "";
    if (value.startsWith("http")) return value;
    return `${IMAGE_BASE_URL}${value}`;
}

function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");
}

function formatDate(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "just now";

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function getStoredCharacter(id: string) {
    if (typeof window === "undefined") return null;

    const storedCharacter = window.sessionStorage.getItem(`character:${id}`);
    if (!storedCharacter) return null;

    try {
        return JSON.parse(storedCharacter) as CharacterProfile;
    } catch {
        return null;
    }
}

export default function CharacterDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const token = useAppSelector(selectToken);
    const { data: characters = [], isLoading, isError } = useGetCharacterListApiQuery(undefined, {
        skip: !token,
    });

    const character = characters.find((item) => item.id === Number(id)) ?? getStoredCharacter(id);

    return (
        <div style={styles.pageShell}>
            <main style={styles.pageFrame}>
                <Link href="/parent/characters" style={styles.backLink}>
                    <ArrowLeft size={17} />
                    Back to characters
                </Link>

                {!token ? (
                    <StateMessage title="Sign in to view this character" text="Character details are available to the authenticated parent account." />
                ) : isLoading ? (
                    <div style={styles.loadingCard} aria-label="Loading character details" />
                ) : isError ? (
                    <StateMessage title="Unable to load character" text="Check the API connection and try again." />
                ) : !character ? (
                    <StateMessage title="Character not found" text="This character may have been removed or the link may be invalid." />
                ) : (
                    <CharacterDetails character={character} />
                )}
            </main>
        </div>
    );
}

function CharacterDetails({ character }: { character: CharacterProfile }) {
    return (
        <article style={styles.detailsCard}>
            <div style={styles.heroRow}>
                <div style={styles.avatarWrap}>
                    {character.profile_image ? (
                        <Image
                            src={resolveImageSrc(character.profile_image)}
                            alt={character.name}
                            width={220}
                            height={220}
                            style={styles.avatarImage}
                        />
                    ) : (
                        <span style={styles.avatarFallback}>{getInitials(character.name)}</span>
                    )}
                </div>
                <div>
                    <p style={styles.kicker}>Character profile</p>
                    <h1 style={styles.title}>{character.name}</h1>
                    <p style={styles.subtitle}>
                        {character.gender} · {character.age} years old
                    </p>
                    <div style={styles.tagRow}>
                        <span style={styles.tag}>{character.category}</span>
                        <span style={styles.tagSoft}>{character.role}</span>
                    </div>
                </div>
            </div>

            <section style={styles.descriptionSection}>
                <h2 style={styles.sectionTitle}>About {character.name}</h2>
                <p style={styles.description}>{character.description || "No description has been added yet."}</p>
            </section>

            <dl style={styles.infoGrid}>
                <InfoItem label="Created" value={formatDate(character.created_at)} />
                <InfoItem label="Last updated" value={formatDate(character.updated_at)} />
                <InfoItem label="Created by" value={character.created_by || "Unknown"} />
                <InfoItem label="Voice sample" value={character.voice_sample ? "Available" : "Not added"} />
            </dl>
        </article>
    );
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div style={styles.infoItem}>
            <dt style={styles.infoLabel}>{label}</dt>
            <dd style={styles.infoValue}>{value}</dd>
        </div>
    );
}

function StateMessage({ title, text }: { title: string; text: string }) {
    return (
        <section style={styles.stateCard}>
            <h1 style={styles.stateTitle}>{title}</h1>
            <p style={styles.stateText}>{text}</p>
        </section>
    );
}

const styles: Record<string, React.CSSProperties> = {
    pageShell: { minHeight: "100vh", padding: "clamp(16px, 2.5vw, 28px)", background: "#091520", boxSizing: "border-box" },
    pageFrame: { width: "100%", maxWidth: "980px", margin: "0 auto", color: "#e8f4f8", fontFamily: "var(--font-sans)" },
    backLink: { display: "inline-flex", alignItems: "center", gap: "8px", color: "#8aaab8", textDecoration: "none", fontSize: "14px", marginBottom: "22px" },
    detailsCard: { border: "1px solid #1a3348", borderRadius: "22px", background: "#0d1e2d", padding: "clamp(20px, 4vw, 38px)" },
    heroRow: { display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" },
    avatarWrap: { width: "150px", height: "150px", borderRadius: "24px", overflow: "hidden", flexShrink: 0, border: "1px solid rgba(17,183,128,0.22)", background: "linear-gradient(145deg, rgba(17,183,128,0.18), rgba(17,183,128,0.05))", display: "flex", alignItems: "center", justifyContent: "center" },
    avatarImage: { width: "100%", height: "100%", objectFit: "cover" },
    avatarFallback: { fontSize: "42px", color: "#7df0c3", letterSpacing: "0.06em" },
    kicker: { color: "#7ca4af", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.22em", margin: "0 0 8px" },
    title: { color: "#fff", fontSize: "clamp(28px, 5vw, 44px)", lineHeight: 1.05, margin: 0 },
    subtitle: { color: "#8aaab8", fontSize: "15px", margin: "10px 0 14px" },
    tagRow: { display: "flex", flexWrap: "wrap", gap: "8px" },
    tag: { backgroundColor: "rgba(17,183,128,0.14)", color: "#7df0c3", borderRadius: "999px", padding: "6px 10px", fontSize: "12px", fontWeight: 600 },
    tagSoft: { backgroundColor: "rgba(74,122,144,0.12)", color: "#8aaab8", borderRadius: "999px", padding: "6px 10px", fontSize: "12px", fontWeight: 500 },
    descriptionSection: { borderTop: "1px solid #1a3348", marginTop: "32px", paddingTop: "26px" },
    sectionTitle: { color: "#e8f4f8", fontSize: "20px", margin: "0 0 10px" },
    description: { color: "#c8dde8", lineHeight: 1.7, margin: 0 },
    infoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", margin: "28px 0 0", paddingTop: "22px", borderTop: "1px solid #1a3348" },
    infoItem: { margin: 0 },
    infoLabel: { color: "#4a7a90", fontSize: "12px", marginBottom: "7px" },
    infoValue: { color: "#e8f4f8", fontSize: "14px", margin: 0 },
    stateCard: { border: "1px solid #1a3348", borderRadius: "22px", background: "#0d1e2d", padding: "28px" },
    stateTitle: { margin: "0 0 8px", color: "#e8f4f8", fontSize: "20px" },
    stateText: { margin: 0, color: "#8aaab8", lineHeight: 1.6 },
    loadingCard: { minHeight: "400px", borderRadius: "22px", border: "1px solid #1a3348", background: "#0d1e2d" },
};