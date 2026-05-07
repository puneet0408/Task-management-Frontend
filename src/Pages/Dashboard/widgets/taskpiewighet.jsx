import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

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

  return (
    <div style={styles.card}>
      <h4 style={styles.title}>Tasks by Type</h4>

      <div   style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginTop: 10,
  }}>
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
                key={`cell-${index}`}
                fill={
                  COLORS[entry.name?.toLowerCase()] || "#8884d8"
                }
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