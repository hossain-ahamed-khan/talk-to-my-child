"use client";
import { useState } from "react";

type TierKey = "bronze" | "silver" | "gold";

type Tier = {
    key: TierKey;
    label: string;
    labelColor: string;
    labelBg: string;
    sublabel: string;
    sublabelColor?: string;
    price: number;
    users: number;
    currentMrr: number;
    highlighted: boolean;
};

const priceHistory = [
    {
        date: "October 12, 2023 • 14:20",
        title: "Silver Tier Increased",
        detail: "£12.00 → £15.00 (+25%)",
        by: "Changed by: admin_sarah",
        active: true,
    },
    {
        date: "August 05, 2023 • 09:15",
        title: "Bronze Tier Increased",
        detail: "£1.49 → £1.99 (+33%)",
        by: "Changed by: system_autoscale",
        active: false,
    },
    {
        date: "June 20, 2023 • 11:45",
        title: "Gold Tier Created",
        detail: "Starting price: £50.00",
        by: "Changed by: admin_mark",
        active: false,
    },
    {
        date: "Jan 15, 2023 • 08:00",
        title: "Initial Launch Pricing",
        detail: "Standardized global pricing model set.",
        by: "Changed by: system",
        active: false,
    },
];

const initialTiers: Tier[] = [
    {
        key: "bronze",
        label: "BRONZE",
        labelColor: "#b45309",
        labelBg: "#292012",
        sublabel: "Level 1",
        price: 1.99,
        users: 4200,
        currentMrr: 8358,
        highlighted: false,
    },
    {
        key: "silver",
        label: "SILVER",
        labelColor: "#94a3b8",
        labelBg: "#1e293b",
        sublabel: "Most Popular",
        sublabelColor: "#38bdf8",
        price: 15.0,
        users: 1850,
        currentMrr: 27750,
        highlighted: true,
    },
    {
        key: "gold",
        label: "GOLD",
        labelColor: "#ca8a04",
        labelBg: "#1f1a09",
        sublabel: "Enterprise",
        price: 50.0,
        users: 128,
        currentMrr: 6400,
        highlighted: false,
    },
];

