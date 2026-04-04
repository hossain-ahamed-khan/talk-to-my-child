"use client";
import { useState } from "react";
import { DM_Sans } from "next/font/google";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts";

const growthData = [
    { month: "Oct", value: 6200 },
    { month: "Nov", value: 5800 },
    { month: "Dec", value: 6100 },
    { month: "Jan", value: 5900 },
    { month: "Feb", value: 7800 },
    { month: "Mar", value: 9155 },
];

const monthlyData = [
    { month: "January", bronze: 1240, silver: 3450, gold: 4120 },
    { month: "February", bronze: 1450, silver: 3600, gold: 4350 },
    { month: "March", bronze: 1100, silver: 3900, gold: 4155 },
];

const years = ["Current Year (2024)", "Last Year (2023)", "2022"];

const dmSans = DM_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

function fmt(n: number) {
    return "£" + n.toLocaleString("en-GB");
}

export default function RevenueReporting() {
    const [selectedYear, setSelectedYear] = useState(years[0]);
    const [showDropdown, setShowDropdown] = useState(false);

    const totals = monthlyData.map((r) => ({ ...r, total: r.bronze + r.silver + r.gold }));
    const q1Bronze = totals.reduce((s, r) => s + r.bronze, 0);
    const q1Silver = totals.reduce((s, r) => s + r.silver, 0);
    const q1Gold = totals.reduce((s, r) => s + r.gold, 0);
    const q1Total = q1Bronze + q1Silver + q1Gold;

    const lifetimeRevenue = 47823;
    const yearlyTarget = 120000;
    const yearlyProgress = lifetimeRevenue;
    const progressPct = Math.round((yearlyProgress / yearlyTarget) * 100 * 10) / 10;

    return (
        <div
            className={dmSans.className}
            style={{
                background: "#0f1623",
                minHeight: "100vh",
                color: "#e2e8f0",
                padding: "36px 36px 48px",
                boxSizing: "border-box",
            }}
        >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>Revenue Reporting</h1>
                    <p style={{ margin: "6px 0 0", fontSize: 14, color: "#64748b" }}>
                        Manage and analyze your financial performance.
                    </p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    {[
                        { label: "PDF", icon: "⬆" },
                        { label: "CSV", icon: "⬇" },
                    ].map((btn) => (
                        <button
                            key={btn.label}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 7,
                                background: "#1e2d42",
                                color: "#e2e8f0",
                                border: "1px solid #2d3f56",
                                borderRadius: 8,
                                padding: "9px 18px",
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                                fontFamily: "inherit",
                            }}
                        >
                            <span style={{ fontSize: 13 }}>{btn.icon}</span>
                            {btn.label}
                        </button>
                    ))}
                    <button
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            background: "#16a34a",
                            color: "#fff",
                            border: "none",
                            borderRadius: 8,
                            padding: "9px 18px",
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "inherit",
                        }}
                    >
                        <span style={{ fontSize: 16 }}>⊕</span> Google Sheets
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.3fr", gap: 18, marginBottom: 24 }}>
                {/* Lifetime Revenue */}
                <div style={{ background: "#161e2e", border: "1px solid #1e2d42", borderRadius: 14, padding: "24px 28px" }}>
                    <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 1, marginBottom: 12 }}>LIFETIME REVENUE</div>
                    <div style={{ fontSize: 34, fontWeight: 700, marginBottom: 12 }}>{fmt(lifetimeRevenue)}</div>
                    <div style={{ fontSize: 13, color: "#4ade80" }}>↗ +12.4% from last period</div>
                </div>

                {/* Q1 Revenue */}
                <div style={{ background: "#161e2e", border: "1px solid #1e2d42", borderRadius: 14, padding: "24px 28px" }}>
                    <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 1, marginBottom: 12 }}>Q1 REVENUE</div>
                    <div style={{ fontSize: 34, fontWeight: 700, marginBottom: 12 }}>{fmt(q1Total)}</div>
                    <div style={{ fontSize: 13, color: "#94a3b8" }}>
                        Target: £25,000 |{" "}
                        <span style={{ color: "#38bdf8" }}>Exceeded</span>
                    </div>
                </div>

                {/* Yearly Target */}
                <div style={{ background: "#161e2e", border: "1px solid #1e2d42", borderRadius: 14, padding: "24px 28px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                        <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 1 }}>YEARLY TARGET</div>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>
                            £47.8k / <span style={{ color: "#94a3b8", fontWeight: 500 }}>£120k</span>
                        </div>
                    </div>
                    <div
                        style={{
                            height: 8,
                            background: "#1e2d42",
                            borderRadius: 4,
                            overflow: "hidden",
                            marginBottom: 10,
                        }}
                    >
                        <div
                            style={{
                                height: "100%",
                                width: `${progressPct}%`,
                                background: "#38bdf8",
                                borderRadius: 4,
                            }}
                        />
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{progressPct}% of annual goal reached</div>
                </div>
            </div>

            {/* Bottom Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 20 }}>
                {/* Monthly Breakdown */}
                <div style={{ background: "#161e2e", border: "1px solid #1e2d42", borderRadius: 14, padding: "28px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                        <div style={{ fontWeight: 700, fontSize: 18, lineHeight: 1.3 }}>
                            Monthly Breakdown<br />(Q1)
                        </div>
                        <div style={{ position: "relative" }}>
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    background: "#0f1623",
                                    border: "1px solid #1e2d42",
                                    borderRadius: 8,
                                    padding: "9px 16px",
                                    color: "#e2e8f0",
                                    fontSize: 13,
                                    cursor: "pointer",
                                    fontFamily: "inherit",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {selectedYear}
                                <span style={{ color: "#64748b" }}>▾</span>
                            </button>
                            {showDropdown && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "calc(100% + 6px)",
                                        right: 0,
                                        background: "#1e2d42",
                                        border: "1px solid #2d3f56",
                                        borderRadius: 8,
                                        overflow: "hidden",
                                        zIndex: 10,
                                        minWidth: 180,
                                    }}
                                >
                                    {years.map((y) => (
                                        <div
                                            key={y}
                                            onClick={() => { setSelectedYear(y); setShowDropdown(false); }}
                                            style={{
                                                padding: "10px 16px",
                                                fontSize: 13,
                                                cursor: "pointer",
                                                background: y === selectedYear ? "#2d3f56" : "transparent",
                                                color: "#e2e8f0",
                                            }}
                                        >
                                            {y}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Table */}
                    <div>
                        {/* Header */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1.5fr 1fr 1fr 1fr 0.8fr",
                                padding: "0 0 12px",
                                borderBottom: "1px solid #1e2d42",
                            }}
                        >
                            {["MONTH", "BRONZE", "SILVER", "GOLD", "TOTAL"].map((h) => (
                                <div key={h} style={{ fontSize: 11, color: "#64748b", letterSpacing: 0.8 }}>{h}</div>
                            ))}
                        </div>

                        {totals.map((row) => (
                            <div
                                key={row.month}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1.5fr 1fr 1fr 1fr 0.8fr",
                                    padding: "18px 0",
                                    borderBottom: "1px solid #1e2d42",
                                    alignItems: "center",
                                }}
                            >
                                <div style={{ fontSize: 14 }}>{row.month}</div>
                                <div style={{ fontSize: 14, color: "#94a3b8" }}>{fmt(row.bronze)}</div>
                                <div style={{ fontSize: 14, color: "#94a3b8" }}>{fmt(row.silver)}</div>
                                <div style={{ fontSize: 14, color: "#94a3b8" }}>{fmt(row.gold)}</div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: "#38bdf8" }}>{fmt(row.total)}</div>
                            </div>
                        ))}

                        {/* Total Row */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1.5fr 1fr 1fr 1fr 0.8fr",
                                padding: "18px 0 0",
                                alignItems: "center",
                            }}
                        >
                            <div style={{ fontSize: 14, fontWeight: 700 }}>Total Q1</div>
                            <div style={{ fontSize: 14, color: "#94a3b8" }}>{fmt(q1Bronze)}</div>
                            <div style={{ fontSize: 14, color: "#94a3b8" }}>{fmt(q1Silver)}</div>
                            <div style={{ fontSize: 14, color: "#94a3b8" }}>{fmt(q1Gold)}</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#38bdf8" }}>{fmt(q1Total)}</div>
                        </div>
                    </div>
                </div>

                {/* Growth Trend Chart */}
                <div style={{ background: "#161e2e", border: "1px solid #1e2d42", borderRadius: 14, padding: "28px" }}>
                    <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Growth Trend</div>
                    <div style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>Last 6 Months performance</div>

                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid stroke="#1e2d42" strokeDasharray="0" vertical={false} />
                            <XAxis
                                dataKey="month"
                                tick={{ fill: "#64748b", fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{
                                    background: "#1e2d42",
                                    border: "none",
                                    borderRadius: 8,
                                    color: "#e2e8f0",
                                    fontSize: 12,
                                }}
                                formatter={(val) => {
                                    const numericValue =
                                        typeof val === "number"
                                            ? val
                                            : Number(Array.isArray(val) ? val[0] : val ?? 0);
                                    return [`£${numericValue.toLocaleString("en-GB")}`, "Revenue"];
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#38bdf8"
                                strokeWidth={2.5}
                                fill="url(#trendGrad)"
                                dot={{ fill: "#38bdf8", r: 5, strokeWidth: 0 }}
                                activeDot={{ r: 7, fill: "#38bdf8" }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}