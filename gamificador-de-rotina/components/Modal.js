'use client';
import { useEffect, useRef } from 'react';

// Modal sobre o <dialog> nativo: Esc fecha e o foco fica preso dentro
export default function Modal({ open, title, onClose, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const d = ref.current;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog ref={ref} onClose={onClose} aria-labelledby="modal-title">
      <h2 id="modal-title">{title}</h2>
      <div style={{ margin: '12px 0' }}>{children}</div>
    </dialog>
  );
}