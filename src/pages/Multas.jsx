// ==================== src/pages/Multas.jsx ====================
import { useState, useEffect } from 'react';
import { useMultas } from '../hooks/useMultas';
import { useSocios } from '../hooks/useSocios';
import { usePrestamos } from '../hooks/usePrestamos';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import ConfirmModal from '../components/common/ConfirmModal';
import TablaMultas from '../components/multas/TablaMultas';
import FormularioMulta from '../components/multas/FormularioMulta';
import DetalleMulta from '../components/multas/DetalleMulta';
import { formatearMoneda } from '../utils/formatters';

function Multas() {
  const {
    multas,
    loading,
    error,
    estadisticas,
    cargarMultas,
    cargarEstadisticas,
    registrarMulta,
    registrarPago,
    cancelarMulta,
    limpiarError
  } = useMultas();

  const { socios, cargarSocios } = useSocios();
  const { prestamos, cargarPrestamos } = usePrestamos();

  const [vistaActual, setVistaActual] = useState('lista');
  const [multaSeleccionada, setMultaSeleccionada] = useState(null);
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const [mostrarModalCancelar, setMostrarModalCancelar] = useState(false);
  const [filtroMultas, setFiltroMultas] = useState('todos');

  useEffect(() => {
    cargarMultas();
    cargarSocios();
    cargarPrestamos();
    cargarEstadisticas();
  }, []);

  const multasFiltradas = multas.filter(multa => {
    if (filtroMultas === 'pendientes') return multa.estadoMulta === 'PENDIENTE';
    if (filtroMultas === 'pagadas') return multa.estadoMulta === 'PAGADA';
    if (filtroMultas === 'canceladas') return multa.estadoMulta === 'CANCELADA';
    return true;
  });

  const handleNueva = () => {
    setMultaSeleccionada(null);
    setVistaActual('formulario');
  };

  const handleVer = (multa) => {
    setMultaSeleccionada(multa);
    setVistaActual('detalle');
  };

  const handlePagar = (multa) => {
    setMultaSeleccionada(multa);
    setMostrarModalPago(true);
  };

  const handleCancelar = (multa) => {
    setMultaSeleccionada(multa);
    setMostrarModalCancelar(true);
  };

  const confirmarPago = async () => {
    try {
      await registrarPago(multaSeleccionada.id);
      alert('Pago registrado correctamente');
      setMultaSeleccionada(null);
      cargarMultas();
      cargarEstadisticas();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al registrar el pago');
    }
  };

  const confirmarCancelar = async () => {
    try {
      await cancelarMulta(multaSeleccionada.id);
      alert('Multa cancelada correctamente');
      setMultaSeleccionada(null);
      cargarMultas();
      cargarEstadisticas();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al cancelar la multa');
    }
  };

  const handleSubmitFormulario = async (datos) => {
    try {
      await registrarMulta(datos);
      alert('Multa registrada correctamente');
      setVistaActual('lista');
      cargarMultas();
      cargarEstadisticas();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al registrar la multa');
    }
  };

  const handleCancelarFormulario = () => {
    setVistaActual('lista');
    setMultaSeleccionada(null);
  };

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-md-8">
          <h2>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Gestión de Multas
          </h2>
        </div>
        <div className="col-md-4 text-end">
          {vistaActual === 'lista' && (
            <button className="btn btn-warning" onClick={handleNueva}>
              <i className="bi bi-plus-circle me-2"></i>
              Nueva Multa
            </button>
          )}
        </div>
      </div>

      {error && <ErrorMessage mensaje={error} onDismiss={limpiarError} />}

      {vistaActual === 'lista' && estadisticas && (
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card border-warning">
              <div className="card-body text-center">
                <h6 className="text-muted mb-2">Total Pendientes</h6>
                <h3 className="text-warning mb-0">{estadisticas.multasPendientes || 0}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-success">
              <div className="card-body text-center">
                <h6 className="text-muted mb-2">Total Pagadas</h6>
                <h3 className="text-success mb-0">{estadisticas.multasPagadas || 0}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-danger">
              <div className="card-body text-center">
                <h6 className="text-muted mb-2">Monto Pendiente</h6>
                <h4 className="text-danger mb-0">
                  {formatearMoneda(estadisticas.montoPendiente || 0)}
                </h4>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-info">
              <div className="card-body text-center">
                <h6 className="text-muted mb-2">Monto Recaudado</h6>
                <h4 className="text-info mb-0">
                  {formatearMoneda(estadisticas.montoRecaudado || 0)}
                </h4>
              </div>
            </div>
          </div>
        </div>
      )}

      {vistaActual === 'lista' && (
        <>
          <div className="card mb-3">
            <div className="card-body">
              <div className="btn-group" role="group">
                <button
                  className={`btn ${filtroMultas === 'todos' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFiltroMultas('todos')}
                >
                  Todas ({multas.length})
                </button>
                <button
                  className={`btn ${filtroMultas === 'pendientes' ? 'btn-warning' : 'btn-outline-warning'}`}
                  onClick={() => setFiltroMultas('pendientes')}
                >
                  Pendientes ({multas.filter(m => m.estadoMulta === 'PENDIENTE').length})
                </button>
                <button
                  className={`btn ${filtroMultas === 'pagadas' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setFiltroMultas('pagadas')}
                >
                  Pagadas ({multas.filter(m => m.estadoMulta === 'PAGADA').length})
                </button>
                <button
                  className={`btn ${filtroMultas === 'canceladas' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                  onClick={() => setFiltroMultas('canceladas')}
                >
                  Canceladas ({multas.filter(m => m.estadoMulta === 'CANCELADA').length})
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <Loading mensaje="Cargando multas..." />
          ) : (
            <div className="card">
              <div className="card-body">
                <TablaMultas
                  multas={multasFiltradas}
                  onVer={handleVer}
                  onPagar={handlePagar}
                  onCancelar={handleCancelar}
                />
              </div>
            </div>
          )}
        </>
      )}

      {vistaActual === 'formulario' && (
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">
              <i className="bi bi-plus-circle me-2"></i>
              Registrar Nueva Multa
            </h5>
          </div>
          <div className="card-body">
            <FormularioMulta
              socios={socios}
              prestamos={prestamos}
              onSubmit={handleSubmitFormulario}
              onCancel={handleCancelarFormulario}
            />
          </div>
        </div>
      )}

      {vistaActual === 'detalle' && (
        <DetalleMulta
          multa={multaSeleccionada}
          onClose={() => setVistaActual('lista')}
        />
      )}

      <ConfirmModal
        show={mostrarModalPago}
        onHide={() => setMostrarModalPago(false)}
        onConfirm={confirmarPago}
        titulo="Registrar Pago de Multa"
        mensaje={`¿Confirmar el pago de ${formatearMoneda(multaSeleccionada?.monto)} por parte del socio "${multaSeleccionada?.socio?.nombre}"?`}
        textoConfirmar="Registrar Pago"
        tipo="success"
      />

      <ConfirmModal
        show={mostrarModalCancelar}
        onHide={() => setMostrarModalCancelar(false)}
        onConfirm={confirmarCancelar}
        titulo="Cancelar Multa"
        mensaje={`¿Está seguro de cancelar esta multa de ${formatearMoneda(multaSeleccionada?.monto)}?`}
        textoConfirmar="Cancelar Multa"
        tipo="warning"
      />
    </div>
  );
}

export default Multas;