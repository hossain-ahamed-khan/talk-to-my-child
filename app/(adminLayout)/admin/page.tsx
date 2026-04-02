"use client";
import { useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
    ResponsiveContainer,
} from "recharts";

// ── Types ──────────────────────────────────────────────────────────────────
interface StatCardProps {
    icon: React.ReactNode;
    growth: string;
    growthPositive?: boolean;
    label: string;
    value: React.ReactNode;
    sub?: React.ReactNode;
    link?: string;
}

// ── Palette / tokens ───────────────────────────────────────────────────────
const colors = {
    bg: "#0d1117",
    card: "#161b27",
    cardBorder: "#1e2736",
    text: "#e2e8f0",
    muted: "#8892a4",
    accent: "#3b82f6",
    green: "#22c55e",
    gold: "#f59e0b",
    silver: "#94a3b8",
    bronze: "#f97316",
    purple: "#818cf8",
    red: "#ef4444",
};

// ── Mock data ──────────────────────────────────────────────────────────────
const callVolumeData = [
    { day: "Mon", calls: 1200 },
    { day: "Tue", calls: 1950 },
    { day: "Wed", calls: 1700 },
    { day: "Thu", calls: 2400 },
    { day: "Fri", calls: 2100 },
    { day: "Sat", calls: 3200 },
    { day: "Sun", calls: 2900 },
];

const charactersData = [
    { name: "Santa", count: 4300 },
    { name: "Teacher", count: 3100 },
    { name: "Doctor", count: 2100 },
    { name: "Custom\nCharacter", count: 1700 },
];

const characterColors = ["#3b82f6", "#22c55e", "#818cf8", "#f59e0b"];

// ── Icons (inline SVG) ─────────────────────────────────────────────────────
const UsersIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={colors.muted} strokeWidth="1.8">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);
const DollarIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={colors.muted} strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v12M9 9.5C9 8.1 10.3 7 12 7s3 1.1 3 2.5-1.3 2.5-3 2.5-3 1.1-3 2.5S10.3 17 12 17s3-1.1 3-2.5" />
    </svg>
);
const ReferralIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={colors.muted} strokeWidth="1.8">
        <path d="M16 3h5v5M4 20L20.2 3.8" />
        <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
    </svg>
);
const ChildIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={colors.muted} strokeWidth="1.8">
        <circle cx="12" cy="8" r="4" />
        <path d="M8 16c0-2.2 1.8-4 4-4s4 1.8 4 4" />
        <circle cx="18" cy="6" r="2" />
        <path d="M16 10c0-1.1.9-2 2-2" />
    </svg>
);
const UpArrow = ({ color = colors.green }: { color?: string }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
        <polyline points="18 15 12 9 6 15" />
    </svg>
);
const DownloadIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
);
const ChevronDown = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

