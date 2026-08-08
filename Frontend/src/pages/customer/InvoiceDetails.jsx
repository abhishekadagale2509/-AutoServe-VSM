import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { invoiceService } from "../../services/invoiceService";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusBadge from "../../components/StatusBadge";
import { formatCurrency, formatDate } from "../../utils/formatters";

const InvoiceDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoice();
  }, []);

  const fetchInvoice = async () => {
    try {
      const response = await invoiceService.getInvoiceByJobId(jobId);

      const data = response.data || response;

      setInvoice(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load invoice.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await invoiceService.downloadInvoicePdf(
        invoice.invoiceId,
      );

      const blob = response.data;

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `Invoice_${invoice.invoiceId}.pdf`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      toast.success("Invoice downloaded successfully.");
    } catch (err) {
      console.log(err);
      console.error(err);
      console.log("Response:", response);
      console.log("Status:", response.status);
      console.log("Headers:", response.headers);
      console.log("Blob:", response.data);
      console.log("Blob instanceof Blob:", response.data instanceof Blob);
      toast.error("Failed to download invoice.");
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading Invoice..." />;
  }

  if (!invoice) {
    return <div className="alert alert-warning">Invoice not found.</div>;
  }

  return (
    <div className="container py-4">
      <div className="card shadow border-0">
        <div className="card-header bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="mb-0">AutoServe VSM</h3>
              <small>Service Invoice</small>
            </div>

            <div className="text-end">
              <h5 className="mb-0">
                Invoice #{invoice.invoiceId || invoice.id}
              </h5>

              <small>
                {formatDate(invoice.createdAt || invoice.invoiceDate)}
              </small>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-6">
              <h6 className="fw-bold">Vehicle</h6>

              <p className="mb-1">
                <strong>
                  {invoice.vehicleBrand} {invoice.vehicleModel}
                </strong>
              </p>

              <p className="text-muted mb-0">{invoice.vehicleNumber}</p>

              <h6 className="fw-bold mt-4">Customer</h6>

              <p className="mb-0">{invoice.customerName}</p>
            </div>

            <div className="col-md-6">
              <h6 className="fw-bold">Mechanic</h6>

              <p className="mb-0">{invoice.mechanicName}</p>
            </div>
          </div>

          <table className="table">
            <tbody>
              {invoice.jobCardParts?.map((part) => (
                <tr key={part.jobCardPartId}>
                  <td>
                    {part.partName}
                    <br />
                    <small className="text-muted">Qty : {part.quantity}</small>
                  </td>

                  <td className="text-end">{formatCurrency(part.subtotal)}</td>
                </tr>
              ))}
              <tr>
                <td>Labour Cost</td>

                <td className="text-end">
                  {formatCurrency(invoice.laborCost)}
                </td>
              </tr>

              <tr>
                <td>Spare Parts</td>

                <td className="text-end">
                  {formatCurrency(invoice.partsTotal)}
                </td>
              </tr>
              <tr>
                <td>Subtotal</td>

                <td className="text-end">{formatCurrency(invoice.subTotal)}</td>
              </tr>
              <tr>
                <td>GST ({invoice.gstPercentage}%)</td>

                <td className="text-end">
                  {formatCurrency(invoice.gstAmount)}
                </td>
              </tr>

              <tr className="table-primary fw-bold">
                <td>Total</td>

                <td className="text-end">
                  {formatCurrency(invoice.totalAmount)}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="d-flex align-items-center">
              <StatusBadge status={invoice.status} />

              <span className="ms-3 fw-semibold">
                {invoice.status === "PAYMENT_PENDING"
                  ? "Awaiting Payment"
                  : "Paid"}
              </span>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-primary"
                onClick={handleDownload}
                disabled={
                  invoice.status !== "PAID" && invoice.paymentStatus !== "PAID"
                }
                title={
                  invoice.status !== "PAID" && invoice.paymentStatus !== "PAID"
                    ? "Please complete payment before downloading the invoice."
                    : "Download Invoice PDF"
                }
              >
                <i className="bi bi-download me-2"></i>
                Download PDF
              </button>

              {invoice.status === "PAID" || invoice.paymentStatus === "PAID" ? (
                <button className="btn btn-success" disabled>
                  <i className="bi bi-check-circle me-2"></i>
                  Paid
                </button>
              ) : (
                <button
                  className="btn btn-success"
                  onClick={() =>
                    navigate(
                      `/customer/payments?invoiceId=${invoice.invoiceId}`,
                    )
                  }
                >
                  <i className="bi bi-credit-card me-2"></i>
                  Pay Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
