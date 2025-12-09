import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCompanyData,
  setDateFrom,
  setDateTo,
  setParams,
  setSearchValue,
} from "../../Redux/CompanySlice";
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
  const { allListItems, dateFrom, DateTo, params, searchvalue } = useSelector(
    (state) => state.companyListPage
  );
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
      name: "SNO",
      selector: (row, index) => index + 1,
      width: "50px",
    },
    {
      name: "Company Name",
      selector: (row) => row?.company_name,
    },
    {
      name: "Owner Name",
      selector: (row) => row?.owner_name,
    },
    {
      name: "Email",
      selector: (row) => row?.email,
    },
    {
      name: "contact No",
      selector: (row) => row?.contact_no,
    },
    {
      name: "Contact No",
      selector: (row) => row?.contact_no,
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
        <Button onCl ick={handleAddCompany} className="add-btn">
          + Add Company
        </Button>
      </div>
      <TableToolbar
        searchvalue={searchvalue}
        onSearch={(value) => handleSearch(value)}
        onFilter={() => setOpenDateModel(true)}
        // onExport={() => console.log("Export Data")}
      />
      <div className="d-flex flex-wrap gap-1 mb-1">
        {Object.entries(params)
        .filter(([key, value]) => key !== "searchvalue" && value)
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

        {/* CLEAR ALL ONLY WHEN ACTIVE FILTERS EXIST */}
        {Object.values(params).some((v) => v) && (
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
                  dateFrom: "",
                  dateTo: "",
                })
              )
            }
          >
            Clear All
          </span>
        )}
      </div>

      <CustomTable columns={columns} data={allListItems} />
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
