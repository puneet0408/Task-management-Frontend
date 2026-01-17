import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toSlug } from "../../Utils/srugs";
import {
  fetchProjectData,
  setDateFrom,
  setDateTo,
  setParams,
  setSearchValue,
} from "../../Redux/projectSlice";
import { fetchCurrentLogin } from "../../Redux/UserSlice";
import ProjectCard from "../../Components/CardComponent/cardComponent";
import Breadcrumbs from "../../Components/BreadCrumbs/Breadcrumbs";
import AddProject from "./AddProject/AddProject";
import useApi from "../../auth/service/useApi";
import TableToolbar from "../../Components/Toolbox/Toolbox";
import DateFilterModal from "../../Components/DateFilterModal/DateFiler";
import Swal from "sweetalert2";
function Project() {
  const dispatch = useDispatch();
  const api = useApi();
  const {
    ProjectCardItem,
    dateFrom,
    DateTo,
    params,
    searchvalue,
    sortDirection,
    sortFIeld,
  } = useSelector((state) => state.Projectcardpage);
  const { currentUser } = useSelector((state) => state.userListPage);
  const [isdefaultProject, setIsDefaultProject] = useState("");
  const navigate = useNavigate();
  const [openAddForm, setOpenAddForm] = useState(false);
  const [rerenderUser, setRerenderUSer] = useState(false);
  const [editData, seteditData] = useState(null);
  const [openDateModel, setOpenDateModel] = useState(false);

  useEffect(() => {
    setIsDefaultProject(currentUser?.preferences?.defaultProjectId || null);
  }, [rerenderUser, ProjectCardItem]);
  const handleAddProject = () => {
    setOpenAddForm(true);
  };

  const handleEditProject = (row) => {
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
          let res = await api.DeleteProject(row._id);
          if (res.data.data.status == 201) {
            Swal.fire("Deleted!", "Project deleted successfully.", "success");
            dispatch(fetchProjectData());
          }
        } catch (error) {
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  };

  useEffect(() => {
    dispatch(fetchProjectData());
  }, [params]);

  const handleSearch = (value) => {
    dispatch(setSearchValue(value));
    dispatch(fetchProjectData());
  };

  const handleDefaultProject = async (value) => {
    let res = await api.MarkDefultProject(value?._id);
    if (res.status == 200) {
      const currentproject = toSlug(res.data.data.activeProject);
      const activeCompany = toSlug(currentUser?.company?.company_name);
      navigate(`${`/${activeCompany}/${currentproject}/dashboard`}`);
      await dispatch(fetchCurrentLogin());
      setRerenderUSer(true);
      dispatch(fetchProjectData());
    }
  };

  return (
    <div>
      <div className="rowAllignment">
        <Breadcrumbs
          title={"Project List"}
          items={[
            { label: "Dashboard", path: "/dashboard" },
            { label: "Project", path: "/projects" },
            { label: "Card" },
          ]}
        />
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
              ].includes(key),
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
            ].includes(key),
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
                }),
              )
            }
          >
            Clear All
          </span>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          alignItems: "flex-start",
        }}
      >
        {ProjectCardItem?.map((item) => (
          <ProjectCard
            key={item._id}
            item={item}
            isdefaultId={isdefaultProject}
            onEdit={handleEditProject}
            onDelete={handleDeleteCompany}
            markDefault={handleDefaultProject}
          />
        ))}
        <div
          onClick={handleAddProject}
          style={{
            width: "220px",
            height: "140px",
            border: "2px dashed #cbd5e1",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            background: "#f8fafc",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "2px solid #6366f1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
              fontWeight: "600",
              color: "#6366f1",
            }}
          >
            +
          </div>
        </div>
      </div>

      <AddProject
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

export default Project;
