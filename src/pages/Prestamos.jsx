// ==================== src/pages/Prestamos.jsx ====================
import { useState, useEffect } from 'react';
import { usePrestamos } from '../hooks/usePrestamos';
import { useLibros } from '../hooks/useLibros';
import { useSocios } from '../hooks/useSocios';
import { useMultas } from '../hooks/useMultas';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import ConfirmModal from '../components/common/ConfirmModal';
import TablaPrestamos from '../components/prestamos/TablaPrestamos';
import FormularioPrestamo from '../components/prestamos/FormularioPrestamo';
import DetallePrestamo from '../components/prestamos/DetallePrestamo';
import DevolucionForm from '../components/prestamos/DevolucionForm';

function Prestamos() {
  const {
    prestamos,
    loading: loadingPrestamos,
    error,
    cargarPrestamos,
    registrarPrestamo,
    registrarDevolucion,
    renovarPrestamo,
    limpiarError
  } = usePrestamos();

  const { libros, cargarLibros } = useLibros();
  const { socios, cargarSocios } = useSocios();
  const { registrarMulta } = useMultas();

  const [vistaActual, setVistaActual] = useState('lista');
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);
  const [mostrarModalRenovar, setMostrarModalRenovar] = useState(false);
  const [filtroPrestamos, setFiltroPrestamos] = useState('todos');

  useEffect(() => {
    cargarPrestamos();
    cargarLibros();
    cargarSocios();
  }, []);

  const prestamosFiltrados = prestamos.filter(prestamo => {
    if (filtroPrestamos === 'activos') return prestamo.estadoPrestamo === 'ACTIVO';
    if (filtroPrestamos === 'vencidos') return prestamo.estadoPrestamo === 'VENCIDO';
    if (filtroPrestamos === 'devueltos') return prestamo.estadoPrestamo === 'DEVUELTO';
    return true;
  });

  const handleNuevo = () => {
    setPrestamoSeleccionado(null);
    setVistaActual('formulario');
  };

  const handleVer = (prestamo) => {
    setPrestamoSeleccionado(prestamo);
    setVistaActual('detalle');
  };

  const handleDevolver = (prestamo) => {
    setPrestamoSeleccionado(prestamo);
    setVistaActual('devolucion');
  };

  const handleRenovar = (prestamo) => {
    setPrestamoSeleccionado(prestamo);
    setMostrarModalRenovar(true);
  };

  const confirmarRenovar = async () => {
    try {
      await renovarPrestamo(prestamoSeleccionado.id, 14);
      alert('Préstamo renovado por 14 días adicionales');
      setPrestamoSeleccionado(null);
      setMostrarModalRenovar(false);
      cargarPrestamos();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al renovar el préstamo');
    }
  };

  const handleSubmitPrestamo = async (datos) => {
    try {
      await registrarPrestamo(datos);
      alert('Préstamo registrado correctamente');
      setVistaActual('lista');
      cargarPrestamos();
      cargarLibros();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al registrar el préstamo');
    }
  };

  const handleSubmitDevolucion = async (datosDevolucion) => {
    try {
      console.log('Datos de devolución recibidos:', datosDevolucion);
      
      // Pasar todo el objeto datosDevolucion al hook
      const response = await registrarDevolucion(prestamoSeleccionado.id, datosDevolucion);
      
      console.log('Respuesta del backend:', response);
      
      // Mostrar mensaje con información de multas
      if (response.multas && response.multas.length > 0) {
        const totalMultas = response.multas.reduce((sum, m) => sum + m.monto, 0);
        alert(`Devolución registrada.\n\nSe generaron ${response.multas.length} multa(s) por un total de $${totalMultas.toFixed(2)}`);
      } else {
        alert('Devolución registrada correctamente sin multas');
      }
      
      setVistaActual('lista');
      setPrestamoSeleccionado(null);
      
      // Recargar datos
      await cargarPrestamos();
      await cargarLibros();
    } catch (err) {
      console.error('Error completo en devolución:', err);
      alert(err.response?.data?.message || err.message || 'Error al registrar la devolución');
    }
  };

  const handleCancelar = () => {
    setVistaActual('lista');
    setPrestamoSeleccionado(null);
  };

  const loading = loadingPrestamos;

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-md-8">
          <h2>
            <i className="bi bi-arrow-left-right me-2"></i>
            Gestión de Préstamos
          </h2>
        </div>
        <div className="col-md-4 text-end">
          {vistaActual === 'lista' && (
            <button className="btn btn-info" onClick={handleNuevo}>
              <i className="bi bi-plus-circle me-2"></i>
              Nuevo Préstamo
            </button>
          )}
        </div>
      </div>

      {error && <ErrorMessage mensaje={error} onDismiss={limpiarError} />}

      {vistaActual === 'lista' && (
        <>
          <div className="card mb-3">
            <div className="card-body">
              <div className="btn-group" role="group">
                <button
                  className={`btn ${filtroPrestamos === 'todos' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFiltroPrestamos('todos')}
                >
                  Todos ({prestamos.length})
                </button>
                <button
                  className={`btn ${filtroPrestamos === 'activos' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setFiltroPrestamos('activos')}
                >
                  Activos ({prestamos.filter(p => p.estadoPrestamo === 'ACTIVO').length})
                </button>
                <button
                  className={`btn ${filtroPrestamos === 'vencidos' ? 'btn-danger' : 'btn-outline-danger'}`}
                  onClick={() => setFiltroPrestamos('vencidos')}
                >
                  Vencidos ({prestamos.filter(p => p.estadoPrestamo === 'VENCIDO').length})
                </button>
                <button
                  className={`btn ${filtroPrestamos === 'devueltos' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                  onClick={() => setFiltroPrestamos('devueltos')}
                >
                  Devueltos ({prestamos.filter(p => p.estadoPrestamo === 'DEVUELTO').length})
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <Loading mensaje="Cargando préstamos..." />
          ) : (
            <div className="card">
              <div className="card-body">
                <TablaPrestamos
                  prestamos={prestamosFiltrados}
                  onVer={handleVer}
                  onDevolver={handleDevolver}
                  onRenovar={handleRenovar}
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
              Registrar Nuevo Préstamo
            </h5>
          </div>
          <div className="card-body">
            <FormularioPrestamo
              libros={libros}
              socios={socios}
              onSubmit={handleSubmitPrestamo}
              onCancel={handleCancelar}
            />
          </div>
        </div>
      )}

      {vistaActual === 'detalle' && (
        <DetallePrestamo
          prestamo={prestamoSeleccionado}
          onClose={() => setVistaActual('lista')}
        />
      )}

      {vistaActual === 'devolucion' && (
        <DevolucionForm
          prestamo={prestamoSeleccionado}
          onSubmit={handleSubmitDevolucion}
          onCancel={handleCancelar}
        />
      )}

      <ConfirmModal
        show={mostrarModalRenovar}
        onHide={() => setMostrarModalRenovar(false)}
        onConfirm={confirmarRenovar}
        titulo="Renovar Préstamo"
        mensaje={`¿Está seguro de renovar el préstamo del libro "${prestamoSeleccionado?.libro?.titulo}" por 14 días adicionales?`}
        textoConfirmar="Renovar"
        tipo="warning"
      />
    </div>
  );
}

export default Prestamos;