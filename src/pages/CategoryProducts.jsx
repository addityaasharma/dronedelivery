import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, SlidersHorizontal, Package, Tag, ChevronDown } from "lucide-react";

/* ─────────────────────────────────────────────
   PLACEHOLDER when product_images is null
───────────────────────────────────────────── */
const ProductImagePlaceholder = ({ title }) => {
    const initials = title
        ?.split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("") || "?";

    const hue = [...(title || "X")].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

    return (
        <div
            className="w-full h-full flex flex-col items-center justify-center gap-1"
            style={{ background: `hsl(${hue}, 35%, 90%)` }}
        >
            <Package size={26} style={{ color: `hsl(${hue}, 50%, 45%)` }} />
            <span
                className="text-xs font-bold tracking-widest"
                style={{ color: `hsl(${hue}, 50%, 45%)` }}
            >
                {initials}
            </span>
        </div>
    );
};

/* ─────────────────────────────────────────────
   SKELETON CARD
───────────────────────────────────────────── */
const SkeletonCard = () => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
        <div className="h-36 bg-gray-200" />
        <div className="p-3 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-amber-100 rounded w-1/3 mt-2" />
        </div>
    </div>
);

/* ─────────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────────── */
const ProductCard = ({ product, onClick }) => {
    const hasImage =
        product.product_images &&
        Array.isArray(product.product_images) &&
        product.product_images.length > 0 &&
        product.product_images[0];

    const discount =
        product.product_comparable_price && product.product_price
            ? Math.round(
                ((product.product_comparable_price - product.product_price) /
                    product.product_comparable_price) *
                100
            )
            : null;

    return (
        <div
            onClick={onClick}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-amber-200 hover:-translate-y-0.5"
        >
            {/* Image area */}
            <div className="relative h-36 overflow-hidden bg-gray-50">
                {hasImage ? (
                    <img
                        src={product.product_images[0]}
                        alt={product.product_title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextSibling.style.display = "flex";
                        }}
                    />
                ) : null}
                <div
                    className="w-full h-full"
                    style={{ display: hasImage ? "none" : "flex" }}
                >
                    <ProductImagePlaceholder title={product.product_title} />
                </div>

                {discount !== null && discount > 0 && (
                    <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {discount}% OFF
                    </span>
                )}

                <span className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm text-gray-400 text-[9px] font-mono px-1.5 py-0.5 rounded-full border border-gray-200">
                    #{product.product_uniqueCode}
                </span>
            </div>

            {/* Info */}
            <div className="p-3">
                <h3 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2 mb-1 group-hover:text-amber-700 transition-colors">
                    {product.product_title}
                </h3>

                {product.product_description && (
                    <p className="text-gray-400 text-xs line-clamp-1 mb-2">
                        {product.product_description}
                    </p>
                )}

                <div className="flex items-end justify-between mt-auto">
                    <div>
                        <span className="text-amber-600 font-bold text-base">
                            ₹{Number(product.product_price).toLocaleString("en-IN")}
                        </span>
                        {product.product_comparable_price && (
                            <span className="text-gray-400 text-xs line-through ml-1.5">
                                ₹{Number(product.product_comparable_price).toLocaleString("en-IN")}
                            </span>
                        )}
                    </div>
                    <Tag size={13} className="text-gray-300" />
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const CategoryProducts = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [hasNext, setHasNext] = useState(false);

    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("date");
    const [showSort, setShowSort] = useState(false);

    const loaderRef = useRef(null);
    const isFetchingRef = useRef(false);
    const searchDebounceRef = useRef(null);
    const currentPageRef = useRef(1);

    const cacheKey = `category_${id}_${search}_${sortBy}`;

    /* ── Fetch ── */
    const fetchProducts = useCallback(
        async ({ reset = false, pageOverride } = {}) => {
            if (isFetchingRef.current) return;
            isFetchingRef.current = true;

            const targetPage = pageOverride ?? (reset ? 1 : currentPageRef.current);

            try {
                setLoading(true);
                setError("");

                const res = await fetch(
                    `https://no-wheels-1.onrender.com/user/category/${id}?page=${targetPage}&sort_by=${sortBy}&search=${search}`
                );
                const data = await res.json();

                if (!res.ok) throw new Error(data.message || "Failed to load products");

                setProducts((prev) => {
                    const updated = reset ? data.products : [...prev, ...data.products];
                    sessionStorage.setItem(
                        cacheKey,
                        JSON.stringify({
                            products: updated,
                            page: targetPage,
                            hasNext: data.has_next,
                            total: data.total,
                            totalPages: data.total_pages,
                        })
                    );
                    return updated;
                });

                setHasNext(data.has_next);
                setTotal(data.total ?? 0);
                setTotalPages(data.total_pages ?? 1);
                currentPageRef.current = targetPage;
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
                setInitialLoad(false);
                isFetchingRef.current = false;
            }
        },
        [id, search, sortBy, cacheKey]
    );

    /* ── Initial / filter change ── */
    useEffect(() => {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
            const p = JSON.parse(cached);
            setProducts(p.products);
            setPage(p.page);
            setHasNext(p.hasNext);
            setTotal(p.total ?? 0);
            setTotalPages(p.totalPages ?? 1);
            currentPageRef.current = p.page;
            setInitialLoad(false);
            return;
        }
        setInitialLoad(true);
        setProducts([]);
        currentPageRef.current = 1;
        fetchProducts({ reset: true, pageOverride: 1 });
    }, [id, search, sortBy]);

    /* ── Infinite scroll observer ── */
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNext && !loading) {
                    const next = currentPageRef.current + 1;
                    currentPageRef.current = next;
                    fetchProducts({ pageOverride: next });
                }
            },
            { threshold: 0.1, rootMargin: "100px" }
        );

        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [hasNext, loading, fetchProducts]);

    /* ── Debounced search ── */
    const handleSearch = (val) => {
        clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = setTimeout(() => setSearch(val), 400);
    };

    const sortLabels = { date: "Newest First", name: "Name A–Z", price: "Price ↑" };

    /* ─── RENDER ─── */
    return (
        <div className="min-h-screen" style={{ background: "#f7f4ef", fontFamily: "'Georgia', serif" }}>

            {/* ── TOP BAR ── */}
            <div
                className="sticky top-0 z-50 px-4 py-3"
                style={{
                    background: "rgba(247,244,239,0.92)",
                    backdropFilter: "blur(12px)",
                    borderBottom: "1px solid #e8e3db",
                }}
            >
                <div className="max-w-2xl mx-auto flex items-center gap-3">
                    <button
                        onClick={() => navigate("/")}
                        className="p-2 rounded-full transition-colors hover:bg-amber-100"
                        style={{ color: "#6b4f2a" }}
                    >
                        <ArrowLeft size={20} />
                    </button>

                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products…"
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-8 pr-4 py-2 text-sm rounded-xl outline-none transition-all"
                            style={{
                                background: "#fff",
                                border: "1.5px solid #e3ddd5",
                                color: "#3a2e22",
                                fontFamily: "inherit",
                            }}
                            onFocus={(e) => (e.target.style.borderColor = "#d97706")}
                            onBlur={(e) => (e.target.style.borderColor = "#e3ddd5")}
                        />
                    </div>

                    {/* Sort */}
                    <div className="relative">
                        <button
                            onClick={() => setShowSort((s) => !s)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
                            style={{
                                background: showSort ? "#d97706" : "#fff",
                                color: showSort ? "#fff" : "#6b4f2a",
                                border: "1.5px solid #e3ddd5",
                            }}
                        >
                            <SlidersHorizontal size={13} />
                            <span className="hidden sm:inline">{sortLabels[sortBy]}</span>
                            <ChevronDown size={12} className={`transition-transform ${showSort ? "rotate-180" : ""}`} />
                        </button>

                        {showSort && (
                            <div
                                className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden shadow-xl z-50 py-1"
                                style={{ background: "#fff", border: "1px solid #e3ddd5", minWidth: 140 }}
                            >
                                {Object.entries(sortLabels).map(([val, label]) => (
                                    <button
                                        key={val}
                                        onClick={() => { setSortBy(val); setShowSort(false); }}
                                        className="w-full text-left px-4 py-2 text-xs transition-colors hover:bg-amber-50"
                                        style={{
                                            color: sortBy === val ? "#d97706" : "#4a3728",
                                            fontWeight: sortBy === val ? 700 : 400,
                                            fontFamily: "inherit",
                                        }}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── CONTENT ── */}
            <div className="max-w-2xl mx-auto px-4 pt-4 pb-16">

                {/* Count bar */}
                {!initialLoad && (
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-xs" style={{ color: "#9e8a74" }}>
                            {total > 0
                                ? `Showing ${products.length} of ${total} product${total !== 1 ? "s" : ""}`
                                : ""}
                        </p>
                        {search && (
                            <span
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{ background: "#fff3cd", color: "#856404" }}
                            >
                                "{search}"
                            </span>
                        )}
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mb-4 p-3 rounded-xl text-sm text-red-700 bg-red-50 border border-red-200">
                        ⚠ {error}
                    </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {initialLoad
                        ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                        : products.map((p) => (
                            <ProductCard
                                key={`${p.product_id}-${p.product_uniqueCode}`}
                                product={p}
                                onClick={() => navigate(`/product/${p.product_id}`)}
                            />
                        ))}
                </div>

                {/* Empty state */}
                {!initialLoad && !loading && products.length === 0 && !error && (
                    <div className="text-center py-16">
                        <Package size={40} className="mx-auto mb-3 text-gray-300" />
                        <p className="text-gray-400 text-sm">No products found</p>
                        {search && (
                            <p className="text-gray-400 text-xs mt-1">
                                Try a different search term
                            </p>
                        )}
                    </div>
                )}

                {/* ── Infinite scroll sentinel ── */}
                <div ref={loaderRef} className="h-1" />

                {/* Loading more indicator */}
                {loading && !initialLoad && (
                    <div className="flex justify-center pt-4 pb-2">
                        <div className="flex gap-1.5">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"
                                    style={{ animationDelay: `${i * 0.15}s` }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* End of list */}
                {!hasNext && !loading && products.length > 0 && (
                    <p
                        className="text-center text-xs mt-6 pb-2"
                        style={{ color: "#c4b49e" }}
                    >
                        ✦ All {total} products loaded ✦
                    </p>
                )}
            </div>

            <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-bounce { animation: bounce 0.8s ease-in-out infinite; }
        .animate-pulse { animation: pulse 1.5s ease-in-out infinite; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
        </div>
    );
};

export default CategoryProducts;