"use client";

import { useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useVoiceCall } from "@/hooks/useVoiceCall";

interface VoiceCallModalProps {
    wsUrl: string;
    characterName: string;
    characterAvatar?: string;
    onClose: () => void;
}

export default function VoiceCallModal({ wsUrl, characterName, characterAvatar, onClose }: VoiceCallModalProps) {
    const { status, isMuted, toggleMute, stopRecording, disconnect } = useVoiceCall({
        wsUrl,
        onError: (message) => toast.error(message),
    });

    useEffect(() => {
        return () => disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleEndCall = () => {
        stopRecording();
        disconnect();
        onClose();
    };

    const statusLabel =
        status === "connecting" ? "Connecting..." :
            status === "connected" ? (isMuted ? "Muted" : "Listening...") :
                status === "closed" ? "Call ended" :
                    status === "error" ? "Connection error" : "";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl bg-[#0f1e33] p-8 text-center">
                {characterAvatar ? (
                    <Image
                        src={characterAvatar}
                        alt={characterName}
                        width={88}
                        height={88}
                        className="rounded-full object-cover"
                    />
                ) : (
                    <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[#1e3a5f] text-2xl font-bold uppercase text-white">
                        {characterName.slice(0, 2)}
                    </div>
                )}

                <div>
                    <p className="text-lg font-bold text-white">{characterName}</p>
                    <p className="mt-1 text-sm text-slate-400">{statusLabel}</p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleMute}
                        disabled={status !== "connected"}
                        className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors disabled:opacity-40 ${isMuted ? "bg-slate-600 hover:bg-slate-700" : "bg-[#11b780] hover:bg-[#0d9668]"
                            }`}
                    >
                        <MicIcon />
                    </button>

                    <button
                        onClick={handleEndCall}
                        className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 hover:bg-red-700"
                    >
                        <PhoneIcon />
                    </button>
                </div>
            </div>
        </div>
    );
}

function PhoneIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
    );
}

function MicIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
    );
}