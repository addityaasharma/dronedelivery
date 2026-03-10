import React, { useEffect, useState, useRef } from "react";
import {
    Users, ShoppingBag, Search, RefreshCw, ChevronLeft, ChevronRight,
    AlertTriangle, Check, X, MapPin, Phone, Mail, Package,
    Truck, Clock, ChevronDown, ChevronUp, Eye, Activity,
    TrendingUp, DollarSign, Box
} from "lucide-react";
import { backend_api } from "../../api";

// ─── Styles ────────────────────────────────────────────────────────────────────
const Styles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .dash {
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

        .dash-inner { max-width: 1280px; margin: 0 auto; padding: 32px 24px; }

        /* Header */
        .page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 28px; flex-wrap: wrap; }
        .page-title { font-size: 22px; font-weight: 600; letter-spacing: -0.3px; }
        .page-sub { font-size: 13px; color: var(--text-3); margin-top: 2px; }

        /* Stats */
        .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px,1fr)); gap: 12px; margin-bottom: 28px; }
        .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 18px 20px; box-shadow: var(--shadow-sm); display: flex; align-items: flex-start; gap: 14px; }
        .stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .stat-info { flex: 1; }
        .stat-label { font-size: 11px; font-weight: 600; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px; }
        .stat-value { font-size: 26px; font-weight: 700; color: var(--text); letter-spacing: -0.5px; font-family: var(--ffm); }
        .stat-sub { font-size: 11px; color: var(--text-3); margin-top: 3px; }

        /* Section layout */
        .sections { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media (min-width: 1100px) { .sections { grid-template-columns: 1fr 1fr; } }

        /* Panel */
        .panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); overflow: hidden; }
        .panel-full { grid-column: 1 / -1; }
        .panel-hd { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); flex-wrap: wrap; gap: 10px; }
        .panel-title { font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
        .panel-hd-right { display: flex; align-items: center; gap: 8px; }

        /* Toolbar */
        .search-wrap { position: relative; }
        .search-icon { position: absolute; left: 9px; top: 50%; transform: translateY(-50%); color: var(--text-3); pointer-events: none; }
        .search-input { padding: 7px 10px 7px 30px; background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius); font-size: 12px; color: var(--text); font-family: var(--ff); outline: none; transition: border-color 0.15s, box-shadow 0.15s; width: 200px; }
        .search-input::placeholder { color: var(--text-3); }
        .search-input:focus { border-color: var(--indigo); box-shadow: 0 0 0 3px var(--indigo-lt); }

        /* Buttons */
        .btn { display: inline-flex; align-items: center; gap: 5px; padding: 7px 12px; border-radius: var(--radius); font-family: var(--ff); font-size: 12px; font-weight: 500; cursor: pointer; border: none; transition: all 0.15s; white-space: nowrap; }
        .btn-ghost { background: transparent; color: var(--text-2); border: 1px solid var(--border); }
        .btn-ghost:hover { background: var(--bg); border-color: var(--border2); }
        .btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-icon { padding: 6px; border-radius: var(--radius); background: transparent; border: 1px solid transparent; cursor: pointer; transition: all 0.15s; color: var(--text-3); display: flex; }
        .btn-icon:hover { background: var(--bg); border-color: var(--border); color: var(--text-2); }

        /* Badge */
        .badge { display: inline-flex; align-items: center; gap: 3px; padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 500; white-space: nowrap; }
        .badge-green  { background: var(--green-lt);  color: var(--green); }
        .badge-red    { background: var(--red-lt);    color: var(--red); }
        .badge-amber  { background: var(--amber-lt);  color: var(--amber); }
        .badge-indigo { background: var(--indigo-lt); color: var(--indigo); }
        .badge-blue   { background: var(--blue-lt);   color: var(--blue); }
        .badge-purple { background: var(--purple-lt); color: var(--purple); }
        .badge-muted  { background: var(--bg); color: var(--text-2); border: 1px solid var(--border); }

        /* ── Customer table ── */
        .table { width: 100%; border-collapse: collapse; }
        .table thead tr { border-bottom: 1px solid var(--border); background: var(--bg); }
        .table th { padding: 9px 16px; text-align: left; font-size: 11px; font-weight: 600; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }
        .table td { padding: 11px 16px; border-bottom: 1px solid var(--border); vertical-align: middle; }
        .table tbody tr:last-child td { border-bottom: none; }
        .table tbody tr { transition: background 0.1s; }
        .table tbody tr:hover { background: #fafaf9; }

        .avatar { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0; background: var(--indigo-lt); color: var(--indigo); }
        .cust-name { font-size: 13px; font-weight: 500; color: var(--text); }
        .cust-email { font-size: 11px; color: var(--text-3); margin-top: 1px; }
        .mono-sm { font-family: var(--ffm); font-size: 11px; color: var(--text-2); }

        /* ── Orders ── */
        .order-row { border-bottom: 1px solid var(--border); transition: background 0.1s; }
        .order-row:last-child { border-bottom: none; }
        .order-summary { display: flex; align-items: center; gap: 12px; padding: 12px 20px; cursor: pointer; }
        .order-summary:hover { background: #fafaf9; }
        .order-num { font-family: var(--ffm); font-size: 12px; font-weight: 600; color: var(--text); min-width: 120px; }
        .order-customer { flex: 1; min-width: 0; }
        .order-cust-name { font-size: 13px; font-weight: 500; color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .order-cust-email { font-size: 11px; color: var(--text-3); }
        .order-meta { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .order-price { font-family: var(--ffm); font-size: 13px; font-weight: 700; color: var(--text); }
        .order-date { font-size: 11px; color: var(--text-3); }
        .expand-icon { color: var(--text-3); flex-shrink: 0; transition: transform 0.2s; }
        .expand-icon.open { transform: rotate(180deg); }

        /* Order detail expand */
        .order-detail { padding: 0 20px 16px; animation: expandIn 0.15s ease; }
        @keyframes expandIn { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:none} }
        .order-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 640px) { .order-detail-grid { grid-template-columns: 1fr; } }
        .detail-section { background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius); padding: 12px 14px; }
        .detail-section-title { font-size: 11px; font-weight: 600; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
        .detail-row { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 6px; font-size: 12px; color: var(--text-2); }
        .detail-row:last-child { margin-bottom: 0; }
        .detail-row-icon { color: var(--text-3); flex-shrink: 0; margin-top: 1px; }
        .detail-row-label { color: var(--text-3); min-width: 60px; }
        .detail-row-val { color: var(--text); font-weight: 500; }

        .prod-mini-item { display: flex; align-items: center; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--border); font-size: 12px; }
        .prod-mini-item:last-child { border-bottom: none; }
        .prod-mini-name { color: var(--text); font-weight: 500; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 8px; }
        .prod-mini-qty { color: var(--text-3); font-family: var(--ffm); font-size: 11px; }
        .prod-mini-price { font-family: var(--ffm); font-size: 12px; font-weight: 600; color: var(--text); }

        .drone-item { display: flex; align-items: flex-start; gap: 8px; padding: 6px 0; border-bottom: 1px solid var(--border); font-size: 12px; }
        .drone-item:last-child { border-bottom: none; }
        .drone-icon { width: 28px; height: 28px; background: var(--indigo-lt); border-radius: 6px; display: flex; align-items: center; justify-content: center; color: var(--indigo); flex-shrink: 0; }
        .drone-model { font-weight: 500; color: var(--text); }
        .drone-meta { font-size: 11px; color: var(--text-3); margin-top: 1px; }

        /* Pagination */
        .pagination { display: flex; align-items: center; justify-content: space-between; padding: 11px 16px; border-top: 1px solid var(--border); flex-wrap: wrap; gap: 8px; }
        .pagination-info { font-size: 11px; color: var(--text-3); }
        .pagination-btns { display: flex; align-items: center; gap: 4px; }
        .page-btn { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 6px; border: 1px solid var(--border); background: var(--surface); cursor: pointer; font-size: 12px; font-family: var(--ff); color: var(--text-2); transition: all 0.15s; }
        .page-btn:hover:not(:disabled) { border-color: var(--indigo); color: var(--indigo); background: var(--indigo-lt); }
        .page-btn.active { background: var(--indigo); color: #fff; border-color: var(--indigo); font-weight: 600; }
        .page-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        /* Empty & loading */
        .empty-row td { padding: 48px; text-align: center; color: var(--text-3); font-size: 13px; }
        .loading-row td { padding: 48px; text-align: center; }
        .spinner { display: inline-block; border-radius: 50%; border: 2px solid var(--border2); border-top-color: var(--indigo); animation: spin 0.7s linear infinite; }
        @keyframes spin { to{transform:rotate(360deg)} }
        .orders-loading { display: flex; align-items: center; justify-content: center; padding: 48px; }

        /* Toast */
        .toast { position: fixed; bottom: 24px; right: 24px; z-index: 99999; padding: 11px 16px; border-radius: var(--radius); font-size: 13px; font-weight: 500; box-shadow: var(--shadow-lg); display: flex; align-items: center; gap: 8px; animation: toastIn 0.2s ease; max-width: 320px; color: #fff; }
        @keyframes toastIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
        .toast-success { background: var(--green); }
        .toast-error { background: var(--red); }

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

const initials = (name = "") =>
    name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?";

const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const formatTime = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
};

const ORDER_STATUS_BADGE = {
    pending: "badge-amber",
    confirmed: "badge-blue",
    processing: "badge-indigo",
    shipped: "badge-purple",
    delivered: "badge-green",
    cancelled: "badge-red",
    returned: "badge-muted",
};

const DRONE_STATUS_BADGE = {
    idle: "badge-green",
    assigned: "badge-indigo",
    in_flight: "badge-blue",
    maintenance: "badge-amber",
    retired: "badge-muted",
};

// ─── Customer Table ─────────────────────────────────────────────────────────────
const CustomerPanel = ({ showToast }) => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;

    const fetch_ = async (pg = 1) => {
        setLoading(true);
        try {
            const res = await fetch(`${backend_api}/admin/customer?page=${pg}&limit=${limit}`, { credentials: "include" });
            const data = await res.json();
            if (res.ok) {
                setCustomers(data.data || []);
                setTotal(data.data?.length || 0);
            }
        } catch {
            showToast("Failed to load customers", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetch_(page); }, [page]);

    const filtered = customers.filter(c =>
        `${c.first_name} ${c.last_name} ${c.email} ${c.phone}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="panel">
            <div className="panel-hd">
                <p className="panel-title"><Users size={15} /> Customers</p>
                <div className="panel-hd-right">
                    <div className="search-wrap">
                        <Search size={12} className="search-icon" />
                        <input className="search-input" placeholder="Search customers…" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <button className="btn btn-ghost" onClick={() => fetch_(page)} disabled={loading}>
                        <RefreshCw size={12} />
                    </button>
                </div>
            </div>

            <div style={{ overflowX: "auto" }}>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Phone</th>
                            <th>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr className="loading-row"><td colSpan={3}><span className="spinner" style={{ width: 20, height: 20 }} /></td></tr>
                        ) : filtered.length === 0 ? (
                            <tr className="empty-row"><td colSpan={3}>{search ? "No customers match your search" : "No customers yet"}</td></tr>
                        ) : filtered.map(c => (
                            <tr key={c.id}>
                                <td>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div className="avatar">{initials(`${c.first_name} ${c.last_name}`)}</div>
                                        <div>
                                            <p className="cust-name">{c.first_name} {c.last_name}</p>
                                            <p className="cust-email">{c.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="mono-sm">{c.phone || "—"}</span></td>
                                <td>
                                    <div style={{ display: "flex", alignItems: "flex-start", gap: 5, maxWidth: 180 }}>
                                        {c.address && <MapPin size={12} style={{ color: "var(--text-3)", flexShrink: 0, marginTop: 2 }} />}
                                        <span style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.4 }}>{c.address || "—"}</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <p className="pagination-info">{customers.length} customers loaded</p>
                <div className="pagination-btns">
                    <button className="page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={12} /></button>
                    <button className="page-btn active">{page}</button>
                    <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={customers.length < limit}><ChevronRight size={12} /></button>
                </div>
            </div>
        </div>
    );
};

// ─── Order Row (expandable) ─────────────────────────────────────────────────────
const OrderRow = ({ order }) => {
    const [open, setOpen] = useState(false);

    const statusBadge = ORDER_STATUS_BADGE[order.status?.toLowerCase()] || "badge-muted";

    return (
        <div className="order-row">
            {/* Summary row */}
            <div className="order-summary" onClick={() => setOpen(o => !o)}>
                <div>
                    <p className="order-num">{order.order_number}</p>
                    <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: 1 }}>{formatTime(order.created_at)}</p>
                </div>

                <div className="order-customer">
                    <p className="order-cust-name">{order.customer?.name}</p>
                    <p className="order-cust-email">{order.customer?.email}</p>
                </div>

                <div className="order-meta">
                    <span className={`badge ${statusBadge}`}>{order.status}</span>
                    <span className="badge badge-muted"><Package size={10} /> {order.total_items}</span>
                    <p className="order-price">₹{Number(order.total_price).toLocaleString()}</p>
                    <ChevronDown size={15} className={`expand-icon ${open ? "open" : ""}`} />
                </div>
            </div>

            {/* Expanded detail */}
            {open && (
                <div className="order-detail">
                    <div className="order-detail-grid">

                        {/* Customer info */}
                        <div className="detail-section">
                            <p className="detail-section-title">Customer</p>
                            <div className="detail-row">
                                <Users size={12} className="detail-row-icon" />
                                <span className="detail-row-val">{order.customer?.name}</span>
                            </div>
                            <div className="detail-row">
                                <Mail size={12} className="detail-row-icon" />
                                <span style={{ fontSize: 12, color: "var(--text-2)" }}>{order.customer?.email}</span>
                            </div>
                            <div className="detail-row">
                                <Phone size={12} className="detail-row-icon" />
                                <span className="mono-sm">{order.customer?.phone || "—"}</span>
                            </div>
                        </div>

                        {/* Products */}
                        <div className="detail-section">
                            <p className="detail-section-title">Products ({order.products?.length})</p>
                            {order.products?.length === 0 ? (
                                <p style={{ fontSize: 12, color: "var(--text-3)" }}>No products</p>
                            ) : order.products?.map((p, i) => (
                                <div key={i} className="prod-mini-item">
                                    <p className="prod-mini-name">{p.title}</p>
                                    <span className="prod-mini-qty">×{p.quantity}</span>
                                    <span style={{ width: 8 }} />
                                    <p className="prod-mini-price">₹{Number(p.price).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>

                        {/* Drone deliveries */}
                        {order.deliveries?.length > 0 && (
                            <div className="detail-section" style={{ gridColumn: "1 / -1" }}>
                                <p className="detail-section-title">Drone Deliveries ({order.deliveries.length})</p>
                                {order.deliveries.map((d, i) => (
                                    <div key={i} className="drone-item">
                                        <div className="drone-icon"><Truck size={13} /></div>
                                        <div style={{ flex: 1 }}>
                                            <p className="drone-model">{d.drone?.model}</p>
                                            <p className="drone-meta">
                                                Capacity: {d.drone?.capacity}kg · Range: {d.drone?.range}km · Assigned: {formatTime(d.assigned_at)}
                                            </p>
                                        </div>
                                        <span className={`badge ${DRONE_STATUS_BADGE[d.drone?.status?.toLowerCase()] || "badge-muted"}`}>
                                            {d.drone?.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Orders Panel ───────────────────────────────────────────────────────────────
const OrdersPanel = ({ showToast, onStatsUpdate }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, pages: 1 });
    const [statusFilter, setStatusFilter] = useState("all");
    const limit = 15;

    const STATUS_OPTIONS = ["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

    const fetch_ = async (pg = 1) => {
        setLoading(true);
        try {
            const res = await fetch(`${backend_api}/admin/order?page=${pg}&limit=${limit}`, { credentials: "include" });
            const data = await res.json();
            if (res.ok) {
                setOrders(data.data || []);
                setPagination(data.pagination || { total: 0, pages: 1 });
                onStatsUpdate?.({
                    totalOrders: data.pagination?.total || 0,
                    totalRevenue: (data.data || []).reduce((s, o) => s + Number(o.total_price || 0), 0),
                });
            }
        } catch {
            showToast("Failed to load orders", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetch_(page); }, [page]);

    const filtered = orders.filter(o => {
        const matchStatus = statusFilter === "all" || o.status?.toLowerCase() === statusFilter;
        const matchSearch = search === "" ||
            o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
            o.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
            o.customer?.email?.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    return (
        <div className="panel panel-full">
            <div className="panel-hd">
                <p className="panel-title"><ShoppingBag size={15} /> Orders</p>
                <div className="panel-hd-right" style={{ flexWrap: "wrap" }}>
                    {/* Status filter tabs */}
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {STATUS_OPTIONS.map(s => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                style={{
                                    padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500,
                                    cursor: "pointer", border: "1px solid",
                                    background: statusFilter === s ? "var(--indigo)" : "transparent",
                                    color: statusFilter === s ? "#fff" : "var(--text-2)",
                                    borderColor: statusFilter === s ? "var(--indigo)" : "var(--border)",
                                    transition: "all 0.15s",
                                    fontFamily: "var(--ff)",
                                }}
                            >
                                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div className="search-wrap">
                        <Search size={12} className="search-icon" />
                        <input className="search-input" placeholder="Search orders…" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <button className="btn btn-ghost" onClick={() => fetch_(page)} disabled={loading}>
                        <RefreshCw size={12} />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="orders-loading"><span className="spinner" style={{ width: 22, height: 22 }} /></div>
            ) : filtered.length === 0 ? (
                <div style={{ padding: "48px", textAlign: "center", color: "var(--text-3)", fontSize: 13 }}>
                    {search || statusFilter !== "all" ? "No orders match your filters" : "No orders yet"}
                </div>
            ) : (
                filtered.map(order => (
                    <OrderRow key={order.order_number} order={order} />
                ))
            )}

            {!loading && pagination.pages > 1 && (
                <div className="pagination">
                    <p className="pagination-info">
                        Page {pagination.page || page} of {pagination.pages} · {pagination.total} total orders
                    </p>
                    <div className="pagination-btns">
                        <button className="page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={12} /></button>
                        {[...Array(Math.min(pagination.pages, 5))].map((_, i) => (
                            <button key={i + 1} className={`page-btn ${page === i + 1 ? "active" : ""}`} onClick={() => setPage(i + 1)}>
                                {i + 1}
                            </button>
                        ))}
                        {pagination.pages > 5 && <span style={{ fontSize: 12, color: "var(--text-3)", padding: "0 2px" }}>…</span>}
                        <button className="page-btn" disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}><ChevronRight size={12} /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Main Dashboard ─────────────────────────────────────────────────────────────
const AdminDashboard = () => {
    const [toast, setToast] = useState(null);
    const [orderStats, setOrderStats] = useState({ totalOrders: 0, totalRevenue: 0 });
    const toastTimer = useRef();

    const showToast = (message, type = "success") => {
        clearTimeout(toastTimer.current);
        setToast({ message, type });
        toastTimer.current = setTimeout(() => setToast(null), 3200);
    };

    return (
        <div className="dash">
            <Styles />
            <Toast toast={toast} />

            <div className="dash-inner">

                {/* Header */}
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Dashboard</h1>
                        <p className="page-sub">Overview of customers, orders and deliveries</p>
                    </div>
                    <span style={{ fontSize: 12, color: "var(--text-3)", fontFamily: "var(--ffm)" }}>
                        {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    </span>
                </div>

                {/* Stats row */}
                <div className="stats-row">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: "var(--indigo-lt)" }}>
                            <ShoppingBag size={18} color="var(--indigo)" />
                        </div>
                        <div className="stat-info">
                            <p className="stat-label">Total Orders</p>
                            <p className="stat-value">{orderStats.totalOrders}</p>
                            <p className="stat-sub">All time</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: "var(--green-lt)" }}>
                            <DollarSign size={18} color="var(--green)" />
                        </div>
                        <div className="stat-info">
                            <p className="stat-label">Revenue (Page)</p>
                            <p className="stat-value">₹{(orderStats.totalRevenue / 1000).toFixed(1)}k</p>
                            <p className="stat-sub">Current page</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: "var(--blue-lt)" }}>
                            <Users size={18} color="var(--blue)" />
                        </div>
                        <div className="stat-info">
                            <p className="stat-label">Customers</p>
                            <p className="stat-value">—</p>
                            <p className="stat-sub">Registered</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: "var(--amber-lt)" }}>
                            <Truck size={18} color="var(--amber)" />
                        </div>
                        <div className="stat-info">
                            <p className="stat-label">Drone Deliveries</p>
                            <p className="stat-value">—</p>
                            <p className="stat-sub">Dispatched</p>
                        </div>
                    </div>
                </div>

                {/* Side-by-side: customers + (orders below full width) */}
                <div className="sections">
                    <CustomerPanel showToast={showToast} />

                    {/* Recent activity placeholder panel */}
                    <div className="panel">
                        <div className="panel-hd">
                            <p className="panel-title"><Activity size={15} /> Quick Stats</p>
                        </div>
                        <div style={{ padding: "20px" }}>
                            {[
                                { label: "Pending orders", value: "—", badge: "badge-amber" },
                                { label: "Delivered today", value: "—", badge: "badge-green" },
                                { label: "Drones in flight", value: "—", badge: "badge-blue" },
                                { label: "Cancelled orders", value: "—", badge: "badge-red" },
                            ].map((item, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
                                    <span style={{ fontSize: 13, color: "var(--text-2)" }}>{item.label}</span>
                                    <span className={`badge ${item.badge}`}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Orders — full width */}
                    <OrdersPanel showToast={showToast} onStatsUpdate={setOrderStats} />
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;