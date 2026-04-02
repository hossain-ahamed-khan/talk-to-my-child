"use client";
import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type Tier = "All" | "Free" | "Bronze" | "Silver" | "Gold";

interface User {
    id: number;
    email: string;
    userId: string;
    tier: Exclude<Tier, "All">;
    children: number;
    credits: number;
    lastActive: string;
}

// ── Mock Data ──────────────────────────────────────────────────────────────
const allUsers: User[] = [
    { id: 1, email: "sarah.j@example.com", userId: "92831-XP", tier: "Gold", children: 3, credits: 1240, lastActive: "2 mins ago" },
    { id: 2, email: "michael.chen@techmail.io", userId: "88122-LL", tier: "Silver", children: 2, credits: 450, lastActive: "4 hours ago" },
    { id: 3, email: "d.vader@empire.gov", userId: "00001-DS", tier: "Bronze", children: 1, credits: 12, lastActive: "Yesterday" },
    { id: 4, email: "jenny86@gmail.com", userId: "44219-JK", tier: "Free", children: 4, credits: 0, lastActive: "Oct 12, 2023" },
];

// ── Palette ────────────────────────────────────────────────────────────────
const c = {
    bg: "#0d1117",
    surface: "#131b27",
    card: "#161e2e",
    border: "#1e2d3d",
    text: "#e2e8f0",
    muted: "#6b7a90",
    teal: "#10b981",
    blue: "#3b82f6",
    rowHover: "#1a2538",
    gold: { bg: "#78350f", border: "#d97706", text: "#fbbf24" },
    silver: { bg: "#1e293b", border: "#64748b", text: "#94a3b8" },
    bronze: { bg: "#431407", border: "#c2410c", text: "#fb923c" },
    free: { bg: "#1e293b", border: "#334155", text: "#64748b" },
};

const tierStyle = (tier: Exclude<Tier, "All">) => {
    const map = { Gold: c.gold, Silver: c.silver, Bronze: c.bronze, Free: c.free };
    const t = map[tier];
    return { background: t.bg, border: `1px solid ${t.border}`, color: t.text };
};

const filterColors: Record<Tier, { bg: string; border: string; text: string }> = {
    All: { bg: "#1e2d3d", border: "#334155", text: c.text },
    Free: { bg: "#1e293b", border: "#334155", text: "#64748b" },
    Bronze: { bg: "#431407", border: "#c2410c", text: "#fb923c" },
    Silver: { bg: "#1e293b", border: "#64748b", text: "#94a3b8" },
    Gold: { bg: "#78350f", border: "#d97706", text: "#fbbf24" },
};

// ── Icons ──────────────────────────────────────────────────────────────────
const AddUserIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
);

const PlusIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const EmailIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 7l10 7 10-7" />
    </svg>
);

const PencilIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const DotsIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="5" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="19" r="1" fill="currentColor" />
    </svg>
);

const ChevronDown = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

