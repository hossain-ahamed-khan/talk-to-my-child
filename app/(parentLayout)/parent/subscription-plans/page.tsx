const CheckIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="11" stroke="#10b981" strokeWidth="1.5" />
        <path d="M7.5 12l3 3 6-6" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const MicIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v6a2 2 0 0 0 4 0V5a2 2 0 0 0-2-2zm7 8a1 1 0 0 1 1 1 8 8 0 0 1-7 7.93V22h2a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h2v-2.07A8 8 0 0 1 4 12a1 1 0 1 1 2 0 6 6 0 0 0 12 0 1 1 0 0 1 1-1z" />
    </svg>
);

const plans = [
    {
        tier: "SILVER",
        price: "$9.99",
        label: "Join Silver",
        features: ["50 AI Credits / month", "1 Child Profile", "Basic chat history"],
        popular: false,
        bestValue: false,
        highlight: false,
    },
    {
        tier: "GOLD",
        price: "$19.99",
        label: "Go Gold",
        features: ["200 AI Credits / month", "3 Child Profiles", "Priority Support", "Advanced Voice"],
        popular: true,
        bestValue: false,
        highlight: true,
    },
    {
        tier: "ELITE",
        price: "$39.99",
        label: "Join Elite",
        features: ["Unlimited AI Credits", "Unlimited Child Profiles", "Early Access Features", "Dedicated Parent Coach"],
        popular: false,
        bestValue: true,
        highlight: false,
    },
];

export default function SubscriptionPlans() {
    return (
        <div style={{
            background: "#091520",
            minHeight: "100vh",
            padding: "48px 32px",
            fontFamily: "'DM Sans', sans-serif",
            position: "relative",
        }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        button { cursor: pointer; transition: opacity 0.15s, transform 0.15s; }
        button:hover { opacity: 0.9; transform: translateY(-1px); }
        .plan-card { transition: transform 0.2s; }
        .plan-card:hover { transform: translateY(-4px); }
        .plan-card-highlight:hover { transform: translateY(-4px) scale(1.01); }
      `}</style>

            {/* Header */}
            <div style={{ marginBottom: 40 }}>
                <h1 style={{
                    margin: 0,
                    fontSize: 36,
                    fontWeight: 800,
                    color: "#e8f4f8",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.1,
                }}>
                    Subscription Plans
                </h1>
                <p style={{
                    margin: "10px 0 0",
                    fontSize: 15,
                    color: "#4a7a90",
                    fontWeight: 400,
                }}>
                    Choose the perfect plan to enhance your child&apos;s learning journey.
                </p>
            </div>

            {/* Cards Grid */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 20,
                alignItems: "start",
                maxWidth: 960,
            }}>
                {plans.map((plan) => (
                    <div key={plan.tier} style={{ position: "relative" }}>

                        {/* Most Popular badge */}
                        {plan.popular && (
                            <div style={{
                                position: "absolute",
                                top: -16,
                                left: "50%",
                                transform: "translateX(-50%)",
                                zIndex: 10,
                            }}>
                                <div style={{
                                    background: "#10b981",
                                    color: "#091520",
                                    fontSize: 10,
                                    fontWeight: 800,
                                    letterSpacing: "0.14em",
                                    padding: "5px 18px",
                                    borderRadius: 99,
                                    whiteSpace: "nowrap",
                                }}>
                                    MOST POPULAR
                                </div>
                            </div>
                        )}

                        {/* Card */}
                        <div
                            className={plan.highlight ? "plan-card-highlight" : "plan-card"}
                            style={{
                                background: plan.highlight ? "#0a2318" : "#0d1e2d",
                                border: plan.highlight ? "2px solid #10b981" : "1px solid #1a3348",
                                borderRadius: 18,
                                padding: "28px 28px 36px",
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            {/* Best Value badge */}
                            {plan.bestValue && (
                                <div style={{
                                    position: "absolute",
                                    top: 20,
                                    right: 20,
                                    background: "#10b981",
                                    color: "#091520",
                                    fontSize: 9,
                                    fontWeight: 800,
                                    letterSpacing: "0.08em",
                                    padding: "4px 10px",
                                    borderRadius: 99,
                                }}>
                                    Best Value
                                </div>
                            )}

                            {/* Tier name */}
                            <p style={{
                                margin: "0 0 8px",
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: "0.16em",
                                color: "#4a7a90",
                            }}>
                                {plan.tier}
                            </p>

                            {/* Price */}
                            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 24 }}>
                                <span style={{
                                    fontSize: 44,
                                    fontWeight: 800,
                                    color: "#e8f4f8",
                                    letterSpacing: "-0.03em",
                                    lineHeight: 1,
                                }}>
                                    {plan.price}
                                </span>
                                <span style={{ fontSize: 14, color: "#4a7a90", fontWeight: 500 }}>/mo</span>
                            </div>

                            {/* CTA Button */}
                            <button style={{
                                width: "100%",
                                padding: "14px",
                                borderRadius: 10,
                                border: "none",
                                background: "linear-gradient(135deg, #10b981, #0d9e6e)",
                                color: "#091520",
                                fontWeight: 800,
                                fontSize: 15,
                                fontFamily: "'DM Sans', sans-serif",
                                letterSpacing: "0.01em",
                                marginBottom: 28,
                                boxShadow: plan.highlight ? "0 6px 24px rgba(16,185,129,0.3)" : "none",
                            }}>
                                {plan.label}
                            </button>

                            {/* Features */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                {plan.features.map((feat) => (
                                    <div key={feat} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div style={{ flexShrink: 0 }}>
                                            <CheckIcon />
                                        </div>
                                        <span style={{ fontSize: 14, color: "#8aaab8", lineHeight: 1.4 }}>{feat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Floating Mic Button */}
            <button style={{
                position: "fixed",
                bottom: 32,
                right: 32,
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: "none",
                background: "linear-gradient(135deg, #10b981, #10b981)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 6px 24px rgba(16,185,129,0.4)",
            }}>
                <MicIcon />
            </button>
        </div>
    );
}