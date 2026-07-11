import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toSlug } from "../../../Utils/srugs";
import { S } from "./dashboardStyles";

const PRIORITY_META = {
  1: { label: "High",   color: "#E24B4A", bg: "#FCEBEB" },
  2: { label: "Medium", color: "#EF9F27", bg: "#FAEEDA" },
  3: { label: "Low",    color: "#7367f0", bg: "#ECEAFD" },
};

function PriorityBreakdown({ data = [] }) {
  const navigate = useNavigate();
  const { companySlug } = useParams();
  const { currentUser } = useSelector((s) => s.userListPage);
  const projectSlug = toSlug(currentUser?.preferences?.activeProject?.projectName);

  const total = data.reduce((sum, item) => sum + item.count, 0);

  const handleClick = (item) => {
    const tabMap = { 1: "high", 2: "medium", 3: "low" };
    navigate(`/${companySlug}/${projectSlug}/result?filter=${item.priority}&tab=${tabMap[item.priority]}&key=priority`);
  };

  return (
    <div style={S.card}>
      <div style={S.header}>
        <div>
          <p style={S.title}>Priority breakdown</p>
          <p style={S.sub}>Tasks per priority level</p>
        </div>
        <div style={S.legend}>
          {Object.entries(PRIORITY_META).map(([key, meta]) => (
            <span key={key} style={S.legendItem}>
              <span style={{ ...S.legendDot, background: meta.color }} />
              {meta.label}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {data.map((item) => {
          const meta = PRIORITY_META[item.priority] || {};
          const width = total > 0 ? `${(item.count / total) * 100}%` : "0%";
          return (
            <div key={item.priority} style={S.row} onClick={() => handleClick(item)}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, width: 80 }}>
                <span style={{ ...S.priorityDot, background: meta.bg, color: meta.color }}>
                  {meta.label || "Unknown"}
                </span>
              </div>
              <div style={S.track}>
                <div style={{ ...S.fill, width, background: meta.color }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#111", width: 24, textAlign: "right" }}>
                {item.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PriorityBreakdown;