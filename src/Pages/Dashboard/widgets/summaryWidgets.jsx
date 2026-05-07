import React from "react";

const cards = [
  { key: "total", label: "Total tasks", color: "#534AB7", sub: "this sprint" },
  {
    key: "overdue",
    label: "OverDue",
    color: "#1D9E75",
    sub: "Need Action",
  },
  { key: "todo", label: "To do", color: "#888780", sub: "yet to start" },
  {
    key: "unassignedTasks",
    label: "Unassigned",
    color: "#EF9F27",
    sub: "Assigned Now",
  },
];

function SummaryWidgets({ summaryWidgetData }) {
  if (!summaryWidgetData) return null;
  console.log(summaryWidgetData,"summaryWidgetData");
  

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 12,
      }}
    >
      {cards.map(({ key, label, color, sub }) => (
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

export default SummaryWidgets;
