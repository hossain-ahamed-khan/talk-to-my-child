"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, CSSProperties, Dispatch, SetStateAction } from "react";
import Image from "next/image";

import { useCreateCharacterMutation } from "@/redux/features/parent/characters/createCharacters";
import type { CharacterProfile } from "@/redux/features/parent/characters/characterList";

export type CharacterFormState = {
    name: string;
    gender: string;
    category: string;
    role: string;
    age: string;
    description: string;
    profile_image: File | string | null;
    voice_sample: File | string | null;
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
    onCreate: (character: CharacterProfile) => void;
};

const genderOptions = ["Female", "Male", "Neutral"];

const voiceSourceMethods = [
    {
        key: "record",
        label: "Press to record",
        description: "Direct recording",
    },
    {
        key: "upload",
        label: "Choose File",
        description: "Select from device",
    },
] as const;

type VoiceMethod = (typeof voiceSourceMethods)[number]["key"];
type RecordingState = "idle" | "recording" | "processing";

export default function CharacterCreateModal({ open, form, setForm, onClose, onCreate }: CharacterCreateModalProps) {
    const imageInputRef = useRef<HTMLInputElement>(null);
    const voiceInputRef = useRef<HTMLInputElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const recordingChunksRef = useRef<Blob[]>([]);
    const isOpenRef = useRef(open);

    const [createCharacter, { isLoading }] = useCreateCharacterMutation();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [voiceMethod, setVoiceMethod] = useState<VoiceMethod | null>(null);
    const [recordingState, setRecordingState] = useState<RecordingState>("idle");

    useEffect(() => {
        isOpenRef.current = open;
    }, [open]);

    useEffect(() => {
        if (!form.profile_image) {
            setImagePreviewUrl(null);
            return;
        }

        if (typeof form.profile_image === "string") {
            setImagePreviewUrl(form.profile_image);
            return;
        }

        const objectUrl = URL.createObjectURL(form.profile_image);
        setImagePreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [form.profile_image]);

    useEffect(() => {
        if (!open) {
            setSubmitError(null);
            setVoiceMethod(null);
            setRecordingState("idle");
        }
    }, [open]);

    useEffect(
        () => () => {
            stopRecordingSession();
        },
        []
    );

    if (!open) {
        return null;
    }

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        setForm((current) => ({ ...current, profile_image: file }));
    };

    const handleVoiceFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        setForm((current) => ({ ...current, voice_sample: file }));
        setVoiceMethod("upload");
    };

    const handleVoiceMethodClick = (method: VoiceMethod) => {
        if (method === "upload") {
            if (recordingState !== "idle") {
                return;
            }

            voiceInputRef.current?.click();
            return;
        }

        if (recordingState === "recording") {
            stopRecording();
            return;
        }

        if (recordingState === "idle") {
            void startRecording();
        }
    };

    const handleCreate = async () => {
        setSubmitError(null);

        try {
            const response = await createCharacter(buildCharacterFormData(form)).unwrap();
            onCreate(response.data);
            onClose();
        } catch (error) {
            setSubmitError(getErrorMessage(error, "Unable to create character. Please try again."));
        }
    };

    function stopRecordingSession() {
        const recorder = mediaRecorderRef.current;

        if (recorder && recorder.state !== "inactive") {
            recorder.stop();
        }

        mediaRecorderRef.current = null;
        mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
    }

    async function startRecording() {
        if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
            setSubmitError("This browser does not support voice recording.");
            return;
        }

        try {
            setSubmitError(null);
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;
            recordingChunksRef.current = [];

            const mimeType = getSupportedRecordingMimeType();
            const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

            mediaRecorderRef.current = recorder;
            setVoiceMethod("record");
            setRecordingState("recording");

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordingChunksRef.current.push(event.data);
                }
            };

            recorder.onstop = () => {
                void finalizeRecording(recorder.mimeType || "audio/webm");
            };

            recorder.start();
        } catch (error) {
            stopRecordingSession();
            setRecordingState("idle");
            setSubmitError(getErrorMessage(error, "Unable to access the microphone."));
        }
    }

    function stopRecording() {
        const recorder = mediaRecorderRef.current;

        if (!recorder || recorder.state === "inactive") {
            return;
        }

        recorder.stop();
        setRecordingState("processing");
    }

    async function finalizeRecording(mimeType: string) {
        const chunks = recordingChunksRef.current.slice();
        recordingChunksRef.current = [];

        try {
            if (!isOpenRef.current) {
                return;
            }

            const recordedBlob = new Blob(chunks, { type: mimeType });
            const recordedFile = createRecordedAudioFile(recordedBlob, mimeType);

            setForm((current) => ({ ...current, voice_sample: recordedFile }));
            setVoiceMethod("record");
        } catch (error) {
            if (isOpenRef.current) {
                setSubmitError(getErrorMessage(error, "Unable to save the recording."));
            }
        } finally {
            stopRecordingSession();
            if (isOpenRef.current) {
                setRecordingState("idle");
            }
        }
    }

    const selectedVoiceLabel =
        form.voice_sample instanceof File
            ? form.voice_sample.name
            : voiceMethod === "record"
                ? "Recorded voice"
                : null;

    const createDisabled = !form.name.trim() || isLoading || recordingState !== "idle";

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
                                    placeholder="Warm, encouraging, and likes to tell dad jokes. Always starts conversations with 'Hey champ!'"
                                    rows={5}
                                    style={styles.textarea}
                                />
                            </label>
                        </div>

                        <div style={styles.actions}>
                            <button type="button" onClick={handleCreate} disabled={createDisabled} style={styles.primaryAction}>
                                {isLoading ? "Creating..." : "Create Character"}
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
                                {imagePreviewUrl ? (
                                    <Image
                                        src={imagePreviewUrl}
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
                                    const selected = method.key === "record" ? voiceMethod === "record" : voiceMethod === "upload";
                                    const label =
                                        method.key === "record"
                                            ? recordingState === "recording"
                                                ? "Stop recording"
                                                : recordingState === "processing"
                                                    ? "Encoding voice..."
                                                    : method.label
                                            : method.label;

                                    return (
                                        <button
                                            key={method.key}
                                            type="button"
                                            onClick={() => handleVoiceMethodClick(method.key)}
                                            disabled={recordingState === "processing" || isLoading}
                                            style={{
                                                ...styles.voiceCard,
                                                ...(selected ? styles.voiceCardActive : null),
                                                ...(recordingState === "recording" && method.key === "record" ? styles.voiceCardRecording : null),
                                            }}
                                        >
                                            <div style={styles.voiceIconWrap}>
                                                {method.key === "record" ? (
                                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                                                        <rect x="7" y="2.5" width="4" height="9" rx="2" stroke="#14d39c" strokeWidth="1.5" />
                                                        <path d="M5.5 8.5C5.5 10.985 7.515 13 10 13C12.485 13 14.5 10.985 14.5 8.5" stroke="#14d39c" strokeWidth="1.5" strokeLinecap="round" />
                                                        <path d="M9 13V15.5" stroke="#14d39c" strokeWidth="1.5" strokeLinecap="round" />
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
                                                <span style={styles.voiceLabel}>{label}</span>
                                                <span style={styles.voiceDescription}>{method.description}</span>
                                            </div>

                                            <span style={styles.chevron}>›</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {selectedVoiceLabel ? <p style={styles.fileStatus}>Selected voice: {selectedVoiceLabel}</p> : null}
                            {recordingState === "recording" ? (
                                <p style={styles.fileStatus}>Recording now. Click the button again to stop.</p>
                            ) : null}
                            {recordingState === "processing" ? <p style={styles.fileStatus}>Saving recorded audio...</p> : null}

                            <input ref={voiceInputRef} type="file" accept="audio/*" hidden onChange={handleVoiceFileUpload} />
                        </div>

                        {submitError ? <p style={styles.errorText}>{submitError}</p> : null}
                    </aside>
                </div>
            </div>
        </div>
    );
}

function buildCharacterFormData(form: CharacterFormState) {
    const formData = new FormData();

    formData.append("name", form.name.trim());
    formData.append("gender", form.gender.trim());
    formData.append("category", form.category.trim());
    formData.append("role", form.role.trim());
    formData.append("age", form.age.trim());
    formData.append("description", form.description.trim());

    if (form.profile_image instanceof File) {
        formData.append("profile_image", form.profile_image, form.profile_image.name);
    }

    if (form.voice_sample instanceof File) {
        formData.append("voice_sample", form.voice_sample, form.voice_sample.name);
    }

    return formData;
}

function createRecordedAudioFile(recordingBlob: Blob, mimeType: string) {
    const extension = mimeType.includes("ogg") ? "ogg" : mimeType.includes("wav") ? "wav" : "webm";
    const normalizedType = mimeType || recordingBlob.type || "audio/webm";

    return new File([recordingBlob], `voice-sample-${Date.now()}.${extension}`, { type: normalizedType });
}

function getSupportedRecordingMimeType() {
    if (typeof MediaRecorder === "undefined") {
        return "";
    }

    if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        return "audio/webm;codecs=opus";
    }

    if (MediaRecorder.isTypeSupported("audio/webm")) {
        return "audio/webm";
    }

    return "";
}

function getErrorMessage(error: unknown, fallback: string) {
    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === "object" && error !== null && "data" in error) {
        const data = (error as { data?: { message?: string; detail?: string } }).data;
        return data?.message ?? data?.detail ?? fallback;
    }

    return fallback;
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
        border: "1px solid rgba(20, 211, 156, 0.95)",
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
        border: "1px solid rgba(20, 211, 156, 0.7)",
        boxShadow: "0 0 0 1px rgba(20, 211, 156, 0.1) inset",
    },
    voiceCardRecording: {
        border: "1px solid rgba(20, 211, 156, 0.9)",
        background: "rgba(20, 211, 156, 0.1)",
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
    fileStatus: {
        margin: "10px 0 0",
        color: "#8a9eb2",
        fontSize: "12px",
        lineHeight: 1.5,
    },
    errorText: {
        margin: "14px 0 0",
        color: "#ff8f8f",
        fontSize: "13px",
        lineHeight: 1.5,
    },
};
