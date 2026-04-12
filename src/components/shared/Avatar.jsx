import { useMemo } from "react";

// Deterministic color from name — same name always gets same color
const PALETTE = [
    "#7c6ff7", // purple  (accent)
    "#f4845f", // coral
    "#2ec4b6", // teal
    "#ff6b6b", // red
    "#06d6a0", // emerald
    "#118ab2", // blue
    "#f7b731", // amber
    "#a29bfe", // lavender
];

function getColor(name = "") {
    const index = name
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0) % PALETTE.length;
    return PALETTE[index];
}

function getInitials(name = "") {
    return name
        .trim()
        .split(" ")
        .filter(Boolean)
        .map(word => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function Avatar({ name = "", size = 40, showStatus = false, isOnline = false }) {
    const color  = useMemo(() => getColor(name),    [name]);
    const initials = useMemo(() => getInitials(name), [name]);

    return (
        <div style={{ position: "relative", flexShrink: 0, width: size, height: size }}>
            {/* Circle */}
            <div style={{
                width:          size,
                height:         size,
                borderRadius:   "50%",
                background:     color,
                color:          "#fff",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                fontWeight:     700,
                fontSize:       size * 0.35,
                letterSpacing:  "0.5px",
                userSelect:     "none",
            }}>
                {initials}
            </div>

            {/* Online status dot */}
            {showStatus && (
                <div style={{
                    position:     "absolute",
                    bottom:       1,
                    right:        1,
                    width:        size * 0.28,
                    height:       size * 0.28,
                    borderRadius: "50%",
                    background:   isOnline ? "#22c55e" : "var(--text-muted)",
                    border:       "2px solid var(--bg-primary)",
                    transition:   "background 0.2s",
                }} />
            )}
        </div>
    );
}

export default Avatar;
