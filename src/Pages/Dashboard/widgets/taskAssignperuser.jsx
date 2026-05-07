import React from "react";

const COLORS = [
  "#534AB7",
  "#1D9E75",
  "#D85A30",
  "#378ADD",
  "#D4537E",
  "#BA7517",
  "#639922",
  "#E24B4A",
];

function TeamWorkloadChart({ data = [] }) {
  // Sort highest count first
  const sorted = [...data]
    .map((item) => ({
      name: item.name || "Unassigned",
      count: item.count,
    }))
    .sort((a, b) => b.count - a.count);

  const max = sorted[0]?.count || 1;

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Tasks assigned per user</h3>

      <div style={styles.wrapper}>
        {sorted.map((item, index) => {
          const percentage = (item.count / max) * 100;

          return (
            <div key={index} style={styles.row}>
              {/* User Name */}
              <div style={styles.name}>
                {item.name}
              </div>

              {/* Progress Bar */}
              <div style={styles.track}>
                <div
                  style={{
                    ...styles.fill,
                    width: `${percentage}%`,
                    background:
                      COLORS[index % COLORS.length],
                  }}
                />
              </div>

              {/* Count */}
              <div style={styles.count}>
                {item.count}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TeamWorkloadChart;

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
    marginBottom: 20,
    fontSize: 18,
    fontWeight: 600,
    color: "#222",
  },

  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  row: {
    display: "grid",
    gridTemplateColumns: "90px 1fr 24px",
    alignItems: "center",
    gap: 12,
  },

  name: {
    fontSize: 13,
    color: "#444",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  track: {
    width: "100%",
    height: 10,
    background: "#e5e5e5",
    borderRadius: 999,
    overflow: "hidden",
  },

  fill: {
    height: "100%",
    borderRadius: 999,
    transition: "width 0.3s ease",
  },

  count: {
    fontSize: 13,
    fontWeight: 600,
    color: "#444",
    textAlign: "right",
  },
};