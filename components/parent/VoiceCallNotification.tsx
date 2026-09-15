"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Bot, Check, Headphones, LoaderCircle, MessageSquare, Phone, Radio, UserRound, X } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { selectToken } from "@/redux/features/auth/authSlice";

type Character = { id?: number; name?: string };
type CallNotification = {
    type?: string;
    status?: string;
    room_id?: string;
    ws_url?: string;
    child_id?: string;
    character?: Character;
    parant_lesting_ws_url?: string;
    message?: string;
    text?: string;
    transcript?: string;
};
type Transcript = { role: "user" | "assistant"; content: string };
type TranscriptPayload = { role?: string; content?: string; text?: string; transcript?: string };
type ListenerEvent = CallNotification & { data?: TranscriptPayload; role?: string; content?: string; sample_rate?: number; audio_format?: string };
type AudioMeta = { type?: string; role?: "user" | "assistant"; sample_rate?: number; audio_format?: string };

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://talkapi.sobhoy.com").replace(/\/api\/v1\/?$/, "");
const WS_BASE = API_BASE.replace(/^http/, "ws");

function getNotificationsUrl(token: string) {
    return `${WS_BASE}/ws/notifications/?token=${encodeURIComponent(token)}`;
}

function getListenerUrl(notification: CallNotification, token: string) {
    if (notification.parant_lesting_ws_url) return notification.parant_lesting_ws_url;
    if (!notification.room_id) return null;
    return `${WS_BASE}/ws/voice/${notification.room_id}/?mode=listen&token=${encodeURIComponent(token)}`;
}

function readTranscript(event: ListenerEvent): Transcript | null {
    const data = event.data && typeof event.data === "object" ? event.data : event;
    const content = [data.content, data.text, data.transcript].find((value) => typeof value === "string" && value.trim());
    if (typeof content !== "string") return null;
    const normalized = content.trim();
    if (!/[\p{L}\p{N}]/u.test(normalized)) return null;
    const role = data.role === "user" ? "user" : "assistant";
    return { role, content: normalized };
}

