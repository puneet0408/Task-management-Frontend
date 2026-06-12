import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Card, CardBody } from "reactstrap";
import { fetchUsersData } from "../../Redux/UserSlice";
import useApi from "../../auth/service/useApi";

// ─── helpers ────────────────────────────────────────────────────────────────

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");

const AVATAR_COLORS = [
  { bg: "#E6F1FB", color: "#0C447C" },
  { bg: "#EAF3DE", color: "#27500A" },
  { bg: "#EEEDFE", color: "#3C3489" },
  { bg: "#FAECE7", color: "#712B13" },
  { bg: "#E1F5EE", color: "#085041" },
];

// ─── styles (inline so no external CSS file needed) ─────────────────────────

const styles = {
  pageHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1.25rem",
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 600,
    margin: 0,
    color: "#1a1a1a",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  pageSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    margin: "4px 0 0",
  },
  userCount: {
    fontSize: 13,
    color: "#6b7280",
    background: "#f3f4f6",
    padding: "4px 12px",
    borderRadius: 100,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14,
  },
  thead: {
    background: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
  },
  th: {
    padding: "10px 16px",
    fontSize: 12,
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  td: {
    padding: "14px 16px",
    borderBottom: "1px solid #f3f4f6",
    verticalAlign: "middle",
  },
  userCell: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 600,
    flexShrink: 0,
  },
  userName: {
    fontSize: 14,
    fontWeight: 500,
    margin: 0,
    color: "#111827",
  },
  userEmail: {
    fontSize: 12,
    color: "#6b7280",
    margin: "2px 0 0",
  },
  radioWrap: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  radio: {
    width: 16,
    height: 16,
    accentColor: "#185FA5",
    cursor: "pointer",
  },
  statusBadge: (status) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "3px 10px",
    borderRadius: 100,
    fontSize: 12,
    fontWeight: 500,
    background: status === "active" ? "#EAF3DE" : "#F1EFE8",
    color: status === "active" ? "#27500A" : "#444441",
    textTransform: "capitalize",
  }),
  statusDot: (status) => ({
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: status === "active" ? "#639922" : "#888780",
    flexShrink: 0,
  }),
  rolePill: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 100,
    fontSize: 11,
    fontWeight: 500,
    background: "#EEEDFE",
    color: "#3C3489",
    textTransform: "capitalize",
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: "1rem",
    paddingTop: "1rem",
    borderTop: "1px solid #f3f4f6",
  },
  btnReset: {
    padding: "7px 16px",
    borderRadius: 8,
    fontSize: 14,
    cursor: "pointer",
    border: "1px solid #d1d5db",
    background: "transparent",
    color: "#374151",
  },
  btnSave: {
    padding: "7px 18px",
    borderRadius: 8,
    fontSize: 14,
    cursor: "pointer",
    border: "1px solid #185FA5",
    background: "#185FA5",
    color: "#fff",
    fontWeight: 500,
  },
  emptyState: {
    textAlign: "center",
    padding: "2.5rem 1rem",
    color: "#9ca3af",
    fontSize: 14,
  },
  loadingState: {
    textAlign: "center",
    padding: "2.5rem 1rem",
    color: "#9ca3af",
    fontSize: 14,
  },
  toast: (visible) => ({
    position: "fixed",
    bottom: "1.5rem",
    right: "1.5rem",
    background: "#185FA5",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: 8,
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    gap: 8,
    zIndex: 9999,
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(8px)",
    transition: "opacity 0.2s, transform 0.2s",
    pointerEvents: "none",
  }),
};

// ─── component ───────────────────────────────────────────────────────────────

