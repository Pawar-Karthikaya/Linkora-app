import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import ConversationItem from "./ConversationItem";
import UserSearchPanel from "./UserSearchPanel";

function Sidebar({
    conversations,
    loading,
    activeConversation,
    onSelectConversation,
    onStartConversation,
    currentUserId,
    searchResults,
    searching,
    onSearchUsers,
    onClearSearch,
}) {
    const { theme, toggleTheme } = useTheme();
    const [showSearch, setShowSearch]   = useState(false);
    const [filter, setFilter]           = useState("All");

    const FILTERS = ["All", "Unread"];

    // ── Filter conversations ─────────────────────────────────────────────────
    const filtered = conversations.filter(c => {
        if (filter === "Unread") return c.last_message && !c.last_message.is_read
            && c.last_message.sender !== currentUserId;
        return true;
    });

    // ── Handle starting a new conversation ───────────────────────────────────
    const handleSelectUser = async (userId) => {
        const conversation = await onStartConversation(userId);
        if (conversation) {
            onSelectConversation(conversation);
        }
    };

    return (
        <div style={{
            width:          "var(--sidebar-width)",
            display:        "flex",
            flexDirection:  "column",
            borderRight:    "1px solid var(--border)",
            background:     "var(--bg-primary)",
            flexShrink:     0,
            overflow:       "hidden",
            position:       "relative", // needed for UserSearchPanel absolute positioning
        }}>

            {/* ── Header ── */}
            <div style={{
                padding:      "18px 16px 12px",
                borderBottom: "1px solid var(--border)",
                flexShrink:   0,
            }}>
                {/* Top row — app name + actions */}
                <div style={{
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "space-between",
                    marginBottom:   14,
                }}>
                    <span style={{
                        fontSize:      18,
                        fontWeight:    700,
                        color:         "var(--text-primary)",
                        letterSpacing: "-0.5px",
                    }}>
                        Linkora
                    </span>

                    <div style={{ display: "flex", gap: 4 }}>

                        {/* Theme toggle */}
                        <button
                            onClick={toggleTheme}
                            title={theme === "light" ? "Dark mode" : "Light mode"}
                            style={{
                                background:   "none",
                                border:       "none",
                                cursor:       "pointer",
                                padding:      7,
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
                            {theme === "light" ? (
                                // Moon icon
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            ) : (
                                // Sun icon
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="5" />
                                    <line x1="12" y1="1"  x2="12" y2="3" />
                                    <line x1="12" y1="21" x2="12" y2="23" />
                                    <line x1="4.22" y1="4.22"   x2="5.64" y2="5.64" />
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                    <line x1="1"  y1="12" x2="3"  y2="12" />
                                    <line x1="21" y1="12" x2="23" y2="12" />
                                    <line x1="4.22" y1="19.78"  x2="5.64" y2="18.36" />
                                    <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22" />
                                </svg>
                            )}
                        </button>

                        {/* New conversation button */}
                        <button
                            onClick={() => setShowSearch(true)}
                            title="New conversation"
                            style={{
                                background:   "none",
                                border:       "none",
                                cursor:       "pointer",
                                padding:      7,
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
                            {/* Edit / compose icon */}
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Search bar */}
                <div style={{
                    display:      "flex",
                    alignItems:   "center",
                    gap:          8,
                    background:   "var(--bg-secondary)",
                    border:       "1.5px solid var(--border)",
                    borderRadius: 10,
                    padding:      "8px 12px",
                    marginBottom: 12,
                    transition:   "border-color 0.15s",
                }}
                    onFocusCapture={e =>
                        e.currentTarget.style.borderColor = "var(--accent)"
                    }
                    onBlurCapture={e =>
                        e.currentTarget.style.borderColor = "var(--border)"
                    }
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="var(--text-muted)" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                        style={{ flexShrink: 0 }}>
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        placeholder="Search conversations"
                        style={{
                            flex:       1,
                            border:     "none",
                            background: "transparent",
                            outline:    "none",
                            fontSize:   13,
                            color:      "var(--text-primary)",
                        }}
                    />
                </div>

                {/* Filter pills */}
                <div style={{ display: "flex", gap: 6 }}>
                    {FILTERS.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding:      "4px 14px",
                                borderRadius: 99,
                                fontSize:     12,
                                fontWeight:   600,
                                border:       filter === f
                                    ? "none"
                                    : "1.5px solid var(--border)",
                                background:   filter === f
                                    ? "var(--accent)"
                                    : "transparent",
                                color:        filter === f
                                    ? "#fff"
                                    : "var(--text-muted)",
                                cursor:       "pointer",
                                transition:   "all 0.15s",
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Conversation list ── */}
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>

                {/* Loading state */}
                {loading && (
                    <div style={{
                        display:        "flex",
                        flexDirection:  "column",
                        gap:            8,
                        padding:        "8px 16px",
                    }}>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} style={{
                                display:   "flex",
                                gap:       12,
                                alignItems: "center",
                                padding:   "10px 0",
                            }}>
                                {/* Avatar skeleton */}
                                <div style={{
                                    width:        46,
                                    height:       46,
                                    borderRadius: "50%",
                                    background:   "var(--border)",
                                    flexShrink:   0,
                                    animation:    "pulse 1.5s infinite",
                                }} />
                                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                                    {/* Name skeleton */}
                                    <div style={{
                                        height:       12,
                                        width:        "60%",
                                        borderRadius: 6,
                                        background:   "var(--border)",
                                        animation:    "pulse 1.5s infinite",
                                    }} />
                                    {/* Preview skeleton */}
                                    <div style={{
                                        height:       10,
                                        width:        "85%",
                                        borderRadius: 6,
                                        background:   "var(--border)",
                                        animation:    "pulse 1.5s infinite",
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && filtered.length === 0 && (
                    <div style={{
                        display:        "flex",
                        flexDirection:  "column",
                        alignItems:     "center",
                        justifyContent: "center",
                        height:         "100%",
                        gap:            12,
                        padding:        32,
                    }}>
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none"
                            stroke="var(--text-muted)" strokeWidth="1.5"
                            strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <p style={{
                            fontSize:  13,
                            color:     "var(--text-muted)",
                            textAlign: "center",
                            lineHeight: 1.6,
                        }}>
                            No conversations yet.<br />
                            Click ✏️ to start chatting.
                        </p>
                    </div>
                )}

                {/* Conversation items */}
                {!loading && filtered.map(conversation => (
                    <ConversationItem
                        key={conversation.id}
                        conversation={conversation}
                        isActive={activeConversation?.id === conversation.id}
                        onClick={() => onSelectConversation(conversation)}
                        currentUserId={currentUserId}
                    />
                ))}
            </div>

            {/* ── User search panel (slides over sidebar) ── */}
            {showSearch && (
                <UserSearchPanel
                    onSelectUser={handleSelectUser}
                    onClose={() => {
                        setShowSearch(false);
                        onClearSearch();
                    }}
                    searching={searching}
                    searchResults={searchResults}
                    onSearch={onSearchUsers}
                />
            )}

            {/* Pulse animation for skeletons */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.4; }
                }
            `}</style>
        </div>
    );
}

export default Sidebar;