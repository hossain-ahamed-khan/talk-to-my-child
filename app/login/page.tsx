"use client";
import { useState } from "react";

const ChatIcon = () => (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" rx="10" fill="#1a2f2a" />
        <path
            d="M8 11C8 9.34315 9.34315 8 11 8H25C26.6569 8 28 9.34315 28 11V21C28 22.6569 26.6569 24 25 24H20L15 28V24H11C9.34315 24 8 22.6569 8 21V11Z"
            stroke="#2dd67b"
            strokeWidth="1.8"
            fill="none"
        />
        <circle cx="13" cy="16" r="1.2" fill="#2dd67b" />
        <circle cx="18" cy="16" r="1.2" fill="#2dd67b" />
        <circle cx="23" cy="16" r="1.2" fill="#2dd67b" />
    </svg>
);

const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.79h5.39a4.6 4.6 0 01-2 3.02v2.5h3.23C18.34 15.8 19.6 13.27 19.6 10.23z" fill="#4285F4" />
        <path d="M10 20c2.7 0 4.97-.9 6.63-2.44l-3.23-2.5c-.9.6-2.04.96-3.4.96-2.6 0-4.81-1.76-5.6-4.12H1.07v2.58A10 10 0 0010 20z" fill="#34A853" />
        <path d="M4.4 11.9A6.04 6.04 0 014.08 10c0-.66.12-1.3.32-1.9V5.52H1.07A10 10 0 000 10c0 1.62.39 3.15 1.07 4.48L4.4 11.9z" fill="#FBBC05" />
        <path d="M10 3.96c1.47 0 2.78.5 3.82 1.5L16.7 2.6C14.97.99 12.7 0 10 0A10 10 0 001.07 5.52L4.4 8.1C5.19 5.74 7.4 3.96 10 3.96z" fill="#EA4335" />
    </svg>
);

const SparkleIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M6 0L7.2 4.8L12 6L7.2 7.2L6 12L4.8 7.2L0 6L4.8 4.8L6 0Z" fill="#2dd67b" />
    </svg>
);

const EyeIcon = ({ show }: { show: boolean }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7f78" strokeWidth="2">
        {show ? (
            <>
                <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" />
                <circle cx="12" cy="12" r="3" />
            </>
        ) : (
            <>
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
            </>
        )}
    </svg>
);

const avatars = [
    { initials: "A", bg: "#c8f0dc" },
    { initials: "B", bg: "#a8d8ea" },
    { initials: "C", bg: "#ffd6a5" },
];

