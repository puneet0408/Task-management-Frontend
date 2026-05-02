import React, { Fragment, useState, useEffect, useRef } from "react";
import axios from "axios";
import TaskHistory from "./taskHistory";
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
  originalTIme: yup.number().min(0).typeError("Must be a number"),
  RemainingTIme: yup.number().min(0).typeError("Must be a number"),
  CompleteTIme: yup.number().min(0).typeError("Must be a number"),
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
    padding: "10px 16px",
    marginBottom: "10px",
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
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  uploadBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  dropZone: {
    border: "2px dashed #d1d5db",
    borderRadius: "8px",
    padding: "20px",
    textAlign: "center",
    marginBottom: "12px",
    cursor: "pointer",
  },
  fileList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  fileItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
  },
  fileInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  fileIcon: {
    fontSize: "18px",
  },
  fileName: {
    fontSize: "14px",
    fontWeight: 500,
  },
  fileSize: {
    fontSize: "12px",
    color: "#6b7280",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  uploading: {
    fontSize: "12px",
    color: "#f59e0b",
  },
  removeBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "#ef4444",
    fontSize: "16px",
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
  setRerender,
}) {

  const api = useApi();
  const dispatch = useDispatch();
  const { SprintListItem } = useSelector((s) => s.SprintListPAge);

  const [assignOptions, setAssignOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [columns, setColumns] = useState([]);
  const [comment, setComment] = useState("");
  const [reRenderTag, setReRenderTag] = useState(false);
  const [activeTab, setActiveTab] = useState("Details");
  const [attachment, setAttachments] = useState([]);
  const [files, setFiles] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const todaymin = new Date().toISOString().split("T")[0];

  const [subtasks, setSubtasks] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");
  const [subtaskreuire, setSubtaskRequired] = useState("");
  const MAX_CHARS = 280;
  const [commentList, setCommentList] = useState([]);
  const { currentUser } = useSelector((state) => state.userListPage);
  const commentEndRef = useRef();

  useEffect(() => {
    commentEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [commentList]);

  const addSubtask = () => {
    if (newSubtask === "") {
      setSubtaskRequired("Sub Task Title is required");
      return;
    }
    setSubtasks((prev) => [...prev, { title: newSubtask, completed: false }]);
    setNewSubtask("");
    setShowInput(false);
  };

  const toggleSubtask = (index) => {
    const updated = [...subtasks];
    updated[index].completed = !updated[index].completed;
    setSubtasks(updated);
  };

  const removeSubtask = (index) => {
    setSubtasks((prev) => prev.filter((_, i) => i !== index));
  };

  const fileInputRef = useRef();
  const handleUpload = async (filesToUpload) => {
    setIsUploading(true);
    try {
      const uploadedUrls = [];

      for (const item of filesToUpload) {
        setFiles((prev) =>
          prev.map((f) =>
            f.name === item.name ? { ...f, uploading: true } : f
          )
        );
        const res = await api.awsmediaupoader({
          fileName: item.name,
          fileType: item.type,
        });
        const { uploadUrl, fileUrl } = res.data;
        await axios.put(uploadUrl, item.file, {
          headers: { "Content-Type": item.type },
        });
        setFiles((prev) =>
          prev.map((f) =>
            f.name === item.name
              ? { ...f, uploading: false, uploaded: true, url: fileUrl }
              : f
          )
        );
        uploadedUrls.push({ name: item.name, type: item.type, url: fileUrl });
      }
      return uploadedUrls;
    } catch (error) {
      console.error("Full error:", error.response?.data);
      console.error("Status:", error.response?.status);
    } finally {
      setIsUploading(false);
    }
  };
  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files).map((file) => ({
      file,
      name: file.name,
      type: file.type,
      size: file.size,
      uploading: false,
      uploaded: false,
    }));

    setFiles((prev) => [...prev, ...selectedFiles]);
    const uploadedUrls = await handleUpload(selectedFiles);
    if (uploadedUrls) setAttachments((prev) => [...prev, ...uploadedUrls]);
    e.target.value = null;
  };
  const removeFile = (index) => {
    const removed = files[index];
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setAttachments((prev) => prev.filter((a) => a.name !== removed.name));
  };

  const handleShowDetails = (item) => {
    setActiveTab(item);
  };
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
      attachment: [],
      subtasks: [],
      comments: [],
      assignedTo: null,
      taskStatus: "",
      priority: "2",
      due_date: "",
      sprintId: "",
      tags: [],
      originalTIme: 0,
      RemainingTIme: 0,
      CompleteTIme: 0,
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
      attachment: editModeldata?.attachment || "",
      subtasks: editModeldata?.subtasks || [],
      comments: editModeldata?.comments || [],
      priority: editModeldata?.priority || "2",
      due_date: editModeldata?.due_date
        ? new Date(editModeldata.due_date).toISOString().split("T")[0]
        : "",
      sprintId: editModeldata?.sprintId || "",
      tags: editTags,
      originalTIme: editModeldata?.originalTIme || 0,
      RemainingTIme: editModeldata?.RemainingTIme || 0,
      CompleteTIme: editModeldata?.CompleteTIme || 0,
      assignedTo:
        editModeldata?.assignedTo?._id || editModeldata?.assignedTo || null,
      taskStatus: editModeldata?.taskStatus || "",
    });

    if (editModeldata?.attachment?.length) {
      setFiles(
        editModeldata.attachment.map((a) => ({
          name: a.name,
          type: a.type,
          size: null,
          uploaded: true,
          uploading: false,
          url: a.url,
        }))
      );
    }
    setAttachments(editModeldata.attachment || []);
    setCommentList(editModeldata?.comments || []);
    setSubtasks(editModeldata?.subtasks || []);
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
  }, [openTaskModel]);

  useEffect(() => {
    async function getHistory() {
      const res = await api.getTaskActivity({ taskId: editModeldata?._id });
      setHistoryData(res?.data?.data);
    }
    getHistory();
  }, [openTaskModel]);

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
  }, [openTaskModel]);

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
    setFiles([]);
    setAttachments([]);
    setPreviewFile(null);
    setTaskModel(false);
    setSubtaskRequired("");
    setCommentList([]);
    setComment("");
    setSubtasks([]);
  };

  const getChanges = (oldData = {}, newData = {}, isCreate = false) => {
    const changes = [];
    const fields = [
      "title",
      "description",
      "status",
      "priority",
      "due_date",
      "assignedTo",
      "tags",
      "originalTIme",
      "RemainingTIme",
      "CompleteTIme",
      "attachment",
      "comments",
      "subtasks",
    ];

    fields.forEach((field) => {
      const oldValue = oldData?.[field];
      const newValue = newData?.[field];

      // Convert arrays/objects to string for comparison
      const oldValStr = JSON.stringify(oldValue ?? null);
      const newValStr = JSON.stringify(newValue ?? null);

      if (isCreate) {
        if (newValue !== undefined && newValue !== "") {
          changes.push({
            type: "create",
            field,
            newValue,
          });
        }
      } else {
        if (oldValStr !== newValStr) {
          changes.push({
            type: "update",
            field,
            oldValue,
            newValue,
          });
        }
      }
    });

    return changes;
  };

  const onSubmit = async (data) => {
    const isCreate = !editModeldata?._id;

    const currentChanges = getChanges(editModeldata || {}, data, isCreate);
    try {
      const commonData = {
        ...data,
        assignedTo: data.assignedTo || null,
        tags: data.tags,
        attachment: attachment,
        originalTIme: data.originalTIme,
        RemainingTIme: data?.RemainingTIme,
        CompleteTIme: data?.CompleteTIme,
        comments: commentList || undefined,
        subtasks: subtasks || [],
        due_date: data.due_date ? new Date(data.due_date).toISOString() : null,
      };

      let res;

      if (editModeldata?._id) {
        const cleanType = editModeldata.type?.replace("edit_", "");
        const updatePayload = {
          ...commonData,
          type: cleanType,
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
        };

        res = await api.createTask(createPayload);
      }
      if (res.status === 200 || res.status === 201) {
        const taskId = res?.data?.data?.updateData?._id;
        const activityPayload = {
          taskId: taskId,
          action: editModeldata._id ? "update" : "create",
          changes: currentChanges,
        };

        await api.createTaskActivity(activityPayload);
        setRerender((prev) => !prev);
        toggle();
        seteditModelData(null);
      }
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  const focusStyle = (e) => (e.target.style.borderColor = "#0078d4");
  const blurStyle = (e) => (e.target.style.borderColor = "#d1d5db");

  const getKeyFromUrl = (url) => url.split(".amazonaws.com/")[1];

  const handlePreviewClick = async (file) => {
    try {
      const key = getKeyFromUrl(file.url);
      const res = await api.getPresignedViewUrl({ key });
      setPreviewFile({ ...file, url: res.data.url });
    } catch (err) {
      console.error("Preview error:", err);
    }
  };

  return (
    <Fragment>
      <Modal
        isOpen={openTaskModel}
        toggle={toggle}
        size="xl"
        centered
        backdrop="static"
        keyboard={false}
      >
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
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    borderBottom: "1px solid #e5e7eb",
                    marginBottom: "12px",
                  }}
                >
                  {[
                    "Details",
                    "Attachment",
                    "Sub Task",
                    "Comments",
                    "History",
                  ].map((item) => {
                    const isActive = activeTab === item;

                    return (
                      <button
                        type="button"
                        key={item}
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowDetails(item);
                        }}
                        style={{
                          position: "relative",
                          border: "none",
                          background: "transparent",
                          padding: "8px 2px",
                          fontSize: "14px",
                          fontWeight: isActive ? "600" : "500",
                          cursor: "pointer",
                          color: isActive ? "#2563eb" : "#6b7280",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {item}
                        {((item === "Attachment" && files?.length > 0) ||
                          (item === "Sub Task" && subtasks?.length > 0) ||
                          (item === "Comments" && commentList?.length > 0)) && (
                          <span
                            style={{
                              marginLeft: 5,
                              fontSize: 10,
                              fontWeight: 600,
                              background: "#2563eb",
                              color: "#fff",
                              borderRadius: 999,
                              padding: "1px 6px",
                            }}
                          >
                            {item === "Attachment"
                              ? files?.length
                              : item === "Sub Task"
                              ? subtasks?.length
                              : commentList?.length}
                          </span>
                        )}
                        <span
                          style={{
                            position: "absolute",
                            bottom: "-1px",
                            left: 0,
                            height: "2px",
                            width: isActive ? "100%" : "0%",
                            background: "#2563eb",
                            transition: "width 0.25s ease",
                          }}
                        />
                      </button>
                    );
                  })}
                </div>

                {activeTab === "Details" && (
                  <>
                    <div style={s.card}>
                      <div style={s.cardTitle}>Description</div>
                      <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                          <textarea
                            {...field}
                            rows={3}
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
                  </>
                )}

                {activeTab === "Attachment" && (
                  <div style={s.card}>
                    {/* Header */}
                    <div style={s.header}>
                      <div style={s.cardTitle}>Attachments</div>
                      <button
                        type="button"
                        style={s.uploadBtn}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        + Upload
                      </button>
                    </div>
                    <input
                      type="file"
                      multiple
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                    {files.length === 0 && (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "24px",
                          color: "#9ca3af",
                          fontSize: "13px",
                        }}
                      >
                        No attachments yet. Click Upload to add files.
                      </div>
                    )}
                    {files.length > 0 && (
                      <div
                        style={{
                          ...s.fileList,
                          maxHeight: files.length > 3 ? "198px" : "auto",
                          overflowY: files.length > 3 ? "auto" : "visible",
                          paddingRight: files.length > 3 ? "4px" : "0",
                        }}
                      >
                        {files.map((file, index) => {
                          const isImage = file.type?.startsWith("image/");
                          const icon = isImage
                            ? "🖼"
                            : file.type === "application/pdf"
                            ? "📄"
                            : "📝";

                          return (
                            <div
                              key={index}
                              style={{
                                ...s.fileItem,
                                cursor: file.uploaded ? "pointer" : "default",
                              }}
                              onClick={() =>
                                file.uploaded && setPreviewFile(file)
                              }
                            >
                              <div style={s.fileInfo}>
                                <div
                                  style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 6,
                                    background: isImage ? "#eff6ff" : "#fef2f2",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 14,
                                    padding: "1rem , 0px",
                                  }}
                                >
                                  {icon}
                                </div>
                                <div>
                                  <div style={s.fileName}>{file.name}</div>
                                  <div style={s.fileSize}>
                                    {file.size
                                      ? `${(file.size / 1024).toFixed(1)} KB · `
                                      : ""}
                                    {file.uploading
                                      ? "Uploading..."
                                      : file.uploaded
                                      ? "Uploaded"
                                      : "Pending"}
                                  </div>
                                </div>
                              </div>

                              <div
                                style={s.actions}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {file.uploading ? (
                                  <span
                                    style={{
                                      fontSize: 11,
                                      background: "#fef9c3",
                                      color: "#854d0e",
                                      padding: "2px 8px",
                                      borderRadius: 999,
                                    }}
                                  >
                                    uploading
                                  </span>
                                ) : file.uploaded ? (
                                  <span
                                    style={{
                                      fontSize: 11,
                                      background: "#dcfce7",
                                      color: "#166534",
                                      padding: "2px 8px",
                                      borderRadius: 999,
                                    }}
                                  >
                                    ✓ done
                                  </span>
                                ) : null}
                                <button
                                  onClick={() => removeFile(index)}
                                  style={s.removeBtn}
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
                {activeTab === "Sub Task" && (
                  <div style={s.card}>
                    {/* Header */}
                    <div style={s.header}>
                      <div style={s.cardTitle}>Sub Task</div>
                      <button
                        type="button"
                        style={s.uploadBtn}
                        onClick={() => setShowInput(true)}
                      >
                        Add Sub Task
                      </button>
                    </div>

                    {/* Input Box */}
                    {showInput && (
                      <>
                        <div
                          style={{
                            marginBottom: "10px",
                            display: "flex",
                            gap: "8px",
                          }}
                        >
                          <input
                            type="text"
                            value={newSubtask}
                            placeholder="Enter subtask..."
                            onChange={(e) => {
                              setSubtaskRequired("");
                              setNewSubtask(e.target.value);
                            }}
                            style={{ flex: 1, padding: "6px" }}
                          />
                          <button
                            type="button"
                            onClick={addSubtask}
                            style={s.uploadBtn}
                          >
                            Add
                          </button>
                        </div>
                        <div style={{ color: "red" }}>{subtaskreuire}</div>
                      </>
                    )}
                    <div
                      style={{
                        maxHeight: "166px",
                        overflowY: "auto",
                        paddingRight: "4px",
                      }}
                    >
                      {subtasks?.length === 0 ? (
                        <div>No subtasks yet</div>
                      ) : (
                        subtasks?.map((task, index) => (
                          <div
                            key={index}
                            style={{
                              marginBottom: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "6px 8px",
                              borderRadius: "6px",
                              background: "#f9fafb",
                            }}
                          >
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleSubtask(index)}
                              />
                              <span
                                style={{
                                  marginLeft: "8px",
                                  color: task.completed ? "#9ca3af" : "#111827",
                                }}
                              >
                                {task.title}
                              </span>
                            </div>

                            {/* Right side - Remove Button */}
                            <button
                              onClick={() => removeSubtask(index)}
                              style={{
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                color: "#ef4444",
                                fontSize: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
                {activeTab === "Comments" && (
                  <div style={s.card}>
                    <div style={s.cardTitle}>Discussion</div>
                    <div style={{ marginBottom: "10px" }}>
                      <div style={{ position: "relative" }}>
                        <textarea
                          rows={2}
                          placeholder="Add a comment..."
                          value={comment}
                          onChange={(e) => {
                            if (e.target.value.length <= MAX_CHARS)
                              setComment(e.target.value);
                          }}
                          style={{
                            ...s.input,
                            resize: "vertical",
                            fontFamily: "inherit",
                            lineHeight: 1.6,
                            width: "100%",
                            paddingBottom: "28px",
                            boxSizing: "border-box",
                          }}
                          onFocus={focusStyle}
                          onBlur={blurStyle}
                        />

                        <span
                          style={{
                            position: "absolute",
                            bottom: "8px",
                            right: "10px",
                            fontSize: "11px",
                            color:
                              comment.length >= MAX_CHARS
                                ? "#ef4444"
                                : "#9ca3af",
                          }}
                        >
                          {comment.length}/{MAX_CHARS}
                        </span>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          marginTop: "8px",
                        }}
                      >
                        <button
                          onClick={() => {
                            if (!comment.trim()) return;

                            setCommentList((prev) => [
                              ...prev,
                              {
                                text: comment.trim(),
                                userId: currentUser?._id,
                                authorName: currentUser?.name,

                                createdAt: new Date(),
                              },
                            ]);

                            setComment("");
                          }}
                          disabled={!comment.trim()}
                          style={{
                            backgroundColor: comment.trim()
                              ? "#6366f1"
                              : "#e5e7eb",
                            color: comment.trim() ? "#fff" : "#9ca3af",
                            border: "none",
                            borderRadius: "8px",
                            padding: "10px 12px",
                            fontSize: "14px",
                            fontWeight: 600,
                            cursor: comment.trim() ? "pointer" : "not-allowed",
                            transition: "background-color 0.2s",
                          }}
                        >
                          Post
                        </button>
                      </div>
                    </div>
                    <div
                      style={{
                        maxHeight: "100px",
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        paddingRight: "6px",
                      }}
                    >
                      {commentList?.length === 0 ? (
                        <div style={{ color: "#9ca3af", fontSize: "14px" }}>
                          No comments yet
                        </div>
                      ) : (
                        commentList?.map((c, i) => (
                          <div
                            key={i}
                            style={{
                              backgroundColor: "#f8f9fa",
                              border: "1px solid #e9ecef",
                              borderRadius: "8px",
                              padding: "8px 10px",
                            }}
                          >
                            {/* Header */}
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                marginBottom: "4px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <span
                                  style={{
                                    fontWeight: 600,
                                    fontSize: "13px",
                                    color: "#374151",
                                  }}
                                >
                                  {c.authorName}
                                </span>
                                <span
                                  style={{
                                    fontSize: "11px",
                                    color: "#9ca3af",
                                  }}
                                >
                                  {new Date(c.createdAt).toLocaleString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    }
                                  )}
                                </span>
                              </div>

                              {/* REMOVE BUTTON */}
                              <button
                                onClick={() =>
                                  setCommentList((prev) =>
                                    prev.filter((_, idx) => idx !== i)
                                  )
                                }
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  color: "#d1d5db",
                                  fontSize: "16px",
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.color = "#ef4444")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.color = "#d1d5db")
                                }
                              >
                                ✕
                              </button>
                            </div>

                            {/* Comment Text */}
                            <p
                              style={{
                                margin: 0,
                                fontSize: "14px",
                                color: "#4b5563",
                                lineHeight: 1.6,
                              }}
                            >
                              {c.text}
                            </p>
                          </div>
                        ))
                      )}
                      <div ref={commentEndRef} />
                    </div>
                  </div>
                )}

                {activeTab === "History" && (
                  <TaskHistory historyData={historyData} />
                )}
              </Col>

              <Col md={4}>
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
                  <label style={s.label}>Due Date</label>

                  <Controller
                    name="due_date"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <input
                        type="date"
                        {...field}
                        value={field.value || ""}
                        style={s.input}
                        min={todaymin}
                      />
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
                        { name: "originalTIme", label: "Original (hrs)" },
                        { name: "RemainingTIme", label: "Remaining (hrs)" },
                        { name: "CompleteTIme", label: "Completed (hrs)" },
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
            disabled={isSubmitting || isUploading}
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
      {previewFile && (
        <div
          onClick={() => setPreviewFile(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 20,
              width: 520,
              maxWidth: "90vw",
              position: "relative",
            }}
          >
            {/* header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#111827",
                  wordBreak: "break-all",
                }}
              >
                {previewFile.name}
              </span>
              <button
                onClick={() => setPreviewFile(null)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: 22,
                  cursor: "pointer",
                  color: "#6b7280",
                  marginLeft: 10,
                }}
              >
                ×
              </button>
            </div>

            {/* body */}
            <div
              style={{
                borderRadius: 8,
                overflow: "hidden",
                background: "#f9fafb",
                minHeight: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {previewFile.type?.startsWith("image/") ? (
                <img
                  src={previewFile.url}
                  alt={previewFile.name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: 400,
                    objectFit: "contain",
                  }}
                />
              ) : previewFile.type === "application/pdf" ? (
                <iframe
                  src={previewFile.url}
                  title={previewFile.name}
                  style={{ width: "100%", height: 400, border: "none" }}
                />
              ) : (
                <div
                  style={{ textAlign: "center", padding: 40, color: "#6b7280" }}
                >
                  <div style={{ fontSize: 40, marginBottom: 8 }}>📎</div>
                  <div style={{ fontSize: 13 }}>
                    Preview not available for this file type
                  </div>
                </div>
              )}
            </div>

            {/* footer */}
            <div
              style={{
                marginTop: 12,
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
              }}
            >
              <a
                href={previewFile.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: 13,
                  color: "#2563eb",
                  padding: "6px 14px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 6,
                  textDecoration: "none",
                }}
              >
                Open original
              </a>
              <button
                onClick={() => setPreviewFile(null)}
                style={{
                  fontSize: 13,
                  padding: "6px 14px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 6,
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default AddTask;
