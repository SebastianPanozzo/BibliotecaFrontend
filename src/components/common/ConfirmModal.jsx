// ==================== src/components/common/ConfirmModal.jsx ====================
function ConfirmModal({ 
  show, 
  onHide, 
  onConfirm, 
  titulo = 'Confirmar acción',
  mensaje = '¿Está seguro de realizar esta acción?',
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  tipo = 'danger'
}) {
  if (!show) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {titulo}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onHide}
            ></button>
          </div>
          <div className="modal-body">
            <p className="mb-0">{mensaje}</p>
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onHide}
            >
              {textoCancelar}
            </button>
            <button 
              type="button" 
              className={`btn btn-${tipo}`}
              onClick={() => {
                onConfirm();
                onHide();
              }}
            >
              {textoConfirmar}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;