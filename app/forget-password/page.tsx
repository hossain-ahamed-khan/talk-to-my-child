"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

// Swap these for your actual RTK Query hooks, e.g.:
// import { useForgotPasswordMutation, useVerifyOtpMutation, useResetPasswordMutation } from "@/redux/features/auth/authApi";

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

type Step = "email" | "otp" | "reset";

const BrandPanel = () => (
    <div className="min-w-0 flex-1">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-start">
            <div className="mb-4 inline-flex rounded-2xl bg-[#152820] p-3.5">
                <ChatIcon />
            </div>
            <div className="text-[28px] font-extrabold leading-none tracking-tight text-white">
                TalkToMyChild
            </div>
            <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-[3px] text-[#2dd67b]">
                Premium Parenting with AI
            </div>
        </div>

        {/* Badge */}
        <div className="mb-7 inline-flex items-center gap-1.5 rounded-full border border-[#2a4a38] bg-[#152820] px-3.5 py-1.5">
            <SparkleIcon />
            <span className="text-[11px] font-semibold uppercase tracking-[1.5px] text-[#2dd67b]">
                AI-Powered Parenting Assistant
            </span>
        </div>

        {/* Headline */}
        <h1 className="mb-5 text-[clamp(36px,5vw,54px)] font-black leading-[1.1] tracking-[-1.5px] text-white">
            Connect Deeper
            <br />
            with Your Child
        </h1>

        {/* Subtext */}
        <p className="mb-9 max-w-[420px] text-base leading-[1.7] text-[#8fa89f]">
            Navigate difficult conversations and build stronger emotional bonds using
            AI-powered insights tailored to your child&apos;s personality.
        </p>

        {/* CTA */}
        <button className="mb-9 rounded-full bg-[#2dd67b] px-8 py-4 text-[15px] font-bold text-[#0d1b24] transition-opacity hover:opacity-90">
            Get Started Now
        </button>

        {/* Social proof */}
        <div className="flex items-center gap-3">
            <div className="flex">
                {avatars.map((a, i) => (
                    <div
                        key={i}
                        className="flex h-[34px] w-[34px] items-center justify-center rounded-full border-2 border-[#0d1b24] text-[13px] font-bold text-[#0d1b24]"
                        style={{ background: a.bg, marginLeft: i === 0 ? 0 : "-10px" }}
                    >
                        {a.initials}
                    </div>
                ))}
            </div>
            <span className="text-sm text-[#8fa89f]">
                Joined by <strong className="font-bold text-white">2,000+</strong> proactive parents
            </span>
        </div>
    </div>
);

const CardShell = ({
    children,
    onSubmit,
}: {
    children: React.ReactNode;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) => (
    <form
        onSubmit={onSubmit}
        className="w-[440px] flex-shrink-0 rounded-3xl border border-[#1e3040] bg-[#111f2b] p-10 sm:p-12"
    >
        {children}
    </form>
);

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <label className="mb-2 block text-[13px] font-semibold text-[#c0d4cc]">{children}</label>
);

const inputClass =
    "w-full box-border rounded-xl border border-[#1e3040] bg-[#0d1b24] px-4 py-3.5 text-sm text-white outline-none transition-colors focus:border-[#2dd67b]";

export default function ForgotPasswordFlow() {
    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    // Replace this block with your RTK Query mutations, e.g.:
    // const [forgotPassword] = useForgotPasswordMutation();
    // const [verifyOtp] = useVerifyOtpMutation();
    // const [resetPassword] = useResetPasswordMutation();

    const handleSendCode = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email address.");
            return;
        }
        setIsLoading(true);
        try {
            // await forgotPassword({ email }).unwrap();
            toast.success("Verification code sent to your email.");
            setStep("otp");
        } catch (error: any) {
            toast.error(error?.data?.message || error?.message || "Failed to send code.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!otp || otp.length < 5) {
            toast.error("Please enter the 5 digit code.");
            return;
        }
        setIsLoading(true);
        try {
            // await verifyOtp({ email, otp }).unwrap();
            toast.success("Code verified.");
            setStep("reset");
        } catch (error: any) {
            toast.error(error?.data?.message || error?.message || "Invalid or expired code.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!password || !confirmPassword) {
            toast.error("Please fill out both password fields.");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }
        setIsLoading(true);
        try {
            // await resetPassword({ email, otp, password }).unwrap();
            toast.success("Password updated successfully.");
            router.replace("/login");
        } catch (error: any) {
            toast.error(error?.data?.message || error?.message || "Failed to reset password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0f172a] p-6 font-[DM_Sans,'Segoe_UI',sans-serif]">
            <div className="flex w-full max-w-[1100px] flex-col items-center gap-16 lg:flex-row lg:gap-20">
                <BrandPanel />

                {/* STEP 1: Forget Password (email) */}
                {step === "email" && (
                    <CardShell onSubmit={handleSendCode}>
                        <h2 className="mb-2 text-center text-[28px] font-extrabold tracking-tight text-white">
                            Forget Password?
                        </h2>
                        <p className="mb-8 text-center text-sm text-[#6b8f80]">
                            Please enter your email to get verification code
                        </p>

                        <div className="mb-7">
                            <FieldLabel>Email address</FieldLabel>
                            <input
                                type="email"
                                placeholder="parent@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={inputClass}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-xl bg-[#2dd67b] py-[15px] text-[15px] font-bold text-[#0d1b24] transition-opacity hover:opacity-90 disabled:opacity-70"
                        >
                            {isLoading ? "Sending..." : "Continue"}
                        </button>

                        <p className="mt-6 text-center text-sm text-[#6b8f80]">
                            Remembered your password?{" "}
                            <Link href="/login" className="font-semibold text-[#2dd67b] hover:underline">
                                Log in
                            </Link>
                        </p>
                    </CardShell>
                )}

                {/* STEP 2: Check your email (OTP) */}
                {step === "otp" && (
                    <CardShell onSubmit={handleVerifyOtp}>
                        <h2 className="mb-2 text-center text-[28px] font-extrabold tracking-tight text-white">
                            Check your email
                        </h2>
                        <p className="mb-8 text-center text-sm leading-relaxed text-[#6b8f80]">
                            We sent a code to your email address{" "}
                            <span className="text-[#c0d4cc]">{email}</span>. Please check your email for
                            the 5 digit code.
                        </p>

                        <div className="mb-7">
                            <FieldLabel>OTP</FieldLabel>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={5}
                                placeholder="•••••"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                className={`${inputClass} tracking-[6px]`}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-xl bg-[#2dd67b] py-[15px] text-[15px] font-bold text-[#0d1b24] transition-opacity hover:opacity-90 disabled:opacity-70"
                        >
                            {isLoading ? "Verifying..." : "Continue"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep("email")}
                            className="mt-6 w-full text-center text-sm text-[#8fa89f] hover:text-white"
                        >
                            ← Back
                        </button>
                    </CardShell>
                )}

                {/* STEP 3: Set a new password */}
                {step === "reset" && (
                    <CardShell onSubmit={handleResetPassword}>
                        <h2 className="mb-2 text-center text-[28px] font-extrabold tracking-tight text-white">
                            Set a new password
                        </h2>
                        <p className="mb-8 text-center text-sm text-[#6b8f80]">
                            Create a new password. Ensure it differs from previous ones for security
                        </p>

                        <div className="mb-4">
                            <FieldLabel>Password</FieldLabel>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`${inputClass} pr-12`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((p) => !p)}
                                    className="absolute right-3.5 top-1/2 flex -translate-y-1/2 items-center"
                                >
                                    <EyeIcon show={showPassword} />
                                </button>
                            </div>
                        </div>

                        <div className="mb-7">
                            <FieldLabel>New Password</FieldLabel>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`${inputClass} pr-12`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((p) => !p)}
                                    className="absolute right-3.5 top-1/2 flex -translate-y-1/2 items-center"
                                >
                                    <EyeIcon show={showConfirmPassword} />
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-xl bg-[#2dd67b] py-[15px] text-[15px] font-bold text-[#0d1b24] transition-opacity hover:opacity-90 disabled:opacity-70"
                        >
                            {isLoading ? "Updating..." : "Continue"}
                        </button>
                    </CardShell>
                )}
            </div>
        </div>
    );
}