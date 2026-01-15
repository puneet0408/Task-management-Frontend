import React, { Fragment, useEffect } from "react";
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
// import "./Addcompany.scss";
import { useForm, Controller } from "react-hook-form";
import { fetchCompanyData } from "../../../Redux/CompanySlice";
import { useDispatch } from "react-redux";
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
    owner_name: "",
    company_name: "",
    email: "",
    no_of_user: "",
    no_of_project: "",
    address: "",
    contact_no: "",
    city: "",
    state: "",
    country: "",
    status: "active",
  };

  const prodValidation = yup.object().shape({
    owner_name: yup
      .string()
      .required("Owner Name is mandatory")
      .transform((v) => (v ? v.trim() : v)),

    company_name: yup
      .string()
      .required("Company Name is mandatory")
      .transform((v) => (v ? v.trim() : v)),

    email: yup.string().email("Invalid Email").required("Email is mandatory"),

    contact_no: yup
      .string()
      .required("Phone number is required")
      .test("phone-valid", "Invalid phone number", (value) =>
        value ? isValidPhoneNumber(value) : false
      ),
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

  useEffect(() => {
    if (editData) {
      const formattedPhone = editData.contact_no
        ? String(editData.contact_no).startsWith("+")
          ? String(editData.contact_no)
          : `+${editData.contact_no}`
        : "";

      reset({
        owner_name: editData.owner_name,
        company_name: editData.company_name,
        email: editData.email,
        no_of_user: editData?.limit?.maxUsers ?? "",
        no_of_project: editData?.limit?.maxProjects ?? "",
        address: editData.address,
        contact_no: formattedPhone,
        city: editData.city,
        state: editData.state,
        country: editData.country,
        status: editData.status,
      });
    } else {
      reset(defaultValues);
    }
  }, [editData]);

  const handleClose = () => {
    clearErrors();
    reset(defaultValues);
    setOpenAddForm(false);
    seteditData(null);
  };

  const onSubmit = async (formData) => {
    let res;
    try {
      const formattedPhone = formData.contact_no
        ? String(formData.contact_no).startsWith("+")
          ? String(formData.contact_no)
          : `+${formData.contact_no}`
        : "";
      const isEdit = editData && editData._id;
      const payload = {
        owner_name: formData.owner_name,
        company_name: formData.company_name,
        email: formData.email,
        limit: {
          maxUsers: formData.no_of_user,
          maxProjects: Number(formData.no_of_project),
        },
        address: formData.address,
        contact_no: formattedPhone,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        status: formData.status,
      };
      if (!isEdit) {
        res = await api.PostCompany(payload);
      } else {
        res = await api.editCompanyData(payload, editData._id);
      }
      if (res.data.data.status == 201) {
        toast.success(
          isEdit
            ? "Company updated successfully"
            : "Company created successfully"
        );
        handleClose();
        dispatch(fetchCompanyData());
        seteditData(null);
      }
    } catch (err) {
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
          <h5 className="modal-title">Add Company</h5>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)} className="company-form">
            <Row>
              {/* Owner Name */}
              <Col md={12}>
                <Label className="form-label">
                  Owner Name <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="owner_name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="form-input"
                      invalid={!!errors.owner_name}
                      placeholder="Enter Owner Name"
                    />
                  )}
                />
                {errors.owner_name && (
                  <small className="error-text">
                    {errors.owner_name.message}
                  </small>
                )}
              </Col>

              {/* Company Name */}
              <Col md={12}>
                <Label className="form-label">
                  Company Name <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="company_name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="form-input"
                      invalid={!!errors.name}
                      placeholder="Enter Company Name"
                    />
                  )}
                />
                {errors.company_name && (
                  <small className="error-text">
                    {errors.company_name.message}
                  </small>
                )}
              </Col>

              {/* Email */}
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

              {/* No of Users */}
              <Col md={6}>
                <Label className="form-label">No. of Users</Label>
                <Controller
                  name="no_of_user"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="form-input"
                      type="number"
                      placeholder="Enter number of users"
                    />
                  )}
                />
              </Col>
              <Col md={6}>
                <Label className="form-label">No. of Project</Label>
                <Controller
                  name="no_of_project"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="form-input"
                      type="number"
                      placeholder="Enter number of Project"
                    />
                  )}
                />
              </Col>

              {/* Address */}
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

              {/* City */}
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

              {/* State */}
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

              {/* Country */}
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

              {/* Status */}
              <Col md={6}>
                <Label className="form-label">Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} type="select" className="form-input">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Input>
                  )}
                />
              </Col>

              {/* Button */}
              <Col md={12} className="text-end mt-3">
                <Button className="submit-btn">Save Company</Button>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  );
}

export default AddCompany;
