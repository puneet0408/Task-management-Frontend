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
import moment from "moment";
import { fetchSprintData } from "../../Redux/SprintSlice";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import useApi from "../../auth/service/useApi";

function AddSprint({ openAddForm, setOpenAddForm, editData, seteditData }) {
  const api = useApi();
  const toggle = () => setOpenAddForm(!openAddForm);
  const defaultValues = {
    sprintName: "",
    startDate: "",
    endDate: "",
  };
  const prodValidation = yup.object().shape({
    sprintName: yup
      .string()
      .required("Sprint Name is mandatory")
      .transform((v) => (v ? v.trim() : v)),

    startDate: yup.date().required("Start date is required"),

    endDate: yup
      .date()
      .required("End date is required")
      .min(yup.ref("startDate"), "End date must be after start date"),
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
        sprintName: editData.sprintName,
        startDate: editData.startDate?.slice(0, 10),
        endDate: editData.endDate?.slice(0, 10),
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
    try {
      const isEdit = editData && editData._id;

      const payload = {
        sprintName: formData.sprintName,
        startDate: formData.startDate
          ? moment(formData.startDate).format("YYYY-MM-DD")
          : "",
        endDate: formData.endDate
          ? moment(formData.endDate).format("YYYY-MM-DD")
          : "",
      };

      const res = isEdit
        ? await api.editSprint(payload, editData._id)
        : await api.PostSprint(payload);

      if (res.data.status === 201) {
        toast.success(
          isEdit
            ? "Sprint updated successfully"
            : "Sprint created successfully"
        );
        dispatch(fetchSprintData());
        handleClose();
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Fragment>
      <Modal isOpen={openAddForm} toggle={toggle} centered>
        <ModalHeader
          toggle={toggle}
          close={
            <button className="close-btn" onClick={handleClose}>
              ×
            </button>
          }
        >
          <h5 className="modal-title">New Sprint</h5>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              {/* Sprint Name */}
              <Col md={12}>
                <Label className="form-label">
                  Name <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="sprintName"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter Sprint Name" />
                  )}
                />
                {errors.sprintName && (
                  <small className="text-danger">
                    {errors.sprintName.message}
                  </small>
                )}
              </Col>

              {/* 🔹 Start Date */}
              <Col md={6} className="mt-2">
                <Label className="form-label">
                  Start Date <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => <Input type="date" {...field} />}
                />
                {errors.startDate && (
                  <small className="text-danger">
                    {errors.startDate.message}
                  </small>
                )}
              </Col>

              {/* 🔹 End Date */}
              <Col md={6} className="mt-2">
                <Label className="form-label">
                  End Date <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => <Input type="date" {...field} />}
                />
                {errors.endDate && (
                  <small className="text-danger">
                    {errors.endDate.message}
                  </small>
                )}
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

export default AddSprint;
