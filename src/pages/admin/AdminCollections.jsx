import React, { useEffect, useState, useRef } from "react";
import {
    Plus, Search, Edit2, Trash2, X, Upload, Check,
    ChevronLeft, ChevronRight, AlertTriangle, RefreshCw,
    Image as ImageIcon, Layers, Package, PlusCircle, MinusCircle
} from "lucide-react";
import { backend_api } from "../../api";

// ─── Styles ────────────────────────────────────────────────────────────────────
const Styles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .adcol {
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

        .adcol-inner { max-width: 1280px; margin: 0 auto; padding: 32px 24px; }

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

        /* Cards grid */
        .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
        .col-card {
            background: var(--surface); border: 1px solid var(--border);
            border-radius: var(--radius-lg); overflow: hidden;
            box-shadow: var(--shadow-sm); transition: box-shadow 0.15s, border-color 0.15s;
            position: relative;
        }
        .col-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); border-color: var(--border2); }
        .col-card-check { position: absolute; top: 10px; left: 10px; z-index: 2; }
        .col-card-img { width: 100%; height: 148px; object-fit: cover; background: var(--bg); display: block; }
        .col-card-img-ph { width: 100%; height: 148px; background: var(--bg); display: flex; align-items: center; justify-content: center; color: var(--text-3); border-bottom: 1px solid var(--border); }
        .col-card-body { padding: 14px 16px; }
        .col-card-name { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .col-card-desc { font-size: 12px; color: var(--text-3); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 12px; }
        .col-card-footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border); padding: 10px 16px; }
        .col-card-actions { display: flex; gap: 4px; }

        /* Empty */
        .empty-state { padding: 64px 24px; text-align: center; }
        .empty-icon { width: 48px; height: 48px; background: var(--bg); border: 1px solid var(--border); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--text-3); margin: 0 auto 14px; }
        .empty-title { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
        .empty-sub { font-size: 13px; color: var(--text-3); }

        /* Spinner */
        .spinner { display: inline-block; border-radius: 50%; border: 2px solid var(--border2); border-top-color: var(--indigo); animation: spin 0.7s linear infinite; }
        @keyframes spin { to{transform:rotate(360deg)} }
        .loading-grid { display: flex; align-items: center; justify-content: center; padding: 64px; }

        /* Badge */
        .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 20px; font-size: 11px; font-weight: 500; }
        .badge-indigo { background: var(--indigo-lt); color: var(--indigo); }
        .badge-muted { background: var(--bg); color: var(--text-2); border: 1px solid var(--border); }

        /* Modal */
        .overlay { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; padding: 24px; backdrop-filter: blur(2px); animation: fadeIn 0.15s; }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .modal { background: var(--surface); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; animation: slideUp 0.18s ease; }
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
        .img-preview { position: relative; width: 100%; aspect-ratio: 16/7; border-radius: var(--radius); overflow: hidden; border: 1px solid var(--border); margin-bottom: 8px; }
        .img-preview img { width: 100%; height: 100%; object-fit: cover; }
        .img-preview-rm { position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.55); border: none; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #fff; transition: background 0.15s; }
        .img-preview-rm:hover { background: var(--red); }

        /* Product picker inside edit modal */
        .section-divider { font-size: 11px; font-weight: 600; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }
        .prod-search-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border); border-radius: var(--radius); font-size: 13px; color: var(--text); font-family: var(--ff); outline: none; transition: border-color 0.15s, box-shadow 0.15s; background: var(--bg); }
        .prod-search-input:focus { border-color: var(--indigo); box-shadow: 0 0 0 3px var(--indigo-lt); }
        .prod-pick-list { max-height: 200px; overflow-y: auto; border: 1px solid var(--border); border-radius: var(--radius); }
        .prod-pick-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-bottom: 1px solid var(--border); transition: background 0.1s; cursor: pointer; }
        .prod-pick-item:last-child { border-bottom: none; }
        .prod-pick-item:hover { background: var(--bg); }
        .prod-pick-img { width: 36px; height: 36px; border-radius: 6px; object-fit: cover; border: 1px solid var(--border); flex-shrink: 0; background: var(--bg); }
        .prod-pick-img-ph { width: 36px; height: 36px; border-radius: 6px; background: var(--bg); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--text-3); flex-shrink: 0; }
        .prod-pick-name { font-size: 12px; font-weight: 500; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .prod-pick-price { font-family: var(--ffm); font-size: 12px; color: var(--text-2); flex-shrink: 0; }
        .prod-pick-action { flex-shrink: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: none; cursor: pointer; transition: all 0.15s; }
        .prod-pick-action.add { background: var(--indigo-lt); color: var(--indigo); }
        .prod-pick-action.add:hover { background: var(--indigo); color: #fff; }
        .prod-pick-action.remove { background: var(--red-lt); color: var(--red); }
        .prod-pick-action.remove:hover { background: var(--red); color: #fff; }
        .prod-pick-action.in-col { background: var(--green-lt); color: var(--green); cursor: default; }

        /* Detail modal */
        .detail-modal { max-width: 680px; }
        .detail-top { display: flex; gap: 16px; align-items: flex-start; margin-bottom: 20px; }
        .detail-col-img { width: 100px; height: 72px; border-radius: 10px; object-fit: cover; border: 1px solid var(--border); flex-shrink: 0; }
        .detail-col-img-ph { width: 100px; height: 72px; border-radius: 10px; background: var(--bg); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--text-3); flex-shrink: 0; }
        .detail-name { font-size: 17px; font-weight: 600; margin-bottom: 4px; }
        .detail-desc { font-size: 13px; color: var(--text-2); line-height: 1.6; }
        .detail-section-title { font-size: 12px; font-weight: 600; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }
        .prod-list-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border); }
        .prod-list-item:last-child { border-bottom: none; }
        .prod-list-img { width: 40px; height: 40px; border-radius: 6px; object-fit: cover; border: 1px solid var(--border); flex-shrink: 0; }
        .prod-list-img-ph { width: 40px; height: 40px; border-radius: 6px; background: var(--bg); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--text-3); flex-shrink: 0; }
        .prod-list-name { flex: 1; font-size: 13px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .prod-list-price { font-family: var(--ffm); font-size: 13px; font-weight: 600; }
        .slug-cell { font-family: var(--ffm); font-size: 10px; color: var(--text-3); background: var(--bg); padding: 2px 6px; border-radius: 4px; border: 1px solid var(--border); }
        .detail-pagination { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 14px; }

        /* Confirm */
        .confirm-icon { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: none; margin-bottom: 12px; }
        .confirm-title { font-size: 15px; font-weight: 600; margin-bottom: 6px; }
        .confirm-text { font-size: 13px; color: var(--text-2); line-height: 1.6; }

        /* Pagination */
        .page-btn { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 6px; border: 1px solid var(--border); background: var(--surface); cursor: pointer; font-size: 12px; font-family: var(--ff); color: var(--text-2); transition: all 0.15s; }
        .page-btn:hover:not(:disabled) { border-color: var(--indigo); color: var(--indigo); background: var(--indigo-lt); }
        .page-btn.active { background: var(--indigo); color: #fff; border-color: var(--indigo); font-weight: 600; }
        .page-btn:disabled { opacity: 0.35; cursor: not-allowed; }

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
const ConfirmModal = ({ count, onConfirm, onClose, loading }) => (
    <div className="overlay">
        <div className="modal" style={{ maxWidth: 400 }}>
            <div className="modal-body">
                <div className="confirm-icon" style={{ background: "var(--red-lt)" }}>
                    <AlertTriangle size={20} color="var(--red)" />
                </div>
                <p className="confirm-title">Delete {count > 1 ? `${count} collections` : "this collection"}?</p>
                <p className="confirm-text">
                    This action cannot be undone. All product associations will also be removed.
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

// ─── Collection Form Modal (Add / Edit) ─────────────────────────────────────────
const CollectionModal = ({ mode, collection, onClose, onSuccess, showToast }) => {
    const [form, setForm] = useState({ name: collection?.name || "", description: collection?.description || "" });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(collection?.image || null);
    const [saving, setSaving] = useState(false);
    const [drag, setDrag] = useState(false);

    // Product management (edit mode only)
    const [collectionProducts, setCollectionProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [prodSearch, setProdSearch] = useState("");
    const [prodPage, setProdPage] = useState(1);
    const [prodTotalPages, setProdTotalPages] = useState(1);
    const [prodLoading, setProdLoading] = useState(false);
    const [toAdd, setToAdd] = useState([]);     // product ids to add
    const [toRemove, setToRemove] = useState([]); // product ids to remove

    const fileRef = useRef();

    // Fetch current products in collection
    const fetchCollectionProducts = async (pg = 1) => {
        if (mode !== "edit") return;
        setProdLoading(true);
        try {
            const res = await fetch(`${backend_api}/admin/collection/${collection.id}?page=${pg}&limit=50`, { credentials: "include" });
            const data = await res.json();
            if (res.ok) setCollectionProducts(data.data?.products || []);
        } catch { /* silent */ }
        finally { setProdLoading(false); }
    };

    // Fetch all products for picker
    const fetchAllProducts = async (pg = 1) => {
        try {
            const res = await fetch(`${backend_api}/admin/product?page=${pg}&limit=20`, { credentials: "include" });
            const data = await res.json();
            if (res.ok) {
                setAllProducts(data.data || []);
                setProdTotalPages(data.total_pages || 1);
                setProdPage(pg);
            }
        } catch { /* silent */ }
    };

    useEffect(() => {
        if (mode === "edit") { fetchCollectionProducts(); fetchAllProducts(); }
    }, []);

    const handleFile = (f) => {
        if (!f || !f.type.startsWith("image/")) return;
        setFile(f);
        if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
        setPreview(URL.createObjectURL(f));
    };

    const isInCollection = (pid) =>
        collectionProducts.some(p => p.id === pid) && !toRemove.includes(pid) || toAdd.includes(pid);

    const toggleProduct = (pid) => {
        const alreadyIn = collectionProducts.some(p => p.id === pid);
        if (alreadyIn) {
            if (toRemove.includes(pid)) setToRemove(p => p.filter(x => x !== pid));
            else setToRemove(p => [...p, pid]);
        } else {
            if (toAdd.includes(pid)) setToAdd(p => p.filter(x => x !== pid));
            else setToAdd(p => [...p, pid]);
        }
    };

    const handleSubmit = async () => {
        if (!form.name.trim() || !form.description.trim()) {
            showToast("Name and description are required", "error"); return;
        }
        setSaving(true);
        try {
            const fd = new FormData();
            fd.append("name", form.name.trim());
            fd.append("description", form.description.trim());
            if (file) fd.append("image", file);

            // Add / remove products via append for edit mode
            if (mode === "edit") {
                fd.append("add_product", JSON.stringify(toAdd));
                fd.append("remove_product", JSON.stringify(toRemove));
            }

            const url = mode === "add"
                ? `${backend_api}/admin/collection`
                : `${backend_api}/admin/collection/${collection.id}`;

            const res = await fetch(url, { method: mode === "add" ? "POST" : "PUT", credentials: "include", body: fd });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            showToast(mode === "add" ? "Collection created!" : "Collection updated!", "success");
            onSuccess();
        } catch (err) {
            showToast(err.message || "Something went wrong", "error");
        } finally {
            setSaving(false);
        }
    };

    const filteredProducts = allProducts.filter(p =>
        p.title?.toLowerCase().includes(prodSearch.toLowerCase())
    );

    return (
        <div className="overlay">
            <div className="modal" style={{ maxWidth: mode === "edit" ? 640 : 520 }}>
                <div className="modal-hd">
                    <p className="modal-title">{mode === "add" ? "New Collection" : "Edit Collection"}</p>
                    <button className="modal-close" onClick={onClose}><X size={17} /></button>
                </div>

                <div className="modal-body">
                    {/* Basic info */}
                    <div className="field">
                        <label className="field-label">Name *</label>
                        <input className="field-input" placeholder="Collection name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div className="field">
                        <label className="field-label">Description *</label>
                        <textarea className="field-textarea" placeholder="Describe this collection…" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                    </div>
                    <div className="field">
                        <label className="field-label">Cover Image</label>
                        {preview ? (
                            <>
                                <div className="img-preview">
                                    <img src={preview} alt="preview" />
                                    <button className="img-preview-rm" onClick={() => { setFile(null); setPreview(null); }}><X size={12} /></button>
                                </div>
                                <button className="btn btn-ghost" style={{ fontSize: 12, padding: "5px 10px" }} onClick={() => fileRef.current?.click()}>
                                    <Upload size={12} /> Replace image
                                    <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => handleFile(e.target.files[0])} />
                                </button>
                            </>
                        ) : (
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
                    </div>

                    {/* Product management — edit only */}
                    {mode === "edit" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <p className="section-divider">Manage Products</p>

                            {(toAdd.length > 0 || toRemove.length > 0) && (
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                    {toAdd.length > 0 && (
                                        <span className="badge badge-indigo">+{toAdd.length} to add</span>
                                    )}
                                    {toRemove.length > 0 && (
                                        <span className="badge" style={{ background: "var(--red-lt)", color: "var(--red)" }}>−{toRemove.length} to remove</span>
                                    )}
                                </div>
                            )}

                            <input
                                className="prod-search-input"
                                placeholder="Search products…"
                                value={prodSearch}
                                onChange={e => setProdSearch(e.target.value)}
                            />

                            {prodLoading ? (
                                <div style={{ textAlign: "center", padding: 16 }}>
                                    <span className="spinner" style={{ width: 18, height: 18 }} />
                                </div>
                            ) : (
                                <div className="prod-pick-list">
                                    {filteredProducts.length === 0 ? (
                                        <div style={{ padding: "14px", textAlign: "center", fontSize: 12, color: "var(--text-3)" }}>
                                            No products found
                                        </div>
                                    ) : filteredProducts.map(p => {
                                        const inCol = isInCollection(p.id);
                                        const pendingAdd = toAdd.includes(p.id);
                                        const pendingRemove = toRemove.includes(p.id);
                                        return (
                                            <div key={p.id} className="prod-pick-item">
                                                {p.images?.[0]
                                                    ? <img src={p.images[0]} className="prod-pick-img" alt={p.title} />
                                                    : <div className="prod-pick-img-ph"><ImageIcon size={13} /></div>}
                                                <p className="prod-pick-name">{p.title}</p>
                                                <p className="prod-pick-price">₹{Number(p.price).toLocaleString()}</p>
                                                <button
                                                    className={`prod-pick-action ${inCol ? (pendingRemove ? "add" : "remove") : (pendingAdd ? "remove" : "add")}`}
                                                    onClick={() => toggleProduct(p.id)}
                                                    title={inCol ? "Remove from collection" : "Add to collection"}
                                                >
                                                    {inCol
                                                        ? pendingRemove ? <PlusCircle size={14} /> : <MinusCircle size={14} />
                                                        : pendingAdd ? <MinusCircle size={14} /> : <PlusCircle size={14} />
                                                    }
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Product picker pagination */}
                            {prodTotalPages > 1 && (
                                <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
                                    <button className="page-btn" disabled={prodPage <= 1} onClick={() => fetchAllProducts(prodPage - 1)}>
                                        <ChevronLeft size={12} />
                                    </button>
                                    <span style={{ fontSize: 12, color: "var(--text-3)" }}>{prodPage} / {prodTotalPages}</span>
                                    <button className="page-btn" disabled={prodPage >= prodTotalPages} onClick={() => fetchAllProducts(prodPage + 1)}>
                                        <ChevronRight size={12} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="modal-ft">
                    <button className="btn btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
                        {saving
                            ? <><span className="spinner" style={{ width: 13, height: 13, borderTopColor: "#fff" }} /> Saving…</>
                            : <><Check size={13} /> {mode === "add" ? "Create Collection" : "Save Changes"}</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Collection Detail Modal ────────────────────────────────────────────────────
const DetailModal = ({ collection, onClose, showToast }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const fetchDetail = async (pg = 1) => {
        setLoading(true);
        try {
            const res = await fetch(`${backend_api}/admin/collection/${collection.id}?page=${pg}&limit=6`, { credentials: "include" });
            const json = await res.json();
            if (res.ok) setData(json.data);
        } catch {
            showToast("Failed to load collection details", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDetail(page); }, [page]);

    return (
        <div className="overlay">
            <div className="modal detail-modal" style={{ maxWidth: 660 }}>
                <div className="modal-hd">
                    <p className="modal-title">Collection Details</p>
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
                                {collection.image
                                    ? <img src={collection.image} className="detail-col-img" alt={collection.name} />
                                    : <div className="detail-col-img-ph"><Layers size={22} /></div>}
                                <div style={{ flex: 1 }}>
                                    <p className="detail-name">{data.collection}</p>
                                    <p className="detail-desc" style={{ marginTop: 4 }}>{collection.description}</p>
                                    <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                                        <span className="badge badge-indigo"><Package size={10} /> {data.pagination?.total_items || 0} Products</span>
                                        <span className="badge badge-muted">{data.pagination?.total_pages || 1} Pages</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="detail-section-title">Products in this collection</p>
                                {loading ? (
                                    <div style={{ textAlign: "center", padding: 20 }}>
                                        <span className="spinner" style={{ width: 18, height: 18 }} />
                                    </div>
                                ) : !data.products?.length ? (
                                    <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text-3)", fontSize: 13 }}>
                                        No products in this collection yet
                                    </div>
                                ) : (
                                    data.products.map(p => (
                                        <div key={p.id} className="prod-list-item">
                                            {p.images?.[0]
                                                ? <img src={p.images[0]} className="prod-list-img" alt={p.title} />
                                                : <div className="prod-list-img-ph"><ImageIcon size={14} /></div>}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p className="prod-list-name">{p.title}</p>
                                                <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
                                                    <span className="slug-cell">{p.unique_code}</span>
                                                    {p.category && <span className="badge badge-indigo" style={{ fontSize: 10 }}>{p.category}</span>}
                                                </div>
                                            </div>
                                            <p className="prod-list-price">₹{Number(p.price).toLocaleString()}</p>
                                        </div>
                                    ))
                                )}

                                {data.pagination?.total_pages > 1 && (
                                    <div className="detail-pagination">
                                        <button className="page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                                            <ChevronLeft size={12} />
                                        </button>
                                        {[...Array(Math.min(data.pagination.total_pages, 5))].map((_, i) => (
                                            <button key={i + 1} className={`page-btn ${page === i + 1 ? "active" : ""}`} onClick={() => setPage(i + 1)}>
                                                {i + 1}
                                            </button>
                                        ))}
                                        <button className="page-btn" disabled={page >= data.pagination.total_pages} onClick={() => setPage(p => p + 1)}>
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
const AdminCollections = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState([]);
    const [modal, setModal] = useState(null);
    const [detailCol, setDetailCol] = useState(null);
    const [confirmDel, setConfirmDel] = useState(null);
    const [delLoading, setDelLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const toastTimer = useRef();

    const showToast = (message, type = "success") => {
        clearTimeout(toastTimer.current);
        setToast({ message, type });
        toastTimer.current = setTimeout(() => setToast(null), 3200);
    };

    const fetchCollections = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${backend_api}/admin/collection`, { credentials: "include" });
            const data = await res.json();
            if (res.ok) setCollections(data.data || []);
        } catch {
            showToast("Failed to load collections", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCollections(); }, []);

    const handleDelete = async () => {
        if (!confirmDel?.length) return;
        setDelLoading(true);
        try {
            const res = await fetch(`${backend_api}/admin/collection`, {
                method: "DELETE", credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ collection_ids: confirmDel }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            showToast(`Deleted ${data.deleted_count || confirmDel.length} collection${confirmDel.length > 1 ? "s" : ""}`, "success");
            setSelected([]); setConfirmDel(null);
            fetchCollections();
        } catch (err) {
            showToast(err.message || "Delete failed", "error");
        } finally {
            setDelLoading(false);
        }
    };

    const toggleSelect = (id) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
    const toggleAll = () => setSelected(selected.length === collections.length ? [] : collections.map(c => c.id));

    const filtered = collections.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="adcol">
            <Styles />
            <Toast toast={toast} />

            {modal && (
                <CollectionModal
                    mode={modal.mode} collection={modal.collection}
                    onClose={() => setModal(null)}
                    onSuccess={() => { setModal(null); fetchCollections(); }}
                    showToast={showToast}
                />
            )}

            {detailCol && (
                <DetailModal
                    collection={detailCol}
                    onClose={() => setDetailCol(null)}
                    showToast={showToast}
                />
            )}

            {confirmDel && (
                <ConfirmModal
                    count={confirmDel.length}
                    onConfirm={handleDelete}
                    onClose={() => setConfirmDel(null)}
                    loading={delLoading}
                />
            )}

            <div className="adcol-inner">

                {/* Header */}
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Collections</h1>
                        <p className="page-sub">Group products into curated collections</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setModal({ mode: "add" })}>
                        <Plus size={15} /> New Collection
                    </button>
                </div>

                {/* Stats */}
                <div className="stats-row">
                    <div className="stat-card">
                        <p className="stat-label">Total Collections</p>
                        <p className="stat-value">{collections.length}</p>
                        <p className="stat-sub">Curated groups</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">With Cover</p>
                        <p className="stat-value">{collections.filter(c => c.image).length}</p>
                        <p className="stat-sub">Have cover images</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">Showing</p>
                        <p className="stat-value">{filtered.length}</p>
                        <p className="stat-sub">Matching search</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">Selected</p>
                        <p className="stat-value">{selected.length}</p>
                        <p className="stat-sub">For bulk action</p>
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
                        <input className="search-input" placeholder="Search collections…" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    {selected.length > 0 && (
                        <button className="btn btn-ghost" onClick={toggleAll}>
                            {selected.length === collections.length ? "Deselect all" : "Select all"}
                        </button>
                    )}
                    <button className="btn btn-ghost" onClick={fetchCollections} disabled={loading}>
                        <RefreshCw size={13} /> Refresh
                    </button>
                </div>

                {/* Cards */}
                {loading ? (
                    <div className="loading-grid">
                        <span className="spinner" style={{ width: 28, height: 28 }} />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon"><Layers size={20} /></div>
                        <p className="empty-title">{search ? "No collections match your search" : "No collections yet"}</p>
                        <p className="empty-sub">{search ? "Try a different keyword" : "Create your first collection to get started"}</p>
                    </div>
                ) : (
                    <div className="cards-grid">
                        {filtered.map(c => (
                            <div key={c.id} className="col-card">
                                {/* Checkbox */}
                                <div className="col-card-check">
                                    <input
                                        type="checkbox"
                                        style={{ width: 15, height: 15, accentColor: "var(--indigo)", cursor: "pointer" }}
                                        checked={selected.includes(c.id)}
                                        onChange={() => toggleSelect(c.id)}
                                    />
                                </div>

                                {/* Cover */}
                                {c.image
                                    ? <img src={c.image} className="col-card-img" alt={c.name} />
                                    : <div className="col-card-img-ph"><Layers size={28} /></div>}

                                {/* Body */}
                                <div className="col-card-body">
                                    <p className="col-card-name">{c.name}</p>
                                    <p className="col-card-desc">{c.description || "No description provided."}</p>
                                </div>

                                {/* Footer */}
                                <div className="col-card-footer">
                                    <span className="badge badge-muted" style={{ fontSize: 11 }}>
                                        #{c.id}
                                    </span>
                                    <div className="col-card-actions">
                                        <button className="btn-icon view-btn" title="View products" onClick={() => setDetailCol(c)}>
                                            <Package size={14} />
                                        </button>
                                        <button className="btn-icon edit" title="Edit" onClick={() => setModal({ mode: "edit", collection: c })}>
                                            <Edit2 size={14} />
                                        </button>
                                        <button className="btn-icon del" title="Delete" onClick={() => setConfirmDel([c.id])}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminCollections;