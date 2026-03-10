import React, { useEffect, useState, useRef, useCallback } from "react";
import {
    Search, Send, RefreshCw, MessageSquare, User,
    AlertTriangle, Check, X, Inbox
} from "lucide-react";
import { backend_api } from "../../api";

// ─── Styles ────────────────────────────────────────────────────────────────────
const Styles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .sup {
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
            --amber:     #d97706;
            --amber-lt:  #fffbeb;
            --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
            --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
            --radius:    8px;
            --radius-lg: 12px;
            --ff:        'Geist', sans-serif;
            --ffm:       'Geist Mono', monospace;

            font-family: var(--ff);
            background: var(--bg);
            color: var(--text);
            height: 100vh;
            display: flex;
            flex-direction: column;
            font-size: 14px;
            line-height: 1.5;
            overflow: hidden;
        }

        .sup-topbar {
            padding: 16px 24px;
            background: var(--surface);
            border-bottom: 1px solid var(--border);
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-shrink: 0;
        }
        .sup-topbar-title { font-size: 16px; font-weight: 600; letter-spacing: -0.2px; display: flex; align-items: center; gap: 8px; }
        .sup-topbar-right { display: flex; align-items: center; gap: 8px; }

        .sup-layout {
            display: grid;
            grid-template-columns: 300px 1fr;
            flex: 1;
            overflow: hidden;
            min-height: 0;
        }
        @media (max-width: 768px) {
            .sup-layout { grid-template-columns: 1fr; }
            .sup-chat-panel { display: none; }
            .sup-layout.chat-open .sup-users-panel { display: none; }
            .sup-layout.chat-open .sup-chat-panel { display: flex; }
        }

        .sup-users-panel {
            border-right: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            background: var(--surface);
            overflow: hidden;
        }
        .sup-users-header {
            padding: 14px 16px;
            border-bottom: 1px solid var(--border);
            flex-shrink: 0;
        }
        .search-wrap { position: relative; }
        .search-icon { position: absolute; left: 9px; top: 50%; transform: translateY(-50%); color: var(--text-3); pointer-events: none; }
        .search-input {
            width: 100%; padding: 8px 10px 8px 30px;
            background: var(--bg); border: 1px solid var(--border);
            border-radius: var(--radius); font-size: 12px; color: var(--text);
            font-family: var(--ff); outline: none;
            transition: border-color 0.15s, box-shadow 0.15s;
        }
        .search-input::placeholder { color: var(--text-3); }
        .search-input:focus { border-color: var(--indigo); box-shadow: 0 0 0 3px var(--indigo-lt); }

        .sup-users-list { flex: 1; overflow-y: auto; }

        .user-item {
            display: flex; align-items: center; gap: 10px;
            padding: 12px 16px; cursor: pointer;
            border-bottom: 1px solid var(--border);
            transition: background 0.1s;
            position: relative;
        }
        .user-item:hover { background: #fafaf9; }
        .user-item.active { background: var(--indigo-lt); border-right: 2px solid var(--indigo); }
        .user-item:last-child { border-bottom: none; }

        .user-avatar {
            width: 36px; height: 36px; border-radius: 50%;
            background: var(--indigo-lt); color: var(--indigo);
            display: flex; align-items: center; justify-content: center;
            font-size: 13px; font-weight: 600; flex-shrink: 0;
        }
        .user-item.active .user-avatar { background: var(--indigo); color: #fff; }

        .user-info { flex: 1; min-width: 0; }
        .user-name { font-size: 13px; font-weight: 500; color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .user-preview { font-size: 11px; color: var(--text-3); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 1px; }
        .user-item.active .user-name { color: var(--indigo); }

        .user-time { font-size: 10px; color: var(--text-3); flex-shrink: 0; font-family: var(--ffm); }
        .unread-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--indigo); flex-shrink: 0; }

        .sup-chat-panel {
            display: flex; flex-direction: column;
            background: var(--bg); overflow: hidden;
        }

        .chat-header {
            padding: 14px 20px;
            background: var(--surface);
            border-bottom: 1px solid var(--border);
            display: flex; align-items: center; gap: 12px;
            flex-shrink: 0;
        }
        .chat-header-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--indigo-lt); color: var(--indigo); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; flex-shrink: 0; }
        .chat-header-name { font-size: 14px; font-weight: 600; color: var(--text); }
        .chat-header-email { font-size: 11px; color: var(--text-3); }

        .chat-messages {
            flex: 1; overflow-y: auto;
            padding: 20px 20px 12px;
            display: flex; flex-direction: column; gap: 8px;
        }

        /* 3 message types: user (left), system (center/muted), admin (right) */
        .msg-row { display: flex; align-items: flex-end; gap: 8px; }
        .msg-row.admin  { justify-content: flex-end; }
        .msg-row.user   { justify-content: flex-start; }
        .msg-row.system { justify-content: center; }

        .msg-bubble {
            max-width: 65%; padding: 9px 13px;
            border-radius: 16px; font-size: 13px; line-height: 1.5;
            word-break: break-word;
        }
        .msg-row.admin .msg-bubble {
            background: var(--indigo); color: #fff;
            border-bottom-right-radius: 4px;
        }
        .msg-row.user .msg-bubble {
            background: var(--surface); color: var(--text);
            border: 1px solid var(--border);
            border-bottom-left-radius: 4px;
            box-shadow: var(--shadow-sm);
        }
        .msg-row.system .msg-bubble {
            background: var(--amber-lt);
            color: var(--amber);
            border: 1px solid #fde68a;
            border-radius: 20px;
            font-size: 11px;
            padding: 5px 12px;
            max-width: 80%;
            text-align: center;
        }

        .msg-time { font-size: 10px; color: var(--text-3); flex-shrink: 0; margin-bottom: 2px; font-family: var(--ffm); }
        .msg-row.system .msg-time { display: none; }

        .date-divider {
            text-align: center; font-size: 11px; color: var(--text-3);
            font-weight: 500; margin: 6px 0;
            display: flex; align-items: center; gap: 8px;
        }
        .date-divider::before, .date-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }

        .chat-input-bar {
            padding: 12px 16px;
            background: var(--surface);
            border-top: 1px solid var(--border);
            display: flex; align-items: flex-end; gap: 10px;
            flex-shrink: 0;
        }
        .chat-textarea {
            flex: 1; padding: 9px 12px;
            border: 1px solid var(--border); border-radius: var(--radius);
            font-family: var(--ff); font-size: 13px; color: var(--text);
            background: var(--bg); outline: none; resize: none;
            min-height: 38px; max-height: 120px; line-height: 1.5;
            transition: border-color 0.15s, box-shadow 0.15s;
        }
        .chat-textarea:focus { border-color: var(--indigo); box-shadow: 0 0 0 3px var(--indigo-lt); }
        .chat-textarea::placeholder { color: var(--text-3); }

        .send-btn {
            width: 38px; height: 38px;
            background: var(--indigo); border: none; border-radius: var(--radius);
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; color: #fff; flex-shrink: 0;
            transition: background 0.15s;
        }
        .send-btn:hover { background: #4338ca; }
        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .empty-chat {
            flex: 1; display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            gap: 12px; color: var(--text-3);
        }
        .empty-chat-icon {
            width: 52px; height: 52px; background: var(--surface);
            border: 1px solid var(--border); border-radius: 14px;
            display: flex; align-items: center; justify-content: center;
        }
        .empty-chat p { font-size: 14px; font-weight: 500; color: var(--text-2); }
        .empty-chat span { font-size: 12px; }

        .btn { display: inline-flex; align-items: center; gap: 5px; padding: 7px 12px; border-radius: var(--radius); font-family: var(--ff); font-size: 12px; font-weight: 500; cursor: pointer; border: none; transition: all 0.15s; }
        .btn-ghost { background: transparent; color: var(--text-2); border: 1px solid var(--border); }
        .btn-ghost:hover { background: var(--bg); border-color: var(--border2); }
        .btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }

        .toast { position: fixed; bottom: 24px; right: 24px; z-index: 99999; padding: 11px 16px; border-radius: var(--radius); font-size: 13px; font-weight: 500; box-shadow: var(--shadow-md); display: flex; align-items: center; gap: 8px; animation: toastIn 0.2s ease; max-width: 320px; color: #fff; }
        @keyframes toastIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
        .toast-success { background: var(--green); }
        .toast-error   { background: var(--red); }

        .spinner { display: inline-block; border-radius: 50%; border: 2px solid var(--border2); border-top-color: var(--indigo); animation: spin 0.7s linear infinite; }
        @keyframes spin { to{transform:rotate(360deg)} }

        ::-webkit-scrollbar { width: 4px; height: 4px; }
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
    name.trim().split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?";

const formatTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const now = new Date();
    if (d.toDateString() === now.toDateString())
        return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const formatDateLabel = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return "Today";
    const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
};