function fmt(n: number) {
    return "£" + n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function PriceSettings() {
    const [tiers, setTiers] = useState<Tier[]>(initialTiers);
    const [inputValues, setInputValues] = useState<Record<TierKey, string>>({
        bronze: "1.99",
        silver: "15.00",
        gold: "50.00",
    });

    const handleInput = (key: TierKey, val: string) => {
        setInputValues((prev) => ({ ...prev, [key]: val }));
    };

    const handleUpdate = (key: TierKey) => {
        const parsed = parseFloat(inputValues[key]);
        if (!isNaN(parsed)) {
            setTiers((prev) =>
                prev.map((t) => (t.key === key ? { ...t, price: parsed } : t))
            );
        }
    };

    const rows = tiers.map((t) => {
        const projected = t.price * t.users;
        const delta = projected - t.currentMrr;
        return { ...t, projected, delta };
    });

    const totalDelta = rows.reduce((s, r) => s + r.delta, 0);
    const currentMrr = rows.reduce((s, r) => s + r.currentMrr, 0);

    return (
        <div
            style={{
                background: "#0f172a",
                minHeight: "100vh",
                fontFamily: "'DM Sans', sans-serif",
                color: "#e2e8f0",
                padding: "36px 36px 48px",
                boxSizing: "border-box",
            }}
        >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700 }}>Price Settings</h1>
                    <p style={{ margin: "6px 0 0", fontSize: 14, color: "#64748b" }}>
                        Configure subscription tiers and preview financial impact.
                    </p>
                </div>
                <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 1, marginBottom: 4 }}>CURRENT MRR</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: "#34d399" }}>{fmt(currentMrr)}</div>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
                {/* Left Column */}
                <div>
                    {/* Subscription Tiers */}
                    <div style={{ marginBottom: 24 }}>
                        <h2 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 600 }}>Subscription Tiers</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                            {tiers.map((t) => (
                                <div
                                    key={t.key}
                                    style={{
                                        background: "#161e2e",
                                        border: t.highlighted ? "1.5px solid #38bdf8" : "1px solid #1e2d42",
                                        borderRadius: 14,
                                        padding: "20px 20px 22px",
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                        <span
                                            style={{
                                                background: t.labelBg,
                                                color: t.labelColor,
                                                fontSize: 11,
                                                fontWeight: 700,
                                                padding: "3px 8px",
                                                borderRadius: 5,
                                                letterSpacing: 0.5,
                                            }}
                                        >
                                            {t.label}
                                        </span>
                                        <span style={{ fontSize: 12, color: t.sublabelColor ?? "#64748b" }}>
                                            {t.sublabel}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>Price per month</div>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            background: "#0f1623",
                                            border: "1px solid #1e2d42",
                                            borderRadius: 8,
                                            padding: "8px 12px",
                                            marginBottom: 16,
                                        }}
                                    >
                                        <span style={{ color: "#64748b", marginRight: 6, fontSize: 15 }}>£</span>
                                        <input
                                            type="number"
                                            value={inputValues[t.key]}
                                            onChange={(e) => handleInput(t.key, e.target.value)}
                                            step="0.01"
                                            style={{
                                                background: "transparent",
                                                border: "none",
                                                outline: "none",
                                                color: "#e2e8f0",
                                                fontSize: 20,
                                                fontWeight: 700,
                                                width: "100%",
                                                fontFamily: "inherit",
                                            }}
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleUpdate(t.key)}
                                        style={{
                                            width: "100%",
                                            padding: "10px 0",
                                            borderRadius: 8,
                                            border: "none",
                                            background: t.highlighted ? "#38bdf8" : "#1e2d42",
                                            color: t.highlighted ? "#0f1623" : "#94a3b8",
                                            fontWeight: 700,
                                            fontSize: 13,
                                            letterSpacing: 1,
                                            cursor: "pointer",
                                            fontFamily: "inherit",
                                        }}
                                    >
                                        UPDATE
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Financial Impact Preview */}
                    <div
                        style={{
                            background: "#161e2e",
                            border: "1px solid #1e2d42",
                            borderRadius: 14,
                            padding: "24px 28px 28px",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                            <span style={{ fontWeight: 600, fontSize: 16 }}>Financial Impact Preview</span>
                            <span
                                style={{
                                    background: "#1a1a10",
                                    border: "1px solid #854d0e",
                                    color: "#fbbf24",
                                    fontSize: 12,
                                    padding: "5px 12px",
                                    borderRadius: 20,
                                }}
                            >
                                Simulation: +£0.50 Increase Across All Tiers
                            </span>
                        </div>

                        {/* Table */}
                        <div>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1.2fr 1fr 1.3fr 1.3fr 1fr",
                                    padding: "0 0 12px",
                                    borderBottom: "1px solid #1e2d42",
                                }}
                            >
                                {["TIER NAME", "USER BASE", "CURRENT MRR", "PROJECTED MRR", "DELTA"].map((h) => (
                                    <div key={h} style={{ fontSize: 11, color: "#64748b", letterSpacing: 0.8 }}>
                                        {h}
                                    </div>
                                ))}
                            </div>

                            {rows.map((r, i) => (
                                <div
                                    key={r.key}
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1.2fr 1fr 1.3fr 1.3fr 1fr",
                                        padding: "20px 0",
                                        borderBottom: i < rows.length - 1 ? "1px solid #1e2d42" : "none",
                                        alignItems: "center",
                                    }}
                                >
                                    <div style={{ fontSize: 14, fontWeight: 500 }}>
                                        {r.key.charAt(0).toUpperCase() + r.key.slice(1)}
                                    </div>
                                    <div style={{ fontSize: 13, color: "#94a3b8" }}>
                                        {r.users.toLocaleString()}<br />users
                                    </div>
                                    <div style={{ fontSize: 14 }}>{fmt(r.currentMrr)}</div>
                                    <div style={{ fontSize: 14, color: "#34d399" }}>{fmt(r.projected)}</div>
                                    <div style={{ fontSize: 14, color: r.delta >= 0 ? "#34d399" : "#f87171" }}>
                                        {r.delta >= 0 ? "+" : ""}{fmt(r.delta)}
                                    </div>
                                </div>
                            ))}

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                    gap: 16,
                                    paddingTop: 20,
                                    borderTop: "1px solid #1e2d42",
                                    marginTop: 4,
                                }}
                            >
                                <span style={{ fontWeight: 600, fontSize: 14 }}>Total Estimated Monthly Increase:</span>
                                <span style={{ fontWeight: 700, fontSize: 16, color: "#34d399" }}>
                                    + {fmt(totalDelta)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column — Price History */}
                <div
                    style={{
                        background: "#161e2e",
                        border: "1px solid #1e2d42",
                        borderRadius: 14,
                        padding: "24px 22px",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <h2 style={{ margin: "0 0 24px", fontSize: 16, fontWeight: 600 }}>Price History</h2>

                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 0 }}>
                        {priceHistory.map((item, i) => (
                            <div key={i} style={{ display: "flex", gap: 14, marginBottom: 22 }}>
                                {/* Circle */}
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <div
                                        style={{
                                            width: 16,
                                            height: 16,
                                            borderRadius: "50%",
                                            border: `2px solid ${item.active ? "#38bdf8" : "#1e2d42"}`,
                                            background: item.active ? "transparent" : "transparent",
                                            flexShrink: 0,
                                            marginTop: 2,
                                        }}
                                    />
                                    {i < priceHistory.length - 1 && (
                                        <div
                                            style={{
                                                width: 1,
                                                flex: 1,
                                                background: "#1e2d42",
                                                marginTop: 4,
                                                minHeight: 30,
                                            }}
                                        />
                                    )}
                                </div>
                                {/* Content */}
                                <div style={{ paddingBottom: 4 }}>
                                    <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>{item.date}</div>
                                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{item.title}</div>
                                    <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 3 }}>{item.detail}</div>
                                    <div style={{ fontSize: 11, color: "#64748b" }}>{item.by}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        style={{
                            width: "100%",
                            padding: "11px 0",
                            borderRadius: 8,
                            border: "1px solid #1e2d42",
                            background: "transparent",
                            color: "#94a3b8",
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            marginTop: 8,
                        }}
                    >
                        View Full Audit Log
                    </button>
                </div>
            </div>
        </div>
    );
}