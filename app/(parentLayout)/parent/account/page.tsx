"use client";
import Image from "next/image";
import { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useGetProfileInfoQuery } from "@/redux/features/profile/profileInfo/profileInfoApi";
import { type ChildProfile, useGetChildListApiQuery } from "@/redux/features/profile/childList/childListApi";
import { selectAuth } from "@/redux/features/auth/authSlice";
import CreateChildModal from "@/components/parent/create-child-modal";

// ── Icons ──────────────────────────────────────────────────────────────────
const ShareIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
);

const GiftIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 12 20 22 4 22 4 12" />
        <rect x="2" y="7" width="20" height="5" />
        <line x1="12" y1="22" x2="12" y2="7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
);

const ChatIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8aaab8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

const StarIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8aaab8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const ChevronRight = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3a5a70" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

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

const MicIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v6a2 2 0 0 0 4 0V5a2 2 0 0 0-2-2zm7 8a1 1 0 0 1 1 1 8 8 0 0 1-7 7.93V22h2a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h2v-2.07A8 8 0 0 1 4 12a1 1 0 1 1 2 0 6 6 0 0 0 12 0 1 1 0 0 1 1-1z" />
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

// ── Main Component ─────────────────────────────────────────────────────────
export default function AccountSettings() {
    const auth = useAppSelector(selectAuth);
    const { data: profile, isLoading, isError } = useGetProfileInfoQuery(undefined, {
        skip: !auth.token,
    });
    const { data: childProfiles = [], isLoading: isChildrenLoading, isError: isChildrenError } = useGetChildListApiQuery(undefined, {
        skip: !auth.token,
    });
    const [isCreateChildOpen, setIsCreateChildOpen] = useState(false);
    const [localChildProfiles, setLocalChildProfiles] = useState<ChildProfile[]>([]);
    const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

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

    const plans = [
        { name: "Bronze", desc: "Standard features", price: "£1.99/mo", accent: "#cd7f32", badge: null },
        { name: "Silver", desc: "Add and manage 3 child accounts", price: "£15/mo", accent: "#9badb7", badge: "BEST VALUE" },
        { name: "Gold", desc: "Add and manage 10 child accounts", price: "£50/mo", accent: "#d4af37", badge: null },
    ];

    const remainingCredits = effectiveProfile?.credit_balance ?? 0;
    const referralCode = effectiveProfile?.referral_code ?? "---";
    const isEmailVerified = effectiveProfile?.is_email_verified ?? false;
    const lastLogin = effectiveProfile?.last_login
        ? new Date(effectiveProfile.last_login).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
        : null;

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

                {/* ── Row 1: Credit Status + Referral Goal ── */}
                <div className="responsive-two-col" style={{ marginBottom: 16 }}>

                    {/* Credit Status */}
                    <div style={card}>
                        <p style={{ ...label, marginBottom: 20 }}>CREDIT STATUS</p>
                        <div style={{ textAlign: "center", padding: "16px 0 20px" }}>
                            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#e8f4f8" }}>
                                {isLoading && auth.token ? "Loading credits..." : `${remainingCredits} Remaining Credits`}
                            </h2>
                            <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                                <span style={{ color: "#10b981", fontSize: 13, fontWeight: 500 }}>Share your referral code to earn more credits</span>
                                <ShareIcon />
                            </div>
                        </div>
                    </div>

                    {/* Referral Goal */}
                    <div style={card}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                            <p style={{ ...label, marginBottom: 0 }}>REFERRAL CODE</p>
                            <GiftIcon />
                        </div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 26, fontWeight: 700 }}>{referralCode}</span>
                            <span style={{ fontSize: 12, color: "#10b981", fontWeight: 600 }}>Active referral code</span>
                        </div>
                        <p style={{ margin: 0, fontSize: 13, color: "#8aaab8", lineHeight: 1.5 }}>
                            Share this code so friends can join and you can grow your credit balance.
                        </p>
                    </div>
                </div>

                {/* ── Subscription Plans ── */}
                <div style={{ marginBottom: 16 }}>
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
                <div className="section-header" style={{ marginBottom: 16 }}>
                    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#e8f4f8" }}>Account Settings</h2>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
                        {effectiveProfile?.role && (
                            <span style={{
                                background: "rgba(14,165,233,0.12)",
                                color: "#7dd3fc",
                                border: "1px solid rgba(14,165,233,0.25)",
                                borderRadius: 999,
                                padding: "6px 10px",
                                fontSize: 12,
                                fontWeight: 700,
                                textTransform: "capitalize",
                            }}>
                                {effectiveProfile.role}
                            </span>
                        )}
                        {isEmailVerified && (
                            <span style={{
                                background: "rgba(16,185,129,0.12)",
                                color: "#10b981",
                                border: "1px solid rgba(16,185,129,0.25)",
                                borderRadius: 999,
                                padding: "6px 10px",
                                fontSize: 12,
                                fontWeight: 700,
                            }}>
                                Email verified
                            </span>
                        )}
                        {lastLogin && (
                            <span style={{ fontSize: 12, color: "#8aaab8" }}>
                                Last login {lastLogin}
                            </span>
                        )}
                        <button style={{
                            width: 48, height: 48, borderRadius: "50%",
                            background: "linear-gradient(135deg, #10b981, #0ea5e9)",
                            border: "none",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: "0 4px 16px rgba(16,185,129,0.35)",
                        }}>
                            <MicIcon />
                        </button>
                    </div>
                </div>

                {/* ── Bottom Row: Personal Info + Child Profiles ── */}
                <div className="responsive-two-col">

                    {/* Personal Information */}
                    <div style={card}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                            <PersonIcon />
                            <span style={{ fontWeight: 700, fontSize: 14 }}>Personal Information</span>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <label style={label}>FULL NAME</label>
                            <input key={effectiveProfile?.id ?? "full-name"} style={inputStyle} defaultValue={effectiveProfile?.full_name ?? ""} readOnly />
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <label style={label}>EMAIL ADDRESS</label>
                            <input key={effectiveProfile?.id ?? "email"} style={inputStyle} defaultValue={effectiveProfile?.email ?? ""} readOnly />
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <label style={label}>PROFILE PICTURE</label>
                            <div style={{ display: "flex", justifyContent: "center", paddingTop: 10 }}>
                                <div style={{ position: "relative" }}>
                                    {effectiveProfile?.profile_photo ? (
                                        <Image
                                            src={effectiveProfile.profile_photo}
                                            alt={effectiveProfile.full_name}
                                            width={80}
                                            height={80}
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
                                    <div style={{
                                        position: "absolute", bottom: 0, right: 0,
                                        width: 22, height: 22, borderRadius: "50%",
                                        background: "#10b981",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        border: "2px solid #091520",
                                    }}>
                                        <PlusIcon />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button style={{
                            background: "#10b981",
                            color: "#091520",
                            border: "none",
                            borderRadius: 24,
                            padding: "12px 24px",
                            fontWeight: 700,
                            fontSize: 14,
                            fontFamily: "'DM Sans', sans-serif",
                        }}>
                            Save Changes
                        </button>
                    </div>

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

                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {isChildrenLoading && auth.token ? (
                                <div style={{ fontSize: 13, color: "#8aaab8" }}>Loading child profiles...</div>
                            ) : mergedChildProfiles.length > 0 ? mergedChildProfiles.map((child, index) => {
                                const isSelected = child.id === selectedChildId;
                                return (
                                    <button
                                        key={child.id}
                                        type="button"
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
                                            <span style={{ background: "none", border: "none", padding: 4, display: "flex" }}>
                                                <EditIcon />
                                            </span>
                                        </div>
                                    </button>
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

            </div>
        </div>
    );
}