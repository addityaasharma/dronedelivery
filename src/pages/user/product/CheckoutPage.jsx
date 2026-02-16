import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CheckoutPage = () => {
    const { product_id } = useParams();
    const navigate = useNavigate();

    const [address, setAddress] = useState("");
    const [pincode, setPincode] = useState("");
    const [quantity, setQuantity] = useState(1);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ==========================
    // PLACE ORDER
    // ==========================
    const placeOrder = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await fetch(
                `https://no-wheels-1.onrender.com/user/order/${product_id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        provided_address: address,
                        provided_pincode: pincode,
                        quantity,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Order failed");
            }

            alert("Order placed successfully 🎉");

            navigate("/track-order");

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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

                <h2 className="ml-3 font-semibold text-lg">
                    Checkout
                </h2>
            </div>

            <div className="max-w-lg mx-auto p-4">

                <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">

                    {/* ADDRESS */}
                    <div>
                        <label className="text-sm font-medium">
                            Delivery Address
                        </label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter full address"
                            className="w-full mt-1 p-3 border rounded-lg"
                        />
                    </div>

                    {/* PINCODE */}
                    <div>
                        <label className="text-sm font-medium">
                            Pincode
                        </label>
                        <input
                            type="text"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            className="w-full mt-1 p-3 border rounded-lg"
                        />
                    </div>

                    {/* QUANTITY */}
                    <div>
                        <label className="text-sm font-medium">
                            Quantity
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) =>
                                setQuantity(Number(e.target.value))
                            }
                            className="w-full mt-1 p-3 border rounded-lg"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <button
                        onClick={placeOrder}
                        disabled={loading}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-semibold"
                    >
                        {loading ? "Placing order..." : "Place Order"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
