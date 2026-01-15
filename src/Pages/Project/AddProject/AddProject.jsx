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
// import "./AddProject.scss";
import { useForm, Controller } from "react-hook-form";
import { fetchCompanyData } from "../../../Redux/CompanySlice";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import toast from "react-hot-toast";
import useApi from "../../../auth/service/useApi";

function AddProject({ openAddForm, setOpenAddForm, editData, seteditData }) {
  const api = useApi();
  const toggle = () => setOpenAddForm(!openAddForm);

  const defaultValues = {
    owner_name: "",
    projectName: "",
    email: "",
    no_of_user: "",
    no_of_project: "",
    description: "",
    contact_no: "",
    city: "",
    state: "",
    country: "",
    status: "active",
  };

  const prodValidation = yup.object().shape({
    projectName: yup
      .string()
      .required("Project Name is mandatory")
      .transform((v) => (v ? v.trim() : v))
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
      reset({
        projectName: editData.projectName,
        description: editData.description,
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
      const isEdit = editData && editData._id;
      const payload = {
        projectName: formData.projectName,
        description: formData.description,
        status: formData.status,
      };
      if (!isEdit) {
        res = await api.PostProject(payload);
      } else {
        res = await api.editProject(payload, editData._id);
      }
      if (res.data.status == 201) {
        toast.success(
          isEdit
            ? "Project updated successfully"
            : "Project created successfully"
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
          centered
        // modalClassName="side-modal"
        // contentClassName="side-modal-content"
      >
        <ModalHeader
          toggle={toggle}
          close={
            <button className="close-btn" onClick={handleClose}>
              ×
            </button>
          }
        >
          <h5 className="modal-title">Add Project</h5>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)} className="company-form">
            <Row>
              <Col md={12}>
                <Label className="form-label">
                  Name<span className="text-danger">*</span>
                </Label>
                <Controller
                  name="projectName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="form-input"
                      invalid={!!errors.name}
                      placeholder="Enter Project Name"
                    />
                  )}
                />
                {errors.projectName && (
                  <small className="error-text">
                    {errors.projectName.message}
                  </small>
                )}
              </Col>
              <Col md={12}>
                <Label className="form-label">Description</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="form-input"
                      type="textarea"
                      placeholder="Enter description"
                    />
                  )}
                />
              </Col>
              <Col md={12}>
                <Label className="form-label">Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} type="select" className="form-input">
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
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

export default AddProject;
