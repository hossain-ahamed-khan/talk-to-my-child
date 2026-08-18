"use client";

import { useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { selectToken } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import {
    type CharacterProfile,
    useGetCharacterListApiQuery,
} from "@/redux/features/parent/characters/characterList";
import CharacterCreateModal, { CharacterFormState } from "@/components/parent/character-create-modal";

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL ?? "";

function resolveImageSrc(value: string | null) {
    if (!value) return "";
    if (value.startsWith("http")) return value;
    return `${IMAGE_BASE_URL}${value}`;
}

export const defaultCharacterForm: CharacterFormState = {
    name: "",
    gender: "Female",
    category: "Creative Arts & Nature",
    role: "User Companion / Storyteller Buddy",
    age: "9",
    description: "",
    profile_image: null,
    voice_sample: null,
};

export default function Characters() {
    const token = useAppSelector(selectToken);
    const { data: fetchedCharacters = [], isLoading, isError } = useGetCharacterListApiQuery(undefined, {
        skip: !token,
    });
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [localCharacters, setLocalCharacters] = useState<CharacterProfile[]>([]);
    const [form, setForm] = useState<CharacterFormState>(defaultCharacterForm);

    const characters = [...localCharacters, ...fetchedCharacters];

    const openCreateModal = () => {
        setForm(defaultCharacterForm);
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        setForm(defaultCharacterForm);
    };

    const handleCreateCharacter = (createdCharacter: CharacterProfile) => {
        setLocalCharacters((current) => [
            createdCharacter,
            ...current,
        ]);

        closeCreateModal();
    };

    return (
        <div style={styles.pageShell}>
            <div style={styles.pageFrame}>
                <div style={styles.heroBar}>
                    <div>
                        <p style={styles.kicker}>Parent dashboard</p>
                        <h1 style={styles.title}>Characters</h1>
                        <p style={styles.subtitle}>
                            Manage the AI companions your child can talk to, all in one place.
                        </p>
                    </div>

                    <Button onClick={openCreateModal} style={styles.primaryButton}>
                        Add New Character
                    </Button>
                </div>

                <div style={styles.summaryRow}>
                    <div style={styles.summaryCard}>
                        <span style={styles.summaryLabel}>Total characters</span>
                        <strong style={styles.summaryValue}>{characters.length.toString().padStart(2, "0")}</strong>
                    </div>
                    <div style={styles.summaryCard}>
                        <span style={styles.summaryLabel}>Loaded from API</span>
                        <strong style={styles.summaryValue}>{fetchedCharacters.length.toString().padStart(2, "0")}</strong>
                    </div>
                    <div style={styles.summaryCard}>
                        <span style={styles.summaryLabel}>Drafts added locally</span>
                        <strong style={styles.summaryValue}>{localCharacters.length.toString().padStart(2, "0")}</strong>
                    </div>
                </div>

                {!token ? (
                    <div style={styles.stateCard}>
                        <h2 style={styles.stateTitle}>Sign in to load characters</h2>
                        <p style={styles.stateText}>
                            The character list is tied to the authenticated parent account.
                        </p>
                    </div>
                ) : isError ? (
                    <div style={styles.stateCard}>
                        <h2 style={styles.stateTitle}>Unable to load characters</h2>
                        <p style={styles.stateText}>Check the API connection and try again.</p>
                    </div>
                ) : isLoading ? (
                    <div style={styles.grid}>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} style={styles.skeletonCard} />
                        ))}
                    </div>
                ) : characters.length > 0 ? (
                    <div style={styles.grid}>
                        {characters.map((character) => (
                            <article key={`${character.id}-${character.name}`} style={styles.card}>
                                <div style={styles.cardTop}>
                                    <div style={styles.avatarWrap}>
                                        {character.profile_image ? (
                                            <Image
                                                src={resolveImageSrc(character.profile_image)}
                                                alt={character.name}
                                                width={180}
                                                height={180}
                                                style={styles.avatarImage}
                                            />
                                        ) : (
                                            <span style={styles.avatarFallback}>{getInitials(character.name)}</span>
                                        )}
                                    </div>

                                    <div style={styles.cardMeta}>
                                        <h2 style={styles.cardTitle}>{character.name}</h2>
                                        <p style={styles.cardSubtitle}>
                                            {character.gender} · {character.age} years old
                                        </p>
                                        <div style={styles.tagRow}>
                                            <span style={styles.tag}>{character.category}</span>
                                            <span style={styles.tagSoft}>{character.role}</span>
                                        </div>
                                    </div>
                                </div>

                                <p style={styles.cardDescription}>{character.description}</p>

                                <div style={styles.cardFooter}>
                                    <span style={styles.metaLine}>Created {formatDate(character.created_at)}</span>
                                    <span style={styles.metaLine}>Updated {formatDate(character.updated_at)}</span>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div style={styles.stateCard}>
                        <h2 style={styles.stateTitle}>No characters yet</h2>
                        <p style={styles.stateText}>
                            Create your first character to start building a companion profile.
                        </p>
                        <Button onClick={openCreateModal} style={styles.inlineButton}>
                            Add New Character
                        </Button>
                    </div>
                )}
            </div>

            <CharacterCreateModal
                open={isCreateModalOpen}
                form={form}
                setForm={setForm}
                onClose={closeCreateModal}
                onCreate={handleCreateCharacter}
            />
        </div>
    );
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

    if (Number.isNaN(date.getTime())) {
        return "just now";
    }

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

const styles: Record<string, React.CSSProperties> = {
    pageShell: {
        minHeight: "100vh",
        padding: "clamp(16px, 2.5vw, 28px)",
        background: "#091520",
        boxSizing: "border-box",
    },
    pageFrame: {
        width: "100%",
        maxWidth: "1320px",
        margin: "0 auto",
        color: "#e8f4f8",
        fontFamily: "var(--font-sans)",
    },
    heroBar: {
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: "16px",
        marginBottom: "18px",
        flexWrap: "wrap",
    },
    kicker: {
        color: "#7ca4af",
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "0.22em",
        margin: "0 0 8px",
    },
    title: {
        color: "#ffffff",
        fontSize: "clamp(28px, 4vw, 42px)",
        fontWeight: 700,
        lineHeight: 1.05,
        margin: 0,
    },
    subtitle: {
        color: "#8aaab8",
        fontSize: "14px",
        margin: "10px 0 0",
        maxWidth: "720px",
        lineHeight: 1.6,
    },
    primaryButton: {
        borderRadius: "999px",
        padding: "0 18px",
        backgroundColor: "#11b780",
        color: "#ffffff",
        boxShadow: "0 10px 24px rgba(17,183,128,0.18)",
    },
    inlineButton: {
        borderRadius: "999px",
        padding: "0 18px",
        marginTop: "10px",
    },
    summaryRow: {
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "12px",
        marginBottom: "20px",
    },
    summaryCard: {
        border: "1px solid #1a3348",
        borderRadius: "18px",
        background: "#0d1e2d",
        padding: "16px 18px",
    },
    summaryLabel: {
        display: "block",
        color: "#4a7a90",
        fontSize: "12px",
        marginBottom: "8px",
    },
    summaryValue: {
        color: "#e8f4f8",
        fontSize: "26px",
        fontWeight: 700,
    },
    stateCard: {
        border: "1px solid #1a3348",
        borderRadius: "22px",
        background: "#0d1e2d",
        padding: "28px",
    },
    stateTitle: {
        margin: "0 0 8px",
        color: "#e8f4f8",
        fontSize: "20px",
    },
    stateText: {
        margin: 0,
        color: "#8aaab8",
        lineHeight: 1.6,
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "16px",
        alignItems: "stretch",
    },
    card: {
        border: "1px solid #1a3348",
        borderRadius: "22px",
        background: "#0d1e2d",
        padding: "18px",
    },
    cardTop: {
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
        marginBottom: "14px",
    },
    avatarWrap: {
        width: "68px",
        height: "68px",
        borderRadius: "18px",
        overflow: "hidden",
        flexShrink: 0,
        border: "1px solid rgba(17,183,128,0.22)",
        background: "linear-gradient(145deg, rgba(17,183,128,0.18), rgba(17,183,128,0.05))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    avatarImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    avatarFallback: {
        border: "1px solid #1a3348",
        background: "#091520",
        fontSize: "20px",
        letterSpacing: "0.06em",
    },
    cardMeta: {
        minWidth: 0,
        color: "#e8f4f8",
    },
    cardTitle: {
        margin: 0,
        color: "#e8f4f8",
        fontSize: "18px",
        fontWeight: 700,
    },
    cardSubtitle: {
        margin: "6px 0 10px",
        color: "#4a7a90",
        fontSize: "13px",
    },
    tagRow: {
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
    },
    tag: {
        backgroundColor: "rgba(17,183,128,0.14)",
        color: "#7df0c3",
        borderRadius: "999px",
        padding: "6px 10px",
        fontSize: "12px",
        fontWeight: 600,
    },
    tagSoft: {
        backgroundColor: "rgba(74,122,144,0.12)",
        color: "#8aaab8",
        borderRadius: "999px",
        padding: "6px 10px",
        fontSize: "12px",
        fontWeight: 500,
    },
    cardDescription: {
        margin: 0,
        color: "#c8dde8",
        fontSize: "14px",
        lineHeight: 1.65,
    },
    cardFooter: {
        display: "flex",
        justifyContent: "space-between",
        gap: "10px",
        flexWrap: "wrap",
        marginTop: "16px",
        paddingTop: "14px",
        borderTop: "1px solid #1a3348",
    },
    metaLine: {
        color: "#8aaab8",
        fontSize: "12px",
    },
    skeletonCard: {
        minHeight: "220px",
        borderRadius: "22px",
        border: "1px solid #1a3348",
        background:
            "linear-gradient(90deg, #0d1e2d 25%, #122032 37%, #0d1e2d 63%)",
        backgroundSize: "400% 100%",
    },
    modalOverlay: {
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(3, 9, 15, 0.72)",
        backdropFilter: "blur(10px)",
        display: "grid",
        placeItems: "center",
        padding: "18px",
        zIndex: 50,
    },
    modal: {
        width: "min(980px, 100%)",
        borderRadius: "28px",
        border: "1px solid #1a3348",
        background: "#0d1e2d",
        boxShadow: "0 36px 100px rgba(0,0,0,0.35)",
        padding: "22px",
    },
    modalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "16px",
        marginBottom: "18px",
    },
    modalTitle: {
        color: "#ffffff",
        margin: 0,
        fontSize: "24px",
        fontWeight: 700,
    },
    closeButton: {
        width: "38px",
        height: "38px",
        borderRadius: "999px",
        border: "1px solid #1a3348",
        backgroundColor: "#091520",
        color: "#e8f4f8",
        fontSize: "22px",
        lineHeight: 1,
        cursor: "pointer",
    },
    modalBody: {
        display: "flex",
        gap: "18px",
        flexWrap: "wrap",
    },
    uploadColumn: {
        flex: "0 0 220px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
    },
    uploadBox: {
        width: "180px",
        height: "180px",
        borderRadius: "24px",
        border: "1px dashed #2a4a5a",
        background: "#091520",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        overflow: "hidden",
        boxSizing: "border-box",
    },
    uploadImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    uploadPlaceholder: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        color: "#8aaab8",
    },
    uploadIcon: {
        width: "54px",
        height: "54px",
        borderRadius: "50%",
        border: "1px solid rgba(125,240,195,0.25)",
        display: "grid",
        placeItems: "center",
        fontSize: "28px",
        color: "#7df0c3",
    },
    uploadText: {
        fontSize: "13px",
        fontWeight: 600,
    },
    helperText: {
        margin: 0,
        color: "#8aaab8",
        fontSize: "12px",
        textAlign: "center",
        lineHeight: 1.6,
    },
    formGrid: {
        flex: "1 1 420px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "14px",
        alignContent: "start",
    },
    field: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    label: {
        color: "#4a7a90",
        fontSize: "13px",
        fontWeight: 600,
    },
    textarea: {
        width: "100%",
        minHeight: "140px",
        resize: "vertical",
        borderRadius: "14px",
        border: "1px solid #1a3348",
        backgroundColor: "#091520",
        color: "#e8f4f8",
        padding: "12px 14px",
        fontSize: "14px",
        lineHeight: 1.6,
        boxSizing: "border-box",
        outline: "none",
        fontFamily: "inherit",
    },
    modalActions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px",
        marginTop: "18px",
        flexWrap: "wrap",
    },
    actionButton: {
        borderRadius: "999px",
        padding: "0 18px",
    },
};