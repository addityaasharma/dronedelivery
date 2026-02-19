import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Package,
    ChevronDown,
    ChevronUp,
    MapPin,
    XCircle,
    ShoppingBag,
    Truck,
    CheckCircle2,
    Clock,
    AlertCircle,
    ChevronRight,
} from "lucide-react";

const STATUS_CONFIG = {
    PLACED: { label: "Order Placed", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", icon: Package },
    CONFIRMED: { label: "Confirmed", color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200", icon: CheckCircle2 },
    SHIPPED: { label: "Shipped", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", icon: Truck },
    OUT_FOR_DELIVERY: { label: "Out for Delivery", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", icon: Truck },
    DELIVERED: { label: "Delivered", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", icon: CheckCircle2 },
    CANCELLED: { label: "Cancelled", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", icon: XCircle },
};

const getStatus = (status) =>
    STATUS_CONFIG[status?.toUpperCase()] || { label: status, color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200", icon: Clock };

const ShimmerCard = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
        <style>{`
            @keyframes shimmer {
                0%   { background-position: -800px 0; }
                100% { background-position: 800px 0; }
            }
            .shimmer {
                background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
                background-size: 800px 100%;
                animation: shimmer 1.5s infinite;
                border-radius: 6px;
            }
        `}</style>
        <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
                <div className="shimmer h-4 w-36" />
                <div className="shimmer h-3 w-48" />
            </div>
            <div className="shimmer h-6 w-20 ml-4" />
        </div>
        <div className="flex gap-3 pt-1">
            <div className="shimmer w-14 h-14 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
                <div className="shimmer h-3 w-full" />
                <div className="shimmer h-3 w-3/4" />
            </div>
        </div>
    </div>
);

const TrackOrder = () => {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [openOrderId, setOpenOrderId] = useState(null);
    const [orderDetails, setOrderDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(null);
    const [cancelling, setCancelling] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(
                    "https://no-wheels-1.onrender.com/user/order",
                    { credentials: "include" }
                );

                if (res.status === 401) {
                    navigate("/login", { replace: true });
                    return;
                }

                const data = await res.json();
                if (res.ok) setOrders(data.orders || []);
            } catch {
                console.log("Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [navigate]);

    const openOrder = async (order_id) => {
        if (openOrderId === order_id) {
            setOpenOrderId(null);
            return;
        }
        setOpenOrderId(order_id);
        if (orderDetails[order_id]) return;

        setDetailLoading(order_id);
        try {
            const res = await fetch(
                `https://no-wheels-1.onrender.com/user/order/${order_id}`,
                { credentials: "include" }
            );

            if (res.status === 401) {
                navigate("/login", { replace: true });
                return;
            }

            const data = await res.json();
            if (res.ok) {
                setOrderDetails((prev) => ({ ...prev, [order_id]: data.order }));
            }
        } catch {
            console.log("Failed to fetch order details");
        } finally {
            setDetailLoading(null);
        }
    };

    const cancelOrder = async (order_id) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;

        setCancelling(order_id);
        try {
            const res = await fetch(
                `https://no-wheels-1.onrender.com/user/order/${order_id}`,
                { method: "PUT", credentials: "include" }
            );

            if (res.status === 401) {
                navigate("/login", { replace: true });
                return;
            }

            if (res.ok) {
                setOrders((prev) =>
                    prev.map((o) =>
                        o.order_id === order_id ? { ...o, status: "CANCELLED" } : o
                    )
                );
            }
        } catch {
            console.log("Cancel failed");
        } finally {
            setCancelling(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-3xl mx-auto px-3 py-4 space-y-3">
                    <div className="shimmer h-7 w-32 mb-4" style={{ background: "linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)", backgroundSize: "800px 100%", animation: "shimmer 1.5s infinite", borderRadius: 6 }} />
                    {[1, 2, 3].map(i => <ShimmerCard key={i} />)}
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-5">
                        <ShoppingBag size={56} className="text-gray-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
                    <p className="text-gray-500 mb-6 text-sm">Looks like you haven't placed any orders.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold rounded-lg transition-colors"
                    >
                        Start Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-3 py-4 space-y-3">

                <div className="mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">Your Orders</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{orders.length} {orders.length === 1 ? "order" : "orders"} placed</p>
                </div>

                {orders.map((order) => {
                    const isOpen = openOrderId === order.order_id;
                    const details = orderDetails[order.order_id];
                    const status = getStatus(order.status);
                    const StatusIcon = status.icon;
                    const isCancelled = order.status?.toUpperCase() === "CANCELLED";
                    const isLoadingDetail = detailLoading === order.order_id;
                    const isCancelling = cancelling === order.order_id;

                    return (
                        <div
                            key={order.order_id}
                            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                        >
                            <button
                                onClick={() => openOrder(order.order_id)}
                                className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <p className="font-bold text-gray-900 text-sm">
                                                Order #{order.order_number}
                                            </p>
                                            {order.created_at && (
                                                <span className="text-xs text-gray-400">
                                                    · {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-sm text-gray-600 mb-2">
                                            {order.total_items} {order.total_items === 1 ? "item" : "items"} &nbsp;·&nbsp;
                                            <span className="font-semibold text-gray-900">₹{order.total_price?.toLocaleString()}</span>
                                        </p>

                                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${status.color} ${status.bg} ${status.border}`}>
                                            <StatusIcon size={12} />
                                            {status.label}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0 text-gray-400 mt-1">
                                        <span className="text-xs">Details</span>
                                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </div>
                                </div>
                            </button>

                            {isOpen && (
                                <div className="border-t border-gray-100">
                                    {isLoadingDetail && (
                                        <div className="p-4 space-y-3">
                                            {[1, 2].map(i => (
                                                <div key={i} className="flex gap-3 items-center">
                                                    <div className="shimmer w-14 h-14 rounded-lg shrink-0" style={{ background: "linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)", backgroundSize: "800px 100%", animation: "shimmer 1.5s infinite", borderRadius: 8 }} />
                                                    <div className="flex-1 space-y-2">
                                                        <div className="shimmer h-3 w-3/4" style={{ background: "linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)", backgroundSize: "800px 100%", animation: "shimmer 1.5s infinite", borderRadius: 4 }} />
                                                        <div className="shimmer h-3 w-1/2" style={{ background: "linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)", backgroundSize: "800px 100%", animation: "shimmer 1.5s infinite", borderRadius: 4 }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {details && !isLoadingDetail && (
                                        <div className="p-4 space-y-4">

                                            {/* Products */}
                                            <div>
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Items Ordered</p>
                                                <div className="space-y-3">
                                                    {details.products?.map((p) => (
                                                        <div
                                                            key={p.product_id}
                                                            className="flex items-center gap-3 cursor-pointer group"
                                                            onClick={() => navigate(`/product/${p.product_uniqueCode}/${p.product_slug}`)}
                                                        >
                                                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                                                                <img
                                                                    src={p.product_images?.[0]}
                                                                    alt={p.product_title}
                                                                    className="w-full h-full object-contain p-1"
                                                                />
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors">
                                                                    {p.product_title}
                                                                </p>
                                                                <p className="text-xs text-gray-500 mt-0.5">Qty: {p.quantity}</p>
                                                            </div>

                                                            <div className="flex items-center gap-1 shrink-0">
                                                                <p className="text-sm font-bold text-gray-900">₹{p.total_price?.toLocaleString()}</p>
                                                                <ChevronRight size={14} className="text-gray-400 group-hover:text-amber-500 transition-colors" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Delivery address */}
                                            {details.address && (
                                                <div className="border-t border-gray-100 pt-4">
                                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Delivery Address</p>
                                                    <div className="flex items-start gap-2">
                                                        <MapPin size={15} className="text-gray-400 mt-0.5 shrink-0" />
                                                        <div>
                                                            <p className="text-sm text-gray-900 font-medium">{details.address}</p>
                                                            {details.pincode && (
                                                                <p className="text-xs text-gray-500 mt-0.5">Pincode: {details.pincode}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Price summary */}
                                            <div className="border-t border-gray-100 pt-4">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Order Total</span>
                                                    <span className="font-bold text-gray-900">₹{order.total_price?.toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <div className="border-t border-gray-100 pt-3 flex items-center gap-4">
                                                {!isCancelled && (
                                                    <button
                                                        onClick={() => cancelOrder(order.order_id)}
                                                        disabled={isCancelling}
                                                        className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                                                    >
                                                        {isCancelling ? (
                                                            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                            <XCircle size={15} />
                                                        )}
                                                        {isCancelling ? "Cancelling..." : "Cancel Order"}
                                                    </button>
                                                )}

                                                {isCancelled && (
                                                    <div className="flex items-center gap-1.5 text-sm text-red-500">
                                                        <AlertCircle size={15} />
                                                        <span>This order was cancelled</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TrackOrder;