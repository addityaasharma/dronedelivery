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

            <div className="max-w-4xl mx-auto px-4 py-6">
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

            <div
                className="text-center px-4 py-3"
                style={{ background: "#e8dfd5", borderTop: "1px solid #d8cfc5" }}
            >
                <p className="text-[11px]" style={{ color: "#a07850" }}>
                    © {new Date().getFullYear()} No Wheels. All rights reserved. &nbsp;·&nbsp; Made with ❤️ in India
                </p>
            </div>
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


export default Footer;