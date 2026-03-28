import React from "react";
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

export default function Column({ column, tasks, isLast, handleWorkItemChange, storyId }) {

  const columnId = column.taskStage || column.bugStage;

  const { setNodeRef, isOver } = useDroppable({
    id: `${storyId}__${columnId}`,
    data: {
      columnId,
      storyId, 
    },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        width: 230,
        minWidth: 230,
        minHeight: 120,
        padding: 8,
        background: isOver ? "#eff6ff" : "#f3f4f6",
        borderRight: isLast ? "none" : "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        transition: "background 0.15s",
      }}
    >
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} handleWorkItemChange={handleWorkItemChange} />
      ))}
    </div>
  );
}