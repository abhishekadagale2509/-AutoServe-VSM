import { useState } from "react";
import { useNavigate } from "react-router-dom";
import vehicleService from "../services/vehicleService";

const AddVehicle = () => {
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState({
    vehicleNumber: "",
    brand: "",
    model: "",
    vehicleType: "",
    year: "",
    fuelType: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setVehicle({
      ...vehicle,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await vehicleService.addVehicle(vehicle);

      if (response.success) {
        setMessage(response.message);

        setTimeout(() => {
          navigate("/vehicles");
        }, 1000);
      } else {
        setError(response.message);
      }
    } catch (err) {

    console.log(err.response);

    setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        JSON.stringify(err.response?.data) ||
        err.message
    );

}
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header text-center">
              <h3>Add Vehicle</h3>
            </div>

            <div className="card-body">
              {message && <div className="alert alert-success">{message}</div>}

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Vehicle Number</label>

                  <input
                    type="text"
                    name="vehicleNumber"
                    className="form-control"
                    value={vehicle.vehicleNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Brand</label>

                  <input
                    type="text"
                    name="brand"
                    className="form-control"
                    value={vehicle.brand}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Model</label>

                  <input
                    type="text"
                    name="model"
                    className="form-control"
                    value={vehicle.model}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Vehicle Type</label>

                  <select
                    name="vehicleType"
                    className="form-select"
                    value={vehicle.vehicleType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Vehicle Type</option>
                    <option value="CAR">Car</option>
                    <option value="BIKE">Bike</option>
                    <option value="SUV">SUV</option>
                    <option value="TRUCK">Truck</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Manufacturing Year</label>

                  <input
                    type="number"
                    name="year"
                    className="form-control"
                    value={vehicle.year}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Fuel Type</label>

                  <select
                    name="fuelType"
                    className="form-select"
                    value={vehicle.fuelType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Fuel Type</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Add Vehicle
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVehicle;
