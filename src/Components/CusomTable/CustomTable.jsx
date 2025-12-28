import React from "react";
import "./CustomTable.scss";

function CustomTable({ columns, data }) {
  return (
    <div className="custom-table-wrapper">
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                style={{
                  width: col.width || "auto",
                  textAlign: col.align || "left",
                }}
              >
                {col.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="table-row">
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    style={{
                      width: col.width || "auto",
                      textAlign: col.align || "left",
                    }}
                  >
                    {col.cell
                      ? col.cell(row, rowIndex)
                      : col.selector
                      ? col.selector(row, rowIndex)
                      : ""}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="no-data">
                No Data Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CustomTable;
