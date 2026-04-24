import React, { useState, useEffect, useRef, useMemo } from "react";
import InvoiceItem from "./InvoiceItem";
import Button from "../ui/Button";

function FilterDropdown({ filters, onToggle }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="filter" ref={ref}>
      <button
        className="filter__toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="filter-dropdown"
      >
        <span>
          Filter <span className="mobile-none">by status</span>
        </span>
        <span className={`filter__arrow${open ? " filter__arrow--open" : ""}`} aria-hidden="true" />
      </button>

      {open && (
        <div
          id="filter-dropdown"
          className="filter__dropdown"
          role="group"
          aria-label="Filter invoices by status"
        >
          {["draft", "pending", "paid"].map((status) => (
            <label key={status} className="filter__option">
              <input
                type="checkbox"
                value={status}
                checked={filters.includes(status)}
                onChange={() => onToggle(status)}
              />
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <svg className="empty-state__art" viewBox="0 0 160 160" fill="none" aria-hidden="true">
        <circle cx="80" cy="80" r="80" fill="var(--bg-item)" />
        <rect x="46" y="42" width="68" height="76" rx="8" fill="var(--bg-card)" stroke="var(--border)" strokeWidth="2" />
        <rect x="58" y="62" width="44" height="6" rx="3" fill="var(--border)" />
        <rect x="58" y="76" width="32" height="6" rx="3" fill="var(--border)" />
        <rect x="58" y="90" width="38" height="6" rx="3" fill="var(--border)" />
        <circle cx="80" cy="40" r="12" fill="var(--accent)" opacity="0.15" />
        <path d="M80 34v12M74 40h12" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <h3>Nothing here</h3>
      <p>
        Create an invoice by clicking{" "}
        <strong>New Invoice</strong> to get started.
      </p>
    </div>
  );
}

export default function InvoiceList({ invoices, onNew }) {
  const [filters, setFilters] = useState([]);

  function toggleFilter(status) {
    setFilters((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  }

  const filtered = useMemo(
    () =>
      filters.length === 0
        ? invoices
        : invoices.filter((inv) => filters.includes(inv.status)),
    [invoices, filters]
  );

  const count = filtered.length;
  const countLabel =
    count === 0
      ? "No invoices"
      : `There ${count === 1 ? "is" : "are"} ${count} total invoice${count !== 1 ? "s" : ""}`;

  return (
    <>
      {/* Top bar */}
      <div className="list-header">
        <div className="list-header__text">
          <h1 className="list-header__title">Invoices</h1>
          <p
            className="list-header__count"
            id="invoice-count"
            role="status"
            aria-live="polite"
          >
            {countLabel}
          </p>
        </div>
        <div className="list-header__controls">
          <FilterDropdown filters={filters} onToggle={toggleFilter} />
          <Button
            variant="new"
            onClick={onNew}
            aria-label="Create new invoice"
          >
            <span className="btn-new__icon" aria-hidden="true">+</span>
            <span>New <span className="mobile-none">Invoice</span></span>
          </Button>
        </div>
      </div>

      {/* List or empty */}
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="invoice-list" aria-label="Invoice list" aria-describedby="invoice-count">
          {filtered.map((inv) => (
            <InvoiceItem key={inv.id} invoice={inv} />
          ))}
        </ul>
      )}
    </>
  );
}