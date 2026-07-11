import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toSlug } from "../../../Utils/srugs";
import { S } from "./dashboardStyles";

const BAR_COLORS = ["#7367f0","#1D9E75","#E24B4A","#EF9F27","#378ADD","#D4537E","#639922","#534AB7"];

function TeamWorkloadChart({ data = [] }) {
  const navigate = useNavigate();
  const { companySlug } = useParams();
  const { currentUser } = useSelector((s) => s.userListPage);
  const projectSlug = toSlug(currentUser?.preferences?.activeProject?.projectName);

  const sorted = [...data]
    .map((item) => ({ name: item.name || "Unassigned", count: item.count, userId: item.userId }))
    .sort((a, b) => b.count - a.count);

  const max = sorted[0]?.count || 1;

  const handleClick = (item) => {
    if (!item.userId) return;
    navigate(`/${companySlug}/${projectSlug}/result?filter=${item.userId}&tab=${item.name}&key=assignedTo`);
  };

  return (
    <div style={S.card}>
      <div style={S.header}>
        <div>
          <p style={S.title}>Tasks assigned per user</p>
          <p style={S.sub}>Workload distribution</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {sorted.map((item, index) => {
          const pct = (item.count / max) * 100;
          const color = BAR_COLORS[index % BAR_COLORS.length];
          const initials = item.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
          return (
            <div key={index} style={S.row} onClick={() => handleClick(item)}>
              <div style={S.nameWrap}>
                <div style={{ ...S.avatar, background: color + "22", color }}>{initials}</div>
                <span style={S.name}>{item.name}</span>
              </div>
              <div style={S.track}>
                <div style={{ ...S.fill, width: `${pct}%`, background: color }} />
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

export default TeamWorkloadChart;