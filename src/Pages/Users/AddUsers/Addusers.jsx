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
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import toast from "react-hot-toast";
import useApi from "../../../auth/service/useApi";

function AddCompany({ openAddForm, setOpenAddForm, editData, seteditData }) {
  const api = useApi();
  const toggle = () => setOpenAddForm(!openAddForm);
  const defaultValues = {
    name: "",
    company_name: "",
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

  const prodValidation = yup.object().shape({
    name: yup.string().trim().required("Name is mandatory"),
    company_name: yup.string().trim().required("Company Name is mandatory"),

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

  const dispatch = useDispatch();
  const [companyDropdown, setCompanyDropdown] = useState([]);
  console.log(companyDropdown, "companyDropdown");

  useEffect(() => {
    if (editData) {
      reset({
        name: editData.name || "",
        company_name: editData.company_name || "",
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
  const role = userData.role;
  console.log(role, "role");

  useEffect(() => {
    dispatch(fetchCompanyData());
  }, []);
  useEffect(() => {
    const companyList = allListItems.map((list) => {
      return { label: list.company_name, value: list._id };
    });
    setCompanyDropdown(companyList);
  }, [allListItems]);
  const handleClose = () => {
    clearErrors();
    reset(defaultValues);
    setOpenAddForm(false);
    seteditData(null);
  };

  const onSubmit = async (formData) => {
    console.log(formData,"formDataformData");
    
    try {
      const isEdit = Boolean(editData?._id);
      console.log(isEdit,"isEdit");
      
      const res = isEdit
        ? await api.editUsers(formData, editData._id)
        : await api.PostUSers(formData);

      if (res?.data?.data?.status === 201) {
        toast.success(
          isEdit ? "User updated successfully" : "User created successfully"
        );
        handleClose();
        dispatch(fetchUsersData());
      }
    } catch (err) {
      console.log(err);
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
                <Button className="submit-btn">Submit</Button>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  );
}

export default AddCompany;
