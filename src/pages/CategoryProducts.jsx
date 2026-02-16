import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CategoryProducts = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("date");

    // unique cache key
    const cacheKey = `category_${id}_${search}_${sortBy}`;

    // ==========================
    // FETCH PRODUCTS
    // ==========================
    const fetchProducts = async ({ reset = false } = {}) => {
        try {
            setLoading(true);
            setError("");

            const currentPage = reset ? 1 : page;

            const res = await fetch(
                `https://no-wheels-1.onrender.com/user/category/${id}?page=${currentPage}&sort_by=${sortBy}&search=${search}`
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to load products");
            }

            const updatedProducts = reset
                ? data.products
                : [...products, ...data.products];

            setProducts(updatedProducts);
            setHasNext(data.has_next);

            // SAVE CACHE
            sessionStorage.setItem(
                cacheKey,
                JSON.stringify({
                    products: updatedProducts,
                    page: currentPage,
                    hasNext: data.has_next,
                })
            );

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ==========================
    // INITIAL LOAD (CACHE FIRST)
    // ==========================
    useEffect(() => {
        const cached = sessionStorage.getItem(cacheKey);

        if (cached) {
            const parsed = JSON.parse(cached);

            setProducts(parsed.products);
            setPage(parsed.page);
            setHasNext(parsed.hasNext);

            return; // NO API CALL ⚡
        }

        fetchProducts({ reset: true });
    }, [id, search, sortBy]);

    // ==========================
    // LOAD MORE
    // ==========================
    const loadMore = async () => {
        if (loading || !hasNext) return;

        const nextPage = page + 1;
        setPage(nextPage);

        try {
            setLoading(true);

            const res = await fetch(
                `https://no-wheels-1.onrender.com/user/category/${id}?page=${nextPage}&sort_by=${sortBy}&search=${search}`
            );

            const data = await res.json();

            if (res.ok) {
                const updated = [...products, ...data.products];

                setProducts(updated);
                setHasNext(data.has_next);

                sessionStorage.setItem(
                    cacheKey,
                    JSON.stringify({
                        products: updated,
                        page: nextPage,
                        hasNext: data.has_next,
                    })
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">

            {/* HEADER */}
            <div className="sticky top-0 z-40 bg-white shadow-sm px-4 py-3 flex items-center">
                <button
                    onClick={() => navigate("/")}
                    className="p-2 rounded-full hover:bg-gray-100"
                >
                    <ArrowLeft size={20} />
                </button>

                <h2 className="ml-3 font-semibold text-lg">
                    Category Products
                </h2>
            </div>

            <div className="p-4">

                {/* SEARCH + SORT */}
                <div className="flex gap-3 mb-4">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 p-2 border rounded-lg"
                    />

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="p-2 border rounded-lg"
                    >
                        <option value="date">Newest</option>
                        <option value="name">Name</option>
                        <option value="price">Price</option>
                    </select>
                </div>

                {error && (
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                )}

                {/* GRID */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {products.map((p) => (
                        <div
                            key={p.product_id}
                            onClick={() => navigate(`/product/${p.product_id}`)}
                            className="bg-white rounded-xl shadow-sm p-3 cursor-pointer hover:shadow-md transition"
                        >
                            <img
                                src={p.product_images?.[0]}
                                alt={p.product_title}
                                className="w-full h-32 object-cover rounded-lg mb-2"
                            />

                            <h3 className="font-medium text-sm line-clamp-2">
                                {p.product_title}
                            </h3>

                            <p className="text-amber-600 font-semibold mt-1">
                                ₹{p.product_price}
                            </p>
                        </div>
                    ))}
                </div>

                {!loading && products.length === 0 && (
                    <p className="text-center text-gray-500 mt-6">
                        No products found
                    </p>
                )}

                {hasNext && !loading && (
                    <button
                        onClick={loadMore}
                        className="mt-6 w-full bg-amber-500 text-white py-2 rounded-lg"
                    >
                        Load More
                    </button>
                )}

                {loading && (
                    <p className="text-center mt-4 text-gray-500">
                        Loading...
                    </p>
                )}
            </div>
        </div>
    );
};

export default CategoryProducts;
