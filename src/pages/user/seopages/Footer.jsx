import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GiMedicines } from "react-icons/gi";
import {
    FiHome,
    FiGrid,
    FiShoppingCart,
    FiHeart,
    FiUser,
    FiMapPin,
    FiPhone,
    FiMail,
    FiInstagram,
    FiFacebook,
    FiTwitter,
    FiChevronDown,
} from "react-icons/fi";

/* ── Accordion section for mobile ── */
const FooterSection = ({ title, children }) => {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ borderBottom: "1px solid #e8dfd5" }}>
            <button
                className="w-full flex items-center justify-between py-3 text-left"
                onClick={() => setOpen((o) => !o)}
            >
                <span className="text-sm font-bold tracking-wide" style={{ color: "#2e1f0e" }}>
                    {title}
                </span>
                <FiChevronDown
                    size={16}
                    style={{
                        color: "#b8a090",
                        transform: open ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.25s",
                    }}
                />
            </button>
            {open && <div className="pb-4">{children}</div>}
        </div>
    );
};

/* ── Desktop section (always visible) ── */
const FooterCol = ({ title, children }) => (
    <div>
        <h4 className="text-sm font-bold tracking-widest uppercase mb-4"
            style={{ color: "#6b4f2a", letterSpacing: "0.08em" }}>
            {title}
        </h4>
        {children}
    </div>
);

