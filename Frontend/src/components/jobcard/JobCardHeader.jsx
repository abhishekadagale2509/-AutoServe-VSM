import React from "react";
import {
  FaClipboardCheck,
  FaCheckCircle,
  FaSpinner,
  FaClock
} from "react-icons/fa";

const getStatus = (status) => {

  switch (status) {

    case "COMPLETED":
      return {
        color: "success",
        icon: <FaCheckCircle />,
      };

    case "IN_PROGRESS":
      return {
        color: "warning",
        icon: <FaSpinner />,
      };

    default:
      return {
        color: "secondary",
        icon: <FaClock />,
      };
  }

};

const JobCardHeader = ({ jobCard }) => {

  const badge = getStatus(jobCard.status);

  return (

    <div
      className="card border-0 shadow-sm mb-4"
      style={{ borderRadius: "18px" }}
    >

      <div className="card-body p-4">

        <div className="d-flex justify-content-between align-items-center">

          <div>

            <h2 className="fw-bold mb-2 d-flex align-items-center gap-3">

              <FaClipboardCheck
                className="text-primary"
                size={28}
              />

              Job Card #{jobCard.jobId}

            </h2>

            <div className="text-muted">

              Appointment #{jobCard.appointmentId}

            </div>

          </div>

          <span
            className={`badge bg-${badge.color} px-4 py-3 fs-6 d-flex align-items-center gap-2`}
            style={{
              borderRadius: "12px"
            }}
          >
            {badge.icon}
            {jobCard.status}
          </span>

        </div>

      </div>

    </div>

  );

};

export default JobCardHeader;