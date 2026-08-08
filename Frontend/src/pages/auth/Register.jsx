import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import authService from "../../services/authService";
import { ROLES } from "../../utils/constants";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: ROLES.CUSTOMER,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Phone validation matching ^[6-9]\d{9}$
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error(
        "Please enter a valid 10-digit Indian phone number starting with 6-9.",
      );
      return;
    }

    setLoading(true);
    try {
      await authService.register(formData);
      toast.success(
        "Registration successful! Please login with your credentials.",
      );
      navigate("/login");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper py-5">
      <div className="auth-card auth-card-wide">
        <div className="text-center mb-4">
          <div
            className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow"
            style={{ width: "60px", height: "60px" }}
          >
            <i className="bi bi-person-plus-fill fs-3"></i>
          </div>
          <h3 className="fw-extrabold text-dark mb-1">Create an Account</h3>
          <p className="text-muted small">
            Join AutoServe to schedule & track vehicle servicing seamlessly
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark">
                Full Name
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-person text-muted"></i>
                </span>
                <input
                  type="text"
                  name="name"
                  className="form-control form-control-custom border-start-0"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark">
                Email Address
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-envelope text-muted"></i>
                </span>
                <input
                  type="email"
                  name="email"
                  className="form-control form-control-custom border-start-0"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark">
                Phone Number
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-telephone text-muted"></i>
                </span>
                <input
                  type="tel"
                  name="phone"
                  className="form-control form-control-custom border-start-0"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark">
                Password
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-lock text-muted"></i>
                </span>
                <input
                  type="password"
                  name="password"
                  className="form-control form-control-custom border-start-0"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Account Type</label>

              <input
                type="text"
                className="form-control form-control-custom"
                value="Customer"
                disabled
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary-custom w-100 py-2 mt-4 mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Creating Account...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle"></i> Register Now
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="text-muted small mb-0">
            Already have an account?{" "}
            <Link
              to="/login"
              className="fw-bold text-primary text-decoration-none"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
