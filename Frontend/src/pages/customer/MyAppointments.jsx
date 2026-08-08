import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { appointmentService } from "../../services/appointmentService";
import StatusBadge from "../../components/StatusBadge";
import LoadingSpinner from "../../components/LoadingSpinner";
import { formatDate } from "../../utils/formatters";
import { useRef } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/common/ConfirmModal";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const debounceTimeout = useRef(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      fetchAppointments(search);
    }, 300);

    return () => clearTimeout(debounceTimeout.current);
  }, [search]);

  const fetchAppointments = async (searchText = "") => {
    setSearchLoading(true);

    try {
      const res = await appointmentService.getAppointments(searchText);

      const data = res.data || res || [];
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load appointments", error);
    } finally {
      setSearchLoading(false);
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    if (filterStatus === "ALL") return true;
    return app.status === filterStatus;
  });
  if (loading && appointments.length === 0)
    return <LoadingSpinner text="Fetching your appointments..." />;

  const handleCancelAppointment = (appointmentId) => {
    setSelectedAppointment(appointmentId);
    setShowCancelModal(true);
  };

  const confirmCancelAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      await appointmentService.cancelAppointment(selectedAppointment);

      toast.success("Appointment cancelled successfully.");

      setShowCancelModal(false);
      setSelectedAppointment(null);

      fetchAppointments(search);
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message || "Failed to cancel appointment.",
      );
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h3 className="fw-extrabold text-dark m-0">
            My Service Appointments
          </h3>
          <p className="text-muted small m-0">
            Track live progress and service history for your vehicles
          </p>
        </div>
        <Link
          to="/customer/book-appointment"
          className="btn btn-primary-custom"
        >
          <i className="bi bi-plus-circle me-1"></i> Book New Service
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="card glass-card border-0 p-3 mb-4">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span className="fw-semibold text-muted small me-2">
            Filter by Status:
          </span>
          {[
            "ALL",
            "PENDING",
            "ACCEPTED",
            "IN_PROGRESS",
            "COMPLETED",
            "CANCELLED",
          ].map((status) => (
            <button
              key={status}
              className={`btn btn-sm ${
                filterStatus === status
                  ? "btn-primary shadow-sm"
                  : "btn-outline-secondary border-0"
              } rounded-pill px-3`}
              onClick={() => setFilterStatus(status)}
            >
              {status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="card glass-card border-0 p-3 mb-4">
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0">
            {searchLoading ? (
              <div
                className="spinner-border spinner-border-sm text-primary"
                role="status"
              />
            ) : (
              <i className="bi bi-search"></i>
            )}
          </span>

          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search by vehicle, mechanic, status, registration number or service note..."
            value={search}
            spellCheck={false}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Appointments Table / Cards */}
      {filteredAppointments.length === 0 ? (
        <div className="card glass-card border-0 p-5 text-center">
          <i className="bi bi-calendar-x fs-1 text-muted mb-2"></i>

          <h5 className="fw-bold text-dark">
            {search.trim()
              ? "🔍 No Matching Appointments Found"
              : filterStatus === "ALL"
                ? "No Appointments Found"
                : `No ${filterStatus.replace("_", " ")} Appointments`}
          </h5>

          <p className="text-muted">
            {search.trim() ? (
              <>
                No appointments matched <strong>"{search}"</strong>. Try
                searching by vehicle, mechanic, registration number, service
                note or status.
              </>
            ) : filterStatus === "ALL" ? (
              "You don't have any appointments yet."
            ) : (
              `You currently don't have any ${filterStatus
                .replace("_", " ")
                .toLowerCase()} appointments.`
            )}
          </p>

          {search && (
            <button
              className="btn btn-outline-primary"
              onClick={() => setSearch("")}
            >
              <i className="bi bi-x-circle me-2"></i>
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="card glass-card border-0 p-4 shadow-sm">
          <div className="table-responsive">
            <table className="table table-custom mb-0">
              <thead>
                <tr>
                  <th>Appt ID</th>
                  <th>Vehicle Details</th>
                  <th>Date</th>
                  <th>Service Note</th>
                  <th>Assigned Mechanic</th>
                  <th>Status</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((app) => {
                  console.log("Appointment:", app);

                  return (
                    <tr key={app.id || app.appointmentId}>
                      <td className="fw-bold text-primary">
                        #{app.id || app.appointmentId}
                      </td>
                      <td>
                        <div className="fw-bold text-dark">
                          {app.vehicle?.make || app.vehicleMake}{" "}
                          {app.vehicle?.model || app.vehicleModel}
                        </div>
                        <small className="font-monospace text-muted">
                          {app.vehicle?.licensePlate || app.vehicleNumber}
                        </small>
                      </td>
                      <td>{formatDate(app.appointmentDate || app.date)}</td>
                      <td>
                        <span
                          className="text-truncate d-inline-block"
                          style={{ maxWidth: "200px" }}
                          title={app.problemDescription}
                        >
                          {app.problemDescription}
                        </span>
                      </td>
                      <td>
                        {app.mechanicName ? (
                          <div className="d-flex align-items-center gap-1">
                            <i className="bi bi-person-badge text-primary"></i>
                            <span>{app.mechanicName}</span>
                          </div>
                        ) : (
                          <span className="text-muted fst-italic">
                            Pending Assignment
                          </span>
                        )}
                      </td>
                      <td>
                        <StatusBadge status={app.status} />
                      </td>

                      <td className="text-end">
                        {app.status === "PENDING" && (
                          <button
                            className="btn btn-outline-danger btn-sm me-2"
                            onClick={() =>
                              handleCancelAppointment(app.appointmentId)
                            }
                          >
                            <i className="bi bi-x-circle me-1"></i>
                            Cancel
                          </button>
                        )}

                        {app.jobId && (
                          <Link
                            to={`/customer/jobcard/${app.jobId}`}
                            className="btn btn-outline-primary btn-sm me-2"
                          >
                            <i className="bi bi-file-text me-1"></i>
                            Job Card
                          </Link>
                        )}

                        {app.status === "COMPLETED" && app.jobId && (
                          <Link
                            to={`/customer/invoice/${app.jobId}`}
                            className="btn btn-success btn-sm"
                          >
                            <i className="bi bi-receipt me-1"></i>
                            View Invoice
                          </Link>
                        )}

                        {app.status === "ACCEPTED" ||
                        app.status === "IN_PROGRESS" ? (
                          <span className="text-muted small">Processing</span>
                        ) : null}

                        {app.status === "CANCELLED" && (
                          <span className="badge bg-danger-subtle text-danger">
                            Cancelled
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        show={showCancelModal}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this appointment?"
        confirmText="Yes, Cancel"
        cancelText="Keep Appointment"
        confirmButtonClass="btn-danger"
        onConfirm={confirmCancelAppointment}
        onCancel={() => {
          setShowCancelModal(false);
          setSelectedAppointment(null);
        }}
      />
    </div>
  );
};

export default MyAppointments;
