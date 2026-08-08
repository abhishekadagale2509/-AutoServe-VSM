import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { jobCardService } from "../../services/jobCardService";
import { invoiceService } from "../../services/invoiceService";
import StatusBadge from "../../components/StatusBadge";
import LoadingSpinner from "../../components/LoadingSpinner";
import { formatCurrency, formatDate } from "../../utils/formatters";

const JobCardView = () => {
  const { jobId } = useParams();
  const [jobCard, setJobCard] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const res = await jobCardService.getJobCardById(jobId);
      const data = res.data || res;
      setJobCard(data);

      try {
        const invRes = await invoiceService.getInvoiceByJobId(jobId);
        setInvoice(invRes.data || invRes);
      } catch {
        setInvoice(null);
      }
    } catch (err) {
      console.error("Error fetching job card details:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Fetching job card details..." />;

  if (!jobCard) {
    return (
      <div className="card glass-card border-0 p-5 text-center">
        <i className="bi bi-file-earmark-x fs-1 text-danger mb-2"></i>
        <h5 className="fw-bold">Job Card Not Found</h5>
        <p className="text-muted">
          The requested job card #{jobId} could not be retrieved.
        </p>
        <Link
          to="/customer/appointments"
          className="btn btn-primary-custom btn-sm mt-3"
        >
          Back to Appointments
        </Link>
      </div>
    );
  }

  const parts = jobCard.jobCardParts || [];
  const laborCharge = jobCard.laborCharges || jobCard.laborCost || 0;
  const partsTotal = jobCard.partsTotal || 0;
  const grandTotal = jobCard.grandTotal || 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <Link
            to="/customer/appointments"
            className="text-decoration-none text-muted small fw-semibold"
          >
            <i className="bi bi-arrow-left me-1"></i> Back to Appointments
          </Link>
          <h3 className="fw-extrabold text-dark m-0 mt-1">
            Service Job Card #{jobCard.jobId || jobId}
          </h3>
        </div>

        <div className="d-flex align-items-center gap-2">
          <StatusBadge status={jobCard.status || "IN_PROGRESS"} />
          {invoice && (
            <Link
              to={`/customer/payments?invoiceId=${invoice.invoiceId}`}
              className="btn btn-success btn-sm ms-2"
            >
              <i className="bi bi-credit-card me-1"></i> View Invoice & Pay
            </Link>
          )}
        </div>
      </div>

      {/* Main Job Card Overview */}
      <div className="card glass-card border-0 p-4 mb-4 shadow-sm">
        <div className="row g-4">
          <div className="col-md-6 border-end">
            <h6 className="fw-bold text-uppercase text-muted small mb-3">
              Vehicle Details
            </h6>
            <div className="mb-2">
              <span className="text-muted small d-block">
                Vehicle Make & Model
              </span>
              <span className="fw-bold text-dark fs-6">
                {jobCard.vehicle?.make || jobCard.vehicleBrand}{" "}
                {jobCard.vehicle?.model || jobCard.vehicleModel}
              </span>
            </div>
            <div>
              <span className="text-muted small d-block">
                License Plate Number
              </span>
              <span className="font-monospace fw-bold text-dark">
                {jobCard.vehicle?.licensePlate ||
                  jobCard.vehicleNumber ||
                  "N/A"}
              </span>
            </div>
          </div>

          <div className="col-md-6">
            <h6 className="fw-bold text-uppercase text-muted small mb-3">
              Mechanic & Date
            </h6>
            <div className="mb-2">
              <span className="text-muted small d-block">
                Assigned Technician
              </span>
              <span className="fw-bold text-dark">
                <i className="bi bi-tools text-primary me-1"></i>
                {jobCard.mechanic?.name ||
                  jobCard.mechanicName ||
                  "Service Team"}
              </span>
            </div>
            <div>
              <span className="text-muted small d-block">
                Job Card Created On
              </span>
              <span className="fw-semibold text-dark">
                {formatDate(jobCard.createdAt || jobCard.date)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Service Details */}
      <div className="card glass-card border-0 p-4 mb-4 shadow-sm">
        <h5 className="fw-bold text-dark mb-4">
          <i className="bi bi-clipboard-check me-2 text-primary"></i>
          Service Details
        </h5>

        <div className="row g-4">
          {/* Inspection Notes */}
          <div className="col-md-12">
            <div className="border rounded-3 p-3 h-100">
              <h6 className="fw-bold text-muted small text-uppercase mb-2">
                <i className="bi bi-search me-2 text-primary"></i>
                Inspection Notes
              </h6>

              <p className="mb-0 text-dark">
                {jobCard.inspectionNotes || "No inspection notes added."}
              </p>
            </div>
          </div>

          {/* Work Done */}
          <div className="col-md-12">
            <div className="border rounded-3 p-3 h-100">
              <h6 className="fw-bold text-muted small text-uppercase mb-2">
                <i className="bi bi-wrench-adjustable me-2 text-primary"></i>
                Work Done
              </h6>

              <p className="mb-0 text-dark">
                {jobCard.workDone || "No work details added."}
              </p>
            </div>
          </div>

          {/* Mechanic Remarks */}
          <div className="col-md-12">
            <div className="border rounded-3 p-3 h-100">
              <h6 className="fw-bold text-muted small text-uppercase mb-2">
                <i className="bi bi-chat-left-text me-2 text-primary"></i>
                Mechanic Remarks
              </h6>

              <p className="mb-0 text-dark">
                {jobCard.mechanicRemarks || "No mechanic remarks added."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Replaced Parts & Labor Charges Breakdown */}
      <div className="card glass-card border-0 p-4 shadow-sm mb-4">
        <h5 className="fw-bold text-dark mb-3">
          <i className="bi bi-wrench-adjustable me-2 text-primary"></i>Service
          Costs & Replaced Parts
        </h5>

        <div className="table-responsive">
          <table className="table table-custom">
            <thead>
              <tr>
                <th>Item / Part Description</th>
                <th className="text-center">Qty</th>
                <th className="text-end">Unit Cost</th>
                <th className="text-end">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="3" className="fw-semibold text-dark">
                  Labor & Service Technician Charge
                </td>
                <td className="text-end fw-semibold">
                  {formatCurrency(laborCharge)}
                </td>
              </tr>

              {parts.length > 0 &&
                parts.map((p, idx) => (
                  <tr key={idx}>
                    <td>
                      <span className="fw-semibold text-dark">
                        {p.partName}
                      </span>
                      {p.partNumber && (
                        <small className="d-block text-muted">
                          PN: {p.partNumber}
                        </small>
                      )}
                    </td>
                    <td className="text-center">{p.quantity || 1}</td>
                    <td className="text-end">{formatCurrency(p.unitPrice)}</td>
                    <td className="text-end fw-semibold">
                      {formatCurrency(p.subtotal)}
                    </td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr className="table-light">
                <th colSpan="3" className="text-end fs-6">
                  Grand Total Estimate:
                </th>
                <th className="text-end fs-5 text-primary fw-extrabold">
                  {formatCurrency(grandTotal)}
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JobCardView;
