import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toSlug } from "../../../Utils/srugs";
import { S } from "./dashboardStyles";

const TYPE_META = {
  task:  { label: "Task",  color: "#7367f0", bg: "#ECEAFD" },
  bug:   { label: "Bug",   color: "#E24B4A", bg: "#FCEBEB" },
  story: { label: "Story", color: "#EF9F27", bg: "#FAEEDA" },
};

export default function TasksByType({ data = [] }) {
  const navigate = useNavigate();
  const { companySlug } = useParams();
  const { currentUser } = useSelector((s) => s.userListPage);
  const projectSlug = toSlug(currentUser?.preferences?.activeProject?.projectName);

  const chartData = data.map((item) => ({
    name: item.type,
    value: item.count,
  }));
  const total = chartData.reduce((sum, i) => sum + i.value, 0);

  const handleClick = (entry) => {
    navigate(`/${companySlug}/${projectSlug}/result?filter=${entry?.name}&tab=${entry?.name}&key=type`);
  };

  return (
    <div style={S.card}>
      <div style={S.header}>
        <div>
          <p style={S.title}>Tasks by type</p>
          <p style={S.sub}>Distribution across this sprint</p>
        </div>
        <div style={S.legend}>
          {Object.entries(TYPE_META).map(([key, meta]) => (
            <span key={key} style={S.legendItem}>
              <span style={{ ...S.legendDot, background: meta.color }} />
              {meta.label}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
        <PieChart width={200} height={200}>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={52} outerRadius={78}
            dataKey="value" stroke="none" startAngle={90} endAngle={450}>
            {chartData.map((entry, i) => (
              <Cell key={i}
                fill={TYPE_META[entry.name?.toLowerCase()]?.color || "#888"}
                onClick={() => handleClick(entry)}
                style={{ cursor: "pointer" }}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #eee" }}
            formatter={(val, name) => [val, TYPE_META[name]?.label || name]}
          />
        </PieChart>
        <div style={S.centerLabel}>
          <span style={S.centerVal}>{total}</span>
          <span style={S.centerSub}>total</span>
        </div>
      </div>

      <div style={S.typeRow}>
        {data.map((item) => {
          const meta = TYPE_META[item.type?.toLowerCase()] || {};
          return (
            <div key={item.type}
              onClick={() => handleClick({ name: item.type })}
              style={{ ...S.typeChip, background: meta.bg, cursor: "pointer" }}>
              <span style={{ ...S.typeChipDot, background: meta.color }} />
              <span style={{ fontSize: 11, color: meta.color, fontWeight: 500 }}>{meta.label || item.type}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: meta.color, marginLeft: 4 }}>{item.count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}