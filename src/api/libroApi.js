import axiosInstance from './axiosConfig';

const LIBRO_ENDPOINT = '/api/libros';

export const libroApi = {
  // Obtener todos los libros
  obtenerTodos: async (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.estado) params.append('estado', filtros.estado);
    if (filtros.autor) params.append('autor', filtros.autor);
    
    const response = await axiosInstance.get(`${LIBRO_ENDPOINT}?${params}`);
    return response.data;
  },

  // Obtener libros disponibles
  obtenerDisponibles: async () => {
    const response = await axiosInstance.get(`${LIBRO_ENDPOINT}/disponibles`);
    return response.data;
  },

  // Obtener libro por ID
  obtenerPorId: async (id) => {
    const response = await axiosInstance.get(`${LIBRO_ENDPOINT}/${id}`);
    return response.data;
  },

  // Buscar por ISBN
  buscarPorISBN: async (isbn) => {
    const response = await axiosInstance.get(`${LIBRO_ENDPOINT}/isbn/${isbn}`);
    return response.data;
  },

  // Verificar disponibilidad
  verificarDisponibilidad: async (id) => {
    const response = await axiosInstance.get(`${LIBRO_ENDPOINT}/${id}/disponible`);
    return response.data;
  },

  // Crear libro
  crear: async (libro) => {
    const response = await axiosInstance.post(LIBRO_ENDPOINT, libro);
    return response.data;
  },

  // Actualizar libro
  actualizar: async (id, libro) => {
    const response = await axiosInstance.put(`${LIBRO_ENDPOINT}/${id}`, libro);
    return response.data;
  },

  // Eliminar libro
  eliminar: async (id) => {
    const response = await axiosInstance.delete(`${LIBRO_ENDPOINT}/${id}`);
    return response.data;
  },
};

export default libroApi;