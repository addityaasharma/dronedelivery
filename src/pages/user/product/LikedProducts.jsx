import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const LikedProducts = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const cacheKey = "liked_products";

    useEffect(() => {
        const cached = sessionStorage.getItem(cacheKey);

        if (cached) {
            setProducts(JSON.parse(cached));
            setLoading(false);
            return;
        }

        const fetchLiked = async () => {
            try {
                const res = await fetch(
                    "https://no-wheels-1.onrender.com/user/liked_product",
                    {
                        credentials: "include",
                    }
                );

                const data = await res.json();

                if (res.ok) {
                    setProducts(data.data || []);

                    sessionStorage.setItem(
                        cacheKey,
                        JSON.stringify(data.data || [])
                    );
                }
            } catch (err) {
                console.log("Failed to fetch liked products", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLiked();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading liked products...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">

            {/* HEADER */}
            <div className="sticky top-0 z-40 bg-white shadow-sm px-4 py-3 flex items-center">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full hover:bg-gray-100"
                >
                    <ArrowLeft size={20} />
                </button>

                <h2 className="ml-3 font-semibold text-lg">
                    Liked Products
                </h2>
            </div>

            <div className="p-4">

                {products.length === 0 && (
                    <p className="text-center text-gray-500 mt-10">
                        No liked products yet ❤️
                    </p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {products.map((p) => (
                        <div
                            key={p.product_id}
                            onClick={() =>
                                navigate(`/product/${p.product_id}`)
                            }
                            className="bg-white rounded-xl shadow-sm p-3 cursor-pointer hover:shadow-md transition"
                        >
                            <img
                                src={p.product_images?.[0]}
                                alt={p.product_title}
                                className="w-full h-32 object-cover rounded-lg mb-2"
                            />

                            <h3 className="text-sm font-medium line-clamp-2">
                                {p.product_title}
                            </h3>

                            <p className="text-amber-600 font-semibold mt-1">
                                ₹{p.product_price}
                            </p>

                            {p.product_comparable_price && (
                                <p className="text-xs text-gray-400 line-through">
                                    ₹{p.product_comparable_price}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LikedProducts;