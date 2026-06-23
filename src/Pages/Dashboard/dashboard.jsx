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
import EmptyDashboard from "./emptydashboardpage";
import LoadingScreen from "../loadingpage";

function Dashboard() {
  const api = useApi();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.userListPage);
  const { SprintListItem } = useSelector((state) => state.SprintListPAge);
  const [SprintOption, setSprintOption] = useState([]);
  const [loadingState , setLoadingState] = useState(false);
  const [summaryWidgetData, SummarywidgetData] = useState(null);
  const [isemptydashboard, setisemptydashboard] = useState(false);
  useEffect(() => {
    const isEmptyDashboard =
      !summaryWidgetData ||
      (!summaryWidgetData?.summary?.length &&
        !summaryWidgetData?.typeStats?.length &&
        !summaryWidgetData?.priorityStats?.length &&
        !summaryWidgetData?.assigneeStats?.length &&
        !summaryWidgetData?.BugRateWidget?.length);

    setisemptydashboard(isEmptyDashboard);
  }, [summaryWidgetData]);
  const [ActiveSprint, setActiveSprint] = useState(null);

  useEffect(() => {
    const optiondata = SprintListItem.map((sprint) => ({
      label: sprint?.sprintName,
      value: sprint?._id,
    }));

    setSprintOption(optiondata);

    const stored = localStorage.getItem("userData");
    const userData = stored ? JSON.parse(stored) : {};

    const activeSprintId = userData?.preferences?.Activesprint?.sprintId;

    const matchedSprint = optiondata.find(
      (item) => item.value === activeSprintId
    );

    if (matchedSprint) {
      setActiveSprint(matchedSprint);
    } else {
      setActiveSprint(null);
    }
  }, [SprintListItem]);

  useEffect(() => {
    dispatch(fetchSprintData());
  }, []);

  useEffect(() => {
    if (!ActiveSprint?.value) return;
    const fetchWidget = async () => {
      try {
        setLoadingState(true)
        const response = await api.dashboardempSummaryWidget({
          sprintId: ActiveSprint.value,
        });
         setLoadingState(false)
        SummarywidgetData(response.data.data);
      } catch (err) {
        console.error(err);
        setLoadingState(false)
      }
    };
    fetchWidget();
  }, [ActiveSprint?.value]);
  const handleSprintChange = (selectedOption) => {
    setActiveSprint(selectedOption);
  };
  return (
    <>
    {loadingState && <LoadingScreen/>}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <p></p>
        {/* <p>Dashboard - {currentUser?.company?.company_name}</p> */}
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
      {isemptydashboard ? (
        <EmptyDashboard />
      ) : (
        <>
          <SummaryWidgets summaryWidgetData={summaryWidgetData?.summary[0]} />
          <div style={styles.widgetsGrid}>
            <TaskByType data={summaryWidgetData?.typeStats} />
            <PriorityBreakdown data={summaryWidgetData?.priorityStats} />
            <BugRateWidget data={summaryWidgetData?.BugRateWidget || []} />
          </div>
          <div style={styles.widgetsGrid}>
            <TeamWorkloadChart data={summaryWidgetData?.assigneeStats} />
            <TeamStatusChart data={summaryWidgetData?.assigneeStats} />
            <TypeWIzeTaskCountofUsers
              data={summaryWidgetData?.assigneeStats || []}
            />
          </div>
        </>
      )}
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
