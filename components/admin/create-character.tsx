"use client";

import { useRef, useState } from "react";
import type { ChangeEvent, CSSProperties } from "react";
import Image, { type ImageLoaderProps } from "next/image";

const inputStyle: CSSProperties = {
    width: "100%",
    backgroundColor: "#111C27",
    border: "1px solid #1E2F3F",
    borderRadius: "10px",
    color: "#FFFFFF",
    fontSize: "14px",
    padding: "12px 16px",
    outline: "none",
    boxSizing: "border-box",
};

const labelStyle: CSSProperties = {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.8px",
    color: "#8A9BAE",
    marginBottom: "8px",
    display: "block",
};

const sectionStyle: CSSProperties = {
    marginBottom: "24px",
};

const previewImageLoader = ({ src }: ImageLoaderProps) => src;

export default function CreateCharacter() {
    const [name, setName] = useState("Dad");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [role, setRole] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImage(url);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#0F1923",
                color: "#FFFFFF",
                fontFamily: "'Segoe UI', sans-serif",
                padding: "32px 24px",
                maxWidth: "720px",
                margin: "0 auto",
            }}
        >
            <div style={{ marginBottom: "28px" }}>
                <h1 style={{ fontSize: "26px", fontWeight: "800", margin: "0 0 6px" }}>Create Character</h1>
                <p style={{ margin: 0, fontSize: "13px", color: "#8A9BAE", lineHeight: 1.5 }}>
                    Create a character of a loved one, family or friend or even a superhero! Unleash your imagination.
                </p>
            </div>

            <div style={sectionStyle}>
                <label style={labelStyle}>CHARACTER NAME</label>
                <div style={{ position: "relative" }}>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ ...inputStyle, paddingRight: "44px" }}
                        placeholder="e.g. Dad"
                    />
                    <button
                        style={{
                            position: "absolute",
                            right: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            color: "#8A9BAE",
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                                d="M11.5 2.5a1.5 1.5 0 012.121 2.121L5 13.243l-3 .757.757-3L11.5 2.5z"
                                stroke="#8A9BAE"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <div style={{ borderTop: "1px solid #1E2F3F", marginBottom: "24px" }} />

            <div style={{ marginBottom: "24px" }}>
                <p style={{ ...labelStyle, marginBottom: "2px" }}>CHARACTER DETAILS (OPTIONAL)</p>
                <p style={{ fontSize: "12px", color: "#5A6A7A", margin: "0 0 16px" }}>
                    Providing these details helps our AI fit into their role more authentically for your child.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                    <div>
                        <label style={labelStyle}>AGE</label>
                        <input
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            style={inputStyle}
                            placeholder="e.g. 45"
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>GENDER</label>
                        <div style={{ position: "relative" }}>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                style={{
                                    ...inputStyle,
                                    appearance: "none",
                                    paddingRight: "36px",
                                    color: gender ? "#FFFFFF" : "#5A6A7A",
                                }}
                            >
                                <option value="" disabled>
                                    e.g. Male
                                </option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            <svg
                                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                            >
                                <path d="M3 5l4 4 4-4" stroke="#8A9BAE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                    <label style={labelStyle}>ROLE</label>
                    <input
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        style={inputStyle}
                        placeholder="e.g. Grandfather, Superhero"
                    />
                </div>

                <div style={{ marginBottom: "16px" }}>
                    <label style={labelStyle}>CATEGORY</label>
                    <div style={{ position: "relative" }}>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            style={{
                                ...inputStyle,
                                appearance: "none",
                                paddingRight: "36px",
                                color: category ? "#FFFFFF" : "#5A6A7A",
                            }}
                        >
                            <option value="" disabled>
                                e.g. Family
                            </option>
                            <option value="family">Family</option>
                            <option value="heroes">Heroes</option>
                            <option value="health">Health</option>
                            <option value="safety">Safety</option>
                        </select>
                        <svg
                            style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                        >
                            <path d="M3 5l4 4 4-4" stroke="#8A9BAE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                    <label style={labelStyle}>BRIEF DESCRIPTION</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your character's personality and background..."
                        rows={4}
                        style={{
                            ...inputStyle,
                            resize: "none",
                            lineHeight: "1.5",
                        }}
                    />
                </div>

                <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        backgroundColor: "#111C27",
                        border: "1px solid #1E2F3F",
                        borderRadius: "12px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "36px 20px",
                        cursor: "pointer",
                        gap: "12px",
                    }}
                >
                    <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
                    {image ? (
                        <Image
                            src={image}
                            alt="Character"
                            width={80}
                            height={80}
                            loader={previewImageLoader}
                            unoptimized
                            style={{ borderRadius: "50%", objectFit: "cover" }}
                        />
                    ) : (
                        <div style={{ position: "relative" }}>
                            <div
                                style={{
                                    width: "64px",
                                    height: "64px",
                                    borderRadius: "50%",
                                    border: "2px dashed #2A3D52",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                    <rect x="3" y="6" width="22" height="17" rx="3" stroke="#5A6A7A" strokeWidth="1.5" />
                                    <circle cx="14" cy="14" r="4" stroke="#5A6A7A" strokeWidth="1.5" />
                                    <path d="M10 6l1.5-2.5h5L18 6" stroke="#5A6A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: "-2px",
                                    right: "-4px",
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    backgroundColor: "#2DBE8C",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                    <line x1="5" y1="2" x2="5" y2="8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                    <line x1="2" y1="5" x2="8" y2="5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>
                    )}
                    <div style={{ textAlign: "center" }}>
                        <p style={{ margin: "0 0 2px", fontWeight: "600", fontSize: "14px" }}>Upload Character Image (Optional)</p>
                        <p style={{ margin: 0, fontSize: "10px", color: "#5A6A7A", letterSpacing: "0.8px", fontWeight: "600" }}>
                            VISUAL PERSONA MAPPING
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <label style={{ ...labelStyle, marginBottom: "12px" }}>VOICE SOURCE METHODS</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <button
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                            backgroundColor: "#111C27",
                            border: "1px solid #1E2F3F",
                            borderRadius: "12px",
                            padding: "16px 18px",
                            cursor: "pointer",
                            textAlign: "left",
                            color: "#FFFFFF",
                            width: "100%",
                        }}
                    >
                        <div
                            style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                backgroundColor: "#1A2E3E",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <rect x="6" y="1" width="4" height="8" rx="2" stroke="#2DBE8C" strokeWidth="1.4" />
                                <path d="M3 8a5 5 0 0010 0" stroke="#2DBE8C" strokeWidth="1.4" strokeLinecap="round" />
                                <line x1="8" y1="13" x2="8" y2="15" stroke="#2DBE8C" strokeWidth="1.4" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: "600" }}>Press to record</p>
                            <p style={{ margin: 0, fontSize: "10px", color: "#5A6A7A", letterSpacing: "0.6px", fontWeight: "600" }}>
                                DIRECT RECORDING
                            </p>
                        </div>
                        <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                            <path d="M1 1l6 6-6 6" stroke="#5A6A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    <button
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                            backgroundColor: "#111C27",
                            border: "1px solid #1E2F3F",
                            borderRadius: "12px",
                            padding: "16px 18px",
                            cursor: "pointer",
                            textAlign: "left",
                            color: "#FFFFFF",
                            width: "100%",
                        }}
                    >
                        <div
                            style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                backgroundColor: "#1A2E3E",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                                <rect x="1" y="1" width="16" height="12" rx="3" stroke="#2DBE8C" strokeWidth="1.4" />
                                <path d="M7 4.5l5 2.5-5 2.5V4.5z" fill="#2DBE8C" />
                            </svg>
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: "600" }}>Paste YouTube link</p>
                            <p style={{ margin: 0, fontSize: "10px", color: "#5A6A7A", letterSpacing: "0.6px", fontWeight: "600" }}>
                                WEB AUDIO SOURCE
                            </p>
                        </div>
                        <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                            <path d="M1 1l6 6-6 6" stroke="#5A6A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    <button
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                            backgroundColor: "#111C27",
                            border: "1px solid #1E2F3F",
                            borderRadius: "12px",
                            padding: "16px 18px",
                            cursor: "pointer",
                            textAlign: "left",
                            color: "#FFFFFF",
                            width: "100%",
                        }}
                    >
                        <div
                            style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                backgroundColor: "#1A2E3E",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M3 13V5l4-4h6v12H3z" stroke="#2DBE8C" strokeWidth="1.4" strokeLinejoin="round" />
                                <path d="M7 1v4H3" stroke="#2DBE8C" strokeWidth="1.4" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: "600" }}>Choose File</p>
                            <p style={{ margin: 0, fontSize: "10px", color: "#5A6A7A", letterSpacing: "0.6px", fontWeight: "600" }}>
                                FILE AUDIO SOURCE
                            </p>
                        </div>
                        <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                            <path d="M1 1l6 6-6 6" stroke="#5A6A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>

            <button
                style={{
                    marginTop: "32px",
                    width: "100%",
                    backgroundColor: "#2DBE8C",
                    border: "none",
                    borderRadius: "12px",
                    color: "#FFFFFF",
                    fontSize: "15px",
                    fontWeight: "700",
                    padding: "15px",
                    cursor: "pointer",
                }}
            >
                Create Character
            </button>
        </div>
    );
}