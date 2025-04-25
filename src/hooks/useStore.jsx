import { create } from 'zustand';

const useStore = create((set, get) => ({
  storage: {},

  // Guarda uno o varios pares clave/valor
  save: (data) => {
    set((state) => ({
      storage: { ...state.storage, ...data },
    }));
  },

  // Devuelve el storage completo
  get: () => get().storage,

  remove: (key) => {
    const { [key]: _, ...rest } = get().storage;
    set({ storage: rest });
  },
}));


export default useStore;