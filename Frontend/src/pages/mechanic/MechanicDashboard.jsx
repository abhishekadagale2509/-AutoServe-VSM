import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { jobCardService } from "../../services/jobCardService";
import { dashboardService } from "../../services/dashboardService";
import StatusBadge from "../../components/StatusBadge";
import LoadingSpinner from "../../components/LoadingSpinner";
import mechanicWorkService from "../../services/mechanicWorkService";
import { toast } from "react-toastify";
import { mechanicService } from "../../services/mechanicService";

const MechanicDashboard = () => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState("AVAILABLE");
  const [currentAvailability, setCurrentAvailability] = useState("AVAILABLE");

  useEffect(() => {
    fetchMechanicData();
  }, []);

  const fetchMechanicData = async () => {
    setLoading(true);
    try {
      const [apptRes, dashRes] = await Promise.all([
        mechanicWorkService.getMyAppointments().catch(() => ({ data: [] })),
        dashboardService.getMechanicDashboard().catch(() => null),
      ]);

      const apptData = apptRes.data || apptRes || [];
      console.log("Appointments from API:", apptData);
      setAppointments(Array.isArray(apptData) ? apptData : []);
      setStats(dashRes?.data || dashRes);
      const status =
        dashRes?.data?.availabilityStatus ||
        dashRes?.availabilityStatus ||
        "AVAILABLE";

      setAvailability(status);
      setCurrentAvailability(status);
      if (dashRes?.data?.availabilityStatus) {
        setAvailability(dashRes.data.availabilityStatus);
      }
    } catch (err) {
      console.error("Error loading mechanic dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAppointment = async () => {
    try {
      await mechanicWorkService.acceptAppointment(
        selectedAppointment.appointmentId,
      );

      setShowDetailsModal(false);

      await fetchMechanicData();

      toast.success("Job accepted successfully!");
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to accept appointment.",
      );
    }
  };

  const handleStartWork = async () => {
    try {
      await mechanicWorkService.startWork(selectedAppointment.appointmentId);

      setShowDetailsModal(false);

      await fetchMechanicData();

      toast.success("Work started successfully!");
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message || err.message || "Failed to start work.",
      );
    }
  };

  const handleCompleteWork = async () => {
    try {
      await mechanicWorkService.completeWork(selectedAppointment.appointmentId);

      setShowDetailsModal(false);

      await fetchMechanicData();

      toast.success("Work completed successfully!");
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to complete work.",
      );
    }
  };

  const handleAvailabilityUpdate = async () => {
    try {
      await mechanicService.updateAvailability(availability);

      setCurrentAvailability(availability);

      toast.success("Availability updated successfully!");

      await fetchMechanicData();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update availability.",
      );
    }
  };

  if (loading) return <LoadingSpinner text="Loading mechanic portal..." />;

  const inProgressCount = appointments.filter(
    (a) => a.status === "IN_PROGRESS",
  ).length;

  const completedCount = appointments.filter(
    (a) => a.status === "COMPLETED",
  ).length;

  return (
    <div>
      {/* Banner */}
      <div
        className="card glass-card border-0 mb-4 text-white p-4 shadow-sm"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        }}
      >
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div>
            <h3 className="fw-extrabold m-0">Technician Workspace 🛠️</h3>
            <p className="m-0 text-white-50 mt-1">
              Logged in as {user?.name} (Mechanic Panel)
            </p>
          </div>
          <Link
            to="/mechanic/jobcards"
            className="btn btn-warning text-dark fw-bold px-4 py-2 rounded-3"
          >
            <i className="bi bi-tools me-1"></i> Manage Job Cards
          </Link>
        </div>
      </div>

      <div className="card glass-card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h5 className="fw-bold mb-1">My Availability</h5>

              <div className="mb-2">
                <small className="text-muted me-2">Current Status:</small>

                <span
                  className={`badge ${
                    currentAvailability === "AVAILABLE"
                      ? "bg-success"
                      : currentAvailability === "BUSY"
                        ? "bg-warning text-dark"
                        : "bg-secondary"
                  }`}
                >
                  {currentAvailability}
                </span>
              </div>

              <small className="text-muted">
                Update your current working status.
              </small>
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              >
                <option value="AVAILABLE">Available</option>

                <option value="BUSY">Busy</option>

                <option value="OFFLINE">Offline</option>
              </select>
            </div>

            <div className="col-md-2">
              <button
                className="btn btn-primary w-100"
                onClick={handleAvailabilityUpdate}
                disabled={availability === currentAvailability}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-md-4">
          <div className="stat-card">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted fw-semibold small d-block">
                  Total Assigned Jobs
                </span>
                <h2 className="fw-extrabold text-dark m-0 mt-1">
                  {stats?.totalAssignedJobs ?? appointments.length}
                </h2>
              </div>
              <div className="stat-icon primary">
                <i className="bi bi-clipboard-data"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-4">
          <div className="stat-card">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted fw-semibold small d-block">
                  Under Service (In Progress)
                </span>
                <h2 className="fw-extrabold text-dark m-0 mt-1">
                  {stats?.inProgressJobs ?? inProgressCount}
                </h2>
              </div>
              <div className="stat-icon warning">
                <i className="bi bi-gear-wide-connected"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-4">
          <div className="stat-card">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted fw-semibold small d-block">
                  Completed Repairs
                </span>
                <h2 className="fw-extrabold text-dark m-0 mt-1">
                  {stats?.completedJobs ?? completedCount}
                </h2>
              </div>
              <div className="stat-icon success">
                <i className="bi bi-check2-circle"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Job Cards Table */}
      <div className="card glass-card border-0 p-4 shadow-sm">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="fw-bold m-0 text-dark">
            <i className="bi bi-wrench-adjustable me-2 text-primary"></i>Active
            Service Assignments
          </h5>
          <Link
            to="/mechanic/jobcards"
            className="btn btn-sm btn-link text-decoration-none fw-semibold"
          >
            View All <i className="bi bi-arrow-right"></i>
          </Link>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-4 bg-light rounded-3">
            <i className="bi bi-tools fs-1 text-muted"></i>
            <p className="text-muted mt-2">
              No active job cards currently assigned.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-custom mb-0">
              <thead>
                <tr>
                  <th>Appointment</th>
                  <th>Vehicle</th>
                  <th>Problem</th>
                  <th>Status</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt.appointmentId}>
                    <td className="fw-bold text-primary">
                      #{appt.appointmentId}
                    </td>

                    <td>
                      <div className="fw-bold text-dark">
                        {appt.vehicleNumber}
                      </div>
                    </td>

                    <td>
                      <span
                        className="text-truncate d-inline-block"
                        style={{ maxWidth: "220px" }}
                      >
                        {appt.problemDescription}
                      </span>
                    </td>

                    <td>
                      <StatusBadge status={appt.status} />
                    </td>

                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => {
                          console.log(appt);
                          setSelectedAppointment(appt);
                          setShowDetailsModal(true);
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showDetailsModal && selectedAppointment && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Appointment #{selectedAppointment.appointmentId}
                </h5>

                <button
                  className="btn-close"
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <p>
                  <strong>Vehicle Number:</strong>{" "}
                  {selectedAppointment.vehicleNumber}
                </p>

                <p>
                  <strong>Problem:</strong>{" "}
                  {selectedAppointment.problemDescription}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <StatusBadge status={selectedAppointment.status} />
                </p>
              </div>

              <div className="modal-footer">
                <div className="d-flex justify-content-between w-100">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowDetailsModal(false)}
                  >
                    Close
                  </button>

                  {selectedAppointment.status === "PENDING" && (
                    <button
                      className="btn btn-primary"
                      onClick={handleAcceptAppointment}
                    >
                      Accept Job
                    </button>
                  )}

                  {selectedAppointment.status === "ACCEPTED" && (
                    <button
                      className="btn btn-warning"
                      onClick={handleStartWork}
                    >
                      Start Work
                    </button>
                  )}

                  {selectedAppointment.status === "IN_PROGRESS" && (
                    <button
                      className="btn btn-success"
                      onClick={handleCompleteWork}
                    >
                      Complete Work
                    </button>
                  )}

                  {selectedAppointment.status === "IN_PROGRESS" && (
                    <Link
                      to={`/mechanic/jobcards/create/${selectedAppointment.appointmentId}`}
                      className="btn btn-info"
                    >
                      Create Job Card
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MechanicDashboard;
