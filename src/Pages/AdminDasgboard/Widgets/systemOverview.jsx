import React from "react";

const cards = [
  { key: "totalProjects", label: "Total Projects", color: "#534AB7", sub: "" },
  {
    key: "totalUsers",
    label: "Total Users",
    color: "#1D9E75",
    sub: "",
  },
  { key: "totalSprints", label: "Total Sprint", color: "#888780", sub: "" },
  {
    key: "totalTasks",
    label: "Total Task",
    color: "#EF9F27",
    sub: "",
  },
];

const Taskcards = [
  { key: "OverdueTaskcount", label: "Overdue Task", color: "#534AB7", sub: "All Project" },
  {
    key: "critialTaskCount",
    label: "Critical Tasks",
    color: "#1D9E75",
    sub: "Prority 1",
  },
  { key: "noduedatecount", label: "No Due Date", color: "#888780", sub: "Set Date" },
  {
    key: "unassignedCount",
    label: "Unassigned",
    color: "#EF9F27",
    sub: "need Owner",
  },
];

function SystemOverview({ summaryWidgetData , type }) {
  if (!summaryWidgetData) return null;
  console.log(summaryWidgetData,"summaryWidgetData");
  
 const activeWidget = type == "summary" ? cards : Taskcards;
  return (
    <div    
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 12,
      }}
    >
      {activeWidget.map(({ key, label, color, sub }) => (
        <div
          key={key}
          style={{ background: "#f5f5f5", borderRadius: 8, padding: "1rem" }}
        >
          <p style={{ fontSize: 12, color: "#666", margin: "0 0 8px" }}>
            {label}
          </p>
          <p
            style={{
              fontSize: 28,
              fontWeight: 500,
              color,
              margin: "0 0 6px",
              lineHeight: 1,
            }}
          >
            {summaryWidgetData[key] ?? 0}
          </p>
          <p
            style={{
              fontSize: 11,
              color: "#999",
              display: "flex",
              alignItems: "center",
              margin: 0,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: color,
                display: "inline-block",
                marginRight: 5,
              }}
            />
            {sub}
          </p>
        </div>
      ))}
    </div>
  );
}

export default SystemOverview;
