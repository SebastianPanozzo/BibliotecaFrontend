// ==================== src/components/common/Loading.jsx ====================
function Loading({ mensaje = 'Cargando...' }) {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center py-5">
      <div className="spinner-border text-primary mb-3" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
      <p className="text-muted">{mensaje}</p>
    </div>
  );
}

export default Loading;