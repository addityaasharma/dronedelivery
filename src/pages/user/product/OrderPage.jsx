import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    MapPin,
    Zap,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Truck,
    ShieldCheck,
    Package,
    X,
    LogIn,
    Clock,
    CreditCard,
    AlertCircle,
    Loader2,
} from "lucide-react";

import { backend_api } from "../../../api";

/* ─── Helpers ─── */
const formatTime = (date) =>
    date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
const formatDate = (date) =>
    date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });

/* ─── Load Razorpay script once ─── */
function useRazorpay() {
    const loaded = useRef(false);
    useEffect(() => {
        if (loaded.current || document.querySelector('script[src*="razorpay"]')) {
            loaded.current = true;
            return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => { loaded.current = true; };
        document.body.appendChild(script);
    }, []);
}

/* ─── Field Component ─── */
const Field = ({ label, name, placeholder, value, onChange, error, type = "text" }) => (
    <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`w-full px-4 py-3 rounded-xl border-2 bg-gray-50 text-sm font-medium transition-all outline-none
        focus:bg-white focus:border-amber-400
        ${error ? "border-red-400 bg-red-50" : "border-gray-200"}`}
        />
        {error && (
            <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={12} /> {error}
            </p>
        )}
    </div>
);

/* ─── Login Popup ─── */
const LoginPopup = ({ onClose, onLogin }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.5)" }}>
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 relative animate-in fade-in zoom-in duration-200">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-full transition-colors">
                <X size={18} />
            </button>
            <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <LogIn size={28} className="text-amber-500" />
                </div>
                <h2 className="text-xl font-bold mb-2 text-gray-900">Login Required</h2>
                <p className="text-gray-500 text-sm mb-7 leading-relaxed">
                    You need to be logged in to place an order and track your delivery.
                </p>
                <button
                    onClick={onLogin}
                    className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold py-3.5 rounded-2xl mb-3 transition-colors text-sm"
                >
                    Go to Login
                </button>
                <button onClick={onClose} className="text-gray-400 text-sm hover:text-gray-600 transition-colors">
                    Continue browsing
                </button>
            </div>
        </div>
    </div>
);

