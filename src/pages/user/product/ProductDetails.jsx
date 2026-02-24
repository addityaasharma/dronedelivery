import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Heart,
    Share2,
    Star,
    ShoppingCart,
    Truck,
    Shield,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
    Check,
    MapPin,
    X,
    LogIn
} from "lucide-react";
import { backend_api } from "../../../api";

// ─── Login Popup ───────────────────────────────────────────────────────────────
const LoginPopup = ({ onClose, onLogin }) => (
    <div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
    >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
                <X size={18} className="text-gray-500" />
            </button>

            <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                    <LogIn size={26} className="text-amber-500" />
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2">Please Login</h2>
                <p className="text-sm text-gray-500 mb-6">
                    You need to be logged in to continue. It only takes a moment!
                </p>

                <button
                    onClick={onLogin}
                    className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold py-3 rounded-full transition-colors shadow-sm mb-3"
                >
                    Go to Login
                </button>

                <button
                    onClick={onClose}
                    className="w-full text-sm text-gray-500 hover:text-gray-700 py-2 transition-colors"
                >
                    Continue Browsing
                </button>
            </div>
        </div>
    </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
// Register route as: /product/:unique_code/:slug
// Example URL:       /product/3906ec4a/product-43
const ProductDetails = () => {
    const { unique_code, slug } = useParams();
    const navigate = useNavigate();

    const cacheKey = `product_${unique_code}`;

    const [product, setProduct] = useState(null);
    const [productId, setProductId] = useState(null); // used for cart / like / order APIs
    const [suggested, setSuggested] = useState([]);
    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [likeLoading, setLikeLoading] = useState(false);
    const [cartLoading, setCartLoading] = useState(false);
    const [buyLoading, setBuyLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isInCart, setIsInCart] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    useEffect(() => {
        setLoading(true);
        setSelectedImage(0);
        window.scrollTo(0, 0);

        const cached = sessionStorage.getItem(cacheKey);

        if (cached) {
            const parsed = JSON.parse(cached);
            setProduct(parsed.product);
            setSuggested(parsed.suggested);
            setLiked(parsed.liked);
            setIsInCart(parsed.isInCart || false);
            setProductId(parsed.product?.product_id || null);
            setLoading(false);

            // Correct slug in URL using the API-provided product_slug
            const correctSlug = parsed.product?.product_slug;
            if (correctSlug && slug !== correctSlug) {
                navigate(`/product/${unique_code}/${correctSlug}`, { replace: true });
            }
            return;
        }

        const fetchData = async () => {
            try {
                let productData = null;
                let suggestedData = [];

                // Fetch by unique_code — API: /user/product/:unique_code
                const res = await fetch(
                    `${backend_api}/user/product/${unique_code}`,
                    { credentials: "include" }
                );

                const data = await res.json();

                if (res.ok && data.data) {
                    productData = data.data;
                    setProduct(productData);
                    setProductId(productData.product_id);
                    setLiked(Boolean(productData.is_liked));
                    setIsInCart(Boolean(productData.added_to_cart));

                    // Use product_slug from API response for canonical URL
                    const correctSlug = productData.product_slug;
                    if (correctSlug && slug !== correctSlug) {
                        navigate(`/product/${unique_code}/${correctSlug}`, { replace: true });
                    }
                }

                // Suggested products — fetched by product_id
                const sugRes = await fetch(
                    `${backend_api}/user/product/${productData.product_id}/suggested?limit=10`
                );
                const sugData = await sugRes.json();

                if (sugRes.ok) {
                    suggestedData = sugData.data || [];
                    setSuggested(suggestedData);
                }

                sessionStorage.setItem(
                    cacheKey,
                    JSON.stringify({
                        product: productData,
                        suggested: suggestedData,
                        liked: productData?.is_liked || false,
                        isInCart: productData?.added_to_cart || false,
                    })
                );

            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [unique_code]);

    // ── Toggle Like — uses product_id ──────────────────────────────────────────
    const toggleLike = async () => {
        if (likeLoading) return;
        try {
            setLikeLoading(true);
            const newState = !liked;
            setLiked(newState);

            const res = await fetch(
                `${backend_api}/user/liked_product/${productId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({}),
                }
            );

            if (res.status === 401) {
                setLiked(!newState);
                setShowLoginPopup(true);
                return;
            }

            if (!res.ok) setLiked(!newState);
        } finally {
            setLikeLoading(false);
        }
    };

    // ── Add to Cart — uses product_id ──────────────────────────────────────────
    const addToCart = async () => {
        if (cartLoading || isInCart) return;
        try {
            setCartLoading(true);

            const res = await fetch(
                `${backend_api}/user/cart/${productId}`,
                { method: "POST", credentials: "include" }
            );

            if (res.status === 401) {
                setShowLoginPopup(true);
                return;
            }

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setIsInCart(true);

            // Update cache
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
                const parsed = JSON.parse(cached);
                parsed.isInCart = true;
                sessionStorage.setItem(cacheKey, JSON.stringify(parsed));
            }

            alert("Added to cart 🛒");
        } catch (err) {
            alert(err.message || "Failed to add to cart");
        } finally {
            setCartLoading(false);
        }
    };

    // ── Buy Now — auth check, then navigate with product_id ────────────────────
    const buyNow = () => proceedBuyNow();

    const proceedBuyNow = async () => {
        try {
            setBuyLoading(true);

            const res = await fetch(`${backend_api}/user/profile`, {
                method: "GET",
                credentials: "include",
            });

            if (res.status === 401) {
                setShowLoginPopup(true);
                return;
            }

            navigate("/order", {
                state: {
                    singleProduct: {
                        product_id: productId,
                        title: product.product_title,
                        price: product.product_price,
                        images: product.product_images,
                        quantity,
                    },
                },
            });
        } catch {
            // Network error — allow navigation
            navigate("/order", {
                state: {
                    singleProduct: {
                        product_id: productId,
                        title: product.product_title,
                        price: product.product_price,
                        images: product.product_images,
                        quantity,
                    },
                },
            });
        } finally {
            setBuyLoading(false);
        }
    };

    const goToCart = () => navigate("/cart");

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.product_title,
                    text: product.product_description,
                    url: window.location.href,
                });
            } catch (err) {
                console.log("Share cancelled", err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    const nextImage = () =>
        setSelectedImage((prev) => (prev + 1) % (product.product_images?.length || 1));

    const prevImage = () =>
        setSelectedImage((prev) =>
            prev === 0 ? (product.product_images?.length || 1) - 1 : prev - 1
        );

    // Navigate to a suggested product using its unique_code + product_slug from API
    const goToProduct = (item) => {
        const itemUniqueCode = item.product_uniqueCode || item.unique_code;
        const itemSlug = item.product_slug || item.slug || itemUniqueCode;
        navigate(`/product/${itemUniqueCode}/${itemSlug}`);
    };

    // ── Loading ────────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading product...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-xl text-gray-600 mb-4">Product not found</p>
                    <button
                        onClick={() => navigate("/")}
                        className="text-amber-600 hover:text-amber-700 font-semibold"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    const images = product.product_images || [];
    const rating = product.rating || 4.5;
    const reviewCount = product.review_count || 0;
    const inStock = product.stock > 0;

    return (
        <div className="min-h-screen bg-gray-50">

            {showLoginPopup && (
                <LoginPopup
                    onClose={() => setShowLoginPopup(false)}
                    onLogin={() => navigate("/login")}
                />
            )}

            <div className="max-w-7xl mx-auto px-2 py-2">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">

                    {/* ── Image Gallery ── */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-lg overflow-hidden sticky top-2">
                            <div className="relative aspect-square bg-gray-100">
                                <img
                                    src={images[selectedImage]}
                                    alt={product.product_title}
                                    className="w-full h-full object-contain"
                                />

                                {images.length > 1 && (
                                    <>
                                        <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg">
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg">
                                            <ChevronRight size={20} />
                                        </button>
                                    </>
                                )}

                                {images.length > 1 && (
                                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                                        {selectedImage + 1} / {images.length}
                                    </div>
                                )}
                            </div>

                            {images.length > 1 && (
                                <div className="flex gap-2 p-4 overflow-x-auto">
                                    {images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`shrink-0 w-16 h-16 border-2 rounded-lg overflow-hidden ${selectedImage === index ? "border-amber-500" : "border-gray-200"}`}
                                        >
                                            <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Product Details ── */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-lg p-4 space-y-3">
                            {product.brand && (
                                <p className="text-amber-600 font-semibold text-sm">Visit the {product.brand} Store</p>
                            )}

                            <div className="flex items-start justify-between gap-3">
                                <h1 className="text-2xl font-semibold text-gray-900 leading-tight flex-1">
                                    {product.product_title}
                                </h1>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button onClick={handleShare} className="p-2 hover:bg-gray-100 rounded-full">
                                        <Share2 size={18} />
                                    </button>
                                    <button onClick={toggleLike} disabled={likeLoading} className="p-2 hover:bg-gray-100 rounded-full">
                                        <Heart size={18} className={liked ? "fill-red-500 text-red-500" : "text-gray-600"} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={18} className={i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
                                    ))}
                                </div>
                                <span className="text-sm text-blue-600 hover:text-amber-600 cursor-pointer">
                                    {rating} ({reviewCount.toLocaleString()} ratings)
                                </span>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-sm text-gray-600">Price:</span>
                                    <span className="text-3xl font-semibold text-gray-900">
                                        ₹{product.product_price.toLocaleString()}
                                    </span>
                                </div>

                                {product.product_comparable_price && product.product_comparable_price > product.product_price && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-sm text-gray-500 line-through">
                                            ₹{product.product_comparable_price.toLocaleString()}
                                        </span>
                                        <span className="text-sm text-red-600 font-semibold">
                                            Save ₹{(product.product_comparable_price - product.product_price).toLocaleString()}
                                            ({Math.round(((product.product_comparable_price - product.product_price) / product.product_comparable_price) * 100)}% off)
                                        </span>
                                    </div>
                                )}
                                <p className="text-xs text-gray-600 mt-1">Inclusive of all taxes</p>
                            </div>

                            <div className={`flex items-center gap-2 ${inStock ? 'text-green-700' : 'text-red-600'}`}>
                                <Check size={18} />
                                <span className="font-semibold">{inStock ? 'In Stock' : 'Out of Stock'}</span>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-2">About this item</h3>
                                <p className="text-gray-700 text-sm leading-relaxed">{product.product_description}</p>
                            </div>

                            {product.features && (
                                <div className="border-t pt-4">
                                    <h3 className="font-semibold mb-2">Key Features</h3>
                                    <ul className="space-y-2">
                                        {product.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                                <Check size={16} className="text-green-600 mt-0.5 shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="border-t pt-4 space-y-3">
                                <div className="flex items-start gap-3">
                                    <Truck className="text-amber-600 shrink-0" size={20} />
                                    <div>
                                        <p className="font-semibold text-sm">Free Delivery</p>
                                        <p className="text-xs text-gray-600">On orders above ₹499</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <RotateCcw className="text-amber-600 shrink-0" size={20} />
                                    <div>
                                        <p className="font-semibold text-sm">7 Days Return</p>
                                        <p className="text-xs text-gray-600">Easy return & exchange available</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Shield className="text-amber-600 shrink-0" size={20} />
                                    <div>
                                        <p className="font-semibold text-sm">Secure Transaction</p>
                                        <p className="text-xs text-gray-600">Your payment is protected</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Buy Box ── */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-2">
                            <div className="space-y-3">
                                <div>
                                    <p className="text-3xl font-semibold text-gray-900">
                                        ₹{product.product_price.toLocaleString()}
                                    </p>
                                    {product.product_comparable_price && (
                                        <p className="text-sm text-gray-500 line-through mt-1">
                                            ₹{product.product_comparable_price.toLocaleString()}
                                        </p>
                                    )}
                                </div>

                                <div className="border-t border-b py-3 space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Truck size={16} className="text-gray-600" />
                                        <span className="text-gray-700">FREE delivery <span className="font-semibold">Tomorrow</span></span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin size={16} className="text-gray-600" />
                                        <button className="text-blue-600 hover:text-amber-600">Select delivery location</button>
                                    </div>
                                </div>

                                {inStock ? (
                                    <div>
                                        <p className="text-green-700 font-semibold text-lg">In Stock</p>
                                        {product.stock < 10 && (
                                            <p className="text-red-600 text-sm mt-1">Only {product.stock} left in stock - order soon.</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-red-600 font-semibold">Currently unavailable</p>
                                )}

                                {inStock && !isInCart && (
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Quantity:</label>
                                        <select
                                            value={quantity}
                                            onChange={(e) => setQuantity(Number(e.target.value))}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        >
                                            {[...Array(Math.min(product.stock || 10, 10))].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <button
                                        onClick={isInCart ? undefined : addToCart}
                                        disabled={cartLoading}
                                        className={`w-full font-semibold py-3 px-4 rounded-full transition-colors shadow-sm ${isInCart
                                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                            : "bg-amber-400 hover:bg-amber-500 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                            }`}
                                    >
                                        {cartLoading ? "Adding..." : isInCart ? (
                                            <span className="flex items-center justify-center gap-2"><Check size={18} />Added to Cart</span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2"><ShoppingCart size={18} />Add to Cart</span>
                                        )}
                                    </button>

                                    {isInCart && (
                                        <button onClick={goToCart} className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-3 px-4 rounded-full transition-colors shadow-sm">
                                            Go to Cart
                                        </button>
                                    )}

                                    <button
                                        onClick={buyNow}
                                        disabled={buyLoading}
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                    >
                                        {buyLoading ? "Checking..." : "Buy Now"}
                                    </button>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-600 pt-2">
                                    <Shield size={14} />
                                    <span>Secure transaction</span>
                                </div>

                                {product.seller && (
                                    <div className="border-t pt-4 space-y-1 text-sm">
                                        <p className="text-gray-600">
                                            Sold by: <span className="text-blue-600 hover:text-amber-600 cursor-pointer">{product.seller}</span>
                                        </p>
                                        {product.warranty && (
                                            <p className="text-gray-600">Warranty: {product.warranty}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Suggested Products ── */}
                {suggested.length > 0 && (
                    <div className="mt-4">
                        <div className="bg-white rounded-lg p-4">
                            <h2 className="text-xl font-semibold mb-4">
                                Customers who viewed this item also viewed
                            </h2>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {suggested.map((item) => (
                                    <div
                                        key={item.product_uniqueCode || item.unique_code || item.id}
                                        onClick={() => goToProduct(item)}
                                        className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-lg transition-shadow group"
                                    >
                                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                                            <img
                                                src={item.images?.[0] || item.product_images?.[0]}
                                                alt={item.title || item.product_title}
                                                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                            />
                                        </div>
                                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                                            {item.title || item.product_title}
                                        </h3>
                                        <div className="flex items-center gap-1 mb-2">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={12} className={i < Math.floor(item.rating || 4) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-600">({item.review_count || 0})</span>
                                        </div>
                                        <p className="text-lg font-semibold text-gray-900">
                                            ₹{(item.price || item.product_price)?.toLocaleString()}
                                        </p>
                                        {(item.product_comparable_price || item.original_price) && (item.product_comparable_price || item.original_price) > (item.price || item.product_price) && (
                                            <p className="text-xs text-gray-500 line-through">
                                                ₹{(item.product_comparable_price || item.original_price).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;