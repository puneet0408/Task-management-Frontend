import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  fetchSprintData,
  setDateFrom,
  setDateTo,
  setParams,
  setSearchValue,
  SetSortField,
  setSortDirection,
} from "../../Redux/SprintSlice";
import moment from "moment";
import LoadingModule from "../../Components/TableLoadingModule/loadingmodule";
import Pagination from "../../Components/Pagination/Pagination";
import CustomTable from "../../Components/CusomTable/CustomTable";
import Breadcrumbs from "../../Components/BreadCrumbs/Breadcrumbs";
import { BiTrash, BiEdit } from "react-icons/bi";
import { Button, Badge } from "react-bootstrap";
import useApi from "../../auth/service/useApi";
import TableToolbar from "../../Components/Toolbox/Toolbox";
import AddSprint from "./AddSprint";
import DateFilterModal from "../../Components/DateFilterModal/DateFiler";
import Swal from "sweetalert2";
function SprintPage() {
  const dispatch = useDispatch();
  const api = useApi();
  const {
    SprintListItem,
    dateFrom,
    DateTo,
    params,
    searchvalue,
    sortDirection,
    sortFIeld,
    totalDataCount,
    loading,
  } = useSelector((state) => state.SprintListPAge);
  const [openAddForm, setOpenAddForm] = useState(false);
  const [editData, seteditData] = useState(null);
  const [openDateModel, setOpenDateModel] = useState(false);
  const handleAddsprint = () => {
    setOpenAddForm(true);
  };
  const handleEditsprint = (row) => {
    setOpenAddForm(true);
    seteditData(row);
  };

  useEffect(() => {
    if (!sortFIeld || !sortDirection) return;

    dispatch(setParams({ sortFIeld, sortDirection }));
  }, [sortFIeld, sortDirection]);

  const handleDeletesprint = async (row) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let res = await api.DeleteSprint(row._id);

          if (res.data.data.status == 201) {
            Swal.fire("Deleted!", "sprint deleted successfully.", "success");
            dispatch(fetchSprintData());
          }
        } catch (error) {
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  };

  const columns = [
    {
      name: (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => {
            dispatch(SetSortField("sno"));
            dispatch(
              setSortDirection(sortDirection === "asc" ? "desc" : "asc")
            );
          }}
        >
          S. No
          {sortFIeld === "sno" && (
            <span style={{ marginLeft: 4 }}>
              {sortDirection === "asc" ? "▲" : "▼"}
            </span>
          )}
        </span>
      ),
      cell: (row) => row.sno,
      width: "80px",
    },
    {
      name: (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => {
            dispatch(SetSortField("name"));
            dispatch(
              setSortDirection(sortDirection === "asc" ? "desc" : "asc")
            );
          }}
        >
          Name
          {sortFIeld === "name" && (
            <span style={{ marginLeft: 4 }}>
              {sortDirection === "asc" ? "▲" : "▼"}
            </span>
          )}
        </span>
      ),
      selector: (row) => row?.sprintName,
    },
    {
      name: (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => {
            dispatch(SetSortField("startDate"));
            dispatch(
              setSortDirection(sortDirection === "asc" ? "desc" : "asc")
            );
          }}
        >
          Started Date
          {sortFIeld === "startDate" && (
            <span style={{ marginLeft: 4 }}>
              {sortDirection === "asc" ? "▲" : "▼"}
            </span>
          )}
        </span>
      ),
      selector: (row) => moment(row?.startDate).format("DD/MM/YYYY"),
    },
    {
      name: (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => {
            dispatch(SetSortField("endDate"));
            dispatch(
              setSortDirection(sortDirection === "asc" ? "desc" : "asc")
            );
          }}
        >
          End Date
          {sortFIeld === "endDate" && (
            <span style={{ marginLeft: 4 }}>
              {sortDirection === "asc" ? "▲" : "▼"}
            </span>
          )}
        </span>
      ),
      selector: (row) => moment(row?.endDate).format("DD/MM/YYYY"),
    },
    {
      name: "Actions",
      width: "100px",
      align: "center",
      cell: (row) => (
        <div className="action-wrapper">
          <button className="dot-btn">
            <BsThreeDotsVertical />
          </button>

          <div className="action-menu">
            <button className="menu-item" onClick={() => handleEditsprint(row)}>
              <BiEdit className="icon edit" />
              Edit
            </button>

            <button
              className="menu-item delete"
              onClick={() => handleDeletesprint(row)}
            >
              <BiTrash className="icon delete" />
              Delete
            </button>
          </div>
        </div>
      ),
    },
  ];
  useEffect(() => {
    dispatch(fetchSprintData());
  }, [params]);
  const handleSearch = (value) => {
    dispatch(setSearchValue(value));
    dispatch(fetchSprintData());
  };

  return (
    <div>
      <div className="rowAllignment">
        <Breadcrumbs
          title={"Sprint"}
          items={[
            { label: "Dashboard", path: "/dashboard" },
            { label: "Sprint", path: "/sprint" },
            { label: "List" },
          ]}
        />
        <Button onClick={handleAddsprint} className="add-btn">
          + Add Sprint
        </Button>
      </div>
      <TableToolbar
        searchvalue={searchvalue}
        onSearch={(value) => handleSearch(value)}
        onFilter={() => setOpenDateModel(true)}
      />
      <div className="d-flex flex-wrap gap-1 mb-1">
        {Object.entries(params)
          .filter(
            ([key, value]) =>
              value !== null &&
              value !== "" &&
              ![
                "searchvalue",
                "offset",
                "limit",
                "sortFIeld",
                "sortDirection",
              ].includes(key)
          )
          .map(([key, value]) => (
            <span
              key={key}
              className="badge me-80"
              style={{
                border: "1px solid var(--primary)",
                color: "var(--primary)",
                backgroundColor: "transparent",
                padding: "6px 12px",
                fontSize: "13px",
                fontWeight: 400,
                borderRadius: "80px",
              }}
            >
              {key}: {value}
            </span>
          ))}
        {Object.entries(params).some(
          ([key, value]) =>
            value &&
            ![
              "searchvalue",
              "offset",
              "limit",
              "sortFIeld",
              "sortDirection",
            ].includes(key)
        ) && (
          <span
            className="badge"
            style={{
              cursor: "pointer",
              border: "1px solid var(--primary)",
              color: "var(--primary)",
              backgroundColor: "transparent",
              padding: "6px 6px",
              fontSize: "13px",
              fontWeight: 400,
              borderRadius: "80px",
            }}
            onClick={() =>
              dispatch(
                setParams({
                  dateFrom: null,
                  dateTo: null,
                  offset: 0,
                  limit: 2,
                  sortFIeld: null,
                  sortDirection: null,
                })
              )
            }
          >
            Clear All
          </span>
        )}
      </div>
           {loading ? (
        <LoadingModule />
      ) : (
        <>
      <CustomTable
        columns={columns}
        data={
          SprintListItem?.length
            ? sortFIeld === "sno" && sortDirection === "desc"
              ? SprintListItem.slice()
                  .reverse()
                  .map((item, i) => ({
                    ...item,
                    sno: totalDataCount - (params.offset + i),
                  }))
              : SprintListItem.slice().map((item, i) => ({
                  ...item,
                  sno: Number(params.offset + i + 1),
                }))
            : []
        }
      />

      <Pagination
        currentOffset={params.offset}
        totalCount={totalDataCount}
        limit={params.limit}
        onOffsetChange={(offset) => dispatch(setParams({ offset }))}
        onLimitChange={(limit) => dispatch(setParams({ offset: 0, limit }))}
      />
      </>
      )}
      <AddSprint
        openAddForm={openAddForm}
        setOpenAddForm={setOpenAddForm}
        editData={editData}
        seteditData={seteditData}
      />
      <DateFilterModal
        openDateModel={openDateModel}
        setOpenDateModel={setOpenDateModel}
        setDateFrom={(value) => dispatch(setDateFrom(value))}
        setDateTo={(value) => dispatch(setDateTo(value))}
        setParams={(value) => dispatch(setParams(value))}
        dateFrom={dateFrom}
        DateTo={DateTo}
      />
    </div>
  );
}
export default SprintPage;
