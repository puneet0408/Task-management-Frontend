// src/components/Layout/Header.js
import React, { useEffect, useState, useRef ,useMemo } from "react";
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
import Avatar from "../../Assets/avatar.png";
import Notificationmodel from "./notificationmodel";
import moment from "moment";
export default function Header() {
  const navigate = useNavigate();
  const api = useApi();
  const role = localStorage.getItem("role") || "Guest";
  const userData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("userData")) || {};
    } catch {
      return {};
    }
  }, []);

  
  const [projectOption, setProjectOption] = useState();
  const { companySlug } = useParams();
  const [selectedProject, setSelectedProject] = useState(null);
  const { currentUser } = useSelector((state) => state.userListPage);
  const [activebell, setActiveBell] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [activeSearch, setActiveSearch] = useState(false);
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

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            {role !== "superadmin" && projectOption?.length > 1 && (
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
                <Notificationmodel
                  notifications={notifications}
                  setShowNotification={setShowNotification}
                  companySlug={companySlug}
                  projectSlug={projectSlug}
                />
              )}
            </div>

            <div className="position-relative" ref={profileRef}>
              <div
                onClick={() => setShowProfileMenu((prev) => !prev)}
                style={{
                  display: "flex",
                  flexDirection:"column",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <img
                  src={userData?.profilepic?.url || Avatar}
                  alt="Profile"
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #e5e7eb",
                  }}
                />

                <span
                  style={{
                    fontWeight: "500",
                    fontSize: "14px",
                    color: "#4b5563",
                  }}
                >
                  {role}
                </span>
              </div>

              {showProfileMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "45px",
                    right: 0,
                    width: "150px",
                    background: "#fff",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                    overflow: "hidden",
                    zIndex: 9999,
                  }}
                >
                  <div
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate("/profile");
                    }}
                    style={{
                      padding: "12px 15px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                     Profile
                  </div>

                  {/* Logout */}
                  <div
                    onClick={handleLogout}
                    style={{
                      padding: "12px 15px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      color: "#dc2626",
                      borderTop: "1px solid #f3f4f6",
                    }}
                  >
                    <FiLogOut size={16} />
                    Logout
                  </div>
                </div>
              )}
            </div>
          </Nav>
        </div>
      </Navbar>
    </header>
  );
}
