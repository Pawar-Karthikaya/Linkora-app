import { useState, useRef, useEffect } from "react";

function InputBar({ onSend, sending, disabled }) {
    const [input, setInput]     = useState("");
    const textareaRef           = useRef(null);

    // ── Auto resize textarea as user types ───────────────────────────────────
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 120)}px`; // max 5 lines
    }, [input]);

    // ── Focus input when component mounts ───────────────────────────────────
    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    const handleSend = () => {
        if (!input.trim() || sending || disabled) return;
        onSend(input.trim());
        setInput("");
        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };

    const handleKeyDown = (e) => {
        // Enter to send, Shift+Enter for new line
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const isEmpty = !input.trim();

    return (
        <div style={{
            padding:      "12px 16px",
            borderTop:    "1px solid var(--border)",
            background:   "var(--bg-primary)",
            flexShrink:   0,
        }}>
            <div style={{
                display:      "flex",
                alignItems:   "flex-end",  // align to bottom for multiline
                gap:          10,
                background:   "var(--bg-secondary)",
                border:       "1.5px solid var(--border)",
                borderRadius: 14,
                padding:      "8px 8px 8px 14px",
                transition:   "border-color 0.15s",
            }}
                onFocusCapture={e =>
                    e.currentTarget.style.borderColor = "var(--accent)"
                }
                onBlurCapture={e =>
                    e.currentTarget.style.borderColor = "var(--border)"
                }
            >
                {/* ── Attach button ── */}
                <button
                    title="Attach file"
                    disabled={disabled}
                    style={{
                        background:   "none",
                        border:       "none",
                        cursor:       disabled ? "not-allowed" : "pointer",
                        padding:      6,
                        borderRadius: 8,
                        color:        "var(--text-muted)",
                        display:      "flex",
                        alignItems:   "center",
                        flexShrink:   0,
                        marginBottom: 2,
                        transition:   "color 0.15s",
                    }}
                    onMouseEnter={e => {
                        if (!disabled)
                            e.currentTarget.style.color = "var(--accent)";
                    }}
                    onMouseLeave={e =>
                        e.currentTarget.style.color = "var(--text-muted)"
                    }
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19
                                 a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                    </svg>
                </button>

                {/* ── Emoji button ── */}
                <button
                    title="Emoji"
                    disabled={disabled}
                    style={{
                        background:   "none",
                        border:       "none",
                        cursor:       disabled ? "not-allowed" : "pointer",
                        padding:      6,
                        borderRadius: 8,
                        color:        "var(--text-muted)",
                        display:      "flex",
                        alignItems:   "center",
                        flexShrink:   0,
                        marginBottom: 2,
                        transition:   "color 0.15s",
                        fontSize:     18,
                    }}
                    onMouseEnter={e => {
                        if (!disabled)
                            e.currentTarget.style.color = "var(--accent)";
                    }}
                    onMouseLeave={e =>
                        e.currentTarget.style.color = "var(--text-muted)"
                    }
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 13s1.5 2 4 2 4-2 4-2" />
                        <line x1="9"  y1="9"  x2="9.01"  y2="9" />
                        <line x1="15" y1="9"  x2="15.01" y2="9" />
                    </svg>
                </button>

                {/* ── Textarea ── */}
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Message"
                    disabled={disabled}
                    rows={1}
                    style={{
                        flex:       1,
                        border:     "none",
                        background: "transparent",
                        outline:    "none",
                        resize:     "none",
                        fontSize:   14,
                        lineHeight: 1.55,
                        color:      "var(--text-primary)",
                        padding:    "4px 0",
                        maxHeight:  120,
                        overflowY:  "auto",
                        fontFamily: "Inter, sans-serif",
                    }}
                />

                {/* ── Send button ── */}
                <button
                    onClick={handleSend}
                    disabled={isEmpty || sending || disabled}
                    title="Send"
                    style={{
                        width:          38,
                        height:         38,
                        borderRadius:   "50%",
                        border:         "none",
                        background:     isEmpty || sending || disabled
                            ? "var(--border)"
                            : "var(--accent)",
                        color:          isEmpty || sending || disabled
                            ? "var(--text-muted)"
                            : "#fff",
                        display:        "flex",
                        alignItems:     "center",
                        justifyContent: "center",
                        flexShrink:     0,
                        cursor:         isEmpty || sending || disabled
                            ? "not-allowed"
                            : "pointer",
                        transition:     "background 0.2s, color 0.2s",
                    }}
                    onMouseEnter={e => {
                        if (!isEmpty && !sending && !disabled)
                            e.currentTarget.style.background = "var(--accent-hover)";
                    }}
                    onMouseLeave={e => {
                        if (!isEmpty && !sending && !disabled)
                            e.currentTarget.style.background = "var(--accent)";
                    }}
                >
                    {sending ? (
                        // Spinner while sending
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5"
                            strokeLinecap="round" strokeLinejoin="round"
                            style={{ animation: "spin 0.8s linear infinite" }}>
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83
                                     M16.24 16.24l2.83 2.83M2 12h4M18 12h4
                                     M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                    ) : (
                        // Send arrow
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5"
                            strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Hint text */}
            <p style={{
                fontSize:   11,
                color:      "var(--text-muted)",
                marginTop:  6,
                textAlign:  "center",
            }}>
                Enter to send &nbsp;·&nbsp; Shift + Enter for new line
            </p>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

export default InputBar;