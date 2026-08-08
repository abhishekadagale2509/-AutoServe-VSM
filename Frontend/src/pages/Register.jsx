import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";

const Register = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        try {

            await authService.register(formData);

            setSuccess("Registration successful! Redirecting to Login...");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Registration failed."
            );

        }

    };

    return (

        <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh", background: "#f5f7fb" }}
        >

            <div
                className="card shadow-lg p-4"
                style={{
                    width: "100%",
                    maxWidth: "500px",
                    borderRadius: "18px"
                }}
            >

                <div className="text-center mb-4">

                    <h2 className="fw-bold text-primary">
                        🚗 AutoServe
                    </h2>

                    <h4 className="fw-semibold">
                        Create Account
                    </h4>

                    <p className="text-muted mb-0">
                        Vehicle Service Management System
                    </p>

                </div>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="mb-3">

                        <label className="form-label fw-semibold">
                            Full Name
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="mb-3">

                        <label className="form-label fw-semibold">
                            Email Address
                        </label>

                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="mb-3">

                        <label className="form-label fw-semibold">
                            Phone Number
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="mb-4">

                        <label className="form-label fw-semibold">
                            Password
                        </label>

                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <button
                        className="btn btn-primary w-100 py-2 fw-semibold"
                        type="submit"
                    >
                        Create Account
                    </button>

                </form>

                <hr />

                <p className="text-center mb-0">

                    Already have an account?{" "}

                    <Link
                        to="/login"
                        className="fw-semibold text-decoration-none"
                    >
                        Login
                    </Link>

                </p>

            </div>

        </div>

    );

};

export default Register;