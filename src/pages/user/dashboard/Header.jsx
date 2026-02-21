import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { GiMedicines } from "react-icons/gi";

const NAV_LINKS = [
    { label: "Home", path: "/" },
    { label: "Categories", path: "/categories" },
    { label: "Cart", path: "/cart" },
    { label: "Wishlist", path: "/liked-products" },
    { label: "Profile", path: "/profile" },
];

const Header = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const debounceRef = useRef(null);
    const searchRef = useRef(null);
    const dropdownRef = useRef(null);

    const fetchSuggestions = useCallback(async (query) => {
        if (!query.trim()) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }
        setSearchLoading(true);
        try {
            const res = await fetch(
                `https://no-wheels-1.onrender.com/user/suggestion?name=${encodeURIComponent(query)}`
            );
            const data = await res.json();
            if (res.ok) {
                setSuggestions(data.data || []);
                setShowDropdown(true);
            }
        } catch (err) {
            console.log("Suggestion fetch failed", err);
        } finally {
            setSearchLoading(false);
        }
    }, []);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchQuery(val);
        setActiveSuggestion(-1);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
    };

    const handleSearchSubmit = (query = searchQuery) => {
        if (!query.trim()) return;
        setShowDropdown(false);
        navigate(`/search?name=${encodeURIComponent(query.trim())}`);
    };

    const handleSuggestionClick = (product) => {
        setShowDropdown(false);
        setSearchQuery(product.title);
        navigate(`/product/${product.unique_code}/${product.slug}`);
    };

    const handleKeyDown = (e) => {
        if (!showDropdown || suggestions.length === 0) {
            if (e.key === "Enter") handleSearchSubmit();
            return;
        }
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveSuggestion((p) => Math.min(p + 1, suggestions.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveSuggestion((p) => Math.max(p - 1, -1));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (activeSuggestion >= 0) {
                handleSuggestionClick(suggestions[activeSuggestion]);
            } else {
                handleSearchSubmit();
            }
        } else if (e.key === "Escape") {
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        const handler = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target) &&
                searchRef.current &&
                !searchRef.current.contains(e.target)
            ) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const isActive = (path) =>
        path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(path + "/");

    return (
        <header
            className="sticky top-0 z-50 bg-white"
            style={{
                fontFamily: "'Georgia', serif",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                borderBottom: "1px solid #f0ece6",
            }}
        >
            {/* ── Top Row: Logo + Search ── */}
            <div
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    padding: "14px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                }}
            >
                {/* Logo */}
                <div
                    onClick={() => navigate("/")}
                    style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flexShrink: 0 }}
                >
                    <GiMedicines style={{ color: "#f59e0b", fontSize: 28 }} />
                    <span style={{ fontSize: 22, fontWeight: 800, color: "#1a1209", letterSpacing: "-0.5px" }}>
                        No<span style={{ color: "#f59e0b" }}>Wheels</span>
                    </span>
                </div>

                {/* Search Bar */}
                <div style={{ flex: 1, position: "relative" }} ref={searchRef}>
                    {/* Input row */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        border: "2px solid #e5e7eb",
                        borderRadius: 10,
                        overflow: "hidden",
                        background: "#f9fafb",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                        onFocusCapture={e => {
                            e.currentTarget.style.borderColor = "#f59e0b";
                            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.12)";
                            e.currentTarget.style.background = "#fff";
                        }}
                        onBlurCapture={e => {
                            e.currentTarget.style.borderColor = "#e5e7eb";
                            e.currentTarget.style.boxShadow = "none";
                            e.currentTarget.style.background = "#f9fafb";
                        }}
                    >
                        {/* Search icon */}
                        {/* <FiSearch style={{ marginLeft: 14, color: "#9ca3af", fontSize: 16, flexShrink: 0, pointerEvents: "none" }} /> */}

                        {/* Input */}
                        <input
                            type="text"
                            placeholder="Search medicines, health products..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onKeyDown={handleKeyDown}
                            onFocus={() => searchQuery && suggestions.length > 0 && setShowDropdown(true)}
                            style={{
                                flex: 1,
                                padding: "11px 12px",
                                border: "none",
                                background: "transparent",
                                fontSize: 14,
                                color: "#111827",
                                outline: "none",
                                fontFamily: "'Georgia', serif",
                            }}
                        />

                        {/* Spinner */}
                        {searchLoading && (
                            <div style={{
                                width: 18, height: 18, borderRadius: "50%",
                                border: "2px solid #fde68a", borderTopColor: "#f59e0b",
                                animation: "spin 0.7s linear infinite",
                                marginRight: 10, flexShrink: 0,
                            }} />
                        )}

                        {/* Search button */}
                        <button
                            onClick={() => handleSearchSubmit()}
                            style={{
                                padding: "0 18px",
                                height: 46,
                                background: "#f59e0b",
                                color: "#fff",
                                border: "none",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                fontSize: 13,
                                fontWeight: 700,
                                fontFamily: "'Georgia', serif",
                                flexShrink: 0,
                                transition: "background 0.2s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "#d97706"}
                            onMouseLeave={e => e.currentTarget.style.background = "#f59e0b"}
                        >
                            <FiSearch size={15} />
                            <span className="hidden sm:inline">Search</span>
                        </button>
                    </div>

                    {/* Dropdown */}
                    {showDropdown && (
                        <div
                            ref={dropdownRef}
                            style={{
                                position: "absolute",
                                top: "calc(100% + 6px)",
                                left: 0,
                                right: 0,
                                background: "#fff",
                                border: "1px solid #e5e7eb",
                                borderRadius: 10,
                                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                                zIndex: 100,
                                overflow: "hidden",
                            }}
                        >
                            {suggestions.length === 0 && !searchLoading ? (
                                <div style={{ padding: "16px", textAlign: "center", fontSize: 14, color: "#9ca3af" }}>
                                    No results for "<strong>{searchQuery}</strong>"
                                </div>
                            ) : (
                                <>
                                    {/* Dropdown header */}
                                    <div style={{
                                        display: "flex", alignItems: "center", justifyContent: "space-between",
                                        padding: "10px 16px", borderBottom: "1px solid #f3f4f6", background: "#fafafa",
                                    }}>
                                        <span style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                            Suggestions
                                        </span>
                                        <button
                                            onClick={() => handleSearchSubmit()}
                                            style={{ fontSize: 12, color: "#f59e0b", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                                        >
                                            See all results →
                                        </button>
                                    </div>

                                    {/* Suggestion list */}
                                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                        {suggestions.map((product, idx) => (
                                            <li
                                                key={product.unique_code || idx}
                                                onClick={() => handleSuggestionClick(product)}
                                                onMouseEnter={() => setActiveSuggestion(idx)}
                                                onMouseLeave={() => setActiveSuggestion(-1)}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 12,
                                                    padding: "10px 16px",
                                                    cursor: "pointer",
                                                    background: activeSuggestion === idx ? "#fffbeb" : "#fff",
                                                    borderBottom: "1px solid #f9fafb",
                                                    transition: "background 0.15s",
                                                }}
                                            >
                                                {/* Thumbnail */}
                                                <div style={{
                                                    width: 40, height: 40, borderRadius: 8,
                                                    overflow: "hidden", background: "#fef3c7",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    flexShrink: 0, border: "1px solid #fde68a",
                                                }}>
                                                    {product.image ? (
                                                        <img
                                                            src={product.image}
                                                            alt={product.title}
                                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                            onError={(e) => { e.currentTarget.style.display = "none"; }}
                                                        />
                                                    ) : (
                                                        <GiMedicines style={{ color: "#f59e0b", fontSize: 18 }} />
                                                    )}
                                                </div>

                                                {/* Text */}
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ fontSize: 13, fontWeight: 500, color: "#111827", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                        <HighlightedText text={product.title} query={searchQuery} />
                                                    </p>
                                                    <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0" }}>
                                                        #{product.unique_code}
                                                    </p>
                                                </div>

                                                {/* Arrow */}
                                                <span style={{ color: "#d1d5db", fontSize: 16, flexShrink: 0 }}>›</span>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Desktop Nav (hidden on mobile) ── */}
            <DesktopNav pathname={pathname} navigate={navigate} isActive={isActive} />

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </header>
    );
};

const DesktopNav = ({ navigate, isActive }) => (
    <div
        className="hidden sm:block"
        style={{ borderTop: "1px solid #f3f0ea", background: "#fffcf5" }}
    >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
            <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
                {NAV_LINKS.map(({ label, path }) => {
                    const active = isActive(path);
                    return (
                        <button
                            key={label}
                            onClick={() => navigate(path)}
                            style={{
                                position: "relative",
                                padding: "10px 18px",
                                fontSize: 13,
                                fontWeight: active ? 700 : 500,
                                color: active ? "#d97706" : "#57534e",
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                fontFamily: "'Georgia', serif",
                                transition: "color 0.2s",
                                letterSpacing: "0.01em",
                            }}
                            onMouseEnter={e => { if (!active) e.currentTarget.style.color = "#d97706"; }}
                            onMouseLeave={e => { if (!active) e.currentTarget.style.color = "#57534e"; }}
                        >
                            {label}
                            {active && (
                                <span style={{
                                    position: "absolute",
                                    bottom: 0,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    width: "55%",
                                    height: 2,
                                    background: "#d97706",
                                    borderRadius: 9999,
                                }} />
                            )}
                        </button>
                    );
                })}
            </nav>
        </div>
    </div>
);

const HighlightedText = ({ text, query }) => {
    if (!query) return <span>{text}</span>;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return (
        <span>
            {parts.map((part, i) =>
                regex.test(part)
                    ? <mark key={i} style={{ background: "#fef3c7", color: "#92400e", borderRadius: 3, padding: "0 2px" }}>{part}</mark>
                    : <span key={i}>{part}</span>
            )}
        </span>
    );
};

export default Header;