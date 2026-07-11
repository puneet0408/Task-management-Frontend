import React from "react";
import { PieChart, Pie, Cell } from "recharts";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toSlug } from "../../../Utils/srugs";


// dashboardStyles.js
 const S = {
  card:       { background: "#fff", border: "1px solid #ebebeb", borderRadius: 12, padding: 18, width: "100%", boxSizing: "border-box" },
  header:     { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16, gap: 12, flexWrap: "wrap" },
  title:      { fontSize: 14, fontWeight: 500, color: "#111", margin: "0 0 3px" },
  sub:        { fontSize: 11, color: "#aaa", margin: 0 },
  legend:     { display: "flex", gap: 10, flexWrap: "wrap" },
  legendItem: { display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#666" },
  legendDot:  { width: 8, height: 8, borderRadius: 2, flexShrink: 0 },
  divider:    { height: 1, background: "#f5f5f5", margin: "12px 0" },
  row:        { display: "grid", gridTemplateColumns: "140px 1fr auto", alignItems: "center", gap: 12, cursor: "pointer" },
  nameWrap:   { display: "flex", alignItems: "center", gap: 8, minWidth: 0 },
  avatar:     { width: 26, height: 26, borderRadius: "50%", background: "#ECEAFD", color: "#7367f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 600, flexShrink: 0 },
  name:       { fontSize: 12, color: "#333", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  track:      { width: "100%", height: 8, background: "#f0f0f0", borderRadius: 999, overflow: "hidden", display: "flex" },
  fill:       { height: "100%", borderRadius: 999, transition: "width 0.3s ease" },
  centerLabel:{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", pointerEvents: "none", display: "flex", flexDirection: "column", alignItems: "center" },
  centerVal:  { fontSize: 22, fontWeight: 500, color: "#7367f0", lineHeight: 1 },
  centerSub:  { fontSize: 10, color: "#aaa", marginTop: 3 },
  statRow:    { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", cursor: "pointer", borderBottom: "1px solid #f5f5f5" },
  typeRow:    { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 },
  typeChip:   { display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 20 },
  typeChipDot:{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0 },
  priorityDot:{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap" },
};

function BugRateWidget({ data }) {
  const navigate = useNavigate();
  const { companySlug } = useParams();
  const { currentUser } = useSelector((s) => s.userListPage);
  const projectSlug = toSlug(currentUser?.preferences?.activeProject?.projectName);

  const { totalTasks = 0, openbugs = 0, closedbugs = 0 } = data[0] || {};
  const totalBugs = openbugs + closedbugs;
  const percentage = totalTasks > 0 ? Math.round((totalBugs / totalTasks) * 100) : 0;

  const chartData = [
    { name: "Bugs",      value: percentage },
    { name: "Remaining", value: 100 - percentage },
  ];

  const handleClick = (filter, tab) => {
    navigate(`/${companySlug}/${projectSlug}/result?filter=${filter}&tab=${tab}`);
  };

  return (
    <div style={S.card}>
      <div style={S.header}>
        <div>
          <p style={S.title}>Bug rate this sprint</p>
          <p style={S.sub}>Open and closed bugs</p>
        </div>
        <span style={{ fontSize: 11, fontWeight: 500, background: "#FCEBEB", color: "#E24B4A", padding: "3px 10px", borderRadius: 20 }}>
          {percentage}% bugs
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
        <PieChart width={180} height={180}>
          <Pie data={chartData} dataKey="value" cx="50%" cy="50%"
            innerRadius={52} outerRadius={68} startAngle={90} endAngle={450} stroke="none">
            <Cell fill="#E24B4A" onClick={() => handleClick("bug", "Bugs")} style={{ cursor: "pointer" }} />
            <Cell fill="#ECEAFD" />
          </Pie>
        </PieChart>
        <div style={S.centerLabel}>
          <span style={{ fontSize: 22, fontWeight: 500, color: "#E24B4A", lineHeight: 1 }}>{percentage}%</span>
          <span style={{ fontSize: 10, color: "#aaa", marginTop: 3 }}>bug rate</span>
        </div>
      </div>

      <p style={{ textAlign: "center", fontSize: 12, color: "#aaa", margin: "0 0 14px" }}>
        {totalBugs} bugs of {totalTasks} tasks
      </p>

      <div style={S.divider} />

      <div onClick={() => handleClick("openbug", "Open Bugs")} style={S.statRow}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#E24B4A", display: "inline-block" }} />
          <span style={{ fontSize: 12, color: "#555" }}>Open bugs</span>
        </div>
        <span style={{ fontSize: 14, fontWeight: 500, color: "#E24B4A" }}>{openbugs}</span>
      </div>

      <div onClick={() => handleClick("closedbug", "Closed Bugs")} style={S.statRow}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#1D9E75", display: "inline-block" }} />
          <span style={{ fontSize: 12, color: "#555" }}>Closed</span>
        </div>
        <span style={{ fontSize: 14, fontWeight: 500, color: "#1D9E75" }}>{closedbugs}</span>
      </div>
    </div>
  );
}

export default BugRateWidget;