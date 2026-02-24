import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [isSignup, setIsSignup] = useState(false);

    const [formData, setFormData] = useState({
        identifier: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        try {
            const isEmail = formData.identifier.includes("@");

            const loginPayload = isEmail
                ? {
                    email: formData.identifier,
                    password: formData.password,
                }
                : {
                    phoneNumber: formData.identifier,
                    password: formData.password,
                };

            setLoading(true);
            setError("");

            const url = isSignup
                ? "https://no-wheels-1.onrender.com/user/signup"
                : "https://no-wheels-1.onrender.com/user/login";

            const payload = isSignup
                ? {
                    email: formData.email,
                    phoneNumber: formData.identifier,
                    password: formData.password,
                }
                : loginPayload;

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                mode: "cors",
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            setTimeout(() => {
                navigate("/");
            }, 500);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-full max-w-md p-8">

                <h2 className="text-2xl font-bold text-center mb-2">
                    {isSignup ? "Create Account" : "Welcome Back"}
                </h2>

                <p className="text-center text-gray-500 mb-6">
                    {step === 1 && "Enter your phone number"}
                    {step === 2 && isSignup && "Enter your email"}
                    {((step === 2 && !isSignup) || step === 3) &&
                        "Enter your password"}
                </p>

                {step === 1 && (
                    <input
                        type="text"
                        placeholder={isSignup ? "Phone Number" : "Email or Phone"}
                        value={formData.identifier}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                identifier: e.target.value,
                            })
                        }
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-400"
                    />
                )}

                {step === 2 && isSignup && (
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                email: e.target.value,
                            })
                        }
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-400"
                    />
                )}

                {(step === 2 && !isSignup || step === 3) && (
                    <input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                password: e.target.value,
                            })
                        }
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-400"
                    />
                )}

                {error && (
                    <p className="text-red-500 text-sm mt-3">{error}</p>
                )}

                <button
                    onClick={() => {
                        if (
                            (!isSignup && step === 2) ||
                            (isSignup && step === 3)
                        ) {
                            handleSubmit();
                        } else {
                            setStep(step + 1);
                        }
                    }}
                    disabled={loading}
                    className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg"
                >
                    {loading
                        ? "Please wait..."
                        : (!isSignup && step === 2) || (isSignup && step === 3)
                            ? isSignup
                                ? "Sign Up"
                                : "Login"
                            : "Next"}
                </button>

                <p className="text-center mt-6 text-sm">
                    {isSignup ? "Already have an account?" : "Don't have an account?"}
                    <button
                        onClick={() => {
                            setIsSignup(!isSignup);
                            setStep(1);
                            setFormData({
                                phoneNumber: "",
                                email: "",
                                password: "",
                            });
                        }}
                        className="ml-1 text-amber-600 font-semibold"
                    >
                        {isSignup ? "Login" : "Sign Up"}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
