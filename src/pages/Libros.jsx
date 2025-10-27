// ==================== src/pages/Libros.jsx ====================
import { useState, useEffect } from 'react';
import { useLibros } from '../hooks/useLibros';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import ConfirmModal from '../components/common/ConfirmModal';
import BuscadorLibros from '../components/libros/BuscadorLibros';
import TablaLibros from '../components/libros/TablaLibros';
import FormularioLibro from '../components/libros/FormularioLibro';
import DetalleLibro from '../components/libros/DetalleLibro';

function Libros() {
  const {
    libros,
    loading,
    error,
    cargarLibros,
    crearLibro,
    modificarLibro,
    borrarLibro,
    limpiarError
  } = useLibros();

  const [vistaActual, setVistaActual] = useState('lista');
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [librosFiltrados, setLibrosFiltrados] = useState([]);

  useEffect(() => {
    cargarLibros();
  }, []);

  useEffect(() => {
    setLibrosFiltrados(libros);
  }, [libros]);

  const handleBuscar = (filtros) => {
    let resultado = [...libros];

    if (filtros.termino) {
      const termino = filtros.termino.toLowerCase();
      resultado = resultado.filter(libro =>
        libro.titulo.toLowerCase().includes(termino) ||
        libro.autor.toLowerCase().includes(termino) ||
        libro.isbn.includes(termino)
      );
    }

    if (filtros.estado) {
      resultado = resultado.filter(libro => libro.estado === filtros.estado);
    }

    setLibrosFiltrados(resultado);
  };

  const handleNuevo = () => {
    setLibroSeleccionado(null);
    setVistaActual('formulario');
  };

  const handleVer = (libro) => {
    setLibroSeleccionado(libro);
    setVistaActual('detalle');
  };

  const handleEditar = (libro) => {
    setLibroSeleccionado(libro);
    setVistaActual('formulario');
  };

  const handleEliminar = (libro) => {
    setLibroSeleccionado(libro);
    setMostrarModalEliminar(true);
  };

  const confirmarEliminar = async () => {
    try {
      await borrarLibro(libroSeleccionado.id);
      alert('Libro eliminado correctamente');
      setLibroSeleccionado(null);
    } catch (err) {
      alert('Error al eliminar el libro');
    }
  };

  const handleSubmitFormulario = async (datos) => {
    try {
      if (libroSeleccionado) {
        await modificarLibro(libroSeleccionado.id, datos);
        alert('Libro actualizado correctamente');
      } else {
        await crearLibro(datos);
        alert('Libro registrado correctamente');
      }
      setVistaActual('lista');
      setLibroSeleccionado(null);
      cargarLibros();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al guardar el libro');
    }
  };

  const handleCancelar = () => {
    setVistaActual('lista');
    setLibroSeleccionado(null);
  };

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-md-8">
          <h2>
            <i className="bi bi-book me-2"></i>
            Gestión de Libros
          </h2>
        </div>
        <div className="col-md-4 text-end">
          {vistaActual === 'lista' && (
            <button className="btn btn-primary" onClick={handleNuevo}>
              <i className="bi bi-plus-circle me-2"></i>
              Nuevo Libro
            </button>
          )}
        </div>
      </div>

      {error && <ErrorMessage mensaje={error} onDismiss={limpiarError} />}

      {vistaActual === 'lista' && (
        <>
          <BuscadorLibros onBuscar={handleBuscar} />
          
          {loading ? (
            <Loading mensaje="Cargando libros..." />
          ) : (
            <div className="card">
              <div className="card-body">
                <TablaLibros
                  libros={librosFiltrados}
                  onVer={handleVer}
                  onEditar={handleEditar}
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
              {libroSeleccionado ? 'Editar Libro' : 'Nuevo Libro'}
            </h5>
          </div>
          <div className="card-body">
            <FormularioLibro
              libro={libroSeleccionado}
              onSubmit={handleSubmitFormulario}
              onCancel={handleCancelar}
            />
          </div>
        </div>
      )}

      {vistaActual === 'detalle' && (
        <DetalleLibro
          libro={libroSeleccionado}
          onClose={() => setVistaActual('lista')}
        />
      )}

      <ConfirmModal
        show={mostrarModalEliminar}
        onHide={() => setMostrarModalEliminar(false)}
        onConfirm={confirmarEliminar}
        titulo="Eliminar Libro"
        mensaje={`¿Está seguro de eliminar el libro "${libroSeleccionado?.titulo}"?`}
        textoConfirmar="Eliminar"
        tipo="danger"
      />
    </div>
  );
}

export default Libros;