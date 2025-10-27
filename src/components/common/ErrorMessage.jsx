// ==================== src/components/common/ErrorMessage.jsx ====================
function ErrorMessage({ mensaje, onDismiss }) {
  if (!mensaje) return null;

  return (
    <div className="alert alert-danger alert-dismissible fade show" role="alert">
      <i className="bi bi-exclamation-triangle-fill me-2"></i>
      <strong>Error:</strong> {mensaje}
      {onDismiss && (
        <button 
          type="button" 
          className="btn-close" 
          onClick={onDismiss}
          aria-label="Cerrar"
        ></button>
      )}
    </div>
  );
}

export default ErrorMessage;