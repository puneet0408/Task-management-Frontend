import React from "react";
import { Button, Input } from "reactstrap";
import "./ToolBox.scss";

function TableToolbar({ onSearch, onFilter, onExport }) {
  return (
    <div className="table-toolbar">

      <Button outline className="filter-btn" onClick={onFilter}>
        Filter
      </Button>

      <div className="right-section">
        <Input
          className="search-input"
          placeholder="Search Here"
          type="text"
          onChange={(e) => onSearch?.(e.target.value)}
        />

        <Button outline className="export-btn" onClick={onExport}>
          Export
        </Button>
      </div>

    </div>
  );
}

export default TableToolbar;
