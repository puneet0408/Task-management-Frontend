import React from "react";

function ContentStats({ data }) {
  if (!data) return null;

  const { subtasksummary, attachment, commentSummary } = data;

  const storageGB = 2.4;
  const storageLimitGB = 5;
  const storagePercent = Math.round((storageGB / storageLimitGB) * 100);

  return (
    <div style={styles.grid}>

      {/* Attachments */}
      <div style={styles.card}>
        <h3 style={styles.title}> Attachments</h3>
        <div style={styles.miniGrid}>
          <div style={styles.miniCard}>
            <p style={styles.miniVal}>{attachment?.totalattachment ?? 0}</p>
            <p style={styles.miniLabel}>Total files</p>
          </div>
          <div style={styles.miniCard}>
            <p style={styles.miniVal}>{attachment?.taskContainFile ?? 0}</p>
            <p style={styles.miniLabel}>Tasks with files</p>
          </div>
          <div style={styles.miniCard}>
            <p style={{ ...styles.miniVal, color: "#EF9F27" }}>{attachment?.taskContainoFile ?? 0}</p>
            <p style={styles.miniLabel}>No attachments</p>
          </div>
          {/* <div style={styles.miniCard}>
            <p style={styles.miniVal}>{storageGB} GB</p>
            <p style={styles.miniLabel}>S3 storage</p>
          </div> */}
        </div>
        <div style={styles.progressTrack}>
          <div style={{ ...styles.progressFill, width: `${storagePercent}%` }} />
        </div>
        <p style={styles.progressLabel}>{storagePercent}% of {storageLimitGB} GB used</p>
      </div>

      {/* Subtasks */}
      <div style={styles.card}>
        <h3 style={styles.title}> Subtasks</h3>
        <div style={styles.miniGrid}>
          <div style={styles.miniCard}>
            <p style={styles.miniVal}>{subtasksummary?.totalSubtasks ?? 0}</p>
            <p style={styles.miniLabel}>Total</p>
          </div>
          <div style={styles.miniCard}>
            <p style={{ ...styles.miniVal, color: "#1D9E75" }}>{subtasksummary?.completedSubtaskCount ?? 0}</p>
            <p style={styles.miniLabel}>Done</p>
          </div>
          <div style={styles.miniCard}>
            <p style={{ ...styles.miniVal, color: "#EF9F27" }}>{subtasksummary?.pendingSubtaskCount ?? 0}</p>
            <p style={styles.miniLabel}>Pending</p>
          </div>
          <div style={styles.miniCard}>
            <p style={{ ...styles.miniVal, color: "#E24B4A" }}>{subtasksummary?.noSubtaskCount ?? 0}</p>
            <p style={styles.miniLabel}>No subtasks</p>
          </div>
        </div>
        {subtasksummary?.totalSubtasks > 0 && (
          <>
            <div style={styles.progressTrack}>
              <div style={{
                ...styles.progressFill,
                width: `${Math.round((subtasksummary.completedSubtaskCount / subtasksummary.totalSubtasks) * 100)}%`,
                background: "#1D9E75",
              }} />
            </div>
            <p style={styles.progressLabel}>
              {Math.round((subtasksummary.completedSubtaskCount / subtasksummary.totalSubtasks) * 100)}% subtask completion
            </p>
          </>
        )}
      </div>

      {/* Comments */}
      <div style={styles.card}>
        <h3 style={styles.title}> Comments</h3>
        <div style={styles.miniGrid}>
          <div style={styles.miniCard}>
            <p style={styles.miniVal}>{commentSummary?.totalComments ?? 0}</p>
            <p style={styles.miniLabel}>Total</p>
          </div>
          <div style={styles.miniCard}>
            <p style={{ ...styles.miniVal, color: "#E24B4A" }}>{commentSummary?.noCommentCount ?? 0}</p>
            <p style={styles.miniLabel}>No comments</p>
          </div>
          <div style={{ ...styles.miniCard, gridColumn: "span 2", textAlign: "left" }}>
            <p style={styles.mostActiveTitle}>
              {commentSummary?.mostCommentedTask?.title ?? "—"}
            </p>
            <div style={styles.mostActiveMeta}>
              <span style={styles.mostActiveLabel}>Most active task</span>
              <span style={styles.commentCountBadge}>
                {commentSummary?.mostCommentedTask?.commentCount ?? 0} comments
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default ContentStats;

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    width: "100%",
  },
  card: {
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 12,
    padding: 18,
    boxSizing: "border-box",
  },
  title: {
    fontSize: 14,       // ← section title
    fontWeight: 500,
    color: "#111",
    margin: "0 0 14px",
  },
  miniGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
    marginBottom: 12,
  },
  miniCard: {
    background: "#f5f5f5",
    borderRadius: 8,
    padding: "12px 10px",
    textAlign: "center",
  },
  miniVal: {
    fontSize: 22,       // ← big number
    fontWeight: 500,
    color: "#111",
    margin: "0 0 4px",
    lineHeight: 1,
  },
  miniLabel: {
    fontSize: 11,       // ← label under number
    color: "#888",
    margin: 0,
    lineHeight: 1.3,
  },
  progressTrack: {
    width: "100%",
    height: 5,
    background: "#eee",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 2,
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    background: "#534AB7",
  },
  progressLabel: {
    fontSize: 11,       // ← progress text
    color: "#999",
    margin: "5px 0 0",
  },
  mostActiveTitle: {
    fontSize: 13,       // ← task name
    fontWeight: 500,
    color: "#111",
    margin: "0 0 6px",
    lineHeight: 1.4,
  },
  mostActiveMeta: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mostActiveLabel: {
    fontSize: 11,
    color: "#888",
  },
  commentCountBadge: {
    fontSize: 10,
    fontWeight: 500,
    background: "#E6F1FB",
    color: "#0C447C",
    padding: "2px 8px",
    borderRadius: 20,
  },
};