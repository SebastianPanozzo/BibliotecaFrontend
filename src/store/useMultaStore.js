// ==================== src/store/useMultaStore.js ====================
import { create } from 'zustand';

export const useMultaStore = create((set) => ({
  multas: [],
  multaSeleccionada: null,
  loading: false,
  error: null,
  estadisticas: null,
  
  setMultas: (multas) => set({ multas }),
  setMultaSeleccionada: (multa) => set({ multaSeleccionada: multa }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setEstadisticas: (estadisticas) => set({ estadisticas }),
  
  agregarMulta: (multa) => set((state) => ({
    multas: [...state.multas, multa]
  })),
  
  actualizarMulta: (id, multaActualizada) => set((state) => ({
    multas: state.multas.map(multa => 
      multa.id === id ? { ...multa, ...multaActualizada } : multa
    )
  })),
  
  limpiarError: () => set({ error: null })
}));
