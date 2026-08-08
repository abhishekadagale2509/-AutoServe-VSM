import React, { useEffect, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { sparePartService } from "../../services/sparePartService";
import { jobCardPartService } from "../../services/jobCardPartService";
import { toast } from "react-toastify";

const ManagePartsDrawer = ({ show, onHide, jobId, onPartAdded }) => {
  const [parts, setParts] = useState([]);

  const [selectedPart, setSelectedPart] = useState("");

  const [quantity, setQuantity] = useState(1);

  const [jobCardParts, setJobCardParts] = useState([]);

  useEffect(() => {
    if (show) {
      loadParts();

      if (jobId) {
        loadJobCardParts();
      }
    }
  }, [show, jobId]);

  const loadParts = async () => {
    try {
      const data = await sparePartService.getAllParts();

      setParts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPart = async () => {
    if (!selectedPart) {
      toast.error("Please select a spare part.");

      return;
    }

    try {
      await jobCardPartService.addPart({
        jobId,

        partId: Number(selectedPart),

        quantity: Number(quantity),
      });

      toast.success("Spare Part Added.");

      setSelectedPart("");

      setQuantity(1);

      loadJobCardParts();
      if (onPartAdded) {
        onPartAdded();
      }
    } catch (err) {
      console.error(err);

      toast.error("Failed to add spare part.");
    }
  };

  const loadJobCardParts = async () => {
    try {
      const data = await jobCardPartService.getParts(jobId);

      setJobCardParts(data.data || data || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Offcanvas show={show} onHide={onHide} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Manage Spare Parts</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>
        <div className="mb-3">
          <label className="form-label fw-semibold">Spare Part</label>

          <select
            className="form-select"
            value={selectedPart}
            onChange={(e) => setSelectedPart(e.target.value)}
          >
            <option value="">Select Spare Part</option>

            {parts.map((part) => (
              <option key={part.partId} value={part.partId}>
                {part.partName} - ₹{part.unitPrice}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Quantity</label>

          <input
            type="number"
            min="1"
            className="form-control"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <button className="btn btn-primary w-100 mb-4" onClick={handleAddPart}>
          Add Spare Part
        </button>

        <hr />

        <h6 className="fw-bold mb-3">Attached Parts</h6>

        {jobCardParts.length === 0 ? (
          <p className="text-muted">No spare parts added.</p>
        ) : (
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Part</th>

                <th>Qty</th>

                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {jobCardParts.map((part) => (
                <tr key={part.jobCardPartId}>
                  <td>{part.partName}</td>

                  <td>{part.quantity}</td>

                  <td>₹{part.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ManagePartsDrawer;
