"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, CSSProperties, KeyboardEvent } from "react";
import Image from "next/image";
import { useAppSelector } from "@/redux/hooks";
import { selectAuth } from "@/redux/features/auth/authSlice";
import { useCreateChildMutation, type CreateChildRequest, type CreateChildResponseData } from "@/redux/features/child/createChild";

type CreateChildModalProps = {
    open: boolean;
    onClose: () => void;
    onCreate: (child: CreateChildResponseData) => void;
};

type ChildFormState = {
    name: string;
    age: string;
    username: string;
    email: string;
    password: string;
    focusArea: string[];
    focusAreaInput: string;
    personalityTraits: string[];
    personalityInput: string;
    interests: string;
    dislikes: string;
    image: string | null;
};

const emptyForm: ChildFormState = {
    name: "",
    age: "",
    username: "",
    email: "",
    password: "",
    focusArea: [],
    focusAreaInput: "",
    personalityTraits: [],
    personalityInput: "",
    interests: "",
    dislikes: "",
    image: null,
};

function CameraIcon() {
    return (
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
            <path d="M5.5 10.5C5.5 9.12 6.62 8 8 8H10.15L11.45 5.88C11.82 5.29 12.45 4.94 13.13 4.94H16.87C17.55 4.94 18.18 5.29 18.55 5.88L19.85 8H22C23.38 8 24.5 9.12 24.5 10.5V20.5C24.5 21.88 23.38 23 22 23H8C6.62 23 5.5 21.88 5.5 20.5V10.5Z" stroke="#7a8da6" strokeWidth="1.5" />
            <circle cx="15" cy="15.25" r="4.25" stroke="#7a8da6" strokeWidth="1.5" />
        </svg>
    );
}

function PlusBadgeIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.25" strokeLinecap="round" />
        </svg>
    );
}

function EyeIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M2.5 12s3.9-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.9 6.5-9.5 6.5S2.5 12 2.5 12Z" stroke="#7890a8" strokeWidth="1.6" />
            <circle cx="12" cy="12" r="3" stroke="#7890a8" strokeWidth="1.6" />
        </svg>
    );
}

function Chip({ text, onRemove }: { text: string; onRemove: () => void }) {
    return (
        <span style={styles.chip}>
            <span>{text}</span>
            <button type="button" onClick={onRemove} style={styles.chipRemove} aria-label={`Remove ${text}`}>
                ×
            </button>
        </span>
    );
}

