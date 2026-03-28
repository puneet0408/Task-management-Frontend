import React from "react";
import { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import Column from "./Column";
import { CiMenuKebab } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import { closestCenter } from "@dnd-kit/core";

import AddTask from "./AddTasks/addtask";
const TYPE_META = {
  task: { label: "Task", bg: "#eff6ff", color: "#1e40af", border: "#93c5fd" },
  bug: { label: "Bug", bg: "#fef2f2", color: "#991b1b", border: "#fca5a5" },
  story: { label: "Story", bg: "#f5f3ff", color: "#5b21b6", border: "#c4b5fd" },
};

const PRIORITY_COLOR = { 1: "#dc2626", 2: "#f59e0b", 3: "#10b981" };

const menuItemStyle = {
  padding: "8px 12px",
  fontSize: "12px",
  cursor: "pointer",
  transition: "0.2s",
};

export { TYPE_META, PRIORITY_COLOR };

export default function KanbanBoard({
  stories,
  columns,
  handleDragEnd,
  handleWorkItemChange,
}) {
  const countTasksInColumn = (story, colId) =>
    story.tasks?.filter((t) => t.taskStatus === colId).length ?? 0;

  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const colTaskCounts = columns.map((col) => ({
    ...col,
    total: stories.reduce((sum, s) => sum + countTasksInColumn(s, col._id), 0),
  }));
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener("click", handleClickOutside);

    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div
        style={{
          overflowX: "auto",
          background: "#f3f4f6",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            background: "#fff",
            borderBottom: "1px solid #e5e7eb",
            position: "sticky",
            top: 0,
            zIndex: 3,
            minWidth: "fit-content",
          }}
        >
          <div
            style={{
              width: 220,
              minWidth: 220,
              padding: "10px 14px",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "#9ca3af",
              borderRight: "1px solid #e5e7eb",
              background: "#fff",
            }}
          >
            Stories
          </div>

          {colTaskCounts.map((col, i) => (
            <div
              key={col.id}
              style={{
                width: 230,
                minWidth: 230,
                padding: "10px 14px",
                background: "#fff",
                borderRight:
                  i < columns.length - 1 ? "1px solid #e5e7eb" : "none",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                {col.columnName}
              </div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>
                {col.total} {col.total === 1 ? "item" : "items"}
              </div>
            </div>
          ))}
        </div>
        {stories.map((story) => (
          <div
            key={story.storyId}
            style={{
              display: "flex",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                width: 220,
                minWidth: 220,
                padding: "12px 14px",
                background: "#fff",
                borderRight: "1px solid #e5e7eb",
                display: "flex",
                flexDirection: "column",
                gap: 6,
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    background: "#f5f3ff",
                    color: "#5b21b6",
                    border: "0.5px solid #c4b5fd",
                    borderRadius: 99,
                    padding: "2px 8px",
                    display: "inline-block",
                    width: "fit-content",
                  }}
                >
                  {story.storyId}
                </span>
                <div style={{ position: "relative" }}>
                  <CiMenuKebab
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();

                      const rect = e.currentTarget.getBoundingClientRect();

                      setMenuPosition({
                        x: rect.right - 120,
                        y: rect.bottom + 5,
                      });

                      setOpenMenuId(
                        openMenuId === story.storyId ? null : story.storyId
                      );
                    }}
                  />

                  {openMenuId === story.storyId && (
                    <div
                      style={{
                        position: "fixed",
                        top: menuPosition.y,
                        left: menuPosition.x,
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                        zIndex: 9999,
                        minWidth: "120px",
                      }}
                    >
                      <div
                        onClick={() =>
                          handleWorkItemChange({ value: "edit_story" }, story)
                        }
                        style={menuItemStyle}
                      >
                        View
                      </div>
                      <div
                        onClick={() =>
                          handleWorkItemChange({ value: "task" }, story)
                        }
                        style={menuItemStyle}
                      >
                        New Task
                      </div>
                      <div
                        onClick={() =>
                          handleWorkItemChange({ value: "bug" }, story)
                        }
                        style={menuItemStyle}
                      >
                        Bug
                      </div>
                      <div style={menuItemStyle}>Delete</div>
                    </div>
                  )}
                </div>
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#111827",
                  lineHeight: 1.4,
                }}
              >
                {story.storyTitle}
              </div>
              {story.assignedTo && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    marginTop: 2,
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#bfdbfe",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#1e40af",
                    }}
                  >
                    {story.assignedTo
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <span style={{ fontSize: 11, color: "#6b7280" }}>
                    {story.assignedTo}
                  </span>
                </div>
              )}
              <div
                style={{
                  position: "absolute",
                  bottom: "8px",
                  right: "13px",
                  cursor: "pointer",
                }}
              >
                <IoIosArrowDown />
              </div>
            </div>
            {columns.map((col, i) => (
              <Column
                storyId={story.storyId}
                handleWorkItemChange={handleWorkItemChange}
                key={col.id}
                column={col}
                tasks={[
                  ...(story.tasks?.filter(
                    (t) => t.taskStatus === col.taskStage
                  ) || []),
                  ...(story.bugs?.filter(
                    (t) => t.taskStatus === col.taskStage
                  ) || []),
                ]}
                isLast={i === columns.length - 1}
              />
            ))}
          </div>
        ))}
      </div>
    </DndContext>
  );
}
