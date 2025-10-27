// ==================== src/store/useLibroStore.js ====================
import { create } from 'zustand';

export const useLibroStore = create((set) => ({
  libros: [],
  libroSeleccionado: null,
  loading: false,
  error: null,
  
  setLibros: (libros) => set({ libros }),
  setLibroSeleccionado: (libro) => set({ libroSeleccionado: libro }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  agregarLibro: (libro) => set((state) => ({
    libros: [...state.libros, libro]
  })),
  
  actualizarLibro: (id, libroActualizado) => set((state) => ({
    libros: state.libros.map(libro => 
      libro.id === id ? { ...libro, ...libroActualizado } : libro
    )
  })),
  
  eliminarLibro: (id) => set((state) => ({
    libros: state.libros.filter(libro => libro.id !== id)
  })),
  
  limpiarError: () => set({ error: null })
}));