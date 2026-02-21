import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GiMedicines, GiPill, GiHeartBeats, GiDrop } from "react-icons/gi";
import { FiSearch, FiArrowRight, FiGrid } from "react-icons/fi";

/* ════════════════════════════════════════
   ✏️  COLUMN CONFIG — change these anytime
   ════════════════════════════════════════ */
const COLS_MOBILE = 3;   // columns on phones  (<640px)
const COLS_TABLET = 4;   // columns on tablets (640–1024px)
const COLS_DESKTOP = 5;   // columns on desktop (>1024px)
/* ════════════════════════════════════════ */

const FALLBACK_ICONS = [GiMedicines, GiPill, GiHeartBeats, GiDrop];

const CARD_PALETTES = [
    { bg: "#fef9f0", accent: "#f59e0b", light: "#fef3c7" },
    { bg: "#f0fdf4", accent: "#22c55e", light: "#dcfce7" },
    { bg: "#fff1f2", accent: "#f43f5e", light: "#ffe4e6" },
    { bg: "#eff6ff", accent: "#3b82f6", light: "#dbeafe" },
    { bg: "#fdf4ff", accent: "#a855f7", light: "#f3e8ff" },
    { bg: "#fff7ed", accent: "#f97316", light: "#ffedd5" },
    { bg: "#f0fdfa", accent: "#14b8a6", light: "#ccfbf1" },
    { bg: "#fefce8", accent: "#eab308", light: "#fef9c3" },
];

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const cached = sessionStorage.getItem("categories");
        if (cached) {
            setCategories(JSON.parse(cached));
            setLoading(false);
            setTimeout(() => setVisible(true), 50);
            return;
        }
        const fetchCategories = async () => {
            try {
                const res = await fetch("https://no-wheels-1.onrender.com/user/category");
                const data = await res.json();
                if (res.ok) {
                    setCategories(data.categories || []);
                    sessionStorage.setItem("categories", JSON.stringify(data.categories));
                }
            } catch (err) {
                console.log("Category fetch failed", err);
            } finally {
                setLoading(false);
                setTimeout(() => setVisible(true), 50);
            }
        };
        fetchCategories();
    }, []);

    const filtered = categories.filter((cat) =>
        cat.category_name.toLowerCase().includes(filter.toLowerCase())
    );

    const gridStyle = {
        display: "grid",
        gridTemplateColumns: `repeat(${COLS_MOBILE}, 1fr)`,
        gap: "12px",
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #fffbf0 0%, #fdf6e3 50%, #fff9f0 100%)",
            fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
        }}>
            {/* ── Responsive grid injection ── */}
            <style>{`
                @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
                .cat-grid {
                    display: grid;
                    grid-template-columns: repeat(${COLS_MOBILE}, 1fr);
                    gap: 12px;
                }
                @media (min-width: 640px) {
                    .cat-grid { grid-template-columns: repeat(${COLS_TABLET}, 1fr); gap: 14px; }
                }
                @media (min-width: 1024px) {
                    .cat-grid { grid-template-columns: repeat(${COLS_DESKTOP}, 1fr); gap: 16px; }
                }
            `}</style>

            {/* ── Hero ── */}
            <div style={{
                background: "linear-gradient(135deg, #1a1209 0%, #2d1f0e 60%, #3b2a12 100%)",
                padding: "2.5rem 1.5rem 3rem",
                position: "relative",
                overflow: "hidden",
            }}>
                <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(245,158,11,0.08)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: "-40px", left: "10%", width: "140px", height: "140px", borderRadius: "50%", background: "rgba(245,158,11,0.05)", pointerEvents: "none" }} />

                <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}>
                    {/* Breadcrumb */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.25rem" }}>
                        <span onClick={() => navigate("/")} style={{ color: "#f59e0b", fontSize: "13px", cursor: "pointer", opacity: 0.8 }}>Home</span>
                        <FiArrowRight style={{ color: "#f59e0b", opacity: 0.5, fontSize: "12px" }} />
                        <span style={{ color: "#f5f0e8", fontSize: "13px", opacity: 0.6 }}>Categories</span>
                    </div>

                    {/* Title */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "0.5rem" }}>
                        <div style={{ background: "rgba(245,158,11,0.15)", borderRadius: "10px", padding: "8px", border: "1px solid rgba(245,158,11,0.25)" }}>
                            <FiGrid style={{ color: "#f59e0b", fontSize: "20px" }} />
                        </div>
                        <h1 style={{ color: "#fef9f0", fontSize: "clamp(1.4rem, 4vw, 2.2rem)", fontWeight: "700", margin: 0, letterSpacing: "-0.02em" }}>
                            All Categories
                        </h1>
                    </div>
                    <p style={{ color: "rgba(245,240,232,0.5)", fontSize: "14px", margin: "0 0 1.75rem 0", lineHeight: 1.6 }}>
                        Browse our complete range of health &amp; wellness categories
                    </p>

                    {/* Search */}
                    <div style={{ position: "relative", maxWidth: "420px" }}>
                        <FiSearch style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#f59e0b", fontSize: "15px" }} />
                        <input
                            type="text"
                            placeholder="Filter categories..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            style={{
                                width: "100%", padding: "10px 16px 10px 40px",
                                borderRadius: "10px", border: "1px solid rgba(245,158,11,0.3)",
                                background: "rgba(255,255,255,0.07)", color: "#fef9f0",
                                fontSize: "14px", outline: "none", boxSizing: "border-box",
                                fontFamily: "inherit", backdropFilter: "blur(8px)",
                                transition: "border-color 0.2s",
                            }}
                            onFocus={e => e.target.style.borderColor = "rgba(245,158,11,0.7)"}
                            onBlur={e => e.target.style.borderColor = "rgba(245,158,11,0.3)"}
                        />
                    </div>
                </div>
            </div>

            {/* ── Main Content ── */}
            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "1.75rem 1rem 3rem" }}>

                {!loading && (
                    <p style={{ fontSize: "12px", color: "#9a8060", marginBottom: "1rem", fontStyle: "italic" }}>
                        Showing {filtered.length} of {categories.length} categories
                    </p>
                )}

                {/* Skeleton */}
                {loading && (
                    <div className="cat-grid">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} style={{
                                height: "130px", borderRadius: "12px",
                                background: "linear-gradient(90deg, #f0e8d8 0%, #faf5ec 50%, #f0e8d8 100%)",
                                backgroundSize: "200% 100%",
                                animation: "shimmer 1.4s infinite",
                            }} />
                        ))}
                    </div>
                )}

                {/* Cards */}
                {!loading && filtered.length > 0 && (
                    <div className="cat-grid">
                        {filtered.map((cat, idx) => {
                            const palette = CARD_PALETTES[idx % CARD_PALETTES.length];
                            const Icon = FALLBACK_ICONS[idx % FALLBACK_ICONS.length];
                            return (
                                <CategoryCard
                                    key={cat.category_id}
                                    cat={cat}
                                    idx={idx}
                                    palette={palette}
                                    Icon={Icon}
                                    visible={visible}
                                    onClick={() => navigate(`/category/${cat.category_id}/${cat.category_slug}`)}
                                />
                            );
                        })}
                    </div>
                )}

                {/* Empty */}
                {!loading && filtered.length === 0 && (
                    <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
                        <GiMedicines style={{ fontSize: "3.5rem", color: "#d4b896", marginBottom: "1rem" }} />
                        <p style={{ color: "#9a8060", fontSize: "15px" }}>
                            No categories match "<strong>{filter}</strong>"
                        </p>
                        <button
                            onClick={() => setFilter("")}
                            style={{ marginTop: "1rem", padding: "8px 20px", borderRadius: "8px", background: "#f59e0b", color: "white", border: "none", cursor: "pointer", fontSize: "14px", fontFamily: "inherit" }}
                        >
                            Clear filter
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ── Category Card ── */
const CategoryCard = ({ cat, idx, palette, visible, onClick }) => {
    const [hovered, setHovered] = useState(false);
    const [imgErr, setImgErr] = useState(false);

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: hovered ? palette.light : "#ffffff",
                borderRadius: "12px",
                border: `1.5px solid ${hovered ? palette.accent : "#f0e8d8"}`,
                padding: "16px 10px 14px",
                cursor: "pointer",
                transition: "all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)",
                transform: visible
                    ? hovered ? "translateY(-5px) scale(1.02)" : "translateY(0) scale(1)"
                    : "translateY(16px) scale(0.97)",
                opacity: visible ? 1 : 0,
                transitionDelay: `${Math.min(idx * 30, 350)}ms`,
                boxShadow: hovered ? `0 8px 24px rgba(0,0,0,0.09), 0 0 0 2px ${palette.accent}22` : "0 1px 4px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "8px",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Top accent line */}
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "2.5px",
                background: hovered ? palette.accent : "transparent",
                transition: "background 0.22s",
                borderRadius: "12px 12px 0 0",
            }} />

            {/* Image / Icon */}
            <div style={{
                width: "56px", height: "56px", borderRadius: "12px",
                background: palette.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden",
                border: `1px solid ${palette.accent}33`,
                transition: "transform 0.22s",
                transform: hovered ? "scale(1.1)" : "scale(1)",
                flexShrink: 0,
            }}>
                {cat.category_image && !imgErr ? (
                    <img
                        src={cat.category_image}
                        alt={cat.category_name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={() => setImgErr(true)}
                    />
                ) : (
                    <Icon style={{ fontSize: "26px", color: palette.accent }} />
                )}
            </div>

            {/* Name */}
            <p style={{
                margin: 0,
                fontSize: "12px",
                fontWeight: "600",
                color: hovered ? palette.accent : "#2d1f0e",
                lineHeight: 1.3,
                transition: "color 0.2s",
                wordBreak: "break-word",
            }}>
                {cat.category_name}
            </p>
        </div>
    );
};

export default CategoryPage;