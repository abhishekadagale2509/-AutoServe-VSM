import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { appointmentService } from "../../services/appointmentService";
import { mechanicService } from "../../services/mechanicService";
import StatusBadge from "../../components/StatusBadge";
import LoadingSpinner from "../../components/LoadingSpinner";
import ModalWrapper from "../../components/ModalWrapper";
import { formatDate } from "../../utils/formatters";

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");

  // Assign Modal
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedMechanicId, setSelectedMechanicId] = useState("");
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [aRes, mRes] = await Promise.all([
        appointmentService.getAllAppointments().catch(() => ({ data: [] })),
        mechanicService.getAllMechanics().catch(() => ({ data: [] })),
      ]);

      const aData = aRes.data || aRes || [];
      const mData = mRes.data || mRes || [];

      setAppointments(Array.isArray(aData) ? aData : []);
      setMechanics(Array.isArray(mData) ? mData : []);
    } catch (err) {
      toast.error("Failed to load appointments or mechanics");
    } finally {
      setLoading(false);
    }
  };

  const openAssignModal = (appt) => {
    setSelectedAppt(appt);

    const availableMechanics = mechanics.filter(
      (m) => m.availabilityStatus === "AVAILABLE",
    );

    if (availableMechanics.length > 0) {
      setSelectedMechanicId(
        availableMechanics[0].id || availableMechanics[0].mechanicId,
      );
    } else {
      setSelectedMechanicId("");
    }

    setIsAssignModalOpen(true);
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppt || !selectedMechanicId) return;

    setAssigning(true);
    try {
      const apptId = selectedAppt.id || selectedAppt.appointmentId;

      console.log("Appointment:", apptId);
      console.log("Mechanic:", selectedMechanicId);

      await appointmentService.assignMechanic(
        apptId,
        parseInt(selectedMechanicId, 10),
      );
      toast.success(`Mechanic assigned to Appointment #${apptId}`);
      setIsAssignModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign mechanic");
    } finally {
      setAssigning(false);
    }
  };

  const handleStatusChange = async (apptId, currentStatus, newStatus) => {
    if (currentStatus === newStatus) return;

    try {
      await appointmentService.updateAppointmentStatus(apptId, newStatus);
      toast.success(`Appointment #${apptId} updated to ${newStatus}`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    if (filterStatus === "ALL") return true;
    return app.status === filterStatus;
  });

  const getAllowedStatuses = (currentStatus) => {
    switch (currentStatus) {
      case "PENDING":
        return ["PENDING", "ACCEPTED", "CANCELLED"];

      case "ACCEPTED":
        return ["ACCEPTED", "IN_PROGRESS", "CANCELLED"];

      case "IN_PROGRESS":
        return ["IN_PROGRESS", "COMPLETED"];

      case "COMPLETED":
        return ["COMPLETED"];

      case "CANCELLED":
        return ["CANCELLED"];

      default:
        return [currentStatus];
    }
  };

  if (loading) return <LoadingSpinner text="Fetching system appointments..." />;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h3 className="fw-extrabold text-dark m-0">Manage Appointments</h3>
          <p className="text-muted small m-0">
            Assign mechanics, accept requests, and update service progress
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="card glass-card border-0 p-3 mb-4">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span className="fw-semibold text-muted small me-2">Status:</span>
          {[
            "ALL",
            "PENDING",
            "ACCEPTED",
            "IN_PROGRESS",
            "COMPLETED",
            "CANCELLED",
          ].map((st) => (
            <button
              key={st}
              className={`btn btn-sm ${
                filterStatus === st
                  ? "btn-primary shadow-sm"
                  : "btn-outline-secondary border-0"
              } rounded-pill px-3`}
              onClick={() => setFilterStatus(st)}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="card glass-card border-0 p-5 text-center">
          <i className="bi bi-calendar-x fs-1 text-muted mb-2"></i>
          <h5 className="fw-bold">No Appointments Found</h5>
          <p className="text-muted">
            No appointments found matching filter '{filterStatus}'.
          </p>
        </div>
      ) : (
        <div className="card glass-card border-0 p-4 shadow-sm">
          <div className="table-responsive">
            <table className="table table-custom">
              <thead>
                <tr>
                  <th>Appt #</th>
                  <th>Customer / Vehicle</th>
                  <th>Date</th>
                  <th>Problem / Note</th>
                  <th>Assigned Mechanic</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((app) => {
                  const apptId = app.id || app.appointmentId;
                  return (
                    <tr key={apptId}>
                      <td className="fw-bold text-primary">#{apptId}</td>
                      <td>
                        <div className="fw-bold text-dark">
                          {app.customerName ||
                            app.vehicle?.customer?.name ||
                            "Customer"}
                        </div>
                        <small className="text-muted">
                          {app.vehicle?.make || app.vehicleMake}{" "}
                          {app.vehicle?.model} (
                          {app.vehicle?.licensePlate || app.vehicleNumber})
                        </small>
                      </td>
                      <td>{formatDate(app.appointmentDate || app.date)}</td>
                      <td>
                        <span
                          className="text-truncate d-inline-block"
                          style={{ maxWidth: "180px" }}
                          title={app.problemDescription}
                        >
                          {app.problemDescription}
                        </span>
                      </td>
                      <td>
                        {app.mechanicName &&
                        app.mechanicName !== "Not Assigned" ? (
                          <span className="badge bg-primary-subtle text-primary border">
                            <i className="bi bi-person-badge me-1"></i>
                            {app.mechanicName}
                          </span>
                        ) : app.status === "COMPLETED" ||
                          app.status === "CANCELLED" ? (
                          <span className="text-muted">—</span>
                        ) : (
                          <button
                            className="btn btn-sm btn-outline-warning text-dark"
                            onClick={() => openAssignModal(app)}
                          >
                            <i className="bi bi-person-plus me-1"></i>
                            Assign Mechanic
                          </button>
                        )}
                      </td>
                      <td>
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="text-end">
                        <select
                          className="form-select form-select-sm d-inline-block w-auto"
                          value={app.status}
                          disabled={
                            app.status === "COMPLETED" ||
                            app.status === "CANCELLED"
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              apptId,
                              app.status,
                              e.target.value,
                            )
                          }
                        >
                          {getAllowedStatuses(app.status).map((status) => (
                            <option key={status} value={status}>
                              {status.replace("_", " ")}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assign Mechanic Modal */}
      <ModalWrapper
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title={`Assign Mechanic to Appointment #${selectedAppt?.id || selectedAppt?.appointmentId}`}
      >
        <form onSubmit={handleAssignSubmit}>
          <div className="mb-4">
            <label className="form-label fw-bold text-dark">
              Choose Available Mechanic
            </label>
            {mechanics.filter((m) => m.availabilityStatus === "AVAILABLE")
              .length === 0 ? (
              <p className="text-danger small mb-0">
                No mechanics are currently available for assignment.
              </p>
            ) : (
              <select
                className="form-select form-select-custom"
                value={selectedMechanicId}
                onChange={(e) => setSelectedMechanicId(e.target.value)}
                required
              >
                {mechanics
                  .filter((m) => m.availabilityStatus === "AVAILABLE")
                  .map((m) => (
                    <option
                      key={m.id || m.mechanicId}
                      value={m.id || m.mechanicId}
                    >
                      {m.name || m.user?.name} - Specialization:{" "}
                      {m.specialization || "General Technician"} (
                      {m.availabilityStatus})
                    </option>
                  ))}
              </select>
            )}
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-light px-4"
              onClick={() => setIsAssignModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary-custom px-4"
              disabled={
                assigning ||
                mechanics.filter((m) => m.availabilityStatus === "AVAILABLE")
                  .length === 0
              }
            >
              {assigning ? "Assigning..." : "Confirm Assignment"}
            </button>
          </div>
        </form>
      </ModalWrapper>
    </div>
  );
};

export default ManageAppointments;