const Footer = () => {
    const navigate = useNavigate();

    const quickLinks = [
        { label: "Home", path: "/" },
        { label: "Track Order", path: "/track-order" },
        { label: "My Cart", path: "/cart" },
        { label: "Wishlist", path: "/liked-products" },
        { label: "My Profile", path: "/profile" },
    ];

    const policyLinks = [
        { label: "Privacy Policy", path: "/privacy-policy" },
        { label: "Terms of Service", path: "/terms" },
        { label: "Refund & Returns", path: "/refund-policy" },
        { label: "Shipping Policy", path: "/shipping-policy" },
        { label: "Contact Us", path: "/contact" },
    ];

    const socialLinks = [
        { icon: <FiInstagram size={18} />, label: "Instagram", href: "#" },
        { icon: <FiFacebook size={18} />, label: "Facebook", href: "#" },
        { icon: <FiTwitter size={18} />, label: "Twitter", href: "#" },
    ];

    const linkStyle = {
        color: "#9e8a74",
        fontFamily: "'Georgia', serif",
        fontSize: 13,
        display: "block",
        padding: "4px 0",
        cursor: "pointer",
        textDecoration: "none",
        transition: "color 0.2s",
    };

    return (
        <footer style={{ background: "#f0ebe3", borderTop: "1px solid #e0d8ce", fontFamily: "'Georgia', serif" }}>

            {/* ── TOP BAND ── */}
            <div
                className="px-4 py-4 flex flex-wrap items-center justify-between gap-3"
                style={{ background: "#2e1f0e", borderBottom: "1px solid #3d2a12" }}
            >
                <div className="flex items-center gap-2">
                    <GiMedicines size={22} style={{ color: "#fbbf24" }} />
                    <span className="font-bold text-base tracking-wide" style={{ color: "#fde68a" }}>
                        No Wheels
                    </span>
                </div>
                <p className="text-xs" style={{ color: "#a07850" }}>
                    Medicines delivered to your doorstep
                </p>
                <div className="flex items-center gap-2">
                    {socialLinks.map(({ icon, label, href }) => (
                        <a
                            key={label}
                            href={href}
                            aria-label={label}
                            className="p-2 rounded-full transition-colors"
                            style={{ color: "#d4a76a", background: "rgba(255,255,255,0.07)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                        >
                            {icon}
                        </a>
                    ))}
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="max-w-4xl mx-auto px-4 py-6">

                {/* Mobile: accordions */}
                <div className="sm:hidden space-y-0">
                    <FooterSection title="Quick Links">
                        <ul className="space-y-1">
                            {quickLinks.map(({ label, path }) => (
                                <li key={label}>
                                    <span
                                        style={linkStyle}
                                        onClick={() => navigate(path)}
                                        onMouseEnter={(e) => (e.currentTarget.style.color = "#d97706")}
                                        onMouseLeave={(e) => (e.currentTarget.style.color = "#9e8a74")}
                                    >
                                        {label}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </FooterSection>

                    <FooterSection title="Policies">
                        <ul className="space-y-1">
                            {policyLinks.map(({ label, path }) => (
                                <li key={label}>
                                    <span
                                        style={linkStyle}
                                        onClick={() => navigate(path)}
                                        onMouseEnter={(e) => (e.currentTarget.style.color = "#d97706")}
                                        onMouseLeave={(e) => (e.currentTarget.style.color = "#9e8a74")}
                                    >
                                        {label}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </FooterSection>

                    <FooterSection title="Contact Us">
                        <ContactInfo />
                    </FooterSection>
                </div>

                {/* Desktop: 3-column grid */}
                <div className="hidden sm:grid grid-cols-3 gap-10">
                    <FooterCol title="Quick Links">
                        <ul className="space-y-1">
                            {quickLinks.map(({ label, path }) => (
                                <li key={label}>
                                    <span
                                        style={linkStyle}
                                        onClick={() => navigate(path)}
                                        onMouseEnter={(e) => (e.currentTarget.style.color = "#d97706")}
                                        onMouseLeave={(e) => (e.currentTarget.style.color = "#9e8a74")}
                                    >
                                        {label}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </FooterCol>

                    <FooterCol title="Policies">
                        <ul className="space-y-1">
                            {policyLinks.map(({ label, path }) => (
                                <li key={label}>
                                    <span
                                        style={linkStyle}
                                        onClick={() => navigate(path)}
                                        onMouseEnter={(e) => (e.currentTarget.style.color = "#d97706")}
                                        onMouseLeave={(e) => (e.currentTarget.style.color = "#9e8a74")}
                                    >
                                        {label}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </FooterCol>

                    <FooterCol title="Contact Us">
                        <ContactInfo />
                    </FooterCol>
                </div>

                {/* Trust badges */}
                <div className="mt-8 pt-6 flex flex-wrap justify-center gap-4"
                    style={{ borderTop: "1px solid #e0d8ce" }}>
                    {[
                        { icon: "🔒", label: "Secure Payments" },
                        { icon: "🚚", label: "Fast Delivery" },
                        { icon: "✅", label: "Genuine Medicines" },
                        { icon: "💊", label: "Licensed Pharmacy" },
                    ].map(({ icon, label }) => (
                        <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                            style={{ background: "#fff", border: "1px solid #e8dfd5" }}>
                            <span className="text-sm">{icon}</span>
                            <span className="text-[11px] font-semibold" style={{ color: "#6b4f2a" }}>{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── BOTTOM BAR ── */}
            <div
                className="text-center px-4 py-3"
                style={{ background: "#e8dfd5", borderTop: "1px solid #d8cfc5" }}
            >
                <p className="text-[11px]" style={{ color: "#a07850" }}>
                    © {new Date().getFullYear()} No Wheels. All rights reserved. &nbsp;·&nbsp; Made with ❤️ in India
                </p>
            </div>

            {/* ── MOBILE BOTTOM NAV ── */}
            <MobileBottomNav />
        </footer>
    );
};

/* ── Contact info block (shared between mobile/desktop) ── */
const ContactInfo = () => (
    <div className="space-y-3">
        {[
            { icon: <FiPhone size={14} />, text: "+91 98765 43210", href: "tel:+919876543210" },
            { icon: <FiMail size={14} />, text: "support@nowheels.in", href: "mailto:support@nowheels.in" },
            { icon: <FiMapPin size={14} />, text: "Indore, Madhya Pradesh, India", href: null },
        ].map(({ icon, text, href }) => (
            <div key={text} className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0" style={{ color: "#d97706" }}>{icon}</span>
                {href ? (
                    <a href={href} className="text-xs leading-relaxed hover:text-amber-700 transition-colors"
                        style={{ color: "#9e8a74" }}>
                        {text}
                    </a>
                ) : (
                    <span className="text-xs leading-relaxed" style={{ color: "#9e8a74" }}>{text}</span>
                )}
            </div>
        ))}
    </div>
);

/* ── Mobile sticky bottom nav ── */
const MobileBottomNav = () => {
    const navigate = useNavigate();
    const path = window.location.pathname;

    const tabs = [
        { icon: <FiHome size={22} />, label: "Home", path: "/" },
        { icon: <FiGrid size={22} />, label: "Categories", path: "/categories" },
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
            {tabs.map(({ icon, label, path: tabPath }) => {
                const active = path === tabPath;
                return (
                    <button
                        key={label}
                        onClick={() => navigate(tabPath)}
                        className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-all"
                        style={{ color: active ? "#d97706" : "#b8a090" }}
                    >
                        <span
                            className="transition-transform"
                            style={{ transform: active ? "scale(1.15)" : "scale(1)" }}
                        >
                            {icon}
                        </span>
                        <span
                            className="text-[10px] font-semibold"
                            style={{
                                color: active ? "#d97706" : "#b8a090",
                                fontFamily: "'Georgia', serif",
                            }}
                        >
                            {label}
                        </span>
                        {active && (
                            <span
                                className="absolute bottom-0 w-8 rounded-full"
                                style={{ height: 2.5, background: "#d97706", marginBottom: "env(safe-area-inset-bottom)" }}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default Footer;