import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import authService from "../../services/authService";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your registered email.");
      return;
    }

    setLoading(true);

    try {
      await authService.forgotPassword(email);

      toast.success("OTP sent successfully.");

      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await authService.verifyOtp(email, otp);

      toast.success("OTP Verified Successfully.");

      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await authService.forgotPassword(email);

      toast.success("OTP sent again.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to resend OTP.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await authService.resetPassword(
        email,
        passwordData.newPassword,
        passwordData.confirmPassword,
      );

      toast.success("Password reset successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="d-flex justify-content-center align-items-center mb-4">
          <div className="text-center">
            <div
              className={`rounded-circle d-flex align-items-center justify-content-center ${
                step >= 1 ? "bg-primary text-white" : "bg-light text-muted"
              }`}
              style={{
                width: 38,
                height: 38,
                fontWeight: "bold",
              }}
            >
              {step > 1 ? <i className="bi bi-check-lg"></i> : "1"}
            </div>

            <small>Email</small>
          </div>

          <div
            className={`mx-2 ${step >= 2 ? "bg-primary" : "bg-light"}`}
            style={{
              width: 70,
              height: 3,
            }}
          ></div>

          <div className="text-center">
            <div
              className={`rounded-circle d-flex align-items-center justify-content-center ${
                step >= 2 ? "bg-primary text-white" : "bg-light text-muted"
              }`}
              style={{
                width: 38,
                height: 38,
                fontWeight: "bold",
              }}
            >
              {step > 2 ? <i className="bi bi-check-lg"></i> : "2"}
            </div>

            <small>OTP</small>
          </div>

          <div
            className={`mx-2 ${step >= 3 ? "bg-primary" : "bg-light"}`}
            style={{
              width: 70,
              height: 3,
            }}
          ></div>

          <div className="text-center">
            <div
              className={`rounded-circle d-flex align-items-center justify-content-center ${
                step >= 3 ? "bg-primary text-white" : "bg-light text-muted"
              }`}
              style={{
                width: 38,
                height: 38,
                fontWeight: "bold",
              }}
            >
              3
            </div>

            <small>Reset</small>
          </div>
        </div>
        <div className="text-center mb-4">
          <div
            className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow"
            style={{ width: "60px", height: "60px" }}
          >
            <i className="bi bi-shield-lock-fill fs-3"></i>
          </div>

          <h3 className="fw-extrabold text-dark mb-1">Forgot Password</h3>

          <p className="text-muted small">Recover your AutoServe account</p>
        </div>

        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div className="mb-4">
              <label className="form-label fw-semibold text-dark">
                Email Address
              </label>

              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-envelope text-muted"></i>
                </span>

                <input
                  type="email"
                  className="form-control form-control-custom border-start-0"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary-custom w-100 py-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Sending OTP...
                </>
              ) : (
                <>
                  <i className="bi bi-send"></i> Send OTP
                </>
              )}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <div className="text-center mb-3">
              <i className="bi bi-envelope-check-fill text-success fs-1"></i>

              <h5 className="fw-bold">Verify OTP</h5>

              <p className="text-muted small">Enter the 6-digit OTP sent to</p>

              <strong>{email}</strong>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">OTP</label>

              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-key-fill text-muted"></i>
                </span>

                <input
                  type="text"
                  className="form-control form-control-custom border-start-0"
                  placeholder="Enter OTP"
                  value={otp}
                  maxLength={6}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary-custom w-100 py-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Verifying...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle"></i> Verify OTP
                </>
              )}
            </button>

            <div className="text-center mt-3">
              <button
                type="button"
                className="btn btn-link text-decoration-none"
                onClick={handleResendOtp}
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="text-center mb-3">

              <h5 className="fw-bold">Reset Password</h5>

              <p className="text-muted small">Enter your new password.</p>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">New Password</label>

              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-lock-fill"></i>
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control form-control-custom border-start-0"
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  required
                />

                <span
                  className="input-group-text bg-light"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                  ></i>
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Confirm Password</label>

              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-lock-fill"></i>
                </span>

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control form-control-custom border-start-0"
                  placeholder="Confirm Password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
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
            </div>

            <button
              type="submit"
              className="btn btn-primary-custom w-100 py-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Updating...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle"></i> Reset Password
                </>
              )}
            </button>
          </form>
        )}

        <div className="text-center mt-4">
          <Link
            to="/login"
            className="fw-bold text-primary text-decoration-none"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
