import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      tenant: null,
      setAuth: (user, token, tenant) => set({ user, token, tenant }),
      logout: () => set({ user: null, token: null, tenant: null }),
    }),
    { name: 'smartcare-auth' }
  )
);

export const useAppStore = create((set) => ({
  currentBranch: null,
  setCurrentBranch: (branch) => set({ currentBranch: branch }),
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
    }),
    { name: 'smartcare-theme' }
  )
);