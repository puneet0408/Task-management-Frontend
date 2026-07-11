import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toSlug } from "../../../Utils/srugs";
import { S } from "./dashboardStyles";

const cards = [
  { key: "total",       tab: "Total Tasks",      label: "Total tasks",  color: "#7367f0", bg: "#ECEAFD", sub: "this sprint",   icon: "ti-layout-kanban" },
  { key: "overdue",     tab: "Over Due Task",     label: "Overdue",      color: "#E24B4A", bg: "#FCEBEB", sub: "need action",   icon: "ti-clock" },
  { key: "todo",        tab: "Todo Tasks",        label: "To do",        color: "#888780", bg: "#F1EFE8", sub: "yet to start",  icon: "ti-circle-dot" },
  { key: "unassignedTasks", tab: "Unassigned Tasks", label: "Unassigned", color: "#EF9F27", bg: "#FAEEDA", sub: "assign now",  icon: "ti-user-question" },
];

function SummaryWidgets({ summaryWidgetData }) {
  const navigate    = useNavigate();
  const { companySlug } = useParams();
  const { currentUser } = useSelector((s) => s.userListPage);
  const projectName = currentUser?.preferences?.activeProject?.projectName;
  const projectSlug = toSlug(projectName);

  const handleClick = (key, tab) => {
    navigate(`/${companySlug}/${projectSlug}/result?filter=${key}&tab=${tab}`);
  };

  if (!summaryWidgetData) return null;

  return (
    <div style={styles.grid}>
      {cards.map(({ key, label, color, bg, sub, tab, icon }) => (
        <div
          key={key}
          onClick={() => handleClick(key, tab)}
          style={styles.card}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = color;
            e.currentTarget.style.boxShadow = `0 4px 16px ${color}18`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#ebebeb";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {/* top row — label + icon */}
          <div style={styles.topRow}>
            <p style={styles.label}>{label}</p>
            <div style={{ ...styles.iconWrap, background: bg, color }}>
              <i className={`ti ${icon}`} aria-hidden="true" />
            </div>
          </div>

          {/* big number */}
          <p style={{ ...styles.value, color }}>
            {summaryWidgetData[key] ?? 0}
          </p>

          {/* divider */}
          <div style={styles.divider} />

          {/* bottom row */}
          <div style={styles.bottomRow}>
            <span style={{ ...styles.dot, background: color }} />
            <span style={styles.sub}>{sub}</span>
            <i className="ti ti-arrow-right" style={{ ...styles.arrow, color }} aria-hidden="true" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default SummaryWidgets;

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 12,
  },
  card: {
    background: "#fff",
    border: "1px solid #ebebeb",
    borderRadius: 12,
    padding: "16px 18px",
    cursor: "pointer",
    transition: "border-color 0.2s, box-shadow 0.2s",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 12,
    color: "#888",
    margin: 0,
    fontWeight: 500,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    flexShrink: 0,
  },
  value: {
    fontSize: 32,
    fontWeight: 500,
    margin: 0,
    lineHeight: 1,
  },
  divider: {
    height: 1,
    background: "#f5f5f5",
  },
  bottomRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    flexShrink: 0,
  },
  sub: {
    fontSize: 11,
    color: "#aaa",
    flex: 1,
  },
  arrow: {
    fontSize: 14,
    flexShrink: 0,
  },
};