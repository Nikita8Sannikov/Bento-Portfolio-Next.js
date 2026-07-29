"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
};

export function Modal({ children, title, onClose }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function handleOverlayClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return createPortal(
    <div
      className="
            fixed inset-0 z-50 flex items-center justify-center
            bg-black/70 p-4 backdrop-blur-sm
          "
      onMouseDown={handleOverlayClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="
              max-h-[90vh] w-full max-w-2xl overflow-y-auto
              rounded-3xl border border-neutral-800
              bg-neutral-950 text-white shadow-2xl outline-none
            "
      >
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
          <h2 id="modal-title" className="text-xl font-semibold text-white">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="
                  rounded-lg px-3 py-1 text-neutral-400
                  hover:bg-neutral-800 hover:text-white
                "
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
