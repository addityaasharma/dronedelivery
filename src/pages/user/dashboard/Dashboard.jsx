import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Zap, Shield, Clock, Truck, Star, ChevronRight, Gift } from "lucide-react";
import { GiMedicines } from "react-icons/gi";
import { backend_api } from "../../../api";

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Lato', sans-serif; background: #f0f2f2; }
  .hide-scroll::-webkit-scrollbar { display: none; }
  .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
  .clamp2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
  @keyframes shimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
  .sk { background:linear-gradient(90deg,#e8e8e8 25%,#f5f5f5 50%,#e8e8e8 75%); background-size:600px 100%; animation:shimmer 1.4s infinite; border-radius:4px; }
  @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  .marquee-inner { animation:marquee 40s linear infinite; display:flex; gap:3rem; white-space:nowrap; width:max-content; }
  .prod-card:hover { box-shadow:0 2px 8px rgba(0,0,0,0.18); }
  .prod-card:hover .prod-img { transform:scale(1.04); }
  .prod-img { transition:transform 0.3s ease; }
`;

const Sk = ({ w, h, r = 4, style = {} }) => (
    <div className="sk" style={{ width: w, height: h, borderRadius: r, flexShrink: 0, ...style }} />
);

const ProductPlaceholder = ({ title = "" }) => {
    const hue = [...title].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
    const initials = title.split(" ").slice(0, 2).map(w => w[0]?.toUpperCase()).join("") || "?";
    return (
        <div style={{ width: "100%", height: "100%", background: `hsl(${hue},25%,93%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <Package size={20} style={{ color: `hsl(${hue},40%,52%)` }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: `hsl(${hue},40%,52%)`, letterSpacing: 1 }}>{initials}</span>
        </div>
    );
};

