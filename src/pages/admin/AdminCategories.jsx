import React, { useEffect, useState, useRef } from "react";
import {
    Plus, Search, Edit2, Trash2, X, Upload, Check,
    ChevronLeft, ChevronRight, AlertTriangle, RefreshCw,
    Image as ImageIcon, Tag, Layers, Package
} from "lucide-react";
import { backend_api } from "../../api";

const Styles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .adc {
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

        .adc-inner { max-width: 1280px; margin: 0 auto; padding: 32px 24px; }

        /* Header */
        .page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 28px; flex-wrap: wrap; }
        .page-title { font-size: 22px; font-weight: 600; letter-spacing: -0.3px; }
        .page-sub { font-size: 13px; color: var(--text-3); margin-top: 2px; }

        /* Stats */
        .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px,1fr)); gap: 12px; margin-bottom: 24px; }
        .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 18px 20px; box-shadow: var(--shadow-sm); }
        .stat-label { font-size: 11px; font-weight: 600; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 8px; }
        .stat-value { font-size: 28px; font-weight: 700; color: var(--text); letter-spacing: -0.5px; font-family: var(--ffm); }
        .stat-sub { font-size: 11px; color: var(--text-3); margin-top: 3px; }

        /* Toolbar */
        .toolbar { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 12px 16px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; box-shadow: var(--shadow-sm); }
        .search-wrap { position: relative; flex: 1; min-width: 200px; }
        .search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-3); pointer-events: none; }
        .search-input { width: 100%; padding: 8px 12px 8px 34px; background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius); font-size: 13px; color: var(--text); font-family: var(--ff); outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
        .search-input::placeholder { color: var(--text-3); }
        .search-input:focus { border-color: var(--indigo); box-shadow: 0 0 0 3px var(--indigo-lt); }

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
        .btn-icon.view-btn:hover { background: var(--green-lt); border-color: #bbf7d0; color: var(--green); }

        /* Bulk bar */
        .bulk-bar { display: flex; align-items: center; gap: 10px; padding: 10px 16px; background: var(--indigo-lt); border: 1px solid var(--indigo-bd); border-radius: var(--radius); margin-bottom: 12px; animation: slideDown 0.15s ease; }
        @keyframes slideDown { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:none} }
        .bulk-count { font-size: 13px; font-weight: 600; color: var(--indigo); flex: 1; }

        /* Table */
        .table-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); overflow: hidden; }
        .table { width: 100%; border-collapse: collapse; }
        .table thead tr { border-bottom: 1px solid var(--border); background: var(--bg); }
        .table th { padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 600; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.6px; white-space: nowrap; }
        .table td { padding: 12px 16px; border-bottom: 1px solid var(--border); vertical-align: middle; }
        .table tbody tr:last-child td { border-bottom: none; }
        .table tbody tr { transition: background 0.1s; }
        .table tbody tr:hover { background: #fafaf9; }
        .cb { width: 15px; height: 15px; cursor: pointer; accent-color: var(--indigo); }

        .cat-img { width: 44px; height: 44px; border-radius: 8px; object-fit: cover; border: 1px solid var(--border); flex-shrink: 0; }
        .cat-img-ph { width: 44px; height: 44px; border-radius: 8px; background: var(--bg); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--text-3); flex-shrink: 0; }
        .cat-name { font-weight: 500; color: var(--text); font-size: 13px; }
        .cat-desc { font-size: 12px; color: var(--text-3); max-width: 260px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }

        .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 20px; font-size: 11px; font-weight: 500; }
        .badge-indigo { background: var(--indigo-lt); color: var(--indigo); }
        .badge-amber { background: var(--amber-lt); color: var(--amber); }
        .badge-red { background: var(--red-lt); color: var(--red); }
        .slug-cell { font-family: var(--ffm); font-size: 11px; color: var(--text-3); background: var(--bg); padding: 2px 7px; border-radius: 4px; border: 1px solid var(--border); }

        /* Pagination */
        .pagination { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-top: 1px solid var(--border); flex-wrap: wrap; gap: 10px; }
        .pagination-info { font-size: 12px; color: var(--text-3); }
        .pagination-btns { display: flex; align-items: center; gap: 4px; }
        .page-btn { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 6px; border: 1px solid var(--border); background: var(--surface); cursor: pointer; font-size: 12px; font-family: var(--ff); color: var(--text-2); transition: all 0.15s; }
        .page-btn:hover:not(:disabled) { border-color: var(--indigo); color: var(--indigo); background: var(--indigo-lt); }
        .page-btn.active { background: var(--indigo); color: #fff; border-color: var(--indigo); font-weight: 600; }
        .page-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        /* Empty */
        .empty-state { padding: 64px 24px; text-align: center; }
        .empty-icon { width: 48px; height: 48px; background: var(--bg); border: 1px solid var(--border); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--text-3); margin: 0 auto 14px; }
        .empty-title { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
        .empty-sub { font-size: 13px; color: var(--text-3); }

        /* Spinner */
        .spinner { display: inline-block; border-radius: 50%; border: 2px solid var(--border2); border-top-color: var(--indigo); animation: spin 0.7s linear infinite; }
        @keyframes spin { to{transform:rotate(360deg)} }
        .loading-row td { padding: 48px; text-align: center; }

        /* Modal */
        .overlay { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; padding: 24px; backdrop-filter: blur(2px); animation: fadeIn 0.15s; }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .modal { background: var(--surface); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; animation: slideUp 0.18s ease; }
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
        .field-textarea { resize: vertical; min-height: 80px; line-height: 1.6; }

        /* Upload */
        .upload-zone { border: 2px dashed var(--border2); border-radius: var(--radius); padding: 18px; text-align: center; cursor: pointer; transition: all 0.15s; background: var(--bg); }
        .upload-zone:hover, .upload-zone.drag { border-color: var(--indigo); background: var(--indigo-lt); }
        .upload-zone p { font-size: 13px; color: var(--text-3); margin-top: 6px; }
        .upload-zone small { font-size: 11px; color: var(--text-3); }
        .img-preview { position: relative; width: 100%; aspect-ratio: 16/9; border-radius: var(--radius); overflow: hidden; border: 1px solid var(--border); margin-bottom: 10px; background: var(--bg); }
        .img-preview img { width: 100%; height: 100%; object-fit: cover; }
        .img-preview-rm { position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.55); border: none; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #fff; transition: background 0.15s; }
        .img-preview-rm:hover { background: var(--red); }

        /* Products drawer inside category detail */
        .detail-modal { max-width: 680px; }
        .detail-top { display: flex; gap: 16px; align-items: flex-start; margin-bottom: 20px; }
        .detail-cat-img { width: 80px; height: 80px; border-radius: 10px; object-fit: cover; border: 1px solid var(--border); flex-shrink: 0; }
        .detail-cat-img-ph { width: 80px; height: 80px; border-radius: 10px; background: var(--bg); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--text-3); flex-shrink: 0; }
        .detail-name { font-size: 17px; font-weight: 600; margin-bottom: 4px; }
        .detail-slug { font-family: var(--ffm); font-size: 11px; color: var(--text-3); margin-bottom: 6px; }
        .detail-desc { font-size: 13px; color: var(--text-2); line-height: 1.6; }
        .detail-section-title { font-size: 12px; font-weight: 600; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }
        .prod-list-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border); }
        .prod-list-item:last-child { border-bottom: none; }
        .prod-list-img { width: 40px; height: 40px; border-radius: 6px; object-fit: cover; border: 1px solid var(--border); flex-shrink: 0; background: var(--bg); }
        .prod-list-img-ph { width: 40px; height: 40px; border-radius: 6px; background: var(--bg); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--text-3); flex-shrink: 0; }
        .prod-list-name { font-size: 13px; font-weight: 500; flex: 1; }
        .prod-list-price { font-family: var(--ffm); font-size: 13px; font-weight: 600; color: var(--text); }
        .detail-pagination { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 14px; }

        /* Confirm */
        .confirm-icon { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
        .confirm-title { font-size: 15px; font-weight: 600; margin-bottom: 6px; }
        .confirm-text { font-size: 13px; color: var(--text-2); line-height: 1.6; }
        .soft-del-note { display: flex; gap: 8px; background: var(--amber-lt); border: 1px solid #fde68a; border-radius: var(--radius); padding: 10px 12px; font-size: 12px; color: var(--amber); margin-top: 10px; line-height: 1.5; }

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

// ─── Toast ──────────────────────────────────────────────────────────────────────
const Toast = ({ toast }) => {
    if (!toast) return null;
    return (
        <div className={`toast toast-${toast.type}`}>
            {toast.type === "success" ? <Check size={14} /> : <AlertTriangle size={14} />}
            {toast.message}
        </div>
    );
};

// ─── Confirm Delete ─────────────────────────────────────────────────────────────
const ConfirmModal = ({ ids, categories, onConfirm, onClose, loading }) => {
    const hasProducts = categories.filter(c => ids.includes(c.id)).some(c => c.product_count > 0);
    return (
        <div className="overlay">
            <div className="modal" style={{ maxWidth: 420 }}>
                <div className="modal-body">
                    <div className="confirm-icon" style={{ background: "var(--red-lt)" }}>
                        <AlertTriangle size={20} color="var(--red)" />
                    </div>
                    <p className="confirm-title">Delete {ids.length > 1 ? `${ids.length} categories` : "this category"}?</p>
                    <p className="confirm-text">
                        {ids.length > 1 ? "These categories" : "This category"} will be permanently removed.
                        Categories with products will be soft-deleted (deactivated) instead.
                    </p>
                    {hasProducts && (
                        <div className="soft-del-note">
                            <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                            Some selected categories have products and will be deactivated rather than hard-deleted.
                        </div>
                    )}
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
};

// ─── Category Form Modal ────────────────────────────────────────────────────────
const CategoryModal = ({ mode, category, onClose, onSuccess, showToast }) => {
    const [form, setForm] = useState({ name: category?.name || "", description: category?.description || "" });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(category?.image || null);
    const [saving, setSaving] = useState(false);
    const [drag, setDrag] = useState(false);
    const fileRef = useRef();

    const handleFile = (f) => {
        if (!f || !f.type.startsWith("image/")) return;
        setFile(f);
        if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
        setPreview(URL.createObjectURL(f));
    };

    const removeImage = () => { setFile(null); setPreview(null); };

    const handleSubmit = async () => {
        if (!form.name.trim() || !form.description.trim()) {
            showToast("Name and description are required", "error"); return;
        }
        setSaving(true);
        try {
            const fd = new FormData();
            fd.append("name", form.name.trim());
            fd.append("description", form.description.trim());
            if (file) fd.append(mode === "add" ? "image" : "category_image", file);

            const url = mode === "add"
                ? `${backend_api}/admin/category`
                : `${backend_api}/admin/category/${category.id}`;

            const res = await fetch(url, { method: mode === "add" ? "POST" : "PUT", credentials: "include", body: fd });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            showToast(mode === "add" ? "Category added!" : "Category updated!", "success");
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
                    <p className="modal-title">{mode === "add" ? "Add Category" : "Edit Category"}</p>
                    <button className="modal-close" onClick={onClose}><X size={17} /></button>
                </div>
                <div className="modal-body">
                    <div className="field">
                        <label className="field-label">Name *</label>
                        <input className="field-input" placeholder="Category name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div className="field">
                        <label className="field-label">Description *</label>
                        <textarea className="field-textarea" placeholder="Describe this category…" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                    </div>
                    <div className="field">
                        <label className="field-label">Cover Image</label>
                        {preview && (
                            <div className="img-preview">
                                <img src={preview} alt="preview" />
                                <button className="img-preview-rm" onClick={removeImage}><X size={12} /></button>
                            </div>
                        )}
                        {!preview && (
                            <div
                                className={`upload-zone ${drag ? "drag" : ""}`}
                                onClick={() => fileRef.current?.click()}
                                onDragOver={e => { e.preventDefault(); setDrag(true); }}
                                onDragLeave={() => setDrag(false)}
                                onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
                            >
                                <Upload size={18} style={{ margin: "0 auto", color: "var(--text-3)" }} />
                                <p>Click to upload or drag & drop</p>
                                <small>PNG, JPG recommended</small>
                                <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => handleFile(e.target.files[0])} />
                            </div>
                        )}
                        {preview && (
                            <button className="btn btn-ghost" style={{ fontSize: 12, padding: "5px 10px", marginTop: 6 }} onClick={() => fileRef.current?.click()}>
                                <Upload size={12} /> Replace image
                                <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => handleFile(e.target.files[0])} />
                            </button>
                        )}
                    </div>
                </div>
                <div className="modal-ft">
                    <button className="btn btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
                        {saving
                            ? <><span className="spinner" style={{ width: 13, height: 13, borderTopColor: "#fff" }} /> Saving…</>
                            : <><Check size={13} /> {mode === "add" ? "Add Category" : "Save Changes"}</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Category Products Detail Modal ────────────────────────────────────────────
const DetailModal = ({ category, onClose, showToast }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const fetchDetail = async (pg = 1) => {
        setLoading(true);
        try {
            const res = await fetch(`${backend_api}/admin/category/${category.id}?page=${pg}&limit=6`, { credentials: "include" });
            const json = await res.json();
            if (res.ok) setData(json.data);
        } catch {
            showToast("Failed to load category details", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDetail(page); }, [page]);

    return (
        <div className="overlay">
            <div className="modal detail-modal" style={{ maxWidth: 680 }}>
                <div className="modal-hd">
                    <p className="modal-title">Category Details</p>
                    <button className="modal-close" onClick={onClose}><X size={17} /></button>
                </div>
                <div className="modal-body">
                    {loading && !data ? (
                        <div style={{ textAlign: "center", padding: 40 }}>
                            <span className="spinner" style={{ width: 24, height: 24 }} />
                        </div>
                    ) : data ? (
                        <>
                            <div className="detail-top">
                                {data.image
                                    ? <img src={data.image} alt={data.name} className="detail-cat-img" />
                                    : <div className="detail-cat-img-ph"><Layers size={28} /></div>}
                                <div style={{ flex: 1 }}>
                                    <p className="detail-name">{data.name}</p>
                                    <p className="detail-slug">{data.slug}</p>
                                    <p className="detail-desc">{data.description}</p>
                                    <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                                        <span className="badge badge-indigo"><Package size={10} /> {data.total_products} Products</span>
                                        <span className="badge" style={{ background: "var(--bg)", color: "var(--text-2)", border: "1px solid var(--border)" }}>
                                            {data.total_pages} Pages
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="detail-section-title">Products in this category</p>
                                {loading ? (
                                    <div style={{ textAlign: "center", padding: 20 }}>
                                        <span className="spinner" style={{ width: 18, height: 18 }} />
                                    </div>
                                ) : data.products?.length === 0 ? (
                                    <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text-3)", fontSize: 13 }}>
                                        No products in this category yet
                                    </div>
                                ) : (
                                    data.products.map(p => (
                                        <div key={p.id} className="prod-list-item">
                                            {p.images?.[0]
                                                ? <img src={p.images[0]} className="prod-list-img" alt={p.title} />
                                                : <div className="prod-list-img-ph"><ImageIcon size={14} /></div>}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p className="prod-list-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</p>
                                                <span className="slug-cell" style={{ marginTop: 2, display: "inline-block" }}>{p.unique_code}</span>
                                            </div>
                                            <p className="prod-list-price">₹{Number(p.price).toLocaleString()}</p>
                                        </div>
                                    ))
                                )}

                                {data.total_pages > 1 && (
                                    <div className="detail-pagination">
                                        <button className="page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                                            <ChevronLeft size={12} />
                                        </button>
                                        {[...Array(Math.min(data.total_pages, 5))].map((_, i) => (
                                            <button key={i + 1} className={`page-btn ${page === i + 1 ? "active" : ""}`} onClick={() => setPage(i + 1)}>
                                                {i + 1}
                                            </button>
                                        ))}
                                        <button className="page-btn" disabled={page >= data.total_pages} onClick={() => setPage(p => p + 1)}>
                                            <ChevronRight size={12} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : null}
                </div>
                <div className="modal-ft">
                    <button className="btn btn-ghost" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ─────────────────────────────────────────────────────────────
const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState([]);
    const [modal, setModal] = useState(null);       // null | {mode:"add"|"edit", category?}
    const [detailCat, setDetailCat] = useState(null);
    const [confirmDel, setConfirmDel] = useState(null);
    const [delLoading, setDelLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const toastTimer = useRef();

    const showToast = (message, type = "success") => {
        clearTimeout(toastTimer.current);
        setToast({ message, type });
        toastTimer.current = setTimeout(() => setToast(null), 3200);
    };

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${backend_api}/admin/category`, { credentials: "include" });
            const data = await res.json();
            if (res.ok) setCategories(data.data || []);
        } catch {
            showToast("Failed to load categories", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleDelete = async () => {
        if (!confirmDel?.length) return;
        setDelLoading(true);
        try {
            const res = await fetch(`${backend_api}/admin/category`, {
                method: "DELETE", credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category_id: confirmDel.length === 1 ? confirmDel[0] : confirmDel }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            const { hard_deleted = 0, soft_deleted = 0 } = data.summary || {};
            const parts = [];
            if (hard_deleted) parts.push(`${hard_deleted} deleted`);
            if (soft_deleted) parts.push(`${soft_deleted} deactivated`);
            showToast(parts.join(", ") || "Done", "success");
            setSelected([]); setConfirmDel(null);
            fetchCategories();
        } catch (err) {
            showToast(err.message || "Delete failed", "error");
        } finally {
            setDelLoading(false);
        }
    };

    const toggleSelect = (id) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
    const toggleAll = () => setSelected(selected.length === categories.length ? [] : categories.map(c => c.id));

    const filtered = categories.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.slug?.toLowerCase().includes(search.toLowerCase())
    );

    const totalProducts = categories.reduce((acc, c) => acc + (c.product_count || 0), 0);

    return (
        <div className="adc">
            <Styles />
            <Toast toast={toast} />

            {modal && (
                <CategoryModal
                    mode={modal.mode} category={modal.category}
                    onClose={() => setModal(null)}
                    onSuccess={() => { setModal(null); fetchCategories(); }}
                    showToast={showToast}
                />
            )}

            {detailCat && (
                <DetailModal
                    category={detailCat}
                    onClose={() => setDetailCat(null)}
                    showToast={showToast}
                />
            )}

            {confirmDel && (
                <ConfirmModal
                    ids={confirmDel} categories={categories}
                    onConfirm={handleDelete}
                    onClose={() => setConfirmDel(null)}
                    loading={delLoading}
                />
            )}

            <div className="adc-inner">

                {/* Header */}
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Categories</h1>
                        <p className="page-sub">Organise your product catalog into categories</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setModal({ mode: "add" })}>
                        <Plus size={15} /> Add Category
                    </button>
                </div>

                {/* Stats */}
                <div className="stats-row">
                    <div className="stat-card">
                        <p className="stat-label">Total Categories</p>
                        <p className="stat-value">{categories.length}</p>
                        <p className="stat-sub">Catalog groups</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">Total Products</p>
                        <p className="stat-value">{totalProducts || "—"}</p>
                        <p className="stat-sub">Across all categories</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">With Image</p>
                        <p className="stat-value">{categories.filter(c => c.image).length}</p>
                        <p className="stat-sub">Have cover photos</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">Filtered</p>
                        <p className="stat-value">{filtered.length}</p>
                        <p className="stat-sub">Matching current search</p>
                    </div>
                </div>

                {/* Bulk bar */}
                {selected.length > 0 && (
                    <div className="bulk-bar">
                        <p className="bulk-count">{selected.length} item{selected.length > 1 ? "s" : ""} selected</p>
                        <button className="btn btn-ghost" style={{ fontSize: 12, padding: "5px 10px" }} onClick={() => setSelected([])}>
                            <X size={12} /> Clear
                        </button>
                        <button className="btn btn-danger" style={{ fontSize: 12, padding: "5px 10px" }} onClick={() => setConfirmDel(selected)}>
                            <Trash2 size={12} /> Delete selected
                        </button>
                    </div>
                )}

                {/* Toolbar */}
                <div className="toolbar">
                    <div className="search-wrap">
                        <Search size={14} className="search-icon" />
                        <input className="search-input" placeholder="Search by name or slug…" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <button className="btn btn-ghost" onClick={fetchCategories} disabled={loading}>
                        <RefreshCw size={13} /> Refresh
                    </button>
                </div>

                {/* Table */}
                <div className="table-wrap">
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ width: 40 }}>
                                    <input type="checkbox" className="cb" checked={selected.length === categories.length && categories.length > 0} onChange={toggleAll} />
                                </th>
                                <th>Category</th>
                                <th>Slug</th>
                                <th>Description</th>
                                <th>Image</th>
                                <th style={{ width: 100 }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr className="loading-row">
                                    <td colSpan={6}>
                                        <span className="spinner" style={{ width: 22, height: 22 }} />
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="empty-state">
                                            <div className="empty-icon"><Layers size={20} /></div>
                                            <p className="empty-title">{search ? "No categories match your search" : "No categories yet"}</p>
                                            <p className="empty-sub">{search ? "Try a different keyword" : "Add your first category to get started"}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.map(c => (
                                <tr key={c.id}>
                                    <td>
                                        <input type="checkbox" className="cb" checked={selected.includes(c.id)} onChange={() => toggleSelect(c.id)} />
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            {c.image
                                                ? <img src={c.image} alt={c.name} className="cat-img" />
                                                : <div className="cat-img-ph"><Layers size={16} /></div>}
                                            <div>
                                                <p className="cat-name">{c.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="slug-cell">{c.slug}</span></td>
                                    <td><p className="cat-desc">{c.description || "—"}</p></td>
                                    <td>
                                        {c.image
                                            ? <span className="badge badge-indigo"><Check size={10} /> Yes</span>
                                            : <span style={{ fontSize: 12, color: "var(--text-3)" }}>—</span>}
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", gap: 4 }}>
                                            <button className="btn-icon view-btn" title="View products" onClick={() => setDetailCat(c)}>
                                                <Package size={14} />
                                            </button>
                                            <button className="btn-icon edit" title="Edit" onClick={() => setModal({ mode: "edit", category: c })}>
                                                <Edit2 size={14} />
                                            </button>
                                            <button className="btn-icon del" title="Delete" onClick={() => setConfirmDel([c.id])}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default AdminCategories;