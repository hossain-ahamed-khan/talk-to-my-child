"use client";

import { useCallback, useEffect, useState } from "react";
import { LoaderCircle, Mic, MicOff, Phone, X } from "lucide-react";
import { useVoiceCall, VoiceCallEvent, VoiceCallStatus } from "@/hooks/useVoiceCall";

type Transcript = { role: "user" | "assistant"; text: string };

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://talkapi.sobhoy.com").replace(/\/api\/v1\/?$/, "");
const CALL_URL = `${API_BASE}/api/v1/characters/call/`;
const WS_BASE = API_BASE.replace(/^http/, "ws");

interface ParentVoiceChatModalProps {
    token: string;
    onClose: () => void;
}

function statusLabel(status: VoiceCallStatus, isMuted: boolean) {
    if (status === "connecting") return "Connecting...";
    if (status === "connected") return isMuted ? "Muted" : "Listening...";
    if (status === "closed") return "Call ended";
    if (status === "error") return "Connection error";
    return "Starting call...";
}

export default function ParentVoiceChatModal({ token, onClose }: ParentVoiceChatModalProps) {
    const [wsUrl, setWsUrl] = useState<string | null>(null);
    const [transcripts, setTranscripts] = useState<Transcript[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        const createCall = async () => {
            try {
                const response = await fetch(CALL_URL, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                    body: JSON.stringify({}),
                });
                const payload = await response.json() as {
                    ws_url?: string;
                    room_id?: string;
                    detail?: string;
                    message?: string;
                    data?: { ws_url?: string; room_id?: string };
                };
                const returnedWsUrl = payload.ws_url || payload.data?.ws_url;
                const roomId = payload.room_id || payload.data?.room_id;
                const voiceUrl = returnedWsUrl || (roomId ? `${WS_BASE}/ws/voice/${roomId}/` : null);
                if (!response.ok || !voiceUrl) throw new Error(payload.detail || payload.message || `Unable to start voice chat (${response.status}).`);
                if (!cancelled) setWsUrl(voiceUrl);
            } catch (requestError) {
                if (!cancelled) setError(requestError instanceof Error ? requestError.message : "Unable to start voice chat.");
            }
        };
        void createCall();
        return () => { cancelled = true; };
    }, [token]);

    const handleEvent = useCallback((event: VoiceCallEvent) => {
        if (event.type === "transcript" && event.role && (event.text || event.content)) {
            setTranscripts((current) => [...current, { role: event.role!, text: event.text || event.content || "" }]);
        }
        if (event.type === "error") setError(event.message || "The voice service returned an error.");
    }, []);

    return <VoiceChatPanel wsUrl={wsUrl} transcripts={transcripts} error={error} onEvent={handleEvent} onClose={onClose} />;
}

function VoiceChatPanel({ wsUrl, transcripts, error: requestError, onEvent, onClose }: { wsUrl: string | null; transcripts: Transcript[]; error: string | null; onEvent: (event: VoiceCallEvent) => void; onClose: () => void }) {
    const [error, setError] = useState<string | null>(null);
    const { status, isRecording, isMuted, toggleMute, stopRecording, disconnect } = useVoiceCall({ wsUrl, onError: setError, onEvent });

    useEffect(() => () => disconnect(), [disconnect]);

    const endCall = () => { stopRecording(); disconnect(); onClose(); };

    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Voice chat">
        <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#2d3f55] bg-[#111c2b] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2d3f55] px-5 py-4"><div><p className="font-semibold text-white">AI voice chat</p><p className="mt-1 text-xs text-[#8b9ab0]">{statusLabel(status, isMuted)}</p></div><button type="button" onClick={endCall} title="Close voice chat" className="rounded-lg p-1.5 text-[#8b9ab0] hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button></div>
            <div className="min-h-48 flex-1 space-y-3 overflow-y-auto p-5">{transcripts.length === 0 ? <div className="flex h-40 items-center justify-center text-center text-sm text-[#8b9ab0]">{status === "connecting" || !wsUrl ? <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" />Preparing your voice chat...</> : "Start speaking when you are ready."}</div> : transcripts.map((item, index) => <div key={`${index}-${item.text}`} className={`rounded-xl p-3 text-sm leading-6 ${item.role === "user" ? "bg-[#1a2535] text-[#d8e2ec]" : "bg-emerald-500/10 text-emerald-100"}`}><p className="mb-1 text-[11px] uppercase tracking-wide text-[#8b9ab0]">{item.role === "user" ? "You" : "Assistant"}</p>{item.text}</div>)}</div>
            {(error || requestError) && <p className="mx-5 mb-3 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-200">{error || requestError}</p>}
            <div className="flex items-center justify-center gap-4 border-t border-[#2d3f55] px-5 py-4"><button type="button" onClick={toggleMute} disabled={status !== "connected"} title={isMuted ? "Unmute microphone" : "Mute microphone"} className={`flex h-12 w-12 items-center justify-center rounded-full text-white disabled:opacity-40 ${isMuted ? "bg-slate-600" : "bg-emerald-600 hover:bg-emerald-500"}`}>{isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}</button><button type="button" onClick={endCall} title="End voice chat" className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-500"><Phone className="h-5 w-5" /></button><span className="text-xs text-[#8b9ab0]">{isRecording ? "Microphone active" : "Microphone inactive"}</span></div>
        </div>
    </div>;
}