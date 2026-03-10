import React, { useEffect, useState, useRef, useCallback } from "react";
import {
    MessageCircle, Send, ChevronRight, Package, RefreshCw,
    CreditCard, HelpCircle, ArrowLeft,
    Check, Loader, Headphones, Truck, RotateCcw
} from "lucide-react";
import { backend_api } from "../../../api";

// ─── Styles ────────────────────────────────────────────────────────────────────
const Styles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .sc {
            --bg:         #fafaf9;
            --surface:    #ffffff;
            --surface2:   #f5f5f4;
            --border:     #e8e4e0;
            --text:       #1c1917;
            --text-2:     #6b5e52;
            --text-3:     #b5a99f;
            --brand:      #f97316;
            --brand-dk:   #ea6c0a;
            --brand-lt:   #fff7ed;
            --brand-bd:   #fed7aa;
            --system:     #6366f1;
            --system-lt:  #eef2ff;
            --green:      #16a34a;
            --green-lt:   #f0fdf4;
            --shadow-sm:  0 1px 3px rgba(0,0,0,0.06);
            --shadow:     0 4px 16px rgba(0,0,0,0.08);
            --shadow-lg:  0 8px 32px rgba(0,0,0,0.1);
            --radius:     12px;
            --radius-lg:  18px;
            --ff:         'Nunito', sans-serif;
            --ffm:        'JetBrains Mono', monospace;

            font-family: var(--ff);
            background: var(--bg);
            color: var(--text);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            font-size: 15px;
        }

        .sc-header {
            background: var(--surface);
            border-bottom: 1px solid var(--border);
            padding: 0 20px;
            display: flex; align-items: center; gap: 14px;
            height: 60px;
            position: sticky; top: 0; z-index: 10;
            flex-shrink: 0;
        }
        .sc-header-icon {
            width: 38px; height: 38px; border-radius: 10px;
            background: var(--brand-lt); border: 1px solid var(--brand-bd);
            display: flex; align-items: center; justify-content: center;
            color: var(--brand);
        }
        .sc-header-title { font-size: 16px; font-weight: 800; color: var(--text); }
        .sc-header-sub { font-size: 12px; color: var(--text-3); margin-top: 1px; }
        .sc-header-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }
        .online-pill { display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; color: var(--green); background: var(--green-lt); padding: 3px 10px; border-radius: 20px; }
        .online-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); }

        .sc-body {
            flex: 1; display: flex; flex-direction: column;
            max-width: 680px; width: 100%; margin: 0 auto;
            padding: 0; overflow: hidden;
        }

        .welcome-screen {
            flex: 1; padding: 28px 20px;
            overflow-y: auto;
            animation: fadeUp 0.3s ease;
        }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }

        .welcome-hero {
            text-align: center; padding: 24px 16px 28px;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: var(--radius-lg);
            margin-bottom: 20px;
            box-shadow: var(--shadow-sm);
        }
        .welcome-avatar {
            width: 64px; height: 64px; border-radius: 18px;
            background: var(--brand-lt); border: 2px solid var(--brand-bd);
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 14px; color: var(--brand);
        }
        .welcome-title { font-size: 20px; font-weight: 800; color: var(--text); margin-bottom: 6px; }
        .welcome-sub { font-size: 14px; color: var(--text-2); line-height: 1.6; max-width: 300px; margin: 0 auto; }

        .section-label {
            font-size: 11px; font-weight: 700; color: var(--text-3);
            text-transform: uppercase; letter-spacing: 0.8px;
            margin-bottom: 10px; padding-left: 2px;
        }

        .options-grid { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }

        .option-card {
            display: flex; align-items: center; gap: 14px;
            padding: 14px 16px;
            background: var(--surface); border: 1px solid var(--border);
            border-radius: var(--radius); cursor: pointer;
            transition: all 0.15s; box-shadow: var(--shadow-sm);
        }
        .option-card:hover { border-color: var(--brand-bd); box-shadow: var(--shadow); transform: translateY(-1px); }
        .option-card:active { transform: translateY(0); }
        .option-icon {
            width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
            display: flex; align-items: center; justify-content: center;
        }
        .option-text { flex: 1; }
        .option-label { font-size: 14px; font-weight: 700; color: var(--text); }
        .option-desc { font-size: 12px; color: var(--text-3); margin-top: 1px; }
        .option-arrow { color: var(--text-3); flex-shrink: 0; }

        .other-option {
            display: flex; align-items: center; gap: 10px;
            padding: 12px 14px;
            background: var(--surface2); border: 1px dashed var(--border);
            border-radius: var(--radius); cursor: pointer;
            transition: all 0.15s; font-size: 13px; font-weight: 600; color: var(--text-2);
        }
        .other-option:hover { border-color: var(--brand-bd); color: var(--brand); background: var(--brand-lt); }

        .chat-screen {
            flex: 1; display: flex; flex-direction: column;
            overflow: hidden; animation: fadeUp 0.25s ease;
        }

        .chat-context-bar {
            display: flex; align-items: center; gap: 10px;
            padding: 10px 16px; background: var(--brand-lt);
            border-bottom: 1px solid var(--brand-bd);
            flex-shrink: 0;
        }
        .chat-context-icon { width: 28px; height: 28px; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .chat-context-label { font-size: 13px; font-weight: 700; color: var(--brand-dk); flex: 1; }
        .chat-context-sub { font-size: 11px; color: var(--brand); }
        .back-btn {
            display: flex; align-items: center; gap: 5px;
            font-size: 12px; font-weight: 600; color: var(--text-2);
            background: none; border: none; cursor: pointer;
            padding: 5px 8px; border-radius: 8px; transition: all 0.15s;
        }
        .back-btn:hover { background: rgba(0,0,0,0.05); color: var(--text); }

        .chat-messages {
            flex: 1; overflow-y: auto;
            padding: 16px; display: flex; flex-direction: column; gap: 10px;
        }

        .date-div {
            text-align: center; font-size: 11px; font-weight: 600; color: var(--text-3);
            display: flex; align-items: center; gap: 8px; margin: 4px 0;
        }
        .date-div::before, .date-div::after { content: ''; flex: 1; height: 1px; background: var(--border); }

        .msg-wrap { display: flex; flex-direction: column; }
        .msg-wrap.user { align-items: flex-end; }
        .msg-wrap.system, .msg-wrap.admin { align-items: flex-start; }

        .msg-sender {
            font-size: 10px; font-weight: 700; text-transform: uppercase;
            letter-spacing: 0.5px; margin-bottom: 4px; padding-left: 2px;
        }
        .msg-wrap.system .msg-sender { color: var(--system); }
        .msg-wrap.admin  .msg-sender { color: var(--brand); }

        .msg-bubble {
            max-width: 75%; padding: 10px 14px;
            font-size: 14px; line-height: 1.55; word-break: break-word;
            position: relative;
        }
        .msg-wrap.user   .msg-bubble { background: var(--brand); color: #fff; border-radius: 18px 18px 4px 18px; }
        .msg-wrap.system .msg-bubble { background: var(--surface); border: 1px solid var(--border); color: var(--text); border-radius: 18px 18px 18px 4px; box-shadow: var(--shadow-sm); }
        .msg-wrap.admin  .msg-bubble { background: var(--brand-lt); border: 1px solid var(--brand-bd); color: var(--text); border-radius: 18px 18px 18px 4px; }

        .msg-bubble.sending { opacity: 0.6; }

        .msg-time { font-size: 10px; color: var(--text-3); margin-top: 3px; padding: 0 2px; }

        .order-input-card {
            background: var(--surface2); border: 1px dashed var(--border);
            border-radius: var(--radius); padding: 14px; max-width: 320px;
            animation: fadeUp 0.2s ease;
        }
        .order-input-label { font-size: 12px; font-weight: 700; color: var(--text-2); margin-bottom: 8px; }
        .order-input-field {
            width: 100%; padding: 9px 12px;
            border: 1px solid var(--border); border-radius: 9px;
            font-family: var(--ffm); font-size: 13px; color: var(--text);
            background: var(--surface); outline: none;
            transition: border-color 0.15s, box-shadow 0.15s;
            margin-bottom: 8px;
        }
        .order-input-field:focus { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-lt); }
        .order-submit-btn {
            width: 100%; padding: 9px; border-radius: 9px; border: none;
            background: var(--brand); color: #fff;
            font-family: var(--ff); font-size: 13px; font-weight: 700;
            cursor: pointer; transition: background 0.15s;
            display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .order-submit-btn:hover { background: var(--brand-dk); }
        .order-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .typing-indicator {
            display: flex; align-items: center; gap: 4px;
            padding: 10px 14px; background: var(--surface);
            border: 1px solid var(--border); border-radius: 18px 18px 18px 4px;
            width: fit-content; box-shadow: var(--shadow-sm);
        }
        .typing-dot {
            width: 7px; height: 7px; border-radius: 50%;
            background: var(--text-3); animation: typingBounce 1.2s infinite;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typingBounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }

        .chat-input-bar {
            padding: 12px 16px; background: var(--surface);
            border-top: 1px solid var(--border);
            display: flex; align-items: flex-end; gap: 10px;
            flex-shrink: 0;
        }
        .chat-textarea {
            flex: 1; padding: 10px 14px;
            border: 1.5px solid var(--border); border-radius: 24px;
            font-family: var(--ff); font-size: 14px; color: var(--text);
            background: var(--surface2); outline: none; resize: none;
            min-height: 42px; max-height: 100px; line-height: 1.5;
            transition: border-color 0.15s, box-shadow 0.15s;
        }
        .chat-textarea:focus { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-lt); background: var(--surface); }
        .chat-textarea::placeholder { color: var(--text-3); }
        .chat-textarea:disabled { opacity: 0.5; cursor: not-allowed; }
        .send-btn {
            width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0;
            background: var(--brand); border: none; cursor: pointer; color: #fff;
            display: flex; align-items: center; justify-content: center;
            transition: all 0.15s; box-shadow: 0 2px 8px rgba(249,115,22,0.3);
        }
        .send-btn:hover { background: var(--brand-dk); transform: scale(1.05); }
        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }

        .spinner { display: inline-block; border-radius: 50%; border: 2px solid var(--border); border-top-color: var(--brand); animation: spin 0.7s linear infinite; }
        @keyframes spin { to{transform:rotate(360deg)} }
        .loading-screen { flex: 1; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 12px; color: var(--text-3); }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
    `}</style>
);

// ─── Support Options Config ────────────────────────────────────────────────────
const SUPPORT_OPTIONS = [
    {
        id: 1,
        label: "Order not delivered",
        desc: "Track your delivery or report a missing parcel",
        icon: <Truck size={18} />,
        iconBg: "#fff7ed", iconColor: "#f97316",
        needsOrderId: true,
    },
    {
        id: 2,
        label: "Request a refund",
        desc: "Initiate a refund for a cancelled or returned order",
        icon: <RotateCcw size={18} />,
        iconBg: "#f0fdf4", iconColor: "#16a34a",
        needsOrderId: true,
    },
    {
        id: 3,
        label: "Wrong product received",
        desc: "Report if you received the wrong item",
        icon: <Package size={18} />,
        iconBg: "#fef2f2", iconColor: "#dc2626",
        needsOrderId: false,
    },
    {
        id: 4,
        label: "Payment issue",
        desc: "Resolve a failed payment or billing concern",
        icon: <CreditCard size={18} />,
        iconBg: "#eef2ff", iconColor: "#4f46e5",
        needsOrderId: true,
    },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
const formatTime = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};

const formatDateLabel = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return "Today";
    const y = new Date(now); y.setDate(now.getDate() - 1);
    if (d.toDateString() === y.toDateString()) return "Yesterday";
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "long" });
};

const groupByDate = (msgs) => {
    const groups = []; let cur = null;
    msgs.forEach(m => {
        const d = m.created_at ? new Date(m.created_at).toDateString() : null;
        if (d !== cur) { groups.push({ type: "date", label: formatDateLabel(m.created_at) }); cur = d; }
        groups.push({ type: "msg", ...m });
    });
    return groups;
};

// ─── Order ID Input Card ────────────────────────────────────────────────────────
const OrderIdCard = ({ onSubmit, loading }) => {
    const [val, setVal] = useState("");
    return (
        <div className="order-input-card">
            <p className="order-input-label">Enter your Order ID</p>
            <input
                className="order-input-field"
                placeholder="e.g. ORD-20240101-XXXX"
                value={val}
                onChange={e => setVal(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && val.trim()) onSubmit(val.trim()); }}
                disabled={loading}
            />
            <button
                className="order-submit-btn"
                onClick={() => val.trim() && onSubmit(val.trim())}
                disabled={!val.trim() || loading}
            >
                {loading
                    ? <span className="spinner" style={{ width: 14, height: 14, borderTopColor: "#fff" }} />
                    : <><Check size={14} /> Submit</>
                }
            </button>
        </div>
    );
};

// ─── Main Component ─────────────────────────────────────────────────────────────
const UserSupport = () => {
    const [view, setView] = useState("welcome");
    const [messages, setMessages] = useState([]);
    const [loadingMsgs, setLoadingMsgs] = useState(false);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [typing, setTyping] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [awaitingOrderId, setAwaitingOrderId] = useState(false);
    const [orderLoading, setOrderLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    // ── Fetch chat history ──
    const fetchChats = useCallback(async () => {
        setLoadingMsgs(true);
        try {
            const res = await fetch(`${backend_api}/user/support/chat?page=1&limit=50`, {
                credentials: "include",
            });
            const data = await res.json();
            if (res.ok) {
                setMessages(data.data || []);
            }
        } catch {
            // silent
        } finally {
            setLoadingMsgs(false);
        }
    }, []);

    // ── Fetch messages whenever we enter chat view ──
    useEffect(() => {
        if (view === "chat") {
            fetchChats();
        }
    }, [view, fetchChats]);

    // ── Scroll to bottom on new messages or typing ──
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, typing, awaitingOrderId]);

    // ── Select a support option ──
    const handleOption = async (opt) => {
        setSelectedOption(opt);
        setMessages([]);
        setView("chat");         // triggers fetchChats via useEffect above
        setTyping(true);
        setSending(true);

        try {
            const res = await fetch(`${backend_api}/user/support/chat`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ option: opt.id }),
            });

            if (res.ok) {
                // Small delay so typing indicator feels natural
                await new Promise(r => setTimeout(r, 600));
                setAwaitingOrderId(opt.needsOrderId);
                await fetchChats();
            }
        } catch {
            // silent
        } finally {
            setTyping(false);
            setSending(false);
        }
    };

    // ── Open free-text chat (something else) ──
    const openChat = () => {
        setSelectedOption(null);
        setAwaitingOrderId(false);
        setView("chat");
    };

    // ── Submit order ID ──
    const handleOrderId = async (orderId) => {
        setOrderLoading(true);
        setAwaitingOrderId(false);
        setTyping(true);

        // Optimistically add user message
        const tempMsg = {
            id: `tmp-${Date.now()}`,
            message: `Order ID: ${orderId}`,
            type: "user",
            created_at: new Date().toISOString(),
            _temp: true,
        };
        setMessages(prev => [...prev, tempMsg]);

        try {
            const res = await fetch(`${backend_api}/user/support/chat`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order_id: orderId }),
            });

            await new Promise(r => setTimeout(r, 500));

            if (res.ok) {
                await fetchChats();   // replaces optimistic msg with real data
            } else {
                setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
                setAwaitingOrderId(true);
            }
        } catch {
            setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
            setAwaitingOrderId(true);
        } finally {
            setTyping(false);
            setOrderLoading(false);
        }
    };

    // ── Send free-text message ──
    const sendMessage = async () => {
        const text = input.trim();
        if (!text || sending) return;

        setInput("");
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }

        // Optimistically add user message
        const tempMsg = {
            id: `tmp-${Date.now()}`,
            message: text,
            type: "user",
            created_at: new Date().toISOString(),
            _temp: true,
        };
        setMessages(prev => [...prev, tempMsg]);
        setSending(true);
        setTyping(true);

        try {
            const res = await fetch(`${backend_api}/user/support/chat`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text }),
            });

            await new Promise(r => setTimeout(r, 500));

            if (res.ok) {
                await fetchChats();   // replaces optimistic msg with real data + system reply
            } else {
                // Roll back on error
                setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
                setInput(text);
            }
        } catch {
            setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
            setInput(text);
        } finally {
            setSending(false);
            setTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const goBack = () => {
        setView("welcome");
        setSelectedOption(null);
        setAwaitingOrderId(false);
        setMessages([]);
    };

    const grouped = groupByDate(messages);

    return (
        <div className="sc">
            <Styles />

            {/* Header */}
            <div className="sc-header">
                {view === "chat" && (
                    <button className="back-btn" onClick={goBack}>
                        <ArrowLeft size={14} /> Back
                    </button>
                )}
                <div className="sc-header-icon"><Headphones size={18} /></div>
                <div>
                    <p className="sc-header-title">Support</p>
                    <p className="sc-header-sub">We usually reply in minutes</p>
                </div>
                <div className="sc-header-right">
                    <span className="online-pill"><span className="online-dot" /> Online</span>
                    {view === "chat" && (
                        <button
                            onClick={fetchChats}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", display: "flex", padding: 4 }}
                            title="Refresh"
                        >
                            <RefreshCw size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className="sc-body">

                {/* ── Welcome screen ── */}
                {view === "welcome" && (
                    <div className="welcome-screen">
                        <div className="welcome-hero">
                            <div className="welcome-avatar"><Headphones size={28} /></div>
                            <p className="welcome-title">How can we help?</p>
                            <p className="welcome-sub">Pick a topic below or send us a message — our team will get right on it.</p>
                        </div>

                        <p className="section-label">Common Issues</p>
                        <div className="options-grid">
                            {SUPPORT_OPTIONS.map(opt => (
                                <div
                                    key={opt.id}
                                    className="option-card"
                                    onClick={() => handleOption(opt)}
                                >
                                    <div className="option-icon" style={{ background: opt.iconBg, color: opt.iconColor }}>
                                        {opt.icon}
                                    </div>
                                    <div className="option-text">
                                        <p className="option-label">{opt.label}</p>
                                        <p className="option-desc">{opt.desc}</p>
                                    </div>
                                    <ChevronRight size={16} className="option-arrow" />
                                </div>
                            ))}
                        </div>

                        <p className="section-label">Something else?</p>
                        <div className="other-option" onClick={openChat}>
                            <HelpCircle size={16} />
                            <span>Chat with support about something else</span>
                            <ChevronRight size={14} style={{ marginLeft: "auto" }} />
                        </div>

                        {messages.length > 0 && (
                            <div style={{ marginTop: 16 }}>
                                <p className="section-label">Recent Conversations</p>
                                <div
                                    style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
                                    onClick={openChat}
                                >
                                    <MessageCircle size={16} style={{ color: "var(--brand)", flexShrink: 0 }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: 13, fontWeight: 600 }}>Continue previous chat</p>
                                        <p style={{ fontSize: 12, color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {messages[messages.length - 1]?.message}
                                        </p>
                                    </div>
                                    <ChevronRight size={14} style={{ color: "var(--text-3)" }} />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Chat screen ── */}
                {view === "chat" && (
                    <div className="chat-screen">
                        {/* Context bar */}
                        {selectedOption && (
                            <div className="chat-context-bar">
                                <div className="chat-context-icon" style={{ background: selectedOption.iconBg, color: selectedOption.iconColor }}>
                                    {selectedOption.icon}
                                </div>
                                <div>
                                    <p className="chat-context-label">{selectedOption.label}</p>
                                    <p className="chat-context-sub">Support ticket open</p>
                                </div>
                            </div>
                        )}

                        {/* Messages */}
                        <div className="chat-messages">
                            {loadingMsgs && messages.length === 0 ? (
                                <div className="loading-screen" style={{ flex: "none", paddingTop: 40 }}>
                                    <span className="spinner" style={{ width: 22, height: 22 }} />
                                    <span style={{ fontSize: 13 }}>Loading messages…</span>
                                </div>
                            ) : messages.length === 0 && !typing ? (
                                <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--text-3)" }}>
                                    <MessageCircle size={28} style={{ margin: "0 auto 10px" }} />
                                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-2)" }}>Start the conversation</p>
                                    <p style={{ fontSize: 13, marginTop: 4 }}>Type a message or select a topic from home</p>
                                </div>
                            ) : grouped.map((item, i) => (
                                item.type === "date" ? (
                                    <div key={`d-${i}`} className="date-div">{item.label}</div>
                                ) : (
                                    <div key={item.id || i} className={`msg-wrap ${item.type}`}>
                                        {(item.type === "system" || item.type === "admin") && (
                                            <p className="msg-sender">
                                                {item.type === "admin" ? "Support Agent" : "Assistant"}
                                            </p>
                                        )}
                                        <div className={`msg-bubble${item._temp ? " sending" : ""}`}>
                                            {item.message}
                                        </div>
                                        <p className="msg-time">{formatTime(item.created_at)}</p>
                                    </div>
                                )
                            ))}

                            {/* Typing indicator */}
                            {typing && (
                                <div className="msg-wrap system">
                                    <p className="msg-sender">Assistant</p>
                                    <div className="typing-indicator">
                                        <div className="typing-dot" />
                                        <div className="typing-dot" />
                                        <div className="typing-dot" />
                                    </div>
                                </div>
                            )}

                            {/* Order ID input card */}
                            {awaitingOrderId && !typing && (
                                <div className="msg-wrap system">
                                    <OrderIdCard onSubmit={handleOrderId} loading={orderLoading} />
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input bar */}
                        <div className="chat-input-bar">
                            <textarea
                                ref={textareaRef}
                                className="chat-textarea"
                                placeholder={awaitingOrderId ? "Please enter your Order ID above…" : "Type your message…"}
                                value={input}
                                onChange={e => {
                                    setInput(e.target.value);
                                    e.target.style.height = "auto";
                                    e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
                                }}
                                onKeyDown={handleKeyDown}
                                rows={1}
                                disabled={awaitingOrderId || sending}
                            />
                            <button
                                className="send-btn"
                                onClick={sendMessage}
                                disabled={!input.trim() || sending || awaitingOrderId}
                            >
                                {sending
                                    ? <span className="spinner" style={{ width: 15, height: 15, borderTopColor: "#fff" }} />
                                    : <Send size={16} />
                                }
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default UserSupport;