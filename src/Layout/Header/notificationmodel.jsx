import React from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";

function notificationmodel({
  notifications,
  setShowNotification,
  companySlug,
  projectSlug,
}) {
  const navigate = useNavigate();
  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: "40px",
        width: "380px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        className="d-flex justify-content-between align-items-center"
        style={{
          padding: "15px",
          borderBottom: "1px solid #eee",
        }}
      >
        <h6 className="mb-0" style={{ fontWeight: 600 }}>
          Notifications
        </h6>

        <span className="badge bg-primary">{notifications.length}</span>
      </div>

      {/* Notifications */}
      <div
        style={{
          maxHeight: "320px",
          overflowY: "auto",
        }}
      >
        {notifications?.slice(0, 4).map((item) => (
          <div
            key={item._id}
            style={{
              padding: "10px 14px",
              borderBottom: "1px solid #f3f4f6",
              background: item.isRead ? "#fff" : "#f8f7ff",
              cursor: "pointer",
              transition: "all .2s ease",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#374151",
                  lineHeight: 1.2,
                }}
              >
                {item.title}
              </div>

              {!item.isRead && (
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#7367F0",
                    flexShrink: 0,
                  }}
                />
              )}
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "#6b7280",
                marginTop: "2px",
                lineHeight: 1.3,
              }}
            >
              {item.message}
            </div>

            <div
              style={{
                fontSize: "11px",
                color: "#9ca3af",
                marginTop: "3px",
              }}
            >
              {moment(item.createdAt).fromNow()}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "12px",
          borderTop: "1px solid #eee",
          background: "#fafafa",
        }}
      >
        <button
          className="btn btn-primary w-100"
          onClick={() => {
            setShowNotification(false);
            navigate(`/${companySlug}/${projectSlug}/notification`, {
              replace: true,
            });
          }}
        >
          View All Notifications
        </button>
      </div>
    </div>
  );
}

export default notificationmodel;
