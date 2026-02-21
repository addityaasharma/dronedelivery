import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Sparkles, Zap, Shield, Clock, Truck, Star, ChevronRight, Gift } from "lucide-react";
import { GiMedicines } from "react-icons/gi";
import { FiBell } from "react-icons/fi";
import Footer from "../seopages/Footer";

/* ═══════════════════════════════════════
   PLACEHOLDERS
═══════════════════════════════════════ */
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
    <div className={`shimmer ${className}`} style={style} />
);

/* ═══════════════════════════════════════
   SECTION HEADER
═══════════════════════════════════════ */
const SectionHeader = ({ title, subtitle, onViewAll }) => (
    <div className="flex items-baseline justify-between mb-4">
        <div>
            <h2 className="text-lg font-bold" style={{ color: "#2e1f0e", fontFamily: "'Georgia', serif" }}>{title}</h2>
            {subtitle && <p className="text-xs mt-0.5" style={{ color: "#b8a090" }}>{subtitle}</p>}
        </div>
        {onViewAll && (
            <button onClick={onViewAll}
                className="flex items-center gap-0.5 text-xs font-semibold transition-colors hover:text-amber-800"
                style={{ color: "#d97706" }}>
                View all <ChevronRight size={14} />
            </button>
        )}
    </div>
);

/* ═══════════════════════════════════════
   PRODUCT CARD
═══════════════════════════════════════ */
const ProductCard = ({ product, onClick }) => {
    const title = product.product_title || product.title || "";
    const price = product.product_price || product.price;
    const comparePrice = product.product_comparable_price || product.original_price;
    const images = product.product_images || product.images || [];
    const hasImage = images.length > 0 && images[0];
    const discount = comparePrice && price
        ? Math.round(((comparePrice - price) / comparePrice) * 100) : null;

    return (
        <div onClick={onClick}
            className="group bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            style={{ border: "1px solid #ede8e1" }}>
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                {hasImage ? (
                    <img src={images[0]} alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }} />
                ) : null}
                <div className="w-full h-full" style={{ display: hasImage ? "none" : "flex" }}>
                    <ProductPlaceholder title={title} />
                </div>
                {discount !== null && discount > 0 && (
                    <span className="absolute top-2 left-2 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: "#16a34a" }}>{discount}% OFF</span>
                )}
            </div>
            <div className="p-3">
                <h3 className="text-sm font-semibold leading-tight line-clamp-2 mb-1 group-hover:text-amber-700 transition-colors"
                    style={{ color: "#2e1f0e", fontFamily: "'Georgia', serif" }}>{title}</h3>
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
                            style={{ background: "#f0fdf4", color: "#15803d" }}>FREE DEL</span>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════
   FLASH DEAL CARD
