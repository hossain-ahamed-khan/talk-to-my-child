"use client";

import { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { selectAuth } from "@/redux/features/auth/authSlice";
import {
    type ChildProfile,
    type UpdateChildRequest,
    useUpdateChildMutation,
} from "@/redux/features/profile/childList/childListApi";

type EditChildModalProps = {
    child: ChildProfile | null;
    onClose: () => void;
    onUpdated: (child: ChildProfile) => void;
};

type FormState = {
    name: string;
    age: string;
    email: string;
    password: string;
    focusArea: string;
    interests: string;
    dislikes: string;
};

const toList = (value: string) => value.split(",").map((item) => item.trim()).filter(Boolean);
const fromList = (value: string[]) => value.join(", ");

const fieldStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    background: "#091520",
    border: "1px solid #1a3348",
    borderRadius: 8,
    color: "#c8dde8",
    padding: "10px 12px",
    fontSize: 14,
    outline: "none",
};

const labelStyle: React.CSSProperties = {
    display: "block",
    color: "#8aaab8",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    marginBottom: 6,
};

export default function EditChildModal({ child, onClose, onUpdated }: EditChildModalProps) {
    const auth = useAppSelector(selectAuth);
    const [updateChild, { isLoading }] = useUpdateChildMutation();
    const [form, setForm] = useState<FormState | null>(() => child ? {
        name: child.name,
        age: String(child.age),
        email: child.email,
        password: "",
        focusArea: fromList(child.focus_area),
        interests: fromList(child.interests),
        dislikes: fromList(child.dislikes),
    } : null);
    const [error, setError] = useState<string | null>(null);

    if (!child || !form) return null;

    const setValue = (key: keyof FormState, value: string) => {
        setForm((current) => current ? { ...current, [key]: value } : current);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!auth.user?.id) {
            setError("Parent account data is unavailable.");
            return;
        }

        const body: UpdateChildRequest = {
            email: form.email.trim(),
            name: form.name.trim(),
            age: Number(form.age),
            parent: auth.user.id,
            profile_photo: child.profile_photo,
            focus_area: toList(form.focusArea),
            interests: toList(form.interests),
            dislikes: toList(form.dislikes),
        };
        if (form.password.trim()) body.password = form.password;

        try {
            setError(null);
            const response = await updateChild({ id: child.id, body }).unwrap();
            onUpdated(response.data);
            onClose();
        } catch {
            setError("Unable to update this child right now.");
        }
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <form style={styles.modal} onClick={(event) => event.stopPropagation()} onSubmit={handleSubmit}>
                <div style={styles.header}>
                    <div>
                        <h2 style={styles.title}>Edit Child Profile</h2>
                        <p style={styles.subtitle}>Update {child.name}&apos;s account details.</p>
                    </div>
                    <button type="button" onClick={onClose} style={styles.closeButton} aria-label="Close modal">×</button>
                </div>

                <div style={styles.grid}>
                    <label style={styles.field}><span style={labelStyle}>CHILD NAME</span><input required value={form.name} onChange={(event) => setValue("name", event.target.value)} style={fieldStyle} /></label>
                    <label style={styles.field}><span style={labelStyle}>AGE</span><input required min={1} max={18} type="number" value={form.age} onChange={(event) => setValue("age", event.target.value)} style={fieldStyle} /></label>
                    <label style={{ ...styles.field, gridColumn: "1 / -1" }}><span style={labelStyle}>EMAIL</span><input required type="email" value={form.email} onChange={(event) => setValue("email", event.target.value)} style={fieldStyle} /></label>
                    <label style={{ ...styles.field, gridColumn: "1 / -1" }}><span style={labelStyle}>NEW PASSWORD (OPTIONAL)</span><input type="password" value={form.password} onChange={(event) => setValue("password", event.target.value)} style={fieldStyle} /></label>
                    <label style={styles.field}><span style={labelStyle}>FOCUS AREAS</span><input value={form.focusArea} onChange={(event) => setValue("focusArea", event.target.value)} placeholder="Math, reading" style={fieldStyle} /></label>
                    <label style={styles.field}><span style={labelStyle}>INTERESTS</span><input value={form.interests} onChange={(event) => setValue("interests", event.target.value)} placeholder="Drawing, games" style={fieldStyle} /></label>
                    <label style={{ ...styles.field, gridColumn: "1 / -1" }}><span style={labelStyle}>DISLIKES</span><input value={form.dislikes} onChange={(event) => setValue("dislikes", event.target.value)} placeholder="Loud noise" style={fieldStyle} /></label>
                </div>

                {error && <div role="alert" style={styles.error}>{error}</div>}
                <div style={styles.actions}>
                    <button type="button" onClick={onClose} style={styles.cancel}>Cancel</button>
                    <button type="submit" disabled={isLoading} style={styles.save}>{isLoading ? "Saving..." : "Save Changes"}</button>
                </div>
            </form>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    overlay: { position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "rgba(0, 0, 0, 0.7)" },
    modal: { width: "min(620px, 100%)", maxHeight: "90vh", overflowY: "auto", background: "#0d1e2d", border: "1px solid #1a3348", borderRadius: 14, padding: 24, color: "#e8f4f8" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 },
    title: { margin: 0, fontSize: 20 },
    subtitle: { margin: "6px 0 0", color: "#8aaab8", fontSize: 13 },
    closeButton: { border: 0, background: "none", color: "#8aaab8", fontSize: 26, lineHeight: 1, padding: 0 },
    grid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 },
    field: { minWidth: 0 },
    actions: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 },
    cancel: { border: "1px solid #2a4a60", background: "transparent", color: "#c8dde8", borderRadius: 20, padding: "10px 18px", fontWeight: 700 },
    save: { border: 0, background: "#10b981", color: "#091520", borderRadius: 20, padding: "10px 18px", fontWeight: 700 },
    error: { color: "#fecaca", fontSize: 13, marginTop: 14 },
};
