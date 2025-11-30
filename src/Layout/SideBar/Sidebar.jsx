import React from "react";
import { NavLink } from "react-router-dom";
import menuConfig from "../../Navigation/menuConfig";

import {
  FaHome,
  FaFolderOpen,
  FaTasks,
  FaChartBar
} from "react-icons/fa";

import "./style.scss"; 

const iconMap = {
  FaHome,
  FaFolderOpen,
  FaTasks,
  FaChartBar
};

export default function Sidebar() {
  const role = localStorage.getItem("role") || "employee";
  const allowedMenu = menuConfig.filter(item => item.roles.includes(role));

  return (
    <aside className="app-sidebar">
      <div className="brand">TaskMaster</div>

      <nav className="nav-list">
        {allowedMenu.map(item => {
          const Icon = iconMap[item.icon] || FaHome;

          return (
            <NavLink 
              key={item.id}
              to={item.path}
              className="nav-item"
              activeclassname="active"
            >
              <Icon size={18} />
              <span className="nav-text">{item.title}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