export default function CreateChildModal({ open, onClose, onCreate }: CreateChildModalProps) {
    const [form, setForm] = useState<ChildFormState>(emptyForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const auth = useAppSelector(selectAuth);
    const [createChild] = useCreateChildMutation();

    useEffect(() => {
        if (open) {
            setForm(emptyForm);
            setSubmitError(null);
            setIsSubmitting(false);
        }
    }, [open]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const handleKeyDown = (event: globalThis.KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, onClose]);

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setForm((current) => ({ ...current, image: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const addChip = (key: "focusArea" | "personalityTraits", value: string) => {
        const trimmed = value.trim();
        if (!trimmed) {
            return;
        }

        setForm((current) => {
            const list = key === "focusArea" ? current.focusArea : current.personalityTraits;
            if (list.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
                return current;
            }

            return {
                ...current,
                [key]: [...list, trimmed],
                ...(key === "focusArea" ? { focusAreaInput: "" } : { personalityInput: "" }),
            };
        });
    };

    const handleChipKeyDown = (
        event: KeyboardEvent<HTMLInputElement>,
        key: "focusArea" | "personalityTraits",
        value: string,
    ) => {
        if (event.key !== "Enter" && event.key !== ",") {
            return;
        }

        event.preventDefault();
        addChip(key, value);
    };

    const removeChip = (key: "focusArea" | "personalityTraits", value: string) => {
        setForm((current) => ({
            ...current,
            [key]: current[key].filter((item) => item !== value),
        }));
    };

    const splitListValue = (value: string) => value.split(",").map((item) => item.trim()).filter(Boolean);

    const handleCreate = async () => {
        if (!auth.user?.id) {
            setSubmitError("Parent account data is unavailable.");
            return;
        }

        const payload: CreateChildRequest = {
            email: form.email.trim(),
            password: form.password,
            name: form.name.trim(),
            age: Number(form.age) || 0,
            parent: auth.user.id,
            profile_photo: null,
            focus_area: form.focusArea,
            interests: splitListValue(form.interests),
            dislikes: splitListValue(form.dislikes),
        };

        try {
            setSubmitError(null);
            setIsSubmitting(true);
            const response = await createChild(payload).unwrap();
            onCreate(response.data);
            onClose();
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : "Unable to create child right now.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!open) {
        return null;
    }

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(event) => event.stopPropagation()}>
                <div style={styles.header}>
                    <div>
                        <h2 style={styles.title}>Add New Child Account</h2>
                        <p style={styles.subtitle}>Enter your child&apos;s details below.</p>
                    </div>

                    <button type="button" style={styles.closeButton} onClick={onClose} aria-label="Close modal">
                        ×
                    </button>
                </div>

                <div style={styles.content}>
                    <section style={styles.leftColumn}>
                        <div style={styles.sectionHeader}>
                            <p style={styles.sectionTitle}>Child Information</p>
                        </div>

                        <div style={styles.formGrid}>
                            <label style={styles.field}>
                                <span style={styles.label}>Child Name</span>
                                <input
                                    value={form.name}
                                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                                    placeholder="Enter your child name"
                                    style={styles.input}
                                />
                            </label>

                            <label style={styles.field}>
                                <span style={styles.label}>Age</span>
                                <div style={styles.selectWrap}>
                                    <select
                                        value={form.age}
                                        onChange={(event) => setForm((current) => ({ ...current, age: event.target.value }))}
                                        style={styles.select}
                                    >
                                        <option value="" disabled>
                                            Select Age
                                        </option>
                                        {Array.from({ length: 18 }).map((_, index) => {
                                            const age = index + 3;
                                            return (
                                                <option key={age} value={String(age)}>
                                                    {age}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    <span style={styles.selectChevron}>⌄</span>
                                </div>
                            </label>

                            <label style={styles.field}>
                                <span style={styles.label}>Email</span>
                                <input
                                    value={form.email}
                                    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                                    placeholder="Give an Email"
                                    style={styles.input}
                                />
                            </label>

                            <label style={{ ...styles.field, gridColumn: "1 / -1" }}>
                                <span style={styles.label}>Password</span>
                                <div style={styles.passwordWrap}>
                                    <input
                                        type="password"
                                        value={form.password}
                                        onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                                        placeholder="********"
                                        style={{ ...styles.input, paddingRight: "44px" }}
                                    />
                                    <button type="button" style={styles.passwordIconButton} aria-label="Toggle password visibility">
                                        <EyeIcon />
                                    </button>
                                </div>
                            </label>

                            <label style={styles.field}>
                                <span style={styles.label}>Focus Subjects (Optional)</span>
                                <span style={styles.helper}>Add multiple options, separated by commas.</span>
                                <div style={styles.tagBox}>
                                    {form.focusArea.map((item) => (
                                        <Chip key={item} text={item} onRemove={() => removeChip("focusArea", item)} />
                                    ))}
                                    <input
                                        value={form.focusAreaInput}
                                        onChange={(event) => setForm((current) => ({ ...current, focusAreaInput: event.target.value }))}
                                        onKeyDown={(event) => handleChipKeyDown(event, "focusArea", form.focusAreaInput)}
                                        placeholder="Add subject..."
                                        style={styles.tagInput}
                                    />
                                </div>
                            </label>

                            <label style={styles.field}>
                                <span style={styles.label}>Interests (Optional)</span>
                                <span style={styles.helper}>Add multiple options, separated by commas.</span>
                                <textarea
                                    value={form.interests}
                                    onChange={(event) => setForm((current) => ({ ...current, interests: event.target.value }))}
                                    placeholder="e.g. Space, Dinosaurs..."
                                    rows={3}
                                    style={styles.textarea}
                                />
                            </label>

                            <label style={styles.field}>
                                <span style={styles.label}>Dislikes (Optional)</span>
                                <span style={styles.helper}>Add multiple options, separated by commas.</span>
                                <textarea
                                    value={form.dislikes}
                                    onChange={(event) => setForm((current) => ({ ...current, dislikes: event.target.value }))}
                                    placeholder="e.g. Loud noises, Broccoli..."
                                    rows={3}
                                    style={styles.textarea}
                                />
                            </label>
                        </div>

                        <div style={styles.actions}>
                            <button type="button" onClick={handleCreate} disabled={!form.name.trim() || !form.email.trim() || !form.password || isSubmitting} style={styles.primaryAction}>
                                {isSubmitting ? "Creating..." : "Create Child"}
                            </button>
                            <button type="button" onClick={onClose} style={styles.secondaryAction}>
                                Cancel
                            </button>
                        </div>

                        {submitError && (
                            <p style={styles.errorText}>{submitError}</p>
                        )}
                    </section>

                    <aside style={styles.rightColumn}>
                        <div style={styles.imagePanel}>
                            <p style={styles.panelTitle}>Upload Child Image (Optional)</p>

                            <button type="button" style={styles.imagePicker} onClick={() => imageInputRef.current?.click()}>
                                {form.image ? (
                                    <Image src={form.image} alt="Child preview" width={156} height={156} style={styles.previewImage} />
                                ) : (
                                    <div style={styles.imagePlaceholder}>
                                        <div style={styles.imageRing}>
                                            <CameraIcon />
                                        </div>
                                        <span style={styles.addBadge}>
                                            <PlusBadgeIcon />
                                        </span>
                                    </div>
                                )}
                            </button>

                            <input ref={imageInputRef} type="file" accept="image/*" hidden onChange={handleImageUpload} />
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
        zIndex: 60,
        display: "grid",
        placeItems: "center",
        padding: "16px",
        backgroundColor: "rgba(5, 10, 19, 0.82)",
        backdropFilter: "blur(14px)",
    },
    modal: {
        width: "min(1260px, 100%)",
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
        flex: "1 1 720px",
        minWidth: 0,
    },
    rightColumn: {
        flex: "0 0 340px",
        minWidth: "300px",
        display: "grid",
        gap: "14px",
    },
    sectionHeader: {
        marginBottom: "14px",
    },
    sectionTitle: {
        margin: 0,
        color: "#ffffff",
        fontSize: "20px",
        fontWeight: 700,
    },
    formGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: "18px 16px",
    },
    field: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    label: {
        fontSize: "13px",
        fontWeight: 700,
        color: "#d7e4ef",
    },
    helper: {
        color: "#62778d",
        fontSize: "12px",
        lineHeight: 1.45,
        marginTop: "-2px",
    },
    input: {
        width: "100%",
        minWidth: 0,
        borderRadius: "999px",
        border: "1px solid rgba(53, 75, 97, 0.85)",
        backgroundColor: "rgba(14, 22, 36, 0.92)",
        color: "#ffffff",
        fontSize: "14px",
        padding: "14px 16px",
        outline: "none",
        boxSizing: "border-box",
    },
    selectWrap: {
        position: "relative",
    },
    select: {
        width: "100%",
        minWidth: 0,
        borderRadius: "999px",
        border: "1px solid rgba(53, 75, 97, 0.85)",
        backgroundColor: "rgba(14, 22, 36, 0.92)",
        color: "#ffffff",
        fontSize: "14px",
        padding: "14px 42px 14px 16px",
        outline: "none",
        boxSizing: "border-box",
        appearance: "none",
    },
    selectChevron: {
        position: "absolute",
        right: "16px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "#7890a8",
        pointerEvents: "none",
        fontSize: "18px",
        lineHeight: 1,
    },
    passwordWrap: {
        position: "relative",
    },
    passwordIconButton: {
        position: "absolute",
        right: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        display: "grid",
        placeItems: "center",
    },
    textarea: {
        width: "100%",
        minHeight: "102px",
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
    tagBox: {
        minHeight: "80px",
        borderRadius: "20px",
        border: "1px solid rgba(53, 75, 97, 0.85)",
        backgroundColor: "rgba(14, 22, 36, 0.92)",
        padding: "12px 14px",
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        alignItems: "center",
    },
    tagInput: {
        flex: "1 1 120px",
        minWidth: "120px",
        border: "none",
        outline: "none",
        background: "transparent",
        color: "#ffffff",
        fontSize: "14px",
        padding: "4px 2px",
    },
    chip: {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        borderRadius: "999px",
        padding: "7px 10px 7px 12px",
        background: "rgba(20, 211, 156, 0.08)",
        color: "#14d39c",
        fontSize: "13px",
        fontWeight: 700,
    },
    chipRemove: {
        border: "none",
        background: "transparent",
        color: "#14d39c",
        padding: 0,
        cursor: "pointer",
        fontSize: "16px",
        lineHeight: 1,
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
    errorText: {
        margin: "12px 0 0",
        color: "#fca5a5",
        fontSize: "13px",
        lineHeight: 1.5,
    },
    imagePanel: {
        borderRadius: "24px",
        border: "1px solid rgba(38, 57, 79, 0.9)",
        background: "rgba(13, 20, 34, 0.9)",
        padding: "18px",
        display: "grid",
        justifyItems: "center",
        gap: "14px",
        minHeight: "218px",
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
        width: "88px",
        height: "88px",
        borderRadius: "50%",
        border: "2px dashed rgba(97, 119, 143, 0.55)",
        display: "grid",
        placeItems: "center",
        background: "rgba(16, 24, 39, 0.2)",
    },
    addBadge: {
        position: "absolute",
        right: "29px",
        bottom: "28px",
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(135deg, #22c55e 0%, #14b8a6 100%)",
        boxShadow: "0 8px 18px rgba(20, 211, 156, 0.24)",
    },
};