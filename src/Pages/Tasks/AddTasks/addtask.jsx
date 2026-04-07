import React, { Fragment, useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Form,
  Input,
  Label,
  Button,
} from "reactstrap";
import AuthService from "../../../auth/service/authService";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import useApi from "../../../auth/service/useApi";
import { fetchUsersData } from "../../../Redux/UserSlice";

/* ── Validation ─────────────────────────────────────────── */
const schema = yup.object({
  title: yup.string().required("Task title is required"),
  taskStatus: yup.string().required("Status is required"),
  priority: yup.string().required("Priority is required"),
  originalEstimate: yup.number().min(0).typeError("Must be a number"),
  remainingTime: yup.number().min(0).typeError("Must be a number"),
  completedTime: yup.number().min(0).typeError("Must be a number"),
});

/* ── React-Select shared styles ─────────────────────────── */
export const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "34px",
    fontSize: "13px",
    borderRadius: "6px",
    borderColor: state.isFocused ? "#0078d4" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(0,120,212,0.12)" : "none",
    "&:hover": { borderColor: "#0078d4" },
  }),
  valueContainer: (base) => ({ ...base, padding: "2px 10px" }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#e6f2fb",
    borderRadius: "4px",
  }),
  multiValueLabel: (base) => ({
    ...base,
    fontSize: "12px",
    color: "#004578",
    fontWeight: 500,
  }),
  option: (base, state) => ({
    ...base,
    fontSize: "13px",
    backgroundColor: state.isSelected
      ? "#0078d4"
      : state.isFocused
      ? "#e6f2fb"
      : "#fff",
    color: state.isSelected ? "#fff" : "#323130",
  }),
  placeholder: (base) => ({ ...base, fontSize: "13px", color: "#9ca3af" }),
  singleValue: (base) => ({ ...base, fontSize: "13px" }),
};

/* ── Work type config ───────────────────────────────────── */
const WORK_TYPE_META = {
  story: { label: "Story", color: "#7c3aed", bg: "#f5f3ff", icon: "📖" },
  task: { label: "Task", color: "#0078d4", bg: "#eff6ff", icon: "✅" },
  bug: { label: "Bug", color: "#dc2626", bg: "#fef2f2", icon: "🐛" },
  edit_story: {
    label: "Edit Story",
    color: "#7c3aed",
    bg: "#f5f3ff",
    icon: "📖",
  },
};

const PRIORITY_OPTIONS = [
  { value: "1", label: "High", color: "#dc2626" },
  { value: "2", label: "Medium", color: "#f59e0b" },
  { value: "3", label: "Low", color: "#10b981" },
];

/* ── Inline styles (no scss dependency) ────────────────── */
const s = {
  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "14px 16px",
    marginBottom: "12px",
  },
  cardTitle: {
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#6b7280",
    marginBottom: "10px",
  },
  label: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "4px",
    display: "block",
    marginTop: "10px",
  },
  input: {
    fontSize: "13px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    padding: "6px 10px",
    width: "100%",
    outline: "none",
    transition: "border-color 0.15s",
  },
  titleInput: {
    fontSize: "18px",
    fontWeight: 600,
    border: "none",
    borderBottom: "2px solid #e5e7eb",
    borderRadius: 0,
    padding: "6px 2px",
    width: "100%",
    outline: "none",
    color: "#111827",
    background: "transparent",
    transition: "border-color 0.15s",
  },
  errorText: {
    fontSize: "11px",
    color: "#dc2626",
    marginTop: "3px",
    display: "block",
  },
  badge: (color, bg) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "11px",
    fontWeight: 600,
    color,
    background: bg,
    padding: "3px 9px",
    borderRadius: "999px",
    border: `1px solid ${color}22`,
  }),
  priorityDot: (color) => ({
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: color,
    display: "inline-block",
    marginRight: "6px",
    flexShrink: 0,
  }),
  sectionHeader: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "12px",
    paddingBottom: "8px",
    borderBottom: "1px solid #f3f4f6",
  },
  timeRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "10px",
  },
  timeBox: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    padding: "10px 12px",
  },
  timeLabel: {
    fontSize: "10px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#9ca3af",
    marginBottom: "4px",
  },
};

