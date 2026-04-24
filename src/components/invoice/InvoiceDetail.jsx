import React from "react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { formatDate, formatCurrency } from "../../utils/helpers";
import { navigate } from "../../app/routes";

function MetaBlock({ label, value, address }) {
  return (
    <div className="meta-block">
      <p className="meta-block__label">{label}</p>
      {value && <strong className="meta-block__value">{value}</strong>}
      {address && (
        <address className="meta-block__address">
          {address.street}<br />
          {address.city}<br />
          {address.postCode}<br />
          {address.country}
        </address>
      )}
    </div>
  );
}

export default function InvoiceDetail({ invoice, onEdit, onDelete, onMarkPaid }) {
  return (
    <>
      {/* Back */}
      <button
        className="btn-back"
        onClick={() => navigate("/")}
        aria-label="Go back to invoice list"
      >
        <svg width="7" height="10" viewBox="0 0 7 10" fill="none" aria-hidden="true">
          <path d="M6 1L1 5l5 4" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Go back</span>
      </button>

      {/* Status bar */}
      <div className="detail-topbar">
        <div className="detail-topbar__left">
          <span className="detail-topbar__label">Status</span>
          <Badge status={invoice.status} />
        </div>
        <div className="detail-topbar__right">
          <Button variant="edit" onClick={onEdit}>Edit</Button>
          <Button variant="delete" onClick={onDelete}>Delete</Button>
          {invoice.status !== "paid" && (
            <Button variant="paid" onClick={onMarkPaid}>Mark as Paid</Button>
          )}
        </div>
      </div>

      {/* Invoice body */}
      <article className="invoice-body" aria-label={`Invoice ${invoice.id}`}>
        <div className="invoice-body__inner">
          {/* Header row */}
          <div className="invoice-body__header">
            <div>
              <h2 className="invoice-body__id">
                <span aria-hidden="true">#</span>{invoice.id}
              </h2>
              <p className="invoice-body__desc">{invoice.description}</p>
            </div>
            <address className="invoice-body__sender">
              {invoice.senderAddress.street}<br />
              {invoice.senderAddress.city}<br />
              {invoice.senderAddress.postCode}<br />
              {invoice.senderAddress.country}
            </address>
          </div>

          {/* Meta grid */}
          <div className="invoice-body__meta">
            <div className="meta-block">
              <p className="meta-block__label">Invoice Date</p>
              <strong className="meta-block__value">{formatDate(invoice.createdAt)}</strong>
              <br /><br />
              <p className="meta-block__label">Payment Due</p>
              <strong className="meta-block__value">{formatDate(invoice.paymentDue)}</strong>
            </div>
            <MetaBlock
              label="Bill To"
              value={invoice.clientName}
              address={invoice.clientAddress}
            />
            <div className="meta-block">
              <p className="meta-block__label">Sent To</p>
              <strong className="meta-block__value">{invoice.clientEmail}</strong>
            </div>
          </div>

          {/* Items table */}
          <div className="invoice-body__items">
            <table className="items-table" aria-label="Invoice line items">
              <thead>
                <tr>
                  <th className="text-left">Item Name</th>
                  <th className="text-center">QTY.</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, i) => (
                  <tr key={i}>
                    <td className="text-left">{item.name}</td>
                    <td className="text-center items-table__qty">{item.qty}</td>
                    <td className="text-right">{formatCurrency(item.price)}</td>
                    <td className="text-right">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="items-total">
              <p>Amount Due</p>
              <h2>{formatCurrency(invoice.total)}</h2>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}