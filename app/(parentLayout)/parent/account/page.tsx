"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import Swal from "sweetalert2";
import { useAppSelector } from "@/redux/hooks";
import { useGetProfileInfoQuery, useUpdateProfileMutation } from "@/redux/features/profile/profileInfo/profileInfoApi";
import {
    type ChildProfile,
    useDeleteChildMutation,
    useGetChildListApiQuery,
} from "@/redux/features/profile/childList/childListApi";
import { selectAuth } from "@/redux/features/auth/authSlice";
import CreateChildModal from "@/components/parent/create-child-modal";
import EditChildModal from "@/components/parent/edit-child-modal";

// ── Icons ──────────────────────────────────────────────────────────────────
const PersonIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const ChildIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
    </svg>
);

const CameraIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4a7a90" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
    </svg>
);

const PlusIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const EditIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4a7a90" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const DeleteIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 15H6L5 6" />
        <path d="M10 11v6M14 11v6" />
    </svg>
);

const ChildAvatar = ({ color }: { color: string }) => (
    <div style={{
        width: 36, height: 36, borderRadius: "50%",
        background: color,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
    }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
        </svg>
    </div>
);

// ── Shared styles ──────────────────────────────────────────────────────────
const card: React.CSSProperties = {
    background: "#0d1e2d",
    border: "1px solid #1a3348",
    borderRadius: 14,
    padding: "20px 24px",
    width: "100%",
    boxSizing: "border-box",
};

const label: React.CSSProperties = {
    display: "block",
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.12em",
    color: "#4a7a90",
    marginBottom: 6,
    fontFamily: "'DM Sans', sans-serif",
};

const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#091520",
    border: "1px solid #1a3348",
    borderRadius: 8,
    color: "#c8dde8",
    padding: "11px 14px",
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    boxSizing: "border-box",
};