// ── Sub-components ─────────────────────────────────────────────────────────
function StatCard({ icon, growth, growthPositive = true, label, value, sub, link }: StatCardProps) {
    return (
        <div style={{
            background: colors.card,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: 14,
            padding: "22px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            flex: 1,
            minWidth: 200,
        }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {icon}
                <span style={{ color: growthPositive ? colors.green : colors.red, fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 3 }}>
                    <UpArrow color={growthPositive ? colors.green : colors.red} />
                    {growth}
                </span>
            </div>
            <div style={{ color: colors.muted, fontSize: 13 }}>{label}</div>
            <div style={{ color: colors.text, fontSize: 26, fontWeight: 700, lineHeight: 1.2 }}>{value}</div>
            {sub && <div style={{ color: colors.muted, fontSize: 12 }}>{sub}</div>}
            {link && (
                <>
                    <hr style={{ border: "none", borderTop: `1px solid ${colors.cardBorder}`, margin: "4px 0" }} />
                    <a href="#" style={{ color: colors.muted, fontSize: 13, textDecoration: "none" }}>{link}</a>
                </>
            )}
        </div>
    );
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
    return (
        <div style={{ background: "#1e2736", borderRadius: 99, height: 8, width: "100%", overflow: "hidden" }}>
            <div style={{ background: color, height: "100%", width: `${(value / max) * 100}%`, borderRadius: 99, transition: "width 0.6s ease" }} />
        </div>
    );
}

function Avatar({ initials, color, size = 32 }: { initials: string; color: string; size?: number }) {
    return (
        <div style={{
            width: size, height: size, borderRadius: "50%", background: color,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: size * 0.38, fontWeight: 700, flexShrink: 0
        }}>
            {initials}
        </div>
    );
}

function CharacterCircle({ label }: { label: string }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "#1e2736", border: `2px solid ${colors.cardBorder}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden",
            }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={colors.muted} strokeWidth="1.5">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
            </div>
            <span style={{ color: colors.muted, fontSize: 12 }}>{label}</span>
        </div>
    );
}

function PlusCircle() {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "#1e2736", border: `2px dashed ${colors.cardBorder}`,
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.muted} strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </div>
            <span style={{ color: colors.muted, fontSize: 12 }}>Create New</span>
        </div>
    );
}

// Custom bar shape with rounded tops
type RoundedBarShapeProps = {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    fill?: string;
    index?: number;
};

const RoundedBar = ({ x = 0, y = 0, width = 0, height = 0, fill = colors.accent }: RoundedBarShapeProps) => {
    const r = 5;
    return (
        <path
            d={`M${x},${y + height} L${x},${y + r} Q${x},${y} ${x + r},${y} L${x + width - r},${y} Q${x + width},${y} ${x + width},${y + r} L${x + width},${y + height} Z`}
            fill={fill}
        />
    );
};

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function AnalyticsDashboard() {
    const [timeRange] = useState("Last 30 Days");
    const [callRange] = useState("Last 7 Days");

    const cardStyle: React.CSSProperties = {
        background: colors.card,
        border: `1px solid ${colors.cardBorder}`,
        borderRadius: 14,
        padding: "24px",
    };

    return (
        <div style={{
            background: colors.bg,
            minHeight: "100vh",
            fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            color: colors.text,
            padding: "32px 36px",
        }}>
            {/* ── Header ── */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: colors.text }}>Analytics Overview</h1>
                    <p style={{ margin: "6px 0 0", color: colors.muted, fontSize: 14 }}>Monitor your platform&apos;s health and growth metrics.</p>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                    <button style={{
                        background: "#fff", color: "#0d1117", border: "none", borderRadius: 8,
                        padding: "10px 16px", display: "flex", alignItems: "center", gap: 8,
                        fontWeight: 600, fontSize: 14, cursor: "pointer",
                    }}>
                        {timeRange} <ChevronDown />
                    </button>
                    <button style={{
                        background: "transparent", color: colors.text,
                        border: `1px solid ${colors.cardBorder}`, borderRadius: 8,
                        padding: "10px 16px", display: "flex", alignItems: "center", gap: 8,
                        fontWeight: 600, fontSize: 14, cursor: "pointer",
                    }}>
                        <DownloadIcon /> Export Report
                    </button>
                </div>
            </div>

            {/* ── Stat Cards Row ── */}
            <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
                <StatCard
                    icon={<UsersIcon />}
                    growth="8.4%"
                    label="Total Subscribers"
                    value="12,450"
                    sub={
                        <span>
                            <span style={{ color: colors.accent }}>●</span> App Store: 230&nbsp;&nbsp;
                            <span style={{ color: colors.green }}>●</span> Play Store: 220
                        </span>
                    }
                    link="View All Subscribers"
                />
                <StatCard
                    icon={<DollarIcon />}
                    growth="15.2%"
                    label="Total Revenue (YTD)"
                    value="$142,500"
                    sub={
                        <span style={{ fontSize: 12 }}>
                            W: $4.2K&nbsp;&nbsp;M: $18.5K<br />Q: $52.1K&nbsp;&nbsp;Y: $142.5K
                        </span>
                    }
                    link="View Detailed Revenue"
                />
                <StatCard
                    icon={<ReferralIcon />}
                    growth="12%"
                    label="Total Referrals"
                    value="4,684"
                    link="View Referrals"
                />
                <StatCard
                    icon={<ChildIcon />}
                    growth="12%"
                    label="Parent/Child Accounts"
                    value={<>1,847 Parents /<br />3,120 Children</>}
                    link="User Management"
                />
            </div>

            {/* ── Charts Row ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: 16, marginBottom: 20 }}>
                {/* Weekly Call Volume */}
                <div style={cardStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Weekly Call Volume</h2>
                        <button style={{
                            background: "transparent", border: `1px solid ${colors.cardBorder}`,
                            color: colors.text, borderRadius: 8, padding: "6px 12px",
                            fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                        }}>
                            {callRange} <ChevronDown />
                        </button>
                    </div>
                    <div style={{ color: colors.muted, fontSize: 12, textAlign: "center", marginBottom: 4 }}>Call Volume per Day</div>
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={callVolumeData} margin={{ top: 8, right: 10, left: -10, bottom: 0 }}>
                            <CartesianGrid stroke="#1e2736" strokeDasharray="0" vertical={false} />
                            <XAxis dataKey="day" tick={{ fill: colors.muted, fontSize: 12 }} axisLine={false} tickLine={false}
                                label={{ value: "Day of Week", position: "insideBottom", offset: -4, fill: colors.muted, fontSize: 12 }} />
                            <YAxis tick={{ fill: colors.muted, fontSize: 11 }} axisLine={false} tickLine={false}
                                label={{ value: "Number of Calls", angle: -90, position: "insideLeft", offset: 14, fill: colors.muted, fontSize: 11 }}
                                domain={[0, 3500]} ticks={[0, 500, 1000, 1500, 2000, 2500, 3000, 3500]} />
                            <Tooltip contentStyle={{ background: colors.card, border: `1px solid ${colors.cardBorder}`, borderRadius: 8, color: colors.text }} />
                            <Line type="monotone" dataKey="calls" stroke={colors.accent} strokeWidth={2.5} dot={{ fill: colors.accent, r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Most Popular Characters */}
                <div style={cardStyle}>
                    <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700 }}>Most Popular Characters</h2>
                    <div style={{ color: colors.muted, fontSize: 12, textAlign: "center", marginBottom: 4 }}>Interaction Count by Character</div>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={charactersData} margin={{ top: 8, right: 10, left: -10, bottom: 30 }}>
                            <CartesianGrid stroke="#1e2736" strokeDasharray="0" horizontal={true} vertical={false} />
                            <XAxis dataKey="name" tick={{ fill: colors.muted, fontSize: 11 }} axisLine={false} tickLine={false}
                                label={{ value: "Character Type", position: "insideBottom", offset: -18, fill: colors.muted, fontSize: 12 }} />
                            <YAxis tick={{ fill: colors.muted, fontSize: 11 }} axisLine={false} tickLine={false}
                                label={{ value: "Interactions", angle: -90, position: "insideLeft", offset: 14, fill: colors.muted, fontSize: 11 }}
                                domain={[0, 4500]} ticks={[0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500]} />
                            <Tooltip contentStyle={{ background: colors.card, border: `1px solid ${colors.cardBorder}`, borderRadius: 8, color: colors.text }} />
                            <Bar
                                dataKey="count"
                                shape={(props) => {
                                    const index = typeof props.index === "number" ? props.index : 0;
                                    return <RoundedBar {...(props as RoundedBarShapeProps)} fill={characterColors[index % characterColors.length]} />;
                                }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ── Bottom Row ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {/* Subscriber Tiers */}
                <div style={cardStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Subscriber Tiers</h2>
                        <a href="#" style={{ color: colors.muted, fontSize: 13, textDecoration: "none" }}>View Tiers</a>
                    </div>

                    {[
                        { label: "Gold Members", count: 1420, color: colors.gold, max: 3000 },
                        { label: "Silver Members", count: 2100, color: colors.silver, max: 3000 },
                        { label: "Bronze Members", count: 700, color: colors.bronze, max: 3000 },
                    ].map((tier) => (
                        <div key={tier.label} style={{ marginBottom: 18 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                <span style={{ color: tier.color, fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: tier.color, display: "inline-block" }} />
                                    {tier.label}
                                </span>
                                <span style={{ color: colors.text, fontWeight: 600, fontSize: 14 }}>{tier.count.toLocaleString()}</span>
                            </div>
                            <ProgressBar value={tier.count} max={tier.max} color={tier.color} />
                        </div>
                    ))}

                    <div style={{
                        background: "#1a2540",
                        border: `1px solid #2a3a5a`,
                        borderRadius: 10, padding: "14px 16px",
                        color: colors.accent, fontSize: 13, marginTop: 8,
                        display: "flex", alignItems: "flex-start", gap: 10,
                    }}>
                        <span style={{ marginTop: 1 }}>ℹ</span>
                        <span>Subscriber conversion rate has improved by 4.2% since the introduction of the Gold tier benefits.</span>
                    </div>

                    {/* Avatars overlay */}
                    <div style={{ display: "flex", marginTop: 16, alignItems: "center" }}>
                        <div style={{ display: "flex" }}>
                            {[{ i: "M", c: "#6366f1" }, { i: "J", c: "#22c55e" }].map((a, idx) => (
                                <div key={idx} style={{ marginLeft: idx === 0 ? 0 : -10, zIndex: 2 - idx }}>
                                    <Avatar initials={a.i} color={a.c} size={30} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Real-time Activity Summary + All Characters stacked */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Real-time Activity */}
                    <div style={cardStyle}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Real-time Activity Summary</h2>
                            <span style={{
                                background: "#0f2e1a", color: colors.green, border: `1px solid ${colors.green}`,
                                borderRadius: 99, padding: "4px 12px", fontSize: 12, fontWeight: 600,
                                display: "flex", alignItems: "center", gap: 6,
                            }}>
                                <span style={{ width: 7, height: 7, borderRadius: "50%", background: colors.green, display: "inline-block" }} />
                                Live Updates
                            </span>
                        </div>

                        <div style={{ textAlign: "center", marginBottom: 16 }}>
                            <div style={{ fontSize: 44, fontWeight: 800, color: colors.text }}>1,284</div>
                            <div style={{ color: colors.muted, fontSize: 12, letterSpacing: 1 }}>TOTAL ACTIVE USERS</div>
                        </div>

                        <hr style={{ border: "none", borderTop: `1px solid ${colors.cardBorder}`, marginBottom: 16 }} />

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                            {/* Platform Distribution */}
                            <div style={{ background: "#1a2030", borderRadius: 10, padding: "14px 16px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                                    <span style={{ color: colors.muted, fontSize: 11, fontWeight: 600, letterSpacing: 0.5 }}>PLATFORM<br />DISTRIBUTION</span>
                                    <span style={{ color: colors.muted, fontSize: 11 }}>By<br />Device</span>
                                </div>
                                <div style={{ display: "flex", gap: 20, marginBottom: 10 }}>
                                    <div>
                                        <div style={{ fontSize: 22, fontWeight: 700 }}>742</div>
                                        <div style={{ color: colors.muted, fontSize: 11 }}>iOS Users</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 22, fontWeight: 700 }}>542</div>
                                        <div style={{ color: colors.muted, fontSize: 11 }}>Android Users</div>
                                    </div>
                                </div>
                                <div style={{ background: "#1e2736", borderRadius: 99, height: 6, overflow: "hidden" }}>
                                    <div style={{ display: "flex", height: "100%" }}>
                                        <div style={{ background: colors.accent, width: `${(742 / 1284) * 100}%` }} />
                                        <div style={{ background: colors.green, flex: 1 }} />
                                    </div>
                                </div>
                            </div>

                            {/* User Type */}
                            <div style={{ background: "#1a2030", borderRadius: 10, padding: "14px 16px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                                    <span style={{ color: colors.muted, fontSize: 11, fontWeight: 600, letterSpacing: 0.5 }}>USER TYPE<br />BREAKDOWN</span>
                                    <span style={{ color: colors.muted, fontSize: 11 }}>By<br />Role</span>
                                </div>
                                <div style={{ display: "flex", gap: 20, marginBottom: 10 }}>
                                    <div>
                                        <div style={{ fontSize: 22, fontWeight: 700 }}>412</div>
                                        <div style={{ color: colors.muted, fontSize: 11 }}>Parents</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 22, fontWeight: 700 }}>872</div>
                                        <div style={{ color: colors.muted, fontSize: 11 }}>Children</div>
                                    </div>
                                </div>
                                <div style={{ background: "#1e2736", borderRadius: 99, height: 6, overflow: "hidden" }}>
                                    <div style={{ display: "flex", height: "100%" }}>
                                        <div style={{ background: colors.purple, width: `${(412 / 1284) * 100}%` }} />
                                        <div style={{ background: colors.bronze, flex: 1 }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button style={{
                            width: "100%", background: colors.red, color: "#fff", border: "none",
                            borderRadius: 8, padding: "13px", fontWeight: 700, fontSize: 14, cursor: "pointer",
                        }}>
                            Detailed Activity Logs
                        </button>
                    </div>

                    {/* All Characters */}
                    <div style={cardStyle}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>All Characters</h2>
                            <a href="#" style={{ color: colors.muted, fontSize: 13, textDecoration: "none" }}>View All</a>
                        </div>
                        <div style={{ display: "flex", gap: 20 }}>
                            {["Dr. Sarah", "Dr. Sarah", "Dr. Sarah"].map((name, i) => (
                                <CharacterCircle key={i} label={name} />
                            ))}
                            <PlusCircle />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}