import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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
                    "https://no-wheels-1.onrender.com/user/cart",
                    { credentials: "include" }
                );

                const data = await res.json();

                if (res.ok) {
                    setCart(data.data || []);
                }
            } catch {
                console.log("Failed to load cart");
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    // =========================
    // UPDATE CART
    // =========================
    const updateCart = async (product_id, action) => {
        try {
            await fetch(
                `https://no-wheels-1.onrender.com/user/cart/${product_id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ action }),
                }
            );

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

        } catch {
            console.log("Update failed");
        }
    };

    // =========================
    // BUY SELECTED
    // =========================
    const buySelected = async () => {
        for (let item of cart) {
            if (!selected.includes(item.product_id)) continue;

            await fetch(
                `https://no-wheels-1.onrender.com/user/order/${item.product_id}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        quantity: item.quantity,
                        provided_address: "Default Address",
                        provided_pincode: "000000",
                    }),
                }
            );
        }

        alert("Order placed!");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading cart...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">

            {/* HEADER */}
            <div className="sticky top-0 z-40 bg-white shadow-sm px-4 py-3 flex items-center">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full hover:bg-gray-100"
                >
                    <ArrowLeft size={20} />
                </button>

                <h2 className="ml-3 font-semibold text-lg">My Cart</h2>
            </div>

            <div className="p-4 space-y-4">

                {cart.length === 0 && (
                    <p className="text-center text-gray-500">
                        Your cart is empty 🛒
                    </p>
                )}

                {cart.map((item) => (
                    <div
                        key={item.cart_id}
                        className="bg-white rounded-xl p-3 shadow-sm flex gap-3"
                    >
                        <input
                            type="checkbox"
                            checked={selected.includes(item.product_id)}
                            onChange={() =>
                                setSelected((prev) =>
                                    prev.includes(item.product_id)
                                        ? prev.filter(
                                            (id) => id !== item.product_id
                                        )
                                        : [...prev, item.product_id]
                                )
                            }
                        />

                        <img
                            src={item.images?.[0]}
                            className="w-20 h-20 rounded-lg object-cover cursor-pointer"
                            onClick={() =>
                                navigate(`/product/${item.product_id}`)
                            }
                        />

                        <div className="flex-1">
                            <h3 className="font-medium text-sm">
                                {item.title}
                            </h3>

                            <p className="text-amber-600 font-semibold">
                                ₹{item.price}
                            </p>

                            {/* QUANTITY */}
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() =>
                                        updateCart(item.product_id, "decrease")
                                    }
                                    className="px-2 bg-gray-200 rounded"
                                >
                                    -
                                </button>

                                <span>{item.quantity}</span>

                                <button
                                    onClick={() =>
                                        updateCart(item.product_id, "increase")
                                    }
                                    className="px-2 bg-gray-200 rounded"
                                >
                                    +
                                </button>

                                <button
                                    onClick={() =>
                                        updateCart(item.product_id, "remove")
                                    }
                                    className="ml-2 text-red-500"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {selected.length > 0 && (
                    <button
                        onClick={buySelected}
                        className="w-full bg-amber-500 text-white py-3 rounded-xl font-semibold"
                    >
                        Buy Selected ({selected.length})
                    </button>
                )}
            </div>
        </div>
    );
};

export default CartPage;