// ── Checkbox ───────────────────────────────────────────────────────────────
function Checkbox({ checked, onChange, indeterminate }: { checked: boolean; onChange: () => void; indeterminate?: boolean }) {
    return (
        <div
            onClick={onChange}
            style={{
                width: 18, height: 18, borderRadius: 4,
                background: checked ? c.blue : "transparent",
                border: `2px solid ${checked ? c.blue : c.muted}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0, transition: "all 0.15s",
            }}
        >
            {checked && !indeterminate && (
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
            {indeterminate && (
                <svg width="10" height="2" viewBox="0 0 10 2"><line x1="0" y1="1" x2="10" y2="1" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
            )}
        </div>
    );
}

// ── Icon Button ────────────────────────────────────────────────────────────
function IconBtn({ children, title }: { children: React.ReactNode; title?: string }) {
    const [hov, setHov] = useState(false);
    return (
        <button
            title={title}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background: hov ? c.border : "transparent",
                border: "none", borderRadius: 6, padding: "6px",
                color: c.muted, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.15s",
            }}
        >
            {children}
        </button>
    );
}

// ── Row ────────────────────────────────────────────────────────────────────
function UserRow({ user, checked, onCheck }: { user: User; checked: boolean; onCheck: () => void }) {
    const [hov, setHov] = useState(false);
    return (
        <tr
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{ background: hov ? c.rowHover : "transparent", transition: "background 0.15s", borderTop: `1px solid ${c.border}` }}
        >
            <td style={{ padding: "14px 16px", width: 48 }}>
                <Checkbox checked={checked} onChange={onCheck} />
            </td>
            <td style={{ padding: "14px 16px" }}>
                <div style={{ color: c.text, fontSize: 14, fontWeight: 500 }}>{user.email}</div>
                <div style={{ color: c.muted, fontSize: 12, marginTop: 2 }}>ID: {user.userId}</div>
            </td>
            <td style={{ padding: "14px 16px" }}>
                <span style={{
                    ...tierStyle(user.tier),
                    borderRadius: 6, padding: "4px 14px",
                    fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" as const,
                }}>
                    {user.tier}
                </span>
            </td>
            <td style={{ padding: "14px 16px", color: c.text, fontSize: 14, textAlign: "center" as const }}>
                {user.children}
            </td>
            <td style={{ padding: "14px 16px", color: c.text, fontSize: 14, fontWeight: 700, textAlign: "center" as const }}>
                {user.credits.toLocaleString()}
            </td>
            <td style={{ padding: "14px 16px", color: c.muted, fontSize: 14 }}>
                {user.lastActive}
            </td>
            <td style={{ padding: "14px 16px" }}>
                <div style={{ display: "flex", gap: 2 }}>
                    <IconBtn title="Edit"><PencilIcon /></IconBtn>
                    <IconBtn title="More"><DotsIcon /></IconBtn>
                </div>
            </td>
        </tr>
    );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function UserAnalytics() {
    const [activeTier, setActiveTier] = useState<Tier>("All");
    const [selected, setSelected] = useState<Set<number>>(new Set([1, 2]));
    const [currentPage, setCurrentPage] = useState(1);
    const tiers: Tier[] = ["All", "Free", "Bronze", "Silver", "Gold"];

    const filtered = activeTier === "All" ? allUsers : allUsers.filter(u => u.tier === activeTier);
    const allChecked = filtered.length > 0 && filtered.every(u => selected.has(u.id));
    const someChecked = filtered.some(u => selected.has(u.id)) && !allChecked;
    const selectedCount = filtered.filter(u => selected.has(u.id)).length;

    const toggleAll = () => {
        const next = new Set(selected);
        if (allChecked) filtered.forEach(u => next.delete(u.id));
        else filtered.forEach(u => next.add(u.id));
        setSelected(next);
    };

    const toggleOne = (id: number) => {
        const next = new Set(selected);
        next.has(id) ? next.delete(id) : next.add(id);
        setSelected(next);
    };

    const pages = [1, 2, 3];

    return (
        <div style={{
            background: c.bg, minHeight: "100vh",
            fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            color: c.text, padding: "36px 40px",
        }}>
            {/* ── Header ── */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800 }}>User Analytics</h1>
                    <p style={{ margin: "6px 0 0", color: c.muted, fontSize: 14 }}>
                        Manage your administrative team and their platform access levels.
                    </p>
                </div>
                <button style={{
                    background: c.teal, color: "#fff", border: "none", borderRadius: 10,
                    padding: "12px 22px", fontWeight: 700, fontSize: 14, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 8,
                    boxShadow: "0 0 20px rgba(16,185,129,0.25)",
                }}>
                    <AddUserIcon /> Add Staff Member
                </button>
            </div>

            {/* ── Filter + Bulk Actions Bar ── */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                {/* Tier Filters */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ color: c.muted, fontSize: 14, fontWeight: 500, marginRight: 4 }}>Filter Tiers:</span>
                    {tiers.map(tier => {
                        const active = tier === activeTier;
                        const tc = filterColors[tier];
                        return (
                            <button
                                key={tier}
                                onClick={() => setActiveTier(tier)}
                                style={{
                                    background: active ? tc.bg : "transparent",
                                    border: `1.5px solid ${active ? tc.border : c.border}`,
                                    color: active ? tc.text : c.muted,
                                    borderRadius: 99, padding: "5px 16px",
                                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                                    transition: "all 0.15s",
                                }}
                            >
                                {tier}
                            </button>
                        );
                    })}
                </div>

                {/* Bulk Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {selectedCount > 0 && (
                        <span style={{ color: c.muted, fontSize: 13 }}>{selectedCount} users selected</span>
                    )}
                    <button style={{
                        background: c.surface, color: c.text,
                        border: `1px solid ${c.border}`, borderRadius: 8,
                        padding: "8px 16px", fontSize: 13, fontWeight: 600,
                        cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                    }}>
                        <PlusIcon /> Add Credits
                    </button>
                    <button style={{
                        background: c.surface, color: c.text,
                        border: `1px solid ${c.border}`, borderRadius: 8,
                        padding: "8px 16px", fontSize: 13, fontWeight: 600,
                        cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                    }}>
                        <EmailIcon /> Email
                    </button>
                </div>
            </div>

            {/* ── Table ── */}
            <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: c.surface }}>
                            <th style={{ padding: "14px 16px", width: 48 }}>
                                <Checkbox checked={allChecked} indeterminate={someChecked} onChange={toggleAll} />
                            </th>
                            {[
                                { label: "EMAIL", withSort: true },
                                { label: "TIER" },
                                { label: "CHILDREN" },
                                { label: "CREDITS" },
                                { label: "LAST ACTIVE" },
                                { label: "ACTIONS" },
                            ].map(({ label, withSort }) => (
                                <th key={label} style={{
                                    padding: "14px 16px", textAlign: "left" as const,
                                    color: c.muted, fontSize: 11, fontWeight: 700, letterSpacing: 1,
                                }}>
                                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                        {label}
                                        {withSort && <ChevronDown />}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(user => (
                            <UserRow
                                key={user.id}
                                user={user}
                                checked={selected.has(user.id)}
                                onCheck={() => toggleOne(user.id)}
                            />
                        ))}
                    </tbody>
                </table>

                {/* ── Pagination ── */}
                <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "14px 16px", borderTop: `1px solid ${c.border}`,
                    background: c.surface,
                }}>
                    <span style={{ color: c.muted, fontSize: 13 }}>
                        Showing 1 to {filtered.length} of 2,401 users
                    </span>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            style={{
                                background: c.card, color: c.text,
                                border: `1px solid ${c.border}`, borderRadius: 7,
                                padding: "7px 14px", fontSize: 13, fontWeight: 500, cursor: "pointer",
                            }}
                        >
                            Previous
                        </button>
                        {pages.map(p => (
                            <button
                                key={p}
                                onClick={() => setCurrentPage(p)}
                                style={{
                                    background: p === currentPage ? c.blue : c.card,
                                    color: p === currentPage ? "#fff" : c.text,
                                    border: `1px solid ${p === currentPage ? c.blue : c.border}`,
                                    borderRadius: 7, width: 36, height: 36,
                                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                                    transition: "all 0.15s",
                                }}
                            >
                                {p}
                            </button>
                        ))}
                        <span style={{ color: c.muted, fontSize: 14, padding: "0 4px" }}>...</span>
                        <button
                            onClick={() => setCurrentPage(p => p + 1)}
                            style={{
                                background: c.card, color: c.text,
                                border: `1px solid ${c.border}`, borderRadius: 7,
                                padding: "7px 14px", fontSize: 13, fontWeight: 500, cursor: "pointer",
                            }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}