import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';

const Sidebar = ({ isOpen, onClose }) => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const customerLinks = [
    { to: '/customer/dashboard', label: 'Dashboard', icon: 'bi-grid-1x2-fill' },
    { to: '/customer/vehicles', label: 'My Vehicles', icon: 'bi-car-front-fill' },
    { to: '/customer/book-appointment', label: 'Book Appointment', icon: 'bi-calendar-plus-fill' },
    { to: '/customer/appointments', label: 'My Appointments', icon: 'bi-calendar-check-fill' },
    { to: '/customer/payments', label: 'Invoices & Payments', icon: 'bi-receipt-cutoff' },
  ];

  const mechanicLinks = [
    { to: '/mechanic/dashboard', label: 'Mechanic Dashboard', icon: 'bi-speedometer2' },
    { to: '/mechanic/jobcards', label: 'Assigned Job Cards', icon: 'bi-tools' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Admin Dashboard', icon: 'bi-bar-chart-line-fill' },
    { to: '/admin/appointments', label: 'All Appointments', icon: 'bi-calendar3' },
    { to: '/admin/mechanics', label: 'Manage Mechanics', icon: 'bi-people-fill' },
    { to: '/admin/vehicles', label: 'Customer Vehicles', icon: 'bi-car-front' },
    { to: '/admin/payments', label: 'Billing & Payments', icon: 'bi-wallet2' },
  ];

  let navLinks = customerLinks;
  if (role === ROLES.ADMIN) navLinks = adminLinks;
  if (role === ROLES.MECHANIC) navLinks = mechanicLinks;

  return (
    <>
      {/* Offcanvas Overlay for Mobile */}
      {isOpen && (
        <div
          className="d-lg-none position-fixed top-0 start-0 w-100 h-100"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1025 }}
          onClick={onClose}
        ></div>
      )}

      <aside className={`sidebar-custom ${isOpen ? 'show' : ''}`}>
        <div className="sidebar-header">
          <NavLink to="/" className="sidebar-brand">
            <div className="bg-primary text-white rounded-3 p-2 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
              <i className="bi bi-wrench-adjustable fs-5"></i>
            </div>
            <span>AutoServe</span>
          </NavLink>
          <button className="btn btn-link text-white-50 d-lg-none" onClick={onClose}>
            <i className="bi bi-x-lg fs-5"></i>
          </button>
        </div>

        <nav className="sidebar-menu">
          <div className="text-uppercase px-3 mb-2 small text-muted fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
            Menu Navigation
          </div>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => onClose && onClose()}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <i className={`bi ${link.icon} fs-5`}></i>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
