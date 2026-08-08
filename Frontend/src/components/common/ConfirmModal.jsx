import React from "react";

const ConfirmModal = ({
  show,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  confirmButtonClass = "btn-danger",
}) => {
  if (!show) {
    return null;
  }

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header">
              <h5 className="modal-title fw-bold">{title}</h5>

              <button
                type="button"
                className="btn-close"
                onClick={onCancel}
              ></button>
            </div>

            <div className="modal-body">
              <p className="mb-0 text-muted">{message}</p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
              >
                {cancelText}
              </button>

              <button
                type="button"
                className={`btn ${confirmButtonClass}`}
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
