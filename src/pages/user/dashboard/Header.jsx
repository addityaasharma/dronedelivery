import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiMenu,
    FiX,
    FiSearch,
    FiMapPin,
    FiUser,
    FiHeart,
    FiShoppingCart,
    FiHome,
    FiClock,
    FiTrendingUp,
} from "react-icons/fi";
import { GiMedicines } from "react-icons/gi";

const Header = () => {
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);

    const navigate = useNavigate();
    const fetchedOnce = useRef(false);
    const debounceRef = useRef(null);
    const searchRef = useRef(null);
    const dropdownRef = useRef(null);

    const goTo = (path) => {
        setOpen(false);
        navigate(path);
    };


    useEffect(() => {
        if (fetchedOnce.current) return;
        fetchedOnce.current = true;

        const cached = sessionStorage.getItem("categories");
        if (cached) {
            setCategories(JSON.parse(cached));
            setLoading(false);
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
            }
        };

        fetchCategories();
    }, []);


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
                dropdownRef.current && !dropdownRef.current.contains(e.target) &&
                searchRef.current && !searchRef.current.contains(e.target)
            ) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/60"
                style={{ borderBottom: "1px solid #f0ebe4" }}>
                <div className="flex items-center justify-between px-4 py-3">

                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="p-2 rounded-md hover:bg-gray-100"
                    >
                        <FiMenu size={22} />
                    </button>

                    <div className="flex-1 px-4 relative" ref={searchRef}>
                        <div className="relative">
                            <FiSearch
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                size={15}
                            />
                            <input
                                type="text"
                                placeholder="Search medicines…"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onKeyDown={handleKeyDown}
                                onFocus={() => searchQuery && suggestions.length > 0 && setShowDropdown(true)}
                                className="w-full max-w-md mx-auto block pl-9 pr-10 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                                style={{ fontFamily: "'Georgia', serif" }}
                            />
                            <button
                                onClick={() => handleSearchSubmit()}
                                className="absolute right-1 top-1/2 -translate-y-1/2 bg-amber-500 hover:bg-amber-600 text-white rounded-full p-1.5 transition-colors"
                            >
                                <FiSearch size={13} />
                            </button>

                            {searchLoading && (
                                <div className="absolute right-9 top-1/2 -translate-y-1/2">
                                    <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}
                        </div>

                        {showDropdown && (
                            <div
                                ref={dropdownRef}
                                className="absolute left-4 right-4 top-full mt-1 bg-white rounded-2xl shadow-2xl overflow-hidden z-50"
                                style={{ border: "1px solid #ede8e1", maxHeight: 380 }}
                            >
                                {suggestions.length === 0 && !searchLoading ? (
                                    <div className="px-4 py-6 text-center">
                                        <FiSearch size={22} className="mx-auto mb-2 text-gray-300" />
                                        <p className="text-xs text-gray-400">No results for "{searchQuery}"</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="px-4 py-2 flex items-center justify-between"
                                            style={{ background: "#fdf9f4", borderBottom: "1px solid #f0ebe4" }}>
                                            <span className="text-[10px] font-bold uppercase tracking-widest"
                                                style={{ color: "#b8a090" }}>
                                                Suggestions
                                            </span>
                                            <button
                                                className="text-[10px] font-semibold"
                                                style={{ color: "#d97706" }}
                                                onClick={() => handleSearchSubmit()}
                                            >
                                                See all results →
                                            </button>
                                        </div>

                                        {/* List */}
                                        <ul className="overflow-y-auto" style={{ maxHeight: 320 }}>
                                            {suggestions.map((product, idx) => (
                                                <li
                                                    key={product.id}
                                                    onClick={() => handleSuggestionClick(product)}
                                                    className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors"
                                                    style={{
                                                        background: activeSuggestion === idx ? "#fef3c7" : "transparent",
                                                        borderBottom: "1px solid #f7f4ef",
                                                    }}
                                                    onMouseEnter={() => setActiveSuggestion(idx)}
                                                    onMouseLeave={() => setActiveSuggestion(-1)}
                                                >
                                                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0"
                                                        style={{ background: "#f0ebe4", border: "1px solid #e8e3db" }}>
                                                        {product.image ? (
                                                            <img
                                                                src={product.image}
                                                                alt={product.title}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display = "none";
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <GiMedicines size={16} style={{ color: "#b8a090" }} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <HighlightedText
                                                            text={product.title}
                                                            query={searchQuery}
                                                        />
                                                        <p className="text-[10px] mt-0.5" style={{ color: "#b8a090" }}>
                                                            #{product.unique_code}
                                                        </p>
                                                    </div>

                                                    <FiSearch size={12} style={{ color: "#d4c5b4" }} className="shrink-0" />
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        <button onClick={() => navigate("/cart")} className="p-2 rounded-full hover:bg-gray-100">
                            <FiShoppingCart size={22} />
                        </button>
                        <button onClick={() => navigate("/liked-products")} className="p-2 rounded-full hover:bg-gray-100">
                            <FiHeart size={22} />
                        </button>
                        <button onClick={() => navigate("/profile")} className="p-2 rounded-full hover:bg-gray-100">
                            <FiUser size={22} />
                        </button>
                    </div>
                </div>
            </header>

            {open && (
                <div className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
                    <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl p-6 overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Menu</h2>
                            <button onClick={() => setOpen(false)}><FiX size={22} /></button>
                        </div>

                        <button onClick={() => goTo("/")} className="w-full flex items-center gap-3 py-2 font-medium hover:text-amber-600">
                            <FiHome size={18} /> Home
                        </button>
                        <button onClick={() => goTo("/track-order")} className="w-full flex items-center gap-3 py-2 font-medium hover:text-amber-600">
                            <FiMapPin size={18} /> Track Order
                        </button>

                        <hr className="my-4" />
                        <h3 className="text-gray-500 text-sm mb-3">Categories</h3>

                        <ul className="space-y-3">
                            {loading && <li className="text-gray-400 text-sm">Loading categories...</li>}
                            {!loading && categories.map((cat) => (
                                <li
                                    key={cat.category_id}
                                    onClick={() => goTo(`/category/${cat.category_id}/${cat.category_slug}`)}
                                    className="flex items-center gap-3 cursor-pointer hover:text-amber-600"
                                >
                                    <GiMedicines size={18} />
                                    {cat.category_name}
                                </li>
                            ))}
                            {!loading && categories.length === 0 && (
                                <li className="text-gray-400 text-sm">No categories found</li>
                            )}
                        </ul>
                    </aside>
                </div>
            )}

            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin { animation: spin 0.7s linear infinite; }
      `}</style>
        </>
    );
};

/* ── Highlight matched text in suggestion ── */
const HighlightedText = ({ text, query }) => {
    if (!query) return <span className="text-sm font-medium" style={{ color: "#2e1f0e" }}>{text}</span>;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return (
        <span className="text-sm font-medium truncate block" style={{ color: "#2e1f0e" }}>
            {parts.map((part, i) =>
                regex.test(part) ? (
                    <mark key={i} style={{ background: "#fef08a", color: "#92400e", borderRadius: 3, padding: "0 1px" }}>
                        {part}
                    </mark>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </span>
    );
};

export default Header;