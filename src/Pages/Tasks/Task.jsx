import { useEffect, useState, useMemo } from "react";
import { fetchSprintData } from "../../Redux/SprintSlice";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import Select from "react-select";
import useApi from "../../auth/service/useApi";
import Addtask from "./AddTasks/addtask";
import { DndContext } from "@dnd-kit/core";
import KanbanBoard from "./kanbanBoard";
import { CiSettings } from "react-icons/ci";
import StageColumns from "./StageColumn/StageColumn";
import FilterComponent from "./filter";
import { useLocation, useNavigate } from "react-router-dom";
import EmptyKanban from "./EmptyKanban";
import LoadingScreen from "../loadingpage";
import { fetchCurrentLogin } from "../../Redux/UserSlice";
import toast from "react-hot-toast";

function TaskPage() {
  const api = useApi();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { SprintListItem } = useSelector((state) => state.SprintListPAge);

  const { currentUser } = useSelector((state) => state.userListPage);
  const [stageColumnModel, setStageColumnMOdel] = useState(false);
  const [loadingState, setLoadingState] = useState(false);

  const [SprintOption, setSprintOption] = useState([]);
  const [openTaskModel, setTaskModel] = useState(false);
  const [columns, setColumns] = useState([]);
  const [userList, setUserList] = useState("");

  const [ActiveSprint, setActiveSprint] = useState(null);
  const stored = localStorage.getItem("userData");
  const userData = stored ? JSON.parse(stored) : {};
  console.log(userData?.permission, "userData");

  console.log(ActiveSprint, "activesprint");

  useEffect(() => {
    const optiondata = SprintListItem.map((sprint) => ({
      label: sprint?.sprintName,
      value: sprint?._id,
    }));

    setSprintOption(optiondata);

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
    const kanbanColumns = async () => {
      try {
        const res = await api.getkanbancolumn();
        let data = res?.data?.data?.data || [];
        const stageOrder = {
          New: 1,
          in_progress: 2,
          qa: 3,
          done: 4,
          live: 5,
          closed: 6,
        };
        data = data.map((item, index) => ({
          ...item,
          key: item._id || `col_${index}`,
          bugState: item.bugStage?.toLowerCase(),
          taskState: item.taskStage?.toLowerCase(),
        }));
        data.sort((a, b) => {
          const orderA = stageOrder[a.taskStage] || 999;
          const orderB = stageOrder[b.taskStage] || 999;
          return orderA - orderB;
        });
        setColumns(data);
      } catch (error) {
        console.error("Error fetching kanban columns:", error);
      }
    };
    kanbanColumns();
  }, []);

  useEffect(() => {
    const getAllUserlist = async () => {
      try {
        const res = await api.getAllUsers();
        let data = res?.data?.data?.users || [];
        setUserList(data);
      } catch (error) {
        console.error("Error fetching kanban columns:", error);
      }
    };
    getAllUserlist();
  }, []);

  const [stories, setStories] = useState([]);

  useEffect(() => {
    dispatch(fetchSprintData());
  }, []);

  const workItemOptions = [
    { label: "Edit Story", value: "edit_story" },
    { label: "Story", value: "story" },
    { label: "Task", value: "task" },
    { label: "Bug", value: "bug" },
  ];
  const [selectedWorkType, setSelectedWorkType] = useState(null);
  const [clickedStory, setClickedStory] = useState("");
  const [editModeldata, seteditModelData] = useState(false);
  const [rerender, setRerender] = useState(false);

  const [activeFilters, setActiveFilters] = useState({
    types: [],
    columns: [],
    assignees: [],
    priority: [],
  });

  const handleWorkItemChange = (option, data = {}) => {
    if (option.value == "edit_story") {
      seteditModelData(data);
    } else if (option.value == "task" || option.value == "bug") {
      setClickedStory(data?.storyId);
      if (option.isedit) {
        seteditModelData(data);
      } else {
        seteditModelData({});
      }
    } else {
      seteditModelData({});
      if (data?.storyId) {
        setClickedStory(data?.storyId);
      }
    }
    setSelectedWorkType(option);
    setTaskModel(true);
  };

  useEffect(() => {
    if (!location.state?.viewtask) return;
    handleWorkItemChange(
      {
        value: location.state.viewtask.type,
        isedit: true,
      },
      location.state.viewtask
    );
    navigate(location.pathname, {
      replace: true,
      state: null,
    });
  }, []);

  const handleSprintChange = async (value) => {
    const res = await api.MarkDefultSprint(value?.value);
    if (res.status === 200) {
      const defaultOption = SprintOption?.find(
        (opt) => opt.value === res?.data?.data?.activesprint
      );

      const updatedUser = {
        ...userData,
        preferences: {
          ...userData.preferences,
          Activesprint: {
            sprintId: defaultOption.value,
            sprintName: defaultOption.label,
          },
        },
      };
      localStorage.setItem("userData", JSON.stringify(updatedUser));
      setActiveSprint(defaultOption || null);
    }
  };

  useEffect(() => {
    const fetchtask = async () => {
      try {
        setLoadingState(true);

        const payload = {};

        if (activeFilters.types?.length) {
          payload.type = activeFilters.types.map((t) => t.value).join(",");
        }

        if (ActiveSprint) {
          payload.sprintId = ActiveSprint.value;
        }

        if (activeFilters.columns?.length) {
          payload.taskStatus = activeFilters.columns
            .map((c) => c.value)
            .join(",");
        }

        if (activeFilters.assignees?.length) {
          payload.assignedTo = activeFilters.assignees
            .map((a) => a.value)
            .join(",");
        }

        if (activeFilters.priority?.length) {
          payload.priority = activeFilters.priority
            .map((a) => a.value)
            .join(",");
        }

        const response = await api.gettask(payload);

        const data = response?.data?.data || [];

        const storiesMap = {};

        data.forEach((item) => {
          if (item.type === "story") {
            storiesMap[String(item._id)] = {
              ...item,
              storyId: String(item._id),
              storyTitle: item.title,
              tasks: [],
              bugs: [],
            };
          }
        });

        data.forEach((item) => {
          if (item.type === "task" || item.type === "bug") {
            const parentId = String(item.parentId);

            if (storiesMap[parentId]) {
              if (item.type === "task") {
                storiesMap[parentId].tasks.push(item);
              } else {
                storiesMap[parentId].bugs.push(item);
              }
            }
          }
        });

        setStories(Object.values(storiesMap));
      } catch (error) {
        console.error(error);
        setStories([]);
      } finally {
        setLoadingState(false);
      }
    };

    fetchtask();
  }, [rerender, activeFilters, ActiveSprint]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;
    const taskId = active.id;
    const newStatus = over.data?.current?.columnId;
    const newParentId = over.data?.current?.storyId;
    if (!newStatus || !newParentId) return;
    setStories((prev) => {
      let movedItem = null;
      const updated = prev.map((story) => {
        const newTasks = story.tasks.filter((t) => {
          if (t._id === taskId) {
            movedItem = { ...t, taskStatus: newStatus };
            return false;
          }
          return true;
        });
        const newBugs = story.bugs.filter((b) => {
          if (b._id === taskId) {
            movedItem = { ...b, taskStatus: newStatus };
            return false;
          }
          return true;
        });
        return { ...story, tasks: newTasks, bugs: newBugs };
      });
      return updated.map((story) => {
        if (story.storyId === newParentId && movedItem) {
          if (movedItem.type === "bug") {
            return {
              ...story,
              bugs: [...story.bugs, movedItem],
            };
          } else {
            return {
              ...story,
              tasks: [...story.tasks, movedItem],
            };
          }
        }
        return story;
      });
    });
    try {
      await api.updateTask(taskId, {
        taskStatus: newStatus,
        parentId: newParentId,
      });
    } catch (err) {
      console.error("Drag update failed", err);
    }
    setRerender((prev) => !prev);
  };

  const handleColumnStage = () => {
    if (userData?.permission === "viewOnly") {
      toast.error("You have view-only access.");
      return;
    }
    setStageColumnMOdel(true);
  };

  //   const hasData = stories?.some(
  //   (story) =>
  //     story?.storyTitle ||
  //     story?.tasks?.length > 0 ||
  //     story?.bugs?.length > 0
  // );

  // if (!hasData) {
  //   return (
  //     <EmptyKanban
  //       handleWorkItemChange={handleWorkItemChange}
  //     />
  //   );
  // }

  const handleAddStory = () => {
    if (userData?.permission === "viewOnly") {
      toast.error("You have view-only access.");
      return;
    }

    handleWorkItemChange({ label: "Story", value: "story" }, null);
  };

  return (
    <div style={{ padding: 20 }}>
      {loadingState && <LoadingScreen />}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 20,
          marginBottom: 20,
        }}
      >
        <div>
          <Select
            options={SprintOption}
            value={ActiveSprint}
            menuPortalTarget={document.body}
            onChange={(e) => handleSprintChange(e)}
            styles={{
              menuPortal: (base) => ({
                ...base,
                zIndex: 9999,
              }),

              control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ? "#7367f0" : "#d1d5db",
                boxShadow: state.isFocused ? "0 0 0 1px #2563eb" : "none",
                "&:hover": {
                  borderColor: "#2563eb",
                },
              }),

              // singleValue: (base) => ({
              //   ...base,
              //   color: "#2563eb",
              //   fontWeight: 600,
              // }),

              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? "#7367f0"
                  : state.isFocused
                  ? "#eff6ff"
                  : "#fff",
                color: state.isSelected ? "#fff" : "#111827",
                cursor: "pointer",
              }),
            }}
            classNamePrefix="react-select"
          />
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: 20 }}>
          <button onClick={handleAddStory} className="add-btn">
            + Add Story
          </button>
          <button
            style={{
              border: "none",
              background: "#f5f5f5",
              fontSize: "1.4rem",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            onClick={handleColumnStage}
          >
            <CiSettings />
          </button>
        </div>
      </div>

      <div
        style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
      >
        {" "}
        <FilterComponent
          columns={columns}
          stories={stories}
          onFilterChange={setActiveFilters}
          userList={userList}
        />
      </div>
      <KanbanBoard
        userData={userData}
        stories={stories}
        columns={columns}
        handleDragEnd={handleDragEnd}
        handleWorkItemChange={handleWorkItemChange}
      />
      <StageColumns
        openAddForm={stageColumnModel}
        setOpenAddForm={setStageColumnMOdel}
        columns={columns}
      />
      <Addtask
        userData={userData}
        editModeldata={editModeldata}
        seteditModelData={seteditModelData}
        clickedStory={clickedStory}
        selectedWorkType={selectedWorkType?.value}
        SprintOption={SprintOption}
        ActiveSprint={ActiveSprint}
        openTaskModel={openTaskModel}
        setTaskModel={setTaskModel}
        userList={userList}
        setRerender={setRerender}
      />
    </div>
  );
}

export default TaskPage;