const formatFullTime = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};

// Deduplicate users by user_id, keeping the entry with the latest last_message_time
const deduplicateUsers = (users) => {
    const map = new Map();
    users.forEach(u => {
        const existing = map.get(u.user_id);
        if (!existing || new Date(u.last_message_time) > new Date(existing.last_message_time)) {
            map.set(u.user_id, u);
        }
    });
    return Array.from(map.values());
};

const groupByDate = (messages) => {
    const groups = [];
    let currentDate = null;
    messages.forEach(msg => {
        const d = msg.created_at ? new Date(msg.created_at).toDateString() : null;
        if (d !== currentDate) {
            groups.push({ type: "date", label: formatDateLabel(msg.created_at) });
            currentDate = d;
        }
        groups.push({ type: "message", ...msg });
    });
    return groups;
};

// ─── Main Component ─────────────────────────────────────────────────────────────
const AdminSupport = () => {
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [msgLoading, setMsgLoading] = useState(false);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [toast, setToast] = useState(null);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const toastTimer = useRef();
    const pollTimer = useRef();
    const selectedUserRef = useRef(null); // stable ref for polling

    // keep ref in sync with state
    useEffect(() => { selectedUserRef.current = selectedUser; }, [selectedUser]);

    const showToast = (message, type = "success") => {
        clearTimeout(toastTimer.current);
        setToast({ message, type });
        toastTimer.current = setTimeout(() => setToast(null), 3000);
    };

    // ── Fetch user list (deduped) ──
    const fetchUsers = useCallback(async (silent = false) => {
        if (!silent) setUsersLoading(true);
        try {
            const res = await fetch(`${backend_api}/admin/support/users`, { credentials: "include" });
            const data = await res.json();
            if (res.ok) setUsers(deduplicateUsers(data.data || []));
        } catch {
            if (!silent) showToast("Failed to load conversations", "error");
        } finally {
            if (!silent) setUsersLoading(false);
        }
    }, []);

    // ── Fetch messages for a user ──
    const fetchMessages = useCallback(async (userId, silent = false) => {
        if (!userId) return;
        if (!silent) setMsgLoading(true);
        try {
            const res = await fetch(`${backend_api}/admin/support/chat/${userId}`, { credentials: "include" });
            const data = await res.json();
            if (res.ok) setMessages(data.data || []);
        } catch {
            if (!silent) showToast("Failed to load messages", "error");
        } finally {
            if (!silent) setMsgLoading(false);
        }
    }, []);

    // ── Initial load ──
    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    // ── Poll only messages for open chat (every 8s) ──
    useEffect(() => {
        clearInterval(pollTimer.current);
        if (selectedUser) {
            pollTimer.current = setInterval(() => {
                fetchMessages(selectedUserRef.current?.user_id, true);
            }, 8000);
        }
        return () => clearInterval(pollTimer.current);
    }, [selectedUser, fetchMessages]);

    // ── Scroll to bottom ──
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ── Select user ──
    const selectUser = (user) => {
        setSelectedUser(user);
        setMessages([]);
        setInput("");
        fetchMessages(user.user_id);
    };

    // ── Send message ──
    const sendMessage = async () => {
        const text = input.trim();
        if (!text || !selectedUser || sending) return;
        setSending(true);
        const optimistic = {
            id: `tmp-${Date.now()}`,
            message: text,
            type: "admin",
            created_at: new Date().toISOString(),
            _temp: true,
        };
        setMessages(p => [...p, optimistic]);
        setInput("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
        try {
            const res = await fetch(`${backend_api}/admin/support/chat`, {
                method: "POST", credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: selectedUser.user_id, message: text }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            await fetchMessages(selectedUser.user_id, true);
            fetchUsers(true);
        } catch (err) {
            showToast(err.message || "Failed to send", "error");
            setMessages(p => p.filter(m => m.id !== optimistic.id));
            setInput(text);
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    const filtered = users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    const grouped = groupByDate(messages);

    return (
        <div className="sup">
            <Styles />
            <Toast toast={toast} />

            {/* Top bar */}
            <div className="sup-topbar">
                <p className="sup-topbar-title">
                    <MessageSquare size={16} /> Support
                    {users.length > 0 && (
                        <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-3)", marginLeft: 4 }}>
                            {users.length} conversation{users.length !== 1 ? "s" : ""}
                        </span>
                    )}
                </p>
                <div className="sup-topbar-right">
                    <button
                        className="btn btn-ghost"
                        onClick={() => { fetchUsers(); if (selectedUser) fetchMessages(selectedUser.user_id); }}
                        disabled={usersLoading}
                    >
                        <RefreshCw size={12} /> Refresh
                    </button>
                </div>
            </div>

            {/* Main layout */}
            <div className={`sup-layout ${selectedUser ? "chat-open" : ""}`}>

                {/* ── Users list ── */}
                <div className="sup-users-panel">
                    <div className="sup-users-header">
                        <div className="search-wrap">
                            <Search size={12} className="search-icon" />
                            <input
                                className="search-input"
                                placeholder="Search conversations…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="sup-users-list">
                        {usersLoading ? (
                            <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
                                <span className="spinner" style={{ width: 20, height: 20 }} />
                            </div>
                        ) : filtered.length === 0 ? (
                            <div style={{ padding: "40px 16px", textAlign: "center", color: "var(--text-3)" }}>
                                <Inbox size={24} style={{ margin: "0 auto 8px" }} />
                                <p style={{ fontSize: 13 }}>{search ? "No results" : "No conversations yet"}</p>
                            </div>
                        ) : filtered.map(u => (
                            <div
                                key={u.user_id}
                                className={`user-item ${selectedUser?.user_id === u.user_id ? "active" : ""}`}
                                onClick={() => selectUser(u)}
                            >
                                <div className="user-avatar">{initials(u.name || u.email)}</div>
                                <div className="user-info">
                                    <p className="user-name">{u.name || "Unknown"}</p>
                                    <p className="user-preview">
                                        {u.last_message_type === "admin" && (
                                            <span style={{ color: "var(--indigo)", fontWeight: 500, marginRight: 3 }}>You:</span>
                                        )}
                                        {u.last_message_type === "system" && (
                                            <span style={{ color: "var(--text-3)", fontWeight: 500, marginRight: 3 }}>Bot:</span>
                                        )}
                                        {u.last_message}
                                    </p>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                                    <p className="user-time">{formatTime(u.last_message_time)}</p>
                                    {u.last_message_type === "user" && selectedUser?.user_id !== u.user_id && (
                                        <span className="unread-dot" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Chat panel ── */}
                <div className="sup-chat-panel">
                    {!selectedUser ? (
                        <div className="empty-chat">
                            <div className="empty-chat-icon"><MessageSquare size={22} color="var(--text-3)" /></div>
                            <p>Select a conversation</p>
                            <span>Choose a user from the list to view messages</span>
                        </div>
                    ) : (
                        <>
                            {/* Chat header */}
                            <div className="chat-header">
                                <div className="chat-header-avatar">{initials(selectedUser.name || selectedUser.email)}</div>
                                <div style={{ flex: 1 }}>
                                    <p className="chat-header-name">{selectedUser.name || "Unknown"}</p>
                                    <p className="chat-header-email">{selectedUser.email}</p>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "var(--ffm)" }}>
                                        ID #{selectedUser.user_id}
                                    </span>
                                    <button
                                        className="btn btn-ghost"
                                        style={{ padding: "5px 8px", fontSize: 11 }}
                                        onClick={() => setSelectedUser(null)}
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="chat-messages">
                                {msgLoading ? (
                                    <div style={{ display: "flex", justifyContent: "center", paddingTop: 40 }}>
                                        <span className="spinner" style={{ width: 22, height: 22 }} />
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--text-3)" }}>
                                        <MessageSquare size={20} />
                                        <p style={{ fontSize: 13 }}>No messages yet</p>
                                    </div>
                                ) : grouped.map((item, i) => (
                                    item.type === "date" ? (
                                        <div key={`date-${i}`} className="date-divider">{item.label}</div>
                                    ) : (
                                        <div key={item.id ?? i} className={`msg-row ${item.type}`}>
                                            {item.type === "user" && (
                                                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--bg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginBottom: 2 }}>
                                                    <User size={12} color="var(--text-3)" />
                                                </div>
                                            )}
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: item.type === "admin" ? "flex-end" : item.type === "system" ? "center" : "flex-start", gap: 2 }}>
                                                <div className={`msg-bubble${item._temp ? " sending" : ""}`} style={item._temp ? { opacity: 0.6 } : {}}>
                                                    {item.message}
                                                </div>
                                                {item.type !== "system" && (
                                                    <p className="msg-time">{formatFullTime(item.created_at)}</p>
                                                )}
                                            </div>
                                        </div>
                                    )
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input bar */}
                            <div className="chat-input-bar">
                                <textarea
                                    ref={textareaRef}
                                    className="chat-textarea"
                                    placeholder="Type a reply… (Enter to send, Shift+Enter for new line)"
                                    value={input}
                                    onChange={e => {
                                        setInput(e.target.value);
                                        e.target.style.height = "auto";
                                        e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                                    }}
                                    onKeyDown={handleKeyDown}
                                    rows={1}
                                    disabled={sending}
                                />
                                <button className="send-btn" onClick={sendMessage} disabled={!input.trim() || sending}>
                                    {sending
                                        ? <span className="spinner" style={{ width: 14, height: 14, borderTopColor: "#fff" }} />
                                        : <Send size={15} />}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSupport;