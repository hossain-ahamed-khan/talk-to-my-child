"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Check, LoaderCircle, MessageCircle, Mic, Paperclip, Pencil, Plus, Send, Trash2, Wifi, WifiOff, X } from "lucide-react";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";
import { selectToken, selectUser } from "@/redux/features/auth/authSlice";

type ChatMessage = { id?: number; role: "user" | "assistant" | "system"; content: string; created_at?: string };
type ChatSession = { id: number; title: string; messages: ChatMessage[]; message_count: number; updated_at: string };
type SocketEvent = { type?: string; message?: string; status?: boolean; data?: ChatMessage | { content?: string; role?: ChatMessage["role"] } };

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://talkapi.sobhoy.com").replace(/\/api\/v1\/?$/, "");
const SESSIONS_URL = `${API_BASE}/api/v1/chat/sessions/`;
const WS_BASE = API_BASE.replace(/^http/, "ws");

function getErrorMessage(error: unknown) { return error instanceof Error ? error.message : "Something went wrong. Please try again."; }

async function getApiError(response: Response, fallback: string) {
    try {
        const payload = await response.json() as { detail?: string; message?: string; error?: string };
        return payload.detail || payload.message || payload.error || fallback;
    } catch {
        return fallback;
    }
}

export default function ParentHomePage() {
    const token = useAppSelector(selectToken);
    const user = useAppSelector(selectUser);
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [editingSessionId, setEditingSessionId] = useState<number | null>(null);
    const [sessionTitle, setSessionTitle] = useState("");
    const [updatingSessionId, setUpdatingSessionId] = useState<number | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [connection, setConnection] = useState<"connecting" | "connected" | "disconnected">("disconnected");
    const [error, setError] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);
    const activeSessionIdRef = useRef<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const updateSession = useCallback((sessionId: number, update: (session: ChatSession) => ChatSession) => {
        setSessions((current) => current.map((session) => session.id === sessionId ? update(session) : session));
        setActiveSession((current) => current?.id === sessionId ? update(current) : current);
    }, []);

    const connectToSession = useCallback((session: ChatSession) => {
        if (!token) return;
        socketRef.current?.close();
        activeSessionIdRef.current = session.id;
        setActiveSession(session);
        setConnection("connecting");
        setError(null);
        const socket = new WebSocket(`${WS_BASE}/ws/chat/${session.id}/?token=${encodeURIComponent(token)}`);
        socketRef.current = socket;
        socket.onopen = () => setConnection("connecting");
        socket.onclose = () => { if (activeSessionIdRef.current === session.id) setConnection("disconnected"); };
        socket.onerror = () => setError("The chat connection failed. Please select the session again.");
        socket.onmessage = (event) => {
            try {
                const payload = JSON.parse(event.data) as SocketEvent;
                if (payload.type === "ready") { setConnection("connected"); return; }
                if (payload.type === "typing") { setIsTyping(Boolean(payload.status)); return; }
                if (payload.type === "error") { setError(payload.message || "Unable to generate a response right now."); setIsSending(false); return; }
                if (payload.type !== "message") return;
                const data = payload.data;
                const incoming: ChatMessage = { role: data && "role" in data && data.role ? data.role : "assistant", content: data && "content" in data && data.content ? data.content : payload.message || "" };
                if (!incoming.content) return;
                if (incoming.role === "user") {
                    return;
                }
                updateSession(session.id, (current) => ({ ...current, messages: [...current.messages, incoming], message_count: current.message_count + 1, updated_at: new Date().toISOString() }));
                setIsSending(false);
                setIsTyping(false);
            } catch { setError("Received an unreadable response from the chat service."); setIsSending(false); }
        };
    }, [token, updateSession]);

    const createSession = useCallback(async () => {
        if (!token) return;
        setIsCreating(true);
        setError(null);
        try {
            const response = await fetch(SESSIONS_URL, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ title: "New conversation" }) });
            if (!response.ok) throw new Error(await getApiError(response, `Unable to create a chat session (${response.status}).`));
            const created = await response.json() as { id: number; title: string };
            const session: ChatSession = { ...created, messages: [], message_count: 0, updated_at: new Date().toISOString() };
            setSessions((current) => [session, ...current]);
            connectToSession(session);
        } catch (requestError) { setError(getErrorMessage(requestError)); }
        finally { setIsCreating(false); }
    }, [token, connectToSession]);

    const fetchSessions = useCallback(async () => {
        if (!token) return [];
        const response = await fetch(SESSIONS_URL, { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) throw new Error(await getApiError(response, `Unable to load your conversations (${response.status}).`));
        return await response.json() as ChatSession[];
    }, [token]);

    const renameSession = async (session: ChatSession) => {
        const title = sessionTitle.trim();
        if (!title || title === session.title || !token) {
            setEditingSessionId(null);
            return;
        }
        setUpdatingSessionId(session.id);
        try {
            const response = await fetch(`${SESSIONS_URL}${session.id}/`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ title }),
            });
            if (!response.ok) throw new Error(await getApiError(response, `Unable to rename the conversation (${response.status}).`));
            const updated = await response.json() as ChatSession;
            setSessions((current) => current.map((item) => item.id === session.id ? { ...item, ...updated } : item));
            setActiveSession((current) => current?.id === session.id ? { ...current, ...updated } : current);
            setEditingSessionId(null);
            toast.success("Conversation renamed successfully.");
        } catch (requestError) {
            setError(getErrorMessage(requestError));
        } finally {
            setUpdatingSessionId(null);
        }
    };

    const deleteSession = async (session: ChatSession) => {
        if (!token || updatingSessionId !== null) return;
        setUpdatingSessionId(session.id);
        try {
            const response = await fetch(`${SESSIONS_URL}${session.id}/`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
            if (!response.ok) throw new Error(await getApiError(response, `Unable to delete the conversation (${response.status}).`));
            const remaining = await fetchSessions();
            setSessions(remaining);
            setEditingSessionId(null);
            toast.success("Conversation deleted successfully.");
            if (activeSession?.id === session.id) {
                socketRef.current?.close();
                if (remaining[0]) connectToSession(remaining[0]);
                else await createSession();
            }
        } catch (requestError) {
            setError(getErrorMessage(requestError));
        } finally {
            setUpdatingSessionId(null);
        }
    };

    useEffect(() => {
        if (!token) { setIsLoading(false); return; }
        let cancelled = false;
        const loadInitialSessions = async () => {
            try {
                const loaded = await fetchSessions();
                if (cancelled) return;
                setSessions(loaded);
                if (loaded[0]) connectToSession(loaded[0]); else await createSession();
            } catch (requestError) { if (!cancelled) setError(getErrorMessage(requestError)); }
            finally { if (!cancelled) setIsLoading(false); }
        };
        void loadInitialSessions();
        return () => { cancelled = true; socketRef.current?.close(); };
    }, [token, connectToSession, createSession, fetchSessions]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [activeSession?.messages.length, isTyping]);

    const sendMessage = (event?: FormEvent) => {
        event?.preventDefault();
        const content = message.trim();
        if (!content || !activeSession || !socketRef.current || connection !== "connected" || isSending) return;
        updateSession(activeSession.id, (current) => ({ ...current, messages: [...current.messages, { role: "user", content }], message_count: current.message_count + 1 }));
        socketRef.current.send(JSON.stringify({ type: "message", message: content }));
        setMessage("");
        setIsSending(true);
        setError(null);
    };

    const currentMessages = activeSession?.messages || [];
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

    return (
        <div className="relative flex min-h-[calc(100vh-60px)] flex-col overflow-hidden bg-[#0f172a] text-white" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
            <div className="pointer-events-none absolute left-1/2 top-1/4 h-100 w-150 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(16,185,129,0.05)_0%,transparent_70%)]" />
            <div className="relative z-10 flex min-h-0 flex-1">
                <aside className="hidden w-64 shrink-0 border-r border-[#1e2d3e] bg-[#111c2b]/80 p-4 md:flex md:flex-col">
                    <div className="mb-4 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4ade80]">Conversations</p><p className="mt-1 text-xs text-[#6b7a8d]">{sessions.length} session{sessions.length === 1 ? "" : "s"}</p></div><button onClick={() => void createSession()} disabled={isCreating || !token} title="New conversation" className="rounded-lg p-2 text-[#8b9ab0] transition hover:bg-[#1b4648] hover:text-white disabled:opacity-50">{isCreating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}</button></div>
                    <div className="min-h-0 flex-1 space-y-1 overflow-y-auto">{sessions.map((session) => <div key={session.id} className={`group flex items-center rounded-xl transition ${activeSession?.id === session.id ? "bg-[#1b4648]" : "hover:bg-white/5"}`}>
                        {editingSessionId === session.id ? <form onSubmit={(event) => { event.preventDefault(); void renameSession(session); }} className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2">
                            <input autoFocus value={sessionTitle} onChange={(event) => setSessionTitle(event.target.value)} className="min-w-0 flex-1 rounded-md border border-white/10 bg-white/10 px-2 py-1 text-sm text-white outline-none focus:border-emerald-400/60" />
                            <button type="submit" disabled={updatingSessionId === session.id} title="Save conversation name" className="rounded p-1 text-[#4ade80] hover:bg-white/10 disabled:opacity-50"><Check className="h-4 w-4" /></button>
                            <button type="button" onClick={() => setEditingSessionId(null)} title="Cancel rename" className="rounded p-1 text-[#8b9ab0] hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button>
                        </form> : <>
                            <button onClick={() => connectToSession(session)} className="min-w-0 flex-1 px-3 py-3 text-left"><div className="flex items-center gap-2"><MessageCircle className="h-4 w-4 shrink-0 text-[#4ade80]" /><span className="truncate text-sm font-medium text-[#d8e2ec]">{session.title || "New conversation"}</span></div><p className="mt-1 pl-6 text-[11px] text-[#6b7a8d]">{session.message_count} message{session.message_count === 1 ? "" : "s"}</p></button>
                            <div className="mr-2 hidden items-center gap-1 group-hover:flex"><button onClick={() => { setEditingSessionId(session.id); setSessionTitle(session.title || ""); }} title="Rename conversation" className="rounded p-1.5 text-[#8b9ab0] hover:bg-white/10 hover:text-white"><Pencil className="h-3.5 w-3.5" /></button><button onClick={() => void deleteSession(session)} disabled={updatingSessionId === session.id} title="Delete conversation" className="rounded p-1.5 text-[#8b9ab0] hover:bg-red-500/20 hover:text-red-300 disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" /></button></div>
                        </>}
                    </div>)}</div>
                    <div className="mt-4 border-t border-[#1e2d3e] pt-3 text-xs text-[#6b7a8d]">Chatting as {user?.full_name || "parent"}</div>
                </aside>
                <section className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-center px-5 pt-5 md:px-8"><div className="flex items-center gap-2 text-xs text-[#8b9ab0]">{connection === "connected" ? <Wifi className="h-4 w-4 text-[#4ade80]" /> : connection === "connecting" ? <LoaderCircle className="h-4 w-4 animate-spin text-amber-400" /> : <WifiOff className="h-4 w-4 text-[#8b9ab0]" />}<span>{connection === "connected" ? "Connected" : connection === "connecting" ? "Connecting..." : "Disconnected"}</span></div></div>
                    <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-8 md:px-8">{isLoading ? <div className="flex h-full items-center justify-center text-[#8b9ab0]"><LoaderCircle className="mr-2 h-5 w-5 animate-spin" />Loading conversations...</div> : currentMessages.length === 0 ? <div className="flex h-full flex-col items-center justify-center pb-16 text-center"><h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{greeting}, {user?.full_name?.split(" ")[0] || "there"}</h1><p className="mt-2 text-sm text-[#4ade80]">How can we help you and your child today?</p></div> : <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">{currentMessages.map((item, index) => <div key={`${item.id || "local"}-${index}`} className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${item.role === "user" ? "rounded-br-md bg-emerald-600 text-white" : "rounded-bl-md border border-[#2d3f55] bg-[#1a2535] text-[#d8e2ec]"}`}>{item.content}</div></div>)}{isTyping && <div className="flex items-center gap-2 text-xs text-[#8b9ab0]"><span className="h-2 w-2 animate-pulse rounded-full bg-[#4ade80]" />Thinking...</div>}<div ref={messagesEndRef} /></div>}</div>
                    <div className="px-5 pb-5 pt-3 md:px-8">{error && <div className="mx-auto mb-3 flex max-w-3xl items-center justify-between rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200"><span>{error}</span><button onClick={() => setError(null)} title="Dismiss error"><X className="h-4 w-4" /></button></div>}<form onSubmit={sendMessage} className="mx-auto flex max-w-3xl items-center gap-2 rounded-full border border-white/10 bg-white/5 p-2 pl-3 backdrop-blur-xl focus-within:border-emerald-400/40"><button type="button" title="Attach a file" className="rounded-full p-2 text-white/40 transition hover:bg-white/10 hover:text-white/80"><Paperclip className="h-4 w-4" /></button><input value={message} onChange={(event) => setMessage(event.target.value)} disabled={!activeSession || connection !== "connected" || isSending} placeholder={activeSession ? "Message..." : "Select a conversation..."} className="min-w-0 flex-1 bg-transparent text-sm text-[#c5d1de] outline-none placeholder:text-white/30 disabled:cursor-not-allowed" /><button type="submit" disabled={!message.trim() || !activeSession || connection !== "connected" || isSending} title="Send message" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 transition hover:bg-emerald-500 disabled:cursor-default disabled:bg-white/10"><Send className="h-4 w-4" /></button><button type="button" onClick={() => setIsRecording((value) => !value)} title={isRecording ? "Stop recording" : "Start recording"} className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${isRecording ? "bg-red-600" : "bg-white/10 hover:bg-white/20"}`}><Mic className="h-4 w-4" /></button></form></div>
                </section>
            </div>
        </div>
    );
}
