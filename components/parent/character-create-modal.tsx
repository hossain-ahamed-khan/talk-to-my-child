"use client";

import { useRef } from "react";
import type { ChangeEvent, CSSProperties, Dispatch, SetStateAction } from "react";
import Image from "next/image";

export type CharacterFormState = {
    name: string;
    gender: string;
    category: string;
    role: string;
    age: string;
    description: string;
    profile_image: string | null;
    voice_sample: string | null;
};

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

type CharacterCreateModalProps = {
    open: boolean;
    form: CharacterFormState;
    setForm: Dispatch<SetStateAction<CharacterFormState>>;
    onClose: () => void;
    onCreate: () => void;
};

const genderOptions = ["Female", "Male", "Neutral"];

const voiceSourceMethods = [
    {
        label: "Press to record",
        description: "Direct recording",
    },
    {
        label: "Paste YouTube link",
        description: "Web audio source",
    },
    {
        label: "Choose File",
        description: "Select from device",
    },
];

export default function CharacterCreateModal({ open, form, setForm, onClose, onCreate }: CharacterCreateModalProps) {
    const imageInputRef = useRef<HTMLInputElement>(null);
    const voiceInputRef = useRef<HTMLInputElement>(null);

    if (!open) {
        return null;
    }

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setForm((current) => ({ ...current, profile_image: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const handleVoiceFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        setForm((current) => ({ ...current, voice_sample: file.name }));
    };

    const handleVoiceMethodClick = (methodLabel: string) => {
        if (methodLabel === "Paste YouTube link") {
            const pastedLink = window.prompt("Paste a voice sample link");
            if (!pastedLink) {
                return;
            }

            setForm((current) => ({ ...current, voice_sample: pastedLink }));
            return;
        }

        if (methodLabel === "Choose File") {
            voiceInputRef.current?.click();
            return;
        }

        setForm((current) => ({ ...current, voice_sample: methodLabel }));
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(event) => event.stopPropagation()}>
                <div style={styles.header}>
                    <div>
                        <h2 style={styles.title}>Add New Character</h2>
                        <p style={styles.subtitle}>Create a unique profile and voice for your child&apos;s character.</p>
                    </div>

                    <button type="button" style={styles.closeButton} onClick={onClose} aria-label="Close modal">
                        ×
                    </button>
                </div>

                <div style={styles.content}>
                    <section style={styles.leftColumn}>
                        <div style={styles.sectionHeader}>
                            <p style={styles.sectionKicker}>Character Information</p>
                        </div>

                        <div style={styles.formGrid}>
                            <label style={styles.field}>
                                <span style={styles.label}>Character Name</span>
                                <input
                                    value={form.name}
                                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                                    placeholder="Dad"
                                    style={styles.input}
                                />
                            </label>

                            <label style={styles.field}>
                                <span style={styles.label}>Gender</span>
                                <div style={styles.segmentRow}>
                                    {genderOptions.map((option) => {
                                        const selected = form.gender === option;

                                        return (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => setForm((current) => ({ ...current, gender: option }))}
                                                style={{
                                                    ...styles.segmentButton,
                                                    ...(selected ? styles.segmentButtonActive : null),
                                                }}
                                            >
                                                {option}
                                            </button>
                                        );
                                    })}
                                </div>
                            </label>

                            <label style={styles.field}>
                                <span style={styles.label}>Approximate Age</span>
                                <input
                                    type="number"
                                    value={form.age}
                                    onChange={(event) => setForm((current) => ({ ...current, age: event.target.value }))}
                                    placeholder="35"
                                    style={styles.input}
                                />
                            </label>

                            <label style={styles.field}>
                                <span style={styles.label}>Category</span>
                                <input
                                    value={form.category}
                                    onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                                    placeholder="Creative Arts & Nature"
                                    style={styles.input}
                                />
                            </label>

                            <label style={styles.field}>
                                <span style={styles.label}>Role</span>
                                <input
                                    value={form.role}
                                    onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
                                    placeholder="User Companion / Storyteller Buddy"
                                    style={styles.input}
                                />
                            </label>

                            <label style={{ ...styles.field, gridColumn: "1 / -1" }}>
                                <span style={styles.label}>Personality Description</span>
                                <textarea
                                    value={form.description}
                                    onChange={(event) =>
                                        setForm((current) => ({ ...current, description: event.target.value }))
                                    }
                                    placeholder="Warm, encouraging, and likes to tell dad jokes. Always starts conversations with 'Hey champ!'."
                                    rows={5}
                                    style={styles.textarea}
                                />
                            </label>
                        </div>

                        <div style={styles.actions}>
                            <button type="button" onClick={onCreate} disabled={!form.name.trim()} style={styles.primaryAction}>
                                Create Character
                            </button>
                            <button type="button" onClick={onClose} style={styles.secondaryAction}>
                                Cancel
                            </button>
                        </div>
                    </section>

                    <aside style={styles.rightColumn}>
                        <div style={styles.imagePanel}>
                            <p style={styles.panelTitle}>Upload Character Image (Optional)</p>

                            <button type="button" style={styles.imagePicker} onClick={() => imageInputRef.current?.click()}>
                                {form.profile_image ? (
                                    <Image
                                        src={form.profile_image}
                                        alt="Character preview"
                                        width={156}
                                        height={156}
                                        style={styles.previewImage}
                                    />
                                ) : (
                                    <div style={styles.imagePlaceholder}>
                                        <div style={styles.imageRing}>
                                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
                                                <path
                                                    d="M6 10.5C6 9.119 7.119 8 8.5 8H10.2L11.5 5.9C11.87 5.32 12.51 5 13.18 5H16.82C17.49 5 18.13 5.32 18.5 5.9L19.8 8H21.5C22.881 8 24 9.119 24 10.5V20.5C24 21.881 22.881 23 21.5 23H8.5C7.119 23 6 21.881 6 20.5V10.5Z"
                                                    stroke="#7a8da6"
                                                    strokeWidth="1.5"
                                                />
                                                <circle cx="15" cy="15.2" r="4.2" stroke="#7a8da6" strokeWidth="1.5" />
                                            </svg>
                                        </div>
                                        <span style={styles.addBadge}>+</span>
                                    </div>
                                )}
                            </button>

                            <input ref={imageInputRef} type="file" accept="image/*" hidden onChange={handleImageUpload} />

                            <p style={styles.panelHint}>Choose a clear portrait so the character card feels more personal.</p>
                        </div>

                        <div style={styles.voicePanel}>
                            <p style={styles.panelTitleMuted}>Voice Source Methods</p>

                            <div style={styles.voiceList}>
                                {voiceSourceMethods.map((method) => {
                                    const selected = form.voice_sample === method.label;

                                    return (
                                        <button
                                            key={method.label}
                                            type="button"
                                            onClick={() => handleVoiceMethodClick(method.label)}
                                            style={{
                                                ...styles.voiceCard,
                                                ...(selected ? styles.voiceCardActive : null),
                                            }}
                                        >
                                            <div style={styles.voiceIconWrap}>
                                                {method.label === "Press to record" ? (
                                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                                                        <rect x="7" y="2.5" width="4" height="9" rx="2" stroke="#14d39c" strokeWidth="1.5" />
                                                        <path d="M5.5 8.5C5.5 10.985 7.515 13 10 13C12.485 13 14.5 10.985 14.5 8.5" stroke="#14d39c" strokeWidth="1.5" strokeLinecap="round" />
                                                        <path d="M9 13V15.5" stroke="#14d39c" strokeWidth="1.5" strokeLinecap="round" />
                                                    </svg>
                                                ) : method.label === "Paste YouTube link" ? (
                                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                                                        <path d="M7 9h4" stroke="#14d39c" strokeWidth="1.5" strokeLinecap="round" />
                                                        <path d="M8.5 6.5 6 9l2.5 2.5" stroke="#14d39c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M10 11.5 12.5 9 10 6.5" stroke="#14d39c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                ) : (
                                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                                                        <path d="M6 2.5h4.5L13.5 5.5V15H6V2.5Z" stroke="#14d39c" strokeWidth="1.5" strokeLinejoin="round" />
                                                        <path d="M10.5 2.5V5.5H13.5" stroke="#14d39c" strokeWidth="1.5" strokeLinejoin="round" />
                                                        <path d="M8 9.5h3" stroke="#14d39c" strokeWidth="1.5" strokeLinecap="round" />
                                                        <path d="M8 12h2.5" stroke="#14d39c" strokeWidth="1.5" strokeLinecap="round" />
                                                    </svg>
                                                )}
                                            </div>

                                            <div style={styles.voiceCopy}>
                                                <span style={styles.voiceLabel}>{method.label}</span>
                                                <span style={styles.voiceDescription}>{method.description}</span>
                                            </div>

                                            <span style={styles.chevron}>›</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <input ref={voiceInputRef} type="file" accept="audio/*" hidden onChange={handleVoiceFileUpload} />
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

const styles: Record<string, CSSProperties> = {
    overlay: {
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "grid",
        placeItems: "center",
        padding: "16px",
        backgroundColor: "rgba(5, 10, 19, 0.82)",
        backdropFilter: "blur(14px)",
    },
    modal: {
        width: "min(1200px, 100%)",
        maxHeight: "calc(100vh - 32px)",
        overflowY: "auto",
        borderRadius: "28px",
        border: "1px solid rgba(38, 57, 79, 0.9)",
        background: "linear-gradient(180deg, #101a2a 0%, #0c1320 100%)",
        boxShadow: "0 36px 120px rgba(0, 0, 0, 0.42)",
        padding: "24px",
        boxSizing: "border-box",
        color: "#eaf4ff",
        fontFamily: "var(--font-sans)",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "16px",
        marginBottom: "24px",
    },
    title: {
        margin: 0,
        fontSize: "clamp(26px, 3vw, 38px)",
        fontWeight: 800,
        lineHeight: 1.05,
        color: "#ffffff",
    },
    subtitle: {
        margin: "8px 0 0",
        color: "#8a9eb2",
        fontSize: "14px",
        lineHeight: 1.6,
    },
    closeButton: {
        width: "42px",
        height: "42px",
        borderRadius: "999px",
        border: "1px solid rgba(52, 75, 98, 0.95)",
        backgroundColor: "rgba(10, 17, 28, 0.9)",
        color: "#dce8f3",
        fontSize: "26px",
        lineHeight: 1,
        cursor: "pointer",
        flexShrink: 0,
    },
    content: {
        display: "flex",
        alignItems: "flex-start",
        gap: "18px",
        flexWrap: "wrap",
    },
    leftColumn: {
        flex: "1 1 640px",
        minWidth: 0,
    },
    rightColumn: {
        flex: "0 0 330px",
        minWidth: "300px",
        display: "grid",
        gap: "14px",
    },
    sectionHeader: {
        marginBottom: "14px",
    },
    sectionKicker: {
        margin: 0,
        color: "#ffffff",
        fontSize: "20px",
        fontWeight: 700,
    },
    formGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px",
    },
    field: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    label: {
        fontSize: "13px",
        fontWeight: 600,
        color: "#d7e4ef",
    },
    input: {
        width: "100%",
        minWidth: 0,
        borderRadius: "18px",
        border: "1px solid rgba(53, 75, 97, 0.85)",
        backgroundColor: "rgba(14, 22, 36, 0.92)",
        color: "#ffffff",
        fontSize: "14px",
        padding: "14px 16px",
        outline: "none",
        boxSizing: "border-box",
    },
    textarea: {
        width: "100%",
        minHeight: "120px",
        resize: "vertical",
        borderRadius: "18px",
        border: "1px solid rgba(53, 75, 97, 0.85)",
        backgroundColor: "rgba(14, 22, 36, 0.92)",
        color: "#ffffff",
        fontSize: "14px",
        lineHeight: 1.65,
        padding: "14px 16px",
        outline: "none",
        boxSizing: "border-box",
        fontFamily: "inherit",
    },
    segmentRow: {
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
    },
    segmentButton: {
        height: "40px",
        padding: "0 18px",
        borderRadius: "999px",
        border: "1px solid rgba(53, 75, 97, 0.95)",
        backgroundColor: "rgba(14, 22, 36, 0.92)",
        color: "#9eb0c3",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 600,
        transition: "all 0.18s ease",
    },
    segmentButtonActive: {
        borderColor: "rgba(20, 211, 156, 0.95)",
        color: "#12d39b",
        boxShadow: "0 0 0 1px rgba(20, 211, 156, 0.16) inset",
    },
    actions: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "12px",
        marginTop: "18px",
        flexWrap: "wrap",
    },
    primaryAction: {
        height: "48px",
        borderRadius: "999px",
        border: "1px solid transparent",
        padding: "0 22px",
        background: "linear-gradient(135deg, #14d39c 0%, #13b983 100%)",
        color: "#06211a",
        fontSize: "15px",
        fontWeight: 800,
        cursor: "pointer",
        boxShadow: "0 14px 30px rgba(20, 211, 156, 0.22)",
    },
    secondaryAction: {
        height: "48px",
        borderRadius: "999px",
        border: "1px solid rgba(67, 95, 119, 0.95)",
        padding: "0 22px",
        backgroundColor: "rgba(18, 30, 46, 0.96)",
        color: "#ffffff",
        fontSize: "15px",
        fontWeight: 700,
        cursor: "pointer",
    },
    imagePanel: {
        borderRadius: "24px",
        border: "1px solid rgba(38, 57, 79, 0.9)",
        background: "rgba(13, 20, 34, 0.9)",
        padding: "18px",
        display: "grid",
        justifyItems: "center",
        gap: "14px",
    },
    panelTitle: {
        margin: 0,
        color: "#ffffff",
        fontSize: "16px",
        fontWeight: 700,
        textAlign: "center",
    },
    imagePicker: {
        width: "100%",
        border: "none",
        background: "transparent",
        padding: 0,
        cursor: "pointer",
        display: "grid",
        placeItems: "center",
    },
    previewImage: {
        width: "156px",
        height: "156px",
        borderRadius: "50%",
        objectFit: "cover",
        border: "2px solid rgba(31, 46, 66, 0.8)",
        boxShadow: "0 0 0 10px rgba(20, 211, 156, 0.04)",
    },
    imagePlaceholder: {
        position: "relative",
        width: "156px",
        height: "156px",
        display: "grid",
        placeItems: "center",
    },
    imageRing: {
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        border: "2px dashed rgba(92, 110, 132, 0.6)",
        display: "grid",
        placeItems: "center",
        background: "radial-gradient(circle at center, rgba(20, 211, 156, 0.04), transparent 65%)",
    },
    addBadge: {
        position: "absolute",
        right: "18px",
        bottom: "22px",
        width: "22px",
        height: "22px",
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(135deg, #14d39c, #10b981)",
        color: "#ffffff",
        fontSize: "18px",
        lineHeight: 1,
        boxShadow: "0 10px 22px rgba(20, 211, 156, 0.28)",
    },
    panelHint: {
        margin: 0,
        color: "#8a9eb2",
        fontSize: "12px",
        lineHeight: 1.6,
        textAlign: "center",
    },
    voicePanel: {
        borderRadius: "24px",
        border: "1px solid rgba(38, 57, 79, 0.9)",
        background: "rgba(13, 20, 34, 0.9)",
        padding: "16px",
    },
    panelTitleMuted: {
        margin: "0 0 14px",
        color: "#73859c",
        fontSize: "12px",
        fontWeight: 800,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
    },
    voiceList: {
        display: "grid",
        gap: "10px",
    },
    voiceCard: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        borderRadius: "20px",
        border: "1px solid rgba(43, 61, 80, 0.9)",
        background: "rgba(16, 25, 38, 0.96)",
        padding: "12px 14px",
        color: "#eaf4ff",
        cursor: "pointer",
        textAlign: "left",
        boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.01)",
    },
    voiceCardActive: {
        borderColor: "rgba(20, 211, 156, 0.7)",
        boxShadow: "0 0 0 1px rgba(20, 211, 156, 0.1) inset",
    },
    voiceIconWrap: {
        width: "34px",
        height: "34px",
        borderRadius: "50%",
        flexShrink: 0,
        display: "grid",
        placeItems: "center",
        background: "rgba(20, 211, 156, 0.08)",
    },
    voiceCopy: {
        flex: 1,
        minWidth: 0,
    },
    voiceLabel: {
        display: "block",
        fontSize: "14px",
        fontWeight: 700,
        color: "#ffffff",
        marginBottom: "3px",
    },
    voiceDescription: {
        display: "block",
        fontSize: "10px",
        fontWeight: 700,
        color: "#72859a",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
    },
    chevron: {
        color: "#42576b",
        fontSize: "24px",
        lineHeight: 1,
        marginLeft: "4px",
    },
};