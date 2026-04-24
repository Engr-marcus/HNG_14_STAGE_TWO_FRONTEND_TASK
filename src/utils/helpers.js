const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** Generate a random invoice ID e.g. "RT3080" */
export function generateId() {
  const rand = () => LETTERS[Math.floor(Math.random() * 26)];
  const digits = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return rand() + rand() + digits;
}

/** Format a number as a USD currency string */
export function formatCurrency(n) {
  return (
    "$" +
    Number(n).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

/** Format an ISO date string to "21 Aug 2021" */
export function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Parse a human date ("21 Aug 2021") or ISO date → ISO string.
 * Returns "" if unparseable.
 */
export function parseDate(str) {
  if (!str) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(str.trim())) return str.trim();
  const d = new Date(str);
  return isNaN(d) ? "" : d.toISOString().slice(0, 10);
}

/** Add N days to an ISO date string → ISO string */
export function addDays(isoDate, days) {
  const d = new Date(isoDate + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Payment terms → number of days */
export const PAYMENT_TERMS_MAP = {
  net1: 1,
  net7: 7,
  net14: 14,
  net30: 30,
};

/** Capitalise first letter */
export function capitalise(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Build a complete invoice object from form data */
export function buildInvoice(form, status, existingId = null) {
  const createdAt =
    parseDate(form.invoiceDate) || new Date().toISOString().slice(0, 10);
  const days = PAYMENT_TERMS_MAP[form.paymentTerms] || 30;

  const items = form.items.map((it) => ({
    name: it.name,
    qty: Number(it.qty),
    price: Number(it.price),
    total: parseFloat((Number(it.qty) * Number(it.price)).toFixed(2)),
  }));

  const total = parseFloat(
    items.reduce((sum, i) => sum + i.total, 0).toFixed(2)
  );

  return {
    id: existingId || form.id || generateId(),
    status,
    description: form.projectDesc,
    createdAt,
    paymentDue: addDays(createdAt, days),
    paymentTerms: form.paymentTerms,
    clientName: form.clientName,
    clientEmail: form.clientEmail,
    senderAddress: {
      street: form.fromStreet,
      city: form.fromCity,
      postCode: form.fromPost,
      country: form.fromCountry,
    },
    clientAddress: {
      street: form.toStreet,
      city: form.toCity,
      postCode: form.toPost,
      country: form.toCountry,
    },
    items,
    total,
  };
}

/** Convert an invoice object back into form field values */
export function invoiceToForm(invoice) {
  return {
    id: invoice.id,
    fromStreet: invoice.senderAddress.street,
    fromCity: invoice.senderAddress.city,
    fromPost: invoice.senderAddress.postCode,
    fromCountry: invoice.senderAddress.country,
    clientName: invoice.clientName,
    clientEmail: invoice.clientEmail,
    toStreet: invoice.clientAddress.street,
    toCity: invoice.clientAddress.city,
    toPost: invoice.clientAddress.postCode,
    toCountry: invoice.clientAddress.country,
    invoiceDate: invoice.createdAt,
    paymentTerms: invoice.paymentTerms,
    projectDesc: invoice.description,
    items: invoice.items.map((it, i) => ({ ...it, id: i })),
  };
}