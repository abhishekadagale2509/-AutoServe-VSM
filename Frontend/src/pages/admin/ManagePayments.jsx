import React, { useEffect, useState } from 'react';
import { invoiceService } from '../../services/invoiceService';
import { paymentService } from '../../services/paymentService';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';

const ManagePayments = () => {
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    setLoading(true);
    try {
      const [invRes, payRes] = await Promise.all([
        invoiceService.getAllInvoices().catch(() => ({ data: [] })),
        paymentService.getAllPayments().catch(() => ({ data: [] })),
      ]);

      const invData = invRes.data || invRes || [];
      const payData = payRes.data || payRes || [];

      setInvoices(Array.isArray(invData) ? invData : []);
      setPayments(Array.isArray(payData) ? payData : []);
    } catch (err) {
      console.error('Failed to load billing records', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Fetching billing audit logs..." />;

  const totalCollected = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h3 className="fw-extrabold text-dark m-0">Billing & Payment Records</h3>
          <p className="text-muted small m-0">Audit system invoices, revenue statements, and transaction references</p>
        </div>
        <div className="bg-success-subtle border border-success px-4 py-2 rounded-3 text-success">
          <span className="small d-block fw-semibold text-uppercase">Total System Collections</span>
          <span className="fs-4 fw-extrabold">{formatCurrency(totalCollected)}</span>
        </div>
      </div>

      <div className="row g-4">
        {/* Invoices List */}
        <div className="col-12 col-lg-7">
          <div className="card glass-card border-0 p-4 shadow-sm">
            <h5 className="fw-bold text-dark mb-3">
              <i className="bi bi-receipt me-2 text-primary"></i>All Invoices
            </h5>

            {invoices.length === 0 ? (
              <p className="text-muted text-center py-4">No invoices found in database.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-custom">
                  <thead>
                    <tr>
                      <th>Invoice ID</th>
                      <th>Job Card</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => {
                      const isPaid = inv.status === 'PAID' || inv.paymentStatus === 'PAID';
                      return (
                        <tr key={inv.id || inv.invoiceId}>
                          <td className="fw-bold text-primary">#{inv.id || inv.invoiceId}</td>
                          <td className="fw-semibold text-dark">Job #{inv.jobCardId || inv.jobId}</td>
                          <td className="fw-bold text-dark">{formatCurrency(inv.totalAmount || inv.amount)}</td>
                          <td>
                            <StatusBadge status={isPaid ? 'PAID' : 'UNPAID'} />
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

        {/* Transactions Audit Trail */}
        <div className="col-12 col-lg-5">
          <div className="card glass-card border-0 p-4 shadow-sm">
            <h5 className="fw-bold text-dark mb-3">
              <i className="bi bi-shield-check me-2 text-success"></i>Transaction Audit Logs
            </h5>

            {payments.length === 0 ? (
              <p className="text-muted text-center py-4">No transaction logs available.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {payments.map((p) => (
                  <div key={p.id || p.paymentId} className="p-3 bg-light rounded-3 border">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-dark">{formatCurrency(p.amount)}</span>
                      <span className="badge bg-success-subtle text-success border">
                        {p.paymentMethod || 'COMPLETED'}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between text-muted small">
                      <span>Txn: <strong className="font-monospace text-dark">{p.transactionId || 'N/A'}</strong></span>
                      <span>{formatDate(p.createdAt || p.paymentDate)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePayments;
