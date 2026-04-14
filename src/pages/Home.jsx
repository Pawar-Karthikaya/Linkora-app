import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import ChatWindow from "../components/Chat/ChatWindow";
import useConversations from "../hooks/useConversations";
import useMessages from "../hooks/useMessages";

function Home() {
    const navigate                          = useNavigate();
    const [activeConversation, setActive]   = useState(null);

    // ── Current logged-in user ───────────────────────────────────────────────
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    // ── Conversations hook ───────────────────────────────────────────────────
    const {
        conversations,
        loading:          conversationsLoading,
        startConversation,
        updateLastMessage,
        searchResults,
        searching,
        wsStatus,
        searchUsers,
        clearSearch,
    } = useConversations();

    // ── Messages hook ────────────────────────────────────────────────────────
    const {
        messages,
        loading:  messagesLoading,
        error:    messagesError,
        sending,
        bottomRef,
        sendMessage,
    } = useMessages(activeConversation, updateLastMessage);

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleSelectConversation = (conversation) => {
        setActive(conversation);
    };

    const handleStartConversation = async (userId) => {
        const conversation = await startConversation(userId);
        if (conversation) setActive(conversation);
        return conversation;
    };

    const handleBack = () => setActive(null);

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        localStorage.removeItem("theme");
        navigate("/");
    };

    // ── Layout ───────────────────────────────────────────────────────────────
    return (
        <div style={{
            display:  "flex",
            height:   "100vh",
            width:    "100vw",
            overflow: "hidden",
            background: "var(--bg-primary)",
        }}>

            {/* ── Icon rail ── */}
            <div style={{
                width:          "var(--rail-width)",
                display:        "flex",
                flexDirection:  "column",
                alignItems:     "center",
                padding:        "16px 0",
                gap:            4,
                borderRight:    "1px solid var(--border)",
                background:     "var(--bg-primary)",
                flexShrink:     0,
            }}>
                {/* Current user avatar */}
                <div style={{ marginBottom: 12 }}>
                    <div
                        title={currentUser.username || "Me"}
                        style={{
                            width:          36,
                            height:         36,
                            borderRadius:   "50%",
                            background:     "var(--accent)",
                            color:          "#fff",
                            display:        "flex",
                            alignItems:     "center",
                            justifyContent: "center",
                            fontWeight:     700,
                            fontSize:       13,
                            cursor:         "default",
                            userSelect:     "none",
                        }}
                    >
                        {(currentUser.username || "?")[0].toUpperCase()}
                    </div>
                </div>

                {/* Nav icons */}
                {[
                    {
                        title: "Chats",
                        active: true,
                        icon: (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                        ),
                    },
                    {
                        title: "Profile",
                        active: false,
                        icon: (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        ),
                    },
                    {
                        title: "Settings",
                        active: false,
                        icon: (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83
                                         2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0
                                         0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9
                                         19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83
                                         -2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0
                                         0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65
                                         1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65
                                         1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4
                                         0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06
                                         -.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4
                                         9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65
                                         1.65 0 0 0-1.51 1z" />
                            </svg>
                        ),
                    },
                ].map(({ title, icon, active }) => (
                    <button
                        key={title}
                        title={title}
                        style={{
                            width:          44,
                            height:         44,
                            display:        "flex",
                            alignItems:     "center",
                            justifyContent: "center",
                            borderRadius:   12,
                            border:         "none",
                            background:     active
                                ? "var(--bg-active)"
                                : "none",
                            color:          active
                                ? "var(--accent)"
                                : "var(--text-muted)",
                            cursor:         "pointer",
                            transition:     "background 0.15s, color 0.15s",
                        }}
                        onMouseEnter={e => {
                            if (!active) {
                                e.currentTarget.style.background = "var(--bg-hover)";
                                e.currentTarget.style.color = "var(--text-primary)";
                            }
                        }}
                        onMouseLeave={e => {
                            if (!active) {
                                e.currentTarget.style.background = "none";
                                e.currentTarget.style.color = "var(--text-muted)";
                            }
                        }}
                    >
                        {icon}
                    </button>
                ))}

                {/* Spacer */}
                <div style={{ flex: 1 }} />

                {/* Logout button */}
                <button
                    onClick={handleLogout}
                    title="Logout"
                    style={{
                        width:          44,
                        height:         44,
                        display:        "flex",
                        alignItems:     "center",
                        justifyContent: "center",
                        borderRadius:   12,
                        border:         "none",
                        background:     "none",
                        color:          "var(--text-muted)",
                        cursor:         "pointer",
                        transition:     "background 0.15s, color 0.15s",
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = "#fee2e2";
                        e.currentTarget.style.color = "#ef4444";
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = "none";
                        e.currentTarget.style.color = "var(--text-muted)";
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                </button>
            </div>

            {/* ── Sidebar ── */}
            <Sidebar
                conversations={conversations}
                loading={conversationsLoading}
                activeConversation={activeConversation}
                onSelectConversation={handleSelectConversation}
                onStartConversation={handleStartConversation}
                currentUserId={currentUser.id}
                searchResults={searchResults}
                searching={searching}
                onSearchUsers={searchUsers}
                onClearSearch={clearSearch}
            />

            {/* ── Chat window ── */}
            <ChatWindow
                conversation={activeConversation}
                messages={messages}
                loading={messagesLoading}
                error={messagesError}
                sending={sending}
                wsStatus={wsStatus}
                bottomRef={bottomRef}
                onSend={sendMessage}
                currentUserId={currentUser.id}
                onBack={handleBack}
            />
        </div>
    );
}

export default Home;