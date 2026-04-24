import React, { createContext, useContext, useCallback } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { buildInvoice } from "../utils/helpers";

// ─── Seed data ──────────────────────────────────────────────────────────────
const SEED_INVOICES = [
  {
    id: "RT3080", status: "paid", description: "Graphic Design",
    createdAt: "2021-08-18", paymentDue: "2021-08-19", paymentTerms: "net1",
    clientName: "Jensen Huang", clientEmail: "jensenhuang@nvidia.com",
    senderAddress: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    clientAddress: { street: "106 Kendell Street", city: "Sharrington", postCode: "NR24 5WQ", country: "United Kingdom" },
    items: [{ name: "Brand Guidelines", qty: 1, price: 1800.9, total: 1800.9 }],
    total: 1800.9,
  },
  {
    id: "XM9141", status: "pending", description: "Graphic Design",
    createdAt: "2021-08-21", paymentDue: "2021-09-20", paymentTerms: "net30",
    clientName: "Alex Grim", clientEmail: "alexgrim@mail.com",
    senderAddress: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    clientAddress: { street: "84 Church Way", city: "Bradford", postCode: "BD1 9PB", country: "United Kingdom" },
    items: [{ name: "Banner Design", qty: 1, price: 156, total: 156 }, { name: "Email Design", qty: 2, price: 200, total: 400 }],
    total: 556,
  },
  {
    id: "RG0314", status: "draft", description: "Web Development",
    createdAt: "2021-09-01", paymentDue: "2021-10-01", paymentTerms: "net30",
    clientName: "John Morrison", clientEmail: "john.morrison@koda.com",
    senderAddress: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    clientAddress: { street: "79 Dover Road", city: "Westhall", postCode: "IP19 3PF", country: "United Kingdom" },
    items: [{ name: "Project Consultation", qty: 1, price: 8000, total: 8000 }, { name: "Frontend Development", qty: 1, price: 6002.33, total: 6002.33 }],
    total: 14002.33,
  },
  {
    id: "AA1449", status: "pending", description: "UI Design & Branding",
    createdAt: "2021-10-07", paymentDue: "2021-11-03", paymentTerms: "net14",
    clientName: "Alysa Werner", clientEmail: "alysa.werner@yardistry.com",
    senderAddress: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    clientAddress: { street: "63 Warwick Road", city: "Carlisle", postCode: "CA20 2TF", country: "United Kingdom" },
    items: [{ name: "Logo Redesign", qty: 1, price: 650, total: 650 }, { name: "Stationery Pack", qty: 1, price: 208, total: 208 }],
    total: 858,
  },
  {
    id: "TY9141", status: "paid", description: "Landing Page Redesign",
    createdAt: "2021-10-08", paymentDue: "2021-11-04", paymentTerms: "net7",
    clientName: "Mellisa Clarke", clientEmail: "mellisa.clarke@candesign.com",
    senderAddress: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    clientAddress: { street: "46 Abbey Row", city: "Cambridge", postCode: "CB5 6EG", country: "United Kingdom" },
    items: [{ name: "Landing Page Design", qty: 1, price: 2312, total: 2312 }],
    total: 2312,
  },
  {
    id: "FV2353", status: "draft", description: "Logo Concepts",
    createdAt: "2021-11-12", paymentDue: "2021-12-12", paymentTerms: "net30",
    clientName: "Hasmythology Ltd", clientEmail: "invoke@hasmythology.com",
    senderAddress: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    clientAddress: { street: "3 Tethys Road", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    items: [{ name: "Logo Sketches", qty: 3, price: 79.67, total: 239 }],
    total: 239,
  },
  {
    id: "KM9003", status: "paid", description: "Motion Design",
    createdAt: "2021-12-07", paymentDue: "2021-12-27", paymentTerms: "net14",
    clientName: "Sara Koivisto", clientEmail: "sara.koivisto@mishipay.com",
    senderAddress: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    clientAddress: { street: "2 Park Road", city: "Carlisle", postCode: "CA21 2XF", country: "United Kingdom" },
    items: [{ name: "Icon Animation", qty: 1, price: 120, total: 120 }],
    total: 120,
  },
];

// ─── Context ────────────────────────────────────────────────────────────────
const InvoiceContext = createContext(null);

export function InvoiceProvider({ children }) {
  const [invoices, setInvoices] = useLocalStorage("inv_app_invoices", SEED_INVOICES);

  /** Find a single invoice by ID */
  const getInvoice = useCallback(
    (id) => invoices.find((inv) => inv.id === id) || null,
    [invoices]
  );

  /** Add or update an invoice */
  const upsertInvoice = useCallback((invoice) => {
    setInvoices((prev) => {
      const idx = prev.findIndex((i) => i.id === invoice.id);
      if (idx === -1) return [invoice, ...prev];
      const next = [...prev];
      next[idx] = invoice;
      return next;
    });
  }, [setInvoices]);

  /** Create a new invoice from form data with a given status */
  const createInvoice = useCallback((form, status) => {
    const invoice = buildInvoice(form, status);
    upsertInvoice(invoice);
    return invoice;
  }, [upsertInvoice]);

  /** Update an existing invoice from form data, preserving its status */
  const updateInvoice = useCallback((id, form) => {
    const existing = invoices.find((i) => i.id === id);
    if (!existing) return;
    const updated = buildInvoice(form, existing.status, id);
    upsertInvoice(updated);
    return updated;
  }, [invoices, upsertInvoice]);

  /** Delete an invoice by ID */
  const deleteInvoice = useCallback((id) => {
    setInvoices((prev) => prev.filter((i) => i.id !== id));
  }, [setInvoices]);

  /** Mark a pending invoice as paid */
  const markAsPaid = useCallback((id) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id && inv.status !== "paid" ? { ...inv, status: "paid" } : inv
      )
    );
  }, [setInvoices]);

  const value = {
    invoices,
    getInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    markAsPaid,
  };

  return (
    <InvoiceContext.Provider value={value}>
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoices() {
  const ctx = useContext(InvoiceContext);
  if (!ctx) throw new Error("useInvoices must be used within InvoiceProvider");
  return ctx;
}