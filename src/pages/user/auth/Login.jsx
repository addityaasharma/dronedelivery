import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isSignup, setIsSignup] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-full max-w-md bg-transparent p-8">

                <h2 className="text-2xl font-bold text-center mb-2">
                    {isSignup ? "Create Account" : "Welcome Back"}
                </h2>

                <p className="text-center text-gray-500 mb-6">
                    {step === 1 && "Enter your email or phone"}
                    {step === 2 && "Enter OTP sent to you"}
                    {step === 3 && "Enter your password"}
                </p>

                {step === 1 && (
                    <input
                        type="text"
                        placeholder="Email or Phone"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                )}

                {step === 2 && (
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                )}

                {step === 3 && (
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                )}

                <button
                    type="button"
                    onClick={() =>
                        step < 3 ? setStep(step + 1) : navigate("/dashboard")
                    }
                    className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg transition"
                >
                    {step < 3 ? "Next" : isSignup ? "Sign Up" : "Login"}
                </button>

                <div className="flex items-center my-6">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="px-3 text-gray-400 text-sm">OR</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                <button
                    type="button"
                    className="w-full border py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5" alt="Google" />
                    Continue with Google
                </button>

                <p className="text-center mt-6 text-sm">
                    {isSignup ? "Already have an account?" : "Don't have an account?"}

                    <button
                        type="button"
                        onClick={() => {
                            setIsSignup(!isSignup);
                            setStep(1);
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