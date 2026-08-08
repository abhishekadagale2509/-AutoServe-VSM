import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import { ROLES } from "./utils/constants";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ChangePassword from "./pages/auth/ChangePassword";
import FirstLoginRoute from "./components/routes/FirstLoginRoute";

// Customer Pages
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import VehicleManagement from "./pages/customer/VehicleManagement";
import BookAppointment from "./pages/customer/BookAppointment";
import MyAppointments from "./pages/customer/MyAppointments";
import JobCardView from "./pages/customer/JobCardView";
import PaymentPage from "./pages/customer/PaymentPage";
import InvoiceDetails from "./pages/customer/InvoiceDetails";
import Profile from "./pages/customer/Profile";

// Mechanic Pages
import MechanicDashboard from "./pages/mechanic/MechanicDashboard";
import MechanicJobCards from "./pages/mechanic/MechanicJobCards";
import JobCardDetails from "./pages/mechanic/JobCardDetails";
import MechanicProfile from "./pages/mechanic/MechanicProfile";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageAppointments from "./pages/admin/ManageAppointments";
import ManageMechanics from "./pages/admin/ManageMechanics";
import ManageVehicles from "./pages/admin/ManageVehicles";
import ManagePayments from "./pages/admin/ManagePayments";
import AdminProfile from "./pages/admin/AdminProfile";

// Root Redirect Helper
const RootRedirect = () => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (role === ROLES.ADMIN) return <Navigate to="/admin/dashboard" replace />;
  if (role === ROLES.MECHANIC)
    return <Navigate to="/mechanic/dashboard" replace />;
  return <Navigate to="/customer/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
        />
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Root Redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Protected Routes inside Main Layout */}
          <Route element={<Layout />}>
            {/* Customer Routes */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.CUSTOMER]} />}>
              <Route
                path="/customer/dashboard"
                element={<CustomerDashboard />}
              />
              <Route
                path="/customer/vehicles"
                element={<VehicleManagement />}
              />
              <Route
                path="/customer/book-appointment"
                element={<BookAppointment />}
              />
              <Route
                path="/customer/appointments"
                element={<MyAppointments />}
              />
              <Route
                path="/customer/jobcard/:jobId"
                element={<JobCardView />}
              />

              <Route
                path="/customer/invoice/:jobId"
                element={<InvoiceDetails />}
              />
              <Route path="/customer/payments" element={<PaymentPage />} />

              <Route path="/customer/profile" element={<Profile />} />
            </Route>

            {/* Mechanic Routes */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.MECHANIC]} />}>
              <Route
                path="/mechanic/dashboard"
                element={
                  <FirstLoginRoute>
                    <MechanicDashboard />
                  </FirstLoginRoute>
                }
              />

              <Route
                path="/mechanic/jobcards"
                element={
                  <FirstLoginRoute>
                    <MechanicJobCards />
                  </FirstLoginRoute>
                }
              />

              <Route
                path="/mechanic/jobcards/create/:appointmentId"
                element={
                  <FirstLoginRoute>
                    <MechanicJobCards />
                  </FirstLoginRoute>
                }
              />

              <Route
                path="/mechanic/jobcards/:jobId"
                element={
                  <FirstLoginRoute>
                    <JobCardDetails />
                  </FirstLoginRoute>
                }
              />

              <Route
                path="/mechanic/profile"
                element={
                  <FirstLoginRoute>
                    <MechanicProfile />
                  </FirstLoginRoute>
                }
              />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route
                path="/admin/appointments"
                element={<ManageAppointments />}
              />
              <Route path="/admin/mechanics" element={<ManageMechanics />} />
              <Route path="/admin/vehicles" element={<ManageVehicles />} />
              <Route path="/admin/payments" element={<ManagePayments />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
