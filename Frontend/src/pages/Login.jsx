import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../services/authService";

const Login = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    try {

        const response = await authService.login(formData);

        if (response.success) {

            const role = response.data.role;

            alert("Login Successful");

            switch (role) {

                case "ADMIN":
                    navigate("/admin/dashboard");
                    break;

                case "MECHANIC":
                    navigate("/mechanic/dashboard");
                    break;

                case "CUSTOMER":
                default:
                    navigate("/dashboard");
                    break;
            }

        } else {

            setError(response.message);

        }

    } catch (err) {

        setError(
            err.response?.data?.message ||
            "Invalid email or password."
        );

    }

};

    return (

        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-5">

                    <div className="card shadow">

                        <div className="card-header text-center">

                            <h3>AutoServe Login</h3>

                        </div>

                        <div className="card-body">

                            {
                                error &&
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            }

                            <form onSubmit={handleSubmit}>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100">

                                    Login

                                </button>

                            </form>

                            <div className="text-center mt-3">

                                Don't have an account?

                                <Link to="/register">
                                    {" "}Register
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default Login;