const CategoryFallback = ({ name = "" }) => {
    const hue = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
    return (
        <div style={{ width: "100%", height: "100%", background: `hsl(${hue},30%,92%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GiMedicines size={20} style={{ color: `hsl(${hue},45%,44%)` }} />
        </div>
    );
};

const Section = ({ children, style = {} }) => (
    <div style={{ background: "#fff", padding: "16px", ...style }}>{children}</div>
);

const SectionTitle = ({ text, sub, onAll }) => (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#0f1111", letterSpacing: "-0.3px" }}>{text}</span>
            {sub && <span style={{ fontSize: 12, color: "#565959", marginLeft: 8 }}>{sub}</span>}
        </div>
        {onAll && (
            <button onClick={onAll} style={{ fontSize: 13, color: "#007185", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 2, fontFamily: "inherit" }}>
                See all <ChevronRight size={13} />
            </button>
        )}
    </div>
);

const ProductCard = ({ product, onClick }) => {
    const [imgErr, setImgErr] = useState(false);
    const title = product.product_title || product.title || "";
    const price = product.product_price || product.price;
    const comparePrice = product.product_comparable_price || product.original_price;
    const images = product.product_images || product.images || [];
    const img = images[0];
    const discount = comparePrice && price ? Math.round(((comparePrice - price) / comparePrice) * 100) : null;

    return (
        <div className="prod-card" onClick={onClick} style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 8, overflow: "hidden", cursor: "pointer", transition: "box-shadow 0.2s" }}>
            <div style={{ height: 160, background: "#f7f8f8", overflow: "hidden", position: "relative" }}>
                {img && !imgErr
                    ? <img src={img} alt={title} className="prod-img" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }} onError={() => setImgErr(true)} />
                    : <ProductPlaceholder title={title} />}
                {discount > 0 && (
                    <span style={{ position: "absolute", top: 6, left: 6, background: "#cc0c39", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 2 }}>-{discount}%</span>
                )}
            </div>
            <div style={{ padding: "10px 10px 12px" }}>
                <p className="clamp2" style={{ fontSize: 13, color: "#0f1111", lineHeight: 1.4, marginBottom: 6, minHeight: 36 }}>{title}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#b12704" }}>₹{Number(price).toLocaleString("en-IN")}</span>
                    {comparePrice > price && <span style={{ fontSize: 12, color: "#565959", textDecoration: "line-through" }}>₹{Number(comparePrice).toLocaleString("en-IN")}</span>}
                </div>
                {price >= 499 && <p style={{ fontSize: 11, color: "#007600", marginTop: 3 }}>FREE Delivery</p>}
            </div>
        </div>
    );
};

const FlashCard = ({ product, onClick }) => {
    const [imgErr, setImgErr] = useState(false);
    const title = product.product_title || product.title || "";
    const price = product.product_price || product.price;
    const comparePrice = product.product_comparable_price || product.original_price;
    const images = product.product_images || product.images || [];
    const img = images[0];
    const discount = comparePrice && price ? Math.round(((comparePrice - price) / comparePrice) * 100) : null;

    return (
        <div onClick={onClick} className="prod-card" style={{ width: 144, flexShrink: 0, cursor: "pointer", border: "1px solid #e7e7e7", borderRadius: 8, overflow: "hidden", background: "#fff", transition: "box-shadow 0.2s" }}>
            <div style={{ height: 120, background: "#f7f8f8", position: "relative", overflow: "hidden" }}>
                {img && !imgErr
                    ? <img src={img} alt={title} className="prod-img" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 6 }} onError={() => setImgErr(true)} />
                    : <ProductPlaceholder title={title} />}
                {discount > 0 && (
                    <span style={{ position: "absolute", top: 4, left: 4, background: "#cc0c39", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 5px", borderRadius: 2 }}>-{discount}%</span>
                )}
            </div>
            <div style={{ padding: "8px 8px 10px" }}>
                <p className="clamp2" style={{ fontSize: 12, color: "#0f1111", lineHeight: 1.35, marginBottom: 4, minHeight: 32 }}>{title}</p>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#b12704" }}>₹{Number(price).toLocaleString("en-IN")}</span>
                {comparePrice > price && <span style={{ fontSize: 11, color: "#565959", textDecoration: "line-through", marginLeft: 4 }}>₹{Number(comparePrice).toLocaleString("en-IN")}</span>}
            </div>
        </div>
    );
};

const CategoryBtn = ({ cat, onClick }) => {
    const [err, setErr] = useState(false);
    return (
        <button onClick={onClick}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0, minWidth: 68, background: "none", border: "none", cursor: "pointer", padding: "4px 2px" }}>
            <div style={{ width: 64, height: 64, borderRadius: 8, overflow: "hidden", border: "2px solid #ddd", transition: "border-color 0.2s" }}>
                {cat.category_image && !err
                    ? <img src={cat.category_image} alt={cat.category_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={() => setErr(true)} />
                    : <CategoryFallback name={cat.category_name} />}
            </div>
            <span style={{ fontSize: 11, color: "#0f1111", textAlign: "center", lineHeight: 1.3, maxWidth: 66, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", fontWeight: 500 }}>
                {cat.category_name}
            </span>
        </button>
    );
};

const CollectionBtn = ({ col, onClick }) => {
    const [err, setErr] = useState(false);
    const img = col.image_url || col.image || col.cover;
    return (
        <button onClick={onClick}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0, minWidth: 68, background: "none", border: "none", cursor: "pointer" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", overflow: "hidden", border: "2px solid #ddd" }}>
                {img && !err
                    ? <img src={img} alt={col.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={() => setErr(true)} />
                    : <CategoryFallback name={col.name} />}
            </div>
            <span style={{ fontSize: 11, color: "#0f1111", textAlign: "center", lineHeight: 1.3, maxWidth: 68, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {col.name}
            </span>
        </button>
    );
};

const TrendingRow = ({ product, idx, onClick }) => {
    const [imgErr, setImgErr] = useState(false);
    const title = product.product_title || product.title || "";
    const price = product.product_price || product.price;
    const images = product.product_images || product.images || [];
    const img = images[0];
    return (
        <div onClick={onClick}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: idx < 3 ? "#f08804" : "#e8e8e8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: idx < 3 ? "#fff" : "#565959" }}>{idx + 1}</span>
            </div>
            <div style={{ width: 56, height: 56, background: "#f7f8f8", borderRadius: 6, overflow: "hidden", flexShrink: 0, border: "1px solid #e7e7e7" }}>
                {img && !imgErr
                    ? <img src={img} alt={title} className="prod-img" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }} onError={() => setImgErr(true)} />
                    : <ProductPlaceholder title={title} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p className="clamp2" style={{ fontSize: 13, color: "#0f1111", lineHeight: 1.35 }}>{title}</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#b12704", marginTop: 3 }}>₹{Number(price).toLocaleString("en-IN")}</p>
            </div>
            <ChevronRight size={16} style={{ color: "#adb5bd", flexShrink: 0 }} />
        </div>
    );
};

const useCountdown = (hours = 5) => {
    const end = useRef(Date.now() + hours * 3_600_000);
    const [t, setT] = useState({ h: hours, m: 0, s: 0 });
    useEffect(() => {
        const tick = () => {
            const d = Math.max(0, end.current - Date.now());
            setT({ h: Math.floor(d / 3_600_000), m: Math.floor((d % 3_600_000) / 60_000), s: Math.floor((d % 60_000) / 1_000) });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);
    return t;
};
const pad = n => String(n).padStart(2, "0");

const TRUST = [
    { icon: <Truck size={18} />, title: "Free Delivery", sub: "On orders ₹499+", color: "#0073e6" },
    { icon: <Shield size={18} />, title: "100% Genuine", sub: "Licensed pharmacy", color: "#007600" },
    { icon: <Clock size={18} />, title: "Same Day", sub: "Delivery in 4–6 hrs", color: "#f08804" },
    { icon: <Star size={18} />, title: "Top Rated", sub: "4.8★ · 10k+ users", color: "#c45500" },
];

const OFFERS = [
    { title: "First Order", sub: "Flat 20% off", code: "FIRST20", bg: "#f0f7ff", border: "#a8c4e0", accent: "#0073e6" },
    { title: "Free Delivery", sub: "On orders ₹499+", code: "FREEDEL", bg: "#f0fff4", border: "#a3d9a5", accent: "#007600" },
    { title: "Refer & Earn", sub: "₹100 per referral", code: "REFER100", bg: "#fff8f0", border: "#f5c68a", accent: "#c45500" },
];

const TIPS = [
    "💊 Complete your full antibiotic course",
    "💧 Drink 8+ glasses of water daily",
    "🌿 Store medicines away from sunlight",
    "🩺 Regular check-ups detect issues early",
    "🚫 Never self-medicate without a doctor",
    "🌙 Good sleep naturally boosts immunity",
    "🥗 A balanced diet is the best medicine",
    "🏃 30 min of daily exercise helps your heart",
];

const Newsletter = () => {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    return (
        <Section style={{ background: "#232f3e", padding: "28px 20px" }}>
            <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#f08804", marginBottom: 6 }}>Stay Updated</p>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Get exclusive health deals</h3>
                <p style={{ fontSize: 13, color: "#adb5bd", marginBottom: 20 }}>Early access to offers, health tips &amp; new arrivals</p>
                {sent ? (
                    <div style={{ padding: "10px 24px", background: "rgba(255,255,255,0.1)", borderRadius: 4, display: "inline-block" }}>
                        <span style={{ color: "#4caf50", fontWeight: 600, fontSize: 14 }}>✓ You're subscribed!</span>
                    </div>
                ) : (
                    <div style={{ display: "flex", gap: 8, maxWidth: 380, margin: "0 auto" }}>
                        <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)}
                            style={{ flex: 1, padding: "10px 14px", borderRadius: 4, border: "1px solid #3d4f5c", background: "#1a252f", color: "#fff", fontSize: 13, fontFamily: "inherit", outline: "none" }} />
                        <button onClick={() => email && setSent(true)}
                            style={{ padding: "10px 18px", background: "#f08804", color: "#111", fontWeight: 700, fontSize: 13, border: "none", borderRadius: 4, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                            Subscribe
                        </button>
                    </div>
                )}
            </div>
        </Section>
    );
};

/* ─────────────────────────────────────
   DASHBOARD
───────────────────────────────────── */
const Dashboard = () => {
    const navigate = useNavigate();
    const timer = useCountdown(5);

    const [banners, setBanners] = useState([]);
    const [collections, setCollections] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [currentBanner, setCurrentBanner] = useState(0);
    const [lBanners, setLBanners] = useState(true);
    const [lCollections, setLCollections] = useState(true);
    const [lCategories, setLCategories] = useState(true);
    const [lProducts, setLProducts] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const c = sessionStorage.getItem("home_banners");
                if (c) { setBanners(JSON.parse(c)); return; }
                const r = await fetch(`${backend_api}/user/banner`);
                const d = await r.json();
                if (r.ok) { setBanners(d.data || []); sessionStorage.setItem("home_banners", JSON.stringify(d.data || [])); }
            } finally { setLBanners(false); }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const c = sessionStorage.getItem("home_collections");
                if (c) { setCollections(JSON.parse(c)); return; }
                const r = await fetch(`${backend_api}/user/collection`);
                const d = await r.json();
                if (r.ok) { setCollections(d.result || []); sessionStorage.setItem("home_collections", JSON.stringify(d.result || [])); }
            } finally { setLCollections(false); }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const c = sessionStorage.getItem("categories");
                if (c) { setCategories(JSON.parse(c)); return; }
                const r = await fetch(`${backend_api}/user/category`);
                const d = await r.json();
                if (r.ok) { setCategories(d.categories || []); sessionStorage.setItem("categories", JSON.stringify(d.categories || [])); }
            } finally { setLCategories(false); }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            setLProducts(true);
            try {
                const r = await fetch(`${backend_api}/user/product?limit=12`, { credentials: "include", cache: "no-store" });
                const d = await r.json();
                setProducts(d.data || d.products || d || []);
            } finally { setLProducts(false); }
        })();
    }, []);

    useEffect(() => {
        if (banners.length <= 1) return;
        const t = setInterval(() => setCurrentBanner(p => (p + 1) % banners.length), 4500);
        return () => clearInterval(t);
    }, [banners]);

    const flashProducts = products.filter((_, i) => i % 3 === 0).slice(0, 6);
    const trendingProducts = products.filter((_, i) => i % 3 === 1).slice(0, 6);
    const mainProducts = products.slice(0, 12);

    return (
        <div style={{ minHeight: "100vh", background: "#f0f2f2", fontFamily: "'Lato', sans-serif" }}>
            <style>{GLOBAL_CSS}</style>

            <main style={{ maxWidth: 1200, margin: "0 auto" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

                    {lBanners ? (
                        <div className="sk" style={{ height: 280, borderRadius: 0 }} />
                    ) : banners.length > 0 ? (
                        <div style={{ position: "relative", overflow: "hidden", height: "clamp(180px,28vw,320px)" }}>
                            <div style={{ display: "flex", transform: `translateX(-${currentBanner * 100}%)`, transition: "transform 0.5s ease" }}>
                                {banners.map((b, i) => (
                                    <a key={i} href={b.link} target="_blank" rel="noreferrer" style={{ minWidth: "100%", display: "block" }}>
                                        <img src={b.image_url} alt="" style={{ width: "100%", height: "clamp(180px,28vw,320px)", objectFit: "cover", display: "block" }} />
                                    </a>
                                ))}
                            </div>
                            {banners.length > 1 && (
                                <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
                                    {banners.map((_, i) => (
                                        <button key={i} onClick={() => setCurrentBanner(i)}
                                            style={{ width: currentBanner === i ? 20 : 8, height: 8, borderRadius: 4, background: currentBanner === i ? "#fff" : "rgba(255,255,255,0.5)", border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0 }} />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ height: 200, background: "linear-gradient(90deg,#232f3e,#37475a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <GiMedicines size={48} style={{ color: "#f08804" }} />
                        </div>
                    )}

                    <Section style={{ padding: "12px 16px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }} className="trust-grid">
                            <style>{`@media(min-width:640px){.trust-grid{grid-template-columns:repeat(4,1fr)!important}}`}</style>
                            {TRUST.map(({ icon, title, sub, color }) => (
                                <div key={title} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 4px" }}>
                                    <div style={{ color, flexShrink: 0 }}>{icon}</div>
                                    <div>
                                        <p style={{ fontSize: 13, fontWeight: 700, color: "#0f1111" }}>{title}</p>
                                        <p style={{ fontSize: 11, color: "#565959" }}>{sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section style={{ padding: "10px 0", overflow: "hidden", background: "#fffbf2", borderTop: "1px solid #f0e8d0", borderBottom: "1px solid #f0e8d0" }}>
                        <div className="marquee-inner">
                            {[...TIPS, ...TIPS].map((tip, i) => (
                                <span key={i} style={{ fontSize: 12, color: "#7a5c00", fontWeight: 600, flexShrink: 0 }}>{tip}</span>
                            ))}
                        </div>
                    </Section>

                    <Section>
                        <SectionTitle text="Shop by Category" onAll={() => navigate("/category")} />
                        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }} className="hide-scroll">
                            {lCategories
                                ? Array.from({ length: 7 }).map((_, i) => (
                                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0, minWidth: 68 }}>
                                        <Sk w={64} h={64} r={8} />
                                        <Sk w={50} h={10} />
                                    </div>
                                ))
                                : categories.map(cat => (
                                    <CategoryBtn key={cat.category_id} cat={cat}
                                        onClick={() => navigate(`/category/${cat.category_id}/${cat.category_slug}`)} />
                                ))}
                        </div>
                    </Section>

                    {(lProducts || flashProducts.length > 0) && (
                        <Section>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <Zap size={16} style={{ color: "#cc0c39" }} />
                                    <span style={{ fontSize: 18, fontWeight: 700, color: "#0f1111" }}>Flash Deals</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{ fontSize: 12, color: "#565959" }}>Ends in</span>
                                    {[pad(timer.h), pad(timer.m), pad(timer.s)].map((u, i) => (
                                        <React.Fragment key={i}>
                                            {i > 0 && <span style={{ color: "#cc0c39", fontWeight: 700, fontSize: 13 }}>:</span>}
                                            <span style={{ fontSize: 13, fontWeight: 700, background: "#cc0c39", color: "#fff", padding: "2px 6px", borderRadius: 3, minWidth: 28, textAlign: "center", fontFamily: "monospace" }}>{u}</span>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }} className="hide-scroll">
                                {lProducts
                                    ? Array.from({ length: 5 }).map((_, i) => <Sk key={i} w={144} h={200} r={8} style={{ flexShrink: 0 }} />)
                                    : flashProducts.map(p => (
                                        <FlashCard key={p.product_id || p.id} product={p}
                                            onClick={() => navigate(`/product/${p.product_uniqueCode}/${p.product_slug}`)} />
                                    ))}
                            </div>
                        </Section>
                    )}

                    <Section>
                        <SectionTitle text="Shop by Collection" />
                        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }} className="hide-scroll">
                            {lCollections
                                ? Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0, minWidth: 68 }}>
                                        <Sk w={64} h={64} r={32} />
                                        <Sk w={50} h={10} />
                                    </div>
                                ))
                                : collections.map(col => (
                                    <CollectionBtn key={col.id} col={col}
                                        onClick={() => navigate(`/collection/${col.id}`)} />
                                ))}
                        </div>
                    </Section>

                    <Section>
                        <SectionTitle text="Offers For You" />
                        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(1,1fr)" }} className="offers-grid">
                            <style>{`@media(min-width:540px){.offers-grid{grid-template-columns:repeat(3,1fr)!important}}`}</style>
                            {OFFERS.map(({ title, sub, code, bg, border, accent }) => (
                                <div key={title} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                                    <Gift size={20} style={{ color: accent, flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: 13, fontWeight: 700, color: "#0f1111" }}>{title}</p>
                                        <p style={{ fontSize: 12, color: "#565959" }}>{sub}</p>
                                    </div>
                                    <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "monospace", background: "#fff", border: `1px solid ${border}`, color: accent, padding: "3px 8px", borderRadius: 3 }}>{code}</span>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section>
                        <SectionTitle text="Recommended for You" onAll={() => navigate("/search")} />
                        {lProducts ? (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }} className="prod-grid">
                                <style>{`@media(min-width:540px){.prod-grid{grid-template-columns:repeat(3,1fr)!important}} @media(min-width:900px){.prod-grid{grid-template-columns:repeat(4,1fr)!important}}`}</style>
                                {Array.from({ length: 8 }).map((_, i) => <Sk key={i} h={260} />)}
                            </div>
                        ) : mainProducts.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "40px 0", color: "#adb5bd" }}>
                                <Package size={32} style={{ margin: "0 auto 8px" }} />
                                <p style={{ fontSize: 14 }}>No products yet</p>
                            </div>
                        ) : (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }} className="prod-grid">
                                <style>{`@media(min-width:540px){.prod-grid{grid-template-columns:repeat(3,1fr)!important}} @media(min-width:900px){.prod-grid{grid-template-columns:repeat(4,1fr)!important}}`}</style>
                                {mainProducts.map(p => (
                                    <ProductCard key={p.product_id || p.id} product={p}
                                        onClick={() => navigate(`/product/${p.product_uniqueCode}/${p.product_slug}`)} />
                                ))}
                            </div>
                        )}
                    </Section>

                    {!lProducts && trendingProducts.length > 0 && (
                        <Section>
                            <SectionTitle text="Trending Now" sub="Most purchased this week" />
                            <div>
                                {trendingProducts.map((p, idx) => (
                                    <TrendingRow key={p.product_id || p.id} product={p} idx={idx}
                                        onClick={() => navigate(`/product/${p.product_uniqueCode}/${p.product_slug}`)} />
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* ── APP DOWNLOAD ── */}
                    <Section style={{ background: "#232f3e", padding: "20px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }} className="app-row">
                            <style>{`@media(min-width:640px){.app-row{flex-direction:row!important;align-items:center!important;justify-content:space-between!important}}`}</style>
                            <div>
                                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#f08804", marginBottom: 4 }}>Download Our App</p>
                                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Get medicines delivered faster</h3>
                                <p style={{ fontSize: 13, color: "#adb5bd" }}>Real-time tracking · Exclusive app deals · Instant refills</p>
                            </div>
                            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                                {["🍎 App Store", "🤖 Google Play"].map(s => (
                                    <button key={s} style={{ padding: "9px 16px", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{s}</button>
                                ))}
                            </div>
                        </div>
                    </Section>

                    <Newsletter />

                    <div style={{ height: 64 }} className="mobile-spacer" />
                    <style>{`@media(min-width:640px){.mobile-spacer{display:none!important}}`}</style>

                </div>
            </main>
        </div>
    );
};

export default Dashboard;