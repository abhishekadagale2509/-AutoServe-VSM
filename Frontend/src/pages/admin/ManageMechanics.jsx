import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { mechanicService } from "../../services/mechanicService";
import LoadingSpinner from "../../components/LoadingSpinner";
import ModalWrapper from "../../components/ModalWrapper";
import ConfirmModal from "../../components/common/ConfirmModal";

const ManageMechanics = () => {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    availabilityStatus: "AVAILABLE",
  });

  useEffect(() => {
    fetchMechanics();
  }, []);

  const fetchMechanics = async () => {
    setLoading(true);
    try {
      const res = await mechanicService.getAllMechanics();
      const data = res.data || res || [];
      setMechanics(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load mechanics list");
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
      await mechanicService.createMechanic({
        ...formData,
        experience: parseInt(formData.experience, 10),
      });
      toast.success(
        "Mechanic created successfully. Login credentials have been sent to the registered email.",
      );
      setIsModalOpen(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        specialization: "",
        experience: "",
        availabilityStatus: "AVAILABLE",
      });
      fetchMechanics();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to register mechanic");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = (id) => {
    setSelectedMechanic(id);
    setShowDeactivateModal(true);
  };

  const confirmDeactivate = async () => {
    if (!selectedMechanic) return;

    try {
      await mechanicService.deleteMechanic(selectedMechanic);

      toast.success("Mechanic status updated");

      setShowDeactivateModal(false);
      setSelectedMechanic(null);

      fetchMechanics();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  if (loading) return <LoadingSpinner text="Fetching mechanics directory..." />;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h3 className="fw-extrabold text-dark m-0">
            Manage Mechanics & Staff
          </h3>
          <p className="text-muted small m-0">
            Register technicians, assign specializations, and manage
            availability
          </p>
        </div>
        <button
          className="btn btn-primary-custom"
          onClick={() => setIsModalOpen(true)}
        >
          <i className="bi bi-person-plus me-1"></i> Add New Mechanic
        </button>
      </div>

      {/* Mechanics Grid */}
      {mechanics.length === 0 ? (
        <div className="card glass-card border-0 p-5 text-center">
          <i className="bi bi-people fs-1 text-muted mb-2"></i>
          <h5 className="fw-bold">No Mechanics Found</h5>
          <p className="text-muted mb-3">
            Add service technicians to start assigning repair work.
          </p>
          <div>
            <button
              className="btn btn-primary-custom"
              onClick={() => setIsModalOpen(true)}
            >
              <i className="bi bi-plus-circle me-1"></i> Add Mechanic Now
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {mechanics.map((m) => {
            const mId = m.id || m.mechanicId;
            return (
              <div key={mId} className="col-12 col-md-6 col-lg-4">
                <div className="card glass-card border-0 p-4 h-100 d-flex flex-column justify-content-between shadow-sm">
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <span className="badge bg-primary-subtle text-primary border px-3 py-1">
                        {m.specialization || "General Technician"}
                      </span>
                      <span
                        className={`badge ${m.availabilityStatus === "AVAILABLE" ? "bg-success" : "bg-warning text-dark"}`}
                      >
                        {m.availabilityStatus || "AVAILABLE"}
                      </span>
                    </div>

                    <h5 className="fw-bold text-dark m-0">
                      {m.name || m.user?.name}
                    </h5>
                    <small className="text-muted d-block mb-3">
                      {m.email || m.user?.email}
                    </small>

                    <div className="bg-light p-3 rounded-3 border mb-3">
                      <div className="d-flex justify-content-between small text-muted mb-1">
                        <span>Phone:</span>
                        <span className="fw-semibold text-dark">
                          {m.phone || m.user?.phone || "N/A"}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between small text-muted">
                        <span>Experience:</span>
                        <span className="fw-semibold text-dark">
                          {m.experience ? `${m.experience} Years` : "3 Years"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-top d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeactivate(mId)}
                    >
                      Deactivate
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Register Mechanic Modal */}
      <ModalWrapper
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Mechanic"
      >
        <form onSubmit={handleSubmit}>
          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="form-label fw-bold text-dark">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control form-control-custom"
                placeholder="Mike Johnson"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label fw-bold text-dark">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                className="form-control form-control-custom"
                placeholder="mike@autoserve.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="form-label fw-bold text-dark">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                className="form-control form-control-custom"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold text-dark">
              Specialization
            </label>
            <select
              name="specialization"
              className="form-select form-select-custom"
              value={formData.specialization}
              onChange={handleChange}
              required
            >
              <option value="">Select Specialization</option>

              <option value="Engine & Transmission Specialist">
                Engine & Transmission Specialist
              </option>

              <option value="Brake & Suspension Specialist">
                Brake & Suspension Specialist
              </option>

              <option value="Auto Electrical & Diagnostics">
                Auto Electrical & Diagnostics
              </option>

              <option value="AC & Climate Control">AC & Climate Control</option>

              <option value="General Maintenance & Diagnostics">
                General Maintenance & Diagnostics
              </option>
            </select>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-6">
              <label className="form-label fw-bold text-dark">
                Experience (Years)
              </label>
              <input
                type="number"
                name="experience"
                className="form-control form-control-custom"
                value={formData.experience}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label fw-bold text-dark">
                Availability Status
              </label>
              <select
                name="availabilityStatus"
                className="form-select form-select-custom"
                value={formData.availabilityStatus}
                onChange={handleChange}
              >
                <option value="AVAILABLE">Available</option>
                <option value="BUSY">Busy</option>
                <option value="OFFLINE">Offline</option>
              </select>
            </div>
          </div>
          <div className="alert alert-info py-2 mb-3">
            <i className="bi bi-info-circle-fill me-2"></i>A secure temporary
            password will be generated automatically and emailed to the
            mechanic.
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
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Creating...
                </>
              ) : (
                <>
                  <i className="bi bi-person-plus me-1"></i>
                  Create Mechanic
                </>
              )}
            </button>
          </div>
        </form>
      </ModalWrapper>

      <ConfirmModal
        show={showDeactivateModal}
        title="Deactivate Mechanic"
        message="Are you sure you want to deactivate this mechanic?"
        confirmText="Yes, Deactivate"
        cancelText="Cancel"
        confirmButtonClass="btn-danger"
        onConfirm={confirmDeactivate}
        onCancel={() => {
          setShowDeactivateModal(false);
          setSelectedMechanic(null);
        }}
      />
    </div>
  );
};

export default ManageMechanics;
