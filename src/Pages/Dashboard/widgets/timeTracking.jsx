import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

function TimeTrackingChart({ data, taskData }) {
  const { originalHrs = 0, completedHrs = 0, remainingHrs = 0 } = data || {};

  const percent = originalHrs > 0
    ? Math.round((completedHrs / originalHrs) * 100) : 0;

  const chartData = (taskData || []).filter((task)=> task.type != "story").map((t) => ({
    name: t.title?.length > 12 ? t.title.slice(0, 12) + "…" : t.title,
    Original:   t.originalTIme   || 0,
    Completed:  t.CompleteTIme   || 0,
    Remaining:  t.RemainingTIme  || 0,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{
        background: "#fff", border: "1px solid #eee",
        borderRadius: 8, padding: "10px 14px", fontSize: 12,
      }}>
        <p style={{ fontWeight: 500, marginBottom: 6, color: "#111" }}>{label}</p>
        {payload.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: p.fill, flexShrink: 0 }} />
            <span style={{ color: "#555" }}>{p.name}: <strong>{p.value}h</strong></span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={styles.card}>

      {/* header */}
      <div style={styles.header}>
        <div>
          <p style={styles.title}>Time tracking</p>
          <p style={styles.sub}>Hours breakdown — this sprint</p>
        </div>
        <div style={styles.legend}>
          {[
            { color: "#ECEAFD", label: "Original" },
            { color: "#7367f0", label: "Completed" },
            { color: "#EF9F27", label: "Remaining" },
          ].map((l) => (
            <span key={l.label} style={styles.legendItem}>
              <span style={{ ...styles.legendDot, background: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      {/* metric cards */}
      <div style={styles.metricRow}>
        <div style={styles.metric}>
          <p style={styles.metricLabel}>Original hrs</p>
          <p style={styles.metricVal}>{originalHrs}</p>
        </div>
        <div style={styles.metric}>
          <p style={styles.metricLabel}>Completed</p>
          <p style={{ ...styles.metricVal, color: "#7367f0" }}>{completedHrs}</p>
        </div>
        <div style={styles.metric}>
          <p style={styles.metricLabel}>Remaining</p>
          <p style={{ ...styles.metricVal, color: "#EF9F27" }}>{remainingHrs}</p>
        </div>
        <div style={{ ...styles.metric, background: "#ECEAFD" }}>
          <p style={{ ...styles.metricLabel, color: "#4338CA" }}>Completion</p>
          <p style={{ ...styles.metricVal, color: "#7367f0" }}>{percent}%</p>
        </div>
      </div>

      {/* bar chart */}
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
          barCategoryGap="30%"
          barGap={3}
        >
          <CartesianGrid
            vertical={false}
            stroke="rgba(0,0,0,0.06)"
            strokeWidth={1}
          />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#888" }}
            axisLine={{ stroke: "rgba(0,0,0,0.12)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#888" }}
            axisLine={{ stroke: "rgba(0,0,0,0.12)" }}
            tickLine={false}
            tickFormatter={(v) => `${v}h`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="Original"  fill="#ECEAFD" radius={[4,4,0,0]} />
          <Bar dataKey="Completed" fill="#7367f0" radius={[4,4,0,0]} />
          <Bar dataKey="Remaining" fill="#EF9F27" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}

export default TimeTrackingChart;

const styles = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 10 },
title: { fontSize: 14, fontWeight: 500, color: "#111", margin: "0 0 3px" },
card:  { background: "#fff", border: "1px solid #ebebeb", borderRadius: 12, padding: 20 }, 
  sub: { fontSize: 12, color: "#aaa", margin: 0 },
  legend: { display: "flex", gap: 14, flexWrap: "wrap" },
  legendItem: { display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#666" },
  legendDot: { width: 10, height: 10, borderRadius: 2, display: "inline-block" },
  metricRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 10, marginBottom: 20 },
  metric: { background: "#f7f7f7", borderRadius: 8, padding: "12px 14px" },
  metricLabel: { fontSize: 11, color: "#aaa", margin: "0 0 4px" },
  metricVal: { fontSize: 22, fontWeight: 500, color: "#111", margin: 0, lineHeight: 1 },
};