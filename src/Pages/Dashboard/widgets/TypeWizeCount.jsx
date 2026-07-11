import React from "react";
import { useNavigate ,useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toSlug } from "../../../Utils/srugs";
import { S } from "./dashboardStyles";

const TYPE_META = {
  taskCount: { label: "Task", color: "#7367f0", bg: "#ECEAFD" },
  bugCount:  { label: "Bug",  color: "#E24B4A", bg: "#FCEBEB" },
};

function TypeWiseTaskCountOfUsers({ data = [] }) {
  const navigate    = useNavigate();
  const { companySlug } = useParams();
  const { currentUser } = useSelector((s) => s.userListPage);
  const projectName = currentUser?.preferences?.activeProject?.projectName;
  const projectSlug = toSlug(projectName);

  const handleClick = (status, userId) => {
    if (!userId) return;
    navigate(
      `/${companySlug}/${projectSlug}/result?filter=${userId}&tab=${status}&key=assignedTo&type=${status === "bugCount" ? "bug" : "task"}`
    );
  };

  const sorted = [...data].sort((a, b) => b.count - a.count);
  const max = sorted[0]?.count || 1;

  return (
    <div style={styles.card}>

      {/* header */}
      <div style={styles.header}>
        <div>
          <p style={styles.title}>Type wise item count</p>
          <p style={styles.sub}>Tasks and bugs per member</p>
        </div>
        <div style={styles.legend}>
          {Object.entries(TYPE_META).map(([key, meta]) => (
            <span key={key} style={styles.legendItem}>
              <span style={{ ...styles.legendDot, background: meta.color }} />
              {meta.label}
            </span>
          ))}
        </div>
      </div>

      {/* rows */}
      <div style={styles.wrapper}>
        {sorted.map((user, index) => {
          const total = (user.taskCount || 0) + (user.bugCount || 0);
          const displayName = user.name || "Unassigned";
          const initials = displayName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

          return (
            <div key={index} style={styles.row}>

              {/* avatar + name */}
              <div style={styles.nameWrap}>
                <div style={styles.avatar}>{initials}</div>
                <span style={styles.name}>{displayName}</span>
              </div>

              {/* stacked bar */}
              <div style={styles.track}>
                {Object.entries(TYPE_META).map(([key, meta]) => {
                  const value = user[key] || 0;
                  if (value === 0) return null;
                  const width = (value / total) * 100;
                  return (
                    <div
                      key={key}
                      onClick={() => handleClick(key, user?.userId)}
                      title={`${meta.label}: ${value}`}
                      style={{
                        width: `${width}%`,
                        background: meta.color,
                        height: "100%",
                        cursor: "pointer",
                        transition: "opacity 0.15s",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                    />
                  );
                })}
              </div>

              {/* per-type counts + total */}
              <div style={styles.countWrap}>
                {Object.entries(TYPE_META).map(([key, meta]) => {
                  const value = user[key] || 0;
                  if (value === 0) return null;
                  return (
                    <span key={key} style={{ ...styles.countBadge, background: meta.bg, color: meta.color }}>
                      {value} {meta.label}
                    </span>
                  );
                })}
                <span style={styles.total}>{user.count}</span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

export default TypeWiseTaskCountOfUsers;

const styles = {
  card: {
    background: "#fff",
    border: "1px solid #ebebeb",
    borderRadius: 12,
    padding: 18,
    width: "100%",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 12,
    flexWrap: "wrap",
  },
  title: {
    fontSize: 14,
    fontWeight: 500,
    color: "#111",
    margin: "0 0 3px",
  },
  sub: {
    fontSize: 11,
    color: "#aaa",
    margin: 0,
  },
  legend: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 11,
    color: "#666",
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
    flexShrink: 0,
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  row: {
    display: "grid",
    gridTemplateColumns: "140px 1fr auto",
    alignItems: "center",
    gap: 12,
  },
  nameWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    minWidth: 0,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: "50%",
    background: "#ECEAFD",
    color: "#7367f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 9,
    fontWeight: 600,
    flexShrink: 0,
  },
  name: {
    fontSize: 12,
    color: "#333",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  track: {
    width: "100%",
    height: 8,
    background: "#f0f0f0",
    borderRadius: 999,
    overflow: "hidden",
    display: "flex",
  },
  countWrap: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    flexShrink: 0,
  },
  countBadge: {
    fontSize: 10,
    fontWeight: 500,
    padding: "2px 7px",
    borderRadius: 20,
  },
  total: {
    fontSize: 13,
    fontWeight: 500,
    color: "#111",
    minWidth: 20,
    textAlign: "right",
  },
};