import { useEffect, useState } from "react";
import useApi from "../../auth/service/useApi";
import { Spinner } from "reactstrap";
import { Bell, CheckCircle } from "react-feather";
import moment from "moment";

export default function Notification() {
  const api = useApi();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getNotificationData = async () => {
      try {
        const response = await api.getNotification();
        setNotifications(response?.data?.notification || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getNotificationData();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div style={{ padding: "12px 14px" }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="d-flex align-items-center gap-2">
          <Bell size={15} />
          <span style={{ fontSize: 15, fontWeight: 500 }}>Notifications</span>
          {unreadCount > 0 && (
            <span
              style={{
                background: "#E6F1FB",
                color: "#185FA5",
                fontSize: 11,
                fontWeight: 500,
                padding: "2px 8px",
                borderRadius: 20,
              }}
            >
              {unreadCount} unread
            </span>
          )}
        </div>
        <button
          style={{
            fontSize: 11,
            color: "#185FA5",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Mark all read
        </button>
      </div>

      {/* States */}
      {loading ? (
        <div className="text-center mt-4">
          <Spinner size="sm" />
        </div>
      ) : notifications.length === 0 ? (
        <div
          className="text-center"
          style={{
            padding: "32px 16px",
            border: "0.5px solid var(--bs-border-color)",
            borderRadius: 8,
            color: "#888",
            fontSize: 13,
          }}
        >
          <Bell size={28} className="mb-1 text-muted" />
          <p className="mb-0">You're all caught up.</p>
        </div>
      ) : (
        notifications.map((item) => (
          <div
            key={item._id}
            className="d-flex gap-2 align-items-start mb-1"
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              background: "#fff",
              border: "0.5px solid #e0e0e0",
              borderLeft: `3px solid ${item.isRead ? "#ccc" : "#378ADD"}`,
              cursor: "pointer",
            }}
          >
            <CheckCircle
              size={15}
              style={{ marginTop: 2, flexShrink: 0, color: item.isRead ? "#aaa" : "#185FA5" }}
            />

            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="d-flex align-items-center gap-2">
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.title}
                </span>
                {!item.isRead && (
                  <span
                    style={{
                      background: "#FCEBEB",
                      color: "#A32D2D",
                      fontSize: 10,
                      fontWeight: 500,
                      padding: "1px 6px",
                      borderRadius: 20,
                      flexShrink: 0,
                    }}
                  >
                    New
                  </span>
                )}
              </div>
              <p
                className="mb-0"
                style={{
                  fontSize: 12,
                  color: "#666",
                  marginTop: 2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.message}
              </p>
            </div>

            <span style={{ fontSize: 11, color: "#aaa", flexShrink: 0, marginTop: 2, whiteSpace: "nowrap" }}>
              {moment(item.createdAt).fromNow()}
            </span>
          </div>
        ))
      )}
    </div>
  );
}