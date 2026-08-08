import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { vehicleService } from "../../services/vehicleService";
import LoadingSpinner from "../../components/LoadingSpinner";
import ModalWrapper from "../../components/ModalWrapper";

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    vehicleType: "CAR",
    vehicleNumber: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    fuelType: "PETROL",
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchVehicles(search);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  const fetchVehicles = async (searchTerm = "") => {
    try {
      const res = await vehicleService.getVehicles(searchTerm);

      const data = res.data || res || [];

      setVehicles(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await vehicleService.addVehicle({
        ...formData,
        year: parseInt(formData.year, 10),
      });
      toast.success("Vehicle registered successfully!");
      setIsModalOpen(false);
      setFormData({
        vehicleType: "CAR",
        vehicleNumber: "",
        brand: "",
        model: "",
        year: new Date().getFullYear(),
        fuelType: "PETROL",
      });
      fetchVehicles();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add vehicle";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Fetching your vehicles..." />;

  return (
    <div>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h3 className="fw-extrabold text-dark m-0">My Garage</h3>
          <p className="text-muted small m-0">
            Add and manage all your registered vehicles
          </p>
        </div>
        <button
          className="btn btn-primary-custom"
          onClick={() => setIsModalOpen(true)}
        >
          <i className="bi bi-plus-circle"></i> Register New Vehicle
        </button>
      </div>

      <div className="card glass-card border-0 p-3 mb-4">
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0">
            <i className="bi bi-search"></i>
          </span>

          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search by brand, model, registration number, fuel type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {/* Vehicle Cards Grid */}
      {vehicles.length === 0 ? (
        search.trim() ? (
          <div className="card glass-card border-0 p-5 text-center">
            <div className="bg-light rounded-circle d-inline-flex p-3 mx-auto mb-3">
              <i className="bi bi-search fs-1 text-primary"></i>
            </div>

            <h5 className="fw-bold text-dark">No Matching Vehicles Found</h5>

            <p className="text-muted max-w-sm mx-auto mb-4">
              No vehicles matched "<strong>{search}</strong>". Try searching by
              brand, model, registration number, fuel type or vehicle type.
            </p>

            <button
              className="btn btn-outline-primary"
              onClick={() => setSearch("")}
            >
              <i className="bi bi-x-circle me-2"></i>
              Clear Search
            </button>
          </div>
        ) : (
          <div className="card glass-card border-0 p-5 text-center">
            <div className="bg-light rounded-circle d-inline-flex p-3 mx-auto mb-3">
              <i className="bi bi-car-front fs-1 text-primary"></i>
            </div>

            <h5 className="fw-bold text-dark">No Vehicles Registered</h5>

            <p className="text-muted max-w-sm mx-auto mb-4">
              You haven't added any vehicles to your account yet. Register your
              vehicle to schedule service appointments.
            </p>

            <div>
              <button
                className="btn btn-primary-custom"
                onClick={() => setIsModalOpen(true)}
              >
                <i className="bi bi-plus-circle"></i> Add Vehicle Now
              </button>
            </div>
          </div>
        )
      ) : (
        <div className="row g-4">
          {vehicles.map((v) => (
            <div key={v.id || v.vehicleId} className="col-12 col-md-6 col-lg-4">
              <div className="card glass-card border-0 h-100 p-4 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="badge bg-primary-subtle text-primary fw-bold text-uppercase px-3 py-2 rounded-pill">
                      <i className="bi bi-shield-check me-1"></i>{" "}
                      {v.vehicleType || "CAR"}
                    </span>
                    <span className="badge bg-light text-dark border px-2 py-1">
                      {v.fuelType || "PETROL"}
                    </span>
                  </div>

                  <h4 className="fw-bold text-dark mb-1">
                    {v.brand || v.make} {v.model}
                  </h4>
                  <p className="text-muted small mb-3">
                    Year of Manufacture: {v.year || "N/A"}
                  </p>

                  <div className="bg-light p-3 rounded-3 border d-flex align-items-center justify-content-between mb-3">
                    <span className="text-muted small fw-semibold">
                      License Plate
                    </span>
                    <span className="font-monospace fw-bold text-dark fs-6 bg-white px-2 py-1 rounded border">
                      {v.vehicleNumber || v.licensePlate}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-top d-flex justify-content-end">
                  <small className="text-muted">Registered in System</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Vehicle Modal */}
      <ModalWrapper
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register Vehicle"
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold text-dark">
              Vehicle Type
            </label>
            <select
              name="vehicleType"
              className="form-select form-select-custom"
              value={formData.vehicleType}
              onChange={handleChange}
            >
              <option value="CAR">Car</option>
              <option value="BIKE">Bike / Motorcycle</option>
              <option value="TRUCK">Truck / Commercial</option>
            </select>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="form-label fw-semibold text-dark">
                Brand / Make
              </label>
              <input
                type="text"
                name="brand"
                className="form-control form-control-custom"
                placeholder="e.g. Toyota, Honda"
                value={formData.brand}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label fw-semibold text-dark">Model</label>
              <input
                type="text"
                name="model"
                className="form-control form-control-custom"
                placeholder="e.g. Civic, City"
                value={formData.model}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold text-dark">
              Vehicle Plate / Registration Number
            </label>
            <input
              type="text"
              name="vehicleNumber"
              className="form-control form-control-custom text-uppercase font-monospace"
              placeholder="e.g. MH12AB1234"
              value={formData.vehicleNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row g-3 mb-4">
            <div className="col-6">
              <label className="form-label fw-semibold text-dark">
                Model Year
              </label>
              <input
                type="number"
                name="year"
                className="form-control form-control-custom"
                placeholder="2022"
                value={formData.year}
                onChange={handleChange}
                min="1990"
                max={new Date().getFullYear()}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label fw-semibold text-dark">
                Fuel Type
              </label>
              <select
                name="fuelType"
                className="form-select form-select-custom"
                value={formData.fuelType}
                onChange={handleChange}
              >
                <option value="PETROL">Petrol</option>
                <option value="DIESEL">Diesel</option>
                <option value="ELECTRIC">Electric (EV)</option>
                <option value="HYBRID">Hybrid</option>
                <option value="CNG">CNG</option>
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-light px-4"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary-custom px-4"
              disabled={submitting}
            >
              {submitting ? "Registering..." : "Save Vehicle"}
            </button>
          </div>
        </form>
      </ModalWrapper>
    </div>
  );
};

export default VehicleManagement;
