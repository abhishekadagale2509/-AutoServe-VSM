import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { jobCardService } from "../../services/jobCardService";
import mechanicWorkService from "../../services/mechanicWorkService";
import { invoiceService } from "../../services/invoiceService";
import StatusBadge from "../../components/StatusBadge";
import LoadingSpinner from "../../components/LoadingSpinner";
import ModalWrapper from "../../components/ModalWrapper";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { sparePartService } from "../../services/sparePartService";
import { jobCardPartService } from "../../services/jobCardPartService";

const MechanicJobCards = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [jobCards, setJobCards] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  // Edit / Update Modal State
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    inspectionNotes: "",
    mechanicRemarks: "",
    workDone: "",
    laborCost: "0",
    estimatedCost: "0",
    status: "OPEN",
  });

  // Create Job Card Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    appointmentId: "",
    inspectionNotes: "",
    mechanicRemarks: "",
    workDone: "",
    laborCost: "500",
    estimatedCost: "1500",
    status: "OPEN",
  });

  // Spare Parts Modal State
  const [isPartModalOpen, setIsPartModalOpen] = useState(false);
  const [addingPart, setAddingPart] = useState(false);
  const [spareParts, setSpareParts] = useState([]);
  const [jobCardParts, setJobCardParts] = useState([]);

  const [partForm, setPartForm] = useState({
    partId: "",
    quantity: 1,
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (appointmentId && !loading && appointments.length > 0) {
      openCreateModal();
    }
  }, [appointmentId, loading, appointments]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jcRes, apptRes] = await Promise.all([
        jobCardService.getJobCards().catch(() => ({ data: [] })),
        mechanicWorkService
          .getEligibleAppointmentsForJobCard()
          .catch(() => ({ data: [] })),
      ]);

      const jcData = jcRes.data || jcRes || [];
      const apptData = apptRes.data || apptRes || [];

      setJobCards(Array.isArray(jcData) ? jcData : []);

      const eligibleAppointments = Array.isArray(apptData) ? apptData : [];

      setAppointments(eligibleAppointments);

      if (eligibleAppointments.length === 1) {
        setCreateForm((prev) => ({
          ...prev,
          appointmentId: eligibleAppointments[0].appointmentId,
        }));
      }
    } catch (err) {
      toast.error("Failed to load job cards or appointments");
    } finally {
      setLoading(false);
    }
  };

  const loadSpareParts = async () => {
    try {
      const response = await sparePartService.getAllParts();

      const data = response.data || response || [];

      setSpareParts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load spare parts.");
    }
  };

  const loadJobCardParts = async (jobId) => {
    try {
      const response = await jobCardPartService.getParts(jobId);

      const data = response.data || response || [];

      setJobCardParts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setJobCardParts([]);
    }
  };

  // Open Create Job Card Modal
  const openCreateModal = () => {
    if (appointmentId) {
      const selected = appointments.find(
        (a) => String(a.appointmentId) === String(appointmentId),
      );

      if (!selected) {
        toast.info("Selected appointment is not eligible.");
        return;
      }

      setCreateForm((prev) => ({
        ...prev,
        appointmentId,
      }));

      setIsCreateModalOpen(true);
      return;
    }

    if (appointments.length === 0) {
      toast.info("No eligible appointments available.");
      return;
    }

    if (appointments.length === 1) {
      setCreateForm((prev) => ({
        ...prev,
        appointmentId: appointments[0].appointmentId,
      }));
    } else {
      setCreateForm((prev) => ({
        ...prev,
        appointmentId: "",
      }));
    }

    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    if (!createForm.appointmentId) {
      toast.error("Invalid appointment.");
      return;
    }

    setCreating(true);

    try {
      const response = await jobCardService.createJobCard({
        appointmentId: Number(createForm.appointmentId),
        inspectionNotes: createForm.inspectionNotes,
        mechanicRemarks: createForm.mechanicRemarks,
        workDone: createForm.workDone,
        laborCost: Number(createForm.laborCost || 0),
        estimatedCost: Number(createForm.estimatedCost || 0),
        status: createForm.status,
      });

      toast.success("Job Card created successfully!");

      setIsCreateModalOpen(false);

      fetchData();

      navigate(`/mechanic/jobcards/${response.jobId}`);

      // We'll use this later
      console.log(response);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create Job Card.");
    } finally {
      setCreating(false);
    }
  };

  // Open Edit / Update Job Card Modal
  const openUpdateModal = (job) => {
    setSelectedJob(job);
    setUpdateForm({
      inspectionNotes: job.inspectionNotes || "",
      mechanicRemarks: job.mechanicRemarks || job.remarks || "",
      workDone: job.workDone || "",
      laborCost: String(job.laborCost || job.laborCharges || 0),
      estimatedCost: String(job.estimatedCost || job.totalCost || 0),
      status: job.status || "OPEN",
    });
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;

    setUpdating(true);
    try {
      const jobId = selectedJob.id || selectedJob.jobId;
      await jobCardService.updateJobCard(jobId, {
        inspectionNotes: updateForm.inspectionNotes,
        mechanicRemarks: updateForm.mechanicRemarks,
        workDone: updateForm.workDone,
        laborCost: parseFloat(updateForm.laborCost || 0),
        estimatedCost: parseFloat(updateForm.estimatedCost || 0),
        status: updateForm.status,
      });

      // If status changed to COMPLETED, auto generate invoice
      if (updateForm.status === "COMPLETED") {
        try {
          await invoiceService.generateInvoice(jobId);
          toast.success("Job marked COMPLETED and Invoice generated!");
        } catch {
          toast.info("Job updated to COMPLETED.");
        }
      } else {
        toast.success("Job Card updated successfully!");
      }

      setIsUpdateModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update job card");
    } finally {
      setUpdating(false);
    }
  };

  // Add Spare Part Modal
  const openPartModal = async (job) => {
    setSelectedJob(job);

    setPartForm({
      partId: "",
      quantity: 1,
    });

    await loadSpareParts();

    await loadJobCardParts(job.jobId || job.id);

    setIsPartModalOpen(true);
  };

  const handleAddPartSubmit = async (e) => {
    e.preventDefault();

    if (!selectedJob) return;

    setAddingPart(true);

    try {
      await jobCardPartService.addPart({
        jobId: selectedJob.jobId || selectedJob.id,
        partId: Number(partForm.partId),
        quantity: Number(partForm.quantity),
      });

      toast.success("Spare Part Added Successfully!");

      await loadJobCardParts(selectedJob.jobId || selectedJob.id);

      setPartForm({
        partId: "",
        quantity: 1,
      });
    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.message || "Failed to add spare part.");
    } finally {
      setAddingPart(false);
    }
  };

  if (loading) return <LoadingSpinner text="Fetching job cards..." />;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h3 className="fw-extrabold text-dark m-0">
            Mechanic Job Cards & Tasks
          </h3>
          <p className="text-muted small m-0">
            Create job cards, log repairs, add parts, and finalize service notes
          </p>
        </div>
        <button className="btn btn-primary-custom" onClick={openCreateModal}>
          <i className="bi bi-file-earmark-plus me-1"></i> Create New Job Card
        </button>
      </div>

      {/* Job Cards Table */}
      {jobCards.length === 0 ? (
        <div className="card glass-card border-0 p-5 text-center">
          <i className="bi bi-tools fs-1 text-muted mb-2"></i>
          <h5 className="fw-bold text-dark">No Job Cards Found</h5>
          <p className="text-muted mb-3">
            Create a new job card for an assigned appointment to start
            servicing.
          </p>
          <div>
            <button
              className="btn btn-primary-custom"
              disabled={appointments.length === 0}
              onClick={openCreateModal}
            >
              <i className="bi bi-plus-circle me-1"></i> Create Job Card
            </button>
          </div>
        </div>
      ) : (
        <div className="card glass-card border-0 p-4 shadow-sm">
          <div className="table-responsive">
            <table className="table table-custom">
              <thead>
                <tr>
                  <th>Job ID</th>
                  <th>Vehicle Details</th>
                  <th>Status</th>
                  <th>Labor Cost</th>
                  <th>Inspection & Notes</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobCards.map((job) => {
                  const jobId = job.id || job.jobId;
                  return (
                    <tr key={jobId}>
                      <td className="fw-bold text-primary">#{jobId}</td>
                      <td>
                        <div className="fw-bold text-dark">
                          {job.vehicle?.make || job.vehicleBrand}{" "}
                          {job.vehicle?.model}
                        </div>
                        <small className="font-monospace text-muted">
                          {job.vehicle?.licensePlate || job.vehicleNumber}
                        </small>
                      </td>
                      <td>
                        <StatusBadge status={job.status} />
                      </td>
                      <td className="fw-semibold">
                        {formatCurrency(job.laborCost || job.laborCharges || 0)}
                      </td>
                      <td>
                        <span
                          className="text-truncate d-inline-block"
                          style={{ maxWidth: "180px" }}
                        >
                          {job.inspectionNotes ||
                            job.workDone ||
                            "In Inspection"}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-primary-custom"
                          onClick={() =>
                            navigate(
                              `/mechanic/jobcards/${job.jobId || job.id}`,
                            )
                          }
                        >
                          <i className="bi bi-eye me-1"></i>
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Job Card Modal */}
      <ModalWrapper
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Job Card"
      >
        <form onSubmit={handleCreateSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold text-dark">
              <div className="mb-3">
                <label className="form-label fw-bold">Select Appointment</label>

                <select
                  className="form-select"
                  value={createForm.appointmentId}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      appointmentId: e.target.value,
                    })
                  }
                >
                  <option value="">Choose appointment...</option>

                  {appointments.map((a) => (
                    <option key={a.appointmentId} value={a.appointmentId}>
                      #{a.appointmentId} - {a.vehicleNumber}
                    </option>
                  ))}
                </select>
              </div>
            </label>

            <div
              className="border rounded-3 p-3 bg-light"
              style={{
                borderColor: "#dfe6ee",
                transition: "all 0.25s ease",
              }}
            >
              <div className="row">
                <div className="col-md-6 mb-2">
                  <small className="text-muted">Appointment ID</small>
                  <div className="fw-semibold">#{createForm.appointmentId}</div>
                </div>

                <div className="col-md-6 mb-2">
                  <small className="text-muted">Vehicle</small>
                  <div className="fw-semibold">
                    {appointments.find(
                      (a) =>
                        String(a.id || a.appointmentId) ===
                        String(createForm.appointmentId),
                    )?.vehicleNumber || "-"}
                  </div>
                </div>

                <div className="col-12">
                  <small className="text-muted">Problem Description</small>
                  <div className="fw-semibold">
                    {appointments.find(
                      (a) =>
                        String(a.id || a.appointmentId) ===
                        String(createForm.appointmentId),
                    )?.problemDescription || "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="form-label fw-bold text-dark">
                Labor Cost (₹)
              </label>
              <input
                type="number"
                className="form-control form-control-custom"
                value={createForm.laborCost}
                onChange={(e) =>
                  setCreateForm({ ...createForm, laborCost: e.target.value })
                }
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label fw-bold text-dark">
                Initial Status
              </label>
              <select
                className="form-select form-select-custom"
                value={createForm.status}
                onChange={(e) =>
                  setCreateForm({ ...createForm, status: e.target.value })
                }
              >
                <option value="OPEN">Open</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold text-dark">
              Inspection Notes
            </label>
            <textarea
              className="form-control form-control-custom"
              rows="2"
              placeholder="Initial diagnosis, oil condition, brake wear..."
              value={createForm.inspectionNotes}
              onChange={(e) =>
                setCreateForm({
                  ...createForm,
                  inspectionNotes: e.target.value,
                })
              }
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold text-dark">
              Work Done / Action Items
            </label>
            <textarea
              className="form-control form-control-custom"
              rows="2"
              placeholder="Engine oil replaced, air filter cleaned..."
              value={createForm.workDone}
              onChange={(e) =>
                setCreateForm({ ...createForm, workDone: e.target.value })
              }
            ></textarea>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-light px-4"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary-custom px-4"
              disabled={creating}
            >
              {creating ? "Creating..." : "Save Job Card"}
            </button>
          </div>
        </form>
      </ModalWrapper>

      {/* Edit / Update Job Card Modal */}
      <ModalWrapper
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title={`Update Job Card #${selectedJob?.id || selectedJob?.jobId}`}
      >
        {selectedJob && (
          <form onSubmit={handleUpdateSubmit}>
            <div className="row g-3 mb-3">
              <div className="col-6">
                <label className="form-label fw-bold text-dark">
                  Job Status
                </label>
                <select
                  className="form-select form-select-custom"
                  value={updateForm.status}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, status: e.target.value })
                  }
                >
                  <option value="OPEN">Open</option>
                  <option value="COMPLETED">
                    Completed (Generates Invoice)
                  </option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div className="col-6">
                <label className="form-label fw-bold text-dark">
                  Labor Cost (₹)
                </label>
                <input
                  type="number"
                  className="form-control form-control-custom"
                  value={updateForm.laborCost}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, laborCost: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold text-dark">
                Inspection Notes
              </label>
              <textarea
                className="form-control form-control-custom"
                rows="2"
                value={updateForm.inspectionNotes}
                onChange={(e) =>
                  setUpdateForm({
                    ...updateForm,
                    inspectionNotes: e.target.value,
                  })
                }
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold text-dark">
                Work Done / Repair Summary
              </label>
              <textarea
                className="form-control form-control-custom"
                rows="3"
                value={updateForm.workDone}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, workDone: e.target.value })
                }
              ></textarea>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-light px-4"
                onClick={() => setIsUpdateModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary-custom px-4"
                disabled={updating}
              >
                {updating ? "Saving..." : "Update Job Card"}
              </button>
            </div>
          </form>
        )}
      </ModalWrapper>

      {/* Add Spare Part Modal */}
      <ModalWrapper
        isOpen={isPartModalOpen}
        onClose={() => setIsPartModalOpen(false)}
        title={`Add Spare Part to Job #${selectedJob?.id || selectedJob?.jobId}`}
      >
        <form onSubmit={handleAddPartSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold text-dark">
              Select Spare Part
            </label>

            <select
              className="form-select form-select-custom"
              value={partForm.partId}
              onChange={(e) =>
                setPartForm({
                  ...partForm,
                  partId: e.target.value,
                })
              }
              required
            >
              <option value="">-- Select Spare Part --</option>

              {spareParts.map((part) => (
                <option key={part.partId} value={part.partId}>
                  {part.partName} (₹{part.unitPrice})
                </option>
              ))}
            </select>
          </div>

          {partForm.partId && (
            <div className="alert alert-light border mb-3">
              <div className="d-flex justify-content-between">
                <span className="fw-semibold">Unit Price</span>
                <span>
                  ₹
                  {
                    spareParts.find((p) => p.partId === Number(partForm.partId))
                      ?.unitPrice
                  }
                </span>
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="form-label fw-bold text-dark">Quantity</label>

            <input
              type="number"
              className="form-control form-control-custom"
              min="1"
              value={partForm.quantity}
              onChange={(e) =>
                setPartForm({
                  ...partForm,
                  quantity: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-light px-4"
              onClick={() => setIsPartModalOpen(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary-custom px-4"
              disabled={addingPart}
            >
              {addingPart ? "Adding..." : "Attach Part"}
            </button>
          </div>
        </form>
      </ModalWrapper>
    </div>
  );
};

export default MechanicJobCards;
