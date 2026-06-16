import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toSlug } from "../../../Utils/srugs";

export default function TasksByType({ data = [] }) {
  const chartData = data.map((item) => ({
    name: item.type,
    value: item.count,
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const COLORS = {
    task: "#0067b5",
    bug: "#EF9F27",
    story: "#fd0997",
  };
  const navigate = useNavigate();
  const { companySlug } = useParams();
  const { currentUser } = useSelector((state) => state.userListPage);
  const projectName = currentUser?.preferences?.activeProject?.projectName;
  const projectSlug = toSlug(projectName);
  const handleitemClick = (entry) => {
    navigate(
      `/${companySlug}/${projectSlug}/result?filter=${entry?.name}&tab=${entry?.name}&key=${"type"}`,
    );
  };

  return (
    <div style={styles.card}>
      <h4 style={styles.title}>Tasks by Type</h4>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          marginTop: 10,
        }}
      >
        <PieChart width={220} height={220}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell
                onClick={() => handleitemClick(entry)}
                key={`cell-${index}`}
                fill={COLORS[entry.name?.toLowerCase()] || "#8884d8"}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>

        <div style={styles.centerText}>
          <div style={styles.total}>{total}</div>
        </div>
      </div>
    </div>
  );
}

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
    marginBottom: "10px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
  },

  centerText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
  },

  total: {
    fontSize: "26px",
    fontWeight: "bold",
    color: "#111827",
  },

  label: {
    fontSize: "12px",
    color: "#6b7280",
  },
};
