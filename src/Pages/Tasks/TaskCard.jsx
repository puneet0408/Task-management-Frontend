import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CiMenuKebab } from "react-icons/ci";
import { useState, useEffect } from "react";

const TYPE_META = {
  task: { label: "Task", bg: "#eff6ff", color: "#1e40af", border: "#93c5fd" },
  bug: { label: "Bug", bg: "#fef2f2", color: "#991b1b", border: "#fca5a5" },
  story: { label: "Story", bg: "#f5f3ff", color: "#5b21b6", border: "#c4b5fd" },
};

const PRIORITY_DOT = {
  1: { color: "#dc2626", label: "High" },
  2: { color: "#f59e0b", label: "Medium" },
  3: { color: "#10b981", label: "Low" },
};

const AVATAR_COLORS = [
  { bg: "#bfdbfe", color: "#1e40af" },
  { bg: "#d1fae5", color: "#065f46" },
  { bg: "#fde68a", color: "#92400e" },
  { bg: "#fce7f3", color: "#9d174d" },
  { bg: "#e0e7ff", color: "#3730a3" },
];

function getAvatarColor(name) {
  if (!name) return { bg: "#f3f4f6", color: "#9ca3af" };
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function getInitials(name) {
  if (!name) return "—";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function TaskCard({ task, handleWorkItemChange }) {

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task._id,
    });
  const [openMenuId, setOpenMenuId] = useState(null);

  const type = task.type ?? "task";
  const meta = TYPE_META[type] ?? TYPE_META.task;
  const priority = PRIORITY_DOT[task.priority] ?? PRIORITY_DOT["2"];
  const assigned = task.assignedTo;
  const avatarColor = getAvatarColor(assigned?.label ?? assigned);
  const initials = getInitials(assigned?.label ?? assigned);
  const isUnassigned = !assigned || assigned?.value === null;

  const menuItemStyle = {
    padding: "8px 12px",
    fontSize: "12px",
    cursor: "pointer",
    transition: "0.2s",
  };
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener("click", handleClickOutside);

    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: "10px 12px",
        cursor: isDragging ? "grabbing" : "grab",
        opacity: isDragging ? 0.5 : 1,
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
        transition: isDragging
          ? "none"
          : "border-color 0.15s, box-shadow 0.15s",
        boxShadow: isDragging ? "0 4px 12px rgba(0,0,0,0.12)" : "none",
        userSelect: "none",
      }}
      onMouseEnter={(e) => {
        if (!isDragging) e.currentTarget.style.borderColor = "#93c5fd";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#e5e7eb";
      }}
    >
      {/* Top row — type badge + priority dot */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 7,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            padding: "2px 7px",
            borderRadius: 999,
            background: meta.bg,
            color: meta.color,
            border: `0.5px solid ${meta.border}`,
          }}
        >
          {meta.label}
        </span>
        <div style={{ position: "relative" }}>
          <CiMenuKebab
            style={{ cursor: "pointer" }}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuId(openMenuId === task._id ? null : task._id);
            }}
          />

          {openMenuId === task._id && (
            <div
              style={{
                position: "absolute",
                top: "20px",
                right: 0,
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                zIndex: 1000,
                minWidth: "120px",
              }}
            >
              <div
                onPointerDown={(e) => e.stopPropagation()}
                style={menuItemStyle}
                onClick={() => handleWorkItemChange({ value: task?.type }, task)}
              >
                View
              </div>
              <div
                onPointerDown={(e) => e.stopPropagation()}
                style={menuItemStyle}
              >
                Delete
              </div>
            </div>
          )}
        </div>
        {/* <div
          title={priority.label}
          style={{
            width: 8, height: 8, borderRadius: "50%",
            background: priority.color, flexShrink: 0,
          }}
        /> */}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: "#111827",
          lineHeight: 1.45,
          marginBottom: 10,
        }}
      >
        {task.title}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 8,
          borderTop: "0.5px solid #f3f4f6",
        }}
      >
        <span
          style={{ fontSize: 10, color: "#d1d5db", fontFamily: "monospace" }}
        >
          #{task._id?.slice(-6)}
        </span>

        <div
          title={isUnassigned ? "Unassigned" : assigned?.label ?? assigned}
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: isUnassigned ? "#f3f4f6" : avatarColor.bg,
            border: isUnassigned ? "1px dashed #d1d5db" : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 9,
            fontWeight: 700,
            color: isUnassigned ? "#d1d5db" : avatarColor.color,
          }}
        >
          {isUnassigned ? "—" : initials}
        </div>
      </div>
    </div>
  );
}
