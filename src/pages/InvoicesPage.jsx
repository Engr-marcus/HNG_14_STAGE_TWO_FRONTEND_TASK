import React, { useState } from "react";
import InvoiceList from "../components/invoice/InvoiceList";
import InvoiceForm from "../components/invoice/InvoiceForm";
import { useInvoices } from "../context/InvoiceContext";
import { buildInvoice } from "../utils/helpers";

export default function InvoicesPage() {
  const { invoices, createInvoice } = useInvoices();
  const [showForm, setShowForm] = useState(false);

  function handleSaveAndSend(form) {
    createInvoice(form, "pending");
    setShowForm(false);
  }

  function handleSaveDraft(form) {
    createInvoice(form, "draft");
    setShowForm(false);
  }

  return (
    <main className="page page--list">
      <InvoiceList
        invoices={invoices}
        onNew={() => setShowForm(true)}
      />

      <InvoiceForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSaveAndSend={handleSaveAndSend}
        onSaveDraft={handleSaveDraft}
        onSaveEdit={null}
        editingInvoice={null}
        title="New Invoice"
      />
    </main>
  );
}