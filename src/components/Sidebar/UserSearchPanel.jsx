import { useState, useEffect, useRef } from "react";
import Avatar from "../shared/Avatar";

function UserSearchPanel({ onSelectUser, onClose, searching, searchResults, onSearch }) {
    const [query, setQuery]   = useState("");
    const inputRef            = useRef(null);

    // ── Auto focus input when panel opens ───────────────────────────────────
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // ── Debounce search — wait 400ms after user stops typing ────────────────
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query);
        }, 400);
        return () => clearTimeout(timer);
    }, [query, onSearch]);

    const handleClose = () => {
        setQuery("");
        onClose();
    };

    return (
        <div style={{
            position:   "absolute",
            top:        0,
            left:       0,
            right:      0,
            bottom:     0,
            background: "var(--bg-primary)",
            zIndex:     10,
            display:    "flex",
            flexDirection: "column",
        }}>

            {/* ── Header ── */}
            <div style={{
                display:      "flex",
                alignItems:   "center",
                gap:          12,
                padding:      "16px 16px 12px",
                borderBottom: "1px solid var(--border)",
            }}>
                {/* Back button */}
                <button
                    onClick={handleClose}
                    style={{
                        background:   "none",
                        border:       "none",
                        cursor:       "pointer",
                        padding:      6,
                        borderRadius: 8,
                        color:        "var(--text-secondary)",
                        display:      "flex",
                        alignItems:   "center",
                        justifyContent: "center",
                        transition:   "background 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg-hover)"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                    title="Close"
                >
                    {/* Left arrow icon */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>

                <span style={{
                    fontSize:   16,
                    fontWeight: 600,
                    color:      "var(--text-primary)",
                }}>
                    New Conversation
                </span>
            </div>

            {/* ── Search input ── */}
            <div style={{ padding: "12px 16px" }}>
                <div style={{
                    display:      "flex",
                    alignItems:   "center",
                    gap:          10,
                    background:   "var(--bg-secondary)",
                    border:       "1.5px solid var(--border)",
                    borderRadius: 10,
                    padding:      "9px 14px",
                    transition:   "border-color 0.15s",
                }}
                    onFocusCapture={e =>
                        e.currentTarget.style.borderColor = "var(--accent)"
                    }
                    onBlurCapture={e =>
                        e.currentTarget.style.borderColor = "var(--border)"
                    }
                >
                    {/* Search icon */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="var(--text-muted)" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                        style={{ flexShrink: 0 }}>
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>

                    <input
                        ref={inputRef}
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search by name, email or username..."
                        style={{
                            flex:       1,
                            border:     "none",
                            background: "transparent",
                            outline:    "none",
                            fontSize:   14,
                            color:      "var(--text-primary)",
                        }}
                    />

                    {/* Clear button */}
                    {query && (
                        <button
                            onClick={() => setQuery("")}
                            style={{
                                background: "none",
                                border:     "none",
                                cursor:     "pointer",
                                color:      "var(--text-muted)",
                                padding:    0,
                                display:    "flex",
                                alignItems: "center",
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* ── Results ── */}
            <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 8px" }}>

                {/* Searching spinner */}
                {searching && (
                    <div style={{
                        textAlign:  "center",
                        padding:    40,
                        color:      "var(--text-muted)",
                        fontSize:   13,
                    }}>
                        Searching...
                    </div>
                )}

                {/* Empty query state */}
                {!searching && !query && (
                    <div style={{
                        display:        "flex",
                        flexDirection:  "column",
                        alignItems:     "center",
                        justifyContent: "center",
                        padding:        40,
                        gap:            12,
                    }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                            stroke="var(--text-muted)" strokeWidth="1.5"
                            strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center" }}>
                            Search for people to<br />start a conversation
                        </p>
                    </div>
                )}

                {/* No results */}
                {!searching && query && searchResults.length === 0 && (
                    <div style={{
                        display:        "flex",
                        flexDirection:  "column",
                        alignItems:     "center",
                        justifyContent: "center",
                        padding:        40,
                        gap:            12,
                    }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                            stroke="var(--text-muted)" strokeWidth="1.5"
                            strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                            <line x1="17" y1="17" x2="22" y2="22" />
                        </svg>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center" }}>
                            No users found for<br />
                            <strong style={{ color: "var(--text-secondary)" }}>"{query}"</strong>
                        </p>
                    </div>
                )}

                {/* Results list */}
                {!searching && searchResults.map(user => {
                    const name = `${user.first_name} ${user.last_name}`.trim()
                        || user.username;

                    return (
                        <div
                            key={user.id}
                            onClick={() => {
                                onSelectUser(user.id);
                                handleClose();
                            }}
                            style={{
                                display:      "flex",
                                alignItems:   "center",
                                gap:          12,
                                padding:      "10px 12px",
                                borderRadius: 10,
                                cursor:       "pointer",
                                transition:   "background 0.15s",
                            }}
                            onMouseEnter={e =>
                                e.currentTarget.style.background = "var(--bg-hover)"
                            }
                            onMouseLeave={e =>
                                e.currentTarget.style.background = "transparent"
                            }
                        >
                            <Avatar name={name} size={42} />

                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{
                                    fontSize:     14,
                                    fontWeight:   600,
                                    color:        "var(--text-primary)",
                                    overflow:     "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace:   "nowrap",
                                }}>
                                    {name}
                                </p>
                                <p style={{
                                    fontSize:     12,
                                    color:        "var(--text-muted)",
                                    overflow:     "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace:   "nowrap",
                                }}>
                                    @{user.username} · {user.email}
                                </p>
                            </div>

                            {/* Start chat arrow */}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="var(--text-muted)" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default UserSearchPanel;