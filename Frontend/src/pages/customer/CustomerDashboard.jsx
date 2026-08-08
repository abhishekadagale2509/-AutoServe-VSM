import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { vehicleService } from "../../services/vehicleService";
import { appointmentService } from "../../services/appointmentService";
import { dashboardService } from "../../services/dashboardService";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusBadge from "../../components/StatusBadge";
import { formatDate } from "../../utils/formatters";
import vehicleTipsService from "../../services/vehicleTipsService";
const CustomerDashboard = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [vehicleTips, setVehicleTips] = useState([]);
  const [tipsLoading, setTipsLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (vehicles.length > 0 && !selectedVehicleId) {
      const firstVehicle = vehicles[0];

      setSelectedVehicleId(firstVehicle.id || firstVehicle.vehicleId);

      fetchVehicleTips(firstVehicle);
    }
  }, [vehicles, selectedVehicleId]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch vehicles and appointments
      const [vRes, aRes] = await Promise.all([
        vehicleService.getVehicles().catch(() => ({ data: [] })),
        appointmentService.getAppointments().catch(() => ({ data: [] })),
      ]);

      const vData = vRes.data || vRes || [];
      const aData = aRes.data || aRes || [];

      setVehicles(Array.isArray(vData) ? vData : []);
      setAppointments(Array.isArray(aData) ? aData : []);

      // Try dashboard endpoint if available
      try {
        const dRes = await dashboardService.getCustomerDashboard();
        setStats(dRes.data || dRes);
      } catch {
        setStats(null);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicleTips = async (vehicle) => {
    if (!vehicle) {
      setVehicleTips([]);
      return;
    }

    try {
      setTipsLoading(true);

      const vehicleType =
        vehicle.vehicleType || vehicle.type || vehicle.category || "CAR";

      const response = await vehicleTipsService.getTips(vehicleType);

      setVehicleTips(response.data || response || []);
    } catch (error) {
      console.error("Error fetching vehicle tips:", error);
      setVehicleTips([]);
    } finally {
      setTipsLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading your dashboard..." />;

  const pendingCount = appointments.filter(
    (a) => a.status === "PENDING" || a.status === "ACCEPTED",
  ).length;
  const completedCount = appointments.filter(
    (a) => a.status === "COMPLETED",
  ).length;

  return (
    <div>
      {/* Welcome Banner */}
      <div
        className="card glass-card border-0 mb-4 bg-primary text-white p-4 shadow-sm"
        style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)",
        }}
      >
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div>
            <h3 className="fw-extrabold m-0">Welcome back, {user?.name}! 👋</h3>
            <p className="m-0 text-white-50 mt-1">
              Keep your vehicles in top performance with AutoServe VSM.
            </p>
          </div>
          <Link
            to="/customer/book-appointment"
            className="btn btn-light text-primary fw-bold px-4 py-2 rounded-3"
          >
            <i className="bi bi-plus-circle me-1"></i> Book New Service
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-md-4">
          <div className="stat-card">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted fw-semibold small d-block">
                  Registered Vehicles
                </span>
                <h2 className="fw-extrabold text-dark m-0 mt-1">
                  {stats?.totalVehicles ?? vehicles.length}
                </h2>
              </div>
              <div className="stat-icon primary">
                <i className="bi bi-car-front"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-4">
          <div className="stat-card">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted fw-semibold small d-block">
                  Active / Pending Bookings
                </span>
                <h2 className="fw-extrabold text-dark m-0 mt-1">
                  {stats?.activeAppointments ?? pendingCount}
                </h2>
              </div>
              <div className="stat-icon warning">
                <i className="bi bi-calendar-event"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-4">
          <div className="stat-card">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted fw-semibold small d-block">
                  Completed Servicings
                </span>
                <h2 className="fw-extrabold text-dark m-0 mt-1">
                  {stats?.completedAppointments ?? completedCount}
                </h2>
              </div>
              <div className="stat-icon success">
                <i className="bi bi-check-circle"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="row g-4">
        {/* Recent Appointments */}
        <div className="col-12 col-lg-8">
          <div className="card glass-card border-0 p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold m-0 text-dark">
                <i className="bi bi-clock-history me-2 text-primary"></i>Recent
                Appointments
              </h5>
              <Link
                to="/customer/appointments"
                className="btn btn-sm btn-link text-decoration-none fw-semibold"
              >
                View All <i className="bi bi-arrow-right"></i>
              </Link>
            </div>

            {appointments.length === 0 ? (
              <div className="text-center py-4 bg-light rounded-3">
                <i className="bi bi-calendar-x fs-1 text-muted"></i>
                <p className="text-muted mt-2 mb-3">
                  No service appointments booked yet.
                </p>
                <Link
                  to="/customer/book-appointment"
                  className="btn btn-primary-custom btn-sm"
                >
                  Schedule Service
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-custom mb-0">
                  <thead>
                    <tr>
                      <th>Vehicle</th>
                      <th>Service Type</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.slice(0, 5).map((app) => (
                      <tr key={app.id || app.appointmentId}>
                        <td className="fw-semibold">
                          {app.vehicle?.make || app.vehicleMake}{" "}
                          {app.vehicle?.model || app.vehicleModel}
                          <small className="d-block text-muted">
                            {app.vehicle?.licensePlate || app.vehicleNumber}
                          </small>
                        </td>
                        <td>
                          {app.serviceType ||
                            app.serviceName ||
                            "General Service"}
                        </td>
                        <td>{formatDate(app.appointmentDate || app.date)}</td>
                        <td>
                          <StatusBadge status={app.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* My Garage Preview */}
        <div className="col-12 col-lg-4">
          <div className="card glass-card border-0 p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold m-0 text-dark">
                <i className="bi bi-car-front-fill me-2 text-primary"></i>My
                Garage
              </h5>
              <Link
                to="/customer/vehicles"
                className="btn btn-sm btn-link text-decoration-none fw-semibold"
              >
                Manage
              </Link>
            </div>

            {vehicles.length === 0 ? (
              <div className="text-center py-4 bg-light rounded-3">
                <i className="bi bi-car-front fs-1 text-muted"></i>
                <p className="text-muted mt-2 mb-2">No vehicles added.</p>
                <Link
                  to="/customer/vehicles"
                  className="btn btn-outline-primary btn-sm"
                >
                  Add Vehicle
                </Link>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {vehicles.slice(0, 3).map((v) => (
                  <div
                    key={v.id || v.vehicleId}
                    className="p-3 bg-light rounded-3 border d-flex align-items-center justify-content-between"
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-white p-2 rounded-2 border text-primary">
                        <i className="bi bi-car-front fs-4"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold text-dark m-0">
                          {v.make} {v.model}
                        </h6>
                        <small className="text-muted">
                          {v.licensePlate || v.registrationNumber}
                        </small>
                      </div>
                    </div>
                    <span className="badge bg-secondary">
                      {v.year || "N/A"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Vehicle Maintenance Tips */}
      <div className="card glass-card border-0 p-4 mt-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
          <div>
            <h5 className="fw-bold m-0 text-dark">
              <i className="bi bi-lightbulb-fill me-2 text-warning"></i>
              Vehicle Maintenance Tips
            </h5>
            <p className="text-muted small mb-0 mt-1">
              Helpful maintenance tips based on your vehicle.
            </p>
          </div>

          {vehicles.length > 0 && (
            <select
              className="form-select"
              style={{ maxWidth: "260px" }}
              value={selectedVehicleId}
              onChange={(e) => {
                const vehicleId = e.target.value;
                setSelectedVehicleId(vehicleId);

                const selectedVehicle = vehicles.find(
                  (v) => String(v.id || v.vehicleId) === String(vehicleId),
                );

                fetchVehicleTips(selectedVehicle);
              }}
            >
              {vehicles.map((v) => (
                <option key={v.id || v.vehicleId} value={v.id || v.vehicleId}>
                  {v.make} {v.model}
                </option>
              ))}
            </select>
          )}
        </div>

        {vehicles.length === 0 ? (
          <div className="text-center py-4 bg-light rounded-3">
            <i className="bi bi-car-front fs-1 text-muted"></i>
            <p className="text-muted mt-2 mb-0">
              Add a vehicle to view maintenance tips.
            </p>
          </div>
        ) : tipsLoading ? (
          <div className="text-center py-4">
            <LoadingSpinner text="Loading vehicle tips..." />
          </div>
        ) : vehicleTips.length === 0 ? (
          <div className="text-center py-4 bg-light rounded-3">
            <i className="bi bi-info-circle fs-2 text-muted"></i>
            <p className="text-muted mt-2 mb-0">
              No maintenance tips available.
            </p>
          </div>
        ) : (
          <div className="row g-3">
            {vehicleTips.map((tip, index) => (
              <div className="col-12 col-md-6" key={index}>
                <div className="p-3 bg-light rounded-3 border h-100">
                  <div className="d-flex align-items-start gap-3">
                    <div className="bg-white p-2 rounded-circle border text-warning">
                      <i className="bi bi-check-circle-fill"></i>
                    </div>

                    <span className="text-dark">{tip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
