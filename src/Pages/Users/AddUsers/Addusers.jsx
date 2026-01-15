import React, { Fragment, useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  Form,
  Input,
  Label,
  Button,
} from "reactstrap";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { fetchCompanyData } from "../../../Redux/CompanySlice";
import { fetchUsersData } from "../../../Redux/UserSlice";
import { fetchProjectData } from "../../../Redux/projectSlice";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import toast from "react-hot-toast";
import useApi from "../../../auth/service/useApi";

function AddUsers({ openAddForm, setOpenAddForm, editData, seteditData }) {
  const api = useApi();
  const toggle = () => setOpenAddForm(!openAddForm);
  const defaultValues = {
    name: "",
    company_name: "",
    project_name: "",
    email: "",
    contact_no: "",
    address: "",
    role: "admin",
    city: "",
    state: "",
    country: "",
    status: "pending",
  };
  const { allListItems } = useSelector((state) => state.companyListPage);
  const { ProjectCardItem } = useSelector((state) => state.Projectcardpage);
  const [loading , setloading] = useState(false);

  const prodValidation = yup.object().shape({
    name: yup.string().trim().required("Name is mandatory"),
    company_name: yup.string().when("$loginrole", {
      is: "superadmin",
      then: (schema) => schema.required("Company Name is mandatory"),
      otherwise: (schema) => schema.notRequired(),
    }),
    project_name: yup.array().when("loginrole", {
      is: (val) => val != "superadmin",
      then: (schema) =>
        schema
          .min(1, "Please select at least one project")
          .required("Project is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    email: yup.string().email("Invalid Email").required("Email is mandatory"),
    contact_no: yup
      .string()
      .required("Phone number is required")
      .test("phone-valid", "Invalid phone number", (value) =>
        value ? isValidPhoneNumber(value) : false
      ),

    role: yup.string().required("Role is required"),
    status: yup.string().required("Status is required"),
  });

  const {
    control,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(prodValidation),
    defaultValues,
  });
  console.log(errors, "das");

  const dispatch = useDispatch();
  const [companyDropdown, setCompanyDropdown] = useState([]);
  const [ProjectDropdown, setProjectDropdown] = useState([]);
  console.log(companyDropdown, "companyDropdown");

  useEffect(() => {
    if (editData) {
      reset({
        name: editData.name || "",
        company_name: editData.company_name || "",
        project_name: Array.isArray(editData.project_name)
          ? editData.project_name
          : [],

        email: editData.email || "",
        contact_no: editData.contact_no ? `+${editData.contact_no}` : "",
        address: editData.address || "",
        role: editData.role || "admin",
        city: editData.city || "",
        state: editData.state || "",
        country: editData.country || "",
        status: editData.status || "active",
      });
    } else {
      reset(defaultValues);
    }
  }, [editData, reset]);

  const stored = localStorage.getItem("userData");
  const userData = stored ? JSON.parse(stored) : {};
  const loginrole = userData.role;
  console.log(loginrole, "loginrole");

  useEffect(() => {
    dispatch(fetchCompanyData());
    dispatch(fetchProjectData());
  }, []);
  useEffect(() => {
    const companyList = allListItems.map((list) => {
      return { label: list.company_name, value: list._id };
    });
    setCompanyDropdown(companyList);
  }, [allListItems]);

  useEffect(() => {
    const ProjectList = ProjectCardItem.map((list) => {
      return { label: list.projectName, value: list._id };
    });
    setProjectDropdown(ProjectList);
  }, [ProjectCardItem]);

  const handleClose = () => {
    clearErrors();
    reset(defaultValues);
    setOpenAddForm(false);
    seteditData(null);
  };

  const onSubmit = async (formData) => {
    try {
      setloading(true);
      const isEdit = Boolean(editData?._id);
      const res = isEdit
        ? await api.editUsers(formData, editData._id)
        : await api.PostUSers(formData);
      if (res?.data?.status === 201) {
        toast.success(
          isEdit ? "User updated successfully" : "User created successfully"
        );
        setloading(false);
        handleClose();
        dispatch(fetchUsersData());
      }
    } catch (err) {
      console.log(err);
      setloading(false);
      toast.error("Something went wrong");
    }
  };

  return (
    <Fragment>
      <Modal
        isOpen={openAddForm}
        toggle={toggle}
        backdrop={true}
        modalClassName="side-modal"
        contentClassName="side-modal-content"
      >
        <ModalHeader
          toggle={toggle}
          close={
            <button className="close-btn" onClick={handleClose}>
              ×
            </button>
          }
        >
          <h5 className="modal-title">{editData ? "Edit" : "Add"} Users</h5>
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)} className="company-form">
            <Row>
              <Col md={12}>
                <Label className="form-label">
                  Name <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="form-input"
                      invalid={!!errors.name}
                      placeholder="Enter User Name"
                    />
                  )}
                />
                {errors.name && (
                  <small className="error-text">{errors.name.message}</small>
                )}
              </Col>
              {loginrole == "superadmin" ? (
                <Col md={12}>
                  <Label className="form-label">
                    Company Name <span className="text-danger">*</span>
                  </Label>

                  <Controller
                    name="company_name"
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={companyDropdown}
                        value={
                          companyDropdown.find(
                            (opt) => opt.value === field.value
                          ) || null
                        }
                        onChange={(selected) => field.onChange(selected?.value)}
                        classNamePrefix="react-select"
                        className={errors.company_name ? "is-invalid" : ""}
                        placeholder="Select Company"
                      />
                    )}
                  />

                  {errors.company_name && (
                    <small className="error-text">
                      {errors.company_name.message}
                    </small>
                  )}
                </Col>
              ) : (
                ""
              )}

              {loginrole != "superadmin" && (
                <Col md={12}>
                  <Label className="form-label">
                    Project <span className="text-danger">*</span>
                  </Label>

                  <Controller
                    name="project_name"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <Select
                        isMulti
                        options={ProjectDropdown}
                        value={ProjectDropdown.filter((opt) =>
                          field.value?.includes(opt.value)
                        )}
                        onChange={(selectedOptions) =>
                          field.onChange(
                            selectedOptions
                              ? selectedOptions.map((opt) => opt.value)
                              : []
                          )
                        }
                        classNamePrefix="react-select"
                        className={errors.project_name ? "is-invalid" : ""}
                        placeholder="Select Project"
                      />
                    )}
                  />

                  {errors.project_name && (
                    <small className="error-text">
                      {errors.project_name.message}
                    </small>
                  )}
                </Col>
              )}

              <Col md={12}>
                <Label className="form-label">
                  Email <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="form-input"
                      invalid={!!errors.email}
                      placeholder="Enter Email"
                    />
                  )}
                />
                {errors.email && (
                  <small className="error-text">{errors.email.message}</small>
                )}
              </Col>
              <Col md={12}>
                <Label className="form-label">
                  Contact Number <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="contact_no"
                  control={control}
                  render={({ field }) => (
                    <PhoneInput
                      value={field.value}
                      onChange={field.onChange}
                      defaultCountry="IN"
                      className={`phone-input-wrapper ${
                        errors.contact_no ? "is-invalid" : ""
                      }`}
                      placeholder="Enter phone number"
                    />
                  )}
                />

                {errors.contact_no && (
                  <small className="error-text">
                    {errors.contact_no.message}
                  </small>
                )}
              </Col>
              <Col md={12}>
                <Label className="form-label">Address</Label>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="form-input"
                      type="textarea"
                      placeholder="Enter Address"
                    />
                  )}
                />
              </Col>
              <Col md={6}>
                <Label className="form-label">
                  Role <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} type="select" className="form-input">
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="employee">Employee</option>
                    </Input>
                  )}
                />
                {errors.role && (
                  <small className="error-text">{errors.role.message}</small>
                )}
              </Col>

              <Col md={6}>
                <Label className="form-label">City</Label>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="form-input"
                      placeholder="City"
                    />
                  )}
                />
              </Col>
              <Col md={6}>
                <Label className="form-label">State</Label>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="form-input"
                      placeholder="State"
                    />
                  )}
                />
              </Col>
              <Col md={6}>
                <Label className="form-label">Country</Label>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="form-input"
                      placeholder="Country"
                    />
                  )}
                />
              </Col>
              <Col md={6}>
                <Label className="form-label">Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} type="select" className="form-input">
                      <option value="pending">Pending</option>
                      <option value="inactive">Inactive</option>
                    </Input>
                  )}
                />
              </Col>
              <Col md={12} className="text-end mt-3">
                <Button className="submit-btn" disabled={loading} >{loading ? "...Submiting" :"submit"}</Button>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  );
}

export default AddUsers;