function PermissionPage() {
  const api = useApi();
  const dispatch = useDispatch(); // still used for fetchUsersData

  const { allUserListItems = [], loading } = useSelector(
    (state) => state.userListPage
  );

  // local permission map: { [_id]: "view" | "action" }
  const [permissions, setPermissions] = useState({});
  // snapshot saved to server
  const [savedPermissions, setSavedPermissions] = useState({});
  const [toast, setToast] = useState({ visible: false, message: "" });

  // fetch users on mount
  useEffect(() => {
    dispatch(fetchUsersData());
  }, [dispatch]);

  // initialise permission state once users load
  useEffect(() => {
    if (allUserListItems.length > 0) {
      const initial = {};
      allUserListItems.forEach((u) => {
        // keep existing value if already set (e.g. after re-fetch),
        // otherwise fall back to "view"
        initial[u._id] = permissions[u._id] ?? u.permission ?? "view";
      });
      setPermissions(initial);
      setSavedPermissions((prev) => {
        const snap = {};
        allUserListItems.forEach((u) => {
          snap[u._id] = prev[u._id] ?? u.permission ?? "view";
        });
        return snap;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allUserListItems]);

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: "" }), 2500);
  };

  const handlePermChange = (userId, value) => {
    setPermissions((prev) => ({ ...prev, [userId]: value }));
  };

  const handleSave = async () => {
    try {
      const changed = allUserListItems.filter(
        (u) => permissions[u._id] !== savedPermissions[u._id]
      );

      if (changed.length === 0) {
        showToast("No changes to save.");
        return;
      }
      await Promise.all(
        changed.map((u) =>
          api.editUsers({ permission: permissions[u._id] }, u._id)
        )
      );

      setSavedPermissions({ ...permissions });
      showToast("Permissions saved successfully.");
    } catch (err) {
      console.error("Failed to save permissions:", err);
      showToast("Failed to save. Please try again.");
    }
  };

  const handleReset = () => {
    setPermissions({ ...savedPermissions });
    showToast("Permissions reset.");
  };

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <Row>
      <Col md="12">
        <Card>
          <CardBody>
            {/* header */}
            <div style={styles.pageHeader}>
              <div>
                <h4 style={styles.pageTitle}>
                  {/* shield icon via inline SVG – no extra dependency */}
                  {/* <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#185FA5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg> */}
                  User Task Permissions
                </h4>
                <p style={styles.pageSubtitle}>
                  Manage access levels for each team member.
                </p>
              </div>
              <span style={styles.userCount}>
                {allUserListItems.length} user
                {allUserListItems.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* table */}
            {loading ? (
              <div style={styles.loadingState}>Loading users…</div>
            ) : allUserListItems.length === 0 ? (
              <div style={styles.emptyState}>No users found.</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={styles.table}>
                  <thead style={styles.thead}>
                    <tr>
                      <th style={{ ...styles.th, textAlign: "left", width: "35%" }}>
                        User
                      </th>
                      <th style={{ ...styles.th, textAlign: "center", width: "15%" }}>
                        Role
                      </th>
                      <th style={{ ...styles.th, textAlign: "center", width: "15%" }}>
                        View only
                      </th>
                      <th style={{ ...styles.th, textAlign: "center", width: "15%" }}>
                        Allow action
                      </th>
                      <th style={{ ...styles.th, textAlign: "center", width: "20%" }}>
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {allUserListItems.map((user, index) => {
                      const perm = permissions[user._id] ?? "viewOnly";
                      const avatarStyle =
                        AVATAR_COLORS[index % AVATAR_COLORS.length];

                      return (
                        <tr
                          key={user._id}
                          style={{
                            background: index % 2 === 0 ? "#fff" : "#fafafa",
                          }}
                        >
                          {/* user info */}
                          <td style={styles.td}>
                            <div style={styles.userCell}>
                              <div
                                style={{
                                  ...styles.avatar,
                                  background: avatarStyle.bg,
                                  color: avatarStyle.color,
                                }}
                              >
                                {getInitials(user.name)}
                              </div>
                              <div>
                                <p style={styles.userName}>{user.name}</p>
                                <p style={styles.userEmail}>{user.email}</p>
                              </div>
                            </div>
                          </td>

                          {/* role */}
                          <td style={{ ...styles.td, textAlign: "center" }}>
                            <span style={styles.rolePill}>{user.role}</span>
                          </td>

                          {/* view only radio */}
                          <td style={{ ...styles.td, textAlign: "center" }}>
                            <div style={styles.radioWrap}>
                              <input
                                type="radio"
                                style={styles.radio}
                                name={`permission-${user._id}`}
                                value="viewOnly"
                                checked={perm === "viewOnly"}
                                onChange={() =>
                                  handlePermChange(user._id, "viewOnly")
                                }
                              />
                            </div>
                          </td>

                          {/* allow action radio */}
                          <td style={{ ...styles.td, textAlign: "center" }}>
                            <div style={styles.radioWrap}>
                              <input
                                type="radio"
                                style={styles.radio}
                                name={`permission-${user._id}`}
                                value="allowAction"
                                checked={perm === "allowAction"}
                                onChange={() =>
                                  handlePermChange(user._id, "allowAction")
                                }
                              />
                            </div>
                          </td>

                          {/* status badge */}
                          <td style={{ ...styles.td, textAlign: "center" }}>
                            <span style={styles.statusBadge(user.status)}>
                              <span style={styles.statusDot(user.status)} />
                              {user.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* footer actions */}
            {!loading && allUserListItems.length > 0 && (
              <div style={styles.footer}>
                <button style={styles.btnReset} onClick={handleReset}>
                  Reset
                </button>
                <button style={styles.btnSave} onClick={handleSave}>
                  Save changes
                </button>
              </div>
            )}
          </CardBody>
        </Card>
      </Col>

      {/* toast notification */}
      <div style={styles.toast(toast.visible)}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        {toast.message}
      </div>
    </Row>
  );
}

export default PermissionPage;
