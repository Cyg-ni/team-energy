import { create } from 'zustand'
import { authService } from '../services/api'

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authService.login(email, password)
      const { user, token } = response.data
      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(user))
      set({ user, isLoading: false })
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  logout: async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      set({ user: null, error: null })
    }
  },

  setUser: (user) => set({ user }),
  clearError: () => set({ error: null }),
}))

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
