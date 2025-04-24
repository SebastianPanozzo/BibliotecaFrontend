import { create } from 'zustand';

const useStore = create((set, get) => ({
  storage: {}, 
  saveInStorage: (obj) => set((state) => ({ storage: { ...state.storage, ...obj } })),
  getStorage: () => get().storage, 
  getItemFromStorage: (key) => {
    const value = get().storage[key]; 
    set((state) => {
      const newStorage = { ...state.storage };
      delete newStorage[key]; 
      return { storage: newStorage };
    });
    return value; 
  },
}));


export default useStore;