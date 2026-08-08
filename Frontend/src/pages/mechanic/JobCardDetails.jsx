import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jobCardService } from "../../services/jobCardService";
import JobCardHeader from "../../components/jobcard/JobCardHeader";
import VehicleInfoCard from "../../components/jobcard/VehicleInfoCard";
import CostSummaryCard from "../../components/jobcard/CostSummaryCard";
import ServiceDetailsCard from "../../components/jobcard/ServiceDetailsCard";
import SparePartsCard from "../../components/jobcard/SparePartsCard";
import JobCardActions from "../../components/jobcard/JobCardActions";
import ManagePartsDrawer from "../../components/jobcard/ManagePartsDrawer";
import ModalWrapper from "../../components/ModalWrapper";
import { toast } from "react-toastify";

const JobCardDetails = () => {
  const { jobId } = useParams();

  const [jobCard, setJobCard] = useState(null);

  const [loading, setLoading] = useState(true);

  const [showPartsDrawer, setShowPartsDrawer] = useState(false);

  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [updating, setUpdating] = useState(false);

  const [updateForm, setUpdateForm] = useState({
    inspectionNotes: "",
    workDone: "",
    mechanicRemarks: "",
    laborCost: "",
  });

  useEffect(() => {
    fetchJobCard();
  }, []);

  useEffect(() => {
    if (jobCard) {
      setUpdateForm({
        inspectionNotes: jobCard.inspectionNotes || "",
        workDone: jobCard.workDone || "",
        mechanicRemarks: jobCard.mechanicRemarks || "",
        laborCost: jobCard.laborCost || "",
      });
    }
  }, [jobCard]);

  const fetchJobCard = async () => {
    try {
      const data = await jobCardService.getJobCardById(jobId);

      setJobCard(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizeJobCard = async () => {
    try {
      await jobCardService.finalizeJobCard(jobId);

      toast.success("Job Card finalized successfully!");

      fetchJobCard();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to finalize Job Card.",
      );
    }
  };

  const handleUpdateJobCard = async () => {
    try {
      setUpdating(true);

      await jobCardService.updateJobCard(jobId, {
        ...updateForm,
        estimatedCost: jobCard.estimatedCost,
        status: jobCard.status,
      });

      await fetchJobCard();

      setShowUpdateModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="container py-5">Loading Job Card...</div>;
  }

  return (
    <div className="container py-4">
      <JobCardHeader jobCard={jobCard} />

      <VehicleInfoCard jobCard={jobCard} />

      <CostSummaryCard jobCard={jobCard} />

      <ServiceDetailsCard jobCard={jobCard} />

      <SparePartsCard jobCard={jobCard} />

      <JobCardActions
        jobCard={jobCard}
        onManageParts={() => setShowPartsDrawer(true)}
        onUpdateDetails={() => setShowUpdateModal(true)}
        onFinalize={handleFinalizeJobCard}
      />

      <ManagePartsDrawer
        show={showPartsDrawer}
        onHide={() => setShowPartsDrawer(false)}
        jobId={jobCard.jobId || jobCard.id}
        onPartAdded={fetchJobCard}
      />

      {/* More cards will come here */}
      <ModalWrapper
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        title="Update Job Card"
      >
        <div className="mb-3">
          <label className="form-label fw-bold">Inspection Notes</label>

          <textarea
            className="form-control"
            rows="3"
            value={updateForm.inspectionNotes}
            onChange={(e) =>
              setUpdateForm({
                ...updateForm,
                inspectionNotes: e.target.value,
              })
            }
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Work Done</label>

          <textarea
            className="form-control"
            rows="3"
            value={updateForm.workDone}
            onChange={(e) =>
              setUpdateForm({
                ...updateForm,
                workDone: e.target.value,
              })
            }
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Mechanic Remarks</label>

          <textarea
            className="form-control"
            rows="2"
            value={updateForm.mechanicRemarks}
            onChange={(e) =>
              setUpdateForm({
                ...updateForm,
                mechanicRemarks: e.target.value,
              })
            }
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-bold">Labour Cost (₹)</label>

          <input
            type="number"
            className="form-control"
            value={updateForm.laborCost}
            onChange={(e) =>
              setUpdateForm({
                ...updateForm,
                laborCost: e.target.value,
              })
            }
          />
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button
            className="btn btn-light"
            onClick={() => setShowUpdateModal(false)}
          >
            Cancel
          </button>

          <button
            className="btn btn-primary"
            disabled={updating}
            onClick={handleUpdateJobCard}
          >
            {updating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </ModalWrapper>
    </div>
  );
};

export default JobCardDetails;
