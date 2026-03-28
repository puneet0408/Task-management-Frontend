import React, { Fragment, useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, Form } from "reactstrap";
import { useForm } from "react-hook-form";
import useApi from "../../../auth/service/useApi";
import Swal from "sweetalert2";

const COLUMN_COLORS = [
  "#4f6ef7",
  "#f5a623",
  "#2dbf8f",
  "#e25c5c",
  "#9b5de5",
  "#ff8c42",
  "#48cae4",
];

const bugStageS = [
  { label: "New", value: "new" },
  { label: "Active", value: "active" },
  { label: "QA", value: "qa" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
  { label: "Live", value: "live" },
];

const taskStageS = [
  { label: "New", value: "new" },
  { label: "In Progress", value: "in_progress" },
  { label: "QA", value: "qa" },
  { label: "Done", value: "done" },
  { label: "Closed", value: "closed" },
  { label: "Live", value: "live" },
];

function CustomizeColumns({ openAddForm, setOpenAddForm }) {
  const api = useApi();

  const toggle = () => setOpenAddForm(!openAddForm);
  const { handleSubmit } = useForm();

  const [columns, setColumns] = useState([]);

  const [selectedKey, setSelectedKey] = useState(null);
  const [counter, setCounter] = useState(columns?.length || 1);
  const getId = (col) => col._id || col.key;

  useEffect(() => {
    const kanbanColumns = async () => {
      try {
        const res = await api.getkanbancolumn();

        let data = res?.data?.data?.data || [];

        data = data.map((item, index) => ({
          ...item,
          key: item._id || `col_${index}`,
        }));

        if (data.length === 0) {
          data = [
            {
              key: "col_1",
              columnName: "New",
              bugState: "New",
              taskState: "New",
            },
          ];
        }

        setColumns(data);
        setSelectedKey(getId(data[0]));
      } catch (error) {
        console.error("Error fetching kanban columns:", error);

        const fallback = [
          {
            key: "col_1",
            columnName: "New",
            bugState: "New",
            taskState: "New",
          },
        ];

        setColumns(fallback);
      }
    };

    kanbanColumns();
  }, []);

  useEffect(() => {
    if (columns.length > 0 && !selectedKey) {
      setSelectedKey(getId(columns[0]));
    }
  }, [columns]);

  const selected = columns.find((c) => getId(c) === selectedKey);

  const updateSelected = (patch) => {
    setColumns((prev) =>
      prev.map((c) => (getId(c) === selectedKey ? { ...c, ...patch } : c))
    );
  };

  const deleteColumn = (id) => {
    if (columns.length === 1) {
      Swal.fire({
        icon: "warning",
        title: "Cannot Delete",
        text: "At least one column is required.",
      });
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this column?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const filtered = columns.filter((c) => getId(c) !== id);
        setColumns(filtered);

        if (selectedKey === id) {
          setSelectedKey(filtered[0] ? getId(filtered[0]) : null);
        }
      }
    });
  };

  const addColumn = () => {
    const newKey = `temp_${Date.now()}`; // ✅ safe

    setColumns((prev) => [
      ...prev,
      {
        key: newKey,
        columnName: `New column`,
        bugState: "new",
        taskState: "new",
      },
    ]);

    setSelectedKey(newKey);
  };

  const onSubmit = async () => {
    try {
      if (!columns || columns.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "No Columns",
          text: "Please add at least one column.",
          confirmButtonText: "OK",
        });
        return;
      }
      const hasEmptyName = columns.some(
        (col) => !col?.columnName || col?.columnName.trim() === ""
      );

      if (hasEmptyName) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Input",
          text: "Column name cannot be empty.",
          confirmButtonText: "OK",
        });
        return;
      }
      const names = columns.map((c) => c?.columnName.trim().toLowerCase());
      const hasDuplicate = new Set(names).size !== names.length;

      if (hasDuplicate) {
        Swal.fire({
          icon: "warning",
          title: "Duplicate Columns",
          text: "Duplicate column names are not allowed.",
          confirmButtonText: "OK",
        });
        return;
      }
      const payload = columns.map((col, index) => ({
        _id: col._id,
        columnName: col?.columnName,
        bugStage: col.bugState,
        taskStage: col.taskState,
        order: index + 1,
      }));
      const confirm = await Swal.fire({
        title: "Save Changes?",
        text: "Do you want to save these column changes?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Save",
        cancelButtonText: "Cancel",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-secondary ms-1",
        },
        buttonsStyling: false,
      });

      if (!confirm.isConfirmed) return;
      const res = await api.editKanbanColumn(payload);
      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Saved!",
          text: "Columns saved successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
        setOpenAddForm(false);
      }
    } catch (error) {
      console.error("Submit error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    if (columns.length > 0 && !selectedKey) {
      setSelectedKey(columns[0].key);
    }
  }, [columns]);

  return (
    <Fragment>
      <Modal isOpen={openAddForm} toggle={toggle} backdrop size="xl" centered>
        <ModalHeader toggle={toggle} className="border-bottom px-4 py-3">
          <div>
            <div className="fw-semibold" style={{ fontSize: 15 }}>
              Customize columns
            </div>
            <div
              className="text-muted"
              style={{ fontSize: 13, fontWeight: 400 }}
            >
              Configure workflow columns for your kanban board
            </div>
          </div>
        </ModalHeader>

        <ModalBody className="p-0">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="d-flex" style={{ minHeight: 400 }}>
              {/* ── Sidebar ── */}
              <div
                className="border-end p-3 d-flex flex-column gap-3"
                style={{
                  width: 220,
                  minWidth: 220,
                  background: "var(--bs-light)",
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--bs-secondary)",
                    }}
                  >
                    Columns
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary py-0 px-2"
                    style={{ fontSize: 12 }}
                    onClick={addColumn}
                  >
                    + Add
                  </button>
                </div>

                <div className="d-flex flex-column gap-1">
                  {columns.map((col, idx) => {
                    const id = getId(col);
                    return (
                      <div
                        key={id}
                        onClick={() => setSelectedKey(id)}
                        className={`d-flex align-items-center justify-content-between px-2 py-2 rounded ${
                          selectedKey === id ? "bg-white border shadow-sm" : ""
                        }`}
                        style={{
                          cursor: "pointer",
                          transition: "background 0.12s",
                        }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <span
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              background:
                                COLUMN_COLORS[idx % COLUMN_COLORS.length],
                              display: "inline-block",
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: selectedKey === id ? 600 : 400,
                            }}
                          >
                            {col?.columnName}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="btn btn-link btn-sm text-muted p-0 ms-1"
                          style={{ fontSize: 13, opacity: 0.5, lineHeight: 1 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteColumn(getId(col));
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
              {!selected ? (
                <div className="text-center text-muted mt-5">
                  No column selected. Please add or select a column.
                </div>
              ) : (
                <>
                  <div className="flex-grow-1 p-4 d-flex flex-column gap-4">
                    <div className="pb-3 border-bottom">
                      <div className="fw-semibold" style={{ fontSize: 14 }}>
                        State mappings for {selected?.columnName}
                      </div>
                      <div
                        className="text-muted"
                        style={{ fontSize: 12, marginTop: 2 }}
                      >
                        Define how work item states map to this column.
                      </div>
                    </div>

                    <div>
                      <label
                        className="form-label"
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--bs-secondary)",
                        }}
                      >
                        Column name
                      </label>
                      <input
                        className="form-control form-control-sm"
                        value={selected?.columnName ?? ""}
                        onChange={(e) =>
                          updateSelected({ columnName: e.target.value })
                        }
                      />
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label
                          className="form-label"
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: "var(--bs-secondary)",
                          }}
                        >
                          Bug state
                        </label>
                        <select
                          className="form-select form-select-sm"
                          value={selected?.bugState || "new"}
                          onChange={(e) =>
                            updateSelected({ bugState: e.target.value })
                          }
                        >
                          {bugStageS.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label
                          className="form-label"
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: "var(--bs-secondary)",
                          }}
                        >
                          Task state
                        </label>
                        <select
                          className="form-select form-select-sm"
                          value={selected?.taskState || "new"}
                          onChange={(e) =>
                            updateSelected({ taskState: e.target.value })
                          }
                        >
                          {taskStageS.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-auto pt-3 border-top d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => setOpenAddForm(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={columns.length === 0}
                        className="btn btn-sm btn-primary"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  );
}

export default CustomizeColumns;
