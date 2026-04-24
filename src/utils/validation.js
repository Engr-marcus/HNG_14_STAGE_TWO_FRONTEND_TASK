/**
 * Validates the invoice form data.
 * Returns an errors object — empty means valid.
 */
export function validateInvoiceForm(form) {
  const errors = {};

  // Client info
  if (!form.clientName?.trim()) {
    errors.clientName = "Client name is required";
  }

  if (!form.clientEmail?.trim()) {
    errors.clientEmail = "Client email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail.trim())) {
    errors.clientEmail = "Please enter a valid email address";
  }

  // Sender address
  if (!form.fromStreet?.trim()) {
    errors.fromStreet = "Street address is required";
  }

  // Date
  if (!form.invoiceDate?.trim()) {
    errors.invoiceDate = "Invoice date is required";
  }

  // Items
  if (!form.items || form.items.length === 0) {
    errors.items = "At least one item is required";
  } else {
    form.items.forEach((item, i) => {
      if (!item.name?.trim()) {
        errors[`item_name_${i}`] = "Required";
      }
      if (!(Number(item.qty) > 0)) {
        errors[`item_qty_${i}`] = "Must be > 0";
      }
      if (Number(item.price) < 0) {
        errors[`item_price_${i}`] = "Must be ≥ 0";
      }
    });
  }

  return errors;
}

/** Returns true if the errors object has no keys */
export function isValid(errors) {
  return Object.keys(errors).length === 0;
}