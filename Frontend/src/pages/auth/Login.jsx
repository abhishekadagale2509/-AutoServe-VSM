import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";
import { ROLES } from "../../utils/constants";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.login(formData);
      const data = res.data || res;
      console.log(data);

      const token = data.token;
      const user = {
        name: data.name,
        email: data.email,
        role: data.role,
        firstLogin: data.firstLogin,
      };

      login(user, token);
      toast.success(`Welcome back, ${user.name}!`);

      // Redirect based on role

      if (user.role === ROLES.ADMIN) {
        navigate("/admin/dashboard");
      } else if (user.role === ROLES.MECHANIC) {
        if (user.firstLogin) {
          navigate("/change-password");
        } else {
          navigate("/mechanic/dashboard");
        }
      } else {
        navigate("/customer/dashboard");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Invalid credentials or server error";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (email, password) => {
    setFormData({ email, password });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="text-center mb-4">
          <div
            className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow"
            style={{ width: "60px", height: "60px" }}
          >
            <i className="bi bi-car-front-fill fs-3"></i>
          </div>
          <h3 className="fw-extrabold text-dark mb-1">Welcome to AutoServe</h3>
          <p className="text-muted small">
            Sign in to manage your vehicle services
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
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
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold text-dark">Password</label>
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
          <div className="text-end mb-3">
            <Link
              to="/forgot-password"
              className="text-decoration-none small fw-semibold"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="btn btn-primary-custom w-100 py-2 mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Signing In...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right"></i> Sign In
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="bg-light p-3 rounded-3 mb-3 border">
          <small
            className="text-muted d-block fw-bold mb-2 text-center text-uppercase"
            style={{ fontSize: "0.7rem" }}
          >
            Quick Demo Login Autofill
          </small>
          <div className="d-flex justify-content-between gap-1">
            <button
              className="btn btn-outline-primary btn-sm flex-fill"
              onClick={() =>
                handleQuickFill("admin@autoserve.com", "Admin@123")
              }
            >
              Admin
            </button>
            <button
              className="btn btn-outline-info btn-sm flex-fill"
              onClick={() =>
                handleQuickFill("aditya@gmail.com", "Password@123")
              }
            >
              Customer
            </button>
            <button
              className="btn btn-outline-warning btn-sm flex-fill text-dark"
              onClick={() => handleQuickFill("amit@gmail.com", "Amit@123")}
            >
              Mechanic
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-muted small mb-0">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="fw-bold text-primary text-decoration-none"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