export default function TalkToMyChildLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(true);

    return (
        <div style={{
            minHeight: "100vh",
            background: "#0f172a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            padding: "24px",
        }}>
            <div style={{
                display: "flex",
                width: "100%",
                maxWidth: "1100px",
                gap: "80px",
                alignItems: "center",
            }}>
                {/* LEFT SIDE */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Logo */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginBottom: "32px" }}>
                        <div style={{
                            background: "#152820",
                            borderRadius: "16px",
                            padding: "14px",
                            marginBottom: "16px",
                            display: "inline-flex",
                        }}>
                            <ChatIcon />
                        </div>
                        <div style={{ fontSize: "28px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.5px", lineHeight: 1 }}>
                            TalkToMyChild
                        </div>
                        <div style={{
                            fontSize: "11px",
                            fontWeight: "600",
                            letterSpacing: "3px",
                            color: "#2dd67b",
                            marginTop: "6px",
                            textTransform: "uppercase",
                        }}>
                            Premium Parenting with AI
                        </div>
                    </div>

                    {/* Badge */}
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "#152820",
                        border: "1px solid #2a4a38",
                        borderRadius: "100px",
                        padding: "6px 14px",
                        marginBottom: "28px",
                    }}>
                        <SparkleIcon />
                        <span style={{ fontSize: "11px", fontWeight: "600", color: "#2dd67b", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                            AI-Powered Parenting Assistant
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 style={{
                        fontSize: "clamp(36px, 5vw, 54px)",
                        fontWeight: "900",
                        color: "#ffffff",
                        lineHeight: "1.1",
                        letterSpacing: "-1.5px",
                        margin: "0 0 20px 0",
                    }}>
                        Connect Deeper<br />with Your Child
                    </h1>

                    {/* Subtext */}
                    <p style={{
                        fontSize: "16px",
                        color: "#8fa89f",
                        lineHeight: "1.7",
                        margin: "0 0 36px 0",
                        maxWidth: "420px",
                    }}>
                        Navigate difficult conversations and build stronger emotional bonds using AI-powered insights tailored to your child&apos;s personality.
                    </p>

                    {/* CTA */}
                    <button
                        style={{
                            background: "#2dd67b",
                            color: "#0d1b24",
                            border: "none",
                            borderRadius: "100px",
                            padding: "16px 32px",
                            fontSize: "15px",
                            fontWeight: "700",
                            cursor: "pointer",
                            marginBottom: "36px",
                            transition: "opacity 0.2s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                    >
                        Get Started Now
                    </button>

                    {/* Social proof */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ display: "flex" }}>
                            {avatars.map((a, i) => (
                                <div key={i} style={{
                                    width: "34px",
                                    height: "34px",
                                    borderRadius: "50%",
                                    background: a.bg,
                                    border: "2px solid #0d1b24",
                                    marginLeft: i === 0 ? "0" : "-10px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "13px",
                                    fontWeight: "700",
                                    color: "#0d1b24",
                                }}>
                                    {a.initials}
                                </div>
                            ))}
                        </div>
                        <span style={{ fontSize: "14px", color: "#8fa89f" }}>
                            Joined by{" "}
                            <strong style={{ color: "#ffffff", fontWeight: "700" }}>2,000+</strong>
                            {" "}proactive parents
                        </span>
                    </div>
                </div>

                {/* RIGHT SIDE — Login Card */}
                <div style={{
                    width: "440px",
                    flexShrink: 0,
                    background: "#111f2b",
                    borderRadius: "24px",
                    padding: "48px 40px",
                    border: "1px solid #1e3040",
                }}>
                    <h2 style={{
                        fontSize: "28px",
                        fontWeight: "800",
                        color: "#ffffff",
                        textAlign: "center",
                        margin: "0 0 8px 0",
                        letterSpacing: "-0.5px",
                    }}>
                        Login to Account
                    </h2>
                    <p style={{
                        fontSize: "14px",
                        color: "#6b8f80",
                        textAlign: "center",
                        margin: "0 0 32px 0",
                    }}>
                        Please enter your email and password to continue
                    </p>

                    {/* Email */}
                    <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#c0d4cc", marginBottom: "8px" }}>
                            Email address / Child Username
                        </label>
                        <input
                            type="email"
                            placeholder="parent@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            style={{
                                width: "100%",
                                boxSizing: "border-box",
                                padding: "14px 16px",
                                background: "#0d1b24",
                                border: "1px solid #1e3040",
                                borderRadius: "12px",
                                color: "#ffffff",
                                fontSize: "14px",
                                outline: "none",
                                transition: "border-color 0.2s",
                            }}
                            onFocus={e => (e.target.style.borderColor = "#2dd67b")}
                            onBlur={e => (e.target.style.borderColor = "#1e3040")}
                        />
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#c0d4cc", marginBottom: "8px" }}>
                            Password
                        </label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                style={{
                                    width: "100%",
                                    boxSizing: "border-box",
                                    padding: "14px 48px 14px 16px",
                                    background: "#0d1b24",
                                    border: "1px solid #1e3040",
                                    borderRadius: "12px",
                                    color: "#ffffff",
                                    fontSize: "14px",
                                    outline: "none",
                                    transition: "border-color 0.2s",
                                }}
                                onFocus={e => (e.target.style.borderColor = "#2dd67b")}
                                onBlur={e => (e.target.style.borderColor = "#1e3040")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(p => !p)}
                                style={{
                                    position: "absolute",
                                    right: "14px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: 0,
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <EyeIcon show={showPassword} />
                            </button>
                        </div>
                    </div>

                    {/* Remember / Forgot */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                            <div
                                onClick={() => setRemember(r => !r)}
                                style={{
                                    width: "18px",
                                    height: "18px",
                                    borderRadius: "5px",
                                    background: remember ? "#2dd67b" : "transparent",
                                    border: remember ? "2px solid #2dd67b" : "2px solid #3a5548",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                }}
                            >
                                {remember && (
                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                        <path d="M1 4L3.5 6.5L9 1" stroke="#0d1b24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </div>
                            <span style={{ fontSize: "13px", color: "#8fa89f" }}>Remember Password</span>
                        </label>
                        <button style={{ background: "none", border: "none", color: "#8fa89f", fontSize: "13px", cursor: "pointer", padding: 0 }}>
                            Forget Password?
                        </button>
                    </div>

                    {/* Continue with Email */}
                    <button
                        style={{
                            width: "100%",
                            padding: "15px",
                            background: "#2dd67b",
                            color: "#0d1b24",
                            border: "none",
                            borderRadius: "12px",
                            fontSize: "15px",
                            fontWeight: "700",
                            cursor: "pointer",
                            marginBottom: "16px",
                            transition: "opacity 0.2s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                    >
                        Continue with Email
                    </button>

                    {/* OR divider */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                        <div style={{ flex: 1, height: "1px", background: "#1e3040" }} />
                        <span style={{ fontSize: "12px", color: "#4a6358", fontWeight: "600", letterSpacing: "1px" }}>OR</span>
                        <div style={{ flex: 1, height: "1px", background: "#1e3040" }} />
                    </div>

                    {/* Continue with Google */}
                    <button
                        style={{
                            width: "100%",
                            padding: "15px",
                            background: "#ffffff",
                            color: "#1a1a1a",
                            border: "none",
                            borderRadius: "12px",
                            fontSize: "15px",
                            fontWeight: "600",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px",
                            transition: "opacity 0.2s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
                        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                    >
                        <GoogleIcon />
                        Continue with Google
                    </button>
                </div>
            </div>
        </div>
    );
}