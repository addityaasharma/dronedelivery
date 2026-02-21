import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiSearch, FiArrowLeft, FiStar } from "react-icons/fi";
import { GiMedicines } from "react-icons/gi";
import { Package } from "lucide-react";

/* ── Skeleton card ── */
const SkeletonCard = () => (
    <div className="bg-white rounded-2xl overflow-hidden animate-pulse"
        style={{ border: "1px solid #ede8e1" }}>
        <div className="h-40 bg-gray-200" />
        <div className="p-3 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-amber-100 rounded w-1/3 mt-2" />
        </div>
    </div>
);

/* ── Star Rating ── */
const StarRating = ({ rating }) => {
    if (!rating) return null;
    const stars = Math.round(rating);
    return (
        <div className="flex items-center gap-0.5 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <FiStar
                    key={i}
                    size={10}
                    style={{
                        fill: i < stars ? "#f59e0b" : "none",
                        color: i < stars ? "#f59e0b" : "#d1d5db",
                    }}
                />
            ))}
            <span className="text-[10px] ml-1" style={{ color: "#b8a090" }}>
                {Number(rating).toFixed(1)}
            </span>
        </div>
    );
};

/* ── Product Card ── */
const ProductCard = ({ product, onClick }) => {
    const hasImage = !!product.image;
    const hue = [...(product.title || "X")].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
    const discount = product.compare_price && product.price
        ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
        : null;

    return (
        <div
            onClick={onClick}
            className="group bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
            style={{ border: "1px solid #ede8e1" }}
        >
            {/* Image */}
            <div className="relative h-40 overflow-hidden bg-gray-50">
                {hasImage ? (
                    <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextSibling.style.display = "flex";
                        }}
                    />
                ) : null}
                <div
                    className="w-full h-full flex flex-col items-center justify-center gap-1"
                    style={{ display: hasImage ? "none" : "flex", background: `hsl(${hue},30%,92%)` }}
                >
                    <GiMedicines size={24} style={{ color: `hsl(${hue},45%,48%)` }} />
                    <span className="text-[10px] font-bold tracking-widest" style={{ color: `hsl(${hue},45%,48%)` }}>
                        {product.title?.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()}
                    </span>
                </div>

                {/* Discount badge */}
                {discount !== null && discount > 0 && (
                    <span className="absolute top-2 left-2 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: "#16a34a" }}>
                        {discount}% OFF
                    </span>
                )}

                {/* Unique code */}
                <span className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm text-gray-400 text-[9px] font-mono px-1.5 py-0.5 rounded-full border border-gray-200">
                    #{product.unique_code}
                </span>
            </div>

            {/* Info */}
            <div className="p-3">
                {product.category && (
                    <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full mb-1 inline-block"
                        style={{ background: "#fef3c7", color: "#92400e" }}>
                        {product.category}
                    </span>
                )}

                <h3 className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-amber-700 transition-colors mt-0.5"
                    style={{ color: "#2e1f0e", fontFamily: "'Georgia', serif" }}>
                    {product.title}
                </h3>

                <StarRating rating={product.rating} />

                <div className="flex items-end justify-between mt-2">
                    <div>
                        <span className="font-bold text-base" style={{ color: "#d97706" }}>
                            ₹{Number(product.price).toLocaleString("en-IN")}
                        </span>
                        {product.compare_price && product.compare_price > product.price && (
                            <span className="text-xs line-through ml-1.5" style={{ color: "#b8a090" }}>
                                ₹{Number(product.compare_price).toLocaleString("en-IN")}
                            </span>
                        )}
                    </div>
                    {product.purchased > 0 && (
                        <span className="text-[9px]" style={{ color: "#b8a090" }}>
                            {product.purchased}+ sold
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ══ MAIN PAGE ══ */
const SearchResults = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get("name") || "";

    const [inputValue, setInputValue] = useState(query);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(false);
    const [searched, setSearched] = useState(false);
    const [total, setTotal] = useState(0);
    const [hasNext, setHasNext] = useState(false);

    const debounceRef = useRef(null);
    const loaderRef = useRef(null);
    const isFetchingRef = useRef(false);
    const currentPageRef = useRef(1);

    /* ── Fetch ── */
    const fetchResults = useCallback(async ({ q, pageNum = 1, reset = false }) => {
        if (!q.trim() || isFetchingRef.current) return;
        isFetchingRef.current = true;

        if (reset) setInitialLoad(true);
        setLoading(true);
        setSearched(true);

        try {
            const res = await fetch(
                `https://no-wheels-1.onrender.com/user/search_products?name=${encodeURIComponent(q.trim())}&page=${pageNum}&limit=20`
            );
            const data = await res.json();
            const items = data.data || [];
            const pagination = data.pagination || {};

            setProducts(prev => reset ? items : [...prev, ...items]);
            setTotal(pagination.total ?? 0);
            setHasNext(pageNum < (pagination.pages ?? 1));
            currentPageRef.current = pageNum;
        } catch (err) {
            console.log("Search failed", err);
            if (reset) setProducts([]);
        } finally {
            setLoading(false);
            setInitialLoad(false);
            isFetchingRef.current = false;
        }
    }, []);

    /* On query change → reset and fetch */
    useEffect(() => {
        setInputValue(query);
        setHasNext(false);
        currentPageRef.current = 1;
        if (query.trim()) {
            fetchResults({ q: query, pageNum: 1, reset: true });
        } else {
            setProducts([]);
            setSearched(false);
            setTotal(0);
        }
    }, [query]);

    /* Infinite scroll */
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNext && !loading) {
                    const next = currentPageRef.current + 1;
                    fetchResults({ q: query, pageNum: next, reset: false });
                }
            },
            { threshold: 0.1, rootMargin: "120px" }
        );
        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [hasNext, loading, query, fetchResults]);

    const handleInputChange = (e) => {
        const val = e.target.value;
        setInputValue(val);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setSearchParams(val.trim() ? { name: val.trim() } : {});
        }, 400);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) setSearchParams({ name: inputValue.trim() });
    };

    const handleClear = () => {
        setInputValue("");
        setSearchParams({});
        setProducts([]);
        setSearched(false);
        setTotal(0);
    };

    return (
        <div className="min-h-screen" style={{ background: "#f7f4ef", fontFamily: "'Georgia', serif" }}>

            {/* ── STICKY TOP BAR ── */}
            <div
                className="sticky top-0 z-40 px-4 py-3"
                style={{
                    background: "rgba(247,244,239,0.97)",
                    backdropFilter: "blur(12px)",
                    borderBottom: "1px solid #e8e3db",
                }}
            >
                <div className="max-w-2xl mx-auto flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-amber-100 transition-colors shrink-0"
                        style={{ color: "#6b4f2a" }}
                    >
                        <FiArrowLeft size={20} />
                    </button>

                    <form onSubmit={handleSubmit} className="flex-1 relative">
                        <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="Search medicines…"
                            autoFocus
                            className="w-full pl-8 pr-10 py-2 text-sm rounded-xl outline-none transition-all"
                            style={{
                                background: "#fff",
                                border: "1.5px solid #e3ddd5",
                                color: "#3a2e22",
                                fontFamily: "inherit",
                            }}
                            onFocus={(e) => (e.target.style.borderColor = "#d97706")}
                            onBlur={(e) => (e.target.style.borderColor = "#e3ddd5")}
                        />
                        {inputValue && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 text-base leading-none"
                            >
                                ✕
                            </button>
                        )}
                    </form>
                </div>

                {/* Result count */}
                {searched && !initialLoad && (
                    <div className="max-w-2xl mx-auto mt-2 px-1 flex items-center gap-2">
                        <p className="text-xs" style={{ color: "#9e8a74" }}>
                            {total > 0
                                ? <><span className="font-semibold" style={{ color: "#6b4f2a" }}>{total}</span>{" results for "}</>
                                : "No results for "
                            }
                            <span className="font-semibold" style={{ color: "#6b4f2a" }}>"{query}"</span>
                        </p>
                        {loading && !initialLoad && (
                            <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin shrink-0" />
                        )}
                    </div>
                )}
            </div>

            {/* ── CONTENT ── */}
            <main className="max-w-2xl mx-auto px-4 pt-4 pb-16">

                {/* Initial empty state */}
                {!searched && !loading && (
                    <div className="text-center py-24">
                        <FiSearch size={44} className="mx-auto mb-3" style={{ color: "#d4c5b4" }} />
                        <p className="text-sm font-semibold mb-1" style={{ color: "#6b4f2a" }}>Search for medicines</p>
                        <p className="text-xs" style={{ color: "#b8a090" }}>Type a name, category or description</p>
                    </div>
                )}

                {/* Initial skeleton */}
                {initialLoad && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                )}

                {/* No results */}
                {searched && !initialLoad && !loading && products.length === 0 && (
                    <div className="text-center py-24">
                        <Package size={44} className="mx-auto mb-3" style={{ color: "#d4c5b4" }} />
                        <p className="text-base font-semibold mb-1" style={{ color: "#6b4f2a" }}>No results found</p>
                        <p className="text-xs" style={{ color: "#b8a090" }}>
                            Try a different keyword or browse categories
                        </p>
                    </div>
                )}

                {/* Results grid */}
                {!initialLoad && products.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {products.map((product) => (
                            <ProductCard
                                key={`${product.id}-${product.unique_code}`}
                                product={product}
                                onClick={() => navigate(`/product/${product.unique_code}/${product.slug}`)}
                            />
                        ))}
                    </div>
                )}

                {/* Infinite scroll sentinel */}
                <div ref={loaderRef} className="h-1" />

                {/* Loading more bouncing dots */}
                {loading && !initialLoad && (
                    <div className="flex justify-center pt-6 pb-2">
                        <div className="flex gap-1.5">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="w-2 h-2 rounded-full bg-amber-400"
                                    style={{ animation: `bounce 0.8s ease-in-out ${i * 0.15}s infinite` }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* End of results */}
                {!hasNext && !loading && products.length > 0 && (
                    <p className="text-center text-xs mt-6 pb-2" style={{ color: "#c4b49e" }}>
                        ✦ All {total} results loaded ✦
                    </p>
                )}
            </main>

            <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .animate-pulse { animation: pulse 1.5s ease-in-out infinite; }
        .animate-spin  { animation: spin 0.7s linear infinite; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
        </div>
    );
};

export default SearchResults;