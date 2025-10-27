// ==================== src/hooks/usePrestamos.js ====================
import { usePrestamoStore } from '../store/usePrestamoStore';
import prestamoApi from '../api/prestamoApi';

export const usePrestamos = () => {
  const { 
    prestamos, 
    prestamoSeleccionado, 
    loading, 
    error,
    setPrestamos,
    setPrestamoSeleccionado,
    setLoading,
    setError,
    agregarPrestamo,
    actualizarPrestamo,
    limpiarError
  } = usePrestamoStore();

  const cargarPrestamos = async (filtros = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await prestamoApi.obtenerTodos(filtros);
      setPrestamos(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar préstamos');
    } finally {
      setLoading(false);
    }
  };

  const cargarPrestamo = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await prestamoApi.obtenerPorId(id);
      setPrestamoSeleccionado(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar préstamo');
    } finally {
      setLoading(false);
    }
  };

  const registrarPrestamo = async (prestamo) => {
    try {
      setLoading(true);
      setError(null);
      const response = await prestamoApi.registrar(prestamo);
      agregarPrestamo(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar préstamo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // CORREGIDO: Recibir datosDevolucion completo con estadoLibro
  const registrarDevolucion = async (id, datosDevolucion) => {
    try {
      setLoading(true);
      setError(null);
      
      // Extraer el estadoLibro, default a BUENO si no viene
      const estadoLibro = datosDevolucion?.estadoLibro || 'BUENO';
      
      const response = await prestamoApi.registrarDevolucion(id, estadoLibro);
      actualizarPrestamo(id, response.data.prestamo);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar devolución');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const renovarPrestamo = async (id, diasExtension = 14) => {
    try {
      setLoading(true);
      setError(null);
      const response = await prestamoApi.renovar(id, diasExtension);
      actualizarPrestamo(id, response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al renovar préstamo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    prestamos,
    prestamoSeleccionado,
    loading,
    error,
    cargarPrestamos,
    cargarPrestamo,
    registrarPrestamo,
    registrarDevolucion,
    renovarPrestamo,
    limpiarError
  };
};