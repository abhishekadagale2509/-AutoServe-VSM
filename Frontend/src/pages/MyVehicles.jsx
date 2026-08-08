import { useEffect, useState } from "react";
import vehicleService from "../services/vehicleService";

const MyVehicles = () => {

    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {

        try {

            const response = await vehicleService.getAllVehicles();

            if (response.success) {
                setVehicles(response.data);
            } else {
                setError(response.message);
            }

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to load vehicles."
            );

        } finally {

            setLoading(false);

        }

    };

    if (loading) {
        return <h3 className="text-center mt-5">Loading...</h3>;
    }

    return (

        <div className="container mt-5">

            <h2 className="mb-4 text-center">My Vehicles</h2>

            {
                error &&
                <div className="alert alert-danger">
                    {error}
                </div>
            }

            {
                vehicles.length === 0 ? (

                    <div className="alert alert-info">
                        No vehicles found.
                    </div>

                ) : (

                    <table className="table table-bordered table-hover">

                        <thead className="table-dark">

                            <tr>
                                <th>#</th>
                                <th>Vehicle No.</th>
                                <th>Brand</th>
                                <th>Model</th>
                                <th>Type</th>
                                <th>Year</th>
                                <th>Fuel</th>
                            </tr>

                        </thead>

                        <tbody>

                            {
                                vehicles.map((vehicle, index) => (

                                    <tr key={vehicle.vehicleId}>

                                        <td>{index + 1}</td>
                                        <td>{vehicle.vehicleNumber}</td>
                                        <td>{vehicle.brand}</td>
                                        <td>{vehicle.model}</td>
                                        <td>{vehicle.vehicleType}</td>
                                        <td>{vehicle.year}</td>
                                        <td>{vehicle.fuelType}</td>

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

export default MyVehicles;