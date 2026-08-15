"use client";
import { useRegisterMutation, useVerifyOtpMutation } from "@/redux/features/register/registerApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { toast } from "sonner";

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

const inputStyle: React.CSSProperties = {
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
};

// ---------- OTP Modal ----------
function OtpModal({
    email,
    onClose,
}: {
    email: string;
    onClose: () => void;
}) {
    const router = useRouter();
    const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
    const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // digits only
        const next = [...digits];
        next[index] = value.slice(-1);
        setDigits(next);
        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const otp = digits.join("");
        if (otp.length !== 6) {
            toast.error("Please enter the full 6-digit code.");
            return;
        }

        try {
            const res = await verifyOtp({
                email,
                otp_type: "REGISTER_VERIFY",
                otp,
            }).unwrap();

            if (res?.success) {
                // Store the access token
                if (typeof window !== "undefined" && res?.data?.access_token) {
                    localStorage.setItem("access_token", res.data.access_token);
                }
                toast.success(res.message || "Email verified. You are now logged in.");
                onClose();
                router.push("/login");
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "OTP verification failed. Please try again.");
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 50,
            }}
        >
            <div
                style={{
                    width: "380px",
                    background: "#111f2b",
                    border: "1px solid #1e3040",
                    borderRadius: "20px",
                    padding: "36px 32px",
                }}
            >
                <h3 style={{ color: "#fff", fontSize: "20px", fontWeight: 800, margin: "0 0 8px 0", textAlign: "center" }}>
                    Verify your email
                </h3>
                <p style={{ color: "#8fa89f", fontSize: "13px", textAlign: "center", margin: "0 0 24px 0" }}>
                    Enter the 6-digit code sent to <strong style={{ color: "#fff" }}>{email}</strong>
                </p>

                <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "24px" }}>
                    {digits.map((digit, i) => (
                        <input
                            key={i}
                            ref={(el) => { inputsRef.current[i] = el; }}
                            value={digit}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            maxLength={1}
                            inputMode="numeric"
                            style={{
                                width: "44px",
                                height: "52px",
                                textAlign: "center",
                                fontSize: "20px",
                                fontWeight: 700,
                                background: "#0d1b24",
                                border: "1px solid #1e3040",
                                borderRadius: "10px",
                                color: "#fff",
                                outline: "none",
                            }}
                        />
                    ))}
                </div>

                <button
                    onClick={handleVerify}
                    disabled={isLoading}
                    style={{
                        width: "100%",
                        padding: "14px",
                        background: "#2dd67b",
                        color: "#0d1b24",
                        border: "none",
                        borderRadius: "12px",
                        fontSize: "15px",
                        fontWeight: 700,
                        cursor: isLoading ? "not-allowed" : "pointer",
                        opacity: isLoading ? 0.7 : 1,
                        marginBottom: "12px",
                    }}
                >
                    {isLoading ? "Verifying..." : "Verify"}
                </button>

                <button
                    onClick={onClose}
                    style={{
                        width: "100%",
                        padding: "12px",
                        background: "transparent",
                        color: "#8fa89f",
                        border: "none",
                        fontSize: "13px",
                        cursor: "pointer",
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

// ---------- Main Component ----------
export default function TalkToMyChildRegister() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [retype_password, setRetype_password] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);

    const [registerUser, { isLoading }] = useRegisterMutation();

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.borderColor = "#2dd67b";
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.borderColor = "#1e3040";
    };

    const handleSignUp = async () => {
        if (!fullName || !email || !password || !retype_password) {
            toast.error("Please fill in all fields.");
            return;
        }
        if (password !== retype_password) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            const res = await registerUser({
                email,
                password,
                full_name: fullName,
                confirm_password: retype_password,
            }).unwrap();

            if (res?.success) {
                toast.success(res.message || "Registration successful. OTP sent to email.");
                setShowOtpModal(true);
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "Registration failed. Please try again.");
        }
    };

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

                    <p style={{
                        fontSize: "16px",
                        color: "#8fa89f",
                        lineHeight: "1.7",
                        margin: "0 0 36px 0",
                        maxWidth: "420px",
                    }}>
                        Navigate difficult conversations and build stronger emotional bonds using AI-powered insights tailored to your child&apos;s personality.
                    </p>

                    <Link href="/login">
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
                    </Link>

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

                {/* RIGHT SIDE — Register Card */}
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
                        Create Your Account
                    </h2>
                    <p style={{
                        fontSize: "14px",
                        color: "#6b8f80",
                        textAlign: "center",
                        margin: "0 0 32px 0",
                    }}>
                        Start your premium parenting journey today.
                    </p>

                    <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#c0d4cc", marginBottom: "8px" }}>
                            Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="Jhon Doe"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            style={inputStyle}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#c0d4cc", marginBottom: "8px" }}>
                            Email address
                        </label>
                        <input
                            type="email"
                            placeholder="parent@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            style={inputStyle}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#c0d4cc", marginBottom: "8px" }}>
                            Password
                        </label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                style={{ ...inputStyle, paddingRight: "48px" }}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
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

                    <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#c0d4cc", marginBottom: "8px" }}>
                            Re-type Password
                        </label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••••"
                                value={retype_password}
                                onChange={e => setRetype_password(e.target.value)}
                                style={{ ...inputStyle, paddingRight: "48px" }}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
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

                    <button
                        onClick={handleSignUp}
                        disabled={isLoading}
                        style={{
                            width: "100%",
                            padding: "15px",
                            background: "#2dd67b",
                            color: "#0d1b24",
                            border: "none",
                            borderRadius: "12px",
                            fontSize: "15px",
                            fontWeight: "700",
                            cursor: isLoading ? "not-allowed" : "pointer",
                            opacity: isLoading ? 0.7 : 1,
                            marginBottom: "16px",
                            transition: "opacity 0.2s",
                        }}
                    >
                        {isLoading ? "Signing up..." : "Sign up"}
                    </button>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                        <div style={{ flex: 1, height: "1px", background: "#1e3040" }} />
                        <span style={{ fontSize: "12px", color: "#4a6358", fontWeight: "600", letterSpacing: "1px" }}>OR</span>
                        <div style={{ flex: 1, height: "1px", background: "#1e3040" }} />
                    </div>

                    <Link href="/login">
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
                            Already have an account
                        </button>
                    </Link>
                </div>
            </div>

            {showOtpModal && (
                <OtpModal email={email} onClose={() => setShowOtpModal(false)} />
            )}
        </div>
    );
}