/* ════════════════════════════════════════════════════════ */
function AddTask({
  openTaskModel,
  setTaskModel,
  selectedWorkType,
  clickedStory,
  editModeldata,
  seteditModelData,
  userList,
}) {

  const api = useApi();
  const dispatch = useDispatch();
  const { SprintListItem } = useSelector((s) => s.SprintListPAge);


  const [assignOptions, setAssignOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [columns, setColumns] = useState([]); // kanban columns from API
  const [comment, setComment] = useState("");
  const [reRenderTag, setReRenderTag] = useState(false);

  const meta = WORK_TYPE_META[selectedWorkType] ?? WORK_TYPE_META.task;
  const isStory =
    selectedWorkType === "story" || selectedWorkType === "edit_story";

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      assignedTo: null,
      taskStatus: "",
      priority: "2",
      sprintId: "",
      tags: [],
      originalEstimate: 0,
      remainingTime: 0,
      completedTime: 0,
    },
  });

  useEffect(() => {
    if (!editModeldata || !tagOptions.length) return;

    const editTags = (editModeldata?.tags || [])
      .filter(Boolean)
      .filter((t) => t.label || t.value)
      .map((t) => ({
        label: t.label || t.value || "",
        value: t.value || t.label || "",
      }));
    const mergedOptions = [
      ...tagOptions,
      ...editTags.filter(
        (t) => !tagOptions.some((opt) => opt.value === t.value)
      ),
    ];

    setTagOptions(mergedOptions);

    reset({
      title: editModeldata?.title || "",
      description: editModeldata?.description || "",
      priority: editModeldata?.priority || "2",
      sprintId: editModeldata?.sprintId || "",
      tags: editTags,
      originalEstimate: editModeldata?.originalEstimate || 0,
      remainingTime: editModeldata?.remainingTime || 0,
      completedTime: editModeldata?.completedTime || 0,
      assignedTo:
        editModeldata?.assignedTo?._id || editModeldata?.assignedTo || null,
      taskStatus: editModeldata?.taskStatus || "",
    });
  }, [editModeldata, tagOptions.length]);
  useEffect(() => {
    const kanbanColumns = async () => {
      try {
        const res = await api.getkanbancolumn();
        const data = res?.data?.data?.data || [];
        setColumns(data);
      } catch (err) {
        console.error("Error fetching kanban columns:", err);
      }
    };
    kanbanColumns();
  }, []);

  const statusOptions = isStory
    ? [{ label: "TODO", value: "todo" }]
    : columns
        .map((col) => ({
          label: selectedWorkType === "bug" ? col.bugStage : col.taskStage,
          value: selectedWorkType === "bug" ? col.bugStage : col.taskStage,
          columnName: col.columnName,
        }))
        .filter(
          (opt, idx, arr) => arr.findIndex((o) => o.value === opt.value) === idx
        )
        .filter((opt) => !!opt.value);

  useEffect(() => {
    dispatch(fetchUsersData());
  }, []);

  useEffect(() => {
    if (!Array.isArray(userList)) return;

    const options = userList
      .filter((u) => u?._id)
      .map((u) => ({
        label: u.name || "Unnamed",
        value: u._id,
      }));

    setAssignOptions(options);
  }, [userList]);

  useEffect(() => {
    const getTags = async () => {
      try {
        const res = await api.gettagsApi();
        if (res.status === 200) {
          const tags = res.data.data.tags ?? [];
          setTagOptions(
            tags.map((t) => ({ label: t.tagName, value: t.tagName }))
          );
        }
      } catch {
        setTagOptions([]);
      }
    };
    getTags();
  }, [reRenderTag]);

  const createTagApi = async (tagName) => {
    try {
      const res = await api.createTag({ tagName });
      if (res.status === 201) setReRenderTag((p) => !p);
    } catch (err) {
      console.error("Tag create failed:", err);
    }
  };


  const toggle = () => {
    reset();
    setComment("");
    setTaskModel(false);
  };


  const onSubmit = async (data) => {
    try {
      const commonData = {
        ...data,
        assignedTo: data.assignedTo?.value || null,
        tags: data.tags,
      };

      let res;

      if (editModeldata?._id) {
        const cleanType = editModeldata.type?.replace("edit_", "");
        const updatePayload = {
          ...commonData,
          type: cleanType,
          comment: comment || undefined,
        };

        res = await api.updateTask(editModeldata._id, updatePayload);
      } else {
        const createPayload = {
          ...commonData,
          ...(typeof clickedStory === "string" &&
            clickedStory.trim() && {
              parentId: clickedStory,
            }),
          type: selectedWorkType,
          comment: comment || undefined,
        };

        res = await api.createTask(createPayload);
      }

      if (res.status === 200 || res.status === 201) {
        toggle();
        seteditModelData(null);
      }
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  const focusStyle = (e) => (e.target.style.borderColor = "#0078d4");
  const blurStyle = (e) => (e.target.style.borderColor = "#d1d5db");

  return (
    <Fragment>
      <Modal isOpen={openTaskModel} toggle={toggle} size="xl" centered backdrop>
        <ModalHeader
          toggle={toggle}
          style={{ padding: "16px 24px", borderBottom: "1px solid #e5e7eb" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={s.badge(meta.color, meta.bg)}>
              {meta.icon} {meta.label}
            </div>
            <span
              style={{ fontSize: "15px", fontWeight: 600, color: "#111827" }}
            >
              {meta.label}
            </span>
          </div>
        </ModalHeader>

        {/* ── Body ── */}
        <ModalBody
          style={{
            padding: "20px 24px",
            background: "#f9fafb",
            maxHeight: "72vh",
            overflowY: "auto",
          }}
        >
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              {/* ════ LEFT ════ */}
              <Col md={8}>
                <div style={{ marginBottom: "16px" }}>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        placeholder={`Enter ${meta.label.toLowerCase()} title`}
                        style={{
                          ...s.titleInput,
                          borderBottomColor: errors.title
                            ? "#dc2626"
                            : "#e5e7eb",
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderBottomColor = meta.color)
                        }
                        onBlur={(e) =>
                          (e.target.style.borderBottomColor = errors.title
                            ? "#dc2626"
                            : "#e5e7eb")
                        }
                      />
                    )}
                  />
                  {errors.title && (
                    <span style={s.errorText}>{errors.title.message}</span>
                  )}
                </div>
                <div style={s.card}>
                  <div style={s.cardTitle}>Tags</div>
                  <Controller
                    name="tags"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <CreatableSelect
                        isMulti
                        styles={selectStyles}
                        placeholder="Search or create a tag..."
                        options={tagOptions}
                        value={field.value}
                        onChange={field.onChange}
                        onCreateOption={async (input) => {
                          const exists = tagOptions.find(
                            (o) => o.label.toLowerCase() === input.toLowerCase()
                          );
                          if (exists) {
                            field.onChange([...(field.value || []), exists]);
                          } else {
                            await createTagApi(input);
                          }
                        }}
                      />
                    )}
                  />
                </div>
                <div style={s.card}>
                  <div style={s.cardTitle}>Description</div>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={5}
                        placeholder="Describe this work item..."
                        style={{
                          ...s.input,
                          resize: "vertical",
                          fontFamily: "inherit",
                          lineHeight: 1.6,
                        }}
                        onFocus={focusStyle}
                        onBlur={blurStyle}
                      />
                    )}
                  />
                </div>

                {/* Discussion */}
                <div style={s.card}>
                  <div style={s.cardTitle}>Discussion</div>
                  <textarea
                    rows={3}
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{
                      ...s.input,
                      resize: "vertical",
                      fontFamily: "inherit",
                      lineHeight: 1.6,
                    }}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                </div>
              </Col>

              {/* ════ RIGHT ════ */}
              <Col md={4}>
                {/* Classification */}
                <div style={s.card}>
                  <div style={s.cardTitle}>Classification</div>

                  <label style={s.label}>Assigned To</label>
                  <Controller
                    name="assignedTo"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        styles={selectStyles}
                        options={assignOptions}
                        placeholder="Unassigned"
                        isClearable
                        value={
                          assignOptions.find(
                            (opt) => opt.value === field.value
                          ) ?? null
                        }
                        onChange={(selected) =>
                          field.onChange(selected?.value ?? null)
                        }
                      />
                    )}
                  />

                  <label style={s.label}>Status</label>
                  <Controller
                    name="taskStatus"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        style={{
                          ...s.input,
                          background: "#fff",
                          cursor: "pointer",
                        }}
                        onFocus={focusStyle}
                        onBlur={blurStyle}
                      >
                        <option value="">Select status</option>
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                            {opt.columnName && opt.columnName !== opt.label
                              ? ` (${opt.columnName})`
                              : ""}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.taskStatus && (
                    <span style={s.errorText}>{errors.taskStatus.message}</span>
                  )}

                  <label style={s.label}>Priority</label>
                  <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        style={{
                          ...s.input,
                          background: "#fff",
                          cursor: "pointer",
                        }}
                        onFocus={focusStyle}
                        onBlur={blurStyle}
                      >
                        {PRIORITY_OPTIONS.map((p) => (
                          <option key={p.value} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </div>

                {/* Sprint */}
                <div style={s.card}>
                  <div style={s.cardTitle}>Iteration</div>
                  <label style={{ ...s.label, marginTop: 0 }}>Sprint</label>
                  <Controller
                    name="sprintId"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        style={{
                          ...s.input,
                          background: "#fff",
                          cursor: "pointer",
                        }}
                        onFocus={focusStyle}
                        onBlur={blurStyle}
                      >
                        <option value="">Select sprint</option>
                        {SprintListItem?.map((sp) => (
                          <option key={sp._id} value={sp._id}>
                            {sp.sprintName}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.sprintId && (
                    <span style={s.errorText}>{errors.sprintId.message}</span>
                  )}
                </div>

                {/* Time tracking — hidden for story */}
                {!isStory && (
                  <div style={s.card}>
                    <div style={s.cardTitle}>Time Tracking</div>
                    <div style={s.timeRow}>
                      {[
                        { name: "originalEstimate", label: "Original (hrs)" },
                        { name: "remainingTime", label: "Remaining (hrs)" },
                        { name: "completedTime", label: "Completed (hrs)" },
                      ].map(({ name, label }) => (
                        <div key={name} style={s.timeBox}>
                          <div style={s.timeLabel}>{label}</div>
                          <Controller
                            name={name}
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="number"
                                min="0"
                                step="0.5"
                                style={{
                                  border: "none",
                                  background: "transparent",
                                  width: "100%",
                                  fontSize: "16px",
                                  fontWeight: 600,
                                  color: "#111827",
                                  outline: "none",
                                  padding: 0,
                                }}
                              />
                            )}
                          />
                          {errors[name] && (
                            <span style={s.errorText}>
                              {errors[name].message}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Col>
            </Row>
          </Form>
        </ModalBody>

        {/* ── Footer ── */}
        <ModalFooter
          style={{
            padding: "12px 24px",
            borderTop: "1px solid #e5e7eb",
            gap: "8px",
          }}
        >
          <Button
            outline
            color="secondary"
            onClick={toggle}
            disabled={isSubmitting}
            style={{ fontSize: "13px", padding: "7px 18px" }}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            style={{ fontSize: "13px", padding: "7px 20px", fontWeight: 600 }}
          >
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  style={{ width: 13, height: 13 }}
                />
                Saving...
              </>
            ) : (
              `Save ${meta.label}`
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
}

export default AddTask;
