// Estados de libros
export const ESTADO_LIBRO = {
  DISPONIBLE: 'DISPONIBLE',
  PRESTADO: 'PRESTADO'
};

// Estados de préstamos
export const ESTADO_PRESTAMO = {
  ACTIVO: 'ACTIVO',
  VENCIDO: 'VENCIDO',
  DEVUELTO: 'DEVUELTO'
};

// Estados de multas
export const ESTADO_MULTA = {
  PENDIENTE: 'PENDIENTE',
  PAGADA: 'PAGADA',
  CANCELADA: 'CANCELADA'
};

// Tipos de multas
export const TIPO_MULTA = {
  RETRASO: 'RETRASO',
  DANO: 'DANO',
  PERDIDA: 'PERDIDA',
  OTROS: 'OTROS'
};

// Géneros de libros
export const GENEROS_LIBRO = [
  { value: 'FICCION', label: 'Ficción' },
  { value: 'NO_FICCION', label: 'No Ficción' },
  { value: 'CIENCIA', label: 'Ciencia' },
  { value: 'HISTORIA', label: 'Historia' },
  { value: 'TECNOLOGIA', label: 'Tecnología' },
  { value: 'ARTE', label: 'Arte' },
  { value: 'BIOGRAFIA', label: 'Biografía' },
  { value: 'INFANTIL', label: 'Infantil' },
  { value: 'OTROS', label: 'Otros' }
];

// Configuración de préstamos
export const CONFIG_PRESTAMO = {
  DIAS_DEFAULT: 14,
  DIAS_MINIMO: 1,
  DIAS_MAXIMO: 30,
  MULTA_POR_DIA: 50
};

// Mensajes del sistema
export const MENSAJES = {
  ERROR_CARGAR_DATOS: 'Error al cargar los datos',
  ERROR_GUARDAR: 'Error al guardar',
  ERROR_ELIMINAR: 'Error al eliminar',
  CONFIRMACION_ELIMINAR: '¿Está seguro de eliminar este registro?',
  EXITO_GUARDAR: 'Registro guardado exitosamente',
  EXITO_ELIMINAR: 'Registro eliminado exitosamente'
};

export default {
  ESTADO_LIBRO,
  ESTADO_PRESTAMO,
  ESTADO_MULTA,
  TIPO_MULTA,
  GENEROS_LIBRO,
  CONFIG_PRESTAMO,
  MENSAJES
};