import React from "react";
import { useNavigate , useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toSlug } from "../../../Utils/srugs";

const cards = [
  { key: "total",tab:"Total Tasks", label: "Total tasks", color: "#534AB7", sub: "this sprint" },
  {
    key: "overdue",
    label: "OverDue",
    tab:"Over Due Task",
    color: "#1D9E75",
    sub: "Need Action",
  },
  { key: "todo", tab:"Todo Tasks", label: "To do", color: "#888780", sub: "yet to start" },
  {
    key: "unassignedTasks",
    label: "Unassigned",
    tab:" Unassigned Tasks",
    color: "#EF9F27",
    sub: "Assigned Now",
  },
];

function SummaryWidgets({ summaryWidgetData }) {
  const navigate = useNavigate();
  const { companySlug } = useParams();
  const { currentUser } = useSelector((state) => state.userListPage);
  const projectName = currentUser?.preferences?.activeProject?.projectName;
  const projectSlug = toSlug(projectName);
  const handleSummaryClick = (key , tab) => {
     navigate(
      `/${companySlug}/${projectSlug}/result?filter=${key}&tab=${tab}`,
    );
  };

  if (!summaryWidgetData) return null;
  console.log(summaryWidgetData, "summaryWidgetData");

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 12,
      }}
    >
      {cards.map(({ key, label, color, sub , tab }) => (
        <div
          onClick={() => handleSummaryClick(key , tab)}
          key={key}
          style={{ background: "#f5f5f5", borderRadius: 8, padding: "1rem",cursor:"pointer" }}
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
