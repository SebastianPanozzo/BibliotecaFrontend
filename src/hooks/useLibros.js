// ==================== src/hooks/useLibros.js ====================
import { useLibroStore } from '../store/useLibroStore';
import libroApi from '../api/libroApi';

export const useLibros = () => {
  const { 
    libros, 
    libroSeleccionado, 
    loading, 
    error,
    setLibros,
    setLibroSeleccionado,
    setLoading,
    setError,
    agregarLibro,
    actualizarLibro,
    eliminarLibro,
    limpiarError
  } = useLibroStore();

  const cargarLibros = async (filtros = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await libroApi.obtenerTodos(filtros);
      setLibros(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar libros');
    } finally {
      setLoading(false);
    }
  };

  const cargarLibro = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await libroApi.obtenerPorId(id);
      setLibroSeleccionado(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar libro');
    } finally {
      setLoading(false);
    }
  };

  const crearLibro = async (libro) => {
    try {
      setLoading(true);
      setError(null);
      const response = await libroApi.crear(libro);
      agregarLibro(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear libro');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const modificarLibro = async (id, libro) => {
    try {
      setLoading(true);
      setError(null);
      const response = await libroApi.actualizar(id, libro);
      actualizarLibro(id, response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar libro');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const borrarLibro = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await libroApi.eliminar(id);
      eliminarLibro(id);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar libro');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verificarDisponibilidad = async (id) => {
    try {
      const response = await libroApi.verificarDisponibilidad(id);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al verificar disponibilidad');
      return null;
    }
  };

  return {
    libros,
    libroSeleccionado,
    loading,
    error,
    cargarLibros,
    cargarLibro,
    crearLibro,
    modificarLibro,
    borrarLibro,
    verificarDisponibilidad,
    limpiarError
  };
};