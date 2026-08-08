import React from "react";

const CostSummaryCard = ({ jobCard }) => {
  return (
    <div className="card shadow-sm border-0 mb-4">

      <div className="card-body">

        <h5 className="fw-bold mb-4">
          💰 Cost Summary
        </h5>

        <div className="row">

          <div className="col-md-6">

            <div className="border rounded p-4 text-center h-100">

              <div className="text-muted mb-2">
                Estimated Cost
              </div>

              <h3 className="text-primary fw-bold">
                ₹{jobCard.estimatedCost}
              </h3>

            </div>

          </div>

          <div className="col-md-6">

            <div className="border rounded p-4 text-center h-100">

              <div className="text-muted mb-2">
                Labour Cost
              </div>

              <h3 className="text-success fw-bold">
                ₹{jobCard.laborCost}
              </h3>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CostSummaryCard;