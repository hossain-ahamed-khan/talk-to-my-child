"use client";
import { useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const chartData = [
    { month: "Jan", Bronze: 3800, Silver: 6200, Gold: 7100 },
    { month: "Feb", Bronze: 4100, Silver: 7000, Gold: 8200 },
    { month: "Mar", Bronze: 3600, Silver: 6800, Gold: 9500 },
    { month: "Apr", Bronze: 4400, Silver: 7500, Gold: 8800 },
    { month: "May", Bronze: 5200, Silver: 8100, Gold: 9200 },
    { month: "Jun", Bronze: 7200, Silver: 9800, Gold: 11800 },
];

const failedPayments = [
    {
        initials: "SJ",
        name: "Sarah Jenkins",
        email: "sarahj@example.com",
        plan: "Gold Yearly",
        amount: "$199.00",
        dateFailed: "Oct 12, 2023",
        status: "DECLINED",
    },
    {
        initials: "MT",
        name: "Mark Thompson",
        email: "mark.t@corp.io",
        plan: "Silver Monthly",
        amount: "$15.00",
        dateFailed: "Oct 11, 2023",
        status: "DECLINED",
    },
    {
        initials: "LP",
        name: "Laura Patel",
        email: "lpatel@domain.net",
        plan: "Bronze Monthly",
        amount: "$1.99",
        dateFailed: "Oct 10, 2023",
        status: "RETRYING",
    },
    {
        initials: "CW",
        name: "Chris Wang",
        email: "c.wang@email.com",
        plan: "Gold Monthly",
        amount: "$50.00",
        dateFailed: "Oct 09, 2023",
        status: "DECLINED",
    },
];

const avatarColors = ["#7c3aed", "#0369a1", "#065f46", "#92400e"];

const CustomLegend = () => (
    <div style={{ display: "flex", justifyContent: "center", gap: 28, marginTop: 14 }}>
        {[
            { label: "Bronze", color: "#f97316" },
            { label: "Silver", color: "#94a3b8" },
            { label: "Gold", color: "#eab308" },
        ].map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color }} />
                <span style={{ fontSize: 13, color: "#94a3b8" }}>{item.label}</span>
            </div>
        ))}
    </div>
);

