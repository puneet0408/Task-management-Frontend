import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";
import { fetchSprintData } from "../../Redux/SprintSlice";
import useApi from "../../auth/service/useApi";
import SummaryWidgets from "./widgets/summaryWidgets";
import TaskByType from "./widgets/taskpiewighet";
import PriorityBreakdown from "./widgets/prorityWidgets";
import BugRateWidget from "./widgets/bugWidgets";
import TeamWorkloadChart from "./widgets/taskAssignperuser";
import TeamStatusChart from "./widgets/taskcountstatuswize";
import TypeWIzeTaskCountofUsers from "./widgets/TypeWizeCount";

function Dashboard() {
  const api = useApi();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.userListPage);
  const { SprintListItem } = useSelector((state) => state.SprintListPAge);

  const [SprintOption, setSprintOption] = useState([]);
  const [summaryWidgetData, SummarywidgetData] = useState(null);
  console.log(summaryWidgetData, "summaryWidgetData");

  const [ActiveSprint, setActiveSprint] = useState(() => {
    const stored = localStorage.getItem("userData");
    const userData = stored ? JSON.parse(stored) : {};
    return {
      label: userData?.preferences?.Activesprint?.sprintName,
      value: userData?.preferences?.Activesprint?.sprintId,
    };
  });

  useEffect(() => {
    dispatch(fetchSprintData());
  }, []);

  useEffect(() => {
    const optiondata = SprintListItem.map((sprint) => ({
      label: sprint?.sprintName,
      value: sprint._id,
    }));
    setSprintOption(optiondata);
  }, [SprintListItem]);
  useEffect(() => {
    if (!ActiveSprint?.value) return;
    const fetchWidget = async () => {
      try {
        const response = await api.dashboardSummaryWidget({
          sprintId: ActiveSprint.value,
        });
        console.log(response, "responseresponse");

        SummarywidgetData(response.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchWidget();
  }, [ActiveSprint?.value]);

  const handleSprintChange = (selectedOption) => {
    setActiveSprint(selectedOption);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <p>Dashboard - {currentUser?.company?.company_name}</p>
        <span>
          <Select
            options={SprintOption}
            value={ActiveSprint}
            onChange={handleSprintChange}
            classNamePrefix="react-select"
            placeholder="Select Sprint"
          />
        </span>
      </div>
      <hr />

      <SummaryWidgets summaryWidgetData={summaryWidgetData?.summary[0]} />
      <div style={styles.widgetsGrid}>
        <TaskByType data={summaryWidgetData?.typeStats} />

        <PriorityBreakdown data={summaryWidgetData?.priorityStats} />

        <BugRateWidget data={summaryWidgetData?.BugRateWidget || []} />
      </div>
        <div style={styles.widgetsGrid}>
        <TeamWorkloadChart data={summaryWidgetData?.assigneeStats} />

        <TeamStatusChart data={summaryWidgetData?.assigneeStats} />

        <TypeWIzeTaskCountofUsers data={summaryWidgetData?.assigneeStats || []} />
      </div>
      
    </>
  );
}

export default Dashboard;
const styles = {
  widgetsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 20,
    marginTop: 24,
    alignItems: "stretch",
  },
};
