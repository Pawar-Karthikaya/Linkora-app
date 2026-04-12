import Avatar from "../shared/Avatar";

function formatTime(isoString) {
    if (!isoString) return "";
    const date = new Date(isoString);
    const now  = new Date();

    const isToday     = date.toDateString() === now.toDateString();
    const isYesterday = new Date(now - 86400000).toDateString() === date.toDateString();
    const isThisWeek  = now - date < 7 * 86400000;

    if (isToday)     return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (isYesterday) return "Yesterday";
    if (isThisWeek)  return date.toLocaleDateString([], { weekday: "short" }); // "Mon"
    return date.toLocaleDateString([], { day: "2-digit", month: "short" });    // "12 Apr"
}

function ConversationItem({ conversation, isActive, onClick, currentUserId }) {

    // ── Get the other participant ────────────────────────────────────────────
    const otherParticipant = conversation.participants?.find(
        p => p.id !== currentUserId
    );

    const name        = otherParticipant
        ? `${otherParticipant.first_name} ${otherParticipant.last_name}`.trim()
            || otherParticipant.username
        : "Unknown";

    // ── Last message preview ─────────────────────────────────────────────────
    const lastMessage = conversation.last_message;
    const preview     = lastMessage
        ? lastMessage.sender === currentUserId
            ? `You: ${lastMessage.content}`
            : lastMessage.content
        : "No messages yet";

    const time        = lastMessage?.timestamp
        ? formatTime(lastMessage.timestamp)
        : formatTime(conversation.created_at);

    // ── Unread count ─────────────────────────────────────────────────────────
    // For now 0 — will update when WebSocket lands
    const unread = 0;

    return (
        <div
            onClick={onClick}
            style={{
                display:      "flex",
                alignItems:   "center",
                gap:          12,
                padding:      "10px 16px",
                cursor:       "pointer",
                borderRadius: 10,
                margin:       "2px 8px",
                background:   isActive
                    ? "var(--bg-active)"
                    : "transparent",
                transition:   "background 0.15s",
            }}
            onMouseEnter={e => {
                if (!isActive)
                    e.currentTarget.style.background = "var(--bg-hover)";
            }}
            onMouseLeave={e => {
                if (!isActive)
                    e.currentTarget.style.background = "transparent";
            }}
        >
            {/* Avatar */}
            <Avatar
                name={name}
                size={46}
                showStatus
                isOnline={false} // will come from WebSocket later
            />

            {/* Text content */}
            <div style={{ flex: 1, minWidth: 0 }}>

                {/* Name + time row */}
                <div style={{
                    display:        "flex",
                    justifyContent: "space-between",
                    alignItems:     "center",
                    marginBottom:   3,
                }}>
                    <span style={{
                        fontWeight:   600,
                        fontSize:     14,
                        color:        "var(--text-primary)",
                        overflow:     "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace:   "nowrap",
                        maxWidth:     160,
                    }}>
                        {name}
                    </span>
                    <span style={{
                        fontSize:   11,
                        color:      unread > 0
                            ? "var(--accent)"
                            : "var(--text-muted)",
                        fontWeight: unread > 0 ? 600 : 400,
                        flexShrink: 0,
                        marginLeft: 8,
                    }}>
                        {time}
                    </span>
                </div>

                {/* Preview + unread badge row */}
                <div style={{
                    display:        "flex",
                    justifyContent: "space-between",
                    alignItems:     "center",
                }}>
                    <span style={{
                        fontSize:     13,
                        color:        unread > 0
                            ? "var(--text-primary)"
                            : "var(--text-muted)",
                        fontWeight:   unread > 0 ? 500 : 400,
                        overflow:     "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace:   "nowrap",
                        maxWidth:     190,
                    }}>
                        {preview}
                    </span>

                    {/* Unread badge */}
                    {unread > 0 && (
                        <span style={{
                            background:     "var(--accent)",
                            color:          "#fff",
                            fontSize:       11,
                            fontWeight:     700,
                            borderRadius:   99,
                            minWidth:       20,
                            height:         20,
                            display:        "flex",
                            alignItems:     "center",
                            justifyContent: "center",
                            padding:        "0 6px",
                            flexShrink:     0,
                            marginLeft:     8,
                        }}>
                            {unread}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ConversationItem;