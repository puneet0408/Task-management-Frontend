import React, { useState, useEffect } from "react";
import useApi from "../../auth/service/useApi";
import SystemOverview from "./Widgets/systemOverview";
import MemberWorkload from "./Widgets/memberWorkload";
import PriorityBreakdown from "./Widgets/criticalBreakdown";
import CriticalTask from "./Widgets/criticalask";
import AttachmentSubtaskCard from "./Widgets/AttachCommentSubtaskcard";

function Dashboard() {
  const api = useApi();
  const [summaryWidgetData, setSummaryWidgetData] = useState(null);

  useEffect(() => {
    const fetchWidget = async () => {
      try {
        const response = await api.dashboardadminSummaryWidget();
        setSummaryWidgetData(response?.data?.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWidget();
  }, []);

  return (
    <div style={styles.page}>
      {/* Section A */}
      <SectionHeading title="System Overview" icon="" />
      <SystemOverview summaryWidgetData={summaryWidgetData} type="summary" />

      {/* Section B */}
      <SectionHeading title="Member Management" icon="" subtitle="" />
      <div style={styles.grid}>
        <MemberWorkload
          data={summaryWidgetData?.memberWorkload}
          member="workload"
        />
        <MemberWorkload
          data={summaryWidgetData?.createdBy}
          member="createdBy"
        />
      </div>

      {/* Section C */}
      <SectionHeading title="Task Overview" icon="" subtitle="" />
      <SystemOverview
        summaryWidgetData={summaryWidgetData}
        type="taskoverview"
      />
      <div style={styles.grid}>
        <PriorityBreakdown summaryWidgetData={summaryWidgetData?.byPriority} />
        <CriticalTask data={summaryWidgetData?.criticalTasks} />
      </div>
      {/* section D */}
      <SectionHeading
        title="attachments, subtasks & comments"
        icon=""
        subtitle=""
      />
      <div style={styles.grid}>
        <AttachmentSubtaskCard
      data={summaryWidgetData}
        />
      </div>
    </div>
  );
}

// reusable heading component
function SectionHeading({ title, subtitle, icon }) {
  return (
    <div style={styles.sectionHeading}>
      <div style={styles.headingLeft}>
        {icon && <span style={styles.icon}>{icon}</span>}
        <div>
          <p style={styles.headingTitle}>{title}</p>
          {subtitle && <p style={styles.headingSubtitle}>{subtitle}</p>}
        </div>
      </div>
      <div style={styles.headingLine} />
    </div>
  );
}

export default Dashboard;

const styles = {
  page: {
    padding: "24px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 20,
    marginTop: 16,
    alignItems: "stretch",
  },
  sectionHeading: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginTop: 32,
    marginBottom: 14,
  },
  headingLeft: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  icon: {
    fontSize: 16,
  },
  headingTitle: {
    fontSize: 13,
    fontWeight: 500,
    color: "#1a1a1a",
    margin: 0,
    lineHeight: 1,
  },
  headingSubtitle: {
    fontSize: 11,
    color: "#888",
    margin: "3px 0 0",
  },
  headingLine: {
    flex: 1,
    height: "0.5px",
    background: "#e0e0e0",
  },
};
