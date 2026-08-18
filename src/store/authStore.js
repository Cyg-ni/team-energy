import { create } from 'zustand'

const mockUsers = [
  {
    id: 'u-1001',
    name: 'Alicia Morgan',
    email: 'admin@teamenergy.com',
    role: 'Admin',
    company: 'Northstar Energy',
    department: 'Finance',
    phone: '+1 (415) 521-7781',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'u-1002',
    name: 'David Lee',
    email: 'approver@teamenergy.com',
    role: 'Approver',
    company: 'Northstar Energy',
    department: 'Accounts Payable',
    phone: '+1 (415) 820-4400',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'u-1003',
    name: 'Priya Shah',
    email: 'staff@teamenergy.com',
    role: 'Staff',
    company: 'Northstar Energy',
    department: 'Operations',
    phone: '+1 (415) 890-7752',
    avatar:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80',
  },
]

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const useAuthStore = create((set) => ({
  user: getStoredUser(),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null })

    await new Promise((resolve) => setTimeout(resolve, 600))

    const normalizedEmail = String(email || '').trim().toLowerCase()
    const normalizedPassword = String(password || '')
    const matchedUser = mockUsers.find(
      (user) =>
        user.email.toLowerCase() === normalizedEmail &&
        (normalizedPassword === 'password123' || normalizedPassword === 'admin123')
    )

    if (!matchedUser) {
      set({ isLoading: false, error: 'Invalid email or password.' })
      throw new Error('Invalid email or password.')
    }

    const user = {
      ...matchedUser,
      lastLogin: new Date().toISOString(),
    }

    localStorage.setItem('authToken', 'mock-token')
    localStorage.setItem('user', JSON.stringify(user))
    set({ user, isLoading: false, error: null })
    return { user }
  },

  logout: async () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    set({ user: null, error: null })
  },

  setUser: (user) => set({ user }),
  clearError: () => set({ error: null }),
}))

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
