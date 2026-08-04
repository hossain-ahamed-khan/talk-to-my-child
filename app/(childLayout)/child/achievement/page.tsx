"use client";
import { CharacterProgress, useGetAcheivementsQuery } from "@/redux/features/childSection/achivementApi";
import { Sparkles, BookOpen, Rocket, Palette, Music2, Heart, Loader2, AlertCircle } from "lucide-react";

const PRIMARY = "#10996f";

const ICONS = [Sparkles, BookOpen, Rocket, Palette, Music2, Heart];

const PALETTE = [
    { ring: "#f3aa17", iconBg: "#d9910a" },
    { ring: "#97a9bf", iconBg: "#7f93ad" },
    { ring: "#d27416", iconBg: "#b55c0b" },
    { ring: "#10996f", iconBg: "#0d7f5c" },
    { ring: "#8b7ed8", iconBg: "#6f5fc4" },
    { ring: "#d8708b", iconBg: "#c4557a" },
];

function CircularProgress({
    progress,
    ringColor,
    iconBg,
    Icon,
}: {
    progress: number;
    ringColor: string;
    iconBg: string;
    Icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
    const r = 42;
    const circ = 2 * Math.PI * r;
    const offset = circ - (progress / 100) * circ;

    return (
        <div className="relative flex h-[92px] w-[92px] items-center justify-center">
            <svg width="92" height="92" viewBox="0 0 92 92" className="absolute">
                <circle cx="46" cy="46" r={r} fill="none" stroke={`${ringColor}30`} strokeWidth="5" />
                {progress > 0 && (
                    <circle
                        cx="46"
                        cy="46"
                        r={r}
                        fill="none"
                        stroke={ringColor}
                        strokeWidth="5"
                        strokeDasharray={circ}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        transform="rotate(-90 46 46)"
                        className="transition-[stroke-dashoffset] duration-500"
                    />
                )}
            </svg>
            <div
                className="z-10 flex h-[54px] w-[54px] items-center justify-center rounded-full"
                style={{ backgroundColor: iconBg }}
            >
                <Icon size={26} className="text-white" />
            </div>
        </div>
    );
}

function CharacterCard({ item, index }: { item: CharacterProgress; index: number }) {
    const pct = Math.min((item.message_count / item.target) * 100, 100);
    const completed = pct >= 100;
    const { ring, iconBg } = PALETTE[index % PALETTE.length];
    const Icon = ICONS[index % ICONS.length];

    return (
        <div className="flex w-full min-w-0 flex-col items-center gap-3.5 rounded-2xl border border-[#1b3151] bg-[#0b1b34] px-4 pb-4 pt-5 transition-colors hover:border-[#2a456b] sm:px-6">
            <CircularProgress progress={pct} ringColor={ring} iconBg={iconBg} Icon={Icon} />
            <div className="text-center">
                <p className="mb-1 text-sm font-bold text-slate-200">
                    {item.character_name}
                </p>
                <p
                    className="text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: completed ? "#f3aa17" : "#6f85a3" }}
                >
                    {item.message_count}/{item.target} Messages
                </p>
                <p className="mt-1 truncate text-[10px] text-slate-500">
                    {item.character_category}
                </p>
            </div>
        </div>
    );
}

export default function UsageMilestones() {
    const { data, isLoading, isError, isFetching } = useGetAcheivementsQuery();

    const characters = data?.data ?? [];
    const childName = characters[0]?.child_name;
    const totalMessages = characters.reduce((sum, c) => sum + c.message_count, 0);
    const totalTarget = characters.reduce((sum, c) => sum + c.target, 0);
    const overallPct = totalTarget > 0 ? Math.min((totalMessages / totalTarget) * 100, 100) : 0;
    const completedCount = characters.filter((c) => c.message_count >= c.target).length;

    return (
        <div className="min-h-screen w-full bg-[#0d1526] p-4 sm:p-7">
            <div className="w-full">
                {/* Header */}
                <div className="mb-3 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                        <p
                            className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em]"
                            style={{ color: PRIMARY }}
                        >
                            Weekly Reset
                        </p>
                        <h1 className="text-[22px] font-extrabold leading-tight text-white sm:text-[25px]">
                            Usage Milestones{childName ? ` — ${childName}` : ""}
                        </h1>
                    </div>
                    <div className="text-left sm:text-right">
                        <p className="text-sm font-semibold text-white">
                            Messages:{" "}
                            <span style={{ color: PRIMARY }}>
                                {totalMessages}/{totalTarget}
                            </span>
                        </p>
                        <p className="mt-0.5 text-xs text-slate-600">
                            {characters.length} character{characters.length === 1 ? "" : "s"}
                        </p>
                    </div>
                </div>

                {/* Overall progress bar */}
                <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-[#0d7f5c] to-[#10996f] transition-all duration-500"
                        style={{ width: `${overallPct}%` }}
                    />
                </div>

                {/* Loading state */}
                {isLoading && (
                    <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#1b3151] bg-[#0b1b34] py-16 text-slate-400">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="text-sm">Loading progress…</span>
                    </div>
                )}

                {/* Error state */}
                {isError && !isLoading && (
                    <div className="flex items-center gap-2 rounded-2xl border border-red-900/50 bg-red-950/30 px-5 py-4 text-red-400">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span className="text-sm">Failed to load usage milestones. Please try again.</span>
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && !isError && characters.length === 0 && (
                    <div className="rounded-2xl border border-[#1b3151] bg-[#0b1b34] py-16 text-center text-sm text-slate-500">
                        No conversations yet.
                    </div>
                )}

                {/* Content */}
                {!isLoading && !isError && characters.length > 0 && (
                    <>
                        {/* Streak banner */}
                        <div className="mb-9 flex items-center gap-3 rounded-[14px] border border-[#10996f]/30 bg-[#0f1e33] px-4.5 py-3.5">
                            <Sparkles size={18} className="shrink-0 fill-yellow-400 text-yellow-400" />
                            <p className="text-[13px] leading-relaxed text-slate-400">
                                <strong className="font-bold text-white">{completedCount}</strong> of{" "}
                                <strong className="font-bold text-white">{characters.length}</strong> conversations
                                have reached their target. Keep going!
                            </p>
                        </div>

                        {/* Section labels */}
                        <div className="mb-3.5 flex items-center justify-between">
                            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#6f85a3]">
                                Character Conversations
                            </p>
                            {isFetching && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-600" />}
                        </div>

                        {/* Cards grid */}
                        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {characters.map((item, i) => (
                                <CharacterCard key={`${item.child_id}-${item.character_name}-${i}`} item={item} index={i} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}