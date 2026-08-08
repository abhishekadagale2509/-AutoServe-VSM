import React from "react";
import { FaCar } from "react-icons/fa";

const VehicleInfoCard = ({ jobCard }) => {
  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body">
        <h5 className="fw-bold d-flex align-items-center gap-2 mb-4">
          <FaCar className="text-primary" />
          Vehicle Information
        </h5>

        <div className="row">
          <div className="col-md-6 mb-3">
            <small className="text-muted">Customer</small>
            <div className="fw-semibold fs-5">{jobCard.customerName}</div>
          </div>

          <div className="col-md-6 mb-3">
            <small className="text-muted">Vehicle Number</small>
            <div className="fw-semibold fs-5">{jobCard.vehicleNumber}</div>
          </div>

          <div className="col-md-6 mb-3">
            <small className="text-muted">Mechanic</small>
            <div className="fw-semibold">{jobCard.mechanicName}</div>
          </div>

          <div className="col-md-6 mb-3">
            <small className="text-muted">Appointment Date</small>
            <div className="fw-semibold">{jobCard.appointmentDate}</div>
          </div>

          <div className="col-12">
            <small className="text-muted">Problem Description</small>

            <div
              className="mt-2 p-3 rounded"
              style={{
                background: "#f8f9fa",
                borderLeft: "4px solid #4f46e5",
              }}
            >
              {jobCard.problemDescription}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleInfoCard;
