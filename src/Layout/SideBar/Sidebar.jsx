import React from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import menuConfig from "../../Navigation/menuConfig";

import {
  FaHome,
  FaFolderOpen,
  FaTasks,
  FaChartBar,
  FaExchangeAlt,
} from "react-icons/fa";

import "./style.scss";

const iconMap = {
  FaHome,
  FaFolderOpen,
  FaTasks,
  FaChartBar,
};
export default function Sidebar() {
  const { companySlug, projectId } = useParams();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.userListPage);
  const role =
    useSelector((state) => state.userListPage.currentUser?.role) ||
    localStorage.getItem("role");
  const isProjectScope = Boolean(projectId);
  const allowedMenu = menuConfig
    .filter((item) => item.roles.includes(role))
    .filter((item) => {
      if (isProjectScope) return item.scope === "project";
      return item.scope === "company";
    });
  return (
    <aside className="app-sidebar">
      <div className="brand">
        {" "}
        {companySlug ? currentUser?.company?.company_name : "Task Master "}{" "}
      </div>
      <div className="sidebar-content">
        <nav className="nav-list">
          {allowedMenu.map((item) => {
            const Icon = iconMap[item.icon] || FaHome;
            const to =
              item.scope === "project"
                ? `/${companySlug}/${projectId}/${item.path}`
                : item.path;
            return (
              <NavLink
                key={item.id}
                to={to}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                <Icon size={18} />
                <span className="nav-text">{item.title}</span>
              </NavLink>
            );
          })}
        </nav>
        {isProjectScope && ["admin", "manager", "employee"].includes(role) && (
          <div
            className="nav-item change-project"
            onClick={() => navigate("/projects")}
          >
            <FaExchangeAlt size={18} />
            <span className="nav-text">Change project</span>
          </div>
        )}
      </div>
    </aside>
  );
}
