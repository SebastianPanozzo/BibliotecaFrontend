// ==================== src/store/usePrestamoStore.js ====================
import { create } from 'zustand';

export const usePrestamoStore = create((set) => ({
  prestamos: [],
  prestamoSeleccionado: null,
  loading: false,
  error: null,
  
  setPrestamos: (prestamos) => set({ prestamos }),
  setPrestamoSeleccionado: (prestamo) => set({ prestamoSeleccionado: prestamo }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  agregarPrestamo: (prestamo) => set((state) => ({
    prestamos: [...state.prestamos, prestamo]
  })),
  
  actualizarPrestamo: (id, prestamoActualizado) => set((state) => ({
    prestamos: state.prestamos.map(prestamo => 
      prestamo.id === id ? { ...prestamo, ...prestamoActualizado } : prestamo
    )
  })),
  
  eliminarPrestamo: (id) => set((state) => ({
    prestamos: state.prestamos.filter(prestamo => prestamo.id !== id)
  })),
  
  limpiarError: () => set({ error: null })
}));
