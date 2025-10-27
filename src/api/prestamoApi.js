import axiosInstance from './axiosConfig';

const PRESTAMO_ENDPOINT = '/api/prestamos';

export const prestamoApi = {
  // Obtener todos los préstamos
  obtenerTodos: async (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.estadoPrestamo) params.append('estadoPrestamo', filtros.estadoPrestamo);
    if (filtros.idSocio) params.append('idSocio', filtros.idSocio);
    if (filtros.idLibro) params.append('idLibro', filtros.idLibro);
    
    const response = await axiosInstance.get(`${PRESTAMO_ENDPOINT}?${params}`);
    return response.data;
  },

  // Obtener préstamos activos
  obtenerActivos: async () => {
    const response = await axiosInstance.get(`${PRESTAMO_ENDPOINT}/activos`);
    return response.data;
  },

  // Obtener préstamos vencidos
  obtenerVencidos: async () => {
    const response = await axiosInstance.get(`${PRESTAMO_ENDPOINT}/vencidos`);
    return response.data;
  },

  // Obtener préstamo por ID
  obtenerPorId: async (id) => {
    const response = await axiosInstance.get(`${PRESTAMO_ENDPOINT}/${id}`);
    return response.data;
  },

  // Registrar préstamo
  registrar: async (prestamo) => {
    const response = await axiosInstance.post(PRESTAMO_ENDPOINT, prestamo);
    return response.data;
  },

  // Registrar devolución - CORREGIDO: Enviar estadoLibro en el body
  registrarDevolucion: async (id, estadoLibro = 'BUENO') => {
    const response = await axiosInstance.put(`${PRESTAMO_ENDPOINT}/${id}/devolver`, {
      estadoLibro
    });
    return response.data;
  },

  // Renovar préstamo - CORREGIDO: Parámetro correcto
  renovar: async (id, diasExtension = 14) => {
    const response = await axiosInstance.put(`${PRESTAMO_ENDPOINT}/${id}/renovar`, {
      diasExtension
    });
    return response.data;
  },
};

export default prestamoApi;