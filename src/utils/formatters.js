/**
 * Formatea una fecha al formato español
 * @param {Date|string} fecha - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export const formatearFecha = (fecha) => {
  if (!fecha) return '-';
  
  const f = fecha instanceof Date ? fecha : new Date(fecha);
  
  return f.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * Formatea una fecha y hora al formato español
 * @param {Date|string} fecha - Fecha a formatear
 * @returns {string} Fecha y hora formateadas
 */
export const formatearFechaHora = (fecha) => {
  if (!fecha) return '-';
  
  const f = fecha instanceof Date ? fecha : new Date(fecha);
  
  return f.toLocaleString('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Formatea un monto monetario
 * @param {number} monto - Monto a formatear
 * @returns {string} Monto formateado
 */
export const formatearMoneda = (monto) => {
  if (monto === null || monto === undefined) return '$0.00';
  
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  }).format(monto);
};

/**
 * Calcula los días entre dos fechas
 * @param {Date|string} fecha1 - Primera fecha
 * @param {Date|string} fecha2 - Segunda fecha
 * @returns {number} Días de diferencia
 */
export const calcularDiasEntre = (fecha1, fecha2) => {
  const f1 = fecha1 instanceof Date ? fecha1 : new Date(fecha1);
  const f2 = fecha2 instanceof Date ? fecha2 : new Date(fecha2);
  
  const diferencia = f2.getTime() - f1.getTime();
  return Math.ceil(diferencia / (1000 * 3600 * 24));
};

/**
 * Verifica si una fecha está vencida
 * @param {Date|string} fecha - Fecha a verificar
 * @returns {boolean} True si está vencida
 */
export const esFechaVencida = (fecha) => {
  if (!fecha) return false;
  
  const f = fecha instanceof Date ? fecha : new Date(fecha);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  return f < hoy;
};

/**
 * Normaliza un string (quita espacios y convierte a mayúsculas)
 * @param {string} str - String a normalizar
 * @returns {string} String normalizado
 */
export const normalizeString = (str) => {
  if (!str) return '';
  return str.trim().toUpperCase();
};

/**
 * Capitaliza la primera letra de cada palabra
 * @param {string} str - String a capitalizar
 * @returns {string} String capitalizado
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Trunca un texto a una longitud específicas
 * @param {string} texto - Texto a truncar
 * @param {number} longitud - Longitud máxima
 * @returns {string} Texto truncado
 */
export const truncarTexto = (texto, longitud = 50) => {
  if (!texto) return '';
  if (texto.length <= longitud) return texto;
  return texto.substring(0, longitud) + '...';
};

export default {
  formatearFecha,
  formatearFechaHora,
  formatearMoneda,
  calcularDiasEntre,
  esFechaVencida,
  normalizeString,
  capitalize,
  truncarTexto
};