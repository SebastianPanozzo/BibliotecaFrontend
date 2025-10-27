// ==================== src/store/useSocioStore.js ====================
import { create } from 'zustand';

export const useSocioStore = create((set) => ({
  socios: [],
  socioSeleccionado: null,
  loading: false,
  error: null,
  
  setSocios: (socios) => set({ socios }),
  setSocioSeleccionado: (socio) => set({ socioSeleccionado: socio }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  agregarSocio: (socio) => set((state) => ({
    socios: [...state.socios, socio]
  })),
  
  actualizarSocio: (id, socioActualizado) => set((state) => ({
    socios: state.socios.map(socio => 
      socio.id === id ? { ...socio, ...socioActualizado } : socio
    )
  })),
  
  eliminarSocio: (id) => set((state) => ({
    socios: state.socios.filter(socio => socio.id !== id)
  })),
  
  limpiarError: () => set({ error: null })
}));