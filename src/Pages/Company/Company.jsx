import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanyData } from "../../Redux/CompanySlice";
import CustomTable from "../../Components/CusomTable/CustomTable";
import Breadcrumbs from "../../Components/BreadCrumbs/Breadcrumbs";
import { BiTrash, BiEdit } from "react-icons/bi";
import { Button } from "react-bootstrap";
import { Input } from "reactstrap";
import TableToolbar from "../../Components/Toolbox/Toolbox"
function Company() {
  const dispatch = useDispatch();
  const { allListItems } = useSelector((state) => state.companyListPage);

  const columns = [
    {
      name: "SNO",
      selector: (row, index) => index + 1,
      width: "50px",
    },
    {
      name: "Company Name",
      selector: (row) => row?.name,
    },
    {
      name: "Address",
      selector: (row) => row?.address,
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
          <button className="action-btn edit-btn">
            <BiEdit />
          </button>

          <button className="action-btn delete-btn">
            <BiTrash />
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(fetchCompanyData());
  }, [dispatch]);

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
        <Button className="add-btn">+ Add Company</Button>
      </div>
        <TableToolbar
        onSearch={(value) => console.log("Search:", value)}
        onFilter={() => console.log("Open Filter")}
        onExport={() => console.log("Export Data")}
      />

      <CustomTable columns={columns} data={allListItems} />
    </div>
  );
}

export default Company;
