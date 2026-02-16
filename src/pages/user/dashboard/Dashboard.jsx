import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const Dashboard = () => {
    const navigate = useNavigate();

    // ==========================
    // STATE
    // ==========================
    const [banners, setBanners] = useState([]);
    const [collections, setCollections] = useState([]);
    const [products, setProducts] = useState([]);

    const [currentIndex, setCurrentIndex] = useState(0);

    const [loadingBanners, setLoadingBanners] = useState(true);
    const [loadingCollections, setLoadingCollections] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);

    const BANNER_CACHE = "home_banners";
    const COLLECTION_CACHE = "home_collections";
    const PRODUCT_CACHE = "home_products";

    // ==========================
    // FETCH BANNERS
    // ==========================
    useEffect(() => {
        const loadBanners = async () => {
            try {
                const cached = sessionStorage.getItem(BANNER_CACHE);
                if (cached) {
                    setBanners(JSON.parse(cached));
                    setLoadingBanners(false);
                    return;
                }

                const res = await fetch(
                    "https://no-wheels-1.onrender.com/user/banner"
                );

                const data = await res.json();

                if (res.ok) {
                    setBanners(data.data || []);
                    sessionStorage.setItem(
                        BANNER_CACHE,
                        JSON.stringify(data.data || [])
                    );
                }
            } finally {
                setLoadingBanners(false);
            }
        };

        loadBanners();
    }, []);

    // ==========================
    // FETCH COLLECTIONS
    // ==========================
    useEffect(() => {
        const loadCollections = async () => {
            try {
                const cached = sessionStorage.getItem(COLLECTION_CACHE);
                if (cached) {
                    setCollections(JSON.parse(cached));
                    setLoadingCollections(false);
                    return;
                }

                const res = await fetch(
                    "https://no-wheels-1.onrender.com/user/collection"
                );

                const data = await res.json();

                if (res.ok) {
                    setCollections(data.result || []);
                    sessionStorage.setItem(
                        COLLECTION_CACHE,
                        JSON.stringify(data.result || [])
                    );
                }
            } finally {
                setLoadingCollections(false);
            }
        };

        loadCollections();
    }, []);

    // ==========================
    // FETCH PERSONALIZED PRODUCTS
    // ==========================
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const cached = sessionStorage.getItem(PRODUCT_CACHE);
                if (cached) {
                    setProducts(JSON.parse(cached));
                    setLoadingProducts(false);
                    return;
                }

                const res = await fetch(
                    "https://no-wheels-1.onrender.com/user/product?limit=12",
                    {
                        credentials: "include",
                    }
                );

                const data = await res.json();

                // smart_feed may return different shape
                const feed = data.data || data.products || data || [];

                setProducts(feed);

                sessionStorage.setItem(
                    PRODUCT_CACHE,
                    JSON.stringify(feed)
                );
            } catch {
                console.log("Failed to load products");
            } finally {
                setLoadingProducts(false);
            }
        };

        loadProducts();
    }, []);

    // ==========================
    // AUTO SLIDE BANNERS
    // ==========================
    useEffect(() => {
        if (banners.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) =>
                prev === banners.length - 1 ? 0 : prev + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, [banners]);

    return (
        <div className="min-h-screen bg-gray-100">

            <Header />

            <main className="pt-28 px-4 space-y-8">

                {/* ===============================
                    BANNERS
                =============================== */}
                {loadingBanners ? (
                    <div className="w-full h-44 rounded-2xl bg-gray-200 animate-pulse" />
                ) : (
                    banners.length > 0 && (
                        <div className="relative overflow-hidden rounded-2xl shadow-sm">
                            <div
                                className="flex transition-transform duration-500"
                                style={{
                                    transform: `translateX(-${currentIndex * 100}%)`,
                                }}
                            >
                                {banners.map((banner) => (
                                    <a
                                        key={banner.id}
                                        href={banner.link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="min-w-full"
                                    >
                                        <img
                                            src={banner.image_url}
                                            alt="banner"
                                            className="w-full h-44 object-cover"
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )
                )}

                {/* ===============================
                    COLLECTIONS
                =============================== */}
                <section>
                    <h2 className="text-lg font-semibold mb-3">Collections</h2>

                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {loadingCollections
                            ? [1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="min-w-40 h-24 bg-gray-200 rounded-xl animate-pulse"
                                />
                            ))
                            : collections.map((col) => (
                                <div
                                    key={col.id}
                                    onClick={() =>
                                        navigate(`/collection/${col.id}`)
                                    }
                                    className="min-w-40 bg-white rounded-xl shadow-sm p-4 cursor-pointer"
                                >
                                    <h3 className="text-sm font-semibold">
                                        {col.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                        {col.description}
                                    </p>
                                </div>
                            ))}
                    </div>
                </section>

                {/* ===============================
                    PERSONALIZED PRODUCTS
                =============================== */}
                <section>
                    <h2 className="text-lg font-semibold mb-3">
                        Recommended For You
                    </h2>

                    {loadingProducts ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="h-48 bg-gray-200 rounded-xl animate-pulse"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {products.map((p) => (
                                <div
                                    key={p.product_id || p.id}
                                    onClick={() =>
                                        navigate(
                                            `/product/${p.product_id || p.id}`
                                        )
                                    }
                                    className="bg-white rounded-xl shadow-sm p-3 cursor-pointer hover:shadow-md"
                                >
                                    <img
                                        src={
                                            p.product_images?.[0] ||
                                            p.images?.[0] ||
                                            "https://via.placeholder.com/300x200?text=No+Image"
                                        }
                                        className="w-full h-32 object-cover rounded-lg mb-2"
                                    />

                                    <h3 className="text-sm font-medium line-clamp-2">
                                        {p.product_title || p.title}
                                    </h3>

                                    <p className="text-amber-600 font-semibold mt-1">
                                        ₹{p.product_price || p.price}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
