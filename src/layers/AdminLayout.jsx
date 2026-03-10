import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Tag,
    Layers,
    ChevronLeft,
    ChevronRight,
    Monitor
} from "lucide-react";

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);

    const menu = [
        { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Products", path: "/admin/products", icon: Package },
        { name: "Category", path: "/admin/category", icon: Tag },
        { name: "Collection", path: "/admin/collection", icon: Layers },
        { name: "Drones", path: "/admin/drones", icon: ShoppingCart },
        { name: "Support", path: "/admin/support", icon: Users },
    ];

    return (
        <>
            <div className="admin-mobile-block">
                <Monitor size={40} strokeWidth={1.5} />
                <p>Admin panel is only available on desktop.</p>
                <span>Please open this page on a screen wider than 1024px.</span>
            </div>

            <div className="admin-layout">
                <style>{`
                    /* Block on small screens */
                    .admin-mobile-block {
                        display: none;
                        height: 100vh;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        gap: 12px;
                        background: #f8fafc;
                        color: #64748b;
                        padding: 24px;
                        text-align: center;
                        font-family: system-ui, sans-serif;
                    }
                    .admin-mobile-block p  { font-size: 16px; font-weight: 600; color: #1e293b; }
                    .admin-mobile-block span { font-size: 13px; }

                    @media (max-width: 1023px) {
                        .admin-mobile-block { display: flex; }
                        .admin-layout       { display: none !important; }
                    }

                    /* Layout shell */
                    .admin-layout {
                        display: flex;
                        height: 100vh;
                        background: #f1f5f9;
                        overflow: hidden;
                    }

                    /* ── Sidebar ── */
                    .admin-sidebar {
                        display: flex;
                        flex-direction: column;
                        background: #0f172a;
                        transition: width 0.25s ease;
                        flex-shrink: 0;
                        position: relative;
                        z-index: 10;
                    }
                    .admin-sidebar.expanded { width: 220px; }
                    .admin-sidebar.collapsed { width: 64px; }

                    /* Brand */
                    .admin-brand {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        padding: 0 16px;
                        height: 64px;
                        border-bottom: 1px solid rgba(255,255,255,0.07);
                        overflow: hidden;
                        flex-shrink: 0;
                    }
                    .admin-brand-dot {
                        width: 32px; height: 32px; border-radius: 9px;
                        background: #3b82f6;
                        display: flex; align-items: center; justify-content: center;
                        font-size: 14px; font-weight: 800; color: #fff;
                        flex-shrink: 0;
                    }
                    .admin-brand-name {
                        font-size: 15px; font-weight: 700; color: #fff;
                        white-space: nowrap; overflow: hidden;
                        transition: opacity 0.2s, width 0.2s;
                    }
                    .admin-sidebar.collapsed .admin-brand-name { opacity: 0; width: 0; }

                    /* Nav */
                    .admin-nav { flex: 1; padding: 12px 8px; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; overflow-x: hidden; }
                    .admin-nav::-webkit-scrollbar { width: 0; }

                    .admin-nav-link {
                        display: flex; align-items: center; gap: 10px;
                        padding: 10px; border-radius: 8px;
                        text-decoration: none;
                        color: #94a3b8;
                        font-size: 13px; font-weight: 500;
                        transition: background 0.15s, color 0.15s;
                        white-space: nowrap; overflow: hidden;
                    }
                    .admin-nav-link:hover { background: rgba(255,255,255,0.06); color: #e2e8f0; }
                    .admin-nav-link.active { background: #1d4ed8; color: #fff; }
                    .admin-nav-link svg { flex-shrink: 0; }

                    .admin-nav-label {
                        transition: opacity 0.2s;
                        overflow: hidden;
                    }
                    .admin-sidebar.collapsed .admin-nav-label { opacity: 0; width: 0; }

                    /* Collapse toggle */
                    .admin-collapse-btn {
                        margin: 8px; padding: 9px;
                        background: rgba(255,255,255,0.05);
                        border: none; border-radius: 8px; cursor: pointer;
                        color: #64748b; display: flex; align-items: center; justify-content: center;
                        transition: background 0.15s, color 0.15s;
                        flex-shrink: 0;
                    }
                    .admin-collapse-btn:hover { background: rgba(255,255,255,0.1); color: #e2e8f0; }

                    /* ── Main area ── */
                    .admin-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }

                    .admin-topbar {
                        height: 64px; background: #fff;
                        border-bottom: 1px solid #e2e8f0;
                        display: flex; align-items: center; justify-content: space-between;
                        padding: 0 24px; flex-shrink: 0;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.04);
                    }
                    .admin-topbar-title { font-size: 15px; font-weight: 600; color: #0f172a; }
                    .admin-topbar-right { display: flex; align-items: center; gap: 10px; }
                    .admin-welcome {
                        font-size: 12px; color: #64748b;
                        background: #f1f5f9; border: 1px solid #e2e8f0;
                        padding: 5px 12px; border-radius: 20px;
                    }

                    .admin-content { flex: 1; overflow-y: auto; }
                    .admin-content::-webkit-scrollbar { width: 5px; }
                    .admin-content::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
                `}</style>

                <aside className={`admin-sidebar ${collapsed ? "collapsed" : "expanded"}`}>
                    <div className="admin-brand">
                        <div className="admin-brand-dot">N</div>
                        <span className="admin-brand-name">No Wheels</span>
                    </div>

                    <nav className="admin-nav">
                        {menu.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    title={collapsed ? item.name : undefined}
                                    className={({ isActive }) =>
                                        `admin-nav-link${isActive ? " active" : ""}`
                                    }
                                >
                                    <Icon size={18} />
                                    <span className="admin-nav-label">{item.name}</span>
                                </NavLink>
                            );
                        })}
                    </nav>

                    <button
                        className="admin-collapse-btn"
                        onClick={() => setCollapsed(c => !c)}
                        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>
                </aside>

                <main className="admin-main">
                    <div className="admin-topbar">
                        <p className="admin-topbar-title">Admin Panel</p>
                        <div className="admin-topbar-right">
                            <span className="admin-welcome">Welcome, Admin</span>
                        </div>
                    </div>

                    <div className="admin-content">
                        <Outlet />
                    </div>
                </main>
            </div>
        </>
    );
};

export default AdminLayout;