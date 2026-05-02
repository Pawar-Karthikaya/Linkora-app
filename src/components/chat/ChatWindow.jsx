import Avatar from "../shared/Avatar";
import MessageBubble from "./MessageBubble";
import InputBar from "./InputBar";

function EmptyState() {
    return (
        <div style={{
            flex:           1,
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            justifyContent: "center",
            background:     "var(--bg-secondary)",
            gap:            16,
        }}>
            {/* Logo mark */}
            <div style={{
                width:          72,
                height:         72,
                borderRadius:   "50%",
                background:     "var(--bg-active)",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
            }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                    stroke="var(--accent)" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
            </div>

            <div style={{ textAlign: "center" }}>
                <h2 style={{
                    fontSize:      20,
                    fontWeight:    700,
                    color:         "var(--text-primary)",
                    marginBottom:  8,
                    letterSpacing: "-0.3px",
                }}>
                    Welcome to Linkora
                </h2>
                <p style={{
                    fontSize:   14,
                    color:      "var(--text-muted)",
                    lineHeight: 1.6,
                    maxWidth:   280,
                }}>
                    Select a conversation from the sidebar
                    or start a new one to begin chatting.
                </p>
            </div>

            {/* Feature hints */}
            <div style={{
                display:       "flex",
                flexDirection: "column",
                gap:           10,
                marginTop:     8,
            }}>
                {[
                    { icon: "🔒", text: "End-to-end encrypted" },
                    { icon: "⚡", text: "Real-time messaging" },
                    { icon: "🌙", text: "Light & dark mode" },
                ].map(({ icon, text }) => (
                    <div key={text} style={{
                        display:    "flex",
                        alignItems: "center",
                        gap:        10,
                        fontSize:   13,
                        color:      "var(--text-muted)",
                    }}>
                        <span>{icon}</span>
                        <span>{text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}


function ChatHeader({ conversation, currentUserId, onBack, wsStatus, onlineUsers }) {
    const otherParticipant = conversation.participants?.find(
        p => p.id !== currentUserId
    );

    const name = otherParticipant
        ? `${otherParticipant.first_name} ${otherParticipant.last_name}`.trim()
            || otherParticipant.username
        : "Unknown";

    const isOtherOnline = onlineUsers?.some(
        id => String(id) === String(otherParticipant?.id)
    );
    return (
        <div style={{
            display:      "flex",
            alignItems:   "center",
            gap:          12,
            padding:      "12px 20px",
            borderBottom: "1px solid var(--border)",
            background:   "var(--bg-primary)",
            flexShrink:   0,
        }}>
            {/* Back button — mobile feel */}
            <button
                onClick={onBack}
                title="Back"
                style={{
                    background:   "none",
                    border:       "none",
                    cursor:       "pointer",
                    padding:      6,
                    borderRadius: 8,
                    color:        "var(--text-secondary)",
                    display:      "flex",
                    alignItems:   "center",
                    transition:   "background 0.15s",
                }}
                onMouseEnter={e =>
                    e.currentTarget.style.background = "var(--bg-hover)"
                }
                onMouseLeave={e =>
                    e.currentTarget.style.background = "none"
                }
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
            </button>

            {/* Avatar */}
            <Avatar
                name={name}
                size={40}
                showStatus
                isOnline={isOtherOnline} 
            />

            {/* Name + status */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                    fontWeight:   600,
                    fontSize:     15,
                    color:        "var(--text-primary)",
                    overflow:     "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace:   "nowrap",
                }}>
                    {name}
                </p>
                
                <p style={{
                    fontSize:  12,
                    color:     isOtherOnline ? "#22c55e" : "var(--text-muted)",
                    marginTop: 1,
                }}
                >
                    {isOtherOnline ? "Online" : "Offline"}
                    
                </p>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 2 }}>
                {[
                    {
                        title: "Search in chat",
                        icon: (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        ),
                    },
                    {
                        title: "More options",
                        icon: (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="5"  r="1" />
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="19" r="1" />
                            </svg>
                        ),
                    },
                ].map(({ title, icon }) => (
                    <button
                        key={title}
                        title={title}
                        style={{
                            background:   "none",
                            border:       "none",
                            cursor:       "pointer",
                            padding:      8,
                            borderRadius: 8,
                            color:        "var(--text-secondary)",
                            display:      "flex",
                            alignItems:   "center",
                            transition:   "background 0.15s",
                        }}
                        onMouseEnter={e =>
                            e.currentTarget.style.background = "var(--bg-hover)"
                        }
                        onMouseLeave={e =>
                            e.currentTarget.style.background = "none"
                        }
                    >
                        {icon}
                    </button>
                ))}
            </div>
        </div>
    );
}


function DateDivider({ date }) {
    const label = (() => {
        const d   = new Date(date);
        const now = new Date();
        const isToday     = d.toDateString() === now.toDateString();
        const isYesterday = new Date(now - 86400000).toDateString() === d.toDateString();
        if (isToday)     return "Today";
        if (isYesterday) return "Yesterday";
        return d.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" });
    })();

    return (
        <div style={{
            display:        "flex",
            alignItems:     "center",
            gap:            12,
            padding:        "12px 16px",
            userSelect:     "none",
        }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{
                fontSize:     11,
                fontWeight:   600,
                color:        "var(--text-muted)",
                background:   "var(--bg-secondary)",
                padding:      "3px 12px",
                borderRadius: 99,
                border:       "1px solid var(--border)",
                whiteSpace:   "nowrap",
            }}>
                {label}
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>
    );
}


function ChatWindow({
    conversation,
    messages,
    loading,
    error,
    sending,
    bottomRef,
    onSend,
    currentUserId,
    onBack,
    wsStatus,
    onlineUsers,
}) {
    // ── No conversation selected ─────────────────────────────────────────────
    if (!conversation) return <EmptyState />;

    // ── Group messages by date for date dividers ─────────────────────────────
    const grouped = messages.reduce((acc, msg) => {
        const day = new Date(msg.timestamp).toDateString();
        if (!acc[day]) acc[day] = [];
        acc[day].push(msg);
        return acc;
    }, {});

    return (
        <div style={{
            flex:          1,
            display:       "flex",
            flexDirection: "column",
            overflow:      "hidden",
            background:    "var(--bg-primary)",
        }}>

            {/* ── Header ── */}
            <ChatHeader
                conversation={conversation}
                currentUserId={currentUserId}
                onBack={onBack}
                wsStatus={wsStatus}
                onlineUsers={onlineUsers}
            />

            {/* ── Messages area ── */}
            <div style={{
                flex:          1,
                overflowY:     "auto",
                padding:       "8px 0",
                background:    "var(--bg-secondary)",
                display:       "flex",
                flexDirection: "column",
            }}>

                {/* Loading state */}
                {loading && (
                    <div style={{
                        display:        "flex",
                        alignItems:     "center",
                        justifyContent: "center",
                        flex:           1,
                        gap:            10,
                        color:          "var(--text-muted)",
                        fontSize:       13,
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round"
                            style={{ animation: "spin 0.8s linear infinite" }}>
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83
                                     M16.24 16.24l2.83 2.83M2 12h4M18 12h4
                                     M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                        Loading messages...
                    </div>
                )}

                {/* Error state */}
                {error && !loading && (
                    <div style={{
                        textAlign:  "center",
                        padding:    24,
                        color:      "#ef4444",
                        fontSize:   13,
                    }}>
                        {error}
                    </div>
                )}

                {/* Empty messages state */}
                {!loading && !error && messages.length === 0 && (
                    <div style={{
                        display:        "flex",
                        flexDirection:  "column",
                        alignItems:     "center",
                        justifyContent: "center",
                        flex:           1,
                        gap:            10,
                    }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                            stroke="var(--text-muted)" strokeWidth="1.5"
                            strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <p style={{
                            fontSize:  13,
                            color:     "var(--text-muted)",
                            textAlign: "center",
                        }}>
                            No messages yet.<br />Say hello! 👋
                        </p>
                    </div>
                )}

                {/* Messages grouped by date */}
                {!loading && !error && Object.entries(grouped).map(([day, dayMessages]) => (
                    <div key={day}>
                        <DateDivider date={dayMessages[0].timestamp} />
                        {dayMessages.map(msg => (
                            <MessageBubble
                                key={msg.id}
                                message={msg}
                                isMine={msg.sender === currentUserId}
                                isTemp={msg.is_temp}
                            />
                        ))}
                    </div>
                ))}

                {/* Scroll anchor */}
                <div ref={bottomRef} style={{ height: 8 }} />
            </div>

            {/* ── Input bar ── */}
            <InputBar
                onSend={onSend}
                sending={sending}
                disabled={false}
            />

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

export default ChatWindow;