export default function VoiceCallNotification() {
    const token = useAppSelector(selectToken);
    const [notification, setNotification] = useState<CallNotification | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [unread, setUnread] = useState(0);
    const [listenerStatus, setListenerStatus] = useState<"idle" | "connecting" | "connected" | "closed" | "error">("idle");
    const [transcripts, setTranscripts] = useState<Transcript[]>([]);
    const [error, setError] = useState<string | null>(null);
    const notificationsSocketRef = useRef<WebSocket | null>(null);
    const listenerSocketRef = useRef<WebSocket | null>(null);
    const playbackContextRef = useRef<AudioContext | null>(null);
    const nextAudioStartRef = useRef(0);
    const pendingAudioMetaRef = useRef<AudioMeta | null>(null);

    useEffect(() => {
        if (!token) return;
        const socket = new WebSocket(getNotificationsUrl(token));
        notificationsSocketRef.current = socket;
        socket.onmessage = (event) => {
            try {
                const payload = JSON.parse(event.data) as CallNotification;
                if (payload.type !== "voice.connected") return;
                setNotification(payload);
                setUnread((count) => count + 1);
                setIsOpen(true);
            } catch {
                setError("The call notification could not be read.");
            }
        };
        socket.onerror = () => setError("Call notifications are temporarily unavailable.");
        return () => {
            socket.close();
            notificationsSocketRef.current = null;
        };
    }, [token]);

    useEffect(() => () => {
        listenerSocketRef.current?.close();
        playbackContextRef.current?.close();
    }, []);

    const playAudio = async (blob: Blob, metadata: AudioMeta) => {
        try {
            const context = playbackContextRef.current ?? new AudioContext({ sampleRate: metadata.sample_rate || 16000 });
            playbackContextRef.current = context;
            if (context.state === "suspended") await context.resume();
            const buffer = await blob.arrayBuffer();
            const samples = new Int16Array(buffer, 0, Math.floor(buffer.byteLength / 2));
            const audioBuffer = context.createBuffer(1, samples.length, metadata.sample_rate || 16000);
            const channel = audioBuffer.getChannelData(0);
            for (let index = 0; index < samples.length; index += 1) channel[index] = samples[index] / 32768;
            const source = context.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(context.destination);
            nextAudioStartRef.current = Math.max(nextAudioStartRef.current, context.currentTime + 0.1);
            source.start(nextAudioStartRef.current);
            nextAudioStartRef.current += audioBuffer.duration;
        } catch {
            setError("Live call audio could not be played in this browser.");
        }
    };

    const connectListener = () => {
        if (!token || !notification) return;
        const url = getListenerUrl(notification, token);
        if (!url) return;
        listenerSocketRef.current?.close();
        setTranscripts([]);
        setError(null);
        setListenerStatus("connecting");
        const socket = new WebSocket(url);
        socket.binaryType = "blob";
        listenerSocketRef.current = socket;
        socket.onmessage = async (event) => {
            if (event.data instanceof Blob) {
                const metadata = pendingAudioMetaRef.current;
                pendingAudioMetaRef.current = null;
                if (metadata) await playAudio(event.data, metadata);
                return;
            }
            try {
                const payload = JSON.parse(event.data) as ListenerEvent;
                if (payload.type === "ready") { setListenerStatus("connected"); return; }
                if (payload.type === "audio") {
                    pendingAudioMetaRef.current = {
                        type: payload.type,
                        role: payload.role === "user" || payload.role === "assistant" ? payload.role : undefined,
                        sample_rate: payload.sample_rate,
                        audio_format: payload.audio_format,
                    };
                    return;
                }
                if (payload.type === "voice.disconnected") { setListenerStatus("closed"); return; }
                const transcript = readTranscript(payload);
                if (transcript) setTranscripts((current) => [...current, transcript]);
                if (payload.type === "error") setError(payload.message || "The live call listener returned an error.");
            } catch {
                setError("The live call event could not be read.");
            }
        };
        socket.onerror = () => { setListenerStatus("error"); setError("Could not connect to the live call."); };
        socket.onclose = () => setListenerStatus("closed");
    };

    const closeModal = () => {
        listenerSocketRef.current?.close();
        listenerSocketRef.current = null;
        playbackContextRef.current?.close();
        playbackContextRef.current = null;
        setIsOpen(false);
        setListenerStatus("idle");
    };

    const statusLabel = listenerStatus === "connected" ? "Live" : listenerStatus === "connecting" ? "Connecting..." : listenerStatus === "closed" ? "Call ended" : "Ready to listen";

    return <>
        <button type="button" onClick={() => { setUnread(0); setIsOpen(true); }} aria-label="Open call notifications" className="relative flex items-center gap-2 rounded-full border border-[#2d3f55] bg-[#1a2535] px-3 py-1.5 text-sm font-semibold text-[#c5d1de] transition hover:border-emerald-400/50 hover:text-white">
            <Bell className="h-4 w-4" />
            {unread > 0 && <span className="text-[13px]">{unread}</span>}
            {unread > 0 && <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-emerald-400" />}
        </button>

        {isOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Child call">
            <div className="flex max-h-[min(720px,90vh)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#2d3f55] bg-[#111c2b] shadow-2xl">
                <div className="flex items-start justify-between border-b border-[#2d3f55] px-5 py-4">
                    <div><div className="flex items-center gap-2 text-white"><Phone className="h-4 w-4 text-emerald-400" />Child call in progress</div><p className="mt-1 text-xs text-[#8b9ab0]">{notification?.character?.name || "Your child"} is talking with an AI character.</p></div>
                    <button type="button" onClick={closeModal} title="Close call details" className="rounded-lg p-1.5 text-[#8b9ab0] hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button>
                </div>
                <div className="min-h-0 overflow-y-auto p-5">
                    <div className="mb-5 flex items-center justify-between rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300"><Bot className="h-5 w-5" /></div><div><p className="font-semibold text-white">{notification?.character?.name || "AI character"}</p><p className="text-xs text-[#8b9ab0]">Room {notification?.room_id || "-"}</p></div></div><div className="flex items-center gap-2 text-xs text-emerald-300"><Radio className="h-3.5 w-3.5" />{statusLabel}</div></div>
                    <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-semibold text-white"><MessageSquare className="h-4 w-4 text-emerald-400" />Live transcript</div>{listenerStatus !== "connected" && listenerStatus !== "connecting" && notification?.status === "connected" && <button type="button" onClick={connectListener} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500"><Headphones className="h-3.5 w-3.5" />Listen live</button>}</div>
                    {transcripts.length === 0 ? <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-[#2d3f55] text-center text-sm text-[#8b9ab0]">{listenerStatus === "connecting" ? <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" />Connecting to the call...</> : "Connect to see the live transcript and hear the conversation."}</div> : <div className="space-y-3">{transcripts.map((item, index) => <div key={`${index}-${item.content}`} className={`flex gap-3 rounded-xl p-3 ${item.role === "user" ? "bg-[#1a2535]" : "bg-emerald-500/10"}`}><div className="mt-0.5 text-[#8b9ab0]">{item.role === "user" ? <UserRound className="h-4 w-4" /> : <Bot className="h-4 w-4 text-emerald-300" />}</div><p className="whitespace-pre-wrap text-sm leading-6 text-[#d8e2ec]">{item.content}</p></div>)}</div>}
                    {error && <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-200">{error}</p>}
                </div>
                <div className="flex justify-end border-t border-[#2d3f55] px-5 py-3"><button type="button" onClick={closeModal} className="flex items-center gap-2 rounded-lg border border-[#2d3f55] px-3 py-2 text-xs font-semibold text-[#c5d1de] hover:bg-white/10"><Check className="h-3.5 w-3.5" />Done</button></div>
            </div>
        </div>}
    </>;
}