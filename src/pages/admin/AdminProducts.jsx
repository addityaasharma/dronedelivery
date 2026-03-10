import React, { useEffect, useState, useRef } from "react";
import {
    Plus, Search, Edit2, Trash2, X, Upload, Check,
    ChevronLeft, ChevronRight, Package, AlertTriangle,
    RefreshCw, Image as ImageIcon, Tag
} from "lucide-react";
import { backend_api } from "../../api";

const Styles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .adm {
            --bg:         #f5f5f4;
            --surface:    #ffffff;
            --border:     #e7e5e4;
            --border2:    #d6d3d1;
            --text:       #1c1917;
            --text-2:     #57534e;
            --text-3:     #a8a29e;
            --indigo:     #4f46e5;
            --indigo-lt:  #eef2ff;
            --indigo-bd:  #c7d2fe;
            --green:      #16a34a;
            --green-lt:   #f0fdf4;
            --red:        #dc2626;
            --red-lt:     #fef2f2;
            --shadow-sm:  0 1px 2px rgba(0,0,0,0.05);
            --shadow-lg:  0 12px 32px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06);
            --radius:     8px;
            --radius-lg:  12px;
            --ff:         'Geist', sans-serif;
            --ffm:        'Geist Mono', monospace;

            font-family: var(--ff);
            background: var(--bg);
            color: var(--text);
            min-height: 100vh;
            font-size: 14px;
            line-height: 1.5;
        }

        .adm-inner { max-width: 1280px; margin: 0 auto; padding: 32px 24px; }

        /* Header */
        .page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 28px; flex-wrap: wrap; }
        .page-title { font-size: 22px; font-weight: 600; letter-spacing: -0.3px; }
        .page-sub { font-size: 13px; color: var(--text-3); margin-top: 2px; }

        /* Stats */
        .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-bottom: 24px; }
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

        .prod-img { width: 44px; height: 44px; border-radius: 8px; object-fit: cover; border: 1px solid var(--border); background: var(--bg); flex-shrink: 0; }
        .prod-img-ph { width: 44px; height: 44px; border-radius: 8px; background: var(--bg); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--text-3); flex-shrink: 0; }
        .prod-name { font-weight: 500; color: var(--text); font-size: 13px; }
        .prod-desc { font-size: 12px; color: var(--text-3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 220px; margin-top: 2px; }

        .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 20px; font-size: 11px; font-weight: 500; }
        .badge-indigo { background: var(--indigo-lt); color: var(--indigo); }
        .price-cell { font-family: var(--ffm); font-size: 13px; font-weight: 600; }
        .code-cell { font-family: var(--ffm); font-size: 11px; color: var(--text-3); background: var(--bg); padding: 2px 7px; border-radius: 4px; border: 1px solid var(--border); }

        /* Bulk bar */
        .bulk-bar { display: flex; align-items: center; gap: 10px; padding: 10px 16px; background: var(--indigo-lt); border: 1px solid var(--indigo-bd); border-radius: var(--radius); margin-bottom: 12px; animation: slideDown 0.15s ease; }
        @keyframes slideDown { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:none} }
        .bulk-count { font-size: 13px; font-weight: 600; color: var(--indigo); flex: 1; }

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
        .field-input, .field-textarea, .field-select { padding: 9px 12px; border: 1px solid var(--border); border-radius: var(--radius); font-family: var(--ff); font-size: 13px; color: var(--text); background: var(--surface); outline: none; transition: border-color 0.15s, box-shadow 0.15s; width: 100%; }
        .field-input:focus, .field-textarea:focus, .field-select:focus { border-color: var(--indigo); box-shadow: 0 0 0 3px var(--indigo-lt); }
        .field-textarea { resize: vertical; min-height: 88px; line-height: 1.6; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        /* Upload */
        .upload-zone { border: 2px dashed var(--border2); border-radius: var(--radius); padding: 18px; text-align: center; cursor: pointer; transition: all 0.15s; background: var(--bg); }
        .upload-zone:hover, .upload-zone.drag { border-color: var(--indigo); background: var(--indigo-lt); }
        .upload-zone p { font-size: 13px; color: var(--text-3); margin-top: 6px; }
        .upload-zone small { font-size: 11px; color: var(--text-3); }
        .preview-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(72px,1fr)); gap: 8px; margin-bottom: 10px; }
        .preview-item { position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); }
        .preview-item img { width: 100%; height: 100%; object-fit: cover; }
        .preview-rm { position: absolute; top: 4px; right: 4px; background: rgba(0,0,0,0.55); border: none; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #fff; transition: background 0.15s; }
        .preview-rm:hover { background: var(--red); }

        /* Confirm */
        .confirm-icon { width: 42px; height: 42px; background: var(--red-lt); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--red); margin-bottom: 12px; }
        .confirm-title { font-size: 15px; font-weight: 600; margin-bottom: 6px; }
        .confirm-text { font-size: 13px; color: var(--text-2); line-height: 1.6; }

        /* Toast */
        .toast { position: fixed; bottom: 24px; right: 24px; z-index: 99999; padding: 11px 16px; border-radius: var(--radius); font-size: 13px; font-weight: 500; box-shadow: var(--shadow-lg); display: flex; align-items: center; gap: 8px; animation: toastIn 0.2s ease; max-width: 300px; color: #fff; }
        @keyframes toastIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
        .toast-success { background: var(--green); }
        .toast-error { background: var(--red); }

        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 99px; }
    `}</style>
);

const Toast = ({ toast }) => {
    if (!toast) return null;
    return (
        <div className={`toast toast-${toast.type}`}>
            {toast.type === "success" ? <Check size={14} /> : <AlertTriangle size={14} />}
            {toast.message}
        </div>
    );
};

const ConfirmModal = ({ ids, onConfirm, onClose, loading }) => (
    <div className="overlay">
        <div className="modal" style={{ maxWidth: 400 }}>
            <div className="modal-body">
                <div className="confirm-icon"><AlertTriangle size={20} /></div>
                <p className="confirm-title">Delete {ids.length > 1 ? `${ids.length} products` : "this product"}?</p>
                <p className="confirm-text">This action cannot be undone. {ids.length > 1 ? "These products" : "This product"} will be permanently removed.</p>
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

const ProductModal = ({ mode, product, categories, onClose, onSuccess, showToast }) => {
    const [form, setForm] = useState({
        title: product?.title || "",
        description: product?.description || "",
        price: product?.price || "",
        category_id: product?.category_id || "",
    });
    const [newFiles, setNewFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [existing, setExisting] = useState(product?.images || []);
    const [deletingIdx, setDeletingIdx] = useState(null);
    const [saving, setSaving] = useState(false);
    const [drag, setDrag] = useState(false);
    const fileRef = useRef();

    const addFiles = (files) => {
        const imgs = Array.from(files).filter(f => f.type.startsWith("image/"));
        setNewFiles(p => [...p, ...imgs]);
        setPreviews(p => [...p, ...imgs.map(f => URL.createObjectURL(f))]);
    };

    const removeNew = (i) => {
        URL.revokeObjectURL(previews[i]);
        setNewFiles(p => p.filter((_, idx) => idx !== i));
        setPreviews(p => p.filter((_, idx) => idx !== i));
    };

    const removeExisting = async (i) => {
        setDeletingIdx(i);
        try {
            const fd = new FormData();
            fd.append("delete", "true");
            fd.append("image_index", i);
            const res = await fetch(`${backend_api}/admin/product/${product.id}`, { method: "PUT", credentials: "include", body: fd });
            if (!res.ok) throw new Error();
            setExisting(p => p.filter((_, idx) => idx !== i));
            showToast("Image removed", "success");
        } catch {
            showToast("Failed to remove image", "error");
        } finally {
            setDeletingIdx(null);
        }
    };

    const handleSubmit = async () => {
        if (!form.title.trim() || !form.description.trim() || !form.price || !form.category_id) {
            showToast("Please fill all required fields", "error"); return;
        }
        setSaving(true);
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => fd.append(k, v));
            newFiles.forEach(f => fd.append("product_image", f));

            const url = mode === "add"
                ? `${backend_api}/admin/product`
                : `${backend_api}/admin/product/${product.id}`;

            const res = await fetch(url, { method: mode === "add" ? "POST" : "PUT", credentials: "include", body: fd });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            showToast(mode === "add" ? "Product added!" : "Product updated!", "success");
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
                    <p className="modal-title">{mode === "add" ? "Add Product" : "Edit Product"}</p>
                    <button className="modal-close" onClick={onClose}><X size={17} /></button>
                </div>

                <div className="modal-body">
                    <div className="field">
                        <label className="field-label">Title *</label>
                        <input className="field-input" placeholder="Product name" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
                    </div>

                    <div className="field">
                        <label className="field-label">Description *</label>
                        <textarea className="field-textarea" placeholder="Describe the product…" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                    </div>

                    <div className="field-row">
                        <div className="field">
                            <label className="field-label">Price (₹) *</label>
                            <input className="field-input" type="number" min="0" step="0.01" placeholder="0.00" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
                        </div>
                        <div className="field">
                            <label className="field-label">Category *</label>
                            <select className="field-select" value={form.category_id} onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))}>
                                <option value="">Select…</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="field">
                        <label className="field-label">Images</label>

                        {existing.length > 0 && (
                            <div className="preview-grid">
                                {existing.map((url, i) => (
                                    <div key={i} className="preview-item">
                                        <img src={url} alt="" />
                                        {mode === "edit" && (
                                            <button className="preview-rm" onClick={() => removeExisting(i)} disabled={deletingIdx === i}>
                                                {deletingIdx === i
                                                    ? <span className="spinner" style={{ width: 10, height: 10 }} />
                                                    : <X size={10} />}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {previews.length > 0 && (
                            <div className="preview-grid">
                                {previews.map((url, i) => (
                                    <div key={i} className="preview-item">
                                        <img src={url} alt="" />
                                        <button className="preview-rm" onClick={() => removeNew(i)}><X size={10} /></button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div
                            className={`upload-zone ${drag ? "drag" : ""}`}
                            onClick={() => fileRef.current?.click()}
                            onDragOver={e => { e.preventDefault(); setDrag(true); }}
                            onDragLeave={() => setDrag(false)}
                            onDrop={e => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
                        >
                            <Upload size={18} style={{ margin: "0 auto", color: "var(--text-3)" }} />
                            <p>Click to upload or drag & drop</p>
                            <small>PNG, JPG up to 10MB</small>
                            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={e => addFiles(e.target.files)} />
                        </div>
                    </div>
                </div>

                <div className="modal-ft">
                    <button className="btn btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
                        {saving
                            ? <><span className="spinner" style={{ width: 13, height: 13, borderTopColor: "#fff" }} /> Saving…</>
                            : <><Check size={13} /> {mode === "add" ? "Add Product" : "Save Changes"}</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState([]);
    const [modal, setModal] = useState(null);
    const [confirmDel, setConfirmDel] = useState(null);
    const [delLoading, setDelLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [categories, setCategories] = useState([]);
    const toastTimer = useRef();
    const limit = 10;

    const showToast = (message, type = "success") => {
        clearTimeout(toastTimer.current);
        setToast({ message, type });
        toastTimer.current = setTimeout(() => setToast(null), 3000);
    };

    const fetchProducts = async (pg = page) => {
        setLoading(true);
        try {
            const res = await fetch(`${backend_api}/admin/product?page=${pg}&limit=${limit}`, { credentials: "include" });
            const data = await res.json();
            if (res.ok) {
                setProducts(data.data || []);
                setTotalPages(data.total_pages || 1);
                setTotalProducts(data.total_products || 0);
            }
        } catch {
            showToast("Failed to load products", "error");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${backend_api}/admin/category`, { credentials: "include" });
            const data = await res.json();
            if (res.ok) setCategories(data.data || []);
        } catch { /* silent */ }
    };

    useEffect(() => { fetchProducts(page); }, [page]);
    useEffect(() => { fetchCategories(); }, []);

    const handleDelete = async () => {
        if (!confirmDel?.length) return;
        setDelLoading(true);
        try {
            const res = await fetch(`${backend_api}/admin/product`, {
                method: "DELETE", credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ product_ids: confirmDel }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            showToast(`Deleted ${confirmDel.length} product${confirmDel.length > 1 ? "s" : ""}`, "success");
            setSelected([]); setConfirmDel(null);
            fetchProducts(page);
        } catch (err) {
            showToast(err.message || "Delete failed", "error");
        } finally {
            setDelLoading(false);
        }
    };

    const toggleSelect = (id) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
    const toggleAll = () => setSelected(selected.length === products.length ? [] : products.map(p => p.id));

    const filtered = products.filter(p =>
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase())
    );

    const startItem = (page - 1) * limit + 1;
    const endItem = Math.min(page * limit, totalProducts);

    const pageNums = [];
    const maxPages = Math.min(totalPages, 7);
    for (let i = 1; i <= maxPages; i++) pageNums.push(i);

    return (
        <div className="adm">
            <Styles />
            <Toast toast={toast} />

            {modal && (
                <ProductModal
                    mode={modal.mode} product={modal.product} categories={categories}
                    onClose={() => setModal(null)}
                    onSuccess={() => { setModal(null); fetchProducts(page); }}
                    showToast={showToast}
                />
            )}

            {confirmDel && (
                <ConfirmModal ids={confirmDel} onConfirm={handleDelete} onClose={() => setConfirmDel(null)} loading={delLoading} />
            )}

            <div className="adm-inner">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Products</h1>
                        <p className="page-sub">Manage your product catalog</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setModal({ mode: "add" })}>
                        <Plus size={15} /> Add Product
                    </button>
                </div>

                <div className="stats-row">
                    <div className="stat-card">
                        <p className="stat-label">Total Products</p>
                        <p className="stat-value">{totalProducts}</p>
                        <p className="stat-sub">Across all categories</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">On This Page</p>
                        <p className="stat-value">{products.length}</p>
                        <p className="stat-sub">of {limit} per page</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">Total Pages</p>
                        <p className="stat-value">{totalPages}</p>
                        <p className="stat-sub">Current: {page}</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">Categories</p>
                        <p className="stat-value">{categories.length}</p>
                        <p className="stat-sub">Active</p>
                    </div>
                </div>

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

                <div className="toolbar">
                    <div className="search-wrap">
                        <Search size={14} className="search-icon" />
                        <input className="search-input" placeholder="Search by name or category…" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <button className="btn btn-ghost" onClick={() => fetchProducts(page)} disabled={loading}>
                        <RefreshCw size={13} /> Refresh
                    </button>
                </div>

                <div className="table-wrap">
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ width: 40 }}>
                                    <input type="checkbox" className="cb" checked={selected.length === products.length && products.length > 0} onChange={toggleAll} />
                                </th>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Code</th>
                                <th>Added</th>
                                <th style={{ width: 80 }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr className="loading-row">
                                    <td colSpan={7}>
                                        <span className="spinner" style={{ width: 22, height: 22 }} />
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7}>
                                        <div className="empty-state">
                                            <div className="empty-icon"><Package size={20} /></div>
                                            <p className="empty-title">{search ? "No products match your search" : "No products yet"}</p>
                                            <p className="empty-sub">{search ? "Try a different keyword" : "Add your first product to get started"}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.map(p => (
                                <tr key={p.id}>
                                    <td>
                                        <input type="checkbox" className="cb" checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} />
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            {p.images?.[0]
                                                ? <img src={p.images[0]} alt={p.title} className="prod-img" />
                                                : <div className="prod-img-ph"><ImageIcon size={16} /></div>}
                                            <div>
                                                <p className="prod-name">{p.title}</p>
                                                <p className="prod-desc">{p.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {p.category
                                            ? <span className="badge badge-indigo"><Tag size={10} />{p.category}</span>
                                            : <span style={{ color: "var(--text-3)", fontSize: 12 }}>—</span>}
                                    </td>
                                    <td><span className="price-cell">₹{Number(p.price).toLocaleString()}</span></td>
                                    <td><span className="code-cell">{p.unique_code}</span></td>
                                    <td style={{ fontSize: 12, color: "var(--text-3)" }}>
                                        {p.created_at ? new Date(p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", gap: 4 }}>
                                            <button className="btn-icon edit" title="Edit" onClick={() => setModal({ mode: "edit", product: p })}>
                                                <Edit2 size={14} />
                                            </button>
                                            <button className="btn-icon del" title="Delete" onClick={() => setConfirmDel([p.id])}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {!loading && totalPages > 1 && (
                        <div className="pagination">
                            <p className="pagination-info">
                                Showing {startItem}–{endItem} of {totalProducts} products
                            </p>
                            <div className="pagination-btns">
                                <button className="page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                                    <ChevronLeft size={13} />
                                </button>
                                {pageNums.map(pg => (
                                    <button key={pg} className={`page-btn ${page === pg ? "active" : ""}`} onClick={() => setPage(pg)}>
                                        {pg}
                                    </button>
                                ))}
                                {totalPages > 7 && <span style={{ fontSize: 12, color: "var(--text-3)", padding: "0 2px" }}>…</span>}
                                <button className="page-btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                                    <ChevronRight size={13} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminProducts;