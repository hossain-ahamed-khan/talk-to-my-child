"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";

import CharacterCreateModal, {
    defaultCharacterForm,
    type CharacterFormState,
} from "@/components/parent/character-create-modal";
import { selectToken } from "@/redux/features/auth/authSlice";
import {
    type CharacterProfile,
    useGetCharacterListApiQuery,
} from "@/redux/features/parent/characters/characterList";
import { useDeleteCharacterMutation } from "@/redux/features/parent/characters/createCharacters";
import { useGetChildListApiQuery } from "@/redux/features/profile/childList/childListApi";
import {
    useCreateCharacterInstructionMutation,
    useDeleteCharacterInstructionMutation,
    useGetCharacterInstructionsQuery,
    useUpdateCharacterInstructionMutation,
} from "@/redux/features/parent/characters/characterInstructions";
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

function getApiErrorMessage(error: unknown) {
    if (!error || typeof error !== "object") return "Unable to save this instruction. Please try again.";

    const data = "data" in error ? error.data : null;
    if (typeof data === "string" && data) return data;
    if (data && typeof data === "object") {
        const details = Object.values(data).flat().find((value) => typeof value === "string");
        if (typeof details === "string") return details;
    }

    return "Unable to save this instruction. Please try again.";
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
    const router = useRouter();
    const token = useAppSelector(selectToken);
    const { data: characters = [], isLoading, isError } = useGetCharacterListApiQuery(undefined, {
        skip: !token,
    });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [form, setForm] = useState<CharacterFormState>(defaultCharacterForm);
    const [localCharacter, setLocalCharacter] = useState<CharacterProfile | null>(null);
    const [deleteCharacter, { isLoading: isDeleting }] = useDeleteCharacterMutation();

    const character = localCharacter ?? characters.find((item) => item.id === Number(id)) ?? getStoredCharacter(id);

    const openEditModal = () => {
        if (!character) return;

        setForm({
            name: character.name,
            gender: character.gender,
            category: character.category,
            role: character.role,
            age: String(character.age),
            description: character.description,
            profile_image: character.profile_image,
            voice_sample: character.voice_sample,
        });
        setIsEditModalOpen(true);
    };

    const handleUpdatedCharacter = (updatedCharacter: CharacterProfile) => {
        setLocalCharacter(updatedCharacter);
        window.sessionStorage.setItem(`character:${updatedCharacter.id}`, JSON.stringify(updatedCharacter));
        setIsEditModalOpen(false);
    };

    const handleDelete = async () => {
        if (!character || isDeleting) return;

        const confirmation = await Swal.fire({
            title: "Delete character?",
            text: `${character.name} will be permanently deleted.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
        });

        if (!confirmation.isConfirmed) return;

        try {
            await deleteCharacter(character.id).unwrap();
            window.sessionStorage.removeItem(`character:${character.id}`);
            await Swal.fire({
                title: "Deleted",
                text: `${character.name} was deleted successfully.`,
                icon: "success",
                confirmButtonColor: "#11b780",
                timer: 1600,
                timerProgressBar: true,
            });
            router.push("/parent/characters");
        } catch {
            await Swal.fire({
                title: "Delete failed",
                text: "Unable to delete this character. Please try again.",
                icon: "error",
                confirmButtonColor: "#dc2626",
            });
        }
    };

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
                    <>
                        <CharacterDetails character={character} onEdit={openEditModal} onDelete={handleDelete} isDeleting={isDeleting} />
                        <CharacterInstructionsSection characterId={character.id} />
                        <CharacterCreateModal
                            open={isEditModalOpen}
                            form={form}
                            setForm={setForm}
                            onClose={() => setIsEditModalOpen(false)}
                            onCreate={handleUpdatedCharacter}
                            mode="edit"
                            characterId={character.id}
                        />
                    </>
                )}
            </main>
        </div>
    );
}

function CharacterInstructionsSection({ characterId }: { characterId: number }) {
    const { data: children = [], isLoading: isChildrenLoading } = useGetChildListApiQuery();
    const [selectedChildId, setSelectedChildId] = useState("");
    const [instruction, setInstruction] = useState("");
    const [editingId, setEditingId] = useState<string | number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const selectedChild = children.find((child) => child.id === selectedChildId);
    const { data: instructions = [], isLoading, isFetching, isError } = useGetCharacterInstructionsQuery(
        { childId: selectedChildId, characterId },
        { skip: !selectedChildId },
    );
    const existingInstruction = instructions[0] ?? null;
    const [createInstruction, { isLoading: isCreating }] = useCreateCharacterInstructionMutation();
    const [updateInstruction, { isLoading: isUpdating }] = useUpdateCharacterInstructionMutation();
    const [deleteInstruction, { isLoading: isDeleting }] = useDeleteCharacterInstructionMutation();

    const resetForm = () => {
        setInstruction("");
        setEditingId(null);
        setError(null);
    };

    const handleSubmit = async () => {
        const value = instruction.trim();
        if (!selectedChildId || !value) {
            setError("Choose a child and enter an instruction first.");
            return;
        }

        try {
            if (editingId !== null || existingInstruction) {
                await updateInstruction({ childId: selectedChildId, characterId, body: { parent_instructions: value } }).unwrap();
            } else {
                await createInstruction({ childId: selectedChildId, characterId, body: { parent_instructions: value } }).unwrap();
            }
            resetForm();
        } catch (submitError: unknown) {
            setError(getApiErrorMessage(submitError));
        }
    };

    const handleDelete = async () => {
        if (!selectedChildId || instructions.length === 0) return;
        const confirmation = await Swal.fire({
            title: "Delete instruction?",
            text: `Remove the instruction for ${selectedChild?.name ?? "this child"}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
        });
        if (!confirmation.isConfirmed) return;

        try {
            await deleteInstruction({ childId: selectedChildId, characterId }).unwrap();
            resetForm();
        } catch (deleteError: unknown) {
            setError(getApiErrorMessage(deleteError));
        }
    };

    return (
        <section style={styles.instructionsCard}>
            <div style={styles.instructionsHeader}>
                <div>
                    <p style={styles.kicker}>Personalized guidance</p>
                    <h2 style={styles.sectionTitle}>Child instructions</h2>
                    <p style={styles.instructionsIntro}>Give this character guidance that applies to one specific child.</p>
                </div>
                <span style={styles.instructionCount}>{instructions.length} saved</span>
            </div>

            <div style={styles.instructionForm}>
                <label style={styles.fieldLabel} htmlFor="instruction-child">Choose a child</label>
                <select
                    id="instruction-child"
                    value={selectedChildId}
                    onChange={(event) => { setSelectedChildId(event.target.value); resetForm(); }}
                    style={styles.select}
                    disabled={isChildrenLoading}
                >
                    <option value="">{isChildrenLoading ? "Loading children..." : "Select a child"}</option>
                    {children.map((child) => <option key={child.id} value={child.id}>{child.name}</option>)}
                </select>

                <label style={styles.fieldLabel} htmlFor="parent-instruction">Instruction</label>
                <textarea
                    id="parent-instruction"
                    value={instruction}
                    onChange={(event) => setInstruction(event.target.value)}
                    placeholder="Example: Encourage Maya to explain new words with a story."
                    rows={4}
                    style={styles.textarea}
                    disabled={!selectedChildId}
                />
                {error && <p style={styles.errorText}>{error}</p>}
                <div style={styles.instructionActions}>
                    {editingId !== null && <button type="button" style={styles.cancelButton} onClick={resetForm}>Cancel</button>}
                    <button type="button" style={styles.editButton} onClick={handleSubmit} disabled={isCreating || isUpdating || !selectedChildId}>
                        <Plus size={15} />
                        {isCreating || isUpdating ? "Saving..." : editingId !== null || existingInstruction ? "Update instruction" : "Add instruction"}
                    </button>
                </div>
            </div>

            <div style={styles.savedInstructions}>
                <h3 style={styles.savedTitle}>Saved for {selectedChild?.name ?? "selected child"}</h3>
                {!selectedChildId ? <p style={styles.emptyText}>Select a child to view their instructions.</p> : isLoading || isFetching ? <p style={styles.emptyText}>Loading instructions...</p> : isError ? <p style={styles.errorText}>Unable to load instructions.</p> : instructions.length === 0 ? <p style={styles.emptyText}>No instructions have been added for this child.</p> : instructions.map((item) => (
                    <article key={item.id} style={styles.instructionItem}>
                        <p style={styles.instructionText}>{item.parent_instructions}</p>
                        <div style={styles.itemActions}>
                            <button type="button" style={styles.itemButton} onClick={() => { setEditingId(item.id); setInstruction(item.parent_instructions); }}>Edit</button>
                            <button type="button" style={styles.itemDeleteButton} onClick={handleDelete} disabled={isDeleting}>Delete</button>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

function CharacterDetails({
    character,
    onEdit,
    onDelete,
    isDeleting,
}: {
    character: CharacterProfile;
    onEdit: () => void;
    onDelete: () => void;
    isDeleting: boolean;
}) {
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
                    <div style={styles.actionRow}>
                        <button type="button" style={styles.editButton} onClick={onEdit}>
                            <Pencil size={15} />
                            Edit character
                        </button>
                        <button type="button" style={styles.deleteButton} onClick={onDelete} disabled={isDeleting}>
                            <Trash2 size={15} />
                            {isDeleting ? "Deleting..." : "Delete character"}
                        </button>
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
    pageFrame: { width: "100%", margin: "0 auto", color: "#e8f4f8", fontFamily: "var(--font-sans)" },
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
    actionRow: { display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "18px" },
    editButton: { display: "inline-flex", alignItems: "center", gap: "7px", border: "0", borderRadius: "999px", background: "#11b780", color: "#fff", padding: "10px 14px", fontSize: "13px", fontWeight: 700, cursor: "pointer" },
    deleteButton: { display: "inline-flex", alignItems: "center", gap: "7px", border: "1px solid rgba(248,113,113,0.35)", borderRadius: "999px", background: "transparent", color: "#fca5a5", padding: "10px 14px", fontSize: "13px", fontWeight: 700, cursor: "pointer" },
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
    instructionsCard: { marginTop: "18px", border: "1px solid #1a3348", borderRadius: "22px", background: "#0d1e2d", padding: "clamp(20px, 4vw, 32px)" },
    instructionsHeader: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", borderBottom: "1px solid #1a3348", paddingBottom: "20px" },
    instructionsIntro: { color: "#8aaab8", lineHeight: 1.6, margin: "8px 0 0", fontSize: "14px" },
    instructionCount: { color: "#7df0c3", background: "rgba(17,183,128,0.12)", borderRadius: "999px", padding: "7px 10px", fontSize: "12px", fontWeight: 700 },
    instructionForm: { display: "grid", gap: "9px", maxWidth: "760px", marginTop: "24px" },
    fieldLabel: { color: "#c8dde8", fontSize: "13px", fontWeight: 600 },
    select: { width: "100%", minHeight: "42px", border: "1px solid #2a4c60", borderRadius: "10px", background: "#091520", color: "#e8f4f8", padding: "0 12px", fontSize: "14px", outline: "none" },
    textarea: { width: "100%", boxSizing: "border-box", border: "1px solid #2a4c60", borderRadius: "10px", background: "#091520", color: "#e8f4f8", padding: "12px", fontFamily: "inherit", fontSize: "14px", lineHeight: 1.6, resize: "vertical", outline: "none" },
    instructionActions: { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginTop: "5px" },
    cancelButton: { border: "1px solid #2a4c60", borderRadius: "999px", background: "transparent", color: "#8aaab8", padding: "10px 14px", fontSize: "13px", fontWeight: 700, cursor: "pointer" },
    errorText: { color: "#fca5a5", fontSize: "13px", margin: "2px 0 0" },
    savedInstructions: { marginTop: "30px", paddingTop: "24px", borderTop: "1px solid #1a3348" },
    savedTitle: { color: "#e8f4f8", fontSize: "16px", margin: "0 0 12px" },
    emptyText: { color: "#8aaab8", fontSize: "14px", margin: 0, lineHeight: 1.6 },
    instructionItem: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", border: "1px solid #1a3348", borderRadius: "12px", background: "#102536", padding: "14px 16px", marginTop: "10px", flexWrap: "wrap" },
    instructionText: { color: "#c8dde8", lineHeight: 1.6, margin: 0, flex: "1 1 320px", whiteSpace: "pre-wrap" },
    itemActions: { display: "flex", alignItems: "center", gap: "10px" },
    itemButton: { border: 0, background: "transparent", color: "#7df0c3", padding: "4px", fontSize: "13px", fontWeight: 700, cursor: "pointer" },
    itemDeleteButton: { border: 0, background: "transparent", color: "#fca5a5", padding: "4px", fontSize: "13px", fontWeight: 700, cursor: "pointer" },
};