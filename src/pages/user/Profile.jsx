import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";

const Profile = () => {
    const navigate = useNavigate();

    const fetchedOnce = useRef(false);

    const [profile, setProfile] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
    });

    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (fetchedOnce.current) return;
        fetchedOnce.current = true;
        const fetchProfile = async () => {
            try {
                const res = await fetch(
                    "https://no-wheels-1.onrender.com/user/profile",
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                const data = await res.json();

                if (res.ok && data.data) {
                    setProfile(data.data);
                }
            } catch (err) {
                setError("Could not load profile");
                console.log(err);
            }
        };

        fetchProfile();
    }, []);

    const updateField = (key, value) => {
        setProfile((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError("");
            setMessage("");

            const res = await fetch(
                "https://no-wheels-1.onrender.com/user/profile",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(profile),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Update failed");
            }

            setMessage("Profile updated successfully ✨");
            setEditMode(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">

            <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
                <button
                    onClick={() => navigate("/")}
                    className="p-2 rounded-full hover:bg-gray-100"
                >
                    <ArrowLeft size={20} />
                </button>

                <h2 className="font-semibold text-lg">My Profile</h2>

                <button
                    onClick={() => setEditMode((prev) => !prev)}
                    className="p-2 rounded-full hover:bg-gray-100"
                >
                    <Pencil size={18} />
                </button>
            </div>

            {/* ===== CONTENT ===== */}
            <div className="max-w-lg mx-auto mt-6 px-4">
                <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">

                    <input
                        type="text"
                        placeholder="First Name"
                        disabled={!editMode}
                        value={profile.first_name}
                        onChange={(e) =>
                            updateField("first_name", e.target.value)
                        }
                        className={`w-full p-3 border rounded-lg ${!editMode ? "bg-gray-50 text-gray-500" : ""
                            }`}
                    />

                    <input
                        type="text"
                        placeholder="Last Name"
                        disabled={!editMode}
                        value={profile.last_name}
                        onChange={(e) =>
                            updateField("last_name", e.target.value)
                        }
                        className={`w-full p-3 border rounded-lg ${!editMode ? "bg-gray-50 text-gray-500" : ""
                            }`}
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        disabled={!editMode}
                        value={profile.email}
                        onChange={(e) =>
                            updateField("email", e.target.value)
                        }
                        className={`w-full p-3 border rounded-lg ${!editMode ? "bg-gray-50 text-gray-500" : ""
                            }`}
                    />

                    <input
                        type="text"
                        placeholder="Phone"
                        disabled={!editMode}
                        value={profile.phone}
                        onChange={(e) =>
                            updateField("phone", e.target.value)
                        }
                        className={`w-full p-3 border rounded-lg ${!editMode ? "bg-gray-50 text-gray-500" : ""
                            }`}
                    />

                    <textarea
                        placeholder="Address"
                        disabled={!editMode}
                        value={profile.address}
                        onChange={(e) =>
                            updateField("address", e.target.value)
                        }
                        className={`w-full p-3 border rounded-lg ${!editMode ? "bg-gray-50 text-gray-500" : ""
                            }`}
                    />

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    {message && (
                        <p className="text-green-600 text-sm">{message}</p>
                    )}

                    {editMode && (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;