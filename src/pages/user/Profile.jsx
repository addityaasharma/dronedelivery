import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft, Pencil, Check, X,
    User, Mail, Phone, MapPin, Loader2
} from "lucide-react";

/* ─────────────────────────────────────────────
   AVATAR INITIALS
───────────────────────────────────────────── */
const Avatar = ({ first, last }) => {
    const initials =
        `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase() || "?";
    return (
        <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg"
            style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                color: "#fff",
                fontFamily: "'Georgia', serif",
                letterSpacing: "0.05em",
            }}
        >
            {initials}
        </div>
    );
};

/* ─────────────────────────────────────────────
   FIELD ROW
───────────────────────────────────────────── */
const FieldRow = ({ icon: Icon, label, type = "text", value, editMode, onChange, multiline }) => {
    const base = {
        fontFamily: "'Georgia', serif",
        fontSize: 14,
        color: "#3a2e22",
        background: "transparent",
        outline: "none",
        width: "100%",
        resize: "none",
        transition: "all 0.2s",
    };

    return (
        <div
            className="flex items-start gap-3 px-4 py-3 rounded-2xl transition-all duration-200"
            style={{
                background: editMode ? "#fffbf5" : "transparent",
                border: editMode ? "1.5px solid #f59e0b" : "1.5px solid transparent",
            }}
        >
            <div
                className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "#fef3c7" }}
            >
                <Icon size={15} style={{ color: "#d97706" }} />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold mb-0.5" style={{ color: "#b8a090", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    {label}
                </p>

                {multiline ? (
                    <textarea
                        rows={3}
                        disabled={!editMode}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        style={{ ...base, opacity: editMode ? 1 : 0.7 }}
                        placeholder={`Enter ${label.toLowerCase()}`}
                    />
                ) : (
                    <input
                        type={type}
                        disabled={!editMode}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        style={{ ...base, opacity: editMode ? 1 : 0.7 }}
                        placeholder={`Enter ${label.toLowerCase()}`}
                    />
                )}
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
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

    const [snapshot, setSnapshot] = useState(null); // for cancel revert
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    /* ── Fetch ── */
    useEffect(() => {
        if (fetchedOnce.current) return;
        fetchedOnce.current = true;

        const fetchProfile = async () => {
            try {
                const res = await fetch("https://no-wheels-1.onrender.com/user/profile", {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();
                if (res.ok && data.data) setProfile(data.data);
            } catch {
                setError("Could not load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const updateField = (key, value) => {
        setProfile((prev) => ({ ...prev, [key]: value }));
    };

    const startEdit = () => {
        setSnapshot({ ...profile });
        setEditMode(true);
        setMessage("");
        setError("");
    };

    const cancelEdit = () => {
        if (snapshot) setProfile(snapshot);
        setEditMode(false);
        setError("");
    };

    /* ── Save ── */
    const handleSave = async () => {
        try {
            setSaving(true);
            setError("");
            setMessage("");

            const res = await fetch("https://no-wheels-1.onrender.com/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(profile),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Update failed");

            setMessage("Profile updated successfully");
            setEditMode(false);
            setSnapshot(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    /* ── Full-name display ── */
    const fullName =
        [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
        "Your Name";

    /* ─── RENDER ─── */
    return (
        <div
            className="min-h-screen"
            style={{ background: "#f7f4ef", fontFamily: "'Georgia', serif" }}
        >
            {/* ── Back button (no full header) ── */}
            <div className="px-4 pt-4">
                <div className="max-w-lg mx-auto">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-1.5 text-sm transition-colors"
                        style={{ color: "#b8a090" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#d97706")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#b8a090")}
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>
                </div>
            </div>

            <div className="max-w-lg mx-auto px-4 pt-6 pb-16">

                {/* ── Hero card ── */}
                <div
                    className="rounded-3xl overflow-hidden mb-4 shadow-sm"
                    style={{ background: "#fff", border: "1px solid #ede8e1" }}
                >
                    {/* Warm banner */}
                    <div
                        className="h-28 relative"
                        style={{
                            background: "linear-gradient(135deg, #fde68a 0%, #fbbf24 50%, #f59e0b 100%)",
                        }}
                    >
                        {/* Edit / action buttons */}
                        <div className="absolute top-3 right-3 flex gap-2">
                            {editMode ? (
                                <>
                                    <button
                                        onClick={cancelEdit}
                                        className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-colors"
                                        style={{ background: "rgba(255,255,255,0.9)" }}
                                    >
                                        <X size={15} style={{ color: "#ef4444" }} />
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-colors"
                                        style={{ background: saving ? "#fde68a" : "rgba(255,255,255,0.9)" }}
                                    >
                                        {saving
                                            ? <Loader2 size={15} style={{ color: "#d97706" }} className="animate-spin" />
                                            : <Check size={15} style={{ color: "#16a34a" }} />
                                        }
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={startEdit}
                                    className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-colors"
                                    style={{ background: "rgba(255,255,255,0.9)" }}
                                >
                                    <Pencil size={14} style={{ color: "#d97706" }} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Avatar + name */}
                    <div className="px-6 pb-5">
                        <div className="-mt-10 mb-3">
                            {loading ? (
                                <div className="w-20 h-20 rounded-full bg-amber-100 animate-pulse shadow-lg" />
                            ) : (
                                <Avatar first={profile.first_name} last={profile.last_name} />
                            )}
                        </div>

                        {loading ? (
                            <div className="space-y-2">
                                <div className="h-5 bg-gray-100 rounded-lg w-40 animate-pulse" />
                                <div className="h-3 bg-gray-100 rounded w-24 animate-pulse" />
                            </div>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold" style={{ color: "#2e1f0e" }}>
                                    {fullName}
                                </h2>
                                {profile.email && (
                                    <p className="text-sm mt-0.5" style={{ color: "#b8a090" }}>
                                        {profile.email}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* ── Fields card ── */}
                <div
                    className="rounded-3xl overflow-hidden shadow-sm"
                    style={{ background: "#fff", border: "1px solid #ede8e1" }}
                >
                    {/* Section title */}
                    <div className="px-5 pt-5 pb-2 flex items-center justify-between">
                        <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#b8a090" }}>
                            Personal Details
                        </p>
                        {editMode && (
                            <span
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{ background: "#fef3c7", color: "#b45309" }}
                            >
                                Editing
                            </span>
                        )}
                    </div>

                    <div className="px-3 pb-4 space-y-1">
                        <FieldRow
                            icon={User}
                            label="First Name"
                            value={profile.first_name}
                            editMode={editMode}
                            onChange={(v) => updateField("first_name", v)}
                        />
                        <FieldRow
                            icon={User}
                            label="Last Name"
                            value={profile.last_name}
                            editMode={editMode}
                            onChange={(v) => updateField("last_name", v)}
                        />
                        <FieldRow
                            icon={Mail}
                            label="Email"
                            type="email"
                            value={profile.email}
                            editMode={editMode}
                            onChange={(v) => updateField("email", v)}
                        />
                        <FieldRow
                            icon={Phone}
                            label="Phone"
                            type="tel"
                            value={profile.phone}
                            editMode={editMode}
                            onChange={(v) => updateField("phone", v)}
                        />
                        <FieldRow
                            icon={MapPin}
                            label="Address"
                            value={profile.address}
                            editMode={editMode}
                            onChange={(v) => updateField("address", v)}
                            multiline
                        />
                    </div>

                    {/* Feedback messages */}
                    {(error || message) && (
                        <div className="px-5 pb-5">
                            {error && (
                                <div
                                    className="px-4 py-2.5 rounded-xl text-sm"
                                    style={{ background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" }}
                                >
                                    ⚠ {error}
                                </div>
                            )}
                            {message && (
                                <div
                                    className="px-4 py-2.5 rounded-xl text-sm"
                                    style={{ background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" }}
                                >
                                    ✓ {message}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Save button (shown only in edit mode) */}
                    {editMode && (
                        <div className="px-5 pb-5">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full py-3 rounded-2xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                                style={{
                                    background: saving
                                        ? "#fde68a"
                                        : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                                    color: "#fff",
                                    fontFamily: "inherit",
                                    letterSpacing: "0.02em",
                                    boxShadow: saving ? "none" : "0 4px 12px rgba(217,119,6,0.3)",
                                }}
                            >
                                {saving ? (
                                    <>
                                        <Loader2 size={15} className="animate-spin" />
                                        Saving…
                                    </>
                                ) : (
                                    <>
                                        <Check size={15} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin { animation: spin 0.8s linear infinite; }
        .animate-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        input:focus, textarea:focus { outline: none; }
        input::placeholder, textarea::placeholder { color: #d4c5b4; }
      `}</style>
        </div>
    );
};

export default Profile;