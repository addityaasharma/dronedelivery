import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiMenu,
    FiX,
    FiSearch,
    FiMapPin,
    FiUser
} from "react-icons/fi";
import { GiMedicines } from "react-icons/gi";
import { FiHeart, FiShoppingCart } from "react-icons/fi";

const Header = () => {
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const fetchedOnce = useRef(false);

    const goTo = (path) => {
        setOpen(false);
        navigate(path);
    };

    // ==========================
    // FETCH CATEGORIES (ONLY ONCE)
    // ==========================
    useEffect(() => {
        if (fetchedOnce.current) return;
        fetchedOnce.current = true;

        const cached = sessionStorage.getItem("categories");

        if (cached) {
            setCategories(JSON.parse(cached));
            setLoading(false);
            return;
        }

        const fetchCategories = async () => {
            try {
                const res = await fetch(
                    "https://no-wheels-1.onrender.com/user/category"
                );

                const data = await res.json();

                if (res.ok) {
                    setCategories(data.categories || []);

                    // SAVE CACHE
                    sessionStorage.setItem(
                        "categories",
                        JSON.stringify(data.categories)
                    );
                }
            } catch (err) {
                console.log("Category fetch failed", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);


    return (
        <>
            {/* HEADER */}
            <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/60">
                <div className="flex items-center justify-between px-4 py-3">

                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="p-2 rounded-md hover:bg-gray-100"
                    >
                        <FiMenu size={22} />
                    </button>

                    <div className="flex-1 px-4 relative">
                        <FiSearch className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search medicines…"
                            className="w-full max-w-md mx-auto block pl-10 pr-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                    </div>

                    <div className="flex items-center gap-1">

                        {/* CART */}
                        <button
                            onClick={() => navigate("/cart")}
                            className="p-2 rounded-full hover:bg-gray-100"
                        >
                            <FiShoppingCart size={22} />
                        </button>

                        {/* LIKED */}
                        <button
                            onClick={() => navigate("/liked-products")}
                            className="p-2 rounded-full hover:bg-gray-100"
                        >
                            <FiHeart size={22} />
                        </button>

                        {/* PROFILE */}
                        <button
                            onClick={() => navigate("/profile")}
                            className="p-2 rounded-full hover:bg-gray-100"
                        >
                            <FiUser size={22} />
                        </button>
                    </div>
                </div>
            </header>

            {/* DELIVERY STATUS */}
            <div
                onClick={() => navigate("/track-order")}
                className="fixed top-16 left-0 w-full z-40 bg-amber-50 border-b border-amber-200 cursor-pointer hover:bg-amber-100 animate-pulse"
            >
                <div className="max-w-7xl mx-auto px-3 py-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2 text-amber-700 font-medium">
                        🚁 Delivering in <span className="font-semibold">12 mins</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                        <span>📍 3.4 km away</span>
                        <span className="hidden sm:inline">📦 Order #DRN123</span>
                    </div>
                </div>
            </div>

            {/* SIDEBAR */}
            {open && (
                <div className="fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setOpen(false)}
                    />

                    <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl p-6 overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Menu</h2>
                            <button onClick={() => setOpen(false)}>
                                <FiX size={22} />
                            </button>
                        </div>

                        <button
                            onClick={() => goTo("/track-order")}
                            className="w-full flex items-center gap-3 py-2 font-medium hover:text-amber-600"
                        >
                            <FiMapPin size={18} />
                            Track Order
                        </button>

                        <hr className="my-4" />

                        <h3 className="text-gray-500 text-sm mb-3">
                            Categories
                        </h3>

                        <ul className="space-y-3">

                            {loading && (
                                <li className="text-gray-400 text-sm">
                                    Loading categories...
                                </li>
                            )}

                            {!loading &&
                                categories.map((cat) => (
                                    <li
                                        key={cat.category_id}
                                        onClick={() =>
                                            goTo(`/category/${cat.category_id}`)
                                        }
                                        className="flex items-center gap-3 cursor-pointer hover:text-amber-600"
                                    >
                                        <GiMedicines size={18} />
                                        {cat.category_name}
                                    </li>
                                ))}

                            {!loading && categories.length === 0 && (
                                <li className="text-gray-400 text-sm">
                                    No categories found
                                </li>
                            )}
                        </ul>
                    </aside>
                </div>
            )}

            <div className="h-28" />
        </>
    );
};

export default Header;