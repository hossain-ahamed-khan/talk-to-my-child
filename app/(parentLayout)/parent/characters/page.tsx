"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
    const [showChildAccountView, setShowChildAccountView] = useState(false);
    const [viewportWidth, setViewportWidth] = useState(1440);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const updateViewportWidth = () => setViewportWidth(window.innerWidth);
        updateViewportWidth();
        window.addEventListener("resize", updateViewportWidth);
        return () => window.removeEventListener("resize", updateViewportWidth);
    }, []);

    const isTablet = viewportWidth <= 1024;
    const isMobile = viewportWidth <= 768;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setCharacterImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleCreate = () => {
        setShowChildAccountView(true);
    };

    const handleCancel = () => {
        setCharacterName("");
        setGender("Male");
        setVoiceGender("Male");
        setApproximateAge("");
        setPersonalityDescription("");
        setCharacterImage(null);
    };

    const handleBackToCharacter = () => {
        setShowChildAccountView(false);
    };

    const handleChildCreate = () => {
        alert(`Child account for "${characterName || "your child"}" created!`);
    };

    if (showChildAccountView) {
        return (
            <div style={{ ...styles.page, padding: isMobile ? "12px" : isTablet ? "18px" : "24px" }}>
                <div style={styles.childAccountLayout}>
                    <div style={styles.childAccountLeft}>
                        <div style={styles.header}>
                            <h1 style={styles.title}>Add New Child Account</h1>
                            <p style={styles.subtitle}>Enter your child&apos;s details below.</p>
                        </div>

                        <h2 style={styles.sectionTitle}>Child Information</h2>

                        <div style={{ ...styles.row, flexDirection: isMobile ? "column" : "row" }}>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Child Name</label>
                                <input
                                    style={styles.input}
                                    value={characterName}
                                    onChange={(e) => setCharacterName(e.target.value)}
                                    placeholder="George Blaze"
                                />
                            </div>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Age</label>
                                <div style={styles.selectWrapper}>
                                    <select
                                        style={styles.select}
                                        value={approximateAge || "12"}
                                        onChange={(e) => setApproximateAge(e.target.value)}
                                    >
                                        {Array.from({ length: 16 }, (_, i) => i + 5).map((age) => (
                                            <option key={age} value={String(age)}>
                                                {age}
                                            </option>
                                        ))}
                                    </select>
                                    <span style={styles.selectArrow}>▾</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ ...styles.row, flexDirection: isMobile ? "column" : "row" }}>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Username</label>
                                <input style={styles.input} defaultValue="Dad" />
                            </div>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Email</label>
                                <input style={styles.input} defaultValue="Dad" />
                            </div>
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Password</label>
                            <div style={styles.passwordField}>
                                <input style={styles.passwordInput} type="password" defaultValue="password" />
                                <span style={styles.passwordIcon}>◌</span>
                            </div>
                        </div>

                        <div style={{ ...styles.row, flexDirection: isMobile ? "column" : "row", marginTop: "20px" }}>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Focus Subjects (Optional)</label>
                                <p style={styles.helperText}>
                                    Select areas you want the AI to emphasize during conversations.
                                </p>
                                <div style={styles.chipsBox}>
                                    {["Math", "Science", "English"].map((item) => (
                                        <span key={item} style={styles.chip}>
                                            {item} x
                                        </span>
                                    ))}
                                    <span style={styles.chipPlaceholder}>Add subject...</span>
                                </div>
                            </div>

                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Personality (Optional)</label>
                                <p style={styles.helperText}>Define the behavioral traits the AI should adapt to.</p>
                                <div style={styles.chipsBox}>
                                    {["Creative", "Curious", "Energetic"].map((item) => (
                                        <span key={item} style={styles.chip}>
                                            {item} x
                                        </span>
                                    ))}
                                    <span style={styles.chipPlaceholder}>Add trait...</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ ...styles.row, flexDirection: isMobile ? "column" : "row" }}>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Interests (Optional)</label>
                                <p style={styles.helperText}>Topics that get your child excited and engaged.</p>
                                <input style={styles.input} placeholder="e.g. Space, Dinosaurs..." />
                            </div>

                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Dislikes (Optional)</label>
                                <p style={styles.helperText}>Avoid these topics to keep the experience positive.</p>
                                <input style={styles.input} placeholder="e.g. Loud noises, Broccoli..." />
                            </div>
                        </div>

                        <div style={{ ...styles.buttonRow, flexDirection: isMobile ? "column" : "row" }}>
                            <button
                                style={{ ...styles.createBtn, width: isMobile ? "100%" : "auto" }}
                                onClick={handleChildCreate}
                            >
                                Create Child
                            </button>
                            <button
                                style={{ ...styles.cancelBtn, width: isMobile ? "100%" : "auto" }}
                                onClick={handleBackToCharacter}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>

                    <div style={styles.childAccountRight}>
                        <h2 style={styles.rightTitle}>Upload Child Image (Optional)</h2>
                        <div style={styles.childImageFrame} onClick={() => fileInputRef.current?.click()}>
                            {characterImage ? (
                                <Image
                                    src={characterImage}
                                    alt="Child avatar"
                                    width={90}
                                    height={90}
                                    style={styles.childPreviewImage}
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
                    </div>
                </div>

                <button
                    style={{
                        ...styles.fab,
                        right: isMobile ? "14px" : "28px",
                        bottom: isMobile ? "14px" : "28px",
                        width: isMobile ? "48px" : "52px",
                        height: isMobile ? "48px" : "52px",
                    }}
                >
                    🎤
                </button>
            </div>
        );
    }

    return (
        <div style={{ ...styles.page, padding: isMobile ? "12px" : isTablet ? "18px" : "24px" }}>
            <div style={{ ...styles.container, flexDirection: isTablet ? "column" : "row" }}>
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
                        <div style={{ ...styles.row, flexDirection: isMobile ? "column" : "row" }}>
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
                        <div style={{ ...styles.row, flexDirection: isMobile ? "column" : "row" }}>
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
                        <div style={{ ...styles.buttonRow, flexDirection: isMobile ? "column" : "row" }}>
                            <button
                                style={{ ...styles.createBtn, width: isMobile ? "100%" : "auto" }}
                                onClick={handleCreate}
                            >
                                Create Character
                            </button>
                            <button
                                style={{ ...styles.cancelBtn, width: isMobile ? "100%" : "auto" }}
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div
                    style={{
                        ...styles.rightPanel,
                        width: "100%",
                        maxWidth: isTablet ? "100%" : "360px",
                        alignItems: "stretch",
                    }}
                >
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
            <button
                style={{
                    ...styles.fab,
                    right: isMobile ? "14px" : "28px",
                    bottom: isMobile ? "14px" : "28px",
                    width: isMobile ? "48px" : "52px",
                    height: isMobile ? "48px" : "52px",
                }}
            >
                🎤
            </button>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: {
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "flex-start",
        fontFamily: "'Segoe UI', sans-serif",
        boxSizing: "border-box",
        position: "relative",
        width: "100%",
    },
    container: {
        display: "flex",
        gap: "24px",
        width: "100%",
        maxWidth: "100%",
        alignItems: "flex-start",
    },
    childAccountLayout: {
        display: "flex",
        gap: "24px",
        width: "100%",
        alignItems: "flex-start",
        flexWrap: "wrap",
    },
    childAccountLeft: {
        flex: "1 1 720px",
        minWidth: "320px",
    },
    childAccountRight: {
        flex: "0 0 360px",
        width: "100%",
        maxWidth: "360px",
        border: "1px solid #1e2a35",
        borderRadius: "14px",
        padding: "28px",
        backgroundColor: "rgba(7,16,39,0.55)",
        boxSizing: "border-box",
        minHeight: "236px",
    },
    leftPanel: {
        flex: "1 1 0",
        width: "100%",
        backgroundColor: "transparent",
        borderRadius: "16px",
        padding: "clamp(16px, 2.4vw, 32px)",
        border: "1px solid #1e2a35",
        boxSizing: "border-box",
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
        width: "100%",
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
        backgroundColor: "transparent",
        border: "1px solid #1e2a35",
        borderRadius: "8px",
        padding: "12px 14px",
        color: "#ffffff",
        fontSize: "14px",
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
    },
    helperText: {
        margin: "0 0 8px",
        color: "#5b6d84",
        fontSize: "13px",
    },
    selectWrapper: {
        position: "relative",
    },
    select: {
        width: "100%",
        backgroundColor: "transparent",
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
    passwordField: {
        position: "relative",
        width: "100%",
    },
    passwordInput: {
        backgroundColor: "transparent",
        border: "1px solid #1e2a35",
        borderRadius: "999px",
        padding: "12px 42px 12px 14px",
        color: "#ffffff",
        fontSize: "14px",
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
    },
    passwordIcon: {
        position: "absolute",
        top: "50%",
        right: "14px",
        transform: "translateY(-50%)",
        color: "#5b6d84",
        fontSize: "13px",
    },
    chipsBox: {
        minHeight: "74px",
        border: "1px solid #1e2a35",
        borderRadius: "18px",
        padding: "12px",
        display: "flex",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: "8px",
    },
    chip: {
        backgroundColor: "rgba(8,177,130,0.12)",
        color: "#00c39a",
        padding: "7px 12px",
        borderRadius: "999px",
        fontSize: "13px",
        fontWeight: 600,
    },
    chipPlaceholder: {
        color: "#8a9bb0",
        fontSize: "14px",
        alignSelf: "center",
        marginLeft: "4px",
    },
    toggleGroup: {
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
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
        flex: "1 1 auto",
    },
    toggleBtnActive: {
        backgroundColor: "#11b780",
        borderColor: "#11b780",
        color: "#ffffff",
    },
    textarea: {
        backgroundColor: "transparent",
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
        backgroundColor: "#11b780",
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
        flex: "1 1 320px",
        backgroundColor: "transparent",
        borderRadius: "16px",
        padding: "clamp(16px, 2.1vw, 28px)",
        border: "1px solid #1e2a35",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "24px",
        boxSizing: "border-box",
    },
    rightTitle: {
        color: "#ffffff",
        fontSize: "15px",
        fontWeight: 600,
        textAlign: "center",
        margin: 0,
    },
    childImageFrame: {
        marginTop: "32px",
        width: "100%",
        minHeight: "160px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
    },
    childPreviewImage: {
        width: "90px",
        height: "90px",
        borderRadius: "50%",
        objectFit: "cover",
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
        backgroundColor: "#11b780",
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
        backgroundColor: "transparent",
        border: "1px solid #1e2a35",
        borderRadius: "10px",
        padding: "14px 16px",
        cursor: "pointer",
        textAlign: "left",
    },
    voiceIcon: {
        fontSize: "18px",
        color: "#11b780",
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
        backgroundColor: "#11b780",
        border: "none",
        fontSize: "22px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 16px rgba(17,183,128,0.4)",
    },
};