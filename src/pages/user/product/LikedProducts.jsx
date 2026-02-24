import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingBag, Trash2, Star } from "lucide-react";

const LikedProducts = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLiked = async () => {
            try {
                const res = await fetch("https://no-wheels-1.onrender.com/user/liked_product", {
                    credentials: "include",
                });
                if (res.status === 401) { navigate("/login", { replace: true }); return; }
                const data = await res.json();
                if (res.ok) setProducts(data.data || []);
            } catch (err) {
                console.log("Failed to fetch liked products", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLiked();
    }, [navigate]);

    const discount = (price, compare) => {
        if (!compare || compare <= price) return null;
        return Math.round(((compare - price) / compare) * 100);
    };

    const fmt = (n) => n?.toLocaleString("en-IN") ?? "";

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { background: #e3e6e6; }

                .page {
                    min-height: 100vh;
                    background: #e3e6e6;
                    font-family: 'Manrope', sans-serif;
                    color: #0f1111;
                }

                /* NAV */
                .nav {
                    background: #131921;
                    height: 56px;
                    display: flex; align-items: center;
                    padding: 0 18px; gap: 16px;
                    position: sticky; top: 0; z-index: 50;
                }
                .nav-back {
                    background: none; border: none; cursor: pointer;
                    color: #fff; display: flex; align-items: center; gap: 5px;
                    font-size: 13px; font-family: 'Manrope', sans-serif;
                    padding: 5px 8px; border-radius: 3px;
                    transition: background 0.15s;
                }
                .nav-back:hover { background: rgba(255,255,255,0.1); }
                .nav-title {
                    color: #fff; font-size: 18px; font-weight: 700;
                }
                .nav-count {
                    color: #f08804; font-size: 13px; font-weight: 700; margin-left: auto;
                }

                /* BREADCRUMB */
                .breadcrumb {
                    background: #fff;
                    padding: 8px 18px;
                    font-size: 12px; color: #565959;
                    border-bottom: 1px solid #ddd;
                }
                .breadcrumb span { color: #c45500; cursor: pointer; }
                .breadcrumb span:hover { text-decoration: underline; }

                /* MAIN */
                .main {width: 100%;margin: 0;padding: 0;}

                /* HEADER CARD */
                .header-card {
                    background: #fff;
                    border: 1px solid #ddd;
                    border-radius: 0px;
                    padding: 16px 20px;
                    margin-bottom: 12px;
                    display: flex; align-items: center; justify-content: space-between;
                }
                .header-card h1 {
                    font-size: 22px; font-weight: 400; color: #0f1111;
                }
                .header-card p { font-size: 13px; color: #565959; margin-top: 2px; }

                /* PRODUCT LIST */
                .product-list {
                    background: #fff;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    overflow: hidden;
                }

                /* PRODUCT ROW */
                .product-row {
                    display: flex;
                    padding: 18px 20px;
                    border-bottom: 1px solid #f0f0f0;
                    gap: 18px;
                    cursor: pointer;
                    transition: background 0.12s;
                    animation: fadeIn 0.3s ease both;
                }
                .product-row:last-child { border-bottom: none; }
                .product-row:hover { background: #f7f8f8; }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* IMAGE */
                .img-col {
                    width: 140px; min-width: 140px; height: 170px;
                    overflow: hidden; border-radius: 4px;
                    background: #f5f5f5; position: relative;
                    border: 1px solid #f0f0f0;
                }
                .img-col img {
                    width: 100%; height: 100%; object-fit: cover;
                    transition: transform 0.35s ease;
                }
                .product-row:hover .img-col img { transform: scale(1.04); }

                .discount-badge {
                    position: absolute; top: 0; left: 0;
                    background: #cc0c39; color: #fff;
                    font-size: 10px; font-weight: 700;
                    padding: 2px 7px;
                    border-bottom-right-radius: 4px;
                }

                /* DETAILS */
                .details-col {flex: 1; min-width: 220px; display: flex; flex-direction: column; gap: 6px;}

                .product-title {
                    font-size: 14.5px; font-weight: 400; line-height: 1.5;
                    color: #0f1111;
                    word-wrap: break-word; overflow-wrap: break-word;
                    display: -webkit-box; -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical; overflow: hidden;
                    width: 100%;
                }

                .product-title:hover { color: #c45500; }

                .in-stock { font-size: 12px; color: #007600; font-weight: 500; }
                .delivery { font-size: 12px; color: #0f1111; margin-top: 2px; }
                .delivery b { font-weight: 700; }

                .price-row { display: flex; align-items: baseline; gap: 6px; flex-wrap: wrap; margin-top: 4px; }
                .price-main { font-size: 21px; font-weight: 700; color: #0f1111; }
                .price-main sup { font-size: 12px; vertical-align: super; font-weight: 700; }
                .price-strike { font-size: 12.5px; color: #565959; text-decoration: line-through; }
                .price-off { font-size: 13px; color: #cc0c39; font-weight: 600; }

                .stars { display: flex; align-items: center; gap: 3px; margin-top: 2px; }
                .stars-count { font-size: 12px; color: #007185; }

                /* ACTIONS COL */
                .actions-col { min-width: 130px; width: 130px; flex-shrink: 0; }

                .btn-add-cart {
                    width: 100%;
                    padding: 8px 10px;
                    background: linear-gradient(to bottom, #f7dfa5, #f0c14b);
                    border: 1px solid #a88734;
                    border-radius: 20px;
                    font-size: 12.5px; font-weight: 500;
                    color: #111; cursor: pointer;
                    font-family: 'Manrope', sans-serif;
                    transition: filter 0.15s;
                    display: flex; align-items: center; justify-content: center; gap: 5px;
                }
                .btn-add-cart:hover { filter: brightness(0.96); }

                .btn-buy-now {
                    width: 100%;
                    padding: 8px 10px;
                    background: linear-gradient(to bottom, #f5a623, #e8960a);
                    border: 1px solid #c47300;
                    border-radius: 20px;
                    font-size: 12.5px; font-weight: 500;
                    color: #111; cursor: pointer;
                    font-family: 'Manrope', sans-serif;
                    transition: filter 0.15s;
                }
                .btn-buy-now:hover { filter: brightness(0.96); }

                .btn-delete {
                    background: none; border: none; cursor: pointer;
                    font-size: 12px; color: #007185;
                    font-family: 'Manrope', sans-serif;
                    padding: 4px 0;
                    display: flex; align-items: center; gap: 5px;
                    transition: color 0.15s;
                }
                .btn-delete:hover { color: #c45500; text-decoration: underline; }

                .divider { border: none; border-top: 1px solid #ddd; margin: 0; }

                /* SKELETON */
                .skel-row {
                    display: flex; gap: 18px; padding: 18px 20px;
                    border-bottom: 1px solid #f0f0f0; background: #fff;
                    animation: pulse 1.4s ease infinite;
                }
                .skel { background: #e8e8e8; border-radius: 3px; }
                @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.45} }

                /* EMPTY */
                .empty {
                    background: #fff; border: 1px solid #ddd; border-radius: 4px;
                    text-align: center; padding: 60px 24px;
                }
                .empty h3 { font-size: 20px; font-weight: 400; margin-bottom: 8px; }
                .empty p { font-size: 13px; color: #565959; margin-bottom: 20px; }
                .btn-browse {
                    display: inline-flex; align-items: center; gap: 7px;
                    background: linear-gradient(to bottom, #f7dfa5, #f0c14b);
                    border: 1px solid #a88734; border-radius: 20px;
                    padding: 9px 22px; font-size: 13px; font-weight: 500;
                    color: #111; cursor: pointer; font-family: 'Manrope', sans-serif;
                }
                .btn-browse:hover { filter: brightness(0.96); }
            `}</style>

            <div className="page">
                <div className="nav">
                    <button className="nav-back" onClick={() => navigate(-1)}>
                        <ArrowLeft size={14} /> Back
                    </button>
                    <span className="nav-title">Your Wishlist</span>
                    {!loading && (
                        <span className="nav-count">
                            {products.length} {products.length === 1 ? "item" : "items"}
                        </span>
                    )}
                </div>

                <div className="breadcrumb">
                    <span onClick={() => navigate("/")}>Home</span> &rsaquo; Your Account &rsaquo; Saved Items
                </div>

                <div className="main">
                    <div className="header-card">
                        <div>
                            <h1>Saved Items</h1>
                            {!loading && <p>{products.length} {products.length === 1 ? "item" : "items"} in your wishlist</p>}
                        </div>
                        <Heart size={22} fill="#cc0c39" color="#cc0c39" />
                    </div>

                    {loading && (
                        <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 4, overflow: "hidden" }}>
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="skel-row">
                                    <div className="skel" style={{ width: 140, minWidth: 140, height: 170, borderRadius: 4 }} />
                                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, paddingTop: 4 }}>
                                        <div className="skel" style={{ height: 14, width: "85%" }} />
                                        <div className="skel" style={{ height: 14, width: "60%" }} />
                                        <div className="skel" style={{ height: 22, width: "30%", marginTop: 4 }} />
                                        <div className="skel" style={{ height: 12, width: "45%", marginTop: 4 }} />
                                    </div>
                                    <div style={{ width: 160, display: "flex", flexDirection: "column", gap: 8 }}>
                                        <div className="skel" style={{ height: 34, borderRadius: 20 }} />
                                        <div className="skel" style={{ height: 34, borderRadius: 20 }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && products.length === 0 && (
                        <div className="empty">
                            <Heart size={40} color="#ddd" style={{ margin: "0 auto 16px" }} />
                            <h3>Your wishlist is empty</h3>
                            <p>You haven't saved any products yet.<br />Browse and tap the heart to save items here.</p>
                            <button className="btn-browse" onClick={() => navigate("/")}>
                                <ShoppingBag size={14} /> Continue Shopping
                            </button>
                        </div>
                    )}

                    {!loading && products.length > 0 && (
                        <div className="product-list">
                            {products.map((p, i) => {
                                const off = discount(p.product_price, p.product_comparable_price);
                                return (
                                    <div
                                        key={p.product_id}
                                        className="product-row"
                                        style={{ animationDelay: `${Math.min(i, 10) * 0.04}s` }}
                                        onClick={() => navigate(`/product/${p.product_uniqueCode}/${p.product_slug}`)}
                                    >
                                        <div className="img-col">
                                            <img src={p.product_images?.[0]} alt={p.product_title} />
                                            {off && <span className="discount-badge">{off}% off</span>}
                                        </div>

                                        <div className="details-col">
                                            <p className="product-title">{p.product_title}</p>

                                            <div className="stars">
                                                {[...Array(4)].map((_, j) => (
                                                    <Star key={j} size={13} fill="#f0a500" color="#f0a500" />
                                                ))}
                                                <Star size={13} fill="#ddd" color="#ddd" />
                                                <span className="stars-count">ratings</span>
                                            </div>

                                            <div className="price-row">
                                                <span className="price-main">
                                                    <sup>₹</sup>{fmt(p.product_price)}
                                                </span>
                                                {p.product_comparable_price && (
                                                    <span className="price-strike">₹{fmt(p.product_comparable_price)}</span>
                                                )}
                                                {off && <span className="price-off">({off}% off)</span>}
                                            </div>

                                            <p className="in-stock">In Stock</p>
                                            <p className="delivery">
                                                <b>FREE delivery</b> <span>on orders above ₹499</span>
                                            </p>
                                        </div>

                                        <div className="actions-col" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                className="btn-delete"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setProducts(prev => prev.filter(x => x.product_id !== p.product_id));
                                                }}
                                            >
                                                {/* <Trash2 size={12} /> Remove from list */}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default LikedProducts;