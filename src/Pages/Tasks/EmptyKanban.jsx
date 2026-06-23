import React from "react";

const EmptyKanban = ({ handleWorkItemChange }) => {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "80px 20px",
        textAlign: "center",
        border: "1px solid #e5e7eb",
        minHeight: "450px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "#EEF4FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "34px",
          marginBottom: "16px",
        }}
      >
        📋
      </div>

      <h3
        style={{
          fontSize: "22px",
          fontWeight: 600,
          color: "#111827",
          marginBottom: "8px",
        }}
      >
        No Work Items Found
      </h3>

      <p
        style={{
          maxWidth: "420px",
          color: "#6B7280",
          fontSize: "14px",
          lineHeight: "22px",
          marginBottom: "24px",
        }}
      >
        No stories, tasks, or bugs are available in this sprint yet.
        Create your first story to start planning and tracking work.
      </p>

      <button
        onClick={() =>
          handleWorkItemChange({
            value: "story",
            isedit: false,
          })
        }
        style={{
          background: "#2563EB",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "10px 18px",
          fontSize: "14px",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(37,99,235,.25)",
        }}
      >
        + Create First Story
      </button>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "28px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <span style={badgeStyle}>📖 Stories</span>
        <span style={badgeStyle}>✅ Tasks</span>
        <span style={badgeStyle}>🐞 Bugs</span>
      </div>
    </div>
  );
};

const badgeStyle = {
  padding: "6px 12px",
  background: "#F9FAFB",
  border: "1px solid #E5E7EB",
  borderRadius: "20px",
  fontSize: "12px",
  color: "#4B5563",
};

export default EmptyKanban;