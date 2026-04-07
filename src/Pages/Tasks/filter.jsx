import { useState, useRef, useEffect  , useMemo} from "react";

function FilterComponent({ columns, stories, onFilterChange, userList }) {
  
  const typeOptions = [
    { label: "Task", value: "task" },
    { label: "Bug", value: "bug" },
  ];

  const PRIORITY_OPTIONS = [
    { value: "1", label: "High" },
    { value: "2", label: "Medium" },
    { value: "3", label: "Low" },
  ];

  const columnOptions = columns.map((col) => ({
    label: col.columnName,
    value: col.taskStage || col.bugStage,
  }));

  // const assigneeMap = new Map();
  // stories?.forEach((story) => {
  //   [...(story.tasks || []), ...(story.bugs || [])].forEach((item) => {
  //     if (item.assignedTo) {
  //       const label = item?.assignedTo?.label ?? item?.assignedTo;
  //       const value = item?.assignedTo?.value ?? item?.assignedTo;
  //       if (label && !assigneeMap.has(value)) {
  //         assigneeMap.set(value, { label, value });
  //       }
  //     }
  //   });
  // });
   //const assigneeOptions = Array.from(assigneeMap.values());

const assigneeOptions = useMemo(() => {
  if (!userList || !Array.isArray(userList)) return [];

  return userList.map((user) => ({
    ...user,
    label: user.name,
    value: user._id,
  }));
}, [userList]);

  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [selectPriority, setSelectPriority] = useState([]);

  const [openDropdown, setOpenDropdown] = useState(null); // "type" | "column" | "assignee" | null

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = (arr, setArr, value) => {
    const next = arr.find((v) => v.value === value.value)
      ? arr.filter((v) => v.value !== value.value)
      : [...arr, value];
    setArr(next);
    return next;
  };

  const handleTypeToggle = (option) => {
    const next = toggle(selectedTypes, setSelectedTypes, option);
    onFilterChange?.({
      types: next,
      columns: selectedColumns,
      assignees: selectedAssignees,
      priority: selectPriority,
    });
  };

  const handleColumnToggle = (option) => {
    const next = toggle(selectedColumns, setSelectedColumns, option);
    onFilterChange?.({
      types: selectedTypes,
      columns: next,
      assignees: selectedAssignees,
      priority: selectPriority,
    });
  };

  const handleAssigneeToggle = (option) => {
    const next = toggle(selectedAssignees, setSelectedAssignees, option);
    onFilterChange?.({
      types: selectedTypes,
      columns: selectedColumns,
      assignees: next,
      priority: selectPriority,
    });
  };

  const handlePriorityToggle = (option) => {
    const next = toggle(selectPriority, setSelectPriority, option);
    onFilterChange?.({
      types: selectedTypes,
      columns: selectedColumns,
      assignees: selectedAssignees,
      priority: next,
    });
  };

  const filters = [
    {
      key: "type",
      label: "Type",
      options: typeOptions,
      selected: selectedTypes,
      onToggle: handleTypeToggle,
    },
    {
      key: "column",
      label: "Stage",
      options: columnOptions,
      selected: selectedColumns,
      onToggle: handleColumnToggle,
    },
    {
      key: "assignee",
      label: "Assignee",
      options: assigneeOptions,
      selected: selectedAssignees,
      onToggle: handleAssigneeToggle,
    },
    {
      key: "priority",
      label: "Priority",
      options: PRIORITY_OPTIONS,
      selected: selectPriority,
      onToggle: handlePriorityToggle,
    },
  ];

  return (
    <div style={{ padding: "6px 0", position: "relative" }} ref={dropdownRef}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "2rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {filters.map((filter) => {
          const isOpen = openDropdown === filter.key;
          const activeCount = filter.selected.length;
          return (
            <div key={filter.key} style={{ position: "relative" }}>
              <button
                onClick={() => setOpenDropdown(isOpen ? null : filter.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  width: "150px",
                  padding: "5px 12px",
                  border: `1px solid ${
                    activeCount > 0 ? "#2563eb" : "#d1d5db"
                  }`,
                  borderRadius: 4,
                  background: activeCount > 0 ? "#eff6ff" : "#fff",
                  color: activeCount > 0 ? "#2563eb" : "#374151",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s",
                }}
              >
                {filter.label}
                {activeCount > 0 && (
                  <span
                    style={{
                      background: "#2563eb",
                      color: "#fff",
                      borderRadius: 999,
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "1px 6px",
                      lineHeight: 1.6,
                    }}
                  >
                    {activeCount}
                  </span>
                )}
                <span
                  style={{
                    fontSize: 10,
                    color: activeCount > 0 ? "#2563eb" : "#9ca3af",
                  }}
                >
                  {isOpen ? "▲" : "▼"}
                </span>
              </button>

              {/* Dropdown */}
              {isOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    left: 0,
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 6,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    zIndex: 999,
                    minWidth: 180,
                    padding: "6px 0",
                  }}
                >
                  {filter.options.length === 0 && (
                    <div
                      style={{
                        padding: "8px 12px",
                        fontSize: 12,
                        color: "#9ca3af",
                      }}
                    >
                      No options
                    </div>
                  )}
                  {filter.options.map((option) => {
                    const isChecked = filter.selected.some(
                      (s) => s.value === option.value
                    );
                    return (
                      <div
                        key={option.value}
                        onClick={() => filter.onToggle(option)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "7px 12px",
                          cursor: "pointer",
                          background: isChecked ? "#eff6ff" : "transparent",
                          transition: "background 0.1s",
                        }}
                        onMouseEnter={(e) => {
                          if (!isChecked)
                            e.currentTarget.style.background = "#f9fafb";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = isChecked
                            ? "#eff6ff"
                            : "transparent";
                        }}
                      >
                        <div
                          style={{
                            width: 14,
                            height: 14,
                            border: `2px solid ${
                              isChecked ? "#2563eb" : "#d1d5db"
                            }`,
                            borderRadius: 3,
                            background: isChecked ? "#2563eb" : "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            transition: "all 0.1s",
                          }}
                        >
                          {isChecked && (
                            <svg
                              width="9"
                              height="9"
                              viewBox="0 0 9 9"
                              fill="none"
                            >
                              <path
                                d="M1.5 4.5L3.5 6.5L7.5 2.5"
                                stroke="#fff"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                        <span
                          style={{
                            fontSize: 12,
                            color: "#111827",
                            fontWeight: isChecked ? 600 : 400,
                          }}
                        >
                          {option.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FilterComponent;
