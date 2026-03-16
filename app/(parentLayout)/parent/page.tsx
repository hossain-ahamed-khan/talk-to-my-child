"use client";


import { useState, useMemo } from "react";

const JOBS = [
    { id: 1, title: "Software Engineer", company: "Google", initial: "G", color: "#4f63e7", location: "Remote", ago: "2 days ago", type: "Remote", min: 120, max: 160, featured: true, new: false },
    { id: 2, title: "Product Manager", company: "Meta", initial: "M", color: "#e8457a", location: "New York, NY", ago: "1 day ago", type: "Full-time", min: 130, max: 170, featured: true, new: true },
    { id: 3, title: "UX Designer", company: "Apple", initial: "A", color: "#1a1a2e", location: "San Francisco, CA", ago: "3 hours ago", type: "Full-time", min: 110, max: 150, featured: true, new: true },
    { id: 4, title: "Data Scientist", company: "Netflix", initial: "N", color: "#e50914", location: "Remote", ago: "5 hours ago", type: "Remote", min: 140, max: 190, featured: true, new: false },
    { id: 5, title: "Backend Engineer", company: "Stripe", initial: "S", color: "#635bff", location: "Austin, TX", ago: "1 day ago", type: "Full-time", min: 125, max: 165, featured: false, new: false },
    { id: 6, title: "Frontend Developer", company: "Airbnb", initial: "A", color: "#ff5a5f", location: "Remote", ago: "2 days ago", type: "Remote", min: 100, max: 140, featured: false, new: false },
    { id: 7, title: "DevOps Engineer", company: "AWS", initial: "A", color: "#ff9900", location: "Seattle, WA", ago: "4 hours ago", type: "Full-time", min: 130, max: 175, featured: false, new: true },
    { id: 8, title: "Product Designer", company: "Figma", initial: "F", color: "#0acf83", location: "San Francisco, CA", ago: "6 hours ago", type: "Full-time", min: 115, max: 155, featured: false, new: false },
    { id: 9, title: "ML Engineer", company: "OpenAI", initial: "O", color: "#10a37f", location: "Remote", ago: "1 day ago", type: "Remote", min: 160, max: 220, featured: false, new: true },
    { id: 10, title: "Marketing Intern", company: "Spotify", initial: "S", color: "#1db954", location: "New York, NY", ago: "3 days ago", type: "Internship", min: 25, max: 35, featured: false, new: false },
    { id: 11, title: "Part-time Writer", company: "Medium", initial: "M", color: "#292929", location: "Remote", ago: "2 days ago", type: "Part-time", min: 40, max: 65, featured: false, new: false },
    { id: 12, title: "iOS Developer", company: "Twitter", initial: "T", color: "#1da1f2", location: "San Francisco, CA", ago: "5 days ago", type: "Full-time", min: 120, max: 160, featured: false, new: false },
];

const FILTERS = ["All Jobs", "Full-time", "Part-time", "Remote", "Internship"];

