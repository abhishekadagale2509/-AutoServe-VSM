import React from "react";
import {
  FaTools,
  FaClipboardList,
  FaWrench,
  FaCommentDots,
} from "react-icons/fa";

const DetailBlock = ({ icon, title, value }) => (
  <div className="mb-4">

    <div className="d-flex align-items-center gap-2 mb-2">

      <span className="text-primary">
        {icon}
      </span>

      <span className="fw-semibold">
        {title}
      </span>

    </div>

    <div
      className="border rounded-3 p-3"
      style={{
        minHeight: "90px",
        background: "#fafafa"
      }}
    >
      {value || (
        <span className="text-muted">
          No information available.
        </span>
      )}
    </div>

  </div>
);

const ServiceDetailsCard = ({ jobCard }) => {

  return (

    <div
      className="card border-0 shadow-sm mb-4"
      style={{
        borderRadius: "18px"
      }}
    >

      <div className="card-body p-4">

        <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">

          <FaTools className="text-primary" />

          Service Details

        </h4>

        <DetailBlock
          icon={<FaClipboardList />}
          title="Inspection Notes"
          value={jobCard.inspectionNotes}
        />

        <DetailBlock
          icon={<FaWrench />}
          title="Work Done"
          value={jobCard.workDone}
        />

        <DetailBlock
          icon={<FaCommentDots />}
          title="Mechanic Remarks"
          value={jobCard.mechanicRemarks}
        />

      </div>

    </div>

  );

};

export default ServiceDetailsCard;