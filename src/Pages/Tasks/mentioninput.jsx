import { useState, useRef, useEffect } from "react";

// ─── MentionInput component ───────────────────────────────────────────────────
function MentionInput({ value, onChange, projectMembers = [], placeholder }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [mentionQuery, setMentionQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    const val = e.target.value;
    onChange(val);

    // detect @word at cursor position
    const cursor = e.target.selectionStart;
    const textUpToCursor = val.slice(0, cursor);
    const match = textUpToCursor.match(/@(\w*)$/);

    if (match) {
      const query = match[1].toLowerCase();
      setMentionQuery(query);
      const filtered = projectMembers.filter((m) =>
        m.name.toLowerCase().includes(query)
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedIndex(0);
    } else {
      setShowSuggestions(false);
    }
  };

  const insertMention = (member) => {
    const textarea = textareaRef.current;
    const cursor = textarea.selectionStart;
    const textUpToCursor = value.slice(0, cursor);
    const textAfterCursor = value.slice(cursor);

    // replace the @query with @Name
    const replaced = textUpToCursor.replace(/@(\w*)$/, `@${member.name} `);
    const newValue = replaced + textAfterCursor;

    onChange(newValue, member); // pass member so parent can store mentionedUserIds

    setShowSuggestions(false);

    // refocus textarea
    setTimeout(() => {
      textarea.focus();
      const newCursor = replaced.length;
      textarea.setSelectionRange(newCursor, newCursor);
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      if (suggestions[selectedIndex]) insertMention(suggestions[selectedIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <textarea
        ref={textareaRef}
        rows={2}
        placeholder={placeholder || "Add a comment... use @ to mention"}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        style={{
          width: "100%",
          resize: "vertical",
          fontFamily: "inherit",
          lineHeight: 1.6,
          paddingBottom: "28px",
          boxSizing: "border-box",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: "10px 12px 28px",
          fontSize: 14,
          outline: "none",
        }}
      />

      {/* @ mention dropdown */}
      {showSuggestions && (
        <div style={mentionStyles.dropdown}>
          {suggestions.map((member, i) => (
            <div
              key={member._id}
              onMouseDown={(e) => {
                e.preventDefault(); // prevent textarea blur
                insertMention(member);
              }}
              style={{
                ...mentionStyles.item,
                background: i === selectedIndex ? "#F5F3FF" : "transparent",
                color: i === selectedIndex ? "#6D28D9" : "#333",
              }}
            >
              {/* avatar */}
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                background: "#ECEAFD", color: "#7367f0",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 700, flexShrink: 0,
              }}>
                {member.name.slice(0, 2).toUpperCase()}
              </div>
              <span style={{ fontSize: 13 }}>{member.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const mentionStyles = {
  dropdown: {
    position: "absolute",
    bottom: "110%",
    left: 0,
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
    zIndex: 999,
    minWidth: 200,
    maxHeight: 180,
    overflowY: "auto",
    padding: "4px 0",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "7px 12px",
    cursor: "pointer",
    transition: "background 0.1s",
  },
};

// ─── helper: render comment text with highlighted @mentions ──────────────────
function CommentText({ text }) {
  const parts = text.split(/(@\w+(?:\s\w+)?)/g);
  return (
    <p style={{ margin: 0, fontSize: 14, color: "#4b5563", lineHeight: 1.6 }}>
      {parts.map((part, i) =>
        part.startsWith("@") ? (
          <span key={i} style={{
            color: "#7367f0", fontWeight: 600,
            background: "#ECEAFD", borderRadius: 4,
            padding: "1px 5px", fontSize: 13,
          }}>
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  );
}