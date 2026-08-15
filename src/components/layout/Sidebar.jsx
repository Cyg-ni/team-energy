import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  FaFileAlt,
  FaBell,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa'
import { useAuthStore, useUIStore } from '../../store/authStore'
import { Avatar } from '../ui/index'
import { Button } from '../ui/Button'
import { cn } from '../../utils/helpers'

export function Sidebar() {
  const location = useLocation()
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)
  const logout = useAuthStore((state) => state.logout)

  const isActive = (path) => location.pathname === path

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FaFileAlt },
    { path: '/upload-bills', label: 'Upload Bills', icon: FaFileAlt },
    { path: '/alerts', label: 'Alerts', icon: FaBell },
    { path: '/profile', label: 'Profile', icon: FaUser },
    { path: '/settings', label: 'Settings', icon: FaCog },
  ]

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-40 lg:hidden text-slate-700"
      >
        {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white w-64 transition-transform duration-300 z-30 overflow-y-auto flex flex-col',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="px-6 py-8 border-b border-slate-700">
          <h1 className="text-2xl font-bold">TeamEnergy</h1>
          <p className="text-slate-400 text-sm">Bill Management</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    toggleSidebar()
                  }
                }}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                  active
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                )}
              >
                <Icon size={18} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-slate-700">
          <Button
            onClick={logout}
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <FaSignOutAlt size={18} className="mr-2" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  )
}

export function Navbar() {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white border-b border-slate-200 z-20">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left side - empty or add search here */}
        <div></div>

        {/* Right side - notifications and user menu */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative text-slate-600 hover:text-slate-900 transition-colors p-2"
            >
              <FaBell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200">
                <div className="p-4 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-4 text-sm text-slate-600 text-center">
                    No new notifications
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Avatar name={user?.name || 'User'} src={user?.avatar} size="sm" />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200">
                <Link
                  to="/profile"
                  className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 border-b border-slate-200"
                  onClick={() => setUserMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 border-b border-slate-200"
                  onClick={() => setUserMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setUserMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
