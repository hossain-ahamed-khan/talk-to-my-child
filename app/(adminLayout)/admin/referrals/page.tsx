"use client";
import { useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const chartData = [
    { date: "Oct 28", value: 410 },
    { date: "Nov 04", value: 570 },
    { date: "Nov 11", value: 510 },
    { date: "Nov 18", value: 770 },
    { date: "Nov 24", value: 845 },
];

const referrals = [
    {
        id: 1,
        initials: "JS",
        color: "#7c6af7",
        name: "James Smith",
        referred: "mike.doe@example.com",
        status: "COMPLETED",
        date: "2023-11-24 14:32",
    },
    {
        id: 2,
        initials: "AW",
        color: "#e05c97",
        name: "Alice Wong",
        referred: "sarah.j@provider.net",
        status: "PENDING",
        date: "2023-11-24 13:15",
    },
];

const rewardPlans = [
    "Free Bronze Plan",
    "Free Silver Plan",
    "Free Gold Plan",
    "Free Platinum Plan",
];

export default function ReferralDashboard() {
    const [creditReward, setCreditReward] = useState(2);
    const [targetCount, setTargetCount] = useState(50);
    const [rewardPlan, setRewardPlan] = useState("Free Bronze Plan");
    const [autoApproval, setAutoApproval] = useState(true);
    const [activeRange, setActiveRange] = useState("30D");
    const [search, setSearch] = useState("");

    const filtered = referrals.filter(
        (r) =>
            r.name.toLowerCase().includes(search.toLowerCase()) ||
            r.referred.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div
            style={{
                background: "#0f172a",
                minHeight: "100vh",
                fontFamily: "'DM Sans', sans-serif",
                color: "#e2e8f0",
                padding: "32px",
                boxSizing: "border-box",
            }}
        >
            {/* Top KPI Cards */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "20px",
                    marginBottom: "24px",
                }}
            >
                {/* Total Referrals */}
                <KpiCard
                    label="TOTAL REFERRALS"
                    value="2,847"
                    sub={
                        <span style={{ color: "#4ade80", fontSize: 13 }}>
                            ↑ 12.5% from last month
                        </span>
                    }
                    icon={
                        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                            <path
                                d="M7 17L17 7M17 7H7M17 7v10"
                                stroke="#38bdf8"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    }
                />
                {/* Success Rate */}
                <KpiCard
                    label="SUCCESS RATE"
                    value={<span style={{ color: "#4ade80" }}>82%</span>}
                    sub={<span style={{ color: "#94a3b8", fontSize: 13 }}>Consistent with KPI target</span>}
                    icon={
                        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9" stroke="#38bdf8" strokeWidth="2" />
                            <path
                                d="M8 12l3 3 5-5"
                                stroke="#38bdf8"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    }
                />
                {/* Credits Issued */}
                <KpiCard
                    label="CREDITS ISSUED"
                    value="4,684"
                    sub={<span style={{ color: "#38bdf8", fontSize: 13 }}>Total incentive payout</span>}
                    icon={
                        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9" stroke="#38bdf8" strokeWidth="2" />
                            <path
                                d="M12 6v6l4 2"
                                stroke="#38bdf8"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    }
                />
            </div>

            {/* Middle Row */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1.4fr",
                    gap: "20px",
                    marginBottom: "24px",
                }}
            >
                {/* Incentive Configuration */}
                <div
                    style={{
                        background: "#161e2e",
                        borderRadius: 16,
                        padding: "28px 28px 24px",
                        border: "1px solid #1e2d42",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            marginBottom: 28,
                        }}
                    >
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                            <path
                                d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                                stroke="#38bdf8"
                                strokeWidth="2"
                            />
                            <path
                                d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
                                stroke="#38bdf8"
                                strokeWidth="2"
                            />
                        </svg>
                        <span style={{ fontWeight: 600, fontSize: 17 }}>
                            Incentive Configuration
                        </span>
                    </div>

                    {/* Credit Reward */}
                    <div style={{ marginBottom: 28 }}>
                        <label
                            style={{ fontSize: 13, color: "#94a3b8", display: "block", marginBottom: 10 }}
                        >
                            Credit Reward
                        </label>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <input
                                type="number"
                                value={creditReward}
                                onChange={(e) => setCreditReward(Number(e.target.value))}
                                style={{
                                    width: 80,
                                    background: "#0f1623",
                                    border: "1px solid #1e2d42",
                                    borderRadius: 8,
                                    color: "#e2e8f0",
                                    fontSize: 15,
                                    padding: "8px 12px",
                                    outline: "none",
                                }}
                            />
                            <span style={{ fontSize: 14, color: "#94a3b8" }}>
                                Credits per successful referral
                            </span>
                        </div>
                        <div style={{ fontSize: 12, color: "#64748b", marginTop: 8 }}>
                            Automatically assigned to referrer upon verification.
                        </div>
                    </div>

                    <hr style={{ border: "none", borderTop: "1px solid #1e2d42", marginBottom: 24 }} />

                    {/* Milestone Reward */}
                    <div style={{ marginBottom: 28 }}>
                        <label
                            style={{ fontSize: 13, color: "#94a3b8", display: "block", marginBottom: 14 }}
                        >
                            Milestone Reward
                        </label>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            <div>
                                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8, letterSpacing: 1 }}>
                                    TARGET COUNT
                                </div>
                                <input
                                    type="number"
                                    value={targetCount}
                                    onChange={(e) => setTargetCount(Number(e.target.value))}
                                    style={{
                                        width: "100%",
                                        background: "#0f1623",
                                        border: "1px solid #1e2d42",
                                        borderRadius: 8,
                                        color: "#e2e8f0",
                                        fontSize: 15,
                                        padding: "8px 12px",
                                        outline: "none",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>
                            <div>
                                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8, letterSpacing: 1 }}>
                                    REWARD PLAN
                                </div>
                                <select
                                    value={rewardPlan}
                                    onChange={(e) => setRewardPlan(e.target.value)}
                                    style={{
                                        width: "100%",
                                        background: "#0f1623",
                                        border: "1px solid #1e2d42",
                                        borderRadius: 8,
                                        color: "#e2e8f0",
                                        fontSize: 14,
                                        padding: "8px 12px",
                                        outline: "none",
                                        cursor: "pointer",
                                        appearance: "none",
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' strokeWidth='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "right 10px center",
                                        paddingRight: 32,
                                    }}
                                >
                                    {rewardPlans.map((p) => (
                                        <option key={p}>{p}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div style={{ fontSize: 12, color: "#64748b", marginTop: 10 }}>
                            Current Rule: &apos;Free Bronze after {targetCount} referrals&apos;
                        </div>
                    </div>

                    {/* Auto Approval */}
                    <div
                        style={{
                            background: "#0f1623",
                            border: "1px solid #1e2d42",
                            borderRadius: 12,
                            padding: "16px 18px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <div
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 10,
                                    background: "rgba(56,189,248,0.1)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                                    <path
                                        d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                                        stroke="#38bdf8"
                                        strokeWidth="2"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 14 }}>Automatic Approval</div>
                                <div style={{ fontSize: 12, color: "#64748b" }}>
                                    Verify referrals instantly via API
                                </div>
                            </div>
                        </div>
                        <div
                            onClick={() => setAutoApproval(!autoApproval)}
                            style={{
                                width: 46,
                                height: 26,
                                borderRadius: 13,
                                background: autoApproval ? "#38bdf8" : "#1e2d42",
                                cursor: "pointer",
                                position: "relative",
                                transition: "background 0.2s",
                                flexShrink: 0,
                            }}
                        >
                            <div
                                style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: "50%",
                                    background: "#fff",
                                    position: "absolute",
                                    top: 3,
                                    left: autoApproval ? 23 : 3,
                                    transition: "left 0.2s",
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Referral Growth Chart */}
                <div
                    style={{
                        background: "#161e2e",
                        borderRadius: 16,
                        padding: "28px",
                        border: "1px solid #1e2d42",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 24,
                        }}
                    >
                        <span style={{ fontWeight: 600, fontSize: 17 }}>Referral Growth</span>
                        <div style={{ display: "flex", gap: 4 }}>
                            {["30D", "90D", "1Y"].map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setActiveRange(r)}
                                    style={{
                                        background: activeRange === r ? "#38bdf8" : "transparent",
                                        color: activeRange === r ? "#0f1623" : "#64748b",
                                        border: "none",
                                        borderRadius: 6,
                                        padding: "4px 10px",
                                        fontSize: 12,
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        transition: "all 0.15s",
                                    }}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                            <CartesianGrid stroke="#1e2d42" strokeDasharray="0" vertical={false} />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: "#64748b", fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                domain={[400, 900]}
                                ticks={[400, 450, 500, 550, 600, 650, 700, 750, 800, 850]}
                                tick={{ fill: "#64748b", fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: "#1e2d42",
                                    border: "none",
                                    borderRadius: 8,
                                    color: "#e2e8f0",
                                    fontSize: 13,
                                }}
                                cursor={{ stroke: "#38bdf8", strokeWidth: 1, strokeDasharray: "4 4" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#38bdf8"
                                strokeWidth={2.5}
                                dot={{ fill: "#38bdf8", r: 5, strokeWidth: 0 }}
                                activeDot={{ r: 7, fill: "#38bdf8" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Referrals */}
            <div
                style={{
                    background: "#161e2e",
                    borderRadius: 16,
                    padding: "28px",
                    border: "1px solid #1e2d42",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 24,
                    }}
                >
                    <span style={{ fontWeight: 600, fontSize: 17 }}>Recent Referrals</span>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            background: "#0f1623",
                            border: "1px solid #1e2d42",
                            borderRadius: 10,
                            padding: "8px 14px",
                            width: 220,
                        }}
                    >
                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8" stroke="#64748b" strokeWidth="2" />
                            <path d="M21 21l-4.35-4.35" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <input
                            placeholder="Search referrer..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                background: "transparent",
                                border: "none",
                                outline: "none",
                                color: "#e2e8f0",
                                fontSize: 13,
                                width: "100%",
                            }}
                        />
                    </div>
                </div>

                {/* Table Header */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 2fr 1fr 1.5fr",
                        padding: "0 0 12px",
                        borderBottom: "1px solid #1e2d42",
                    }}
                >
                    {["USER", "REFERRED USER", "STATUS", "DATE"].map((h) => (
                        <div key={h} style={{ fontSize: 11, color: "#64748b", letterSpacing: 1 }}>
                            {h}
                        </div>
                    ))}
                </div>

                {filtered.map((r, i) => (
                    <div
                        key={r.id}
                        style={{
                            display: "grid",
                            gridTemplateColumns: "2fr 2fr 1fr 1.5fr",
                            padding: "18px 0",
                            borderBottom: i < filtered.length - 1 ? "1px solid #1e2d42" : "none",
                            alignItems: "center",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div
                                style={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: "50%",
                                    background: r.color,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: "#fff",
                                    flexShrink: 0,
                                }}
                            >
                                {r.initials}
                            </div>
                            <span style={{ fontSize: 14, fontWeight: 500 }}>{r.name}</span>
                        </div>
                        <div style={{ fontSize: 14, color: "#94a3b8" }}>{r.referred}</div>
                        <div>
                            <span
                                style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    letterSpacing: 0.8,
                                    padding: "4px 10px",
                                    borderRadius: 6,
                                    background:
                                        r.status === "COMPLETED"
                                            ? "rgba(74,222,128,0.12)"
                                            : "rgba(251,191,36,0.12)",
                                    color: r.status === "COMPLETED" ? "#4ade80" : "#fbbf24",
                                    border: `1px solid ${r.status === "COMPLETED" ? "rgba(74,222,128,0.25)" : "rgba(251,191,36,0.25)"}`,
                                }}
                            >
                                {r.status}
                            </span>
                        </div>
                        <div style={{ fontSize: 13, color: "#64748b" }}>{r.date}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function KpiCard({
    label,
    value,
    sub,
    icon,
}: {
    label: string;
    value: React.ReactNode;
    sub: React.ReactNode;
    icon: React.ReactNode;
}) {
    return (
        <div
            style={{
                background: "#161e2e",
                borderRadius: 16,
                padding: "24px 28px",
                border: "1px solid #1e2d42",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                position: "relative",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}
            >
                <div>
                    <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 1, marginBottom: 10 }}>
                        {label}
                    </div>
                    <div style={{ fontSize: 34, fontWeight: 700, lineHeight: 1 }}>{value}</div>
                    <div style={{ marginTop: 10 }}>{sub}</div>
                </div>
                <div
                    style={{
                        width: 46,
                        height: 46,
                        borderRadius: 12,
                        background: "rgba(56,189,248,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}