import React from "react";
import { PieChart, Pie, Cell } from "recharts";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toSlug } from "../../../Utils/srugs";

function BugRateWidget({ data }) {

  const navigate = useNavigate();
  const { companySlug } = useParams();
  const { currentUser } = useSelector((state) => state.userListPage);
  const projectName = currentUser?.preferences?.activeProject?.projectName;
  const projectSlug = toSlug(projectName);
  const handleitemClick = (entry , tab) => {
    navigate(
      `/${companySlug}/${projectSlug}/result?filter=${entry}&tab=${tab}`
    );
  };
  const { totalTasks = 0, openbugs = 0, closedbugs = 0 } = data[0] || {};
  const totalBugs = openbugs + closedbugs;

  const percentage =
    totalTasks > 0 ? Math.round((totalBugs / totalTasks) * 100) : 0;

  const chartData = [
    {
      name: "Bugs",
      value: percentage,
    },
    {
      name: "Remaining",
      value: 100 - percentage,
    },
  ];

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Bug rate this sprint</h3>

      {/* CHART */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          position: "relative",
          marginTop: 10,
        }}
      >
        <PieChart width={180} height={180}>
          <Pie
            data={chartData}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={65}
            startAngle={90}
            endAngle={450}
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell
                onClick={() => handleitemClick("bug","Bugs")}
                style={{cursor:"pointer"}}
                key={`cell-${index}`}
                fill={index === 0 ? "#ef4444" : "#ebe9f9"}
              />
            ))}
          </Pie>
        </PieChart>

        {/* CENTER TEXT */}
        <div style={styles.center}>
          <div style={styles.percent}>{percentage}%</div>
        </div>
      </div>

      {/* INFO */}
      <div style={styles.totalText}>
        {totalBugs} bugs of {totalTasks} tasks
      </div>

      <div style={styles.divider} />

      {/* STATS */}
      <div   onClick={() => handleitemClick("openbug" , "Open Bugs")} style={styles.row}>
        <span  style={styles.label}>Open bugs</span>
        <span style={{ ...styles.count, color: "#ef4444" }}>{openbugs}</span>
      </div>

      <div   onClick={() => handleitemClick("closedbug" , "Closed Bugs")} style={styles.row}>
        <span style={styles.label}>Closed</span>
        <span style={{ ...styles.count, color: "#10b981" }}>{closedbugs}</span>
      </div>
    </div>
  );
}

export default BugRateWidget;

const styles = {
  card: {
    background: "#f5f5f5",
    borderRadius: 12,
    padding: 18,
    minHeight: 340,
    width: "100%",
    boxSizing: "border-box",
  },

  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 600,
    color: "#222",
  },

  center: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },

  percent: {
    fontSize: 28,
    fontWeight: 700,
    color: "#444",
  },

  totalText: {
    textAlign: "center",
    marginTop: -10,
    marginBottom: 16,
    fontSize: 14,
    color: "#555",
  },

  divider: {
    height: 1,
    background: "#ddd",
    marginBottom: 14,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
    cursor:"pointer",
  },

  label: {
    fontSize: 15,
    color: "#444",
  },

  count: {
    fontWeight: 700,
    fontSize: 16,
  },
};
