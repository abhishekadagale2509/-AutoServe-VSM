import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "../components/Layout";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import AddVehicle from "../pages/AddVehicle";
import MyVehicles from "../pages/MyVehicles";
import BookAppointment from "../pages/BookAppointment";
import MyAppointments from "../pages/MyAppointments";
import AdminDashboard from "../pages/admin/AdminDashboard";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" replace />;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/vehicles"
          element={
            <PrivateRoute>
              <Layout>
                <MyVehicles />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/vehicles/add"
          element={
            <PrivateRoute>
              <Layout>
                <AddVehicle />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <PrivateRoute>
              <Layout>
                <MyAppointments />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/appointments/book"
          element={
            <PrivateRoute>
              <Layout>
                <BookAppointment />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <AdminDashboard />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
