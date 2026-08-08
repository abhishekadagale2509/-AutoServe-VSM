import React from "react";
import { FaBoxOpen, FaPlus, FaTools } from "react-icons/fa";

const SparePartsCard = ({ jobCard }) => {
  const parts = jobCard.jobCardParts || [];

  return (
    <div
      className="card border-0 shadow-sm mb-4"
      style={{
        borderRadius: "18px",
      }}
    >
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold d-flex align-items-center gap-2">
            <FaBoxOpen className="text-primary" />
            Spare Parts
          </h4>

          {jobCard.status !== "COMPLETED" && (
            <button className="btn btn-primary">
              <FaPlus /> Add Part
            </button>
          )}
        </div>

        {parts.length === 0 ? (
          <div
            className="text-center py-5 rounded"
            style={{
              background: "#fafafa",
            }}
          >
            <FaTools size={40} className="text-secondary mb-3" />

            <h5>No Spare Parts Added</h5>

            <p className="text-muted mb-0">
              Parts used during servicing will appear here.
            </p>
          </div>
        ) : (
          parts.map((part) => (
            <div key={part.jobCardPartId} className="border rounded p-3 mb-3">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="fw-bold mb-1">{part.partName}</h6>

                  <small className="text-muted">
                    Quantity : {part.quantity}
                  </small>
                </div>

                <div className="text-end">
                  <div className="fw-bold">₹{part.subtotal}</div>

                  <small className="text-muted">₹{part.unitPrice} each</small>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SparePartsCard;
