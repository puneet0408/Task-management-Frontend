import React from "react";
import { BiEdit, BiTrash } from "react-icons/bi";
import { FaStar, FaRegStar } from "react-icons/fa";
import "./card.scss";

const ProjectCard = ({ item, onEdit, onDelete, markDefault, isdefaultId }) => {
  if (!item) return null;

  const isDefault = item._id === isdefaultId;

  return (
    <div className="pro-card">
      <div className="pro-card-header"onClick={() => markDefault?.(item)}>
        <h6 className="pro-card-title">
          {item?.projectName || "Unnamed Project"}
        </h6>
        <button
          className={`pro-star ${isDefault ? "active" : ""}`}
          onClick={() => markDefault?.(item)}
          title="Mark as default"
        >
          {isDefault ? <FaStar /> : <FaRegStar />}
        </button>
      </div>
      <p className="pro-card-desc"onClick={() => markDefault?.(item)}>
        {item?.description || "No description provided"}
      </p>
      <div className="pro-divider" onClick={() => markDefault?.(item)}/>
      <div className="pro-actions">
        <button
          className="pro-action-btn"
          onClick={() => onEdit?.(item)}
          title="Edit project"
        >
          <BiEdit />
          <span>Edit</span>
        </button>

        <button
          className="pro-action-btn danger"
          onClick={() => onDelete?.(item)}
          title="Delete project"
        >
          <BiTrash />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
