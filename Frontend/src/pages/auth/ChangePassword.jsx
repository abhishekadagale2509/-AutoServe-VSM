import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../utils/constants";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [loading, setLoading] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await authService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
        passwordData.confirmPassword,
      );

      toast.success("Password updated successfully.");

      updateUser({
        ...user,
        firstLogin: false,
      });

      setTimeout(() => {
        if (user.role === ROLES.ADMIN) {
          navigate("/admin/dashboard");
        } else if (user.role === ROLES.MECHANIC) {
          navigate("/mechanic/dashboard");
        } else {
          navigate("/customer/dashboard");
        }
      }, 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to update password.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="text-center mb-4">
          <div
            className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow"
            style={{ width: "60px", height: "60px" }}
          >
            <i className="bi bi-shield-lock-fill fs-3"></i>
          </div>

          <h3 className="fw-extrabold text-dark mb-1">Change Password</h3>

          <p className="text-muted small">
            Update your AutoServe account password
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Current Password */}

          <div className="mb-3">
            <label className="form-label fw-semibold">Current Password</label>

            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-lock-fill"></i>
              </span>

              <input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                className="form-control form-control-custom border-start-0"
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={handleChange}
                required
              />

              <span
                className="input-group-text bg-light"
                style={{ cursor: "pointer" }}
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                <i
                  className={`bi ${
                    showCurrentPassword ? "bi-eye-slash" : "bi-eye"
                  }`}
                ></i>
              </span>
            </div>
          </div>

          {/* New Password */}

          <div className="mb-3">
            <label className="form-label fw-semibold">New Password</label>

            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-lock-fill"></i>
              </span>

              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                className="form-control form-control-custom border-start-0"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={handleChange}
                required
              />

              <span
                className="input-group-text bg-light"
                style={{ cursor: "pointer" }}
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                <i
                  className={`bi ${
                    showNewPassword ? "bi-eye-slash" : "bi-eye"
                  }`}
                ></i>
              </span>
            </div>
            <small className="text-muted d-block mt-2">
              Password must contain:
              <br />
              • At least 8 characters
              <br />
              • One uppercase letter
              <br />
              • One lowercase letter
              <br />
              • One number
              <br />• One special character
            </small>
          </div>

          {/* Confirm Password */}

          <div className="mb-4">
            <label className="form-label fw-semibold">Confirm Password</label>

            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-lock-fill"></i>
              </span>

              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="form-control form-control-custom border-start-0"
                placeholder="Confirm Password"
                value={passwordData.confirmPassword}
                onChange={handleChange}
                required
              />

              <span
                className="input-group-text bg-light"
                style={{ cursor: "pointer" }}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <i
                  className={`bi ${
                    showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                  }`}
                ></i>
              </span>
            </div>
            {passwordData.confirmPassword &&
              passwordData.newPassword !== passwordData.confirmPassword && (
                <small className="text-danger mt-1 d-block">
                  Passwords do not match.
                </small>
              )}
          </div>

          <button
            type="submit"
            className="btn btn-primary-custom w-100 py-2"
            disabled={
              loading ||
              !passwordData.currentPassword.trim() ||
              !passwordData.newPassword.trim() ||
              !passwordData.confirmPassword.trim() ||
              passwordData.newPassword !== passwordData.confirmPassword
            }
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Updating...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle"></i> Update Password
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            type="button"
            className="btn btn-link fw-bold text-decoration-none"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
