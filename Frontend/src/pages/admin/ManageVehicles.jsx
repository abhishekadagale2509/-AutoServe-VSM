import React, { useEffect, useState } from 'react';
import { vehicleService } from '../../services/vehicleService';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllVehicles();
  }, []);

  const fetchAllVehicles = async () => {
    setLoading(true);
    try {
      const res = await vehicleService.getAllVehicles();
      const data = res.data || res || [];
      setVehicles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load system vehicles', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const term = searchTerm.toLowerCase();
    const brand = (v.brand || v.make || '').toLowerCase();
    const model = (v.model || '').toLowerCase();
    const num = (v.vehicleNumber || v.licensePlate || '').toLowerCase();
    const owner = (v.customer?.name || v.ownerName || '').toLowerCase();
    return brand.includes(term) || model.includes(term) || num.includes(term) || owner.includes(term);
  });

  if (loading) return <LoadingSpinner text="Loading system vehicles..." />;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h3 className="fw-extrabold text-dark m-0">All Customer Vehicles</h3>
          <p className="text-muted small m-0">Complete list of registered vehicles in system database</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card glass-card border-0 p-3 mb-4">
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0">
            <i className="bi bi-search text-muted"></i>
          </span>
          <input
            type="text"
            className="form-control form-control-custom border-start-0"
            placeholder="Search by vehicle make, model, registration plate, or owner name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card glass-card border-0 p-4 shadow-sm">
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-4 text-muted">No vehicles matching search term.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-custom mb-0">
              <thead>
                <tr>
                  <th>Vehicle ID</th>
                  <th>Make & Model</th>
                  <th>Registration Plate</th>
                  <th>Vehicle Type</th>
                  <th>Fuel</th>
                  <th>Year</th>
                  <th>Owner Name</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map((v) => {
                  const vId = v.id || v.vehicleId;
                  return (
                    <tr key={vId}>
                      <td className="fw-bold text-primary">#{vId}</td>
                      <td className="fw-bold text-dark">
                        {v.brand || v.make} {v.model}
                      </td>
                      <td>
                        <span className="font-monospace bg-light border px-2 py-1 rounded fw-semibold">
                          {v.vehicleNumber || v.licensePlate}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-secondary-subtle text-dark border">
                          {v.vehicleType || 'CAR'}
                        </span>
                      </td>
                      <td>{v.fuelType || 'PETROL'}</td>
                      <td>{v.year || 'N/A'}</td>
                      <td className="fw-semibold text-dark">
                        {v.customer?.name || v.ownerName || 'Customer Account'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageVehicles;
