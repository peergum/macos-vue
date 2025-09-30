import { create } from 'zustand';
import { WindowStore, MenuStore } from './types';

// Window store for managing window state and terminals
export const useWindowStore = create<WindowStore>((set, get) => ({
  terminals: {},
  data: JSON.parse(localStorage.getItem('data') || '{}'),
  focused: 0,
  
  setFocused: (index: number) => set({ focused: index }),
  
  setTerminal: (index: number, terminal: any) =>
    set((state) => ({
      terminals: { ...state.terminals, [index]: terminal },
    })),
  
  setData: (index: number, data: any) =>
    set((state) => ({
      data: { ...state.data, [index]: data },
    })),
  
  saveData: () => {
    const state = get();
    localStorage.setItem('data', JSON.stringify(state.data));
  },
}));

// Menu store for managing menu state
export const useMenuStore = create<MenuStore>((set) => ({
  close: false,
  closed: true,
  
  setClose: (close: boolean) => set({ close }),
  setClosed: (closed: boolean) => set({ closed }),
}));
