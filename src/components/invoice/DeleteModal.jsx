import React from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

export default function DeleteModal({ isOpen, invoiceId, onConfirm, onCancel }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Confirm Deletion"
      labelId="delete-modal-title"
    >
      <p className="modal__body">
        Are you sure you want to delete invoice{" "}
        <strong>#{invoiceId}</strong>? This action cannot be undone.
      </p>
      <div className="modal__actions">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm}>Delete</Button>
      </div>
    </Modal>
  );
}