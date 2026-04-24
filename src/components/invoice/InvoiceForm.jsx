import React, { useState, useEffect, useRef } from "react";
import Button from "../ui/Button";
import { validateInvoiceForm, isValid } from "../../utils/validation";
import { invoiceToForm } from "../../utils/helpers";

// ─── Default blank form ─────────────────────────────────────────────────────
export function emptyForm() {
  return {
    id: "",
    fromStreet: "", fromCity: "", fromPost: "", fromCountry: "",
    clientName: "", clientEmail: "",
    toStreet: "", toCity: "", toPost: "", toCountry: "",
    invoiceDate: "", paymentTerms: "net30", projectDesc: "",
    items: [{ id: Date.now(), name: "", qty: 1, price: 0, total: 0 }],
  };
}

// ─── Slide panel wrapper ────────────────────────────────────────────────────
function SlidePanel({ isOpen, onClose, label, children }) {
  const panelRef = useRef(null);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Prevent background scroll, focus panel
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      panelRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <div
        className={`overlay${isOpen ? " overlay--open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`slide-panel${isOpen ? " slide-panel--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        ref={panelRef}
        tabIndex={-1}
      >
        {children}
      </div>
    </>
  );
}

// ─── Small reusable field ───────────────────────────────────────────────────
function Field({ id, label, error, children }) {
  return (
    <div className={`field${error ? " field--error" : ""}`}>
      <div className="field__label-row">
        <label htmlFor={id}>{label}</label>
        {error && <span className="field__error" role="alert">{error}</span>}
      </div>
      {children}
    </div>
  );
}

// ─── InvoiceForm ────────────────────────────────────────────────────────────
export default function InvoiceForm({
  isOpen,
  onClose,
  onSaveAndSend,   // (form) => void
  onSaveDraft,     // (form) => void   (null when editing)
  onSaveEdit,      // (form) => void   (null when creating)
  editingInvoice,  // invoice object | null
  title,
}) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // When panel opens, populate form
  useEffect(() => {
    if (isOpen) {
      setForm(editingInvoice ? invoiceToForm(editingInvoice) : emptyForm());
      setErrors({});
    }
  }, [isOpen, editingInvoice]);

  // ── Field helpers ─────────────────────────────────────────────────────────
  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function setItem(idx, key, value) {
    setForm((f) => {
      const items = [...f.items];
      items[idx] = { ...items[idx], [key]: value };
      if (key === "qty" || key === "price") {
        items[idx].total = parseFloat(
          ((Number(items[idx].qty) || 0) * (Number(items[idx].price) || 0)).toFixed(2)
        );
      }
      return { ...f, items };
    });
    setErrors((e) => ({ ...e, [`item_name_${idx}`]: undefined }));
  }

  function addItem() {
    setForm((f) => ({
      ...f,
      items: [...f.items, { id: Date.now(), name: "", qty: 1, price: 0, total: 0 }],
    }));
  }

  function removeItem(idx) {
    if (form.items.length === 1) return;
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  }

  // ── Submit handlers ───────────────────────────────────────────────────────
  function handleSaveAndSend() {
    const errs = validateInvoiceForm(form);
    if (!isValid(errs)) { setErrors(errs); return; }
    onSaveAndSend(form);
  }

  function handleDraft() {
    onSaveDraft(form);
  }

  function handleSaveEdit() {
    const errs = validateInvoiceForm(form);
    if (!isValid(errs)) { setErrors(errs); return; }
    onSaveEdit(form);
  }

  const isEditing = Boolean(editingInvoice);

  return (
    <SlidePanel isOpen={isOpen} onClose={onClose} label={title}>
      {/* Scrollable form body */}
      <div className="slide-panel__scroll">
        <h2 className="slide-panel__title">
          {isEditing ? (
            <>Edit <span>#{editingInvoice.id}</span></>
          ) : (
            "New Invoice"
          )}
        </h2>

        {/* ── Bill From ── */}
        <fieldset className="form-section">
          <legend className="form-section__legend">Bill From</legend>

          <Field id="fromStreet" label="Street Address" error={errors.fromStreet}>
            <input
              id="fromStreet" type="text" value={form.fromStreet}
              onChange={(e) => setField("fromStreet", e.target.value)}
              className={errors.fromStreet ? "input--error" : ""}
            />
          </Field>

          <div className="form-row form-row--3col">
            {[["fromCity", "City"], ["fromPost", "Post Code"], ["fromCountry", "Country"]].map(([k, lbl]) => (
              <Field key={k} id={k} label={lbl} error={errors[k]}>
                <input id={k} type="text" value={form[k]} onChange={(e) => setField(k, e.target.value)} />
              </Field>
            ))}
          </div>
        </fieldset>

        {/* ── Bill To ── */}
        <fieldset className="form-section">
          <legend className="form-section__legend">Bill To</legend>

          <Field id="clientName" label="Client's Name" error={errors.clientName}>
            <input
              id="clientName" type="text" value={form.clientName}
              onChange={(e) => setField("clientName", e.target.value)}
              className={errors.clientName ? "input--error" : ""}
            />
          </Field>

          <Field id="clientEmail" label="Client's Email" error={errors.clientEmail}>
            <input
              id="clientEmail" type="email" value={form.clientEmail}
              onChange={(e) => setField("clientEmail", e.target.value)}
              placeholder="e.g. email@example.com"
              className={errors.clientEmail ? "input--error" : ""}
            />
          </Field>

          <Field id="toStreet" label="Street Address" error={errors.toStreet}>
            <input id="toStreet" type="text" value={form.toStreet} onChange={(e) => setField("toStreet", e.target.value)} />
          </Field>

          <div className="form-row form-row--3col">
            {[["toCity", "City"], ["toPost", "Post Code"], ["toCountry", "Country"]].map(([k, lbl]) => (
              <Field key={k} id={k} label={lbl} error={errors[k]}>
                <input id={k} type="text" value={form[k]} onChange={(e) => setField(k, e.target.value)} />
              </Field>
            ))}
          </div>
        </fieldset>

        {/* ── Date & Terms ── */}
        <fieldset className="form-section">
          <legend className="sr-only">Invoice Details</legend>
          <div className="form-row form-row--2col">
            <Field id="invoiceDate" label="Invoice Date" error={errors.invoiceDate}>
              <div className="input-with-icon">
                <input
                  id="invoiceDate" type="text" value={form.invoiceDate}
                  onChange={(e) => setField("invoiceDate", e.target.value)}
                  placeholder="YYYY-MM-DD"
                  className={errors.invoiceDate ? "input--error" : ""}
                />
                <span className="input-with-icon__ico" aria-hidden="true">📅</span>
              </div>
            </Field>

            <Field id="paymentTerms" label="Payment Terms">
              <div className="input-with-icon">
                <select
                  id="paymentTerms" value={form.paymentTerms}
                  onChange={(e) => setField("paymentTerms", e.target.value)}
                >
                  <option value="net1">Net 1 Day</option>
                  <option value="net7">Net 7 Days</option>
                  <option value="net14">Net 14 Days</option>
                  <option value="net30">Net 30 Days</option>
                </select>
                <span className="input-with-icon__ico input-with-icon__ico--arrow" aria-hidden="true">⌄</span>
              </div>
            </Field>
          </div>

          <Field id="projectDesc" label="Project Description">
            <input
              id="projectDesc" type="text" value={form.projectDesc}
              onChange={(e) => setField("projectDesc", e.target.value)}
              placeholder="e.g. Graphic Design Service"
            />
          </Field>
        </fieldset>

        {/* ── Item List ── */}
        <div className="form-section">
          <h3 className="items-list__heading">Item List</h3>
          {errors.items && (
            <p className="items-list__error" role="alert">{errors.items}</p>
          )}

          {/* Column headers */}
          <div className="items-list__header" aria-hidden="true">
            <span>Item Name</span>
            <span>QTY.</span>
            <span>Price</span>
            <span>Total</span>
            <span />
          </div>

          {/* Item rows */}
          {form.items.map((item, i) => (
            <div
              className="items-list__row"
              key={item.id}
              role="group"
              aria-label={`Line item ${i + 1}`}
            >
              {/* Name */}
              <div className={`field${errors[`item_name_${i}`] ? " field--error" : ""}`}>
                <label className="sr-only" htmlFor={`item-name-${i}`}>Item name</label>
                <input
                  id={`item-name-${i}`}
                  type="text"
                  value={item.name}
                  onChange={(e) => setItem(i, "name", e.target.value)}
                  placeholder="Item name"
                  className={errors[`item_name_${i}`] ? "input--error" : ""}
                />
                {errors[`item_name_${i}`] && (
                  <span className="field__error" role="alert">{errors[`item_name_${i}`]}</span>
                )}
              </div>

              {/* Qty */}
              <div className={`field${errors[`item_qty_${i}`] ? " field--error" : ""}`}>
                <label className="sr-only" htmlFor={`item-qty-${i}`}>Quantity</label>
                <input
                  id={`item-qty-${i}`}
                  type="number"
                  value={item.qty}
                  min="1"
                  onChange={(e) => setItem(i, "qty", parseFloat(e.target.value) || 0)}
                  className="text-right"
                />
              </div>

              {/* Price */}
              <div className={`field${errors[`item_price_${i}`] ? " field--error" : ""}`}>
                <label className="sr-only" htmlFor={`item-price-${i}`}>Price</label>
                <input
                  id={`item-price-${i}`}
                  type="number"
                  value={item.price}
                  step="0.01"
                  onChange={(e) => setItem(i, "price", parseFloat(e.target.value) || 0)}
                  className="text-right"
                />
              </div>

              {/* Total (readonly) */}
              <div className="field">
                <label className="sr-only">Total</label>
                <input
                  type="text"
                  value={item.total.toFixed(2)}
                  readOnly
                  tabIndex={-1}
                  className="text-right input--readonly"
                  aria-label={`Item total $${item.total.toFixed(2)}`}
                />
              </div>

              {/* Delete row */}
              <button
                type="button"
                className="btn-remove-item"
                onClick={() => removeItem(i)}
                aria-label={`Remove item ${item.name || i + 1}`}
              >
                <svg width="13" height="16" viewBox="0 0 13 16" fill="none" aria-hidden="true">
                  <path d="M11.583 3.556H8.944V2.667A1.334 1.334 0 007.611 1.333H5.39a1.334 1.334 0 00-1.333 1.334v.889H1.417a.444.444 0 100 .888h.401l.82 9.276A1.333 1.333 0 003.966 14.667h5.068a1.333 1.333 0 001.328-1.227l.82-9.276h.4a.444.444 0 100-.888zM4.944 2.667A.444.444 0 015.39 2.222h2.222a.444.444 0 01.444.445v.889H4.944v-.889zm5.4 10.627a.44.44 0 01-.44.372H3.966a.44.44 0 01-.441-.372l-.81-9.181h8.43l-.8 9.181z" fill="currentColor" />
                </svg>
              </button>
            </div>
          ))}

          <button type="button" className="btn-add-item" onClick={addItem}>
            + Add New Item
          </button>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="slide-panel__footer">
        {isEditing ? (
          <>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveEdit}>Save Changes</Button>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={onClose}>Discard</Button>
            <div className="slide-panel__footer-right">
              <Button variant="draft" onClick={handleDraft}>Save as Draft</Button>
              <Button variant="primary" onClick={handleSaveAndSend}>Save &amp; Send</Button>
            </div>
          </>
        )}
      </div>
    </SlidePanel>
  );
}