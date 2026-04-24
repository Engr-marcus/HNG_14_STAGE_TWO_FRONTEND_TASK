import React, { useEffect, useRef } from "react";

/**
 * Accessible modal dialog.
 * Traps focus, closes on ESC, and prevents background scroll.
 */
export default function Modal({ isOpen, onClose, title, children, labelId = "modal-title" }) {
  const overlayRef = useRef(null);
  const firstFocusRef = useRef(null);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      firstFocusRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose();
  }

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelId}
    >
      <div className="modal" ref={firstFocusRef} tabIndex={-1}>
        {title && <h2 id={labelId} className="modal__title">{title}</h2>}
        {children}
      </div>
    </div>
  );
}