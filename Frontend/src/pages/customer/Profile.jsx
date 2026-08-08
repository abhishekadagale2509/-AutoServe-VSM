import React, { useEffect, useState } from "react";
import { profileService } from "../../services/profileService";
import LoadingSpinner from "../../components/LoadingSpinner";
import { toast } from "react-toastify";
import { formatDate } from "../../utils/formatters";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const [editing, setEditing] = useState(false);

  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const response = await profileService.getProfile();

      const data = response.data || response;

      setProfile(data);

      setFormData({
        name: data.name,
        phone: data.phone,
      });
    } catch (err) {
      console.error(err);

      toast.error("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await profileService.updateProfile(formData);

      const data = response.data || response;

      setProfile(data);

      setEditing(false);

      setFormData({
        name: data.name,
        phone: data.phone,
      });

      toast.success("Profile updated successfully.");
    } catch (err) {
      console.error(err);

      toast.error("Failed to update profile.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">My Profile</h3>

      <div className="card glass-card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="row align-items-center">
            <div className="col-md-auto text-center mb-3 mb-md-0">
              <div
                className="rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center mx-auto"
                style={{
                  width: "90px",
                  height: "90px",
                }}
              >
                <span
                  className="fw-bold text-primary"
                  style={{
                    fontSize: "2rem",
                  }}
                >
                  {profile.name
                    ?.split(" ")
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()}
                </span>
              </div>
            </div>

            <div className="col">
              <h3 className="fw-bold mb-1">{profile.name}</h3>

              <div className="text-muted mb-2">
                <i className="bi bi-envelope me-2"></i>

                {profile.email}
              </div>

              <div className="text-muted mb-2">
                <i className="bi bi-telephone me-2"></i>

                {profile.phone}
              </div>

              <div className="badge bg-primary-subtle text-primary px-3 py-2">
                Customer Since {formatDate(profile.memberSince)}
              </div>
            </div>

            <div className="col-auto">
              {!editing ? (
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setEditing(true)}
                >
                  <i className="bi bi-pencil-square me-2"></i>
                  Edit Profile
                </button>
              ) : (
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setEditing(false);

                    setFormData({
                      name: profile.name,
                      phone: profile.phone,
                    });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="text-primary fs-2 mb-2">
                <i className="bi bi-car-front-fill"></i>
              </div>

              <div className="text-muted">Registered Vehicles</div>

              <h2 className="fw-bold">{profile.totalVehicles}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="text-warning fs-2 mb-2">
                <i className="bi bi-calendar-check-fill"></i>
              </div>

              <div className="text-muted">Appointments</div>

              <h2 className="fw-bold">{profile.totalAppointments}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="text-success fs-2 mb-2">
                <i className="bi bi-cash-stack"></i>
              </div>

              <div className="text-muted">Total Spent</div>

              <h2 className="fw-bold text-success">₹{profile.totalSpent}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="text-info fs-2 mb-2">
                <i className="bi bi-shield-check"></i>
              </div>

              <div className="text-muted">Account Status</div>

              <h5
                className={`fw-bold ${
                  profile.accountStatus === "ACTIVE"
                    ? "text-success"
                    : "text-danger"
                }`}
              >
                {profile.accountStatus}
              </h5>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-4">Personal Information</h5>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Full Name</label>

              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>

              <input
                type="email"
                className="form-control"
                value={profile.email}
                disabled
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone Number</label>

              <input
                type="text"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
          </div>

          {editing && (
            <div className="mt-4 text-end">
              <button className="btn btn-primary px-4" onClick={handleSave}>
                <i className="bi bi-check-circle me-2"></i>
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="card border-0 shadow-sm mt-4">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="fw-bold mb-2">Security</h5>

              <p className="text-muted mb-0">
                Keep your account secure by updating your password regularly.
              </p>
            </div>

            <button
              className="btn btn-outline-danger"
              onClick={() => navigate("/change-password")}
            >
              <i className="bi bi-shield-lock me-2"></i>
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
