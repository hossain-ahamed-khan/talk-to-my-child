"use client";

import Image from "next/image";
import { useState, useRef } from "react";

type VoiceGender = "Male" | "Female" | "Neutral";
type Gender = "Male" | "Female" | "Other";

export default function AddNewCharacter() {
    const [characterName, setCharacterName] = useState("Dad");
    const [gender, setGender] = useState<Gender>("Male");
    const [voiceGender, setVoiceGender] = useState<VoiceGender>("Male");
    const [approximateAge, setApproximateAge] = useState("35");
    const [personalityDescription, setPersonalityDescription] = useState(
        "Warm, encouraging, and likes to tell dad jokes. Always starts conversations with 'Hey champ!'."
    );
    const [characterImage, setCharacterImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setCharacterImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleCreate = () => {
        alert(`Character "${characterName}" created!`);
    };

    const handleCancel = () => {
        setCharacterName("");
        setGender("Male");
        setVoiceGender("Male");
        setApproximateAge("");
        setPersonalityDescription("");
        setCharacterImage(null);
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                {/* Left Panel */}
                <div style={styles.leftPanel}>
                    <div style={styles.header}>
                        <h1 style={styles.title}>Add New Character</h1>
                        <p style={styles.subtitle}>
                            Create a unique profile and voice for your child&apos;s character.
                        </p>
                    </div>

                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>Character Information</h2>

                        {/* Row: Name + Gender */}
                        <div style={styles.row}>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Character Name</label>
                                <input
                                    style={styles.input}
                                    value={characterName}
                                    onChange={(e) => setCharacterName(e.target.value)}
                                    placeholder="Enter name"
                                />
                            </div>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Gender</label>
                                <div style={styles.selectWrapper}>
                                    <select
                                        style={styles.select}
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value as Gender)}
                                    >
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                    <span style={styles.selectArrow}>▾</span>
                                </div>
                            </div>
                        </div>

                        {/* Row: Voice Gender + Approximate Age */}
                        <div style={styles.row}>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Voice Gender</label>
                                <div style={styles.toggleGroup}>
                                    {(["Male", "Female", "Neutral"] as VoiceGender[]).map((v) => (
                                        <button
                                            key={v}
                                            style={
                                                voiceGender === v
                                                    ? { ...styles.toggleBtn, ...styles.toggleBtnActive }
                                                    : styles.toggleBtn
                                            }
                                            onClick={() => setVoiceGender(v)}
                                        >
                                            {v}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Approximate Age</label>
                                <input
                                    style={styles.input}
                                    value={approximateAge}
                                    onChange={(e) => setApproximateAge(e.target.value)}
                                    placeholder="35"
                                    type="number"
                                />
                            </div>
                        </div>

                        {/* Personality Description */}
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Personality Description</label>
                            <textarea
                                style={styles.textarea}
                                value={personalityDescription}
                                onChange={(e) => setPersonalityDescription(e.target.value)}
                                placeholder="Describe the character's personality..."
                                rows={4}
                            />
                        </div>

                        {/* Buttons */}
                        <div style={styles.buttonRow}>
                            <button style={styles.createBtn} onClick={handleCreate}>
                                Create Character
                            </button>
                            <button style={styles.cancelBtn} onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div style={styles.rightPanel}>
                    <h2 style={styles.rightTitle}>Upload Character Image (Optional)</h2>

                    <div style={styles.imageUploadArea} onClick={() => fileInputRef.current?.click()}>
                        {characterImage ? (
                            <Image
                                src={characterImage}
                                alt="Character"
                                width={110}
                                height={110}
                                style={styles.previewImage}
                            />
                        ) : (
                            <div style={styles.imagePlaceholder}>
                                <span style={styles.cameraIcon}>📷</span>
                                <div style={styles.plusBadge}>+</div>
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleImageUpload}
                        />
                    </div>

                    <div style={styles.voiceSection}>
                        <p style={styles.voiceSectionLabel}>VOICE SOURCE METHODS</p>

                        {[
                            {
                                icon: "🎙️",
                                label: "Press to record",
                                sub: "DIRECT RECORDING",
                            },
                            {
                                icon: "🔗",
                                label: "Paste YouTube link",
                                sub: "WEB AUDIO SOURCE",
                            },
                            {
                                icon: "📄",
                                label: "Choose File",
                                sub: "SELECT FROM DEVICE",
                            },
                        ].map((item) => (
                            <button key={item.label} style={styles.voiceOption}>
                                <span style={styles.voiceIcon}>{item.icon}</span>
                                <div style={styles.voiceTextGroup}>
                                    <span style={styles.voiceLabel}>{item.label}</span>
                                    <span style={styles.voiceSub}>{item.sub}</span>
                                </div>
                                <span style={styles.voiceArrow}>›</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Floating mic button */}
            <button style={styles.fab}>🎤</button>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: {
        minHeight: "100vh",
        backgroundColor: "#0d1117",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', sans-serif",
        padding: "24px",
        boxSizing: "border-box",
        position: "relative",
    },
    container: {
        display: "flex",
        gap: "24px",
        width: "100%",
        maxWidth: "1100px",
        alignItems: "flex-start",
    },
    leftPanel: {
        flex: 1,
        backgroundColor: "#131920",
        borderRadius: "16px",
        padding: "32px",
        border: "1px solid #1e2a35",
    },
    header: {
        marginBottom: "28px",
    },
    title: {
        color: "#ffffff",
        fontSize: "26px",
        fontWeight: 700,
        margin: "0 0 6px",
    },
    subtitle: {
        color: "#6b7f8e",
        fontSize: "14px",
        margin: 0,
    },
    section: {},
    sectionTitle: {
        color: "#ffffff",
        fontSize: "16px",
        fontWeight: 600,
        marginBottom: "20px",
    },
    row: {
        display: "flex",
        gap: "16px",
        marginBottom: "20px",
    },
    fieldGroup: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    label: {
        color: "#8a9bb0",
        fontSize: "13px",
        fontWeight: 500,
    },
    input: {
        backgroundColor: "#0d1117",
        border: "1px solid #1e2a35",
        borderRadius: "8px",
        padding: "12px 14px",
        color: "#ffffff",
        fontSize: "14px",
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
    },
    selectWrapper: {
        position: "relative",
    },
    select: {
        width: "100%",
        backgroundColor: "#0d1117",
        border: "1px solid #1e2a35",
        borderRadius: "8px",
        padding: "12px 36px 12px 14px",
        color: "#ffffff",
        fontSize: "14px",
        appearance: "none",
        outline: "none",
        cursor: "pointer",
    },
    selectArrow: {
        position: "absolute",
        right: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "#8a9bb0",
        pointerEvents: "none",
        fontSize: "16px",
    },
    toggleGroup: {
        display: "flex",
        gap: "8px",
    },
    toggleBtn: {
        padding: "9px 18px",
        borderRadius: "999px",
        border: "1px solid #1e2a35",
        backgroundColor: "transparent",
        color: "#8a9bb0",
        fontSize: "13px",
        cursor: "pointer",
        fontWeight: 500,
    },
    toggleBtnActive: {
        backgroundColor: "#1db954",
        borderColor: "#1db954",
        color: "#ffffff",
    },
    textarea: {
        backgroundColor: "#0d1117",
        border: "1px solid #1e2a35",
        borderRadius: "8px",
        padding: "12px 14px",
        color: "#ffffff",
        fontSize: "14px",
        outline: "none",
        width: "100%",
        resize: "vertical",
        boxSizing: "border-box",
        lineHeight: "1.5",
        fontFamily: "inherit",
    },
    buttonRow: {
        display: "flex",
        gap: "12px",
        marginTop: "28px",
    },
    createBtn: {
        backgroundColor: "#1db954",
        color: "#ffffff",
        border: "none",
        borderRadius: "999px",
        padding: "13px 28px",
        fontSize: "14px",
        fontWeight: 600,
        cursor: "pointer",
    },
    cancelBtn: {
        backgroundColor: "#1e2a35",
        color: "#ffffff",
        border: "none",
        borderRadius: "999px",
        padding: "13px 28px",
        fontSize: "14px",
        fontWeight: 600,
        cursor: "pointer",
    },

    // Right Panel
    rightPanel: {
        width: "320px",
        backgroundColor: "#131920",
        borderRadius: "16px",
        padding: "28px",
        border: "1px solid #1e2a35",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "24px",
    },
    rightTitle: {
        color: "#ffffff",
        fontSize: "15px",
        fontWeight: 600,
        textAlign: "center",
        margin: 0,
    },
    imageUploadArea: {
        width: "110px",
        height: "110px",
        borderRadius: "50%",
        border: "2px dashed #2e3d4e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        position: "relative",
        overflow: "visible",
    },
    imagePlaceholder: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    cameraIcon: {
        fontSize: "32px",
        opacity: 0.5,
    },
    plusBadge: {
        position: "absolute",
        bottom: "-14px",
        right: "-14px",
        backgroundColor: "#1db954",
        color: "#fff",
        borderRadius: "50%",
        width: "22px",
        height: "22px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "16px",
        fontWeight: 700,
        lineHeight: 1,
    },
    previewImage: {
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        objectFit: "cover",
    },
    voiceSection: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    voiceSectionLabel: {
        color: "#4a5e70",
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.1em",
        margin: "0 0 4px",
    },
    voiceOption: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        backgroundColor: "#0d1117",
        border: "1px solid #1e2a35",
        borderRadius: "10px",
        padding: "14px 16px",
        cursor: "pointer",
        textAlign: "left",
    },
    voiceIcon: {
        fontSize: "18px",
        color: "#1db954",
        minWidth: "24px",
        textAlign: "center",
    },
    voiceTextGroup: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "2px",
    },
    voiceLabel: {
        color: "#ffffff",
        fontSize: "14px",
        fontWeight: 500,
    },
    voiceSub: {
        color: "#4a5e70",
        fontSize: "11px",
        letterSpacing: "0.05em",
    },
    voiceArrow: {
        color: "#4a5e70",
        fontSize: "20px",
    },

    // FAB
    fab: {
        position: "fixed",
        bottom: "28px",
        right: "28px",
        width: "52px",
        height: "52px",
        borderRadius: "50%",
        backgroundColor: "#1db954",
        border: "none",
        fontSize: "22px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 16px rgba(29,185,84,0.4)",
    },
};