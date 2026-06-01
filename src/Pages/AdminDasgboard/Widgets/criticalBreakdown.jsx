import React from "react";

function PriorityBreakdown({ summaryWidgetData = [] }) {
  // Priority mapping
  const priorityMap = {
    1: {
      label: "High",
      color: "#ef4444",
    },
    2: {
      label: "Medium",
      color: "#f59e0b",
    },
    3: {
      label: "Low",
      color: "#3b82f6",
    },
  };

  // Total count
  const total = summaryWidgetData.reduce((sum, item) => sum + item.total, 0);

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Tasks by priority — all projects</h3>

      <div style={{ marginTop: 16 }}>
        {summaryWidgetData.map((item, index) => {
          const priority = priorityMap[item?._id];

          // percentage width
          const width = `${(item?.total / total) * 100}%`;

          return (
            <div key={index} style={styles.row}>
              {/* Label */}
              <div style={styles.label}>
                {priority?.label || "Unknown"}
              </div>

              {/* Progress Bar */}
              <div style={styles.progressWrapper}>
                <div
                  style={{
                    ...styles.progress,
                    width,
                    background: priority?.color,
                  }}
                />
              </div>

              {/* Count */}
              <div style={styles.count}>{item.total}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PriorityBreakdown;

const styles = {
card: {
   background: "#f5f5f5",
    borderRadius: 12,
    padding: 18,
    width: "100%",
    boxSizing: "border-box",
},

title: {
  margin: 0,
  fontSize: 18,
  fontWeight: 600,
  color: "#222",
},

  row: {
    display: "grid",
    gridTemplateColumns: "90px 1fr 24px",
    alignItems: "center",
    gap: 12,
  },

  label: {
    fontSize: 14,
    color: "#555",
  },

  progressWrapper: {
    height: 6,
    background: "#e5e5e5",
    borderRadius: 999,
    overflow: "hidden",
  },

  progress: {
    height: "100%",
    borderRadius: 999,
  },

  count: {
    fontSize: 14,
    color: "#444",
    textAlign: "right",
  },
};