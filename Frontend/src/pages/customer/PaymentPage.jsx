import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { invoiceService } from "../../services/invoiceService";
import { paymentService } from "../../services/paymentService";
import StatusBadge from "../../components/StatusBadge";
import LoadingSpinner from "../../components/LoadingSpinner";
import ModalWrapper from "../../components/ModalWrapper";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { razorpayService } from "../../services/razorpayService";

const PaymentPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    paymentMethod: "CARD",
    transactionId: "",
  });

  const [searchParams] = useSearchParams();
  const invoiceIdParam = searchParams.get("invoiceId");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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

      if (invoiceIdParam) {
        const found = invData.find(
          (i) => String(i.id || i.invoiceId) === String(invoiceIdParam),
        );

        if (found) {
          const isPaid =
            found.status === "PAID" || found.paymentStatus === "PAID";

          if (!isPaid) {
            openPaymentModal(found);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load invoices or payments", err);
    } finally {
      setLoading(false);
    }
  };

  const openPaymentModal = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentForm({
      paymentMethod: "CARD",
      transactionId: `TXN${Date.now().toString().slice(-8)}`,
    });
    setIsModalOpen(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!selectedInvoice) return;

    setProcessing(true);

    try {
      // Step 1 - Create Razorpay Order
      const orderResponse = await razorpayService.createOrder(
        selectedInvoice.invoiceId || selectedInvoice.id,
      );

      const order = orderResponse.data;

      // Step 2 - Configure Razorpay Checkout
      const options = {
        key: order.key,

        amount: order.amount * 100,

        currency: order.currency,

        name: "AutoServe",

        description: `Invoice #${order.invoiceId}`,

        order_id: order.orderId,

        handler: async function (response) {
          console.log("Payment Success:", response);
          try {
            // Save payment in your backend
            await paymentService.processPayment({
              invoiceId: order.invoiceId,

              paymentMethod: paymentForm.paymentMethod,

              transactionId: response.razorpay_payment_id,
            });

            toast.success("Payment Successful!");

            setIsModalOpen(false);

            fetchData();
          } catch (err) {
            toast.error("Payment verification failed.");
          }
        },

        modal: {
          ondismiss: function () {
            toast.info("Payment cancelled.");
          },
        },

        prefill: {
          name: "",

          email: "",

          contact: "",
        },

        theme: {
          color: "#0d6efd",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.log(response.error);

        toast.error(response.error.description);
      });

      razorpay.open();
    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.message || "Unable to start payment.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading)
    return <LoadingSpinner text="Loading invoices and payment history..." />;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h3 className="fw-extrabold text-dark m-0">
            Invoices & Payment History
          </h3>
          <p className="text-muted small m-0">
            View billing statements and complete service payments online
          </p>
        </div>
      </div>

      <div className="row g-4">
        {/* Invoices List */}
        <div className="col-12 col-lg-8">
          <div className="card glass-card border-0 p-4 shadow-sm">
            <h5 className="fw-bold text-dark mb-3">
              <i className="bi bi-file-earmark-spreadsheet me-2 text-primary"></i>
              Service Invoices
            </h5>

            {invoices.length === 0 ? (
              <div className="text-center py-4 bg-light rounded-3">
                <i className="bi bi-receipt fs-1 text-muted"></i>
                <p className="text-muted mt-2">No invoices generated yet.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-custom">
                  <thead>
                    <tr>
                      <th>Invoice ID</th>
                      <th>Date</th>
                      <th>Job Card</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => {
                      const isPaid =
                        inv.status === "PAID" || inv.paymentStatus === "PAID";
                      return (
                        <tr key={inv.id || inv.invoiceId}>
                          <td className="fw-bold text-primary">
                            #{inv.id || inv.invoiceId}
                          </td>
                          <td>
                            {formatDate(
                              inv.createdAt || inv.invoiceDate || inv.date,
                            )}
                          </td>
                          <td>
                            <Link
                              to={`/customer/jobcard/${inv.jobCardId || inv.jobId}`}
                              className="text-decoration-none fw-semibold"
                            >
                              Job #{inv.jobCardId || inv.jobId}
                            </Link>
                          </td>
                          <td className="fw-bold text-dark">
                            {formatCurrency(inv.totalAmount || inv.amount)}
                          </td>
                          <td>
                            <StatusBadge status={isPaid ? "PAID" : "UNPAID"} />
                          </td>
                          <td className="text-end">
                            <div className="d-flex justify-content-end gap-2">
                              <Link
                                to={`/customer/invoice/${inv.invoiceId}`}
                                className="btn btn-sm btn-outline-primary"
                              >
                                <i className="bi bi-eye me-1"></i>
                                View
                              </Link>

                              {isPaid ? (
                                <button
                                  className="btn btn-sm btn-outline-success"
                                  disabled
                                >
                                  <i className="bi bi-check-circle me-1"></i>
                                  Paid
                                </button>
                              ) : (
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() => openPaymentModal(inv)}
                                >
                                  <i className="bi bi-credit-card me-1"></i>
                                  Pay Now
                                </button>
                              )}
                            </div>
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

        {/* Payments Summary Card */}
        <div className="col-12 col-lg-4">
          <div className="card glass-card border-0 p-4 shadow-sm mb-4">
            <h5 className="fw-bold text-dark mb-3">
              <i className="bi bi-clock-history me-2 text-primary"></i>Recent
              Transactions
            </h5>

            {payments.length === 0 ? (
              <p className="text-muted small">
                No payment transactions recorded yet.
              </p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {payments.slice(0, 5).map((pay) => (
                  <div
                    key={pay.id || pay.paymentId}
                    className="p-3 bg-light rounded-3 border"
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-dark">
                        {formatCurrency(pay.amount)}
                      </span>
                      <span className="badge bg-success-subtle text-success border px-2 py-1">
                        {pay.paymentMethod || "ONLINE"}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center text-muted small">
                      <span>Txn: {pay.transactionId || "N/A"}</span>
                      <span>
                        {formatDate(pay.createdAt || pay.paymentDate)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Processing Modal */}
      <ModalWrapper
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Complete Payment for Invoice #${selectedInvoice?.id || selectedInvoice?.invoiceId}`}
      >
        {selectedInvoice && (
          <form onSubmit={handlePaymentSubmit}>
            <div className="bg-light p-3 rounded-3 border mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">Total Payable Amount:</span>
                <span className="fs-4 fw-extrabold text-primary">
                  {formatCurrency(
                    selectedInvoice.totalAmount || selectedInvoice.amount,
                  )}
                </span>
              </div>
              <small className="text-muted">
                Includes service labor, parts breakdown, and applicable taxes.
              </small>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold text-dark">
                Payment Method
              </label>
              <select
                className="form-select form-select-custom"
                value={paymentForm.paymentMethod}
                onChange={(e) =>
                  setPaymentForm({
                    ...paymentForm,
                    paymentMethod: e.target.value,
                  })
                }
              >
                <option value="CARD">Credit / Debit Card</option>
                <option value="UPI">UPI / GooglePay / PhonePe</option>
                <option value="NET_BANKING">Net Banking</option>
                <option value="CASH">Cash on Delivery / Service Desk</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold text-dark">
                Transaction / Reference ID
              </label>
              <input
                type="text"
                className="form-control form-control-custom font-monospace"
                value={paymentForm.transactionId}
                onChange={(e) =>
                  setPaymentForm({
                    ...paymentForm,
                    transactionId: e.target.value,
                  })
                }
                required
              />
              <small className="text-muted">
                Generated reference number for payment tracking.
              </small>
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
                className="btn btn-success px-4 py-2 fw-bold"
                disabled={processing}
              >
                {processing ? "Processing..." : "Confirm & Complete Payment"}
              </button>
            </div>
          </form>
        )}
      </ModalWrapper>
    </div>
  );
};

export default PaymentPage;