const typeStyle = {
    Remote: { bg: "#ecfdf5", color: "#15803d", border: "#bbf7d0" },
    "Full-time": { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
    "Part-time": { bg: "#fefce8", color: "#a16207", border: "#fde68a" },
    Internship: { bg: "#f5f3ff", color: "#6d28d9", border: "#ddd6fe" },
};

function JobCard({ job, onBookmark }: { job: typeof JOBS[0]; onBookmark: (id: number) => void }) {
    const [bookmarked, setBookmarked] = useState(false);
    const ts = typeStyle[job.type as keyof typeof typeStyle] || typeStyle["Full-time"];
    const salary = job.min < 100 ? `$${job.min}–$${job.max}/hr` : `$${job.min}k – $${job.max}k`;

    return (
        <div style={{
            background: "#fff",
            borderRadius: 18,
            border: "1px solid #eef0f6",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            cursor: "pointer",
            transition: "box-shadow 0.2s, transform 0.2s",
            position: "relative",
        }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(79,99,231,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
            {job.new && (
                <span style={{ position: "absolute", top: 14, right: 42, fontSize: 10, fontWeight: 700, background: "#fef9c3", color: "#a16207", padding: "2px 8px", borderRadius: 99 }}>NEW</span>
            )}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: job.color, color: "#fff", fontWeight: 800, fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {job.initial}
                    </div>
                    <div>
                        <div style={{ fontWeight: 650, fontSize: 14, color: "#111827", lineHeight: 1.3 }}>{job.title}</div>
                        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>⊞ {job.company}</div>
                    </div>
                </div>
                <button onClick={e => { e.stopPropagation(); setBookmarked(b => !b); onBookmark(job.id); }}
                    style={{ background: bookmarked ? "#eff2ff" : "transparent", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, color: bookmarked ? "#4f63e7" : "#d1d5db", transition: "all 0.15s" }}>
                    <svg width="16" height="16" fill={bookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                    </svg>
                </button>
            </div>

            <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#6b7280" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    {job.location}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                    {job.ago}
                </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, background: ts.bg, color: ts.color, border: `1px solid ${ts.border}`, padding: "3px 10px", borderRadius: 99 }}>{job.type}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{salary}</span>
                </div>
                <button style={{ background: "#4f63e7", color: "#fff", border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#3b50d6"}
                    onMouseLeave={e => e.currentTarget.style.background = "#4f63e7"}>
                    Apply Now
                </button>
            </div>
        </div>
    );
}

function SectionHeader({ title, count }: any) {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 750, color: "#111827" }}>{title}</h2>
            <button style={{ background: "none", border: "none", color: "#4f63e7", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>View all</button>
        </div>
    );
}

export default function JobBoard() {
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [filter, setFilter] = useState("All Jobs");
    const [bookmarks, setBookmarks] = useState(new Set());
    const [searched, setSearched] = useState(false);

    const toggleBookmark = (id: any) => setBookmarks(b => { const n = new Set(b); n.has(id) ? n.delete(id) : n.add(id); return n; });

    const filtered = useMemo(() => JOBS.filter(j => {
        const byType = filter === "All Jobs" || j.type === filter;
        const bySearch = !searched || !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase());
        const byLoc = !searched || !location || j.location.toLowerCase().includes(location.toLowerCase());
        return byType && bySearch && byLoc;
    }), [filter, search, location, searched]);

    const featured = filtered.filter(j => j.featured);
    const recent = JOBS.slice(0, 4);

    return (
        <div style={{ minHeight: "100vh", background: "#F9FAFB", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

            <div className="text-[#5c4e4e] bg-[#F9FAFB] px-8">
                <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && setSearched(true)}
                    placeholder="Search Job title, keywords, or company"
                    style={{ width: "80%", marginTop: 20, paddingLeft: 42, paddingRight: 16, paddingTop: 18, paddingBottom: 18, borderRadius: 13, border: "none", fontSize: 14, background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }} />
            </div>
            <main style={{ margin: "0 auto", padding: "24px 24px 48px" }}>
                {/* Hero */}
                <div style={{ borderRadius: 22, background: "linear-gradient(135deg, #3b4fd8 0%, #4f63e7 55%, #6b5ce7 100%)", padding: "48px 48px 44px", position: "relative", overflow: "hidden", marginBottom: 24 }}>
                    <div style={{ position: "absolute", top: -40, right: -40, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                    <div style={{ position: "absolute", top: 30, right: 100, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                    <div style={{ position: "absolute", bottom: -20, right: 0, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                    <h1 className="hero-title" style={{ fontFamily: "Sora, sans-serif", fontSize: 36, fontWeight: 800, color: "#fff", margin: "0 0 8px", lineHeight: 1.2 }}>Find Your Dream Job</h1>
                    <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, margin: "0 0 28px" }}>Discover opportunities that match your skills and aspirations</p>
                    <div className="hero-inputs" style={{ display: "flex", gap: 12 }}>
                        <div style={{ flex: 1, position: "relative" }}>
                            <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                            <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && setSearched(true)}
                                placeholder="Job title, keywords, or company"
                                style={{ width: "100%", paddingLeft: 42, paddingRight: 16, paddingTop: 14, paddingBottom: 14, borderRadius: 13, border: "none", fontSize: 14, color: "#111827", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }} />
                        </div>
                        <div style={{ flex: 1, position: "relative" }}>
                            <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                            <input value={location} onChange={e => setLocation(e.target.value)} onKeyDown={e => e.key === "Enter" && setSearched(true)}
                                placeholder="City, state, or remote"
                                style={{ width: "100%", paddingLeft: 42, paddingRight: 16, paddingTop: 14, paddingBottom: 14, borderRadius: 13, border: "none", fontSize: 14, color: "#111827", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }} />
                        </div>
                        <button onClick={() => setSearched(true)}
                            style={{ background: "#fff", color: "#4f63e7", border: "none", borderRadius: 13, padding: "14px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                            Search Jobs
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="stats-bar" style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 14, color: "#4b5563", marginBottom: 20 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
                        <strong style={{ color: "#111827" }}>2,847</strong> jobs available today
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
                        <strong style={{ color: "#111827" }}>156</strong> new this week
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                        Updated <strong style={{ color: "#111827" }}>5 min</strong> ago
                    </span>
                </div>

                {/* Filter tabs */}
                <div className="filter-scroll" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
                    {FILTERS.map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            style={{ padding: "8px 18px", borderRadius: 99, fontSize: 13, fontWeight: 600, border: filter === f ? "1px solid #4f63e7" : "1px solid #e5e7eb", background: filter === f ? "#4f63e7" : "#fff", color: filter === f ? "#fff" : "#374151", cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }}>
                            {f}
                        </button>
                    ))}
                    {(searched && (search || location)) && (
                        <button onClick={() => { setSearch(""); setLocation(""); setSearched(false); setFilter("All Jobs"); }}
                            style={{ padding: "8px 18px", borderRadius: 99, fontSize: 13, fontWeight: 600, border: "1px solid #fca5a5", background: "#fef2f2", color: "#dc2626", cursor: "pointer" }}>
                            ✕ Clear search
                        </button>
                    )}
                </div>

                {searched && (search || location) ? (
                    <section style={{ marginBottom: 40 }}>
                        <SectionHeader title={`Search Results (${filtered.length})`} />
                        {filtered.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "60px 0", color: "#6b7280" }}>
                                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                                <div style={{ fontWeight: 600, color: "#374151", marginBottom: 4 }}>No jobs found</div>
                                <div style={{ fontSize: 13 }}>Try different keywords or location</div>
                            </div>
                        ) : (
                            <div className="grid4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                                {filtered.map(j => <JobCard key={j.id} job={j} onBookmark={toggleBookmark} />)}
                            </div>
                        )}
                    </section>
                ) : (
                    <>
                        {/* Featured */}
                        <section style={{ marginBottom: 40 }}>
                            <SectionHeader title="Featured Jobs" />
                            <div className="grid4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                                {featured.map(j => <JobCard key={j.id} job={j} onBookmark={toggleBookmark} />)}
                            </div>
                        </section>

                        {/* Recently Viewed */}
                        <section style={{ marginBottom: 40 }}>
                            <SectionHeader title="Recently Viewed" />
                            <div className="grid4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                                {recent.map(j => <JobCard key={`rv-${j.id}`} job={j} onBookmark={toggleBookmark} />)}
                            </div>
                        </section>

                        {/* All Jobs */}
                        {filter !== "All Jobs" && (
                            <section style={{ marginBottom: 40 }}>
                                <SectionHeader title={`${filter} Jobs (${filtered.length})`} />
                                {filtered.length === 0 ? (
                                    <div style={{ textAlign: "center", padding: "60px 0", color: "#6b7280" }}>
                                        <div style={{ fontSize: 40, marginBottom: 12 }}>🗂️</div>
                                        <div style={{ fontWeight: 600, color: "#374151" }}>No {filter} jobs found</div>
                                    </div>
                                ) : (
                                    <div className="grid4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                                        {filtered.map(j => <JobCard key={`f-${j.id}`} job={j} onBookmark={toggleBookmark} />)}
                                    </div>
                                )}
                            </section>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}