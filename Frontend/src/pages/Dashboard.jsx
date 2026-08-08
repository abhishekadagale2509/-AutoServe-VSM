import { useNavigate } from "react-router-dom";

const Dashboard = () => {

    const navigate = useNavigate();

    const name = localStorage.getItem("name");

    return (

        <div className="py-3">

            {/* Welcome Section */}

            <div className="mb-5">

                <h2 className="fw-bold mb-2">
    Welcome back, {name} 👋
</h2>

<p className="text-secondary fs-5">
    Manage your vehicles and appointments from one place.
</p>

            </div>

            {/* Quick Stats */}

            <div className="row g-4 mb-5">

                <div className="col-md-3">

                    <div className="card shadow h-100">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Vehicles
                            </h6>

                            <h2 className="fw-bold text-primary">
                                🚗
                            </h2>

                            <p className="mb-0">
                                Manage all vehicles
                            </p>

                        </div>

                    </div>

                </div>

                <div className="col-md-3">

                    <div className="card shadow h-100">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Appointments
                            </h6>

                            <h2 className="fw-bold text-success">
                                📅
                            </h2>

                            <p className="mb-0">
                                Track appointments
                            </p>

                        </div>

                    </div>

                </div>

                <div className="col-md-3">

                    <div className="card shadow h-100">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Pending
                            </h6>

                            <h2 className="fw-bold text-warning">
                                ⏳
                            </h2>

                            <p className="mb-0">
                                Awaiting service
                            </p>

                        </div>

                    </div>

                </div>

                <div className="col-md-3">

                    <div className="card shadow h-100">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Completed
                            </h6>

                            <h2 className="fw-bold text-info">
                                ✅
                            </h2>

                            <p className="mb-0">
                                Finished services
                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* Quick Actions */}

            <h4 className="mb-3 fw-bold">
                Quick Actions
            </h4>

            <div className="row g-4">

                <div className="col-md-6 col-lg-3">

                    <div
                        className="card shadow text-center h-100"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/vehicles")}
                    >

                        <div className="card-body py-4">

                            <div style={{ fontSize: "55px" }}>
                                🚗
                            </div>

                            <h4 className="mt-3">
                                My Vehicles
                            </h4>

                            <p className="text-muted">
                                View and manage your registered vehicles.
                            </p>

                        </div>

                    </div>

                </div>

                <div className="col-md-6 col-lg-3">

                    <div
                        className="card shadow text-center h-100"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/vehicles/add")}
                    >

                        <div className="card-body py-4">

                            <div style={{ fontSize: "55px" }}>
                                ➕
                            </div>

                            <h4 className="mt-3">
                                Add Vehicle
                            </h4>

                            <p className="text-muted">
                                Register a new vehicle.
                            </p>

                        </div>

                    </div>

                </div>

                <div className="col-md-6 col-lg-3">

                    <div
                        className="card shadow text-center h-100"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/appointments/book")}
                    >

                        <div className="card-body py-4">

                            <div style={{ fontSize: "55px" }}>
                                📅
                            </div>

                            <h4 className="mt-3">
                                Book Service
                            </h4>

                            <p className="text-muted">
                                Schedule your next vehicle service.
                            </p>

                        </div>

                    </div>

                </div>

                <div className="col-md-6 col-lg-3">

                    <div
                        className="card shadow text-center h-100"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/appointments")}
                    >

                        <div className="card-body py-4">

                            <div style={{ fontSize: "55px" }}>
                                📋
                            </div>

                            <h4 className="mt-3">
                                Appointments
                            </h4>

                            <p className="text-muted">
                                Track all your booked services.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default Dashboard;