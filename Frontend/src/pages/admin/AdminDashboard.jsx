import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dashboardService } from "../../services/dashboardService";
import { appointmentService } from "../../services/appointmentService";
import { paymentService } from "../../services/paymentService";
import StatusBadge from "../../components/StatusBadge";
import LoadingSpinner from "../../components/LoadingSpinner";
import { formatCurrency, formatDate } from "../../utils/formatters";
import AdminDashboardCharts from "../../components/dashboard/AdminDashboardCharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [dashRes, apptRes, payRes] = await Promise.all([
        dashboardService.getAdminDashboard().catch(() => null),
        appointmentService.getAllAppointments().catch(() => ({ data: [] })),
        paymentService.getAllPayments().catch(() => ({ data: [] })),
      ]);

      setStats(dashRes?.data || dashRes);

      const apptData = apptRes.data || apptRes || [];
      const payData = payRes.data || payRes || [];

      setRecentAppointments(Array.isArray(apptData) ? apptData : []);
      setRecentPayments(Array.isArray(payData) ? payData : []);
    } catch (err) {
      console.error("Error fetching admin dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading Admin Control Panel..." />;

  const totalRevenue = recentPayments.reduce(
    (acc, p) => acc + (p.amount || 0),
    0,
  );

  return (
    <div>
      {/* Banner */}
      <div
        className="card glass-card border-0 mb-4 text-white p-4 shadow-sm"
        style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
        }}
      >
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div>
            <h3 className="fw-extrabold m-0">Administrator Portal 👑</h3>
            <p className="m-0 text-white-50 mt-1">
              System-wide monitoring, mechanic assignments, and revenue
              reporting
            </p>
          </div>
          <div className="d-flex gap-2">
            <Link
              to="/admin/appointments"
              className="btn btn-primary-custom px-3"
            >
              <i className="bi bi-calendar-check me-1"></i> Appointments
            </Link>
            <Link
              to="/admin/mechanics"
              className="btn btn-light text-dark fw-bold px-3"
            >
              <i className="bi bi-people me-1"></i> Mechanics
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted fw-semibold small d-block">
                  Total Customers
                </span>
                <h2 className="fw-extrabold text-dark m-0 mt-1">
                  {stats?.totalCustomers ?? "12"}
                </h2>
              </div>
              <div className="stat-icon primary">
                <i className="bi bi-person-fill"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted fw-semibold small d-block">
                  Active Mechanics
                </span>
                <h2 className="fw-extrabold text-dark m-0 mt-1">
                  {stats?.totalMechanics ?? "5"}
                </h2>
              </div>
              <div className="stat-icon info">
                <i className="bi bi-tools"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted fw-semibold small d-block">
                  Pending Appointments
                </span>

                <h2 className="fw-extrabold text-warning m-0 mt-1">
                  {stats?.pendingAppointments ?? "0"}
                </h2>
              </div>
              <div className="stat-icon warning">
                <i className="bi bi-hourglass-split"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted fw-semibold small d-block">
                  Total Revenue
                </span>
                <h2 className="fw-extrabold text-success m-0 mt-1">
                  {formatCurrency(stats?.totalRevenue ?? totalRevenue)}
                </h2>
              </div>
              <div className="stat-icon success">
                <i className="bi bi-currency-rupee"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdminDashboardCharts stats={stats} />

      {/* Grid: Appointments & Payments */}
      <div className="row g-4">
        {/* Recent Service Requests */}
        <div className="col-12 col-lg-7">
          <div className="card glass-card border-0 p-4 shadow-sm">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold m-0 text-dark">
                <i className="bi bi-calendar3 me-2 text-primary"></i>Recent
                Service Appointments
              </h5>
              <Link
                to="/admin/appointments"
                className="btn btn-sm btn-link text-decoration-none fw-semibold"
              >
                View All
              </Link>
            </div>

            {recentAppointments.length === 0 ? (
              <p className="text-muted small py-3 text-center">
                No service appointments recorded in system.
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table table-custom">
                  <thead>
                    <tr>
                      <th>APPT #</th>
                      <th>CUSTOMER</th>
                      <th>VEHICLE</th>
                      <th>STATUS</th>
                      <th className="text-end">MECHANIC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAppointments.slice(0, 5).map((app) => (
                      <tr
                        key={app.appointmentId}
                        className={
                          app.status === "CANCELLED" ? "table-danger" : ""
                        }
                      >
                        <td className="fw-bold text-primary">
                          #{app.appointmentId}
                        </td>

                        <td>
                          <div className="fw-semibold">{app.customerName}</div>
                        </td>

                        <td>
                          <div className="fw-semibold">
                            {`${app.vehicleMake} ${app.vehicleModel}`.replace(
                              /\b\w/g,
                              (c) => c.toUpperCase(),
                            )}
                          </div>

                          <small className="text-muted">
                            {app.vehicleNumber}
                          </small>
                        </td>

                        <td>
                          <StatusBadge status={app.status} />
                        </td>

                        <td>
                          <span className="fw-semibold text-primary">
                            {app.mechanicName || "Unassigned"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="col-12 col-lg-5">
          <div className="card glass-card border-0 p-4 shadow-sm">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold m-0 text-dark">
                <i className="bi bi-wallet2 me-2 text-success"></i>Recent
                Payments
              </h5>
              <Link
                to="/admin/payments"
                className="btn btn-sm btn-link text-decoration-none fw-semibold"
              >
                Billing Logs
              </Link>
            </div>

            {recentPayments.length === 0 ? (
              <p className="text-muted small py-3 text-center">
                No transactions recorded yet.
              </p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {recentPayments.slice(0, 5).map((pay) => (
                  <div
                    key={pay.id || pay.paymentId}
                    className="p-3 bg-light rounded-3 border d-flex align-items-center justify-content-between"
                  >
                    <div>
                      <div className="fw-bold text-dark">
                        {formatCurrency(pay.amount)}
                      </div>

                      <div className="small fw-semibold">
                        Invoice #{pay.invoiceId}
                      </div>

                      <small className="text-muted">
                        {pay.paymentMethod} • {pay.paymentStatus}
                      </small>

                      <div className="small text-muted">
                        {formatDate(pay.paymentDate)}
                      </div>
                    </div>

                    <span className="badge bg-success-subtle text-success border">
                      {pay.paymentMethod}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
