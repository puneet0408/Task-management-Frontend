import React, { Fragment } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  Form,
  Label,
  Button,
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import Flatpickr from "react-flatpickr";

function DateFilterModal({
  openDateModel,
  setOpenDateModel,
  setDateFrom,
  setDateTo,
  setParams,
  dateFrom,
  dateTo,
}) {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fromDate: null,
      toDate: null,
    },
  });

  const fromDateWatch = watch("fromDate");

  const fromDateValue =
    Array.isArray(fromDateWatch) && fromDateWatch.length > 0
      ? fromDateWatch[0]
      : null;
  const handleClose = () => {
    reset();
    setOpenDateModel(false);
  };

  const onSubmit = (data) => {
    const fromDate = data.fromDate?.[0] || null;
    const toDate = data.toDate?.[0] || null;
    const from = fromDate ? fromDate.toISOString().split("T")[0] : null;
    const to = toDate ? toDate.toISOString().split("T")[0] : null;
    console.log(from ,to ,"atefilter");
    
    setDateFrom(from);
    setDateTo(to);
    setParams({
      dateFrom: from,
      dateTo: to,
    });
    handleClose();
  };

  return (
    <Fragment>
      <Modal
        isOpen={openDateModel}
        toggle={handleClose}
        centered
        backdrop={true}
      >
        <ModalHeader
          toggle={handleClose}
          close={
            <button className="close-btn" onClick={handleClose}>
              ×
            </button>
          }
        >
          <h5 className="modal-title">Date Filter</h5>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              {/* Date From */}
              <Col md={6}>
                <Label>
                  Date From <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="fromDate"
                  rules={{ required: "Date From is required" }}
                  control={control}
                  render={({ field }) => (
                    <Flatpickr
                      {...field}
                      className={`form-control ${
                        errors.fromDate ? "is-invalid" : ""
                      }`}
                      options={{ dateFormat: "Y-m-d" }}
                      placeholder="Select start date"
                    />
                  )}
                />
                {errors.fromDate && (
                  <small className="text-danger">
                    {errors.fromDate.message}
                  </small>
                )}
              </Col>

              {/* Date To */}
              <Col md={6}>
                <Label>
                  Date To <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="toDate"
                  rules={{ required: "Date To is required" }}
                  control={control}
                  render={({ field }) => (
                    <Flatpickr
                      {...field}
                      className={`form-control ${
                        errors.toDate ? "is-invalid" : ""
                      }`}
                      options={{
                        dateFormat: "Y-m-d",
                        allowInput: false,
                        minDate: fromDateValue,
                      }}
                      placeholder="Select end date"
                    />
                  )}
                />

                {errors.toDate && (
                  <small className="text-danger">{errors.toDate.message}</small>
                )}
              </Col>

              <Col md={12} className="text-end mt-3">
                <Button color="primary">Apply Filter</Button>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  );
}

export default DateFilterModal;
