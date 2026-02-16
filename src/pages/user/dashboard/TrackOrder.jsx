import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiArrowLeft,
    FiChevronDown,
    FiChevronUp,
    FiClock,
    FiSend,
    FiMapPin,
    FiXCircle,
} from "react-icons/fi";

const TrackOrder = () => {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [openOrderId, setOpenOrderId] = useState(null);
    const [orderDetails, setOrderDetails] = useState({});
    const [loading, setLoading] = useState(true);

    // ==========================
    // FETCH ORDERS
    // ==========================
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(
                    "https://no-wheels-1.onrender.com/user/order",
                    { credentials: "include" }
                );

                const data = await res.json();

                if (res.ok) {
                    setOrders(data.orders || []);
                }
            } catch (err) {
                console.log("Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // ==========================
    // FETCH ORDER DETAILS
    // ==========================
    const openOrder = async (order_id) => {
        if (openOrderId === order_id) {
            setOpenOrderId(null);
            return;
        }

        setOpenOrderId(order_id);

        // already cached
        if (orderDetails[order_id]) return;

        try {
            const res = await fetch(
                `https://no-wheels-1.onrender.com/user/order/${order_id}`,
                { credentials: "include" }
            );

            const data = await res.json();

            if (res.ok) {
                setOrderDetails((prev) => ({
                    ...prev,
                    [order_id]: data.order,
                }));
            }
        } catch {
            console.log("Failed to fetch order details");
        }
    };

    // ==========================
    // CANCEL ORDER
    // ==========================
    const cancelOrder = async (order_id) => {
        if (!window.confirm("Cancel this order?")) return;

        try {
            const res = await fetch(
                `https://no-wheels-1.onrender.com/user/order/${order_id}`,
                {
                    method: "PUT",
                    credentials: "include",
                }
            );

            if (res.ok) {
                setOrders((prev) =>
                    prev.map((o) =>
                        o.order_id === order_id
                            ? { ...o, status: "CANCELLED" }
                            : o
                    )
                );
            }
        } catch {
            console.log("Cancel failed");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading orders...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-900">

            {/* HEADER */}
            <header className="flex items-center gap-3 px-5 py-4 bg-gray-100">
                <button onClick={() => navigate("/")} className="text-xl">
                    <FiArrowLeft />
                </button>
                <h1 className="font-semibold text-base">Your Orders</h1>
            </header>

            <main className="px-5 pt-6 space-y-6">

                {orders.length === 0 && (
                    <p className="text-center text-gray-500">
                        No orders yet 📦
                    </p>
                )}

                {orders.map((order) => {
                    const isOpen = openOrderId === order.order_id;
                    const details = orderDetails[order.order_id];

                    return (
                        <section key={order.order_id}>
                            {/* ORDER HEADER */}
                            <button
                                onClick={() => openOrder(order.order_id)}
                                className="w-full flex items-center justify-between py-4 border-b"
                            >
                                <div className="text-left">
                                    <p className="font-medium">
                                        Order {order.order_number}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {order.total_items} items · ₹{order.total_price}
                                    </p>
                                </div>

                                {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                            </button>

                            {/* ORDER DETAILS */}
                            {isOpen && details && (
                                <div className="pt-5 space-y-6">

                                    {/* STATUS */}
                                    <div className="flex items-center gap-2 text-green-600">
                                        <FiSend />
                                        <span className="font-medium">
                                            {order.status}
                                        </span>
                                    </div>

                                    {/* PRODUCTS */}
                                    <section>
                                        <h2 className="text-xs font-semibold text-gray-500 mb-3">
                                            ITEMS
                                        </h2>

                                        <div className="space-y-3">
                                            {details.products.map((p) => (
                                                <div
                                                    key={p.product_id}
                                                    className="flex items-center gap-3 cursor-pointer"
                                                    onClick={() =>
                                                        navigate(
                                                            `/product/${p.product_id}`
                                                        )
                                                    }
                                                >
                                                    <img
                                                        src={p.product_images?.[0]}
                                                        className="w-14 h-14 rounded-lg object-cover"
                                                    />

                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium">
                                                            {p.product_title}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Qty: {p.quantity}
                                                        </p>
                                                    </div>

                                                    <p className="font-medium">
                                                        ₹{p.total_price}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* ADDRESS */}
                                    <section className="flex gap-3">
                                        <FiMapPin className="mt-1" />
                                        <div>
                                            <p className="font-medium">
                                                {details.address}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {details.pincode}
                                            </p>
                                        </div>
                                    </section>

                                    {/* CANCEL BUTTON */}
                                    {order.status !== "CANCELLED" && (
                                        <button
                                            onClick={() =>
                                                cancelOrder(order.order_id)
                                            }
                                            className="flex items-center gap-2 text-red-500 text-sm"
                                        >
                                            <FiXCircle />
                                            Cancel Order
                                        </button>
                                    )}
                                </div>
                            )}
                        </section>
                    );
                })}
            </main>
        </div>
    );
};

export default TrackOrder;