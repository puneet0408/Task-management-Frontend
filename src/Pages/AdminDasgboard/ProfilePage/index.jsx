import React, { useState, useMemo, useRef, useEffect } from "react";
import Avatar from "../../../Assets/avatar.png";
import useApi from "../../../auth/service/useApi";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Shield,
  Activity,
  Camera,
} from "react-feather";

function ProfilePage() {
  const api = useApi();
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const userData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("userData")) || {};
    } catch {
      return {};
    }
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setIsUploading(true);

      // local preview
      setPreview(URL.createObjectURL(file));

      const res = await api.awsmediaupoader({
        fileName: file.name,
        fileType: file.type,
      });

      const { uploadUrl, fileUrl } = res.data;

      await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });
      await api.editUsers(
        {
          profilepic: {
            name: file.name,
            type: file.type,
            url: fileUrl,
          },
        },
        userData._id
      );
      const updatedUser = {
        ...userData,
        profilepic: {
          name: file.name,
          type: file.type,
          url: fileUrl,
        },
      };

      localStorage.setItem("userData", JSON.stringify(updatedUser));

      setPreview(fileUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  // const handleFileChange = (e) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setPreview(URL.createObjectURL(file));
  //   }
  // };

  const infoCards = [
    {
      icon: Mail,
      label: "Email Address",
      value: userData?.email || "-",
    },
    {
      icon: Phone,
      label: "Contact Number",
      value: userData?.contact_no || "-",
    },
    {
      icon: Briefcase,
      label: "Role",
      value: userData?.role || "-",
    },
    {
      icon: Shield,
      label: "Permission",
      value: userData?.permission || "-",
    },
  ];

  return (
    <div className="container-fluid py-3">
      {/* Header */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-auto text-center">
              <div className="position-relative d-inline-block">
                <img
                  src={preview || userData?.profilepic?.url || Avatar}
                  alt="Profile"
                  className="rounded-circle border"
                  style={{
                    width: "130px",
                    height: "130px",
                    objectFit: "cover",
                  }}
                />

                <label
                  className="btn btn-primary btn-sm rounded-circle position-absolute"
                  style={{
                    bottom: 5,
                    right: 0,
                    width: 35,
                    height: 35,
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Camera size={15} />
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>

            <div className="col">
              <h2 className="mb-1 text-capitalize">
                {userData?.name || "User"}
              </h2>

              <div className="d-flex flex-wrap gap-2 mb-2">
                <span className="badge bg-primary text-capitalize">
                  {userData?.role || "Employee"}
                </span>

                <span
                  className={`badge ${
                    userData?.status === "active"
                      ? "bg-success"
                      : "bg-secondary"
                  }`}
                >
                  {userData?.status || "Unknown"}
                </span>
              </div>

              <p className="text-muted mb-0">{userData?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Personal Info */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white">
              <h5 className="mb-0">Account Information</h5>
            </div>

            <div className="card-body">
              {infoCards.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="d-flex align-items-start mb-4"
                  >
                    <div
                      className="bg-light rounded p-2 me-3"
                      style={{ minWidth: "40px" }}
                    >
                      <Icon size={18} />
                    </div>

                    <div>
                      <div className="text-muted small">{item.label}</div>

                      <div className="fw-semibold">{item.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Workspace Info */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white">
              <h5 className="mb-0">Current Workspace</h5>
            </div>

            <div className="card-body">
              <div className="d-flex align-items-start mb-4">
                <div
                  className="bg-light rounded p-2 me-3"
                  style={{ minWidth: "40px" }}
                >
                  <Briefcase size={18} />
                </div>

                <div>
                  <div className="text-muted small">Active Project</div>

                  <div className="fw-semibold">
                    {userData?.preferences?.activeProject?.projectName || "-"}
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-start">
                <div
                  className="bg-light rounded p-2 me-3"
                  style={{ minWidth: "40px" }}
                >
                  <Activity size={18} />
                </div>

                <div>
                  <div className="text-muted small">Active Sprint</div>

                  <div className="fw-semibold">
                    {userData?.preferences?.Activesprint?.sprintName || "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">Address Information</h5>
            </div>

            <div className="card-body">
              <div className="d-flex align-items-start">
                <div
                  className="bg-light rounded p-2 me-3"
                  style={{ minWidth: "40px" }}
                >
                  <MapPin size={18} />
                </div>

                <div>
                  <div className="text-muted small">Address</div>

                  <div className="fw-semibold">
                    {userData?.address || "Not Available"}
                  </div>

                  {(userData?.city || userData?.state || userData?.country) && (
                    <div className="text-muted mt-1">
                      {[userData?.city, userData?.state, userData?.country]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company */}
        {/* <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">Organization</h5>
            </div>

            <div className="card-body">
              <div className="d-flex align-items-center">
                <User size={18} className="me-2" />
                <span className="fw-semibold">
                  Company ID : {userData?.company_name || "-"}
                </span>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default ProfilePage;
