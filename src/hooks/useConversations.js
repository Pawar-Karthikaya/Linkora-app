import { useState, useEffect, useCallback } from "react";
import API from "../services/api";

function useConversations() {
    const [conversations, setConversations]   = useState([]);
    const [loading, setLoading]               = useState(true);
    const [error, setError]                   = useState(null);

    // ── Fetch all conversations for logged-in user ──────────────────────────
    const fetchConversations = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.get("chat/conversations/");
            setConversations(res.data);
        } catch (err) {
            setError("Failed to load conversations.");
            console.error("useConversations:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch on mount
    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);


    // ── Start a new conversation or return existing one ─────────────────────
    const startConversation = useCallback(async (otherUserId) => {
        try {
            const res = await API.post("chat/conversations/", {
                participants: [otherUserId],
            });

            const newConversation = res.data;

            // Add to top of list only if not already there
            setConversations(prev => {
                const exists = prev.find(c => c.id === newConversation.id);
                if (exists) return prev;
                return [newConversation, ...prev];
            });

            return newConversation;
        } catch (err) {
            console.error("startConversation:", err);
            return null;
        }
    }, []);


    // ── Update last message preview in sidebar after sending ────────────────
    const updateLastMessage = useCallback((conversationId, message) => {
        setConversations(prev =>
            prev.map(c =>
                c.id === conversationId
                    ? { ...c, last_message: message }
                    : c
            )
        );
    }, []);


    // ── Search users to start a new conversation ────────────────────────────
    const [searchResults, setSearchResults]   = useState([]);
    const [searching, setSearching]           = useState(false);

    const searchUsers = useCallback(async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        setSearching(true);
        try {
            const res = await API.get(`users/users/?search=${query}`);
            setSearchResults(res.data);
        } catch (err) {
            console.error("searchUsers:", err);
        } finally {
            setSearching(false);
        }
    }, []);

    const clearSearch = useCallback(() => {
        setSearchResults([]);
    }, []);


    return {
        // Conversations
        conversations,
        loading,
        error,
        fetchConversations,

        // Start conversation
        startConversation,
        updateLastMessage,

        // User search
        searchResults,
        searching,
        searchUsers,
        clearSearch,
    };
}

export default useConversations;