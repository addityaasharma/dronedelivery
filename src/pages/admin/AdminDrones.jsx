import React, { useEffect, useState, useRef } from "react";
import {
    Plus, Search, Edit2, Trash2, X, Check, RefreshCw,
    AlertTriangle, ChevronDown, ChevronUp, Cpu, Activity,
    DollarSign, Package, Zap, Wind, Navigation, Info,
    ShoppingBag, Clock, TrendingUp
} from "lucide-react";
import { backend_api } from "../../api";

// ─── Styles ────────────────────────────────────────────────────────────────────
const Styles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .drones {
            --bg:        #f5f5f4;
            --surface:   #ffffff;
            --border:    #e7e5e4;
            --border2:   #d6d3d1;
            --text:      #1c1917;
            --text-2:    #57534e;
            --text-3:    #a8a29e;
            --indigo:    #4f46e5;
            --indigo-lt: #eef2ff;
            --indigo-bd: #c7d2fe;
            --green:     #16a34a;
            --green-lt:  #f0fdf4;
            --red:       #dc2626;
            --red-lt:    #fef2f2;
            --amber:     #d97706;
            --amber-lt:  #fffbeb;
            --blue:      #0284c7;
            --blue-lt:   #f0f9ff;
            --purple:    #7c3aed;
            --purple-lt: #f5f3ff;
            --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
            --shadow-lg: 0 12px 32px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06);
            --radius:    8px;
            --radius-lg: 12px;
            --ff:        'Geist', sans-serif;
            --ffm:       'Geist Mono', monospace;

            font-family: var(--ff);
            background: var(--bg);
            color: var(--text);
            min-height: 100vh;
            font-size: 14px;
            line-height: 1.5;
        }

        .drones-inner { max-width: 1280px; margin: 0 auto; padding: 32px 24px; }

        /* Header */
        .page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 28px; flex-wrap: wrap; }
        .page-title { font-size: 22px; font-weight: 600; letter-spacing: -0.3px; }
        .page-sub { font-size: 13px; color: var(--text-3); margin-top: 2px; }

        /* Stats */
        .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(165px,1fr)); gap: 12px; margin-bottom: 24px; }
        .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 16px 18px; box-shadow: var(--shadow-sm); display: flex; align-items: flex-start; gap: 12px; }
        .stat-icon { width: 38px; height: 38px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .stat-label { font-size: 11px; font-weight: 600; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 5px; }
        .stat-value { font-size: 24px; font-weight: 700; color: var(--text); letter-spacing: -0.4px; font-family: var(--ffm); }
        .stat-sub { font-size: 11px; color: var(--text-3); margin-top: 2px; }

        /* Toolbar */
        .toolbar { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 12px 16px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; box-shadow: var(--shadow-sm); }
        .search-wrap { position: relative; flex: 1; min-width: 200px; }
        .search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-3); pointer-events: none; }
        .search-input { width: 100%; padding: 8px 12px 8px 34px; background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius); font-size: 13px; color: var(--text); font-family: var(--ff); outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
        .search-input::placeholder { color: var(--text-3); }
        .search-input:focus { border-color: var(--indigo); box-shadow: 0 0 0 3px var(--indigo-lt); }

        /* Status filter pills */
        .filter-pills { display: flex; gap: 4px; flex-wrap: wrap; }
        .pill { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 500; cursor: pointer; border: 1px solid var(--border); background: transparent; color: var(--text-2); font-family: var(--ff); transition: all 0.15s; }
        .pill:hover { border-color: var(--border2); background: var(--bg); }
        .pill.active { background: var(--indigo); color: #fff; border-color: var(--indigo); }

        /* Buttons */
        .btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: var(--radius); font-family: var(--ff); font-size: 13px; font-weight: 500; cursor: pointer; border: none; transition: all 0.15s; white-space: nowrap; }
        .btn-primary { background: var(--indigo); color: #fff; box-shadow: var(--shadow-sm); }
        .btn-primary:hover { background: #4338ca; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-ghost { background: transparent; color: var(--text-2); border: 1px solid var(--border); }
        .btn-ghost:hover { background: var(--bg); border-color: var(--border2); }
        .btn-danger { background: var(--red-lt); color: var(--red); border: 1px solid #fecaca; }
        .btn-danger:hover { background: #fee2e2; }
        .btn-icon { padding: 7px; border-radius: var(--radius); background: transparent; border: 1px solid transparent; cursor: pointer; transition: all 0.15s; color: var(--text-3); display: flex; }
        .btn-icon:hover { background: var(--bg); border-color: var(--border); color: var(--text-2); }
        .btn-icon.del:hover { background: var(--red-lt); border-color: #fecaca; color: var(--red); }
        .btn-icon.edit:hover { background: var(--indigo-lt); border-color: var(--indigo-bd); color: var(--indigo); }
        .btn-icon.info:hover { background: var(--blue-lt); border-color: #bae6fd; color: var(--blue); }

        /* Badge */
        .badge { display: inline-flex; align-items: center; gap: 3px; padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 500; white-space: nowrap; }
        .badge-green  { background: var(--green-lt);  color: var(--green); }
        .badge-red    { background: var(--red-lt);    color: var(--red); }
        .badge-amber  { background: var(--amber-lt);  color: var(--amber); }
        .badge-indigo { background: var(--indigo-lt); color: var(--indigo); }
        .badge-blue   { background: var(--blue-lt);   color: var(--blue); }
        .badge-purple { background: var(--purple-lt); color: var(--purple); }
        .badge-muted  { background: var(--bg); color: var(--text-2); border: 1px solid var(--border); }

        /* Drone grid */
        .drone-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 14px; }

        /* Drone card */
        .drone-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); overflow: hidden; transition: box-shadow 0.15s, border-color 0.15s; }
        .drone-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); border-color: var(--border2); }

        .drone-card-top { padding: 16px; border-bottom: 1px solid var(--border); display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
        .drone-model-wrap { display: flex; align-items: center; gap: 10px; }
        .drone-avatar { width: 42px; height: 42px; border-radius: 10px; background: var(--indigo-lt); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .drone-model { font-size: 14px; font-weight: 600; color: var(--text); }
        .drone-id { font-family: var(--ffm); font-size: 11px; color: var(--text-3); margin-top: 1px; }

        .drone-card-specs { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0; border-bottom: 1px solid var(--border); }
        .spec-item { padding: 10px 14px; border-right: 1px solid var(--border); }
        .spec-item:last-child { border-right: none; }
        .spec-label { font-size: 10px; font-weight: 600; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .spec-value { font-family: var(--ffm); font-size: 14px; font-weight: 700; color: var(--text); }
        .spec-unit { font-size: 10px; color: var(--text-3); font-family: var(--ff); font-weight: 400; }

        .drone-card-footer { padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; }
        .drone-footer-left { display: flex; align-items: center; gap: 8px; }
        .drone-extra { font-size: 11px; color: var(--text-3); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 160px; }

        /* Detail panel */
        .detail-panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); margin-top: 20px; overflow: hidden; }
        .detail-hd { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); }
        .detail-title { font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
        .detail-body { padding: 20px; }
        .detail-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
        .detail-stat { background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 16px; }
        .detail-stat-label { font-size: 11px; font-weight: 600; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
        .detail-stat-value { font-family: var(--ffm); font-size: 20px; font-weight: 700; color: var(--text); }
        .detail-stat-sub { font-size: 11px; color: var(--text-3); margin-top: 3px; }

        .order-chip { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius); margin-top: 8px; }
        .order-chip-num { font-family: var(--ffm); font-size: 12px; font-weight: 600; color: var(--text); flex: 1; }
        .order-chip-price { font-family: var(--ffm); font-size: 12px; color: var(--text-2); }

        /* Empty */
        .empty-state { padding: 64px 24px; text-align: center; }
        .empty-icon { width: 48px; height: 48px; background: var(--bg); border: 1px solid var(--border); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--text-3); margin: 0 auto 14px; }
        .empty-title { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
        .empty-sub { font-size: 13px; color: var(--text-3); }

        /* Spinner */
        .spinner { display: inline-block; border-radius: 50%; border: 2px solid var(--border2); border-top-color: var(--indigo); animation: spin 0.7s linear infinite; }
        @keyframes spin { to{transform:rotate(360deg)} }
        .loading-screen { display: flex; align-items: center; justify-content: center; padding: 64px; }

        /* Modal */
        .overlay { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; padding: 24px; backdrop-filter: blur(2px); animation: fadeIn 0.15s; }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .modal { background: var(--surface); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; animation: slideUp 0.18s ease; }
        @keyframes slideUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        .modal-hd { display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--surface); z-index: 1; }
        .modal-title { font-size: 15px; font-weight: 600; }
        .modal-close { background: none; border: none; cursor: pointer; color: var(--text-3); padding: 4px; border-radius: 6px; display: flex; transition: all 0.15s; }
        .modal-close:hover { background: var(--bg); color: var(--text); }
        .modal-body { padding: 22px 24px; display: flex; flex-direction: column; gap: 16px; }
        .modal-ft { padding: 14px 24px; border-top: 1px solid var(--border); display: flex; gap: 8px; justify-content: flex-end; }

        /* Form */
        .field { display: flex; flex-direction: column; gap: 5px; }
        .field-label { font-size: 11px; font-weight: 600; color: var(--text-2); letter-spacing: 0.3px; text-transform: uppercase; }
        .field-input, .field-textarea { padding: 9px 12px; border: 1px solid var(--border); border-radius: var(--radius); font-family: var(--ff); font-size: 13px; color: var(--text); background: var(--surface); outline: none; transition: border-color 0.15s, box-shadow 0.15s; width: 100%; }
        .field-input:focus, .field-textarea:focus { border-color: var(--indigo); box-shadow: 0 0 0 3px var(--indigo-lt); }
        .field-textarea { resize: vertical; min-height: 72px; line-height: 1.6; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .field-hint { font-size: 11px; color: var(--text-3); }

        /* Confirm */
        .confirm-icon { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
        .confirm-title { font-size: 15px; font-weight: 600; margin-bottom: 6px; }
        .confirm-text { font-size: 13px; color: var(--text-2); line-height: 1.6; }

        /* Bulk bar */
        .bulk-bar { display: flex; align-items: center; gap: 10px; padding: 10px 16px; background: var(--indigo-lt); border: 1px solid var(--indigo-bd); border-radius: var(--radius); margin-bottom: 12px; animation: slideDown 0.15s ease; }
        @keyframes slideDown { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:none} }
        .bulk-count { font-size: 13px; font-weight: 600; color: var(--indigo); flex: 1; }

        /* Toast */
        .toast { position: fixed; bottom: 24px; right: 24px; z-index: 99999; padding: 11px 16px; border-radius: var(--radius); font-size: 13px; font-weight: 500; box-shadow: var(--shadow-lg); display: flex; align-items: center; gap: 8px; animation: toastIn 0.2s ease; max-width: 320px; color: #fff; }
        @keyframes toastIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
        .toast-success { background: var(--green); }
        .toast-error   { background: var(--red); }

        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 99px; }
    `}</style>
);

// ─── Helpers ───────────────────────────────────────────────────────────────────
const Toast = ({ toast }) => {
    if (!toast) return null;
    return (
        <div className={`toast toast-${toast.type}`}>
            {toast.type === "success" ? <Check size={14} /> : <AlertTriangle size={14} />}
            {toast.message}
        </div>
    );
};

const STATUS_BADGE = {
    idle: "badge-green",
    available: "badge-green",
    assigned: "badge-indigo",
    in_flight: "badge-blue",
    IDLE: "badge-green",
    AVAILABLE: "badge-green",
    ASSIGNED: "badge-indigo",
    IN_FLIGHT: "badge-blue",
    maintenance: "badge-amber",
    MAINTENANCE: "badge-amber",
    retired: "badge-muted",
    RETIRED: "badge-muted",
};

const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

// ─── Confirm Delete ─────────────────────────────────────────────────────────────
const ConfirmModal = ({ drone, onConfirm, onClose, loading }) => (
    <div className="overlay">
        <div className="modal" style={{ maxWidth: 400 }}>
            <div className="modal-body">
                <div className="confirm-icon" style={{ background: "var(--red-lt)" }}>
                    <AlertTriangle size={20} color="var(--red)" />
                </div>
                <p className="confirm-title">Delete {drone?.model}?</p>
                <p className="confirm-text">
                    This drone and all its assignment history will be permanently removed. This action cannot be undone.
                </p>
            </div>
            <div className="modal-ft">
                <button className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
                <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
                    {loading
                        ? <><span className="spinner" style={{ width: 13, height: 13 }} /> Deleting…</>
                        : <><Trash2 size={13} /> Delete</>}
                </button>
            </div>
        </div>
    </div>
);

// ─── Drone Form Modal ───────────────────────────────────────────────────────────
const DroneModal = ({ mode, drone, onClose, onSuccess, showToast }) => {
    const [form, setForm] = useState({
        model: drone?.model || "",
        capacity: drone?.capacity || "",
        range: drone?.range || "",
        price: drone?.price || "",
        extra_info: drone?.extra_info || "",
    });
    const [saving, setSaving] = useState(false);

    const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

    const handleSubmit = async () => {
        const { model, capacity, range, price } = form;
        if (!model.trim() || !capacity || !range || !price) {
            showToast("Model, capacity, range and price are required", "error"); return;
        }
        setSaving(true);
        try {
            const payload = {
                model: model.trim(),
                capacity: parseFloat(capacity),
                range: parseFloat(range),
                price: parseFloat(price),
                extra_info: form.extra_info || null,
            };
            const url = mode === "add" ? `${backend_api}/admin/drones` : `${backend_api}/admin/drones/${drone.id}`;
            const method = mode === "add" ? "POST" : "PUT";
            const res = await fetch(url, { method, credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Request failed");
            showToast(mode === "add" ? "Drone added!" : "Drone updated!", "success");
            onSuccess();
        } catch (err) {
            showToast(err.message || "Something went wrong", "error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="overlay">
            <div className="modal">
                <div className="modal-hd">
                    <p className="modal-title">{mode === "add" ? "Register Drone" : "Edit Drone"}</p>
                    <button className="modal-close" onClick={onClose}><X size={17} /></button>
                </div>
                <div className="modal-body">
                    <div className="field">
                        <label className="field-label">Model *</label>
                        <input className="field-input" placeholder="e.g. DJI Matrice 300 RTK" value={form.model} onChange={set("model")} />
                    </div>
                    <div className="field-row">
                        <div className="field">
                            <label className="field-label">Capacity (kg) *</label>
                            <input className="field-input" type="number" step="0.1" min="0" placeholder="5.0" value={form.capacity} onChange={set("capacity")} />
                            <span className="field-hint">Max payload weight</span>
                        </div>
                        <div className="field">
                            <label className="field-label">Range (km) *</label>
                            <input className="field-input" type="number" step="0.1" min="0" placeholder="15.0" value={form.range} onChange={set("range")} />
                            <span className="field-hint">Max flight distance</span>
                        </div>
                    </div>
                    <div className="field">
                        <label className="field-label">Price (₹) *</label>
                        <input className="field-input" type="number" step="100" min="0" placeholder="250000" value={form.price} onChange={set("price")} />
                    </div>
                    <div className="field">
                        <label className="field-label">Extra Info</label>
                        <textarea className="field-textarea" placeholder="Any additional notes about this drone…" value={form.extra_info} onChange={set("extra_info")} />
                    </div>
                </div>
                <div className="modal-ft">
                    <button className="btn btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
                        {saving
                            ? <><span className="spinner" style={{ width: 13, height: 13, borderTopColor: "#fff" }} /> Saving…</>
                            : <><Check size={13} /> {mode === "add" ? "Register Drone" : "Save Changes"}</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Drone Detail Panel ─────────────────────────────────────────────────────────
const DroneDetailPanel = ({ drone, onClose, showToast }) => {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch_ = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${backend_api}/admin/drones/${drone.id}`, { credentials: "include" });
                const data = await res.json();
                if (res.ok) setDetail(data.data);
            } catch {
                showToast("Failed to load drone details", "error");
            } finally {
                setLoading(false);
            }
        };
        fetch_();
    }, [drone.id]);

    const stats = detail?.statistics;
    const lastOrder = detail?.last_assigned_order;
    const activeOrder = detail?.current_active_order;

    return (
        <div className="detail-panel">
            <div className="detail-hd">
                <p className="detail-title">
                    <Info size={15} /> {drone.model} — Fleet Details
                </p>
                <button className="btn-icon" onClick={onClose}><X size={16} /></button>
            </div>

            {loading ? (
                <div className="loading-screen"><span className="spinner" style={{ width: 22, height: 22 }} /></div>
            ) : detail ? (
                <div className="detail-body">
                    <div className="detail-grid">
                        <div className="detail-stat">
                            <p className="detail-stat-label">Total Assigned</p>
                            <p className="detail-stat-value">{stats?.total_assigned_orders ?? "—"}</p>
                            <p className="detail-stat-sub">All-time assignments</p>
                        </div>
                        <div className="detail-stat">
                            <p className="detail-stat-label">Delivered</p>
                            <p className="detail-stat-value">{stats?.total_delivered_orders ?? "—"}</p>
                            <p className="detail-stat-sub">Completed deliveries</p>
                        </div>
                        <div className="detail-stat">
                            <p className="detail-stat-label">Revenue Generated</p>
                            <p className="detail-stat-value">₹{Number(stats?.total_revenue_generated || 0).toLocaleString()}</p>
                            <p className="detail-stat-sub">From delivered orders</p>
                        </div>
                        <div className="detail-stat">
                            <p className="detail-stat-label">Purchase Date</p>
                            <p className="detail-stat-value" style={{ fontSize: 15 }}>{formatDate(detail.drone_info?.purchase_date)}</p>
                            <p className="detail-stat-sub">Fleet since</p>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
                        {/* Active order */}
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Active Order</p>
                            {activeOrder ? (
                                <div className="order-chip">
                                    <ShoppingBag size={13} style={{ color: "var(--indigo)", flexShrink: 0 }} />
                                    <p className="order-chip-num">{activeOrder.order_number}</p>
                                    <span className={`badge ${STATUS_BADGE[activeOrder.status] || "badge-muted"}`} style={{ fontSize: 10 }}>{activeOrder.status}</span>
                                </div>
                            ) : (
                                <div style={{ fontSize: 12, color: "var(--text-3)", padding: "10px 14px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
                                    No active order
                                </div>
                            )}
                        </div>

                        {/* Last order */}
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Last Assignment</p>
                            {lastOrder ? (
                                <div className="order-chip">
                                    <Clock size={13} style={{ color: "var(--text-3)", flexShrink: 0 }} />
                                    <p className="order-chip-num">{lastOrder.order_number}</p>
                                    <p className="order-chip-price">₹{Number(lastOrder.total_price).toLocaleString()}</p>
                                    <span className={`badge ${STATUS_BADGE[lastOrder.status] || "badge-muted"}`} style={{ fontSize: 10 }}>{lastOrder.status}</span>
                                </div>
                            ) : (
                                <div style={{ fontSize: 12, color: "var(--text-3)", padding: "10px 14px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
                                    No assignments yet
                                </div>
                            )}
                        </div>
                    </div>

                    {detail.drone_info?.extra_info && (
                        <div style={{ marginTop: 14, padding: "12px 14px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>
                            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>Notes</span>
                            {detail.drone_info.extra_info}
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
};

// ─── Drone Card ─────────────────────────────────────────────────────────────────
const DroneCard = ({ drone, onEdit, onDelete, onInfo, selected, onSelect }) => {
    const badgeClass = STATUS_BADGE[drone.status] || "badge-muted";

    return (
        <div className="drone-card">
            <div className="drone-card-top">
                <div className="drone-model-wrap">
                    <div style={{ position: "relative" }}>
                        <input
                            type="checkbox"
                            style={{ position: "absolute", top: -4, left: -4, width: 15, height: 15, accentColor: "var(--indigo)", cursor: "pointer", zIndex: 1 }}
                            checked={selected}
                            onChange={onSelect}
                        />
                        <div className="drone-avatar"><Cpu size={18} color="var(--indigo)" /></div>
                    </div>
                    <div>
                        <p className="drone-model">{drone.model}</p>
                        <p className="drone-id">ID #{drone.id} · {formatDate(drone.purchase_date)}</p>
                    </div>
                </div>
                <span className={`badge ${badgeClass}`}>{drone.status}</span>
            </div>

            <div className="drone-card-specs">
                <div className="spec-item">
                    <p className="spec-label"><Wind size={9} style={{ display: "inline", marginRight: 2 }} />Capacity</p>
                    <p className="spec-value">{drone.capacity}<span className="spec-unit"> kg</span></p>
                </div>
                <div className="spec-item">
                    <p className="spec-label"><Navigation size={9} style={{ display: "inline", marginRight: 2 }} />Range</p>
                    <p className="spec-value">{drone.range}<span className="spec-unit"> km</span></p>
                </div>
                <div className="spec-item">
                    <p className="spec-label"><Package size={9} style={{ display: "inline", marginRight: 2 }} />Delivered</p>
                    <p className="spec-value">{drone.delivered ?? "—"}</p>
                </div>
            </div>

            <div className="drone-card-footer">
                <div className="drone-footer-left">
                    <span style={{ fontFamily: "var(--ffm)", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
                        ₹{Number(drone.price).toLocaleString()}
                    </span>
                    {drone.extra_info && (
                        <p className="drone-extra" title={drone.extra_info}>{drone.extra_info}</p>
                    )}
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                    <button className="btn-icon info" title="View details" onClick={() => onInfo(drone)}><Info size={14} /></button>
                    <button className="btn-icon edit" title="Edit" onClick={() => onEdit(drone)}><Edit2 size={14} /></button>
                    <button className="btn-icon del" title="Delete" onClick={() => onDelete(drone)}><Trash2 size={14} /></button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ─────────────────────────────────────────────────────────────
const AdminDrones = () => {
    const [drones, setDrones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selected, setSelected] = useState([]);
    const [modal, setModal] = useState(null);   // null | { mode, drone? }
    const [confirmDel, setConfirmDel] = useState(null);   // drone object
    const [delLoading, setDelLoading] = useState(false);
    const [detailDrone, setDetailDrone] = useState(null);
    const [toast, setToast] = useState(null);
    const toastTimer = useRef();

    const showToast = (message, type = "success") => {
        clearTimeout(toastTimer.current);
        setToast({ message, type });
        toastTimer.current = setTimeout(() => setToast(null), 3200);
    };

    const fetchDrones = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${backend_api}/admin/drones`, { credentials: "include" });
            const data = await res.json();
            if (res.ok) setDrones(data.data || []);
        } catch {
            showToast("Failed to load drones", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDrones(); }, []);

    const handleDelete = async () => {
        if (!confirmDel) return;
        setDelLoading(true);
        try {
            const res = await fetch(`${backend_api}/admin/drones/${confirmDel.id}`, { method: "DELETE", credentials: "include" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            showToast(`${confirmDel.model} deleted`, "success");
            setConfirmDel(null);
            if (detailDrone?.id === confirmDel.id) setDetailDrone(null);
            fetchDrones();
        } catch (err) {
            showToast(err.message || "Delete failed", "error");
        } finally {
            setDelLoading(false);
        }
    };

    const toggleSelect = (id) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
    const toggleAll = () => setSelected(selected.length === drones.length ? [] : drones.map(d => d.id));

    // Unique statuses for filter
    const allStatuses = [...new Set(drones.map(d => d.status).filter(Boolean))];

    const filtered = drones.filter(d => {
        const matchStatus = statusFilter === "all" || d.status === statusFilter;
        const matchSearch = !search || d.model?.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    // Stat counts
    const idle = drones.filter(d => ["idle", "IDLE", "available", "AVAILABLE"].includes(d.status)).length;
    const inFlight = drones.filter(d => ["in_flight", "IN_FLIGHT", "assigned", "ASSIGNED"].includes(d.status)).length;
    const maintenance = drones.filter(d => ["maintenance", "MAINTENANCE"].includes(d.status)).length;
    const totalValue = drones.reduce((s, d) => s + Number(d.price || 0), 0);

    return (
        <div className="drones">
            <Styles />
            <Toast toast={toast} />

            {modal && (
                <DroneModal
                    mode={modal.mode} drone={modal.drone}
                    onClose={() => setModal(null)}
                    onSuccess={() => { setModal(null); fetchDrones(); }}
                    showToast={showToast}
                />
            )}

            {confirmDel && (
                <ConfirmModal
                    drone={confirmDel}
                    onConfirm={handleDelete}
                    onClose={() => setConfirmDel(null)}
                    loading={delLoading}
                />
            )}

            <div className="drones-inner">

                {/* Header */}
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Drone Fleet</h1>
                        <p className="page-sub">Register, monitor, and manage your delivery drones</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setModal({ mode: "add" })}>
                        <Plus size={15} /> Register Drone
                    </button>
                </div>

                {/* Stats */}
                <div className="stats-row">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: "var(--indigo-lt)" }}><Cpu size={18} color="var(--indigo)" /></div>
                        <div>
                            <p className="stat-label">Total Fleet</p>
                            <p className="stat-value">{drones.length}</p>
                            <p className="stat-sub">Registered drones</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: "var(--green-lt)" }}><Zap size={18} color="var(--green)" /></div>
                        <div>
                            <p className="stat-label">Available</p>
                            <p className="stat-value">{idle}</p>
                            <p className="stat-sub">Ready to deploy</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: "var(--blue-lt)" }}><Navigation size={18} color="var(--blue)" /></div>
                        <div>
                            <p className="stat-label">In Flight</p>
                            <p className="stat-value">{inFlight}</p>
                            <p className="stat-sub">Assigned / active</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: "var(--amber-lt)" }}><Activity size={18} color="var(--amber)" /></div>
                        <div>
                            <p className="stat-label">Maintenance</p>
                            <p className="stat-value">{maintenance}</p>
                            <p className="stat-sub">Under service</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: "var(--purple-lt)" }}><DollarSign size={18} color="var(--purple)" /></div>
                        <div>
                            <p className="stat-label">Fleet Value</p>
                            <p className="stat-value">₹{(totalValue / 100000).toFixed(1)}L</p>
                            <p className="stat-sub">Total investment</p>
                        </div>
                    </div>
                </div>

                {/* Bulk bar */}
                {selected.length > 0 && (
                    <div className="bulk-bar">
                        <p className="bulk-count">{selected.length} drone{selected.length > 1 ? "s" : ""} selected</p>
                        <button className="btn btn-ghost" style={{ fontSize: 12, padding: "5px 10px" }} onClick={() => setSelected([])}>
                            <X size={12} /> Clear
                        </button>
                    </div>
                )}

                {/* Toolbar */}
                <div className="toolbar">
                    <div className="search-wrap">
                        <Search size={14} className="search-icon" />
                        <input className="search-input" placeholder="Search by model…" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div className="filter-pills">
                        <button className={`pill ${statusFilter === "all" ? "active" : ""}`} onClick={() => setStatusFilter("all")}>All</button>
                        {allStatuses.map(s => (
                            <button key={s} className={`pill ${statusFilter === s ? "active" : ""}`} onClick={() => setStatusFilter(s)}>
                                {s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                            </button>
                        ))}
                    </div>
                    {selected.length > 0 && (
                        <button className="btn btn-ghost" onClick={toggleAll} style={{ fontSize: 12 }}>
                            {selected.length === drones.length ? "Deselect all" : "Select all"}
                        </button>
                    )}
                    <button className="btn btn-ghost" onClick={fetchDrones} disabled={loading}>
                        <RefreshCw size={13} />
                    </button>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="loading-screen"><span className="spinner" style={{ width: 28, height: 28 }} /></div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon"><Cpu size={20} /></div>
                        <p className="empty-title">{search || statusFilter !== "all" ? "No drones match your filters" : "No drones registered yet"}</p>
                        <p className="empty-sub">{search || statusFilter !== "all" ? "Try a different search or filter" : "Register your first drone to get started"}</p>
                    </div>
                ) : (
                    <div className="drone-grid">
                        {filtered.map(d => (
                            <DroneCard
                                key={d.id}
                                drone={d}
                                selected={selected.includes(d.id)}
                                onSelect={() => toggleSelect(d.id)}
                                onEdit={(drone) => setModal({ mode: "edit", drone })}
                                onDelete={(drone) => setConfirmDel(drone)}
                                onInfo={(drone) => setDetailDrone(prev => prev?.id === drone.id ? null : drone)}
                            />
                        ))}
                    </div>
                )}

                {/* Detail panel */}
                {detailDrone && (
                    <DroneDetailPanel
                        drone={detailDrone}
                        onClose={() => setDetailDrone(null)}
                        showToast={showToast}
                    />
                )}

            </div>
        </div>
    );
};

export default AdminDrones;