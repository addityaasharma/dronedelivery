import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiGrid, FiShoppingCart, FiHeart, FiUser } from "react-icons/fi";

const MobileBottomNav = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const tabs = [
        { icon: <FiHome size={22} />, label: "Home", path: "/" },
        { icon: <FiGrid size={22} />, label: "Categories", path: "/category" },
        { icon: <FiShoppingCart size={22} />, label: "Cart", path: "/cart" },
        { icon: <FiHeart size={22} />, label: "Wishlist", path: "/liked-products" },
        { icon: <FiUser size={22} />, label: "Profile", path: "/profile" },
    ];

    return (
        <div
            className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex items-stretch"
            style={{
                background: "rgba(255,252,248,0.97)",
                backdropFilter: "blur(14px)",
                borderTop: "1px solid #e8dfd5",
                boxShadow: "0 -4px 20px rgba(180,140,100,0.12)",
                paddingBottom: "env(safe-area-inset-bottom)",
            }}
        >
            {tabs.map(({ icon, label, path }) => {
                const active =
                    path === "/"
                        ? pathname === "/"
                        : pathname === path || pathname.startsWith(path + "/");

                return (
                    <button
                        key={label}
                        onClick={() => navigate(path)}
                        className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 relative transition-all"
                        style={{ color: active ? "#d97706" : "#b8a090" }}
                    >
                        <span
                            style={{
                                transform: active ? "scale(1.15)" : "scale(1)",
                                transition: "transform 0.2s",
                            }}
                        >
                            {icon}
                        </span>
                        <span
                            style={{
                                fontSize: "10px",
                                fontWeight: "600",
                                color: active ? "#d97706" : "#b8a090",
                                fontFamily: "'Georgia', serif",
                            }}
                        >
                            {label}
                        </span>
                        {active && (
                            <span
                                style={{
                                    position: "absolute",
                                    bottom: 0,
                                    width: "32px",
                                    height: "2.5px",
                                    background: "#d97706",
                                    borderRadius: "9999px",
                                }}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default MobileBottomNav;