import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toSlug } from "../../../Utils/srugs";
import { S } from "./dashboardStyles";

const STATUS_META = {
  todo:       { label: "Todo",        color: "#888780", bg: "#F1EFE8" },
  inProgress: { label: "In Progress", color: "#EF9F27", bg: "#FAEEDA" },
  done:       { label: "Done",        color: "#1D9E75", bg: "#E1F5EE" },
  in_qa:      { label: "QA",          color: "#7367f0", bg: "#ECEAFD" },
  closed:     { label: "Closed",      color: "#534AB7", bg: "#ECEAFD" },
  live:       { label: "Live",        color: "#378ADD", bg: "#E6F1FB" },
};

function TeamStatusChart({ data = [] }) {
  const navigate = useNavigate();
  const { companySlug } = useParams();
  const { currentUser } = useSelector((s) => s.userListPage);
  const projectSlug = toSlug(currentUser?.preferences?.activeProject?.projectName);

  const sorted = [...data].sort((a, b) => b.count - a.count);

  const handleClick = (status, userId) => {
    if (!userId) return;
    navigate(`/${companySlug}/${projectSlug}/result?filter=${userId}&tab=${status}&key=assignedTo&status=${status}`);
  };

  return (
    <div style={S.card}>
      <div style={S.header}>
        <div>
          <p style={S.title}>State wise items per member</p>
          <p style={S.sub}>Task status breakdown by user</p>
        </div>
        <div style={S.legend}>
          {Object.entries(STATUS_META).map(([key, meta]) => (
            <span key={key} style={S.legendItem}>
              <span style={{ ...S.legendDot, background: meta.color }} />
              {meta.label}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {sorted.map((user, index) => {
          const total = Object.keys(STATUS_META).reduce((s, k) => s + (user[k] || 0), 0);
          const displayName = user.name || "Unassigned";
          const initials = displayName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
          return (
            <div key={index} style={S.row}>
              <div style={S.nameWrap}>
                <div style={S.avatar}>{initials}</div>
                <span style={S.name}>{displayName}</span>
              </div>
              <div style={S.track}>
                {Object.entries(STATUS_META).map(([key, meta]) => {
                  const value = user[key] || 0;
                  if (value === 0) return null;
                  return (
                    <div key={key}
                      onClick={() => handleClick(key, user?.userId)}
                      title={`${meta.label}: ${value}`}
                      style={{ width: `${(value / total) * 100}%`, background: meta.color, height: "100%", cursor: "pointer" }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                    />
                  );
                })}
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#111", width: 24, textAlign: "right" }}>
                {user.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TeamStatusChart;