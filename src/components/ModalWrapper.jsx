import { useRef, useEffect } from 'react';

const ModalWrapper = ({ id, title, children, onClose }) => {
  const modalRef = useRef();

  useEffect(() => {
    const modal = new window.bootstrap.Modal(modalRef.current);

    modal.show();

    const handleHide = () => {
      onClose?.(); // Llama onClose si se pasa
    };

    modalRef.current.addEventListener('hidden.bs.modal', handleHide);

    return () => {
      modalRef.current.removeEventListener('hidden.bs.modal', handleHide);
      modal.hide();
    };
  }, [onClose]);

  return (
    <div
      className="modal fade"
      id={id}
      tabIndex="-1"
      aria-labelledby={`${id}Label`}
      aria-hidden="true"
      ref={modalRef}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`${id}Label`}>{title}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ModalWrapper;
