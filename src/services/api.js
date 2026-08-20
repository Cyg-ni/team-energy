import axios from 'axios'

// Create Axios instance with base URL
// This connects to your Spring Boot API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth Endpoints
export const authService = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  register: (data) => api.post('/auth/register', data),
  resetPassword: (email) => api.post('/auth/reset-password', { email }),
}

// Dashboard Endpoints
export const dashboardService = {
  getSummary: () => api.get('/dashboard/summary'),
  getRecentBills: (limit = 5) => api.get(`/dashboard/bills/recent?limit=${limit}`),
  getActivity: () => api.get('/dashboard/activity'),
}

// Bills Endpoints
export const billsService = {
  getAll: (departmentId) =>
    api.get('/bills', { params: departmentId ? { departmentId } : {} }),
  getById: (id) => api.get(`/bills/${id}`),
  // Step 1 of the OCR flow: OCR the uploaded file, get back best-effort extracted fields.
  extract: (formData) =>
    api.post('/bills/extract', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  // Step 2: persist the human-validated fields.
  create: (data) => api.post('/bills', data),
}

// Departments Endpoints
export const departmentsService = {
  getAll: () => api.get('/departments'),
}

// Alerts Endpoints
export const alertsService = {
  getAll: () => api.get('/alerts'),
  markAsRead: (id) => api.put(`/alerts/${id}/read`),
  dismiss: (id) => api.delete(`/alerts/${id}`),
}

// Profile Endpoints
export const profileService = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  changePassword: (data) => api.post('/profile/change-password', data),
  uploadAvatar: (formData) =>
    api.post('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}

export default api
