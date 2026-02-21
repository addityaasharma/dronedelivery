import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Tag, Sparkles } from "lucide-react";
import { GiMedicines } from "react-icons/gi";

const ProductPlaceholder = ({ title }) => {
    const hue = [...(title || "X")].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
    const initials = title?.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1"
            style={{ background: `hsl(${hue},30%,92%)` }}>
            <Package size={22} style={{ color: `hsl(${hue},45%,48%)` }} />
            <span className="text-xs font-bold tracking-widest" style={{ color: `hsl(${hue},45%,48%)` }}>{initials}</span>
        </div>
    );
};

const CollectionPlaceholder = ({ name }) => {
    const hue = [...(name || "C")].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
    return (
        <div className="w-full h-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, hsl(${hue},40%,85%), hsl(${hue},50%,75%))` }}>
            <span className="text-lg font-bold" style={{ color: `hsl(${hue},50%,35%)` }}>
                {name?.[0]?.toUpperCase() || "C"}
            </span>
        </div>
    );
};

const CategoryIcon = ({ name }) => {
    const hue = [...(name || "C")].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
    return (
        <div className="w-full h-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, hsl(${hue},35%,88%), hsl(${hue},45%,78%))` }}>
            <GiMedicines size={22} style={{ color: `hsl(${hue},50%,38%)` }} />
        </div>
    );
};

const Shimmer = ({ className, style }) => (
    <div className={`shimmer rounded-2xl ${className}`} style={style} />
);

