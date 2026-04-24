import React, { useState } from "react";
import InvoiceDetail from "../components/invoice/InvoiceDetail";
import InvoiceForm from "../components/invoice/InvoiceForm";
import DeleteModal from "../components/invoice/DeleteModal";
import { useInvoices } from "../context/InvoiceContext";
import { navigate } from "../app/routes";

export default function InvoiceDetailPage({ id }) {
  const { getInvoice, updateInvoice, deleteInvoice, markAsPaid } = useInvoices();
  const invoice = getInvoice(id);

  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Invoice not found — redirect
  if (!invoice) {
    navigate("/");
    return null;
  }

  function handleSaveEdit(form) {
    updateInvoice(id, form);
    setShowEdit(false);
  }

  function handleConfirmDelete() {
    deleteInvoice(id);
    navigate("/");
  }

  return (
    <main className="page page--detail">
      <InvoiceDetail
        invoice={invoice}
        onEdit={() => setShowEdit(true)}
        onDelete={() => setShowDelete(true)}
        onMarkPaid={() => markAsPaid(id)}
      />

      {/* Edit panel */}
      <InvoiceForm
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        onSaveAndSend={null}
        onSaveDraft={null}
        onSaveEdit={handleSaveEdit}
        editingInvoice={invoice}
        title={`Edit #${invoice.id}`}
      />

      {/* Delete confirmation */}
      <DeleteModal
        isOpen={showDelete}
        invoiceId={invoice.id}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDelete(false)}
      />
    </main>
  );
}