import { useState, useEffect, useCallback, useRef } from "react";
import API from "../services/api";

function useMessages(activeConversation, onMessageSent) {
    const [messages, setMessages]   = useState([]);
    const [loading, setLoading]     = useState(false);
    const [error, setError]         = useState(null);
    const [sending, setSending]     = useState(false);
    const [wsStatus, setWsStatus]   = useState("disconnected"); // disconnected | connecting | connected
    const bottomRef                 = useRef(null);
    const wsRef                     = useRef(null);  // holds WebSocket instance
    const reconnectTimer            = useRef(null);  // holds reconnect timer
    const reconnectAttempts         = useRef(0);     // counts reconnect attempts

    // ── Scroll to bottom ─────────────────────────────────────────────────────
    const scrollToBottom = useCallback(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages.length, scrollToBottom]);


    // ── Fetch existing messages via REST on conversation open ────────────────
    const fetchMessages = useCallback(async () => {
        if (!activeConversation) return;
        setLoading(true);
        setError(null);
        setMessages([]);
        try {
            const res = await API.get(
                `chat/messages/?conversation_id=${activeConversation.id}`
            );
            setMessages(res.data);
        } catch (err) {
            setError("Failed to load messages.");
            console.error("fetchMessages:", err);
        } finally {
            setLoading(false);
        }
    }, [activeConversation]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);


    // ── Connect WebSocket ────────────────────────────────────────────────────
    const connectWebSocket = useCallback(() => {
        if (!activeConversation) return;

        const token = localStorage.getItem("access");
        if (!token) {
            console.error("No token found — cannot connect WebSocket");
            return;
        }

        // Close existing connection if any
        if (wsRef.current) {
            wsRef.current.close();
        }

        const wsUrl = `ws://localhost:8000/ws/chat/${activeConversation.id}/?token=${token}`;
        console.log("🔌 Connecting to WebSocket:", wsUrl);

        setWsStatus("connecting");
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        // ── On open ──────────────────────────────────────────────────────────
        ws.onopen = () => {
            console.log("✅ WebSocket connected");
            setWsStatus("connected");
            reconnectAttempts.current = 0; // reset reconnect counter
        };

     // ── On message received ──────────────────────────────────────────────

     const [onlineUsers, setOnlineUsers] = useState([]);
ws.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);

        if (data.type === "message") {
            const incomingMessage = data.message;
            const currentUserId   = JSON.parse(
                localStorage.getItem("user") || "{}"
            ).id;

            setMessages(prev => {
                // Check if message already exists (exact id match)
                const exactExists = prev.find(m => m.id === incomingMessage.id);
                if (exactExists) return prev; // already there, skip

                // If sender is current user → replace temp message
                if (incomingMessage.sender === currentUserId) {
                    const hasTempMessage = prev.find(m => m.is_temp);
                    if (hasTempMessage) {
                        // Replace temp with real message from server
                        return prev.map(m =>
                            m.is_temp ? incomingMessage : m
                        );
                    }
                    return prev; // no temp found, skip
                }

                // Message from other user → add it normally
                return [...prev, incomingMessage];
            });

            // Update sidebar preview
            onMessageSent?.(activeConversation.id, incomingMessage);
        }
    } catch (err) {
        console.error("WebSocket message parse error:", err);
    }
};

        // ── On error ─────────────────────────────────────────────────────────
        ws.onerror = (err) => {
            console.error("❌ WebSocket error:", err);
            setWsStatus("disconnected");
        };

        // ── On close — auto reconnect ────────────────────────────────────────
        ws.onclose = (event) => {
            console.log("🔌 WebSocket closed:", event.code, event.reason);
            setWsStatus("disconnected");

            // Don't reconnect if closed intentionally (code 1000)
            if (event.code === 1000) return;

            // Don't reconnect if no active conversation
            if (!activeConversation) return;

            // Exponential backoff — wait longer each attempt
            // Attempt 1 → 1s, Attempt 2 → 2s, Attempt 3 → 4s, max 30s
            const delay = Math.min(
                1000 * Math.pow(2, reconnectAttempts.current),
                30000
            );
            reconnectAttempts.current += 1;

            console.log(`🔄 Reconnecting in ${delay / 1000}s... (attempt ${reconnectAttempts.current})`);

            reconnectTimer.current = setTimeout(() => {
                connectWebSocket();
            }, delay);
        };

    }, [activeConversation, onMessageSent]);


    // ── Connect WebSocket when conversation changes ──────────────────────────
    useEffect(() => {
        if (!activeConversation) return;

        connectWebSocket();

        // Cleanup — close WebSocket when conversation changes or unmounts
        return () => {
            if (reconnectTimer.current) {
                clearTimeout(reconnectTimer.current);
            }
            if (wsRef.current) {
                wsRef.current.close(1000, "Conversation changed");
                wsRef.current = null;
            }
            setWsStatus("disconnected");
        };
    }, [activeConversation?.id]); // only re-run when conversation ID changes


    // ── Send message via WebSocket ───────────────────────────────────────────
    const sendMessage = useCallback(async (content) => {
        if (!content.trim() || !activeConversation) return;

        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

        // Optimistic update — show message immediately
        const tempMessage = {
            id:           `temp-${Date.now()}`,
            conversation: activeConversation.id,
            content:      content.trim(),
            sender:       currentUser.id,
            timestamp:    new Date().toISOString(),
            is_read:      false,
            is_temp:      true,
        };

        setMessages(prev => [...prev, tempMessage]);
        setSending(true);

        try {
            // ✅ Send via WebSocket if connected
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({
                    content: content.trim(),
                }));

                // Remove temp flag after short delay
                // (real message comes back via ws.onmessage)
                // setTimeout(() => {
                //     setMessages(prev =>
                //         prev.map(m =>
                //             m.id === tempMessage.id
                //                 ? { ...m, is_temp: false }
                //                 : m
                //         )
                //     );
                // }, 500);

            } else {
                // ✅ Fallback to REST if WebSocket is not connected
                console.warn("WebSocket not connected — falling back to REST");
                const res = await API.post("chat/messages/", {
                    conversation: activeConversation.id,
                    content:      content.trim(),
                });

                // Replace temp with real message
                setMessages(prev =>
                    prev.map(m =>
                        m.id === tempMessage.id ? res.data : m
                    )
                );

                onMessageSent?.(activeConversation.id, res.data);
            }

        } catch (err) {
            // Remove temp message on failure
            setMessages(prev =>
                prev.filter(m => m.id !== tempMessage.id)
            );
            setError("Failed to send message. Try again.");
            console.error("sendMessage:", err);
        } finally {
            setSending(false);
        }
    }, [activeConversation, onMessageSent]);


    // ── Mark messages as read ────────────────────────────────────────────────
    const markAsRead = useCallback(async () => {
        if (!activeConversation) return;
        try {
            const currentUserId = JSON.parse(
                localStorage.getItem("user") || "{}"
            ).id;

            const unread = messages.filter(
                m => !m.is_read && m.sender !== currentUserId
            );

            await Promise.all(
                unread.map(m =>
                    API.patch(`chat/messages/${m.id}/`, { is_read: true })
                )
            );

            setMessages(prev =>
                prev.map(m =>
                    !m.is_read && m.sender !== currentUserId
                        ? { ...m, is_read: true }
                        : m
                )
            );
        } catch (err) {
            console.error("markAsRead:", err);
        }
    }, [activeConversation, messages]);

    useEffect(() => {
        if (activeConversation && messages.length > 0) {
            markAsRead();
        }
    }, [activeConversation?.id]);


    // ── Clear on no conversation ─────────────────────────────────────────────
    useEffect(() => {
        if (!activeConversation) {
            setMessages([]);
            setError(null);
            setWsStatus("disconnected");
        }
    }, [activeConversation]);


    return {
        messages,
        loading,
        error,
        sending,
        wsStatus,       // ✅ expose so UI can show connection status
        bottomRef,
        sendMessage,
        markAsRead,
    };
}

export default useMessages;