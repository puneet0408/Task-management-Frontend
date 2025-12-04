import React from "react";
import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import "./Breadcrumbs.scss";

function Breadcrumbs({ title, items = [] }) {
  return (
    <nav className="breadcrumb-wrapper">
      <h2 className="breadcrumb-title">{title}</h2>

      <ol className="breadcrumb-list">
        {items.map((item, index) => (
          <li key={index} className="breadcrumb-item">
            {index !== 0 && (
              <FiChevronRight className="breadcrumb-separator" />
            )}

            {index !== items.length - 1 ? (
              <Link to={item.path || "#"}>{item.label}</Link>
            ) : (
              <span className="active">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