═══════════════════════════════════════ */
const FlashCard = ({ product, onClick }) => {
    const title = product.product_title || product.title || "";
    const price = product.product_price || product.price;
    const comparePrice = product.product_comparable_price || product.original_price;
    const images = product.product_images || product.images || [];
    const hasImage = images.length > 0 && images[0];
    const discount = comparePrice && price
        ? Math.round(((comparePrice - price) / comparePrice) * 100) : null;

    return (
        <div onClick={onClick}
            className="group shrink-0 bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex flex-col"
            style={{ width: 148, border: "1px solid #ede8e1" }}>
            <div className="relative overflow-hidden bg-gray-50" style={{ height: 128 }}>
                {hasImage ? (
                    <img src={images[0]} alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }} />
                ) : null}
                <div className="w-full h-full" style={{ display: hasImage ? "none" : "flex" }}>
                    <ProductPlaceholder title={title} />
                </div>
                {discount !== null && discount > 0 && (
                    <span className="absolute top-1.5 left-1.5 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: "#dc2626" }}>{discount}% OFF</span>
                )}
            </div>
            <div className="p-2 flex flex-col flex-1">
                <h3 className="text-xs font-semibold leading-tight line-clamp-2 mb-1"
                    style={{ color: "#2e1f0e", fontFamily: "'Georgia', serif" }}>{title}</h3>
                <div className="mt-auto">
                    <span className="font-bold text-sm" style={{ color: "#d97706" }}>
                        ₹{Number(price).toLocaleString("en-IN")}
                    </span>
                    {comparePrice && comparePrice > price && (
                        <span className="text-[10px] line-through ml-1" style={{ color: "#b8a090" }}>
                            ₹{Number(comparePrice).toLocaleString("en-IN")}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════
   COUNTDOWN TIMER
═══════════════════════════════════════ */
const useCountdown = (hours = 5) => {
    const end = useRef(Date.now() + hours * 60 * 60 * 1000);
    const [time, setTime] = useState({ h: hours, m: 0, s: 0 });
    useEffect(() => {
        const tick = () => {
            const diff = Math.max(0, end.current - Date.now());
            setTime({ h: Math.floor(diff / 3_600_000), m: Math.floor((diff % 3_600_000) / 60_000), s: Math.floor((diff % 60_000) / 1_000) });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);
    return time;
};

/* ═══════════════════════════════════════
   HEALTH TIPS MARQUEE
═══════════════════════════════════════ */
const HEALTH_TIPS = [
    "💊 Always complete your prescribed course of antibiotics",
    "🌿 Store medicines in a cool, dry place away from sunlight",
    "💧 Stay hydrated — drink at least 8 glasses of water daily",
    "🩺 Regular health check-ups can detect issues early",
    "🚫 Never self-medicate without consulting a doctor",
    "🌙 Good sleep boosts immunity naturally",
    "🥗 A balanced diet is the best medicine",
    "🏃 30 minutes of daily exercise improves heart health",
];

const HealthTipsMarquee = () => (
    <div className="overflow-hidden relative py-3" style={{ background: "linear-gradient(90deg,#fef3c7,#fde68a,#fef3c7)", borderRadius: 16 }}>
        <div className="marquee-track">
            {[...HEALTH_TIPS, ...HEALTH_TIPS].map((tip, i) => (
                <span key={i} className="text-xs font-semibold shrink-0" style={{ color: "#92400e" }}>{tip}</span>
            ))}
        </div>
    </div>
);

/* ═══════════════════════════════════════
   WHY CHOOSE US
═══════════════════════════════════════ */
const WHY_US = [
    { icon: <Truck size={20} />, title: "Free Delivery", sub: "Orders above ₹499", color: "#0ea5e9" },
    { icon: <Shield size={20} />, title: "100% Genuine", sub: "Licensed pharmacy", color: "#10b981" },
    { icon: <Clock size={20} />, title: "Same Day", sub: "Delivery in 4–6 hrs", color: "#f59e0b" },
    { icon: <Star size={20} />, title: "Top Rated", sub: "4.8★ by 10k+ users", color: "#8b5cf6" },
];

/* ═══════════════════════════════════════
   OFFERS DATA
═══════════════════════════════════════ */
const OFFERS = [
    { title: "First Order", sub: "Flat 20% off on your first order", code: "FIRST20", gradient: "linear-gradient(135deg,#667eea,#764ba2)", emoji: "🎁" },
    { title: "Free Delivery", sub: "Free shipping on orders above ₹499", code: "FREEDEL", gradient: "linear-gradient(135deg,#f093fb,#f5576c)", emoji: "🚚" },
    { title: "Refer & Earn", sub: "Earn ₹100 for every friend you refer", code: "REFER100", gradient: "linear-gradient(135deg,#4facfe,#00f2fe)", emoji: "🤝" },
];

/* ═══════════════════════════════════════
   NEWSLETTER
═══════════════════════════════════════ */
const Newsletter = () => {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    return (
        <div className="rounded-3xl overflow-hidden relative p-6 sm:p-8"
            style={{ background: "linear-gradient(135deg,#2e1f0e 0%,#4a2f12 50%,#6b4423 100%)" }}>
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
                style={{ background: "#fbbf24", transform: "translate(30%,-30%)" }} />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10"
                style={{ background: "#fbbf24", transform: "translate(-30%,30%)" }} />
            <div className="relative z-10 max-w-md mx-auto text-center">
                <FiBell size={28} style={{ color: "#fde68a", margin: "0 auto 12px" }} />
                <h3 className="text-xl font-bold mb-1" style={{ color: "#fde68a", fontFamily: "'Georgia', serif" }}>Stay in the Loop</h3>
                <p className="text-sm mb-5" style={{ color: "#c4a06a" }}>Get exclusive deals, health tips & early access to new medicines</p>
                {sent ? (
                    <div className="py-3 px-6 rounded-full inline-block"
                        style={{ background: "rgba(251,191,36,0.15)", border: "1px solid #fbbf24" }}>
                        <span className="text-sm font-semibold" style={{ color: "#fde68a" }}>✅ You're subscribed!</span>
                    </div>
                ) : (
                    <div className="flex gap-2 max-w-sm mx-auto">
                        <input type="email" placeholder="your@email.com" value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
                            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(251,191,36,0.3)", color: "#fff", fontFamily: "'Georgia',serif" }} />
                        <button onClick={() => email && setSent(true)}
                            className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
                            style={{ background: "#fbbf24", color: "#2e1f0e" }}>
                            Subscribe
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════ */
const Dashboard = () => {
    const navigate = useNavigate();
    const timer = useCountdown(5);

    const [banners, setBanners] = useState([]);
    const [collections, setCollections] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [loadingBanners, setLoadingBanners] = useState(true);
    const [loadingCollections, setLoadingCollections] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const cached = sessionStorage.getItem("home_banners");
                if (cached) { setBanners(JSON.parse(cached)); return; }
                const res = await fetch("https://no-wheels-1.onrender.com/user/banner");
                const data = await res.json();
                if (res.ok) { setBanners(data.data || []); sessionStorage.setItem("home_banners", JSON.stringify(data.data || [])); }
            } finally { setLoadingBanners(false); }
        };
        load();
    }, []);

    useEffect(() => {
        const load = async () => {
            try {
                const cached = sessionStorage.getItem("home_collections");
                if (cached) { setCollections(JSON.parse(cached)); return; }
                const res = await fetch("https://no-wheels-1.onrender.com/user/collection");
                const data = await res.json();
                if (res.ok) { setCollections(data.result || []); sessionStorage.setItem("home_collections", JSON.stringify(data.result || [])); }
            } finally { setLoadingCollections(false); }
        };
        load();
    }, []);

    useEffect(() => {
        const load = async () => {
            try {
                const cached = sessionStorage.getItem("categories");
                if (cached) { setCategories(JSON.parse(cached)); return; }
                const res = await fetch("https://no-wheels-1.onrender.com/user/category");
                const data = await res.json();
                if (res.ok) { setCategories(data.categories || []); sessionStorage.setItem("categories", JSON.stringify(data.categories || [])); }
            } finally { setLoadingCategories(false); }
        };
        load();
    }, []);

    useEffect(() => {
        const load = async () => {
            setLoadingProducts(true);
            try {
                const res = await fetch("https://no-wheels-1.onrender.com/user/product?limit=12", { credentials: "include", cache: "no-store" });
                const data = await res.json();
                setProducts(data.data || data.products || data || []);
            } catch (err) { console.log("Failed to load products", err); }
            finally { setLoadingProducts(false); }
        };
        load();
    }, []);

    useEffect(() => {
        if (banners.length <= 1) return;
        const t = setInterval(() => setCurrentIndex((p) => (p === banners.length - 1 ? 0 : p + 1)), 4000);
        return () => clearInterval(t);
    }, [banners]);

    const flashProducts = products.filter((_, i) => i % 3 === 0).slice(0, 6);
    const trendingProducts = products.filter((_, i) => i % 3 === 1).slice(0, 6);
    const mainProducts = products.slice(0, 12);
    const pad = (n) => String(n).padStart(2, "0");

    return (
        <div className="min-h-screen" style={{ background: "#f7f4ef", fontFamily: "'Georgia', serif" }}>
            <style>{`
        @keyframes shimmer { 0%{background-position:-800px 0} 100%{background-position:800px 0} }
        .shimmer {
          background: linear-gradient(90deg,#ede8e1 25%,#e4ddd5 50%,#ede8e1 75%);
          background-size: 800px 100%;
          animation: shimmer 1.6s infinite;
          border-radius: 16px;
        }
        .hide-scrollbar::-webkit-scrollbar{display:none}
        .hide-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
        .line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        .category-card:hover .category-icon-wrap{transform:scale(1.08);box-shadow:0 4px 16px rgba(217,119,6,0.22)}
        @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        .marquee-track{animation:marquee 35s linear infinite;display:flex;gap:2.5rem;white-space:nowrap;width:max-content}
      `}</style>

            <main className="mx-auto px-4 py-6 space-y-8 pb-28 sm:pb-10" style={{ maxWidth: 1200 }}>

                {/* ══ HERO: Banner + Sidebar (desktop split) ══ */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}
                    className="lg-hero-grid">
                    <style>{`@media(min-width:1024px){.lg-hero-grid{grid-template-columns:2fr 1fr!important}}`}</style>

                    {/* Carousel */}
                    <section>
                        {loadingBanners ? (
                            <Shimmer className="w-full" style={{ height: "clamp(180px,28vw,320px)" }} />
                        ) : banners.length > 0 ? (
                            <div className="relative overflow-hidden shadow-md" style={{ borderRadius: 24 }}>
                                <div className="flex" style={{ transform: `translateX(-${currentIndex * 100}%)`, transition: "transform 0.55s cubic-bezier(0.4,0,0.2,1)" }}>
                                    {banners.map((banner, idx) => (
                                        <a key={banner.id} href={banner.link} target="_blank" rel="noreferrer" className="min-w-full block">
                                            <img src={banner.image_url} alt={`Banner ${idx + 1}`}
                                                className="w-full object-cover" style={{ height: "clamp(180px,28vw,320px)" }} />
                                        </a>
                                    ))}
                                </div>
                                {banners.length > 1 && (
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                        {banners.map((_, idx) => (
                                            <button key={idx} onClick={() => setCurrentIndex(idx)}
                                                className="h-1.5 rounded-full transition-all duration-300"
                                                style={{ width: currentIndex === idx ? 20 : 6, background: currentIndex === idx ? "#fff" : "rgba(255,255,255,0.5)" }} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="w-full rounded-3xl flex items-center justify-center"
                                style={{ height: "clamp(180px,28vw,320px)", background: "linear-gradient(135deg,#fde68a,#fbbf24,#f59e0b)" }}>
                                <Sparkles size={40} style={{ color: "#fff" }} />
                            </div>
                        )}
                    </section>

                    {/* Desktop sidebar quick offers — hidden on mobile */}
                    <aside style={{ display: "none" }} className="lg-sidebar-show">
                        <style>{`@media(min-width:1024px){.lg-sidebar-show{display:flex!important;flex-direction:column;gap:0.75rem}}`}</style>
                        {[
                            { emoji: "🎁", title: "New User Deal", desc: "Flat 20% off first order", code: "FIRST20", bg: "linear-gradient(135deg,#e0e7ff,#c7d2fe)" },
                            { emoji: "🚀", title: "Express Delivery", desc: "Order by 3 PM for same-day", code: null, bg: "linear-gradient(135deg,#d1fae5,#a7f3d0)" },
                            { emoji: "💊", title: "Bulk Saver", desc: "Buy 3+ medicines, save 15%", code: "BULK15", bg: "linear-gradient(135deg,#fef3c7,#fde68a)" },
                        ].map(({ emoji, title, desc, code, bg }) => (
                            <div key={title} className="rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:scale-[1.02] transition-transform"
                                style={{ background: bg, border: "1px solid rgba(0,0,0,0.05)" }}>
                                <span className="text-2xl">{emoji}</span>
                                <div className="flex-1">
                                    <p className="text-sm font-bold" style={{ color: "#2e1f0e" }}>{title}</p>
                                    <p className="text-xs" style={{ color: "#6b4f2a" }}>{desc}</p>
                                </div>
                                {code && (
                                    <span className="text-[10px] font-bold px-2 py-1 rounded-lg"
                                        style={{ background: "rgba(255,255,255,0.6)", color: "#2e1f0e", fontFamily: "monospace" }}>
                                        {code}
                                    </span>
                                )}
                            </div>
                        ))}
                    </aside>
                </div>

                {/* ══ HEALTH TIPS ══ */}
                <HealthTipsMarquee />

                {/* ══ WHY CHOOSE US ══ */}
                <section>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {WHY_US.map(({ icon, title, sub, color }) => (
                            <div key={title} className="bg-white rounded-2xl p-4 flex flex-col items-center text-center gap-2 hover:shadow-md transition-shadow"
                                style={{ border: "1px solid #ede8e1" }}>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: `${color}18`, color }}>
                                    {icon}
                                </div>
                                <p className="text-xs font-bold" style={{ color: "#2e1f0e" }}>{title}</p>
                                <p className="text-[10px]" style={{ color: "#b8a090" }}>{sub}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ══ COLLECTIONS ══ */}
                <section>
                    <SectionHeader title="Shop by Collection" subtitle="Curated for your needs" />
                    <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
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
                                    <button key={col.id} onClick={() => navigate(`/collection/${col.id}`)}
                                        className="shrink-0 flex flex-col items-center gap-1.5 group" style={{ minWidth: 80 }}>
                                        <div className="w-16 h-16 rounded-full overflow-hidden transition-all duration-300 group-hover:scale-110"
                                            style={{ border: "2.5px solid #fde68a", boxShadow: "0 2px 8px rgba(217,119,6,0.15)" }}>
                                            {hasImg ? <img src={hasImg} alt={col.name} className="w-full h-full object-cover"
                                                onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }} /> : null}
                                            <div style={{ display: hasImg ? "none" : "flex" }} className="w-full h-full">
                                                <CollectionPlaceholder name={col.name} />
                                            </div>
                                        </div>
                                        <span className="text-center text-[11px] font-semibold leading-tight"
                                            style={{ color: "#4a3728", maxWidth: 72, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                            {col.name}
                                        </span>
                                    </button>
                                );
                            })}
                    </div>
                </section>

                {/* ══ CATEGORIES ══ */}
                <section>
                    <SectionHeader title="Shop by Category" subtitle="Find medicines by type" />
                    <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                        {loadingCategories
                            ? Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="shrink-0 flex flex-col items-center gap-2">
                                    <div className="w-16 h-16 rounded-2xl shimmer" />
                                    <div className="w-14 h-2.5 rounded shimmer" />
                                </div>
                            ))
                            : categories.map((cat) => (
                                <button key={cat.category_id}
                                    onClick={() => navigate(`/category/${cat.category_id}/${cat.category_slug}`)}
                                    className="category-card shrink-0 flex flex-col items-center gap-1.5 group" style={{ minWidth: 80 }}>
                                    <div className="category-icon-wrap w-16 h-16 rounded-2xl overflow-hidden transition-all duration-300"
                                        style={{ border: "2px solid #e8dfd5", boxShadow: "0 2px 8px rgba(180,140,100,0.12)" }}>
                                        {cat.category_image ? <img src={cat.category_image} alt={cat.category_name} className="w-full h-full object-cover"
                                            onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }} /> : null}
                                        <div className="w-full h-full" style={{ display: cat.category_image ? "none" : "flex" }}>
                                            <CategoryIcon name={cat.category_name} />
                                        </div>
                                    </div>
                                    <span className="text-center text-[11px] font-semibold leading-tight transition-colors group-hover:text-amber-700"
                                        style={{ color: "#4a3728", maxWidth: 72, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                        {cat.category_name}
                                    </span>
                                </button>
                            ))}
                    </div>
                </section>

                {/* ══ FLASH DEALS ══ */}
                {!loadingProducts && flashProducts.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Zap size={18} style={{ color: "#dc2626" }} />
                                <h2 className="text-lg font-bold" style={{ color: "#2e1f0e", fontFamily: "'Georgia', serif" }}>Flash Deals</h2>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold" style={{ color: "#6b4f2a" }}>Ends in</span>
                                {[pad(timer.h), pad(timer.m), pad(timer.s)].map((unit, i) => (
                                    <React.Fragment key={i}>
                                        {i > 0 && <span className="text-xs font-black" style={{ color: "#dc2626" }}>:</span>}
                                        <span className="text-xs font-black px-1.5 py-0.5 rounded-lg tabular-nums"
                                            style={{ background: "#dc2626", color: "#fff", minWidth: 26, textAlign: "center", display: "inline-block" }}>
                                            {unit}
                                        </span>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                            {flashProducts.map((p) => (
                                <FlashCard key={p.product_id || p.id} product={p}
                                    onClick={() => navigate(`/product/${p.product_uniqueCode}/${p.product_slug}`)} />
                            ))}
                        </div>
                    </section>
                )}

                {/* ══ EXCLUSIVE OFFERS ══ */}
                <section>
                    <SectionHeader title="Exclusive Offers" subtitle="Limited time deals just for you" />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {OFFERS.map(({ title, sub, code, gradient, emoji }) => (
                            <div key={title} className="rounded-2xl p-5 relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
                                style={{ background: gradient }}>
                                <div className="absolute top-2 right-3 text-5xl opacity-20 select-none">{emoji}</div>
                                <p className="text-2xl mb-1">{emoji}</p>
                                <h3 className="text-base font-bold text-white mb-1">{title}</h3>
                                <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.8)" }}>{sub}</p>
                                {code && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl"
                                        style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(8px)" }}>
                                        <Gift size={11} style={{ color: "#fff" }} />
                                        <span className="text-xs font-black tracking-widest text-white" style={{ fontFamily: "monospace" }}>{code}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* ══ DIVIDER ══ */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px" style={{ background: "#ede8e1" }} />
                    <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#c4b49e" }}>For You</span>
                    <div className="flex-1 h-px" style={{ background: "#ede8e1" }} />
                </div>

                {/* ══ RECOMMENDED PRODUCTS ══ */}
                <section>
                    <SectionHeader title="Recommended for You" subtitle="Based on your browsing history"
                        onViewAll={() => navigate("/search")} />
                    {loadingProducts ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {Array.from({ length: 8 }).map((_, i) => <Shimmer key={i} style={{ height: 260 }} />)}
                        </div>
                    ) : mainProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <Package size={36} className="mx-auto mb-2" style={{ color: "#d4c5b4" }} />
                            <p className="text-sm" style={{ color: "#b8a090" }}>No products yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {mainProducts.map((p) => (
                                <ProductCard key={p.product_id || p.id} product={p}
                                    onClick={() => navigate(`/product/${p.product_uniqueCode}/${p.product_slug}`)} />
                            ))}
                        </div>
                    )}
                </section>

                {/* ══ TRENDING NOW ══ */}
                {!loadingProducts && trendingProducts.length > 0 && (
                    <section>
                        <SectionHeader title="🔥 Trending Now" subtitle="Most purchased this week" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {trendingProducts.map((p, idx) => {
                                const title = p.product_title || p.title || "";
                                const price = p.product_price || p.price;
                                const images = p.product_images || p.images || [];
                                const hasImage = images.length > 0 && images[0];
                                return (
                                    <div key={p.product_id || p.id}
                                        onClick={() => navigate(`/product/${p.product_uniqueCode}/${p.product_slug}`)}
                                        className="group bg-white rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:shadow-lg transition-all duration-300"
                                        style={{ border: "1px solid #ede8e1" }}>
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-black text-sm"
                                            style={{ background: idx < 3 ? "#fbbf24" : "#ede8e1", color: idx < 3 ? "#2e1f0e" : "#9e8a74" }}>
                                            {idx + 1}
                                        </div>
                                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-50">
                                            {hasImage
                                                ? <img src={images[0]} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    onError={(e) => { e.currentTarget.style.display = "none"; }} />
                                                : <ProductPlaceholder title={title} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-amber-700 transition-colors"
                                                style={{ color: "#2e1f0e", fontFamily: "'Georgia', serif" }}>{title}</p>
                                            <p className="text-sm font-bold mt-1" style={{ color: "#d97706" }}>
                                                ₹{Number(price).toLocaleString("en-IN")}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* ══ APP DOWNLOAD BANNER ══ */}
                <section className="rounded-3xl overflow-hidden relative p-6 sm:p-8"
                    style={{ background: "linear-gradient(135deg,#1e3a5f 0%,#2d6a4f 100%)" }}>
                    <div className="absolute inset-0 opacity-5"
                        style={{ backgroundImage: "radial-gradient(circle at 20px 20px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
                    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#74c69d" }}>Download App</p>
                            <h3 className="text-xl font-bold mb-2" style={{ color: "#fff", fontFamily: "'Georgia', serif" }}>
                                Get medicines faster<br />with our app
                            </h3>
                            <p className="text-sm" style={{ color: "#95d5b2" }}>Real-time tracking · Exclusive app offers · Instant refills</p>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                            {["🍎 App Store", "🤖 Google Play"].map((store) => (
                                <button key={store} className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                                    style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}>
                                    {store}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══ NEWSLETTER ══ */}
                <Newsletter />

                <div className="h-4" />
            </main>

            <Footer />
        </div>
    );
};

export default Dashboard;