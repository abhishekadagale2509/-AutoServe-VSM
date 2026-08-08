import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onToggleSidebar }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getRoleBadgeColor = () => {
    switch (role) {
      case "ADMIN":
        return "bg-danger text-white";
      case "MECHANIC":
        return "bg-warning text-dark";
      case "CUSTOMER":
      default:
        return "bg-primary text-white";
    }
  };

  return (
    <header className="navbar-custom d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-light d-lg-none p-2 rounded-circle shadow-sm"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <i className="bi bi-list fs-4"></i>
        </button>
        <div>
          <h5 className="m-0 fw-bold text-dark">AutoServe VSM</h5>
          <small className="text-muted d-none d-sm-inline">
            Vehicle Service Management System
          </small>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        <div className="text-end d-none d-md-block">
          <div className="fw-bold text-dark">{user?.name || "User"}</div>
          <div className="d-flex align-items-center gap-1 justify-content-end">
            <span
              className={`badge ${getRoleBadgeColor()} rounded-pill style-badge`}
              style={{ fontSize: "0.7rem" }}
            >
              {role}
            </span>
            <small className="text-muted">{user?.email}</small>
          </div>
        </div>

        <div className="dropdown">
          <button
            className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{
              width: "42px",
              height: "42px",
              background: "#e0e7ff",
              color: "#4f46e5",
            }}
          >
            <i className="bi bi-person-fill fs-5"></i>
          </button>
          <ul
            className="dropdown-menu dropdown-menu-end border-0 shadow-lg p-2"
            style={{ borderRadius: "12px", minWidth: "200px" }}
          >
            <li className="px-3 py-2 border-bottom mb-1">
              <div className="fw-bold text-dark">{user?.name}</div>
              <small className="text-muted">{user?.email}</small>
            </li>

            <li>
              <button
                className="dropdown-menu-item btn w-100 text-start px-3 py-2 border-0 bg-transparent rounded"
                onClick={() => {
                  if (role === "CUSTOMER") {
                    navigate("/customer/profile");
                  } else if (role === "MECHANIC") {
                    navigate("/mechanic/profile");
                  } else if (role === "ADMIN") {
                    navigate("/admin/profile");
                  }
                }}
              >
                <i className="bi bi-person-circle me-2 text-primary"></i>
                My Profile
              </button>
            </li>

            <li>
              <button
                className="dropdown-menu-item btn w-100 text-start px-3 py-2 border-0 bg-transparent rounded"
                onClick={() => navigate("/change-password")}
              >
                <i className="bi bi-key me-2 text-primary"></i>
                Change Password
              </button>
            </li>

            <li>
              <hr className="dropdown-divider" />
            </li>

            <li>
              <button
                className="dropdown-menu-item text-danger btn w-100 text-start px-3 py-2 border-0 bg-transparent rounded"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