const ProductCard = ({ product, onClick }) => {
    const title = product.product_title || product.title || "";
    const price = product.product_price || product.price;
    const comparePrice = product.product_comparable_price || product.original_price;
    const images = product.product_images || product.images || [];
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
            </div>

            <div className="p-3">
                <h3 className="text-sm font-semibold leading-tight line-clamp-2 mb-1 group-hover:text-amber-700 transition-colors"
                    style={{ color: "#2e1f0e", fontFamily: "'Georgia', serif" }}>
                    {title}
                </h3>
                <div className="flex items-end justify-between mt-1">
                    <div>
                        <span className="font-bold text-base" style={{ color: "#d97706" }}>
                            ₹{Number(price).toLocaleString("en-IN")}
                        </span>
                        {comparePrice && comparePrice > price && (
                            <span className="text-xs line-through ml-1.5" style={{ color: "#b8a090" }}>
                                ₹{Number(comparePrice).toLocaleString("en-IN")}
                            </span>
                        )}
                    </div>
                    {price >= 499 && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                            style={{ background: "#f0fdf4", color: "#15803d" }}>
                            FREE DEL
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const navigate = useNavigate();

    const [banners, setBanners] = useState([]);
    const [collections, setCollections] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [loadingBanners, setLoadingBanners] = useState(true);
    const [loadingCollections, setLoadingCollections] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);

    /* ── Fetch banners ── */
    useEffect(() => {
        const load = async () => {
            try {
                const cached = sessionStorage.getItem("home_banners");
                if (cached) { setBanners(JSON.parse(cached)); return; }
                const res = await fetch("https://no-wheels-1.onrender.com/user/banner");
                const data = await res.json();
                if (res.ok) {
                    setBanners(data.data || []);
                    sessionStorage.setItem("home_banners", JSON.stringify(data.data || []));
                }
            } finally { setLoadingBanners(false); }
        };
        load();
    }, []);

    /* ── Fetch collections ── */
    useEffect(() => {
        const load = async () => {
            try {
                const cached = sessionStorage.getItem("home_collections");
                if (cached) { setCollections(JSON.parse(cached)); return; }
                const res = await fetch("https://no-wheels-1.onrender.com/user/collection");
                const data = await res.json();
                if (res.ok) {
                    setCollections(data.result || []);
                    sessionStorage.setItem("home_collections", JSON.stringify(data.result || []));
                }
            } finally { setLoadingCollections(false); }
        };
        load();
    }, []);

    /* ── Fetch categories (same API as Header.jsx) ── */
    useEffect(() => {
        const load = async () => {
            try {
                const cached = sessionStorage.getItem("categories");
                if (cached) { setCategories(JSON.parse(cached)); return; }
                const res = await fetch("https://no-wheels-1.onrender.com/user/category");
                const data = await res.json();
                if (res.ok) {
                    setCategories(data.categories || []);
                    sessionStorage.setItem("categories", JSON.stringify(data.categories || []));
                }
            } finally { setLoadingCategories(false); }
        };
        load();
    }, []);

    /* ── Fetch products (ALWAYS FRESH) ── */
    useEffect(() => {
        const load = async () => {
            setLoadingProducts(true);
            try {
                const res = await fetch(
                    "https://no-wheels-1.onrender.com/user/product?limit=12",
                    { credentials: "include", cache: "no-store" }
                );
                const data = await res.json();
                const feed = data.data || data.products || data || [];
                setProducts(feed);
            } catch (err) {
                console.log("Failed to load products", err);
            } finally {
                setLoadingProducts(false);
            }
        };
        load();
    }, []);

    /* ── Auto-slide banners ── */
    useEffect(() => {
        if (banners.length <= 1) return;
        const t = setInterval(() => {
            setCurrentIndex((p) => (p === banners.length - 1 ? 0 : p + 1));
        }, 4000);
        return () => clearInterval(t);
    }, [banners]);

    /* ─── RENDER ─── */
    return (
        <div className="min-h-screen" style={{ background: "#f7f4ef", fontFamily: "'Georgia', serif" }}>
            <style>{`
        @keyframes shimmer {
          0% { background-position: -800px 0; }
          100% { background-position: 800px 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, #ede8e1 25%, #e4ddd5 50%, #ede8e1 75%);
          background-size: 800px 100%;
          animation: shimmer 1.6s infinite;
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .category-card:hover .category-icon-wrap {
          transform: scale(1.08);
          box-shadow: 0 4px 16px rgba(217,119,6,0.18);
        }
      `}</style>

            <main className="max-w-2xl mx-auto px-3 py-4 space-y-6">

                {/* ══ BANNER CAROUSEL ══ */}
                <section>
                    {loadingBanners ? (
                        <Shimmer className="w-full h-44 md:h-64" style={{ borderRadius: 20 }} />
                    ) : banners.length > 0 ? (
                        <div className="relative overflow-hidden shadow-sm" style={{ borderRadius: 20 }}>
                            <div
                                className="flex"
                                style={{
                                    transform: `translateX(-${currentIndex * 100}%)`,
                                    transition: "transform 0.55s cubic-bezier(0.4,0,0.2,1)",
                                }}
                            >
                                {banners.map((banner, idx) => (
                                    <a key={banner.id} href={banner.link} target="_blank" rel="noreferrer"
                                        className="min-w-full block">
                                        <img
                                            src={banner.image_url}
                                            alt={`Banner ${idx + 1}`}
                                            className="w-full h-44 md:h-64 object-cover"
                                        />
                                    </a>
                                ))}
                            </div>
                            {banners.length > 1 && (
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                                    {banners.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentIndex(idx)}
                                            className="h-1.5 rounded-full transition-all duration-300"
                                            style={{
                                                width: currentIndex === idx ? 20 : 6,
                                                background: currentIndex === idx ? "#fff" : "rgba(255,255,255,0.5)",
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="w-full h-44 rounded-2xl flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg, #fde68a, #fbbf24, #f59e0b)" }}>
                            <Sparkles size={32} style={{ color: "#fff" }} />
                        </div>
                    )}
                </section>

                {/* ══ COLLECTIONS ══ */}
                <section>
                    <h2 className="text-base font-bold mb-3" style={{ color: "#2e1f0e", letterSpacing: "0.01em" }}>
                        Shop by Collection
                    </h2>
                    <div className="flex gap-4 overflow-x-auto pb-1 hide-scrollbar">
                        {loadingCollections
                            ? Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="shrink-0 flex flex-col items-center gap-2">
                                    <div className="w-16 h-16 rounded-full shimmer" />
                                    <div className="w-12 h-2.5 rounded shimmer" />
                                </div>
                            ))
                            : collections.map((col) => {
                                const hasImg = col.image_url || col.image || col.cover;
                                return (
                                    <button
                                        key={col.id}
                                        onClick={() => navigate(`/collection/${col.id}`)}
                                        className="shrink-0 flex flex-col items-center gap-1.5 group"
                                        style={{ minWidth: 72 }}
                                    >
                                        <div
                                            className="w-16 h-16 rounded-full overflow-hidden transition-all duration-300 group-hover:scale-105"
                                            style={{
                                                border: "2.5px solid #fde68a",
                                                boxShadow: "0 2px 8px rgba(217,119,6,0.15)",
                                            }}
                                        >
                                            {hasImg ? (
                                                <img
                                                    src={hasImg}
                                                    alt={col.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = "none";
                                                        e.currentTarget.nextSibling.style.display = "flex";
                                                    }}
                                                />
                                            ) : null}
                                            <div style={{ display: hasImg ? "none" : "flex" }} className="w-full h-full">
                                                <CollectionPlaceholder name={col.name} />
                                            </div>
                                        </div>
                                        <span
                                            className="text-center text-[11px] font-semibold leading-tight"
                                            style={{
                                                color: "#4a3728",
                                                maxWidth: 68,
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {col.name}
                                        </span>
                                    </button>
                                );
                            })}
                    </div>
                </section>

                {/* ══ CATEGORIES ══ */}
                <section>
                    <h2 className="text-base font-bold mb-3" style={{ color: "#2e1f0e", letterSpacing: "0.01em" }}>
                        Shop by Category
                    </h2>
                    <div className="flex gap-4 overflow-x-auto pb-1 hide-scrollbar">
                        {loadingCategories
                            ? Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="shrink-0 flex flex-col items-center gap-2">
                                    <div className="w-16 h-16 rounded-2xl shimmer" />
                                    <div className="w-14 h-2.5 rounded shimmer" />
                                </div>
                            ))
                            : categories.length === 0 ? (
                                <p className="text-sm" style={{ color: "#b8a090" }}>No categories found</p>
                            ) : (
                                categories.map((cat) => (
                                    <button
                                        key={cat.category_id}
                                        onClick={() => navigate(`/category/${cat.category_id}/${cat.category_slug}`)}
                                        className="category-card shrink-0 flex flex-col items-center gap-1.5 group"
                                        style={{ minWidth: 72 }}
                                    >
                                        <div
                                            className="category-icon-wrap w-16 h-16 rounded-2xl overflow-hidden transition-all duration-300"
                                            style={{
                                                border: "2px solid #e8dfd5",
                                                boxShadow: "0 2px 8px rgba(180,140,100,0.12)",
                                            }}
                                        >
                                            {cat.category_image ? (
                                                <img
                                                    src={cat.category_image}
                                                    alt={cat.category_name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = "none";
                                                        e.currentTarget.nextSibling.style.display = "flex";
                                                    }}
                                                />
                                            ) : null}
                                            <div
                                                className="w-full h-full"
                                                style={{ display: cat.category_image ? "none" : "flex" }}
                                            >
                                                <CategoryIcon name={cat.category_name} />
                                            </div>
                                        </div>
                                        <span
                                            className="text-center text-[11px] font-semibold leading-tight transition-colors group-hover:text-amber-700"
                                            style={{
                                                color: "#4a3728",
                                                maxWidth: 68,
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {cat.category_name}
                                        </span>
                                    </button>
                                ))
                            )}
                    </div>
                </section>

                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px" style={{ background: "#ede8e1" }} />
                    <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#c4b49e" }}>
                        For You
                    </span>
                    <div className="flex-1 h-px" style={{ background: "#ede8e1" }} />
                </div>

                {/* ══ PRODUCTS GRID ══ */}
                <section>
                    <div className="flex items-baseline justify-between mb-3">
                        <h2 className="text-base font-bold" style={{ color: "#2e1f0e" }}>
                            Recommended for You
                        </h2>
                        <p className="text-xs" style={{ color: "#b8a090" }}>
                            Based on your history
                        </p>
                    </div>

                    {loadingProducts ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Shimmer key={i} className="h-64" />
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-12">
                            <Package size={36} className="mx-auto mb-2" style={{ color: "#d4c5b4" }} />
                            <p className="text-sm" style={{ color: "#b8a090" }}>No products yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {products.map((p) => (
                                <ProductCard
                                    key={p.product_id || p.id}
                                    product={p}
                                    onClick={() => navigate(`/product/${p.product_uniqueCode}/${p.product_slug}`)}
                                />
                            ))}
                        </div>
                    )}
                </section>

                <div className="h-6" />
            </main>
        </div>
    );
};

export default Dashboard;