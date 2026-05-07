import React from "react";

const STATUS_COLORS = {
  todo: "#06B6D4",
  inProgress: "#F59E0B",
  done: "#10B981",
  in_qa: "#A855F7",
  closed: "#9CA3AF",
  live: "#3B82F6",
};

const STATUS_LABELS = {
  todo: "Todo",
  inProgress: "In Progress",
  done: "Done",
  in_qa: "QA",
  closed: "Closed",
  live: "Live",
};

function TeamStatusChart({ data = [] }) {
  // Sort users by highest task count
  const sorted = [...data].sort(
    (a, b) => b.count - a.count
  );

  const max = sorted[0]?.count || 1;

  return (
    <div style={styles.card}>
      {/* TITLE */}
      <h3 style={styles.title}>
        State wise No. of Items for Individuals
      </h3>

      {/* CHART */}
      <div style={styles.wrapper}>
        {sorted.map((user, index) => {
          const total =
            (user.todo || 0) +
            (user.inProgress || 0) +
            (user.done || 0) +
            (user.in_qa || 0) +
            (user.closed || 0) +
            (user.live || 0);

          return (
            <div key={index} style={styles.row}>
              {/* USER NAME */}
              <div style={styles.name}>
                {user.name || "Unassigned"}
              </div>

              {/* STATUS BAR */}
              <div style={styles.track}>
                {Object.entries(STATUS_COLORS).map(
                  ([status, color]) => {
                    const value = user[status] || 0;

                    if (value === 0) return null;

                    const width =
                      (value / total) * 100;

                    return (
                      <div
                        key={status}
                        style={{
                          width: `${width}%`,
                          background: color,
                          height: "100%",
                        }}
                        title={`${STATUS_LABELS[status]} : ${value}`}
                      />
                    );
                  }
                )}
              </div>

              {/* TOTAL COUNT */}
              <div style={styles.count}>
                {user.count}
              </div>
            </div>
          );
        })}
      </div>

      {/* LEGEND */}
      <div style={styles.legend}>
        {Object.entries(STATUS_COLORS).map(
          ([status, color]) => (
            <div
              key={status}
              style={styles.legendItem}
            >
              <span
                style={{
                  ...styles.legendDot,
                  background: color,
                }}
              />

              <span>
                {STATUS_LABELS[status]}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default TeamStatusChart;

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
    marginBottom: 24,
    fontSize: 18,
    fontWeight: 600,
    color: "#222",
  },

  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  row: {
    display: "grid",
    gridTemplateColumns: "120px 1fr 30px",
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
    height: 14,
    background: "#e5e5e5",
    borderRadius: 999,
    overflow: "hidden",
    display: "flex",
  },

  count: {
    fontSize: 13,
    fontWeight: 600,
    color: "#444",
    textAlign: "right",
  },

  legend: {
    marginTop: 24,
    display: "flex",
    flexWrap: "wrap",
    gap: 14,
  },

  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    color: "#555",
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
  },
};