export default function FinancialReports() {
    const [activeMonth] = useState("Jun");

    return (
        <div
            style={{
                background: "#0f1623",
                minHeight: "100vh",
                fontFamily: "'DM Sans', sans-serif",
                color: "#e2e8f0",
                padding: "36px 36px 48px",
                boxSizing: "border-box",
            }}
        >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700 }}>Financial Reports</h1>
                    <p style={{ margin: "6px 0 0", fontSize: 14, color: "#64748b" }}>
                        Detailed revenue performance and subscription lifecycle analysis.
                    </p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    {[
                        { label: "PDF", icon: "📄" },
                        { label: "CSV", icon: "📊" },
                    ].map((btn) => (
                        <button
                            key={btn.label}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 7,
                                background: "#ffffff",
                                color: "#0f1623",
                                border: "none",
                                borderRadius: 8,
                                padding: "9px 18px",
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                                fontFamily: "inherit",
                            }}
                        >
                            <span style={{ fontSize: 14 }}>{btn.icon}</span>
                            {btn.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginBottom: 24 }}>
                {[
                    { label: "TOTAL REVENUE", value: "$142,580", change: "+12.5%", sub: "vs last month", up: true, valColor: "#e2e8f0" },
                    { label: "BRONZE PLAN", value: "$28,400", change: "+4.2%", up: true, valColor: "#f97316" },
                    { label: "SILVER PLAN", value: "$54,220", change: "+18.1%", up: true, valColor: "#e2e8f0" },
                    { label: "GOLD PLAN", value: "$59,960", change: "-2.4%", up: false, valColor: "#eab308" },
                ].map((card) => (
                    <div
                        key={card.label}
                        style={{
                            background: "#161e2e",
                            border: "1px solid #1e2d42",
                            borderRadius: 14,
                            padding: "22px 24px",
                        }}
                    >
                        <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 1, marginBottom: 10 }}>
                            {card.label}
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: card.valColor, marginBottom: 10 }}>
                            {card.value}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ color: card.up ? "#4ade80" : "#f87171", fontSize: 13, fontWeight: 600 }}>
                                {card.up ? "↗" : "↘"} {card.change}
                            </span>
                            {card.sub && (
                                <span style={{ fontSize: 12, color: "#64748b" }}>{card.sub}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Revenue Distribution Chart */}
            <div
                style={{
                    background: "#161e2e",
                    border: "1px solid #1e2d42",
                    borderRadius: 14,
                    padding: "24px 28px 20px",
                    marginBottom: 24,
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: 16 }}>Revenue Distribution</div>
                        <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Monthly breakdown by tier</div>
                    </div>
                    <button
                        style={{
                            background: "#ffffff",
                            color: "#0f1623",
                            border: "none",
                            borderRadius: 8,
                            padding: "8px 16px",
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "inherit",
                        }}
                    >
                        Last 6 Months
                    </button>
                </div>

                <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            {[
                                { id: "bronze", color: "#f97316" },
                                { id: "silver", color: "#94a3b8" },
                                { id: "gold", color: "#eab308" },
                            ].map(({ id, color }) => (
                                <linearGradient key={id} id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid stroke="#1e2d42" strokeDasharray="0" vertical={false} />
                        <XAxis
                            dataKey="month"
                            tick={(props) => {
                                const { x, y, payload } = props;
                                const isActive = payload.value === activeMonth;
                                const yPos = typeof y === "number" ? y : Number(y ?? 0);

                                return (
                                    <text
                                        x={x}
                                        y={yPos + 14}
                                        textAnchor="middle"
                                        fill={isActive ? "#f97316" : "#64748b"}
                                        fontSize={12}
                                        fontWeight={isActive ? 700 : 400}
                                    >
                                        {payload.value}
                                    </text>
                                );
                            }}
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
                            formatter={(value) => {
                                const amount = typeof value === "number" ? value : Number(value ?? 0);
                                return [`$${amount.toLocaleString()}`, ""];
                            }}
                        />
                        <Area type="monotone" dataKey="Bronze" stroke="#f97316" strokeWidth={2} fill="url(#grad-bronze)" />
                        <Area type="monotone" dataKey="Silver" stroke="#94a3b8" strokeWidth={2} fill="url(#grad-silver)" />
                        <Area type="monotone" dataKey="Gold" stroke="#eab308" strokeWidth={2} fill="url(#grad-gold)" />
                    </AreaChart>
                </ResponsiveContainer>

                <CustomLegend />
            </div>

            {/* Failed Payments & Retries */}
            <div
                style={{
                    background: "#161e2e",
                    border: "1px solid #1e2d42",
                    borderRadius: 14,
                    padding: "24px 28px",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: 16 }}>Failed Payments & Retries</div>
                        <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                            Active billing errors requiring intervention
                        </div>
                    </div>
                    <span
                        style={{
                            background: "#7f1d1d",
                            color: "#fca5a5",
                            fontSize: 12,
                            fontWeight: 600,
                            padding: "5px 14px",
                            borderRadius: 20,
                        }}
                    >
                        12 Actions Needed
                    </span>
                </div>

                {/* Table Header */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1.5fr 1fr 1.2fr 1fr 1fr",
                        padding: "0 0 12px",
                        borderBottom: "1px solid #1e2d42",
                    }}
                >
                    {["USER", "PLAN", "AMOUNT", "DATE FAILED", "STATUS", "ACTIONS"].map((h) => (
                        <div key={h} style={{ fontSize: 11, color: "#64748b", letterSpacing: 0.8 }}>
                            {h}
                        </div>
                    ))}
                </div>

                {failedPayments.map((row, i) => (
                    <div
                        key={i}
                        style={{
                            display: "grid",
                            gridTemplateColumns: "2fr 1.5fr 1fr 1.2fr 1fr 1fr",
                            padding: "18px 0",
                            borderBottom: i < failedPayments.length - 1 ? "1px solid #1e2d42" : "none",
                            alignItems: "center",
                        }}
                    >
                        {/* User */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    background: avatarColors[i % avatarColors.length],
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 12,
                                    fontWeight: 700,
                                    color: "#fff",
                                    flexShrink: 0,
                                }}
                            >
                                {row.initials}
                            </div>
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 500 }}>{row.name}</div>
                                <div style={{ fontSize: 12, color: "#64748b" }}>{row.email}</div>
                            </div>
                        </div>
                        {/* Plan */}
                        <div style={{ fontSize: 14 }}>{row.plan}</div>
                        {/* Amount */}
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{row.amount}</div>
                        {/* Date */}
                        <div style={{ fontSize: 13, color: "#94a3b8" }}>{row.dateFailed}</div>
                        {/* Status */}
                        <div>
                            <span
                                style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    letterSpacing: 0.6,
                                    padding: "4px 10px",
                                    borderRadius: 6,
                                    background: row.status === "DECLINED" ? "rgba(239,68,68,0.12)" : "rgba(251,191,36,0.12)",
                                    color: row.status === "DECLINED" ? "#f87171" : "#fbbf24",
                                    border: `1px solid ${row.status === "DECLINED" ? "rgba(239,68,68,0.25)" : "rgba(251,191,36,0.25)"}`,
                                }}
                            >
                                {row.status}
                            </span>
                        </div>
                        {/* Actions */}
                        <div>
                            <button
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    background: "transparent",
                                    border: "none",
                                    color: "#f87171",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    fontFamily: "inherit",
                                    padding: 0,
                                }}
                            >
                                <span style={{ fontSize: 15 }}>↺</span> Retry
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}