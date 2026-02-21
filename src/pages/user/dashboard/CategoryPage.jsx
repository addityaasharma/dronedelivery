import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GiMedicines, GiPill, GiHeartBeats, GiDrop } from "react-icons/gi";
import { FiSearch, FiArrowRight, FiGrid } from "react-icons/fi";

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

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #fffbf0 0%, #fdf6e3 50%, #fff9f0 100%)",
                fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
            }}
        >
            <div
                style={{
                    background: "linear-gradient(135deg, #1a1209 0%, #2d1f0e 60%, #3b2a12 100%)",
                    padding: "3rem 1.5rem 4rem",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div style={{
                    position: "absolute", top: "-60px", right: "-60px",
                    width: "220px", height: "220px", borderRadius: "50%",
                    background: "rgba(245,158,11,0.08)", pointerEvents: "none",
                }} />
                <div style={{
                    position: "absolute", bottom: "-40px", left: "10%",
                    width: "140px", height: "140px", borderRadius: "50%",
                    background: "rgba(245,158,11,0.05)", pointerEvents: "none",
                }} />

                <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.5rem" }}>
                        <span
                            onClick={() => navigate("/")}
                            style={{ color: "#f59e0b", fontSize: "13px", cursor: "pointer", opacity: 0.8 }}
                        >
                            Home
                        </span>
                        <FiArrowRight style={{ color: "#f59e0b", opacity: 0.5, fontSize: "12px" }} />
                        <span style={{ color: "#f5f0e8", fontSize: "13px", opacity: 0.6 }}>Categories</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "0.75rem" }}>
                        <div style={{
                            background: "rgba(245,158,11,0.15)",
                            borderRadius: "12px", padding: "10px",
                            border: "1px solid rgba(245,158,11,0.25)",
                        }}>
                            <FiGrid style={{ color: "#f59e0b", fontSize: "22px" }} />
                        </div>
                        <h1 style={{
                            color: "#fef9f0", fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                            fontWeight: "700", margin: 0, letterSpacing: "-0.02em",
                        }}>
                            All Categories
                        </h1>
                    </div>
                    <p style={{
                        color: "rgba(245,240,232,0.55)", fontSize: "15px",
                        margin: "0 0 2rem 0", lineHeight: 1.6,
                    }}>
                        Browse our complete range of health &amp; wellness categories
                    </p>

                    <div style={{ position: "relative", maxWidth: "460px" }}>
                        <FiSearch style={{
                            position: "absolute", left: "14px", top: "50%",
                            transform: "translateY(-50%)", color: "#f59e0b", fontSize: "16px",
                        }} />
                        <input
                            type="text"
                            placeholder="Filter categories..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            style={{
                                width: "100%", padding: "12px 16px 12px 42px",
                                borderRadius: "12px", border: "1px solid rgba(245,158,11,0.3)",
                                background: "rgba(255,255,255,0.07)", color: "#fef9f0",
                                fontSize: "14px", outline: "none", boxSizing: "border-box",
                                fontFamily: "inherit", backdropFilter: "blur(8px)",
                                transition: "border-color 0.2s",
                            }}
                            onFocus={(e) => e.target.style.borderColor = "rgba(245,158,11,0.7)"}
                            onBlur={(e) => e.target.style.borderColor = "rgba(245,158,11,0.3)"}
                        />
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>

                {!loading && (
                    <p style={{
                        fontSize: "13px", color: "#9a8060", marginBottom: "1.5rem",
                        fontStyle: "italic",
                    }}>
                        Showing {filtered.length} of {categories.length} categories
                    </p>
                )}

                {loading && (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: "16px",
                    }}>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} style={{
                                height: "160px", borderRadius: "16px",
                                background: "linear-gradient(90deg, #f0e8d8 0%, #faf5ec 50%, #f0e8d8 100%)",
                                backgroundSize: "200% 100%",
                                animation: "shimmer 1.4s infinite",
                            }} />
                        ))}
                        <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
                    </div>
                )}

                {!loading && filtered.length > 0 && (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: "16px",
                    }}>
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
                                    onClick={() =>
                                        navigate(`/category/${cat.category_id}/${cat.category_slug}`)
                                    }
                                />
                            );
                        })}
                    </div>
                )}

                {!loading && filtered.length === 0 && (
                    <div style={{ textAlign: "center", padding: "5rem 1rem" }}>
                        <GiMedicines style={{ fontSize: "4rem", color: "#d4b896", marginBottom: "1rem" }} />
                        <p style={{ color: "#9a8060", fontSize: "16px" }}>
                            No categories match "<strong>{filter}</strong>"
                        </p>
                        <button
                            onClick={() => setFilter("")}
                            style={{
                                marginTop: "1rem", padding: "8px 20px", borderRadius: "8px",
                                background: "#f59e0b", color: "white", border: "none",
                                cursor: "pointer", fontSize: "14px", fontFamily: "inherit",
                            }}
                        >
                            Clear filter
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

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
                borderRadius: "16px",
                border: `1.5px solid ${hovered ? palette.accent : "#f0e8d8"}`,
                padding: "24px 20px",
                cursor: "pointer",
                transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                transform: visible
                    ? hovered
                        ? "translateY(-6px) scale(1.02)"
                        : "translateY(0) scale(1)"
                    : "translateY(20px) scale(0.97)",
                opacity: visible ? 1 : 0,
                transitionDelay: `${Math.min(idx * 40, 400)}ms`,
                boxShadow: hovered
                    ? `0 12px 32px rgba(0,0,0,0.1), 0 0 0 3px ${palette.accent}22`
                    : "0 2px 8px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "12px",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: "3px",
                background: hovered ? palette.accent : "transparent",
                transition: "background 0.25s",
                borderRadius: "16px 16px 0 0",
            }} />

            <div style={{
                width: "72px", height: "72px", borderRadius: "16px",
                background: palette.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden",
                border: `1px solid ${palette.accent}33`,
                transition: "transform 0.25s",
                transform: hovered ? "scale(1.08)" : "scale(1)",
            }}>
                {cat.category_image && !imgErr ? (
                    <img
                        src={cat.category_image}
                        alt={cat.category_name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={() => setImgErr(true)}
                    />
                ) : (
                    <Icon style={{ fontSize: "32px", color: palette.accent }} />
                )}
            </div>

            <p style={{
                margin: 0,
                fontSize: "14px",
                fontWeight: "600",
                color: hovered ? palette.accent : "#2d1f0e",
                lineHeight: 1.3,
                fontFamily: "'Palatino Linotype', Palatino, serif",
                transition: "color 0.2s",
            }}>
                {cat.category_name}
            </p>

            <div style={{
                display: "flex", alignItems: "center", gap: "4px",
                color: palette.accent, fontSize: "12px",
                opacity: hovered ? 1 : 0,
                transform: hovered ? "translateX(0)" : "translateX(-6px)",
                transition: "all 0.2s",
                fontWeight: "500",
            }}>
                Explore <FiArrowRight />
            </div>
        </div>
    );
};

export default CategoryPage;