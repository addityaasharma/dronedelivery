import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { backend_api } from "../../../api";

const CartPage = () => {
    const navigate = useNavigate();

    const [cart, setCart] = useState([]);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(true);

    // =========================
    // FETCH CART
    // =========================
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await fetch(
                    `${backend_api}/user/cart`,
                    { credentials: "include" }
                );

                if (res.status === 401) {
                    navigate("/login", { replace: true });
                    return;
                }

                const data = await res.json();

                if (res.ok) {
                    setCart(data.data || []);
                    // Auto-select all items
                    setSelected((data.data || []).map(item => item.product_id));
                }
            } catch {
                console.log("Failed to load cart");
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchCart();
        }, 300); // small delay helps Safari
        return () => clearTimeout(timer);
    }, []);

    // =========================
    // UPDATE CART
    // =========================
    const updateCart = async (product_id, action) => {
        try {
            const res = await fetch(
                `${backend_api}/user/cart/${product_id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ action }),
                }
            );

            if (res.status === 401) {
                navigate("/login", { replace: true });
                return;
            }

            setCart((prev) =>
                prev
                    .map((item) =>
                        item.product_id === product_id
                            ? {
                                ...item,
                                quantity:
                                    action === "increase"
                                        ? item.quantity + 1
                                        : item.quantity - 1,
                            }
                            : item
                    )
                    .filter((i) => i.quantity > 0)
            );

            // Remove from selected if quantity becomes 0
            if (action === "decrease") {
                const item = cart.find(i => i.product_id === product_id);
                if (item && item.quantity === 1) {
                    setSelected(prev => prev.filter(id => id !== product_id));
                }
            }

        } catch {
            console.log("Update failed");
        }
    };

    // =========================
    // REMOVE FROM CART
    // =========================
    const removeFromCart = async (product_id) => {
        try {
            const res = await fetch(
                `${backend_api}/user/cart/${product_id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            if (res.status === 401) {
                navigate("/login", { replace: true });
                return;
            }

            setCart(prev => prev.filter(item => item.product_id !== product_id));
            setSelected(prev => prev.filter(id => id !== product_id));

        } catch {
            console.log("Remove failed");
        }
    };

    // =========================
    // PROCEED TO ORDER PAGE
    // =========================
    const buySelected = () => {
        const itemsToBuy = cart.filter(item => selected.includes(item.product_id));
        navigate("/order", { state: { cartItems: itemsToBuy } });
    };

    // =========================
    // CALCULATIONS
    // =========================
    const selectedItems = cart.filter(item => selected.includes(item.product_id));
    const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal >= 499 ? 0 : 40;
    const total = subtotal + deliveryFee;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your cart...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-3 py-4">

                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                        <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag size={64} className="text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">Add items to get started</p>
                        <button
                            onClick={() => navigate("/")}
                            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                        {/* Left Column - Cart Items */}
                        <div className="lg:col-span-2 space-y-3">
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <h1 className="text-2xl font-bold text-gray-900 mb-1">Shopping Cart</h1>
                                <p className="text-sm text-gray-600">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
                            </div>

                            {cart.map((item) => {
                                const isSelected = selected.includes(item.product_id);
                                const itemTotal = item.price * item.quantity;

                                return (
                                    <div
                                        key={item.cart_id}
                                        className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex gap-4">
                                            {/* Checkbox */}
                                            <div className="pt-1">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() =>
                                                        setSelected((prev) =>
                                                            prev.includes(item.product_id)
                                                                ? prev.filter((id) => id !== item.product_id)
                                                                : [...prev, item.product_id]
                                                        )
                                                    }
                                                    className="w-5 h-5 cursor-pointer accent-amber-500"
                                                />
                                            </div>

                                            {/* Image */}
                                            <div
                                                className="w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden cursor-pointer border border-gray-200"
                                                onClick={() => navigate(`/product/${item.unique_code}/${item.product_slug}`)}
                                            >
                                                <img
                                                    src={item.images?.[0]}
                                                    alt={item.title}
                                                    className="w-full h-full object-contain p-2"
                                                />
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <h3
                                                    className="font-semibold text-gray-900 line-clamp-2 mb-2 cursor-pointer hover:text-amber-600"
                                                    onClick={() => navigate(`/product/${item.unique_code}/${item.product_slug}`)}
                                                >
                                                    {item.title}
                                                </h3>

                                                <p className="text-2xl font-bold text-gray-900 mb-3">
                                                    ₹{item.price.toLocaleString()}
                                                </p>

                                                <p className="text-sm text-green-700 font-semibold mb-3">
                                                    In Stock
                                                </p>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                                        <button
                                                            onClick={() => updateCart(item.product_id, "decrease")}
                                                            className="p-2 hover:bg-gray-100 rounded-l-lg transition-colors"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus size={16} className={item.quantity <= 1 ? 'text-gray-300' : 'text-gray-700'} />
                                                        </button>

                                                        <span className="px-4 py-2 font-semibold text-gray-900 min-w-12 text-center">
                                                            {item.quantity}
                                                        </span>

                                                        <button
                                                            onClick={() => updateCart(item.product_id, "increase")}
                                                            className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors"
                                                        >
                                                            <Plus size={16} className="text-gray-700" />
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => removeFromCart(item.product_id)}
                                                        className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium"
                                                    >
                                                        <Trash2 size={16} />
                                                        Delete
                                                    </button>
                                                </div>

                                                {item.quantity > 1 && (
                                                    <p className="text-sm text-gray-600 mt-2">
                                                        Item total: ₹{itemTotal.toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg p-5 border border-gray-200 sticky top-4">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">
                                    Order Summary
                                </h2>

                                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal ({selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'}):</span>
                                        <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString()}</span>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Delivery:</span>
                                        <span className={`font-semibold ${deliveryFee === 0 ? 'text-green-700' : 'text-gray-900'}`}>
                                            {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                                        </span>
                                    </div>

                                    {subtotal > 0 && subtotal < 499 && (
                                        <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded">
                                            Add ₹{(499 - subtotal).toLocaleString()} more for FREE delivery
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-between mb-5 pb-4 border-b border-gray-200">
                                    <span className="text-lg font-bold text-gray-900">Order Total:</span>
                                    <span className="text-xl font-bold text-red-700">₹{total.toLocaleString()}</span>
                                </div>

                                <button
                                    onClick={buySelected}
                                    disabled={selected.length === 0}
                                    className="w-full bg-amber-400 hover:bg-amber-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-900 font-bold py-3 rounded-lg transition-colors shadow-sm disabled:shadow-none"
                                >
                                    {selected.length === 0
                                        ? 'Select items to proceed'
                                        : `Proceed to Buy (${selected.length} ${selected.length === 1 ? 'item' : 'items'})`
                                    }
                                </button>

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        By placing your order, you agree to our privacy notice and conditions of use.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;