import React from 'react';

const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toUpperCase();

  let badgeClass = 'badge-pending';
  let icon = 'bi-clock';

  switch (normalized) {
    case 'PENDING':
      badgeClass = 'badge-pending';
      icon = 'bi-hourglass-split';
      break;
    case 'ACCEPTED':
      badgeClass = 'badge-accepted';
      icon = 'bi-check2-circle';
      break;
    case 'IN_PROGRESS':
    case 'INPROGRESS':
      badgeClass = 'badge-progress';
      icon = 'bi-gear-wide-connected';
      break;
    case 'COMPLETED':
      badgeClass = 'badge-completed';
      icon = 'bi-check-all';
      break;
    case 'CANCELLED':
      badgeClass = 'badge-cancelled';
      icon = 'bi-x-circle';
      break;
    case 'PAID':
      badgeClass = 'badge-paid';
      icon = 'bi-currency-rupee';
      break;
    case 'UNPAID':
      badgeClass = 'badge-unpaid';
      icon = 'bi-exclamation-triangle';
      break;
    default:
      badgeClass = 'bg-secondary text-white';
      icon = 'bi-info-circle';
  }

  return (
    <span className={`badge-status ${badgeClass}`}>
      <i className={`bi ${icon}`}></i> {status.replace('_', ' ')}
    </span>
  );
};

export default StatusBadge;
