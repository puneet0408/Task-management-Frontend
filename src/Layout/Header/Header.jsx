// src/components/Layout/Header.js
import React, { useEffect, useState, useRef } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import AuthService from "../../auth/service/authService";
import { useNavigate } from "react-router-dom";
import { fetchProjectData } from "../../Redux/projectSlice";
import Select from "react-select";
import useApi from "../../auth/service/useApi";
import { fetchCurrentLogin } from "../../Redux/UserSlice";
import { toSlug } from "../../Utils/srugs";
import { socket } from "../../socket/socket";
import { CiBellOn } from "react-icons/ci";
import { FaBell } from "react-icons/fa";
import { Socket } from "socket.io-client";
import moment from "moment";
export default function Header() {
  const navigate = useNavigate();
  const api = useApi();
  const role = localStorage.getItem("role") || "Guest";
  const [projectOption, setProjectOption] = useState();
  const { companySlug } = useParams();
  const [selectedProject, setSelectedProject] = useState(null);
  const { currentUser } = useSelector((state) => state.userListPage);
  const [activebell, setActiveBell] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const dropdownRef = useRef(null);
  const companyName = currentUser?.company?.company_name;
  const projectName = currentUser?.preferences?.activeProject?.projectName;
  const projectSlug = toSlug(projectName);

  const dispatch = useDispatch();
  const { ProjectCardItem } = useSelector((state) => state.Projectcardpage);
  useEffect(() => {
    dispatch(fetchProjectData());
  }, []);
  useEffect(() => {
    if (ProjectCardItem?.length) {
      let option = ProjectCardItem.map((item) => ({
        label: item?.projectName,
        value: item?._id,
      }));
      setProjectOption(option);
    }
  }, [ProjectCardItem]);

  const handleSelectProject = async (value) => {
    setSelectedProject(value);
    let res = await api.MarkDefultProject(value?.value);
    if (res.status == 200) {
      dispatch(fetchCurrentLogin());
      dispatch(fetchProjectData());
      const currentproject = toSlug(res.data.data.activeProject);
      const activeCompany = toSlug(currentUser?.company?.company_name);
      navigate(`${`/${activeCompany}/${currentproject}/dashboard`}`);
    }
  };

  useEffect(() => {
    if (
      currentUser?.preferences?.activeProject?.projectId &&
      projectOption?.length
    ) {
      const defaultOption = projectOption.find(
        (opt) =>
          opt.value === currentUser?.preferences?.activeProject?.projectId ||
          null
      );
      setSelectedProject(defaultOption || null);
    }
  }, [currentUser, projectOption]);

  useEffect(() => {
    const getNotificationData = async () => {
      try {
        const response = await api.getNotification();

        if (response?.status === 200) {
          setNotifications(response?.data?.notification || []);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getNotificationData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotification(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!currentUser?._id) return;
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit("joinRoom", currentUser._id);
  }, [currentUser]);

  useEffect(() => {
    socket.on("newNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);

  const handleLogout = async () => {
    const api = new AuthService();
    const res = await api.logout();
    if (res.status === 500) {
      navigate("./login");
    }
    if (res.status === 201) {
      navigate("./login");
    }
    localStorage.clear();
    window.location.reload();
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 190,
        right: 0,
        zIndex: 1000,
        padding: "16px 24px",
        backgroundColor: "#f8fafc",
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <Navbar
        expand="lg"
        style={{
          borderRadius: "12px",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          height: "68px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
          border: "1px solid rgba(255, 255, 255, 0.8)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: "0 12px",
            height: "68px",
          }}
        >
          <div>
            <h5
              style={{
                color: "#7367F0",
                fontSize: "1.25rem",
              }}
            >
              {companySlug
                ? currentUser?.company?.company_name
                : "Task Master "}
            </h5>
          </div>
          <Nav
            className="d-flex"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "20px",
              padding: 0,
              margin: 0,
              height: "100%",
            }}
          >
            {!role === "superadmin" && (
              <span>
                <Select
                  options={projectOption}
                  value={selectedProject}
                  onChange={handleSelectProject}
                  classNamePrefix="react-select"
                  placeholder="Select Project"
                />
              </span>
            )}
            <div className="position-relative" ref={dropdownRef}>
              <span
                onClick={() => setShowNotification((prev) => !prev)}
                style={{
                  cursor: "pointer",
                  position: "relative",
                  color: "#7367F0",
                }}
              >
                <FaBell
                  style={{
                    width: "22px",
                    height: "22px",
                  }}
                />

                {notifications.filter((n) => !n.isRead).length > 0 && (
                  <span
                    className="badge rounded-pill bg-danger"
                    style={{
                      position: "absolute",
                      top: "-10px",
                      right: "-12px",
                      fontSize: "10px",
                      minWidth: "18px",
                      height: "18px",
                    }}
                  >
                    {notifications.filter((n) => !n.isRead).length}
                  </span>
                )}
              </span>

              {showNotification && (
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

                    <span className="badge bg-primary">
                      {notifications.length}
                    </span>
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
                        navigate(
                          `/${companySlug}/${projectSlug}/notification`,
                          { replace: true }
                        );
                      }}
                    >
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
            <span
              style={{
                fontWeight: "500",
                fontSize: "14px",
                color: "#4b5563",
                display: "flex",
                alignItems: "center",
              }}
            >
              {role}
            </span>

            <button
              onClick={handleLogout}
              style={{
                border: "none",
                outline: "none",
                cursor: "pointer",
                borderRadius: "8px",
                padding: "8px 14px",
                fontSize: "14px",
                color: "#dc2626",
                fontWeight: "500",
                backgroundColor: "transparent",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#fef2f2")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </Nav>
        </div>
      </Navbar>
    </header>
  );
}
