"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type VoiceCallStatus = "idle" | "connecting" | "connected" | "closed" | "error";

interface UseVoiceCallOptions {
    wsUrl: string | null;
    onError?: (message: string) => void;
}

interface UseVoiceCallReturn {
    status: VoiceCallStatus;
    isRecording: boolean;
    isMuted: boolean;
    toggleMute: () => void;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    disconnect: () => void;
}

const SAMPLE_RATE = 16000;
const PLAYBACK_LATENCY_OFFSET = 0.15; // absorbs network jitter, avoids choppy playback

export function useVoiceCall({ wsUrl, onError }: UseVoiceCallOptions): UseVoiceCallReturn {
    const [status, setStatus] = useState<VoiceCallStatus>("idle");
    const [isRecording, setIsRecording] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const isMutedRef = useRef(false);

    const toggleMute = useCallback(() => {
        isMutedRef.current = !isMutedRef.current;
        setIsMuted(isMutedRef.current);
    }, []);

    const socketRef = useRef<WebSocket | null>(null);

    // Guards against React 18 Strict Mode's dev-only double-invoke of this effect.
    // Without this, the first (throwaway) mount opens a WebSocket to the
    // one-time-use ws_url, gets torn down on the immediate cleanup, and poisons
    // the room server-side before the "real" second mount can connect.
    const effectRanRef = useRef(false);

    // Playback
    const playbackCtxRef = useRef<AudioContext | null>(null);
    const nextStartTimeRef = useRef(0);

    // Recording
    const recordingCtxRef = useRef<AudioContext | null>(null);
    const recorderNodeRef = useRef<ScriptProcessorNode | null>(null);
    const recordingSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const recordingStreamRef = useRef<MediaStream | null>(null);

    const getPlaybackContext = useCallback(() => {
        if (!playbackCtxRef.current) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            playbackCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
                sampleRate: SAMPLE_RATE,
            });
        }
        if (playbackCtxRef.current.state === "suspended") {
            playbackCtxRef.current.resume();
        }
        return playbackCtxRef.current;
    }, []);

    const hasAudioHeader = (buffer: ArrayBuffer) => {
        if (buffer.byteLength < 4) return false;
        const view = new DataView(buffer);
        const magic = view.getUint32(0, false);
        if (magic === 0x52494646) return true; // RIFF/WAV
        if (magic >>> 8 === 0x494433) return true; // ID3/MP3
        if (magic === 0x4f676753) return true; // OGG
        if (magic === 0x1a45dfa3) return true; // WebM/EBML
        return false;
    };

    const playAudioBuffer = useCallback(
        (audioBuffer: AudioBuffer) => {
            const ctx = getPlaybackContext();
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);

            const currentTime = ctx.currentTime;
            if (nextStartTimeRef.current < currentTime + PLAYBACK_LATENCY_OFFSET) {
                nextStartTimeRef.current = currentTime + PLAYBACK_LATENCY_OFFSET;
            }
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
        },
        [getPlaybackContext]
    );

    const playRawPCM = useCallback(
        (buffer: ArrayBuffer) => {
            const ctx = getPlaybackContext();
            const validLength = Math.floor(buffer.byteLength / 2) * 2;
            const int16 = new Int16Array(buffer, 0, validLength / 2);
            const float32 = new Float32Array(int16.length);
            for (let i = 0; i < int16.length; i++) {
                float32[i] = int16[i] / 32768;
            }
            const audioBuffer = ctx.createBuffer(1, float32.length, SAMPLE_RATE);
            audioBuffer.copyToChannel(float32, 0);
            playAudioBuffer(audioBuffer);
        },
        [getPlaybackContext, playAudioBuffer]
    );

    const playReceivedAudio = useCallback(
        async (blob: Blob) => {
            try {
                const buffer = await blob.arrayBuffer();
                if (hasAudioHeader(buffer)) {
                    const ctx = getPlaybackContext();
                    try {
                        const audioBuffer = await ctx.decodeAudioData(buffer.slice(0));
                        playAudioBuffer(audioBuffer);
                    } catch {
                        // malformed chunk, skip
                    }
                } else {
                    playRawPCM(buffer);
                }
            } catch (err) {
                console.error("Failed to play received audio", err);
            }
        },
        [getPlaybackContext, playAudioBuffer, playRawPCM]
    );

    const disconnect = useCallback(() => {
        socketRef.current?.close();
        socketRef.current = null;
        setStatus("closed");
    }, []);

    const stopRecording = useCallback(() => {
        recorderNodeRef.current?.disconnect();
        recorderNodeRef.current = null;

        recordingSourceRef.current?.disconnect();
        recordingSourceRef.current = null;

        recordingCtxRef.current?.close();
        recordingCtxRef.current = null;

        recordingStreamRef.current?.getTracks().forEach((track) => track.stop());
        recordingStreamRef.current = null;

        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ type: "end" }));
        }

        setIsRecording(false);
    }, []);

    const startRecording = useCallback(async () => {
        if (!navigator.mediaDevices?.getUserMedia) {
            onError?.(
                "Microphone access requires a secure context (HTTPS or localhost)."
            );
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: SAMPLE_RATE,
                    echoCancellation: true,
                    noiseSuppression: true,
                },
            });
            recordingStreamRef.current = stream;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({
                sampleRate: SAMPLE_RATE,
            });
            recordingCtxRef.current = ctx;

            const source = ctx.createMediaStreamSource(stream);
            recordingSourceRef.current = source;

            const processor = ctx.createScriptProcessor(4096, 1, 1);
            recorderNodeRef.current = processor;

            processor.onaudioprocess = (e) => {
                if (socketRef.current?.readyState !== WebSocket.OPEN) return;
                if (isMutedRef.current) return;

                const input = e.inputBuffer.getChannelData(0);
                const pcm = new Int16Array(input.length);
                for (let i = 0; i < input.length; i++) {
                    const s = Math.max(-1, Math.min(1, input[i]));
                    pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
                }
                socketRef.current.send(pcm.buffer);
            };

            source.connect(processor);
            processor.connect(ctx.destination);

            setIsRecording(true);
        } catch (err) {
            console.error(err);
            onError?.("Couldn't access the microphone. Please check permissions.");
        }
    }, [onError]);

    useEffect(() => {
        if (!wsUrl) return;

        // React Strict Mode (dev only) invokes this effect twice: mount -> cleanup -> mount.
        // On the first (throwaway) run, mark the guard and do nothing else —
        // crucially, do NOT return a cleanup function here, so the flag is never reset.
        // The second, real run will see the flag already set and proceed to connect.
        if (process.env.NODE_ENV === "development" && !effectRanRef.current) {
            effectRanRef.current = true;
            return;
        }

        setStatus("connecting");
        const socket = new WebSocket(wsUrl);
        socket.binaryType = "blob";
        socketRef.current = socket;

        socket.onopen = () => {
            setStatus("connected");
            getPlaybackContext();
        };

        socket.onclose = (event) => {
            console.log("WebSocket closed:", event.code, event.reason);
            setStatus("closed");
        };

        socket.onerror = () => {
            setStatus("error");
            onError?.("Connection error. Please try again.");
        };

        socket.onmessage = async (event) => {
            if (event.data instanceof Blob) {
                await playReceivedAudio(event.data);
            }
        };

        return () => {
            stopRecording();
            socket.close();
            playbackCtxRef.current?.close();
            playbackCtxRef.current = null;
            socketRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wsUrl]);

    useEffect(() => {
        if (status === "connected" && !isRecording) {
            startRecording();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    return { status, isRecording, isMuted, toggleMute, startRecording, stopRecording, disconnect };
}