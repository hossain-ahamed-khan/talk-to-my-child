"use client";
import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type Role = "Super Admin" | "Admin";
type Status = "Active" | "Inactive";
type Tab = "All Staff" | "Admins" | "Super Admins";

interface StaffMember {
    id: number;
    initials: string;
    name: string;
    email: string;
    role: Role;
    status: Status;
    lastLogin: string;
}

// ── Mock Data ──────────────────────────────────────────────────────────────
const allStaff: StaffMember[] = [
    { id: 1, initials: "AR", name: "Alex Rivera", email: "alex.r@talktomychild.com", role: "Super Admin", status: "Active", lastLogin: "2 mins ago" },
    { id: 2, initials: "SC", name: "Sarah Chen", email: "s.chen@talktomychild.com", role: "Admin", status: "Active", lastLogin: "1 hour ago" },
    { id: 3, initials: "JS", name: "Jordan Smith", email: "jordan.s@talktomychild.com", role: "Admin", status: "Inactive", lastLogin: "3 days ago" },
    { id: 4, initials: "MK", name: "Maya Kumar", email: "maya.k@talktomychild.com", role: "Admin", status: "Active", lastLogin: "5 hours ago" },
];

// ── Palette ────────────────────────────────────────────────────────────────
const c = {
    bg: "#0f172a",
    surface: "#131b27",
    card: "#161e2e",
    border: "#1e2d3d",
    text: "#e2e8f0",
    muted: "#6b7a90",
    green: "#22c55e",
    greenDim: "rgba(34,197,94,0.15)",
    teal: "#10b981",
    tealDim: "rgba(16,185,129,0.18)",
    superAdmin: "#2d3748",
    admin: "#1e2d3d",
    inactive: "#4b5568",
    rowHover: "#1a2538",
};

// ── Icons ──────────────────────────────────────────────────────────────────
const PencilIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const BanIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
);

const ReactivateIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
    </svg>
);

const AddUserIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
);

// ── Sub-components ─────────────────────────────────────────────────────────
function Avatar({ initials }: { initials: string }) {
    return (
        <div style={{
            width: 42, height: 42, borderRadius: 10,
            background: c.superAdmin,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: c.muted, fontWeight: 700, fontSize: 13, flexShrink: 0,
            letterSpacing: 0.5,
        }}>
            {initials}
        </div>
    );
}

function RoleBadge({ role }: { role: Role }) {
    const isSuperAdmin = role === "Super Admin";
    return (
        <span style={{
            background: isSuperAdmin ? c.tealDim : c.admin,
            color: isSuperAdmin ? c.teal : c.muted,
            border: isSuperAdmin ? `1px solid ${c.teal}` : `1px solid ${c.border}`,
            borderRadius: 6,
            padding: "4px 12px",
            fontSize: 13,
            fontWeight: 600,
            whiteSpace: "nowrap" as const,
        }}>
            {role}
        </span>
    );
}

function StatusBadge({ status }: { status: Status }) {
    const active = status === "Active";
    return (
        <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 500, color: active ? c.green : c.muted }}>
            <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: active ? c.green : c.inactive,
                flexShrink: 0,
                boxShadow: active ? `0 0 6px ${c.green}` : "none",
            }} />
            {status}
        </span>
    );
}

function IconBtn({ children, color = c.muted, title }: { children: React.ReactNode; color?: string; title?: string }) {
    const [hovered, setHovered] = useState(false);
    return (
        <button
            title={title}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: hovered ? c.border : "transparent",
                border: "none", borderRadius: 6, padding: "6px",
                color, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.15s",
            }}
        >
            {children}
        </button>
    );
}

