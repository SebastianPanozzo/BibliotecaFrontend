import axiosInstance from './axiosConfig';

const SOCIO_ENDPOINT = '/api/socios';

export const socioApi = {
  // Obtener todos los socios
  obtenerTodos: async (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.activo !== undefined) params.append('activo', filtros.activo);
    
    const response = await axiosInstance.get(`${SOCIO_ENDPOINT}?${params}`);
    return response.data;
  },

  // Obtener socio por ID
  obtenerPorId: async (id) => {
    const response = await axiosInstance.get(`${SOCIO_ENDPOINT}/${id}`);
    return response.data;
  },

  // Buscar por DNI
  buscarPorDNI: async (dni) => {
    const response = await axiosInstance.get(`${SOCIO_ENDPOINT}/dni/${dni}`);
    return response.data;
  },

  // Buscar por número de socio
  buscarPorNumero: async (numeroSocio) => {
    const response = await axiosInstance.get(`${SOCIO_ENDPOINT}/numero/${numeroSocio}`);
    return response.data;
  },

  // Obtener préstamos de un socio
  obtenerPrestamos: async (id) => {
    const response = await axiosInstance.get(`${SOCIO_ENDPOINT}/${id}/prestamos`);
    return response.data;
  },

  // Obtener multas de un socio
  obtenerMultas: async (id) => {
    const response = await axiosInstance.get(`${SOCIO_ENDPOINT}/${id}/multas`);
    return response.data;
  },

  // Registrar socio
  registrar: async (socio) => {
    const response = await axiosInstance.post(SOCIO_ENDPOINT, socio);
    return response.data;
  },

  // Actualizar socio
  actualizar: async (id, socio) => {
    const response = await axiosInstance.put(`${SOCIO_ENDPOINT}/${id}`, socio);
    return response.data;
  },

  // Desactivar socio
  desactivar: async (id) => {
    const response = await axiosInstance.put(`${SOCIO_ENDPOINT}/${id}/desactivar`);
    return response.data;
  },

  // Eliminar socio
  eliminar: async (id) => {
    const response = await axiosInstance.delete(`${SOCIO_ENDPOINT}/${id}`);
    return response.data;
  },
};

export default socioApi;