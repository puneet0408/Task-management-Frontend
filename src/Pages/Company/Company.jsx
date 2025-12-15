import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCompanyData,
  setDateFrom,
  setDateTo,
  setParams,
  setSearchValue,
  SetSortField,
  setSortDirection,
  setStartIndex,
  setLastIndex,
} from "../../Redux/CompanySlice";
import moment from "moment";
import Pagination from "../../Components/Pagination/Pagination";
import CustomTable from "../../Components/CusomTable/CustomTable";
import Breadcrumbs from "../../Components/BreadCrumbs/Breadcrumbs";
import { BiTrash, BiEdit } from "react-icons/bi";
import { Button, Badge } from "react-bootstrap";
import useApi from "../../auth/service/useApi";
import TableToolbar from "../../Components/Toolbox/Toolbox";
import AddCompany from "./AddCompany/AddCompany";
import DateFilterModal from "../../Components/DateFilterModal/DateFiler";
import Swal from "sweetalert2";
function Company() {
  const dispatch = useDispatch();
  const api = useApi();
  const {
    allListItems,
    dateFrom,
    DateTo,
    params,
    searchvalue,
    sortDirection,
    sortFIeld,
    totalDataCount,
    startIndex,
    lastIndex,
  } = useSelector((state) => state.companyListPage);
  const [openAddForm, setOpenAddForm] = useState(false);
  const [editData, seteditData] = useState(null);
  const [openDateModel, setOpenDateModel] = useState(false);
  const handleAddCompany = () => {
    setOpenAddForm(true);
  };
  const handleEditCompany = (row) => {
    setOpenAddForm(true);
    seteditData(row);
  };

  useEffect(() => {
    if (!sortFIeld || !sortDirection) return;

    dispatch(setParams({ sortFIeld, sortDirection }));
  }, [sortFIeld, sortDirection]);

  const handleDeleteCompany = async (row) => {
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
          let res = await api.DeleteCompanyData(row._id);

          if (res.data.data.status == 201) {
            Swal.fire("Deleted!", "Company deleted successfully.", "success");
            dispatch(fetchCompanyData());
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
            dispatch(SetSortField("company_name"));
            dispatch(
              setSortDirection(sortDirection === "asc" ? "desc" : "asc")
            );
          }}
        >
          Company Name
          {sortFIeld === "company_name" && (
            <span style={{ marginLeft: 4 }}>
              {sortDirection === "asc" ? "▲" : "▼"}
            </span>
          )}
        </span>
      ),
      selector: (row) => row?.company_name,
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
            dispatch(SetSortField("owner_name"));
            dispatch(
              setSortDirection(sortDirection === "asc" ? "desc" : "asc")
            );
          }}
        >
          Owner Name
          {sortFIeld === "owner_name" && (
            <span style={{ marginLeft: 4 }}>
              {sortDirection === "asc" ? "▲" : "▼"}
            </span>
          )}
        </span>
      ),
      selector: (row) => row?.owner_name,
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
            dispatch(SetSortField("email"));
            dispatch(
              setSortDirection(sortDirection === "asc" ? "desc" : "asc")
            );
          }}
        >
          Email
          {sortFIeld === "email" && (
            <span style={{ marginLeft: 4 }}>
              {sortDirection === "asc" ? "▲" : "▼"}
            </span>
          )}
        </span>
      ),
      selector: (row) => row?.email,
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
            dispatch(SetSortField("contact_no"));
            dispatch(
              setSortDirection(sortDirection === "asc" ? "desc" : "asc")
            );
          }}
        >
          Contact No
          {sortFIeld === "contact_no" && (
            <span style={{ marginLeft: 4 }}>
              {sortDirection === "asc" ? "▲" : "▼"}
            </span>
          )}
        </span>
      ),
      selector: (row) => row?.contact_no,
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
            dispatch(SetSortField("createdAt"));
            dispatch(
              setSortDirection(sortDirection === "asc" ? "desc" : "asc")
            );
          }}
        >
          Created At
          {sortFIeld === "createdAt" && (
            <span style={{ marginLeft: 4 }}>
              {sortDirection === "asc" ? "▲" : "▼"}
            </span>
          )}
        </span>
      ),
      selector: (row) => moment(row?.createdAt).format("DD/MM/YYYY"),
    },
    {
      name: "Actions",
      width: "120px",
      align: "center",
      cell: (row) => (
        <div className="table-actions">
          <button
            onClick={() => handleEditCompany(row)}
            className="action-btn edit-btn"
          >
            <BiEdit />
          </button>

          <button
            onClick={() => handleDeleteCompany(row)}
            className="action-btn delete-btn"
          >
            <BiTrash />
          </button>
        </div>
      ),
    },
  ];
  useEffect(() => {
    dispatch(fetchCompanyData());
  }, [params]);
  const handleSearch = (value) => {
    dispatch(setSearchValue(value));
    dispatch(fetchCompanyData());
  };

  return (
    <div>
      <div className="rowAllignment">
        <Breadcrumbs
          title={"Company"}
          items={[
            { label: "Dashboard", path: "/dashboard" },
            { label: "Company", path: "/company" },
            { label: "List" },
          ]}
        />
        <Button onClick={handleAddCompany} className="add-btn">
          + Add Company
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
      <CustomTable
        columns={columns}
        data={
          allListItems?.length
            ? sortFIeld === "sno" && sortDirection === "desc"
              ? allListItems
                  .slice()
                  .reverse()
                  .map((item, i) => ({
                    ...item,
                    sno: totalDataCount - (params.offset + i),
                  }))
              : allListItems.slice().map((item, i) => ({
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
      <AddCompany
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
export default Company;
