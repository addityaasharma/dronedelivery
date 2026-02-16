import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CollectionPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [collection, setCollection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================
    // FETCH COLLECTION
    // ==========================
    useEffect(() => {
        const fetchCollection = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await fetch(
                    `https://no-wheels-1.onrender.com/user/collection/${id}`
                );

                const raw = await res.json();

                // 🔥 HANDLE YOUR RESPONSE FORMAT
                const data = Array.isArray(raw) ? raw[0] : raw;

                if (data?.status === "success") {
                    setCollection(data.data);
                } else {
                    setError(data?.message || "Collection not found");
                }

            } catch (err) {
                setError("Failed to load collection");
            } finally {
                setLoading(false);
            }
        };

        fetchCollection();
    }, [id]);

    // ==========================
    // LOADING
    // ==========================
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading collection...
            </div>
        );
    }

    // ==========================
    // ERROR
    // ==========================
    if (error || !collection) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                {error || "Collection not found"}
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
                    {collection.collection_name}
                </h2>
            </div>

            <div className="p-4">

                {/* DESCRIPTION */}
                <p className="text-sm text-gray-600 mb-4">
                    {collection.collection_desc}
                </p>

                {/* EMPTY STATE */}
                {collection.products.length === 0 && (
                    <p className="text-center text-gray-500 mt-8">
                        No products in this collection
                    </p>
                )}

                {/* PRODUCTS GRID */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {collection.products.map((p) => (
                        <div
                            key={p.id}
                            onClick={() => navigate(`/product/${p.id}`)}
                            className="bg-white rounded-xl shadow-sm p-3 cursor-pointer hover:shadow-md transition"
                        >
                            <img
                                src={
                                    p.images?.[0] ||
                                    "https://via.placeholder.com/300x200?text=No+Image"
                                }
                                alt={p.title}
                                className="w-full h-32 object-cover rounded-lg mb-2"
                            />

                            <h3 className="text-sm font-medium line-clamp-2">
                                {p.title}
                            </h3>

                            <p className="text-amber-600 font-semibold mt-1">
                                ₹{p.price}
                            </p>

                            {p.compare_price && (
                                <p className="text-xs text-gray-400 line-through">
                                    ₹{p.compare_price}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CollectionPage;
