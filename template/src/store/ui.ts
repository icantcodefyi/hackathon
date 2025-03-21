import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface UIState {
  isDarkMode: boolean
  sidebarOpen: boolean
  setDarkMode: (isDark: boolean) => void
  toggleSidebar: () => void
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        isDarkMode: true,
        sidebarOpen: true,
        setDarkMode: (isDark) => set({ isDarkMode: isDark }),
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      }),
      {
        name: 'ui-storage',
      }
    )
  )
) 