import React from "react";
import Badge from "../ui/Badge";
import { formatDate, formatCurrency } from "../../utils/helpers";
import { navigate } from "../../app/routes";

export default function InvoiceItem({ invoice }) {
  const { id, clientName, paymentDue, total, status } = invoice;

  function handleClick() {
    navigate(`/invoices/${id}`);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }

  return (
    <li>
      <button
        className="invoice-item"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={`Invoice ${id} for ${clientName}, ${formatCurrency(total)}, ${status}`}
      >
        <span className="invoice-item__id">
          <span className="invoice-item__hash" aria-hidden="true">#</span>
          {id}
        </span>
        <span className="invoice-item__date">Due {formatDate(paymentDue)}</span>
        <span className="invoice-item__name">{clientName}</span>
        <span className="invoice-item__amount">{formatCurrency(total)}</span>
        <span className="invoice-item__badge">
          <Badge status={status} />
        </span>
        <span className="invoice-item__chevron" aria-hidden="true">›</span>
      </button>
    </li>
  );
}