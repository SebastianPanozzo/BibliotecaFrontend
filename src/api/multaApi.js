import axiosInstance from './axiosConfig';

const MULTA_ENDPOINT = '/api/multas';

export const multaApi = {
  // Obtener todas las multas
  obtenerTodas: async (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.estadoMulta) params.append('estadoMulta', filtros.estadoMulta);
    if (filtros.idSocio) params.append('idSocio', filtros.idSocio);
    
    const response = await axiosInstance.get(`${MULTA_ENDPOINT}?${params}`);
    return response.data;
  },

  // Obtener estadísticas
  obtenerEstadisticas: async () => {
    const response = await axiosInstance.get(`${MULTA_ENDPOINT}/estadisticas`);
    return response.data;
  },

  // Obtener multas por socio
  obtenerPorSocio: async (idSocio) => {
    const response = await axiosInstance.get(`${MULTA_ENDPOINT}/socio/${idSocio}`);
    return response.data;
  },

  // Obtener total adeudado por socio
  obtenerTotalAdeudado: async (idSocio) => {
    const response = await axiosInstance.get(`${MULTA_ENDPOINT}/socio/${idSocio}/total`);
    return response.data;
  },

  // Obtener multa por ID
  obtenerPorId: async (id) => {
    const response = await axiosInstance.get(`${MULTA_ENDPOINT}/${id}`);
    return response.data;
  },

  // Registrar multa
  registrar: async (multa) => {
    const response = await axiosInstance.post(MULTA_ENDPOINT, multa);
    return response.data;
  },

  // Registrar pago
  registrarPago: async (id) => {
    const response = await axiosInstance.put(`${MULTA_ENDPOINT}/${id}/pagar`);
    return response.data;
  },

  // Cancelar multa - CORREGIDO: Enviar el motivo en el body
  cancelar: async (id, motivo = '') => {
    const response = await axiosInstance.put(`${MULTA_ENDPOINT}/${id}/cancelar`, {
      motivo: motivo
    });
    return response.data;
  },
};

export default multaApi;