// ==================== src/hooks/useMultas.js ====================
import { useMultaStore } from '../store/useMultaStore';
import multaApi from '../api/multaApi';

export const useMultas = () => {
  const { 
    multas, 
    multaSeleccionada, 
    loading, 
    error,
    estadisticas,
    setMultas,
    setMultaSeleccionada,
    setLoading,
    setError,
    setEstadisticas,
    agregarMulta,
    actualizarMulta,
    limpiarError
  } = useMultaStore();

  const cargarMultas = async (filtros = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await multaApi.obtenerTodas(filtros);
      setMultas(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar multas');
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await multaApi.obtenerEstadisticas();
      setEstadisticas(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const registrarMulta = async (multa) => {
    try {
      setLoading(true);
      setError(null);
      const response = await multaApi.registrar(multa);
      agregarMulta(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar multa');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registrarPago = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await multaApi.registrarPago(id);
      actualizarMulta(id, response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar pago');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelarMulta = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await multaApi.cancelar(id);
      actualizarMulta(id, response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cancelar multa');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    multas,
    multaSeleccionada,
    loading,
    error,
    estadisticas,
    cargarMultas,
    cargarEstadisticas,
    registrarMulta,
    registrarPago,
    cancelarMulta,
    limpiarError
  };
};