import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "react-feather";

function Pagination({
  currentOffset = 0,
  totalCount = 0,
  limit = 10,
  onOffsetChange,
  onLimitChange,
}) {
  const currentPage = Math.floor(currentOffset / limit) + 1;
  const totalPages = Math.ceil(totalCount / limit);

  const startRow = totalCount === 0 ? 0 : currentOffset + 1;
  const endRow = Math.min(currentOffset + limit, totalCount);

  return (
    <div className="pagination-wrapper right-align">
      <div className="pagination-content">
        {/* Rows per page */}
        <div className="pagination-left">
          <span>Rows per page</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
          >
            {[10, 25, 50, 100].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Info */}
        <div className="pagination-center">
          {startRow}-{endRow} of {totalCount}
        </div>

        {/* Controls */}
        <div className="pagination-right">
          <button
            disabled={currentPage === 1}
            onClick={() => onOffsetChange(0)}
          >
            <ChevronsLeft size={16} />
          </button>

          <button
            disabled={currentPage === 1}
            onClick={() => onOffsetChange((currentPage - 2) * limit)}
          >
            <ChevronLeft size={16} />
          </button>

          <button
            disabled={currentPage === totalPages}
            onClick={() => onOffsetChange(currentPage * limit)}
          >
            <ChevronRight size={16} />
          </button>

          <button
            disabled={currentPage === totalPages}
            onClick={() => onOffsetChange((totalPages - 1) * limit)}
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
