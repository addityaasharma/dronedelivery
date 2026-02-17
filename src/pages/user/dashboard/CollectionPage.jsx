import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Package, Tag, Layers } from "lucide-react";

/* ─────────────────────────────────────────────
   PRODUCT IMAGE PLACEHOLDER
───────────────────────────────────────────── */
const ProductPlaceholder = ({ title }) => {
    const hue = [...(title || "X")].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
    const initials = title?.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1"
            style={{ background: `hsl(${hue},30%,92%)` }}>
            <Package size={22} style={{ color: `hsl(${hue},45%,48%)` }} />
            <span className="text-xs font-bold tracking-widest" style={{ color: `hsl(${hue},45%,48%)` }}>
                {initials}
            </span>
        </div>
    );
};

/* ─────────────────────────────────────────────
   SKELETON CARD
───────────────────────────────────────────── */
const SkeletonCard = () => (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #ede8e1" }}>
        <div className="aspect-square shimmer" />
        <div className="p-3 space-y-2">
            <div className="h-3 shimmer rounded-lg w-3/4" />
            <div className="h-3 shimmer rounded-lg w-1/2" />
            <div className="h-4 shimmer rounded-lg w-1/3 mt-1" />
        </div>
    </div>
);

/* ─────────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────────── */
const ProductCard = ({ product, onClick }) => {
    const id = product.id || product.product_id;
    const title = product.title || product.product_title || "";
    const price = product.price || product.product_price;
    const comparePrice = product.compare_price || product.product_comparable_price;
    const images = product.images || product.product_images || [];
    const hasImage = images.length > 0 && images[0];

    const discount = comparePrice && price
        ? Math.round(((comparePrice - price) / comparePrice) * 100)
        : null;

    return (
        <div
            onClick={onClick}
            className="group bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
            style={{ border: "1px solid #ede8e1" }}
        >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                {hasImage ? (
                    <img
                        src={images[0]}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextSibling.style.display = "flex";
                        }}
                    />
                ) : null}
                <div className="w-full h-full" style={{ display: hasImage ? "none" : "flex" }}>
                    <ProductPlaceholder title={title} />
                </div>

                {discount !== null && discount > 0 && (
                    <span className="absolute top-2 left-2 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: "#16a34a" }}>
                        {discount}% OFF
                    </span>
                )}

                <span className="absolute top-2 right-2 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "rgba(255,255,255,0.85)" }}>
                    <Tag size={11} style={{ color: "#d97706" }} />
                </span>
            </div>

            {/* Info */}
            <div className="p-3">
                <h3 className="text-sm font-semibold leading-tight line-clamp-2 mb-1.5 group-hover:text-amber-700 transition-colors"
                    style={{ color: "#2e1f0e", fontFamily: "'Georgia', serif" }}>
                    {title}
                </h3>

                <div className="flex items-end gap-2">
                    <span className="font-bold text-base" style={{ color: "#d97706" }}>
                        ₹{Number(price).toLocaleString("en-IN")}
                    </span>
                    {comparePrice && comparePrice > price && (
                        <span className="text-xs line-through" style={{ color: "#b8a090" }}>
                            ₹{Number(comparePrice).toLocaleString("en-IN")}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const CollectionPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [collection, setCollection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [headerScrolled, setHeaderScrolled] = useState(false);

    /* ── Shrink header on scroll ── */
    useEffect(() => {
        const handleScroll = () => setHeaderScrolled(window.scrollY > 60);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    /* ── Fetch ── */
    useEffect(() => {
        const fetchCollection = async () => {
            try {
                setLoading(true);
                setError("");

                const cacheKey = `collection_${id}`;
                const cached = sessionStorage.getItem(cacheKey);
                if (cached) {
                    setCollection(JSON.parse(cached));
                    setLoading(false);
                    return;
                }

                const res = await fetch(`https://no-wheels-1.onrender.com/user/collection/${id}`);
                const raw = await res.json();
                const data = Array.isArray(raw) ? raw[0] : raw;

                if (data?.status === "success") {
                    setCollection(data.data);
                    sessionStorage.setItem(cacheKey, JSON.stringify(data.data));
                } else {
                    setError(data?.message || "Collection not found");
                }
            } catch {
                setError("Failed to load collection");
            } finally {
                setLoading(false);
            }
        };
        fetchCollection();
    }, [id]);

    const products = collection?.products || [];
    const coverImage = collection?.collection_image || collection?.image_url || null;

    /* ─── ERROR STATE ─── */
    if (!loading && (error || !collection)) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4"
                style={{ background: "#f7f4ef", fontFamily: "'Georgia', serif" }}>
                <Layers size={40} style={{ color: "#d4c5b4" }} />
                <p className="text-sm" style={{ color: "#b8a090" }}>
                    {error || "Collection not found"}
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl transition-colors"
                    style={{ background: "#fff", color: "#d97706", border: "1px solid #fde68a" }}
                >
                    <ArrowLeft size={14} /> Go Home
                </button>
            </div>
        );
    }

    /* ─── RENDER ─── */
    return (
        <div className="min-h-screen" style={{ background: "#f7f4ef", fontFamily: "'Georgia', serif" }}>
            <style>{`
        @keyframes shimmer {
          0% { background-position: -800px 0; }
          100% { background-position: 800px 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, #ede8e1 25%, #e0d9d1 50%, #ede8e1 75%);
          background-size: 800px 100%;
          animation: shimmer 1.6s infinite;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

            {/* ── STICKY BACK BAR (appears after scroll) ── */}
            <div
                className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center gap-3 transition-all duration-300"
                style={{
                    background: headerScrolled ? "rgba(247,244,239,0.95)" : "transparent",
                    backdropFilter: headerScrolled ? "blur(10px)" : "none",
                    borderBottom: headerScrolled ? "1px solid #ede8e1" : "1px solid transparent",
                }}
            >
                <button
                    onClick={() => navigate(-1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                    style={{
                        background: headerScrolled ? "transparent" : "rgba(255,255,255,0.85)",
                        color: "#6b4f2a",
                    }}
                >
                    <ArrowLeft size={18} />
                </button>

                {headerScrolled && !loading && (
                    <span className="font-semibold text-sm truncate" style={{ color: "#2e1f0e" }}>
                        {collection?.collection_name}
                    </span>
                )}
            </div>

            {/* ── HERO BANNER ── */}
            {loading ? (
                <div className="w-full h-52 shimmer" />
            ) : (
                <div className="relative w-full h-52 overflow-hidden">
                    {coverImage ? (
                        <img src={coverImage} alt={collection.collection_name}
                            className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full"
                            style={{ background: "linear-gradient(135deg, #fde68a 0%, #fbbf24 50%, #f59e0b 100%)" }} />
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0"
                        style={{ background: "linear-gradient(to top, rgba(46,31,14,0.65) 0%, transparent 60%)" }} />

                    {/* Title over banner */}
                    <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
                        <h1 className="text-2xl font-bold text-white leading-tight">
                            {collection?.collection_name}
                        </h1>
                        <p className="text-white/70 text-xs mt-0.5">
                            {products.length} product{products.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>
            )}

            {/* ── CONTENT ── */}
            <div className="max-w-2xl mx-auto px-4 pt-5 pb-16">

                {/* Description */}
                {!loading && collection?.collection_desc && (
                    <div className="mb-5 px-4 py-3 rounded-2xl"
                        style={{ background: "#fff", border: "1px solid #ede8e1" }}>
                        <p className="text-sm leading-relaxed line-clamp-3" style={{ color: "#6b4f2a" }}>
                            {collection.collection_desc}
                        </p>
                    </div>
                )}

                {/* Section label */}
                {!loading && (
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1 h-px" style={{ background: "#ede8e1" }} />
                        <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#c4b49e" }}>
                            Products
                        </span>
                        <div className="flex-1 h-px" style={{ background: "#ede8e1" }} />
                    </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {loading
                        ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                        : products.map((p) => {
                            const pid = p.id || p.product_id;
                            return (
                                <ProductCard
                                    key={pid}
                                    product={p}
                                    onClick={() => navigate(`/product/${pid}`)}
                                />
                            );
                        })}
                </div>

                {/* Empty state */}
                {!loading && products.length === 0 && (
                    <div className="text-center py-16">
                        <Package size={40} className="mx-auto mb-3" style={{ color: "#d4c5b4" }} />
                        <p className="text-sm" style={{ color: "#b8a090" }}>
                            No products in this collection yet
                        </p>
                    </div>
                )}

                {/* End marker */}
                {!loading && products.length > 0 && (
                    <p className="text-center text-xs mt-8" style={{ color: "#c4b49e" }}>
                        ✦ End of collection ✦
                    </p>
                )}
            </div>
        </div>
    );
};

export default CollectionPage;