// ==================== src/pages/Socios.jsx ====================
import { useState, useEffect } from 'react';
import { useSocios } from '../hooks/useSocios';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import ConfirmModal from '../components/common/ConfirmModal';
import TablaSocios from '../components/socios/TablaSocios';
import FormularioSocio from '../components/socios/FormularioSocio';
import DetalleSocio from '../components/socios/DetalleSocio';

function Socios() {
  const {
    socios,
    loading,
    error,
    cargarSocios,
    buscarPorDNI,
    registrarSocio,
    modificarSocio,
    desactivarSocio,
    borrarSocio,
    limpiarError
  } = useSocios();

  const [vistaActual, setVistaActual] = useState('lista');
  const [socioSeleccionado, setSocioSeleccionado] = useState(null);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [mostrarModalDesactivar, setMostrarModalDesactivar] = useState(false);
  const [filtroActivo, setFiltroActivo] = useState('todos');

  useEffect(() => {
    cargarSocios();
  }, []);

  const sociosFiltrados = socios.filter(socio => {
    if (filtroActivo === 'activos') return socio.activo;
    if (filtroActivo === 'inactivos') return !socio.activo;
    return true;
  });

  const handleNuevo = () => {
    setSocioSeleccionado(null);
    setVistaActual('formulario');
  };

  const handleVer = (socio) => {
    setSocioSeleccionado(socio);
    setVistaActual('detalle');
  };

  const handleEditar = (socio) => {
    setSocioSeleccionado(socio);
    setVistaActual('formulario');
  };

  const handleDesactivar = (socio) => {
    setSocioSeleccionado(socio);
    setMostrarModalDesactivar(true);
  };

  const handleEliminar = (socio) => {
    setSocioSeleccionado(socio);
    setMostrarModalEliminar(true);
  };

  const confirmarDesactivar = async () => {
    try {
      await desactivarSocio(socioSeleccionado.id);
      alert('Socio desactivado correctamente');
      setSocioSeleccionado(null);
      cargarSocios();
    } catch (err) {
      alert('Error al desactivar el socio');
    }
  };

  const confirmarEliminar = async () => {
    try {
      await borrarSocio(socioSeleccionado.id);
      alert('Socio eliminado correctamente');
      setSocioSeleccionado(null);
      cargarSocios();
    } catch (err) {
      alert('Error al eliminar el socio');
    }
  };

  const handleSubmitFormulario = async (datos) => {
    try {
      if (socioSeleccionado) {
        await modificarSocio(socioSeleccionado.id, datos);
        alert('Socio actualizado correctamente');
      } else {
        await registrarSocio(datos);
        alert('Socio registrado correctamente con número de socio generado');
      }
      setVistaActual('lista');
      setSocioSeleccionado(null);
      cargarSocios();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al guardar el socio');
    }
  };

  const handleCancelar = () => {
    setVistaActual('lista');
    setSocioSeleccionado(null);
  };

  const verificarDNIExistente = async (dni) => {
    try {
      const socio = await buscarPorDNI(dni);
      return socio;
    } catch (err) {
      return null;
    }
  };

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-md-8">
          <h2>
            <i className="bi bi-people-fill me-2"></i>
            Gestión de Socios
          </h2>
        </div>
        <div className="col-md-4 text-end">
          {vistaActual === 'lista' && (
            <button className="btn btn-success" onClick={handleNuevo}>
              <i className="bi bi-person-plus me-2"></i>
              Nuevo Socio
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
                  className={`btn ${filtroActivo === 'todos' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFiltroActivo('todos')}
                >
                  Todos ({socios.length})
                </button>
                <button
                  className={`btn ${filtroActivo === 'activos' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setFiltroActivo('activos')}
                >
                  Activos ({socios.filter(s => s.activo).length})
                </button>
                <button
                  className={`btn ${filtroActivo === 'inactivos' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                  onClick={() => setFiltroActivo('inactivos')}
                >
                  Inactivos ({socios.filter(s => !s.activo).length})
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <Loading mensaje="Cargando socios..." />
          ) : (
            <div className="card">
              <div className="card-body">
                <TablaSocios
                  socios={sociosFiltrados}
                  onVer={handleVer}
                  onEditar={handleEditar}
                  onDesactivar={handleDesactivar}
                  onEliminar={handleEliminar}
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
              {socioSeleccionado ? 'Editar Socio' : 'Registrar Nuevo Socio'}
            </h5>
          </div>
          <div className="card-body">
            <FormularioSocio
              socio={socioSeleccionado}
              onSubmit={handleSubmitFormulario}
              onCancel={handleCancelar}
              verificarDNI={verificarDNIExistente}
            />
          </div>
        </div>
      )}

      {vistaActual === 'detalle' && (
        <DetalleSocio
          socio={socioSeleccionado}
          onClose={() => setVistaActual('lista')}
        />
      )}

      <ConfirmModal
        show={mostrarModalDesactivar}
        onHide={() => setMostrarModalDesactivar(false)}
        onConfirm={confirmarDesactivar}
        titulo="Desactivar Socio"
        mensaje={`¿Está seguro de desactivar al socio "${socioSeleccionado?.nombre}"?`}
        textoConfirmar="Desactivar"
        tipo="warning"
      />

      <ConfirmModal
        show={mostrarModalEliminar}
        onHide={() => setMostrarModalEliminar(false)}
        onConfirm={confirmarEliminar}
        titulo="Eliminar Socio"
        mensaje={`¿Está seguro de eliminar al socio "${socioSeleccionado?.nombre}"? Esta acción no se puede deshacer.`}
        textoConfirmar="Eliminar"
        tipo="danger"
      />
    </div>
  );
}

export default Socios;