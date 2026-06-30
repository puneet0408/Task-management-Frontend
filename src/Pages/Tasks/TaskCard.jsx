import { useState, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import { BsThreeDotsVertical } from "react-icons/bs";
import { TbCalendar, TbCalendarX } from "react-icons/tb";

const TYPE_META = {
  task:  { label: "Task",  bg: "#ECEAFD", color: "#3C3489" },
  bug:   { label: "Bug",   bg: "#FCEBEB", color: "#791F1F" },
  story: { label: "Story", bg: "#E6F1FB", color: "#0C447C" },
};

const AVATAR_COLORS = [
  { bg: "#ECEAFD", color: "#3C3489" },
  { bg: "#E1F5EE", color: "#085041" },
  { bg: "#FAECE7", color: "#712B13" },
  { bg: "#FAEEDA", color: "#633806" },
  { bg: "#E6F1FB", color: "#0C447C" },
];

function getAvatarColor(name) {
  if (!name) return { bg: "#f3f4f6", color: "#9ca3af" };
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function getInitials(name) {
  if (!name) return "—";
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function isOverdue(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function TaskCard({ task, handleWorkItemChange, userData }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task._id });
  const [menuOpen, setMenuOpen] = useState(false);

  const meta = TYPE_META[task.type] ?? TYPE_META.task;
  const assigned = task.assignedTo;
  const isUnassigned = !assigned || assigned?.value === null;
  const avatarColor = getAvatarColor(task?.user?.name);
  const initials = getInitials(task?.user?.name);
  const overdue = isOverdue(task.due_date);

  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const handleCardClick = (e) => {
    e.stopPropagation();
    if (isDragging) return;
    handleWorkItemChange({ value: task?.type, isedit: true }, task);
  };

  return (
    <div
      ref={setNodeRef}
      onClick={handleCardClick}
      style={{
        background: "#fff",
        border: "0.5px solid #e5e7eb",
        borderRadius: 10,
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        cursor: "pointer",
        opacity: isDragging ? 0.5 : 1,
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
        transition: isDragging ? "none" : "border-color 0.15s, box-shadow 0.15s",
        boxShadow: isDragging ? "0 4px 16px rgba(0,0,0,0.12)" : "none",
        userSelect: "none",
      }}
      onMouseEnter={(e) => { if (!isDragging) e.currentTarget.style.borderColor = "#7367f0"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; }}
    >

      {/* header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{
          fontSize: 11, fontWeight: 500, padding: "2px 8px",
          borderRadius: 20, background: meta.bg, color: meta.color,
        }}>
          {meta.label}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {userData?.permission === "allowAction" && (
            <div
              {...listeners} {...attributes}
              style={{
                cursor: "grab", color: "#aaa", fontSize: 15,
                padding: "2px 4px", borderRadius: 4, lineHeight: 1,
              }}
              title="Drag to move"
            >
              ⠿
            </div>
          )}

          {/* three dot menu */}
          <div style={{ position: "relative" }}>
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); setMenuOpen((p) => !p); }}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#aaa", padding: "2px 4px", borderRadius: 4,
                display: "flex", alignItems: "center",
              }}
            >
              <BsThreeDotsVertical size={14} />
            </button>

            {menuOpen && (
              <div style={{
                position: "absolute", top: 24, right: 0,
                background: "#fff", border: "0.5px solid #e5e7eb",
                borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                zIndex: 1000, minWidth: 130, padding: "4px 0",
              }}>
                <div
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); handleWorkItemChange({ value: task?.type, isedit: true }, task); setMenuOpen(false); }}
                  style={menuItemStyle}
                >
                  View
                </div>
                {userData?.permission === "allowAction" && (
                  <div
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    style={{ ...menuItemStyle, color: "#E24B4A" }}
                  >
                    Delete
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* title */}
      <p style={{ fontSize: 13, fontWeight: 500, color: "#111827", lineHeight: 1.45, margin: 0 }}>
        {task.title}
      </p>

      {/* footer */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderTop: "0.5px solid #f3f4f6", paddingTop: 8,
      }}>
        <span style={{ fontSize: 11, color: "#aaa", fontFamily: "monospace" }}>
          #{task.taskId || task._id?.slice(-6)}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {task.due_date && (
            <span style={{
              fontSize: 11, display: "flex", alignItems: "center", gap: 3,
              color: overdue ? "#E24B4A" : "#aaa",
            }}>
              {overdue
                ? <TbCalendarX size={12} />
                : <TbCalendar size={12} />
              }
              {formatDate(task.due_date)}
            </span>
          )}

          <div
            title={isUnassigned ? "Unassigned" : task?.user?.name}
            style={{
              width: 24, height: 24, borderRadius: "50%",
              background: isUnassigned ? "#f3f4f6" : avatarColor.bg,
              border: isUnassigned ? "1px dashed #d1d5db" : "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 9, fontWeight: 600,
              color: isUnassigned ? "#ccc" : avatarColor.color,
            }}
          >
            {isUnassigned ? "—" : initials}
          </div>
        </div>
      </div>

    </div>
  );
}

const menuItemStyle = {
  padding: "8px 14px",
  cursor: "pointer",
  fontSize: 13,
  color: "#333",
};