import { useState, useEffect, useCallback, useRef } from "react";
import API from "../services/api";

function useMessages(activeConversation, onMessageSent) {
    const [messages, setMessages]   = useState([]);
    const [loading, setLoading]     = useState(false);
    const [error, setError]         = useState(null);
    const [sending, setSending]     = useState(false);
    const bottomRef                 = useRef(null);

    // ── Scroll to bottom whenever messages change ────────────────────────────
    const scrollToBottom = useCallback(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages.length, scrollToBottom]);


    // ── Fetch messages when active conversation changes ──────────────────────
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


    // ── Send a message ───────────────────────────────────────────────────────
    const sendMessage = useCallback(async (content) => {
        if (!content.trim() || !activeConversation) return;

        // Optimistic update — add message to UI immediately
        // so it feels instant before server confirms
        const tempMessage = {
            id:              `temp-${Date.now()}`,
            conversation:    activeConversation.id,
            content:         content.trim(),
            sender:          JSON.parse(localStorage.getItem("user") || "{}").id,
            timestamp:       new Date().toISOString(),
            is_read:         false,
            is_temp:         true,  // flag to identify before server confirms
        };

        setMessages(prev => [...prev, tempMessage]);
        setSending(true);

        try {
            const res = await API.post("chat/messages/", {
                conversation: activeConversation.id,
                content:      content.trim(),
            });

            // Replace temp message with real one from server
            setMessages(prev =>
                prev.map(m => m.id === tempMessage.id ? res.data : m)
            );

            // Notify useConversations to update sidebar preview
            onMessageSent?.(activeConversation.id, res.data);

        } catch (err) {
            // Remove temp message on failure + show error
            setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
            setError("Failed to send message. Try again.");
            console.error("sendMessage:", err);
        } finally {
            setSending(false);
        }
    }, [activeConversation, onMessageSent]);


    // ── Mark messages as read when conversation is opened ───────────────────
    const markAsRead = useCallback(async () => {
        if (!activeConversation) return;
        try {
            // Get all unread messages not sent by current user
            const currentUserId = JSON.parse(
                localStorage.getItem("user") || "{}"
            ).id;

            const unread = messages.filter(
                m => !m.is_read && m.sender !== currentUserId
            );

            // PATCH each unread message — fixes bug #36
            await Promise.all(
                unread.map(m =>
                    API.patch(`chat/messages/${m.id}/`, { is_read: true })
                )
            );

            // Update local state
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

    // Mark as read when conversation opens
    useEffect(() => {
        if (activeConversation && messages.length > 0) {
            markAsRead();
        }
    }, [activeConversation?.id]);


    // ── Clear messages when conversation changes ─────────────────────────────
    useEffect(() => {
        if (!activeConversation) {
            setMessages([]);
            setError(null);
        }
    }, [activeConversation]);


    return {
        messages,
        loading,
        error,
        sending,
        bottomRef,
        sendMessage,
        markAsRead,
    };
}

export default useMessages;