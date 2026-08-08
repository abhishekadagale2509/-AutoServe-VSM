import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import vehicleService from "../services/vehicleService";
import appointmentService from "../services/appointmentService";

const BookAppointment = () => {

    const navigate = useNavigate();

    const [vehicles, setVehicles] = useState([]);

    const [appointment, setAppointment] = useState({
        vehicleId: "",
        appointmentDate: "",
        problemDescription: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {

        try {

            const response = await vehicleService.getAllVehicles();

            if (response.success) {
                setVehicles(response.data);
            }

        } catch (err) {
            console.error(err);
        }

    };

    const handleChange = (e) => {

        setAppointment({
            ...appointment,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        try {

            const response = await appointmentService.bookAppointment(appointment);

            if (response.success) {

                setMessage(response.message);

                setTimeout(() => {
                    navigate("/appointments");
                }, 1000);

            } else {

                setError(response.message);

            }

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to book appointment."
            );

        }

    };

    return (

        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-6">

                    <div className="card shadow">

                        <div className="card-header text-center">
                            <h3>Book Appointment</h3>
                        </div>

                        <div className="card-body">

                            {
                                message &&
                                <div className="alert alert-success">
                                    {message}
                                </div>
                            }

                            {
                                error &&
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            }

                            <form onSubmit={handleSubmit}>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Select Vehicle
                                    </label>

                                    <select
                                        className="form-select"
                                        name="vehicleId"
                                        value={appointment.vehicleId}
                                        onChange={handleChange}
                                        required
                                    >

                                        <option value="">
                                            Select Vehicle
                                        </option>

                                        {
                                            vehicles.map(vehicle => (

                                                <option
                                                    key={vehicle.vehicleId}
                                                    value={vehicle.vehicleId}
                                                >
                                                    {vehicle.vehicleNumber} - {vehicle.brand} {vehicle.model}
                                                </option>

                                            ))
                                        }

                                    </select>

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Appointment Date
                                    </label>

                                    <input
                                        type="date"
                                        className="form-control"
                                        name="appointmentDate"
                                        value={appointment.appointmentDate}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Problem Description
                                    </label>

                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        name="problemDescription"
                                        value={appointment.problemDescription}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                <button
                                    className="btn btn-primary w-100"
                                    type="submit"
                                >
                                    Book Appointment
                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default BookAppointment;