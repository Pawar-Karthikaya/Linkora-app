function formatTime(isoString) {
    if (!isoString) return "";
    return new Date(isoString).toLocaleTimeString([], {
        hour:   "2-digit",
        minute: "2-digit",
    });
}

function MessageBubble({ message, isMine, isTemp }) {
    return (
        <div style={{
            display:        "flex",
            justifyContent: isMine ? "flex-end" : "flex-start",
            marginBottom:   2,
            padding:        "0 16px",
        }}>
            <div style={{
                maxWidth:     "65%",
                display:      "flex",
                flexDirection: "column",
                alignItems:   isMine ? "flex-end" : "flex-start",
            }}>

                {/* ── Bubble ── */}
                <div style={{
                    padding:      "9px 14px",
                    borderRadius: isMine
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                    background:   isMine
                        ? "var(--bubble-mine)"
                        : "var(--bubble-other)",
                    color:        isMine
                        ? "var(--bubble-mine-text)"
                        : "var(--bubble-other-text)",
                    fontSize:     14,
                    lineHeight:   1.55,
                    wordBreak:    "break-word",
                    boxShadow:    "var(--shadow-sm)",
                    opacity:      isTemp ? 0.6 : 1,       // dim while sending
                    transition:   "opacity 0.2s",
                }}>
                    {message.content}
                </div>

                {/* ── Meta row — time + status ── */}
                <div style={{
                    display:    "flex",
                    alignItems: "center",
                    gap:        4,
                    marginTop:  4,
                    padding:    "0 4px",
                }}>
                    {/* Timestamp */}
                    <span style={{
                        fontSize: 11,
                        color:    "var(--text-muted)",
                    }}>
                        {formatTime(message.timestamp)}
                    </span>

                    {/* Read receipts — only for my messages */}
                    {isMine && (
                        <span style={{
                            fontSize: 12,
                            color:    message.is_read
                                ? "var(--accent)"          // purple = read
                                : "var(--text-muted)",     // grey = delivered
                        }}>
                            {isTemp ? (
                                // Clock icon — still sending
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                            ) : message.is_read ? (
                                // Double tick — read
                                <svg width="16" height="12" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2.5"
                                    strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="2 12 7 17 22 4" />
                                    <polyline points="7 12 12 17 22 4"
                                        style={{ transform: "translateX(3px)" }} />
                                </svg>
                            ) : (
                                // Single tick — delivered
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2.5"
                                    strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="2 12 7 17 22 4" />
                                </svg>
                            )}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MessageBubble;