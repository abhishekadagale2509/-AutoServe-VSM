import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { vehicleService } from '../../services/vehicleService';
import { appointmentService } from '../../services/appointmentService';
import { SERVICE_TYPES } from '../../utils/constants';
import LoadingSpinner from '../../components/LoadingSpinner';

const BookAppointment = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: '',
    appointmentDate: new Date().toISOString().split('T')[0],
    serviceType: SERVICE_TYPES[0],
    problemDescription: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await vehicleService.getVehicles();
      const data = res.data || res || [];
      const list = Array.isArray(data) ? data : [];
      setVehicles(list);
      if (list.length > 0) {
        setFormData((prev) => ({ ...prev, vehicleId: list[0].id || list[0].vehicleId }));
      }
    } catch {
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.vehicleId) {
      toast.error('Please select a vehicle or register one first.');
      return;
    }

    if (!formData.problemDescription.trim()) {
      toast.error('Please provide a short description of the problem or service request.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        vehicleId: parseInt(formData.vehicleId, 10),
        appointmentDate: formData.appointmentDate,
        problemDescription: `[${formData.serviceType}] ${formData.problemDescription}`,
      };

      await appointmentService.createAppointment(payload);
      toast.success('Appointment booked successfully!');
      navigate('/customer/appointments');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to book appointment';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Preparing booking form..." />;

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4">
        <h3 className="fw-extrabold text-dark m-0">Book Service Appointment</h3>
        <p className="text-muted small m-0">Schedule a maintenance or repair slot with our expert service team</p>
      </div>

      {vehicles.length === 0 ? (
        <div className="card glass-card border-0 p-5 text-center">
          <i className="bi bi-exclamation-circle text-warning fs-1 mb-2"></i>
          <h5 className="fw-bold text-dark">No Vehicle Registered</h5>
          <p className="text-muted max-w-sm mx-auto mb-4">
            You need to add at least one vehicle to your account before scheduling a service appointment.
          </p>
          <div>
            <Link to="/customer/vehicles" className="btn btn-primary-custom">
              <i className="bi bi-plus-circle me-1"></i> Register Vehicle First
            </Link>
          </div>
        </div>
      ) : (
        <div className="card glass-card border-0 p-4 shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-bold text-dark">Select Vehicle</label>
              <select
                name="vehicleId"
                className="form-select form-select-custom"
                value={formData.vehicleId}
                onChange={handleChange}
                required
              >
                {vehicles.map((v) => (
                  <option key={v.id || v.vehicleId} value={v.id || v.vehicleId}>
                    {v.brand || v.make} {v.model} ({v.vehicleNumber || v.licensePlate})
                  </option>
                ))}
              </select>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label fw-bold text-dark">Preferred Service Date</label>
                <input
                  type="date"
                  name="appointmentDate"
                  className="form-control form-control-custom"
                  value={formData.appointmentDate}
                  min={todayStr}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold text-dark">Service Package / Category</label>
                <select
                  name="serviceType"
                  className="form-select form-select-custom"
                  value={formData.serviceType}
                  onChange={handleChange}
                >
                  {SERVICE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold text-dark">Problem Description & Special Instructions</label>
              <textarea
                name="problemDescription"
                className="form-control form-control-custom"
                rows="4"
                placeholder="Describe any issues, specific noises, mileage concerns, or custom instructions..."
                value={formData.problemDescription}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="d-flex align-items-center justify-content-between pt-3 border-top">
              <Link to="/customer/dashboard" className="btn btn-light px-4">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary-custom px-5 py-2" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Booking...
                  </>
                ) : (
                  <>
                    <i className="bi bi-calendar-check me-1"></i> Confirm Appointment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;
