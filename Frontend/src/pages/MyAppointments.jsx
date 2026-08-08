import { useEffect, useState } from "react";
import appointmentService from "../services/appointmentService";

const MyAppointments = () => {

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {

        try {

            const response = await appointmentService.getAllAppointments();

            if (response.success) {
                setAppointments(response.data);
            } else {
                setError(response.message);
            }

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to load appointments."
            );

        } finally {

            setLoading(false);

        }

    };

    if (loading) {
        return (
            <h3 className="text-center mt-5">
                Loading...
            </h3>
        );
    }

    return (

        <div className="container mt-5">

            <h2 className="text-center mb-4">
                My Appointments
            </h2>

            {
                error &&
                <div className="alert alert-danger">
                    {error}
                </div>
            }

            {
                appointments.length === 0 ? (

                    <div className="alert alert-info">
                        No appointments found.
                    </div>

                ) : (

                    <table className="table table-bordered table-hover">

                        <thead className="table-dark">

                            <tr>
                                <th>ID</th>
                                <th>Vehicle</th>
                                <th>Mechanic</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Problem</th>
                            </tr>

                        </thead>

                        <tbody>

                            {
                                appointments.map((appointment) => (

                                    <tr key={appointment.appointmentId}>

                                        <td>{appointment.appointmentId}</td>

                                        <td>
                                            {appointment.vehicleNumber}
                                        </td>

                                        <td>
                                            {appointment.mechanicName}
                                        </td>

                                        <td>
                                            {appointment.appointmentDate}
                                        </td>

                                        <td>

                                            <span
                                                className={`badge ${
                                                    appointment.status === "PENDING"
                                                        ? "bg-warning text-dark"
                                                        : appointment.status === "COMPLETED"
                                                        ? "bg-success"
                                                        : appointment.status === "CANCELLED"
                                                        ? "bg-danger"
                                                        : "bg-secondary"
                                                }`}
                                            >
                                                {appointment.status}
                                            </span>

                                        </td>

                                        <td>
                                            {appointment.problemDescription}
                                        </td>

                                    </tr>

                                ))
                            }

                        </tbody>

                    </table>

                )
            }

        </div>

    );

};

export default MyAppointments;