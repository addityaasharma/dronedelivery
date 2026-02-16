import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";

const ProductDetails = () => {
    const { product_id } = useParams();
    const navigate = useNavigate();

    const cacheKey = `product_${product_id}`;

    const [product, setProduct] = useState(null);
    const [suggested, setSuggested] = useState([]);
    const [liked, setLiked] = useState(false);

    const [loading, setLoading] = useState(true);
    const [likeLoading, setLikeLoading] = useState(false);

    const [cartLoading, setCartLoading] = useState(false);
    const [buyLoading, setBuyLoading] = useState(false);

    // ======================================
    // FETCH PRODUCT (CACHE FIRST)
    // ======================================
    useEffect(() => {
        setLoading(true);
        window.scrollTo(0, 0);

        const cached = sessionStorage.getItem(cacheKey);

        if (cached) {
            const parsed = JSON.parse(cached);
            setProduct(parsed.product);
            setSuggested(parsed.suggested);
            setLiked(parsed.liked);
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                let productData = null;
                let suggestedData = [];

                const res = await fetch(
                    `https://no-wheels-1.onrender.com/user/product/${product_id}`,
                    { credentials: "include" }
                );

                const data = await res.json();

                if (res.ok) {
                    productData = data.data;
                    setProduct(productData);
                    setLiked(productData.is_liked || false);
                }

                const sugRes = await fetch(
                    `https://no-wheels-1.onrender.com/user/product/${product_id}/suggested?limit=10`
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
                    })
                );

            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [product_id]);

    // ======================================
    // LIKE / UNLIKE
    // ======================================
    const toggleLike = async () => {
        if (likeLoading) return;

        try {
            setLikeLoading(true);

            const newState = !liked;
            setLiked(newState);

            const res = await fetch(
                `https://no-wheels-1.onrender.com/user/liked_product/${product_id}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({}),
                }
            );

            if (!res.ok) {
                setLiked(!newState);
            }
        } finally {
            setLikeLoading(false);
        }
    };

    // ======================================
    // ADD TO CART
    // ======================================
    const addToCart = async () => {
        if (cartLoading) return;

        try {
            setCartLoading(true);

            const res = await fetch(
                `https://no-wheels-1.onrender.com/user/cart/${product_id}`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            alert("Added to cart 🛒");

        } catch (err) {
            alert(err.message || "Failed to add cart");
        } finally {
            setCartLoading(false);
        }
    };

    // ======================================
    // BUY NOW
    // ======================================
    const buyNow = () => {
        navigate(`/checkout/${product_id}`);
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading product...
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Product not found
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">

            {/* HEADER */}
            <div className="sticky top-0 z-40 bg-white shadow-sm px-4 py-3 flex items-center justify-between">
                <div className="flex items-center">
                    <button onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="ml-3 font-semibold text-lg">Product Details</h2>
                </div>

                <button onClick={toggleLike}>
                    <Heart
                        size={22}
                        className={
                            liked
                                ? "fill-red-500 text-red-500"
                                : "text-gray-500"
                        }
                    />
                </button>
            </div>

            <div className="max-w-3xl mx-auto p-4">

                <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <img
                        src={product.product_images?.[0]}
                        alt={product.product_title}
                        className="w-full h-72 object-cover rounded-xl"
                    />
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm mt-4">
                    <h1 className="text-xl font-bold">{product.product_title}</h1>

                    <p className="text-2xl font-bold text-amber-600 mt-2">
                        ₹{product.product_price}
                    </p>

                    <p className="mt-3 text-gray-700">
                        {product.product_description}
                    </p>
                </div>

                {/* ACTION BUTTONS */}
                <div className="grid grid-cols-2 gap-3 mt-5">
                    <button
                        onClick={addToCart}
                        disabled={cartLoading}
                        className="bg-gray-200 hover:bg-gray-300 py-3 rounded-xl font-semibold"
                    >
                        {cartLoading ? "Adding..." : "Add to Cart"}
                    </button>

                    <button
                        onClick={buyNow}
                        disabled={buyLoading}
                        className="bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-semibold"
                    >
                        {buyLoading ? "Processing..." : "Buy Now"}
                    </button>
                </div>

                {/* SUGGESTED */}
                {suggested.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-3">
                            You may also like
                        </h3>

                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {suggested.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() =>
                                        navigate(`/product/${item.id}`)
                                    }
                                    className="min-w-40 bg-white rounded-xl p-3 cursor-pointer"
                                >
                                    <img
                                        src={item.images?.[0]}
                                        className="w-full h-24 object-cover rounded-lg"
                                    />
                                    <p className="text-sm mt-2">{item.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
