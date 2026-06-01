import React from "react";

const STATUS_STYLES = {
  done: {
    background: "#E1F5EE",
    color: "#085041",
    label: "Done",
  },

  live: {
    background: "#E1F5EE",
    color: "#085041",
    label: "Live",
  },

  in_progress: {
    background: "#E6F1FB",
    color: "#0C447C",
    label: "In Progress",
  },

  New: {
    background: "#EEEDFE",
    color: "#3C3489",
    label: "New",
  },

  todo: {
    background: "#FAEEDA",
    color: "#633806",
    label: "Todo",
  },

  closed: {
    background: "#F1EFE8",
    color: "#5F5E5A",
    label: "Closed",
  },

  overdue: {
    background: "#FCEBEB",
    color: "#791F1F",
    label: "Overdue",
  },
};

function formatDate(date) {
  if (!date) return "No due date";

  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

function CriticalTasks({ data = [] }) {
    console.log(data,"data");
    
  if (!data.length) {
    return (
      <div style={styles.card}>
        <h3 style={styles.title}>
          Critical tasks
        </h3>

        <p style={styles.empty}>
          No critical tasks found
        </p>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>
            Critical tasks  - <span style={styles.subtitle}>Needs immediate attention</span>
          </h3>
        </div>
        <div style={styles.countBadge}>
          {data.length}
        </div>
      </div>
      <div style={styles.wrapper}>
        {data.map((item, index) => {
          const statusStyle =
            STATUS_STYLES[item.taskStatus] ||
            STATUS_STYLES["New"];
          return (
            <div
              key={item._id || index}
              style={styles.taskCard}
            >
              <div style={styles.left}>
                <div style={styles.taskTitle}>
                  {item.title}
                </div>
              </div>
              <div
                style={{
                  ...styles.statusBadge,
                  background:
                    statusStyle.background,
                  color: statusStyle.color,
                }}
              >
                {statusStyle.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default CriticalTasks;
const styles = {
  card: {
    background: "#f5f5f5",
    borderRadius: 14,
    padding: 20,
    width: "100%",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 600,
    color: "#111827",
  },
  subtitle: {
    margin: "4px 0 0",
    fontSize: 12,
    color: "#6b7280",
  },
  countBadge: {
    minWidth: 32,
    height: 32,
    borderRadius: "50%",
    background: "#fee2e2",
    color: "#dc2626",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 600,
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  taskCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flex: 1,
    marginRight: 10,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: "#1f2937",
    lineHeight: 1.4,
    marginBottom: 4,
  },

  date: {
    fontSize: 12,
    color: "#9ca3af",
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: 500,
    padding: "6px 12px",
    borderRadius: 999,
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 95,
  },
  empty: {
    margin: 0,
    color: "#9ca3af",
    fontSize: 14,
  },
};