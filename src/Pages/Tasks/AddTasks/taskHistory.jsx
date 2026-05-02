import { useState } from "react";

/* ---------------- Helpers ---------------- */

const fieldNames = {
  originalTIme: "original time",
  RemainingTIme: "remaining time",
  CompleteTIme: "complete time",
  assignedTo: "assigned to",
};

const cleanField = (f) => fieldNames[f] || f;

const initials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const fmtTime = (iso) =>
  new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

/* ---------------- Diff Renderer ---------------- */

function DiffValue({ c }) {
  const f = c?.field?.toLowerCase();

  // Handle tags
  if (f === "tags") {
    const oldTags = (c?.oldValue || [])
      .map((t) => t?.label || t?.value)
      .join(", ");
    const newTags = (c?.newValue || [])
      .map((t) => t?.label || t?.value)
      .join(", ");

    return (
      <div style={styles.diffRow}>
        <span style={styles.oldVal}>{oldTags || "none"}</span>
        <span style={styles.arrow}>→</span>
        <span style={styles.newVal}>{newTags || "none"}</span>
      </div>
    );
  }

  // Handle subtasks
  if (f === "subtasks") {
    return (
      <div>
        {(c.newValue || []).map((s, i) => {
          const old = (c.oldValue || [])[i];
          const changed = old && old.completed !== s.completed;

          return (
            <div key={i} style={styles.subtask}>
              {s.title} {changed && (s.completed ? "✔ done" : "↺ undone")}
            </div>
          );
        })}
      </div>
    );
  }

  const oldVal = c.oldValue != null ? String(c.oldValue) : "";
  const newVal = c.newValue != null ? String(c.newValue) : "";

  return (
    <div style={styles.diffRow}>
      {oldVal && <span style={styles.oldVal}>{oldVal}</span>}
      {oldVal && <span style={styles.arrow}>→</span>}
      <span style={styles.newVal}>{newVal}</span>
    </div>
  );
}

/* ---------------- Modal ---------------- */

function HistoryModal({ history, onClose }) {
  if (!history) return null;

  return (
    <div
      style={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.modalHeader}>
          <div style={styles.avatar}>{initials(history.userId?.name)}</div>

          <div style={{ flex: 1 }}>
            <div style={styles.modalTitle}>
              {history.userId?.name} updated this task
            </div>
            <div style={styles.modalTime}>{fmtTime(history.createdAt)}</div>
          </div>

          <button style={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={styles.modalBody}>
          {history.changes.map((c) => (
            <div key={c._id} style={styles.simpleRow}>
              <div style={styles.field}>{cleanField(c.field)}</div>
              <DiffValue c={c} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Row ---------------- */

function HistoryRow({ history, onClick }) {
  const multi = history.changes.length > 1;

  return (
    <div
      style={{
        ...styles.row,
        ...(multi ? styles.rowClickable : {}),
      }}
      onClick={multi ? onClick : undefined}
    >
      <div style={styles.avatar}>{initials(history.userId?.name)}</div>

      <div style={{ flex: 1 }}>
        <div style={styles.rowTop}>
          <span style={styles.name}>{history.userId?.name}</span>

          <span style={styles.time}>{fmtTime(history.createdAt)}</span>
        </div>

        <div style={styles.rowSub}>
          {multi ? (
            <>
              updated {cleanField(history.changes[0]?.field)}
              {` +${history.changes.length - 1} more`}
            </>
          ) : (
            <>
              <span style={{ marginRight: 6 }}>
                {cleanField(history.changes[0]?.field)}
              </span>
              <DiffValue c={history.changes[0]} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Main ---------------- */

export default function TaskHistory({ historyData = [] }) {
  const [selected, setSelected] = useState(null);

  return (
    <div style={styles.container}>
      {historyData.map((h) => (
        <HistoryRow key={h._id} history={h} onClick={() => setSelected(h)} />
      ))}

      {selected && (
        <HistoryModal history={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

/* ---------------- Styles ---------------- */

const styles = {
  container: {
    maxHeight: "350px",
    overflowY: "auto",
    paddingRight: "4px",
  },

  row: {
    display: "flex",
    gap: 10,
    padding: "10px 12px",
    borderBottom: "1px solid #f1f5f9",
  },

  rowClickable: {
    cursor: "pointer",
  },

  avatar: {
    width: 26,
    height: 26,
    borderRadius: "50%",
    background: "#eef2ff",
    color: "#4338ca",
    fontSize: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  rowTop: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
  },

  name: {
    fontWeight: 500,
  },

  time: {
    fontSize: 11,
    color: "#9ca3af",
  },

  rowSub: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },

  /* Modal */

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  modal: {
    background: "#fff",
    borderRadius: 10,
    width: 500,
    maxWidth: "95vw",
    height: "70vh",
    display: "flex",
    flexDirection: "column",
  },

  modalHeader: {
    display: "flex",
    gap: 10,
    padding: "12px",
    borderBottom: "1px solid #eee",
  },

  modalTitle: {
    fontSize: 14,
    fontWeight: 500,
  },

  modalTime: {
    fontSize: 12,
    color: "#9ca3af",
  },

  closeBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },

  modalBody: {
    overflowY: "auto",
    padding: "12px",
  },

  simpleRow: {
    marginBottom: 10,
    borderBottom: "1px solid #f3f4f6",
    paddingBottom: 6,
  },

  field: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 3,
  },

  diffRow: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
  },

  oldVal: {
    textDecoration: "line-through",
    color: "#64748b",
    fontSize: 12,
  },

  newVal: {
    color: "#0f766e",
    fontSize: 12,
  },

  arrow: {
    color: "#9ca3af",
  },

  subtask: {
    fontSize: 12,
    marginBottom: 3,
  },
};
