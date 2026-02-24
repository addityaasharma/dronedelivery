import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    MapPin,
    Clock,
    Zap,
    CreditCard,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Edit2,
    Truck,
    ShieldCheck,
    Package,
    X,
    LogIn
} from "lucide-react";
import { backend_api } from "../../../api";

const formatTime = (date) =>
    date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

const formatDate = (date) =>
    date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });

// ─── Login Popup ───────────────────────────────────────────────────────────────
const LoginPopup = ({ onClose, onLogin }) => (
    <div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
    >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
                <X size={18} className="text-gray-500" />
            </button>

            <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                    <LogIn size={26} className="text-amber-500" />
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2">Please Login</h2>
                <p className="text-sm text-gray-500 mb-6">
                    You need to be logged in to place an order. It only takes a moment!
                </p>

                <button
                    onClick={onLogin}
                    className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold py-3 rounded-full transition-colors shadow-sm mb-3"
                >
                    Go to Login
                </button>

                <button
                    onClick={onClose}
                    className="w-full text-sm text-gray-500 hover:text-gray-700 py-2 transition-colors"
                >
                    Continue Browsing
                </button>
            </div>
        </div>
    </div>
);

const OrderPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartItems = [], singleProduct = null } = location.state || {};
    const [deliveryType, setDeliveryType] = useState("express");
    const [address, setAddress] = useState({
        name: "", phone: "", pincode: "", street: "", city: "", state: "",
    });
    const [addressOpen, setAddressOpen] = useState(true);
    const [addressSaved, setAddressSaved] = useState(false);
    const [upiId, setUpiId] = useState("");
    const [upiError, setUpiError] = useState("");
    const [placing, setPlacing] = useState(false);
    const [placed, setPlaced] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    const items = singleProduct
        ? [{ ...singleProduct, quantity: singleProduct.quantity || 1 }]
        : cartItems;

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, []);

    if (items.length === 0) {
        navigate("/");
        return null;
    }

    const subtotal = items.reduce((s, i) => {
        const price = i.price ?? i.product_price ?? 0;
        return s + price * (i.quantity || 1);
    }, 0);
    const deliveryFee = deliveryType === "express" ? 29 : (subtotal >= 499 ? 0 : 40);
    const total = subtotal + deliveryFee;

    const express20 = new Date(Date.now() + 20 * 60 * 1000);
    const sameDay = new Date();
    sameDay.setHours(23, 59, 0, 0);

    const handleAddressChange = (e) =>
        setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const saveAddress = () => {
        const { name, phone, pincode, street, city, state } = address;
        if (!name || !phone || !pincode || !street || !city || !state) {
            alert("Please fill all address fields.");
            return;
        }
        setAddressSaved(true);
        setAddressOpen(false);
    };

    const validateUpi = (val) => {
        setUpiId(val);
        const upiRegex = /^[\w.\-_]{3,}@[a-zA-Z]{3,}$/;
        setUpiError(val && !upiRegex.test(val) ? "Enter a valid UPI ID (e.g. name@upi)" : "");
    };

    const placeOrder = async () => {
        if (!addressSaved) { alert("Please save your delivery address first."); return; }
        if (!upiId || upiError) { alert("Please enter a valid UPI ID."); return; }

        setPlacing(true);
        try {
            for (const item of items) {
                const res = await fetch(
                    `${backend_api}/user/order/${item.product_id}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({
                            quantity: item.quantity || 1,
                            provided_address: `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`,
                            provided_pincode: address.pincode,
                        }),
                    }
                );

                if (res.status === 401) {
                    setShowLoginPopup(true);
                    return;
                }
            }
            setPlaced(true);
        } finally {
            setPlacing(false);
        }
    };

    if (placed) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl border border-gray-200 p-10 max-w-sm w-full text-center shadow-sm">
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle2 size={56} className="text-green-500" strokeWidth={1.5} />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
                    <p className="text-gray-600 text-sm mb-6">
                        Your order has been confirmed and will arrive{" "}
                        <span className="font-semibold text-gray-900">
                            {deliveryType === "express"
                                ? `by ${formatTime(express20)} today`
                                : `by 11:59 PM · ${formatDate(sameDay)}`}
                        </span>
                        .
                    </p>

                    <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2 border border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Package size={16} className="text-green-600" />
                            <span>{items.length} {items.length === 1 ? "item" : "items"} ordered</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin size={16} className="text-green-600" />
                            <span className="truncate">{address.street}, {address.city}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                            <CreditCard size={16} className="text-green-600" />
                            <span>₹{total.toLocaleString()} via UPI</span>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate("/")}
                        className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold py-3 rounded-xl transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {showLoginPopup && (
                <LoginPopup
                    onClose={() => setShowLoginPopup(false)}
                    onLogin={() => navigate("/login")}
                />
            )}

            <div className="max-w-5xl mx-auto px-3 py-4 space-y-3">
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <button
                        className="w-full flex items-center justify-between p-4"
                        onClick={() => setAddressOpen((o) => !o)}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${addressSaved ? "bg-green-500 text-white" : "bg-amber-400 text-gray-900"}`}>
                                {addressSaved ? <CheckCircle2 size={15} /> : "1"}
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-gray-900 text-sm">Delivery Address</p>
                                {addressSaved && !addressOpen && (
                                    <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">
                                        {address.name} · {address.street}, {address.city}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            {addressSaved && (
                                <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                                    <Edit2 size={12} /> Edit
                                </span>
                            )}
                            {addressOpen
                                ? <ChevronUp size={18} className="text-gray-400" />
                                : <ChevronDown size={18} className="text-gray-400" />}
                        </div>
                    </button>

                    {addressOpen && (
                        <div className="px-4 pb-4 border-t border-gray-100">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                                {[
                                    { name: "name", label: "Full Name", placeholder: "John Doe", span: 1 },
                                    { name: "phone", label: "Phone Number", placeholder: "10-digit number", span: 1 },
                                    { name: "street", label: "Street / Area", placeholder: "House no, Street", span: 2 },
                                    { name: "pincode", label: "Pincode", placeholder: "6-digit pincode", span: 1 },
                                    { name: "city", label: "City", placeholder: "Mumbai", span: 1 },
                                    { name: "state", label: "State", placeholder: "Maharashtra", span: 1 },
                                ].map((f) => (
                                    <div key={f.name} className={f.span === 2 ? "sm:col-span-2" : ""}>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">{f.label}</label>
                                        <input
                                            name={f.name}
                                            value={address[f.name]}
                                            onChange={handleAddressChange}
                                            placeholder={f.placeholder}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                                        />
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={saveAddress}
                                className="mt-4 w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold py-2.5 rounded-lg transition-colors text-sm"
                            >
                                Save & Continue
                            </button>
                        </div>
                    )}
                </div>

                {/* Step 2 - Delivery Option */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-7 h-7 rounded-full bg-amber-400 text-gray-900 flex items-center justify-center text-sm font-bold shrink-0">2</div>
                        <p className="font-bold text-gray-900 text-sm">Delivery Option</p>
                    </div>

                    <div className="space-y-2">
                        <label className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${deliveryType === "express" ? "border-amber-400 bg-amber-50" : "border-gray-200 hover:border-gray-300"}`}>
                            <input
                                type="radio"
                                name="delivery"
                                value="express"
                                checked={deliveryType === "express"}
                                onChange={() => setDeliveryType("express")}
                                className="mt-0.5 accent-amber-500"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Zap size={15} className="text-amber-500" />
                                    <span className="font-semibold text-gray-900 text-sm">Express Delivery</span>
                                    <span className="text-xs bg-amber-400 text-gray-900 font-bold px-2 py-0.5 rounded-full">20 MIN</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Arrives by <span className="font-semibold text-gray-900">{formatTime(express20)}</span> today
                                </p>
                            </div>
                            <span className="text-sm font-bold text-gray-900 shrink-0">₹29</span>
                        </label>

                        <label className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${deliveryType === "sameday" ? "border-amber-400 bg-amber-50" : "border-gray-200 hover:border-gray-300"}`}>
                            <input
                                type="radio"
                                name="delivery"
                                value="sameday"
                                checked={deliveryType === "sameday"}
                                onChange={() => setDeliveryType("sameday")}
                                className="mt-0.5 accent-amber-500"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <Truck size={15} className="text-blue-500" />
                                    <span className="font-semibold text-gray-900 text-sm">Same Day Delivery</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Arrives by <span className="font-semibold text-gray-900">11:59 PM · {formatDate(sameDay)}</span>
                                </p>
                            </div>
                            <span className="text-sm font-bold shrink-0">
                                {subtotal >= 499
                                    ? <span className="text-green-600">FREE</span>
                                    : <span className="text-gray-900">₹40</span>}
                            </span>
                        </label>
                    </div>
                </div>

                {/* Step 3 - Payment */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-7 h-7 rounded-full bg-amber-400 text-gray-900 flex items-center justify-center text-sm font-bold shrink-0">3</div>
                        <p className="font-bold text-gray-900 text-sm">Payment Method</p>
                    </div>

                    <div className="p-3 rounded-xl border-2 border-amber-400 bg-amber-50">
                        <div className="flex items-center gap-2 mb-3">
                            <input type="radio" checked readOnly className="accent-amber-500" />
                            <CreditCard size={15} className="text-amber-600" />
                            <span className="font-semibold text-gray-900 text-sm">UPI Payment</span>
                        </div>

                        <input
                            value={upiId}
                            onChange={(e) => validateUpi(e.target.value)}
                            placeholder="Enter UPI ID  (e.g. name@upi)"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white"
                        />
                        {upiError && (
                            <p className="text-xs text-red-500 mt-1">{upiError}</p>
                        )}
                        {upiId && !upiError && (
                            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                <CheckCircle2 size={12} /> UPI ID looks valid
                            </p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">Supported: GPay · PhonePe · Paytm · BHIM & all UPI apps</p>
                    </div>
                </div>

                {/* Step 4 - Order Summary */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-7 h-7 rounded-full bg-amber-400 text-gray-900 flex items-center justify-center text-sm font-bold shrink-0">4</div>
                        <p className="font-bold text-gray-900 text-sm">Order Summary ({items.length} {items.length === 1 ? "item" : "items"})</p>
                    </div>

                    <div className="space-y-3 mb-4">
                        {items.map((item, idx) => {
                            const img = item.images?.[0] || item.product_images?.[0];
                            const title = item.title || item.product_title;
                            const price = item.price ?? item.product_price ?? 0;
                            const qty = item.quantity || 1;

                            return (
                                <div key={item.product_id || idx} className="flex gap-3 items-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                                        {img && <img src={img} alt={title} className="w-full h-full object-contain p-1" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-900 line-clamp-2 font-medium leading-tight">{title}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Qty: {qty}</p>
                                    </div>
                                    <p className="text-sm font-bold text-gray-900 shrink-0">
                                        ₹{(price * qty).toLocaleString()}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="border-t border-gray-100 pt-3 space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal ({items.reduce((s, i) => s + (i.quantity || 1), 0)} items)</span>
                            <span>₹{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Delivery ({deliveryType === "express" ? "Express 20 min" : "Same Day"})</span>
                            <span className={deliveryFee === 0 ? "text-green-600 font-semibold" : ""}>
                                {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                            </span>
                        </div>
                        <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-100 pt-2">
                            <span>Total</span>
                            <span className="text-red-700">₹{total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Place Order */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                        <ShieldCheck size={14} className="text-green-600 shrink-0" />
                        <span>Safe &amp; secure payment. All orders are protected.</span>
                    </div>

                    <button
                        onClick={placeOrder}
                        disabled={placing || !addressSaved || !upiId || !!upiError}
                        className="w-full bg-amber-400 hover:bg-amber-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-900 font-bold py-4 rounded-xl transition-colors text-base shadow-sm"
                    >
                        {placing ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-gray-700 border-t-transparent rounded-full animate-spin" />
                                Placing Order...
                            </span>
                        ) : (
                            `Place Order · ₹${total.toLocaleString()}`
                        )}
                    </button>

                    {(!addressSaved || !upiId) && (
                        <p className="text-xs text-gray-400 text-center mt-2">
                            {!addressSaved ? "Save your address to continue" : "Enter your UPI ID to continue"}
                        </p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default OrderPage;