const getProfileImageUrl = (profilePhoto: string | null) => {
    if (!profilePhoto) return null;
    if (profilePhoto.startsWith("http://") || profilePhoto.startsWith("https://")) {
        return profilePhoto.replace(/^http:\/\//, "https://");
    }

    const imageBaseUrl = process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL ?? "";
    return `${imageBaseUrl.replace(/\/$/, "")}/${profilePhoto.replace(/^\//, "")}`;
};

// ── Main Component ─────────────────────────────────────────────────────────
export default function AccountSettings() {
    const auth = useAppSelector(selectAuth);
    const { data: profile, isError, refetch: refetchProfile } = useGetProfileInfoQuery(undefined, {
        skip: !auth.token,
    });
    const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
    const [deleteChild, { isLoading: isDeletingChild }] = useDeleteChildMutation();
    const { data: childProfiles = [], isLoading: isChildrenLoading, isError: isChildrenError } = useGetChildListApiQuery(undefined, {
        skip: !auth.token,
    });
    const [isCreateChildOpen, setIsCreateChildOpen] = useState(false);
    const [childBeingEdited, setChildBeingEdited] = useState<ChildProfile | null>(null);
    const [childActionError, setChildActionError] = useState<string | null>(null);
    const [localChildProfiles, setLocalChildProfiles] = useState<ChildProfile[]>([]);
    const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
    const [fullName, setFullName] = useState("");
    const [isNameEdited, setIsNameEdited] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [profileUpdateMessage, setProfileUpdateMessage] = useState<string | null>(null);
    const [profileUpdateError, setProfileUpdateError] = useState<string | null>(null);
    const photoInputRef = useRef<HTMLInputElement>(null);

    const effectiveProfile = profile ?? (auth.user ? {
        id: auth.user.id,
        full_name: auth.user.full_name,
        email: auth.user.email,
        profile_photo: null,
        role: auth.role ?? "",
        is_email_verified: false,
        credit_balance: auth.user.credit_balance,
        referral_code: auth.user.referral_code,
        date_joined: "",
        last_login: "",
    } : null);

    const mergedChildProfiles = [...localChildProfiles, ...childProfiles];
    const selectedChild = mergedChildProfiles.find((child) => child.id === selectedChildId) ?? mergedChildProfiles[0] ?? null;
    const childColors = ["#1a6b5a", "#1a4a6b", "#5a3d8c", "#6b5a1a"];
    const getChildColor = (index: number) => childColors[index % childColors.length];
    const formatChildAge = (age: number) => `${age} ${age === 1 ? "Year" : "Years"} Old`;

    const handleCreateChild = (child: ChildProfile) => {
        setLocalChildProfiles((current) => [child, ...current]);
        setSelectedChildId(child.id);
    };

    const handleDeleteChild = async (child: ChildProfile) => {
        if (isDeletingChild) return;

        const confirmation = await Swal.fire({
            title: "Delete child profile?",
            text: `${child.name}'s profile will be permanently deleted.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
        });

        if (!confirmation.isConfirmed) return;

        try {
            setChildActionError(null);
            await deleteChild(child.id).unwrap();
            setLocalChildProfiles((current) => current.filter((item) => item.id !== child.id));
            setSelectedChildId((current) => current === child.id ? null : current);
            await Swal.fire({
                title: "Deleted",
                text: `${child.name}'s profile was deleted successfully.`,
                icon: "success",
                confirmButtonColor: "#11b780",
                timer: 1600,
                timerProgressBar: true,
            });
        } catch {
            setChildActionError("Unable to delete this child right now.");
            await Swal.fire({
                title: "Delete failed",
                text: "Unable to delete this child. Please try again.",
                icon: "error",
                confirmButtonColor: "#dc2626",
            });
        }
    };

    const handleChildUpdated = (child: ChildProfile) => {
        setLocalChildProfiles((current) => current.map((item) => item.id === child.id ? child : item));
        setSelectedChildId(child.id);
    };

    const handleProfileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setProfileUpdateMessage(null);
        setProfileUpdateError(null);

        const formData = new FormData();
        formData.append("full_name", (isNameEdited ? fullName : effectiveProfile?.full_name ?? "").trim());
        if (selectedPhoto) formData.append("profile_photo", selectedPhoto);

        try {
            const response = await updateProfile(formData).unwrap();
            await refetchProfile();
            setProfileUpdateMessage(response.message);
            setFullName(response.data.full_name);
            setIsNameEdited(false);
            setPhotoPreview(getProfileImageUrl(response.data.profile_photo));
            setSelectedPhoto(null);
        } catch {
            setProfileUpdateError("Unable to update your profile right now.");
        }
    };

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setSelectedPhoto(file);
        setPhotoPreview(file ? URL.createObjectURL(file) : getProfileImageUrl(effectiveProfile?.profile_photo ?? null));
    };

    const displayedFullName = isNameEdited ? fullName : effectiveProfile?.full_name ?? fullName;
    const profileImageUrl = photoPreview ?? getProfileImageUrl(effectiveProfile?.profile_photo ?? null);

    const plans = [
        { name: "Bronze", desc: "Standard features", price: "£1.99/mo", accent: "#cd7f32", badge: null },
        { name: "Silver", desc: "Add and manage 3 child accounts", price: "£15/mo", accent: "#9badb7", badge: "BEST VALUE" },
        { name: "Gold", desc: "Add and manage 10 child accounts", price: "£50/mo", accent: "#d4af37", badge: null },
    ];

    return (
        <div style={{
            background: "#091520",
            minHeight: "100vh",
            padding: "clamp(12px, 2.5vw, 24px)",
            fontFamily: "'DM Sans', sans-serif",
            color: "#e8f4f8",
        }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        input::placeholder { color: #2a4a5a; }
                input:focus { border-color: #10b981 !important; box-shadow: 0 0 0 3px rgba(16,185,129,0.08); }
        button { cursor: pointer; transition: opacity 0.15s; }
        button:hover { opacity: 0.85; }

        .account-container {
            width: 100%;
            display: flex;
            flex-direction: column;
        }

        .responsive-two-col {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
        }

        .plan-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
        }

        @media (max-width: 1024px) {
            .responsive-two-col {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 640px) {
            .plan-row {
                flex-direction: column;
                align-items: flex-start;
            }

            .section-header {
                align-items: flex-start;
            }
        }
      `}</style>

            <div className="account-container">
                {isError && auth.token && (
                    <div style={{
                        marginBottom: 16,
                        padding: "12px 16px",
                        borderRadius: 10,
                        background: "rgba(239,68,68,0.12)",
                        border: "1px solid rgba(239,68,68,0.25)",
                        color: "#fecaca",
                        fontSize: 13,
                    }}>
                        Unable to load profile data right now.
                    </div>
                )}

                {/* ── Subscription Plans ── */}
                <div style={{ marginBottom: 16, order: 4 }}>
                    <p style={{ ...label, marginBottom: 12 }}>SUBSCRIPTION PLANS</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {plans.map((plan) => (
                            <div key={plan.name} className="plan-row" style={{
                                ...card,
                                padding: "16px 24px",
                                borderLeft: `3px solid ${plan.accent}`,
                                borderRadius: 10,
                            }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 15, color: "#e8f4f8" }}>{plan.name}</div>
                                    <div style={{ fontSize: 12, color: "#4a7a90", marginTop: 2 }}>{plan.desc}</div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                                    {plan.badge && (
                                        <span style={{
                                            background: "#10b981",
                                            color: "#091520",
                                            fontSize: 9,
                                            fontWeight: 800,
                                            letterSpacing: "0.1em",
                                            padding: "3px 8px",
                                            borderRadius: 99,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 4,
                                        }}>
                                            ✦ {plan.badge}
                                        </span>
                                    )}
                                    <button style={{
                                        background: "#1a3348",
                                        border: "1px solid #2a4a60",
                                        borderRadius: 20,
                                        color: "#c8dde8",
                                        fontWeight: 700,
                                        fontSize: 13,
                                        padding: "6px 16px",
                                        fontFamily: "'DM Sans', sans-serif",
                                        ...(plan.name === "Bronze" ? { background: "#10b981", color: "#091520", border: "none" } : {}),
                                    }}>
                                        {plan.price}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Help & Support ── */}
                {/* <div style={{ marginBottom: 24 }}>
                    <p style={{ ...label, marginBottom: 12 }}>HELP &amp; SUPPORT</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {[
                            { icon: <ChatIcon />, text: "Support with live chat" },
                            { icon: <StarIcon />, text: "Review 5 stars to help us grow" },
                        ].map(({ icon, text }) => (
                            <div key={text} style={{
                                ...card,
                                padding: "14px 20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                borderRadius: 10,
                                cursor: "pointer",
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    {icon}
                                    <span style={{ fontSize: 14, color: "#c8dde8" }}>{text}</span>
                                </div>
                                <ChevronRight />
                            </div>
                        ))}
                    </div>
                </div> */}

                {/* ── Account Settings heading + mic ── */}
                <div className="section-header" style={{ marginBottom: 16, order: 1 }}>
                    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#e8f4f8" }}>Account Settings</h2>
                </div>

                {/* ── Bottom Row: Personal Info + Child Profiles ── */}
                <div className="responsive-two-col" style={{ order: 2, marginBottom: 16 }}>

                    {/* Personal Information */}
                    <form style={card} onSubmit={handleProfileSubmit}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                            <PersonIcon />
                            <span style={{ fontWeight: 700, fontSize: 14 }}>Personal Information</span>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <label style={label}>FULL NAME</label>
                            <input
                                key={effectiveProfile?.id ?? "full-name"}
                                style={inputStyle}
                                value={displayedFullName}
                                onChange={(event) => {
                                    setFullName(event.target.value);
                                    setIsNameEdited(true);
                                }}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <label style={label}>EMAIL ADDRESS</label>
                            <input key={effectiveProfile?.id ?? "email"} style={inputStyle} defaultValue={effectiveProfile?.email ?? ""} readOnly />
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <label style={label}>PROFILE PICTURE</label>
                            <div style={{ display: "flex", justifyContent: "center", paddingTop: 10 }}>
                                <div style={{ position: "relative" }}>
                                    {profileImageUrl ? (
                                        <Image
                                            src={profileImageUrl}
                                            alt={displayedFullName || "Profile picture"}
                                            width={80}
                                            height={80}
                                            unoptimized
                                            style={{
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                                border: "2px solid #1a3348",
                                            }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: 80, height: 80, borderRadius: "50%",
                                            border: "2px dashed #2a4a5a",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            background: "#091520",
                                        }}>
                                            <CameraIcon />
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        aria-label="Choose a profile picture"
                                        onClick={() => photoInputRef.current?.click()}
                                        style={{
                                            position: "absolute", bottom: 0, right: 0,
                                            width: 22, height: 22, borderRadius: "50%",
                                            background: "#10b981",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            border: "2px solid #091520",
                                            padding: 0,
                                        }}>
                                        <PlusIcon />
                                    </button>
                                </div>
                            </div>
                            <input
                                ref={photoInputRef}
                                id="profile-photo"
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                style={{ display: "none" }}
                            />
                        </div>

                        {profileUpdateMessage && (
                            <div style={{ color: "#10b981", fontSize: 13, marginBottom: 12 }} role="status">
                                {profileUpdateMessage}
                            </div>
                        )}
                        {profileUpdateError && (
                            <div style={{ color: "#fecaca", fontSize: 13, marginBottom: 12 }} role="alert">
                                {profileUpdateError}
                            </div>
                        )}

                        <button type="submit" disabled={isUpdatingProfile} style={{
                            background: "#10b981",
                            color: "#091520",
                            border: "none",
                            borderRadius: 24,
                            padding: "12px 24px",
                            fontWeight: 700,
                            fontSize: 14,
                            fontFamily: "'DM Sans', sans-serif",
                        }}>
                            {isUpdatingProfile ? "Saving..." : "Save Changes"}
                        </button>
                    </form>

                    {/* Child Profiles */}
                    <div style={card}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <ChildIcon />
                                <span style={{ fontWeight: 700, fontSize: 14 }}>Child Profiles</span>
                            </div>
                            <button style={{
                                background: "none", border: "none",
                                color: "#10b981", fontSize: 13, fontWeight: 600,
                                fontFamily: "'DM Sans', sans-serif", padding: 0,
                            }} type="button" onClick={() => setIsCreateChildOpen(true)}>
                                + Add New
                            </button>
                        </div>

                        {selectedChild && (
                            <div style={{
                                background: "#091520",
                                border: "1px solid #1a3348",
                                borderRadius: 12,
                                padding: 16,
                                marginBottom: 14,
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                                    <ChildAvatar color={getChildColor(mergedChildProfiles.findIndex((child) => child.id === selectedChild.id))} />
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ fontWeight: 700, fontSize: 15, color: "#e8f4f8" }}>{selectedChild.name}</div>
                                        <div style={{ fontSize: 12, color: "#4a7a90", marginTop: 2 }}>{selectedChild.email}</div>
                                    </div>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
                                    <div>
                                        <div style={{ ...label, marginBottom: 4 }}>AGE</div>
                                        <div style={{ fontSize: 13, color: "#c8dde8", fontWeight: 600 }}>{formatChildAge(selectedChild.age)}</div>
                                    </div>
                                    <div>
                                        <div style={{ ...label, marginBottom: 4 }}>STATUS</div>
                                        <div style={{ fontSize: 13, color: selectedChild.is_active ? "#10b981" : "#8aaab8", fontWeight: 600 }}>
                                            {selectedChild.is_active ? "Active" : "Inactive"}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginTop: 12 }}>
                                    <div style={{ ...label, marginBottom: 6 }}>FOCUS AREAS</div>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                        {selectedChild.focus_area.length > 0 ? selectedChild.focus_area.map((area) => (
                                            <span key={area} style={{
                                                background: "rgba(16,185,129,0.12)",
                                                color: "#10b981",
                                                border: "1px solid rgba(16,185,129,0.18)",
                                                borderRadius: 999,
                                                padding: "5px 10px",
                                                fontSize: 12,
                                                fontWeight: 600,
                                            }}>
                                                {area}
                                            </span>
                                        )) : (
                                            <span style={{ fontSize: 12, color: "#8aaab8" }}>No focus areas added yet.</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {isChildrenError && auth.token && (
                            <div style={{
                                marginBottom: 12,
                                padding: "10px 12px",
                                borderRadius: 10,
                                background: "rgba(239,68,68,0.12)",
                                border: "1px solid rgba(239,68,68,0.18)",
                                color: "#fecaca",
                                fontSize: 12,
                            }}>
                                Unable to load child profiles right now.
                            </div>
                        )}

                        {childActionError && (
                            <div role="alert" style={{ color: "#fecaca", fontSize: 12, marginBottom: 12 }}>
                                {childActionError}
                            </div>
                        )}

                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {isChildrenLoading && auth.token ? (
                                <div style={{ fontSize: 13, color: "#8aaab8" }}>Loading child profiles...</div>
                            ) : mergedChildProfiles.length > 0 ? mergedChildProfiles.map((child, index) => {
                                const isSelected = child.id === selectedChildId;
                                return (
                                    <div
                                        key={child.id}
                                        onClick={() => setSelectedChildId(child.id)}
                                        style={{
                                            background: "#091520",
                                            border: isSelected ? "1px solid #10b981" : "1px solid #1a3348",
                                            borderRadius: 10,
                                            padding: "12px 16px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "100%",
                                            textAlign: "left",
                                            cursor: "pointer",
                                        }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                                            <ChildAvatar color={getChildColor(index)} />
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: 14, color: "#e8f4f8" }}>{child.name}</div>
                                                <div style={{ fontSize: 12, color: "#4a7a90", marginTop: 2 }}>{formatChildAge(child.age)}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            {isSelected && (
                                                <span style={{ fontSize: 11, fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                                    Selected
                                                </span>
                                            )}
                                            <button
                                                type="button"
                                                aria-label={`Edit ${child.name}`}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setChildBeingEdited(child);
                                                }}
                                                style={{ background: "none", border: "none", padding: 4, display: "flex" }}
                                            >
                                                <EditIcon />
                                            </button>
                                            <button
                                                type="button"
                                                aria-label={`Delete ${child.name}`}
                                                disabled={isDeletingChild}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    void handleDeleteChild(child);
                                                }}
                                                style={{ background: "none", border: "none", padding: 4, display: "flex" }}
                                            >
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div style={{ fontSize: 13, color: "#8aaab8" }}>No child profiles found.</div>
                            )}
                        </div>
                    </div>
                </div>

                <CreateChildModal
                    open={isCreateChildOpen}
                    onClose={() => setIsCreateChildOpen(false)}
                    onCreate={handleCreateChild}
                />

                <EditChildModal
                    key={childBeingEdited?.id ?? "edit-child"}
                    child={childBeingEdited}
                    onClose={() => setChildBeingEdited(null)}
                    onUpdated={handleChildUpdated}
                />

            </div>
        </div>
    );
}