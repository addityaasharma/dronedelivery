import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft, Pencil, Check, X,
    User, Mail, Phone, MapPin, Loader2, LogOut
} from "lucide-react";

const Avatar = ({ first, last }) => {
    const initials = `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase() || "?";
    return (
        <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "#111", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 600, letterSpacing: "0.04em",
            fontFamily: "'DM Sans', sans-serif",
        }}>
            {initials}
        </div>
    );
};

const FieldRow = ({ icon: Icon, label, type = "text", value, editMode, onChange, multiline }) => {
    return (
        <div style={{
            padding: "16px 0",
            borderBottom: "1px solid #f0f0f0",
            display: "flex", gap: 16, alignItems: "flex-start",
        }}>
            <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: editMode ? "#f5f5f5" : "#fafafa",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, marginTop: 2,
                transition: "background 0.2s",
            }}>
                <Icon size={14} color={editMode ? "#111" : "#aaa"} />
            </div>
            <div style={{ flex: 1 }}>
                <p style={{
                    fontSize: 10, fontWeight: 600, letterSpacing: "0.1em",
                    textTransform: "uppercase", color: "#aaa", marginBottom: 4,
                    fontFamily: "'DM Sans', sans-serif",
                }}>
                    {label}
                </p>
                {multiline ? (
                    <textarea
                        rows={2}
                        disabled={!editMode}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={`Add ${label.toLowerCase()}`}
                        style={{
                            width: "100%", resize: "none", border: "none", outline: "none",
                            background: "transparent", fontSize: 14, color: "#111",
                            fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5,
                            opacity: editMode ? 1 : 1, padding: 0,
                        }}
                    />
                ) : (
                    <input
                        type={type}
                        disabled={!editMode}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={`Add ${label.toLowerCase()}`}
                        style={{
                            width: "100%", border: "none", outline: "none",
                            background: "transparent", fontSize: 14, color: "#111",
                            fontFamily: "'DM Sans', sans-serif", padding: 0,
                        }}
                    />
                )}
            </div>
        </div>
    );
};

const Profile = () => {
    const navigate = useNavigate();
    const fetchedOnce = useRef(false);

    const [profile, setProfile] = useState({
        first_name: "", last_name: "", email: "", phone: "", address: "",
    });
    const [snapshot, setSnapshot] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (fetchedOnce.current) return;
        fetchedOnce.current = true;
        const fetchProfile = async () => {
            try {
                const res = await fetch("https://no-wheels-1.onrender.com/user/profile", {
                    method: "GET", credentials: "include",
                });
                if (res.status === 401 || res.status === 403) { navigate("/login", { replace: true }); return; }
                const data = await res.json();
                if (res.ok && data.data) setProfile(data.data);
            } catch { navigate("/login", { replace: true }); }
            finally { setLoading(false); }
        };
        fetchProfile();
    }, [navigate]);

    const updateField = (key, value) => setProfile((prev) => ({ ...prev, [key]: value }));

    const startEdit = () => {
        setSnapshot({ ...profile });
        setEditMode(true);
        setMessage(""); setError("");
    };

    const cancelEdit = () => {
        if (snapshot) setProfile(snapshot);
        setEditMode(false); setError("");
    };

    const handleSave = async () => {
        try {
            setSaving(true); setError(""); setMessage("");
            const res = await fetch("https://no-wheels-1.onrender.com/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(profile),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Update failed");
            setMessage("Changes saved"); setEditMode(false); setSnapshot(null);
        } catch (err) { setError(err.message); }
        finally { setSaving(false); }
    };

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await fetch("https://no-wheels-1.onrender.com/user/logout", { method: "POST", credentials: "include" });
        } catch { }
        finally { setLoggingOut(false); }
        navigate("/login", { replace: true });
    };

    const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "Your Name";

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                input::placeholder, textarea::placeholder { color: #ccc; }
                input:disabled, textarea:disabled { cursor: default; }
                input:focus, textarea:focus { outline: none; }
                .btn-ghost { background: none; border: none; cursor: pointer; }
                .btn-ghost:hover { opacity: 0.6; }
                .pulse { animation: pulse 1.5s ease-in-out infinite; }
                @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
                .spin { animation: spin 0.7s linear infinite; }
                @keyframes spin { to{transform:rotate(360deg)} }
            `}</style>

            <div style={{
                minHeight: "100vh", background: "#fff",
                fontFamily: "'DM Sans', sans-serif", color: "#111",
            }}>
                <div style={{ maxWidth: 480, margin: "0 auto", padding: "40px 24px 80px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            {loading ? (
                                <div className="pulse" style={{ width: 64, height: 64, borderRadius: "50%", background: "#f0f0f0" }} />
                            ) : (
                                <Avatar first={profile.first_name} last={profile.last_name} />
                            )}
                            <div>
                                {loading ? (
                                    <>
                                        <div className="pulse" style={{ width: 120, height: 16, background: "#f0f0f0", borderRadius: 4, marginBottom: 8 }} />
                                        <div className="pulse" style={{ width: 160, height: 12, background: "#f0f0f0", borderRadius: 4 }} />
                                    </>
                                ) : (
                                    <>
                                        <p style={{ fontWeight: 600, fontSize: 16 }}>{fullName}</p>
                                        {profile.email && <p style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{profile.email}</p>}
                                    </>
                                )}
                            </div>
                        </div>

                        {!loading && (
                            editMode ? (
                                <div style={{ display: "flex", gap: 8 }}>
                                    <button
                                        onClick={cancelEdit}
                                        style={{
                                            width: 34, height: 34, borderRadius: "50%",
                                            border: "1px solid #e8e8e8", background: "#fff",
                                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                                        }}
                                    >
                                        <X size={13} color="#888" />
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        style={{
                                            width: 34, height: 34, borderRadius: "50%",
                                            border: "none", background: "#111",
                                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                                        }}
                                    >
                                        {saving
                                            ? <Loader2 size={13} color="#fff" className="spin" />
                                            : <Check size={13} color="#fff" />
                                        }
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={startEdit}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 6,
                                        fontSize: 12, fontWeight: 500, color: "#111",
                                        background: "none", border: "1px solid #e8e8e8",
                                        borderRadius: 20, padding: "6px 14px", cursor: "pointer",
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}
                                >
                                    <Pencil size={11} /> Edit
                                </button>
                            )
                        )}
                    </div>

                    <p style={{
                        fontSize: 10, fontWeight: 600, letterSpacing: "0.1em",
                        textTransform: "uppercase", color: "#aaa", marginBottom: 4,
                    }}>
                        Personal Information
                    </p>

                    <div style={{ borderTop: "1px solid #f0f0f0" }}>
                        <FieldRow icon={User} label="First Name" value={profile.first_name} editMode={editMode} onChange={(v) => updateField("first_name", v)} />
                        <FieldRow icon={User} label="Last Name" value={profile.last_name} editMode={editMode} onChange={(v) => updateField("last_name", v)} />
                        <FieldRow icon={Mail} label="Email" type="email" value={profile.email} editMode={editMode} onChange={(v) => updateField("email", v)} />
                        <FieldRow icon={Phone} label="Phone" type="tel" value={profile.phone} editMode={editMode} onChange={(v) => updateField("phone", v)} />
                        <FieldRow icon={MapPin} label="Address" value={profile.address} editMode={editMode} onChange={(v) => updateField("address", v)} multiline />
                    </div>

                    {(error || message) && (
                        <div style={{ marginTop: 20 }}>
                            {error && (
                                <p style={{ fontSize: 13, color: "#c0392b", padding: "12px 16px", background: "#fdf3f2", borderRadius: 8 }}>
                                    {error}
                                </p>
                            )}
                            {message && (
                                <p style={{ fontSize: 13, color: "#27ae60", padding: "12px 16px", background: "#f2fdf4", borderRadius: 8 }}>
                                    {message}
                                </p>
                            )}
                        </div>
                    )}

                    {editMode && (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            style={{
                                marginTop: 28, width: "100%", height: 48,
                                background: saving ? "#555" : "#111",
                                color: "#fff", border: "none", borderRadius: 10,
                                fontSize: 14, fontWeight: 500, cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                fontFamily: "'DM Sans', sans-serif",
                                transition: "background 0.2s",
                            }}
                        >
                            {saving ? <><Loader2 size={15} className="spin" /> Saving…</> : "Save Changes"}
                        </button>
                    )}

                    <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid #f0f0f0" }}>
                        <button
                            onClick={handleLogout}
                            disabled={loggingOut}
                            style={{
                                background: "none", border: "none", cursor: "pointer",
                                fontSize: 13, color: "#c0392b", display: "flex",
                                alignItems: "center", gap: 6, fontFamily: "'DM Sans', sans-serif",
                                opacity: loggingOut ? 0.5 : 1, padding: 0,
                            }}
                        >
                            {loggingOut
                                ? <><Loader2 size={13} className="spin" /> Signing out…</>
                                : <><LogOut size={13} /> Sign out of account</>
                            }
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;