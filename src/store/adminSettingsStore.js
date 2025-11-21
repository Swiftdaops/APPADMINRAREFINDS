import { create } from 'zustand';
import { adminApi } from '../api/adminApi';
import { toast } from 'sonner';

export const useAdminSettingsStore = create((set) => ({
  themeMode: 'dark', // Default
  loadingTheme: false,

  fetchTheme: async () => {
    set({ loadingTheme: true });
    try {
      const { data } = await adminApi.getTheme();
      set({ themeMode: data.themeMode });
      // Sync with local storage for immediate load next time
      localStorage.setItem('vite-ui-theme', data.themeMode);
      // Apply theme immediately
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(data.themeMode);
    } catch (error) {
      console.error('Failed to fetch theme:', error);
    } finally {
      set({ loadingTheme: false });
    }
  },

  updateTheme: async (mode) => {
    set({ loadingTheme: true });
    try {
      const { data } = await adminApi.updateTheme(mode);
      set({ themeMode: data.themeMode });
      localStorage.setItem('vite-ui-theme', data.themeMode);
      
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(data.themeMode);
      
      toast.success('Theme updated successfully');
    } catch (error) {
      console.error('Failed to update theme:', error);
      toast.error('Failed to update theme');
    } finally {
      set({ loadingTheme: false });
    }
  },
}));
