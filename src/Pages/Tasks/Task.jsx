import { useEffect, useState } from "react";
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

const columns = [
  { id: "new", title: "Yet to Start" },
  { id: "progress", title: "In Progress" },
  { id: "readyqa", title: "Ready for QA" },
  { id: "qa", title: "QA in Progress" },
  { id: "done", title: "QA Passed" },
];

function TaskPage() {
  const api = useApi();
  const dispatch = useDispatch();

  const { SprintListItem } = useSelector((state) => state.SprintListPAge);
  const { currentUser } = useSelector((state) => state.userListPage);
  const [stageColumnModel, setStageColumnMOdel] = useState(false);

  const [SprintOption, setSprintOption] = useState([]);
  const [ActiveSprint, setActiveSprint] = useState(null);
  const [openTaskModel, setTaskModel] = useState(false);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const kanbanColumns = async () => {
      try {
        const res = await api.getkanbancolumn();
        let data = res?.data?.data?.data || [];
        setColumns(data);
      } catch (error) {
        console.error("Error fetching kanban columns:", error);
      }
    };
    kanbanColumns();
  }, []);

  const [stories, setStories] = useState([]);

  useEffect(() => {
    const optiondata = SprintListItem.map((sprint) => ({
      label: sprint?.sprintName,
      value: sprint._id,
    }));
    setSprintOption(optiondata);
  }, [SprintListItem]);

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

  const handleWorkItemChange = (option, data = {}) => {
    if (option.value == "edit_story") {
      seteditModelData(data);
    } else if (option.value == "task" || option.value == "bug") {
      seteditModelData(data);
    } else {
      if (data?.storyId) {
        setClickedStory(data?.storyId);
      }
    }
    setSelectedWorkType(option);
    setTaskModel(true);
  };
  const handleSprintChange = async (value) => {
    const res = await api.MarkDefultSprint(value?.value);
    if (res.status === 200) {
      const defaultOption = SprintOption?.find(
        (opt) => opt.value === res?.data?.data?.activesprint
      );
      setActiveSprint(defaultOption || null);
    }
  };

  useEffect(() => {
    const fetchtask = async () => {
      const response = await api.gettask();
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
    };

    fetchtask();
  }, [rerender]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    console.log(event, "event");
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
    setStageColumnMOdel(true);
  };

  return (
    <div style={{ padding: 20 }}>
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
            onChange={(e) => handleSprintChange(e)}
            classNamePrefix="react-select"
          />
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: 20 }}>
          <Select
            options={workItemOptions}
            placeholder="+ New Work Item"
            onChange={handleWorkItemChange}
            classNamePrefix="react-select"
            styles={{
              container: (base) => ({
                ...base,
                width: 200,
                zIndex: 9,
              }),
            }}
          />
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
      <Addtask
        editModeldata={editModeldata}
        seteditModelData={seteditModelData}
        clickedStory={clickedStory}
        selectedWorkType={selectedWorkType?.value}
        SprintOption={SprintOption}
        ActiveSprint={ActiveSprint}
        openTaskModel={openTaskModel}
        setTaskModel={setTaskModel}
      />
      <KanbanBoard
        stories={stories}
        columns={columns}
        handleDragEnd={handleDragEnd}
        handleWorkItemChange={handleWorkItemChange}
      />
      <StageColumns
        openAddForm={stageColumnModel}
        setOpenAddForm={setStageColumnMOdel}
      />
    </div>
  );
}

export default TaskPage;
