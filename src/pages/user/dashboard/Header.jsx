import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiMenu,
    FiX,
    FiSearch,
    FiMapPin,
    FiUser
} from "react-icons/fi";
import {
    MdMedicalServices,
    MdOutlineHealthAndSafety,
    MdBabyChangingStation,
    MdOutlineLocalPharmacy
} from "react-icons/md";
import { GiMedicines } from "react-icons/gi";

const Header = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const goTo = (path) => {
        setOpen(false);
        navigate(path);
    };

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/60">
                <div className="flex items-center justify-between px-4 py-3">
                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="p-2 rounded-md hover:bg-gray-100"
                        aria-label="Open menu"
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

                    <button
                        type="button"
                        onClick={() => navigate("/profile")}
                        className="p-2 rounded-full hover:bg-gray-100"
                        aria-label="Profile"
                    >
                        <FiUser size={22} />
                    </button>

                </div>
            </header>


            {open && (
                <div className="fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setOpen(false)}
                    />

                    <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl p-6">
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

                        <h3 className="text-gray-500 text-sm mb-3">Categories</h3>

                        <ul className="space-y-3">
                            <li
                                onClick={() => goTo("/category/general")}
                                className="flex items-center gap-3 cursor-pointer hover:text-amber-600"
                            >
                                <GiMedicines size={18} />
                                General Medicines
                            </li>

                            <li
                                onClick={() => goTo("/category/advanced")}
                                className="flex items-center gap-3 cursor-pointer hover:text-amber-600"
                            >
                                <MdMedicalServices size={18} />
                                Advanced Medicines
                            </li>

                            <li
                                onClick={() => goTo("/category/chronic")}
                                className="flex items-center gap-3 cursor-pointer hover:text-amber-600"
                            >
                                <MdOutlineHealthAndSafety size={18} />
                                Chronic Care
                            </li>

                            <li
                                onClick={() => goTo("/category/personal-care")}
                                className="flex items-center gap-3 cursor-pointer hover:text-amber-600"
                            >
                                <MdOutlineLocalPharmacy size={18} />
                                Personal Care
                            </li>

                            <li
                                onClick={() => goTo("/category/baby-care")}
                                className="flex items-center gap-3 cursor-pointer hover:text-amber-600"
                            >
                                <MdBabyChangingStation size={18} />
                                Baby & Mother Care
                            </li>
                        </ul>
                    </aside>
                </div>
            )}

            <div className="h-16" />
        </>
    );
};

export default Header;