function StaffRow({ member }: { member: StaffMember }) {
    const [hovered, setHovered] = useState(false);
    return (
        <tr
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: hovered ? c.rowHover : "transparent",
                transition: "background 0.15s",
                borderTop: `1px solid ${c.border}`,
            }}
        >
            {/* Name & Profile */}
            <td style={{ padding: "16px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <Avatar initials={member.initials} />
                    <div>
                        <div style={{ color: c.text, fontWeight: 600, fontSize: 14 }}>{member.name}</div>
                        <div style={{ color: c.muted, fontSize: 12, marginTop: 2 }}>{member.email}</div>
                    </div>
                </div>
            </td>
            {/* Role */}
            <td style={{ padding: "16px 20px" }}>
                <RoleBadge role={member.role} />
            </td>
            {/* Status */}
            <td style={{ padding: "16px 20px" }}>
                <StatusBadge status={member.status} />
            </td>
            {/* Last Login */}
            <td style={{ padding: "16px 20px", color: c.muted, fontSize: 14 }}>
                {member.lastLogin}
            </td>
            {/* Actions */}
            <td style={{ padding: "16px 20px" }}>
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    <IconBtn color={c.muted} title="Edit">
                        <PencilIcon />
                    </IconBtn>
                    {member.status === "Active" ? (
                        <IconBtn color={c.muted} title="Deactivate">
                            <BanIcon />
                        </IconBtn>
                    ) : (
                        <IconBtn color={c.teal} title="Reactivate">
                            <ReactivateIcon />
                        </IconBtn>
                    )}
                </div>
            </td>
        </tr>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function StaffManagement() {
    const [activeTab, setActiveTab] = useState<Tab>("All Staff");
    const tabs: Tab[] = ["All Staff", "Admins", "Super Admins"];

    const filtered = allStaff.filter((m) => {
        if (activeTab === "Admins") return m.role === "Admin";
        if (activeTab === "Super Admins") return m.role === "Super Admin";
        return true;
    });

    return (
        <div style={{
            background: c.bg,
            minHeight: "100vh",
            fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            color: c.text,
            padding: "36px 40px",
        }}>
            {/* ── Header ── */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800 }}>Staff Management</h1>
                    <p style={{ margin: "6px 0 0", color: c.muted, fontSize: 14 }}>
                        Manage your administrative team and their platform access levels.
                    </p>
                </div>
                <button style={{
                    background: c.teal,
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "12px 22px",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: `0 0 20px rgba(16,185,129,0.25)`,
                    transition: "opacity 0.15s",
                }}>
                    <AddUserIcon />
                    Add Staff Member
                </button>
            </div>

            {/* ── Tabs ── */}
            <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${c.border}`, marginBottom: 24 }}>
                {tabs.map((tab) => {
                    const active = tab === activeTab;
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                background: "transparent",
                                border: "none",
                                borderBottom: active ? `2px solid ${c.teal}` : "2px solid transparent",
                                color: active ? c.teal : c.muted,
                                fontWeight: active ? 700 : 500,
                                fontSize: 14,
                                padding: "10px 20px 12px",
                                cursor: "pointer",
                                marginBottom: -1,
                                transition: "color 0.15s",
                                letterSpacing: 0.2,
                            }}
                        >
                            {tab}
                        </button>
                    );
                })}
            </div>

            {/* ── Table ── */}
            <div style={{
                background: c.card,
                border: `1px solid ${c.border}`,
                borderRadius: 14,
                overflow: "hidden",
            }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: c.surface }}>
                            {["NAME & PROFILE", "ROLE", "STATUS", "LAST LOGIN", "ACTIONS"].map((col) => (
                                <th key={col} style={{
                                    padding: "14px 20px",
                                    textAlign: "left",
                                    color: c.muted,
                                    fontSize: 11,
                                    fontWeight: 700,
                                    letterSpacing: 1,
                                }}>
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((member) => (
                            <StaffRow key={member.id} member={member} />
                        ))}
                    </tbody>
                </table>

                {/* ── Footer / Pagination ── */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 20px",
                    borderTop: `1px solid ${c.border}`,
                }}>
                    <span style={{ color: c.muted, fontSize: 13 }}>
                        Showing {filtered.length} of 12 staff members
                    </span>
                    <div style={{ display: "flex", gap: 10 }}>
                        {["Previous", "Next"].map((label) => (
                            <button
                                key={label}
                                style={{
                                    background: c.superAdmin,
                                    color: c.text,
                                    border: `1px solid ${c.border}`,
                                    borderRadius: 8,
                                    padding: "8px 18px",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    transition: "background 0.15s",
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}