/* ─── Delivery Option Card ─── */
const DeliveryCard = ({ selected, onClick, icon: Icon, label, sublabel, badge, badgeColor }) => (
    <button
        onClick={onClick}
        className={`flex-1 flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left
      ${selected ? "border-amber-400 bg-amber-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"}`}
    >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
      ${selected ? "bg-amber-400" : "bg-white border border-gray-200"}`}>
            <Icon size={18} className={selected ? "text-gray-900" : "text-gray-500"} />
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-bold text-gray-900">{label}</p>
                {badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
                        {badge}
                    </span>
                )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{sublabel}</p>
        </div>
        <div className={`w-4 h-4 rounded-full border-2 shrink-0 transition-all
      ${selected ? "border-amber-400 bg-amber-400" : "border-gray-300"}`}>
            {selected && <div className="w-full h-full rounded-full scale-50 bg-white" />}
        </div>
    </button>
);

/* ─── Main OrderPage ─── */
const OrderPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    useRazorpay();

    const { cartItems = [], singleProduct = null } = location.state || {};
    const items = singleProduct
        ? [{ ...singleProduct, quantity: singleProduct.quantity || 1 }]
        : cartItems;

    const [deliveryType, setDeliveryType] = useState("express");
    const [address, setAddress] = useState({ name: "", phone: "", pincode: "", street: "", city: "", state: "" });
    const [errors, setErrors] = useState({});
    const [addressSaved, setAddressSaved] = useState(false);
    const [addressOpen, setAddressOpen] = useState(true);
    const [placing, setPlacing] = useState(false);
    const [placed, setPlaced] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);

    useEffect(() => {
        if (!items.length) {
            navigate("/");
        }
    }, [items, navigate]);

    const subtotal = items.reduce((sum, i) => sum + (i.price ?? i.product_price ?? 0) * (i.quantity || 1), 0);
    const deliveryFee = deliveryType === "express" ? 29 : 0;
    const total = subtotal + deliveryFee;

    const expressTime = new Date(Date.now() + 20 * 60 * 1000);
    const sameDay = new Date();
    sameDay.setHours(23, 59, 0, 0);

    const handleChange = (e) => {
        setAddress((p) => ({ ...p, [e.target.name]: e.target.value }));
        if (errors[e.target.name]) setErrors((p) => ({ ...p, [e.target.name]: "" }));
    };

    const validate = () => {
        const rules = { name: "Full name required", phone: "Phone number required", street: "Street address required", city: "City required", state: "State required", pincode: "Pincode required" };
        const newErrors = {};
        Object.entries(rules).forEach(([key, msg]) => { if (!address[key].trim()) newErrors[key] = msg; });
        if (address.phone && !/^\d{10}$/.test(address.phone.trim())) newErrors.phone = "Enter a valid 10-digit phone number";
        if (address.pincode && !/^\d{6}$/.test(address.pincode.trim())) newErrors.pincode = "Enter a valid 6-digit pincode";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const saveAddress = () => {
        if (!validate()) return;
        setAddressSaved(true);
        setAddressOpen(false);
    };

    const placeOrder = async () => {
        if (placing) return;

        if (!addressSaved) { setAddressOpen(true); return; }
        setPlacing(true);
        try {
            const orderRes = await fetch(`${backend_api}/user/order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    address: `${address.street}, ${address.city}, ${address.state}`,
                    pincode: address.pincode,
                    items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity || 1 })),
                }),
            });

            if (orderRes.status === 401) { setShowLoginPopup(true); setPlacing(false); return; }

            const orderData = await orderRes.json();
            if (orderData.status !== "success") { alert("Failed to create order. Please try again."); setPlacing(false); return; }

            const payRes = await fetch(`${backend_api}/user/payment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ payment_id: orderData.payment_id }),
            });

            let paymentData;

            try {
                paymentData = await payRes.json();
            } catch {
                const text = await payRes.text();
                console.error("Server returned HTML:", text);
                alert("Payment server error. Check backend logs.");
                return;
            }
            if (paymentData.status !== "success") { alert("Payment initiation failed. Please try again."); setPlacing(false); return; }

            const options = {
                key: paymentData.key,
                amount: paymentData.amount,
                currency: paymentData.currency,
                name: "Drone Store",
                description: "Order Payment",
                order_id: paymentData.razorpay_order_id,

                prefill: {
                    name: address.name,
                    contact: address.phone
                },

                handler: () => {
                    setPlaced(true);
                },
                modal: {
                    ondismiss: () => setPlacing(false)
                },
                theme: {
                    color: "#f59e0b"
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Please try again.");
            setPlacing(false);
        }
    };

    /* ── Success ── */
    if (placed) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 to-orange-50 px-4">
                <div className="bg-white rounded-3xl p-10 text-center shadow-xl max-w-sm w-full">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                        <CheckCircle2 size={52} className="text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-gray-900">Order Placed! 🎉</h2>
                    <p className="text-gray-500 mb-1 text-sm">Expected delivery</p>
                    <p className="text-gray-900 font-bold text-lg mb-8">
                        {deliveryType === "express" ? formatTime(expressTime) : formatDate(sameDay)}
                    </p>
                    <div className="flex flex-col gap-3">
                        <button onClick={() => navigate("/track-order")} className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-2xl text-sm hover:bg-gray-800 transition-colors">
                            Track Order
                        </button>
                        <button onClick={() => navigate("/")} className="w-full bg-amber-400 hover:bg-amber-500 font-bold py-3.5 rounded-2xl text-sm transition-colors">
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /* ── Main UI ── */
    return (
        <div className="min-h-screen bg-gray-50">
            {showLoginPopup && (
                <LoginPopup onClose={() => setShowLoginPopup(false)} onLogin={() => navigate("/login")} />
            )}

            <div className="max-w-2xl mx-auto py-6 px-4 space-y-4 pb-32">

                {/* Header */}
                <div className="flex items-center gap-3 pb-1">
                    <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full bg-white border hover:bg-gray-50 transition-colors">
                        <ChevronDown size={18} className="rotate-90" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
                </div>

                {/* ── DELIVERY TYPE ── */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4">
                    <p className="text-sm font-bold text-gray-700 mb-3">Delivery Option</p>
                    <div className="flex gap-3">
                        <DeliveryCard
                            selected={deliveryType === "express"}
                            onClick={() => setDeliveryType("express")}
                            icon={Zap}
                            label="Express"
                            sublabel={`By ${formatTime(expressTime)} · ₹29`}
                            badge="20 min"
                            badgeColor="bg-amber-100 text-amber-700"
                        />
                        <DeliveryCard
                            selected={deliveryType === "sameday"}
                            onClick={() => setDeliveryType("sameday")}
                            icon={Truck}
                            label="Same Day"
                            sublabel="FREE delivery · By midnight"
                            badge="FREE"
                            badgeColor="bg-green-100 text-green-700"
                        />
                    </div>
                </div>

                {/* ── ADDRESS ── */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <button
                        onClick={() => setAddressOpen(!addressOpen)}
                        className="flex justify-between items-center w-full p-4 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold transition-colors
                ${addressSaved ? "bg-green-500 text-white" : "bg-amber-400 text-gray-900"}`}>
                                {addressSaved ? <CheckCircle2 size={16} /> : <MapPin size={16} />}
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-sm text-gray-900">Delivery Address</p>
                                {addressSaved && !addressOpen && (
                                    <p className="text-xs text-gray-500 mt-0.5">{address.name} · {address.street}, {address.city}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {addressSaved && (
                                <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">Edit</span>
                            )}
                            {addressOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                        </div>
                    </button>

                    {addressOpen && (
                        <div className="p-4 border-t border-gray-100 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Full Name" name="name" placeholder="John Doe" value={address.name} onChange={handleChange} error={errors.name} />
                                <Field label="Phone" name="phone" placeholder="10-digit number" value={address.phone} onChange={handleChange} error={errors.phone} type="tel" />
                            </div>
                            <Field label="Street Address" name="street" placeholder="House no, building, street" value={address.street} onChange={handleChange} error={errors.street} />
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="City" name="city" placeholder="City" value={address.city} onChange={handleChange} error={errors.city} />
                                <Field label="State" name="state" placeholder="State" value={address.state} onChange={handleChange} error={errors.state} />
                            </div>
                            <Field label="Pincode" name="pincode" placeholder="6-digit pincode" value={address.pincode} onChange={handleChange} error={errors.pincode} type="number" />

                            <button
                                onClick={saveAddress}
                                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl mt-1 transition-colors text-sm"
                            >
                                Save & Continue
                            </button>
                        </div>
                    )}
                </div>

                {/* ── ORDER SUMMARY ── */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Package size={16} className="text-gray-400" />
                        <h3 className="font-bold text-sm text-gray-900">Order Summary · {items.length} {items.length === 1 ? "item" : "items"}</h3>
                    </div>

                    <div className="space-y-3 mb-4">
                        {items.map((item, idx) => {
                            const name = item.title || item.product_title || "Product";
                            const price = item.price ?? item.product_price ?? 0;
                            const qty = item.quantity || 1;
                            return (
                                <div key={idx} className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        {item.image || item.product_image ? (
                                            <img src={item.image || item.product_image} alt={name} className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0 border" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100">
                                                <Package size={18} className="text-amber-400" />
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
                                            <p className="text-xs text-gray-400">Qty: {qty}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold text-gray-900 shrink-0">₹{price * qty}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="border-t border-gray-100 pt-3 space-y-2.5">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span className="font-medium">₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Delivery ({deliveryType === "express" ? "Express" : "Same Day"})</span>
                            <span className={`font-medium ${deliveryFee === 0 ? "text-green-600" : ""}`}>
                                {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                            </span>
                        </div>
                        <div className="flex justify-between font-bold text-base text-gray-900 pt-1 border-t border-gray-100">
                            <span>Total Payable</span>
                            <span>₹{total}</span>
                        </div>
                    </div>
                </div>

                {/* ── TRUST BADGES ── */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { icon: ShieldCheck, label: "Secure Payment" },
                        { icon: Truck, label: "Fast Delivery" },
                        { icon: Package, label: "Easy Returns" },
                    ].map(({ icon: Icon, label }) => (
                        <div key={label} className="bg-white rounded-2xl border border-gray-200 p-3 flex flex-col items-center gap-1.5">
                            <Icon size={18} className="text-amber-500" />
                            <p className="text-[11px] font-semibold text-gray-500 text-center">{label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── STICKY PAY BUTTON ── */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 shadow-lg">
                <div className="max-w-2xl mx-auto">
                    {!addressSaved && (
                        <p className="text-xs text-center text-gray-400 mb-2 flex items-center justify-center gap-1">
                            <AlertCircle size={12} /> Save your delivery address to continue
                        </p>
                    )}
                    <button
                        onClick={placeOrder}
                        disabled={placing}
                        className={`w-full py-4 font-bold rounded-2xl flex items-center justify-center gap-2 text-sm transition-all
              ${!addressSaved
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-amber-400 hover:bg-amber-500 text-gray-900 active:scale-[0.98]"
                            }`}
                    >
                        {placing ? (
                            <><Loader2 size={18} className="animate-spin" /> Processing...</>
                        ) : (
                            <><CreditCard size={18} /> Pay ₹{total}</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;