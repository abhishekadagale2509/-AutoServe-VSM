import React from "react";
import { FaEdit, FaBoxOpen, FaCheckCircle, FaLock } from "react-icons/fa";

const JobCardActions = ({
  jobCard,
  onManageParts,
  onUpdateDetails,
  onFinalize,
}) => {
  const isCompleted = jobCard.status === "COMPLETED";

  return (
    <div
      className="card border-0 shadow-sm mb-4"
      style={{ borderRadius: "18px" }}
    >
      <div className="card-body p-4">
        <h4 className="fw-bold mb-4">Actions</h4>

        {isCompleted ? (
          <div className="text-center py-3">
            <FaLock size={35} className="text-success mb-3" />

            <h5>Job Card Locked</h5>

            <p className="text-muted">
              This Job Card has been completed. No further modifications are
              allowed.
            </p>
          </div>
        ) : (
          <div className="d-flex flex-wrap gap-3">
            <button
              className="btn btn-outline-primary"
              onClick={onUpdateDetails}
            >
              <FaEdit /> Update Details
            </button>

            <button className="btn btn-outline-success" onClick={onManageParts}>
              <FaBoxOpen /> Manage Parts
            </button>

            <button
              className="btn btn-success"
              onClick={onFinalize}
              disabled={jobCard.status === "COMPLETED"}
            >
              <FaCheckCircle />
              {jobCard.status === "COMPLETED"
                ? " Finalized"
                : " Finalize Job Card"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCardActions;
