// ==================== src/hooks/useSocios.js ====================
import { useSocioStore } from '../store/useSocioStore';
import socioApi from '../api/socioApi';

export const useSocios = () => {
  const { 
    socios, 
    socioSeleccionado, 
    loading, 
    error,
    setSocios,
    setSocioSeleccionado,
    setLoading,
    setError,
    agregarSocio,
    actualizarSocio,
    eliminarSocio,
    limpiarError
  } = useSocioStore();

  const cargarSocios = async (filtros = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await socioApi.obtenerTodos(filtros);
      setSocios(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar socios');
    } finally {
      setLoading(false);
    }
  };

  const cargarSocio = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await socioApi.obtenerPorId(id);
      setSocioSeleccionado(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar socio');
    } finally {
      setLoading(false);
    }
  };

  const buscarPorDNI = async (dni) => {
    try {
      setLoading(true);
      setError(null);
      const response = await socioApi.buscarPorDNI(dni);
      return response.data;
    } catch (err) {
      if (err.response?.status === 404) {
        return null;
      }
      setError(err.response?.data?.message || 'Error al buscar socio');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registrarSocio = async (socio) => {
    try {
      setLoading(true);
      setError(null);
      const response = await socioApi.registrar(socio);
      agregarSocio(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar socio');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const modificarSocio = async (id, socio) => {
    try {
      setLoading(true);
      setError(null);
      const response = await socioApi.actualizar(id, socio);
      actualizarSocio(id, response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar socio');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const desactivarSocio = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await socioApi.desactivar(id);
      actualizarSocio(id, response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al desactivar socio');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const borrarSocio = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await socioApi.eliminar(id);
      eliminarSocio(id);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar socio');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    socios,
    socioSeleccionado,
    loading,
    error,
    cargarSocios,
    cargarSocio,
    buscarPorDNI,
    registrarSocio,
    modificarSocio,
    desactivarSocio,
    borrarSocio,
    limpiarError
  };
};