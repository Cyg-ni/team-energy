import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  FaFileInvoiceDollar,
  FaHistory,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaShieldAlt,
  FaHome,
  FaBell,
  FaUser,
  FaClipboardCheck,
} from 'react-icons/fa'
import { useAuthStore, useUIStore } from '../../store/authStore'
import { Avatar } from '../ui/index'
import { Button } from '../ui/Button'
import { cn } from '../../utils/helpers'

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)

  const roleMenus = {
    Admin: [
      { path: '/dashboard', label: 'Dashboard', icon: FaHome },
      { path: '/bills/logging', label: 'Upload Electricity Bill', icon: FaFileInvoiceDollar },
      { path: '/bills/history', label: 'Bill History', icon: FaHistory },
      { path: '/approvals', label: 'Review Approvals', icon: FaClipboardCheck },
      { path: '/organization-accounts', label: 'Organization Accounts', icon: FaShieldAlt },
      { path: '/settings', label: 'Settings', icon: FaCog },
    ],
    Approver: [
      { path: '/dashboard', label: 'Dashboard', icon: FaHome },
      { path: '/approvals', label: 'Review Approvals', icon: FaClipboardCheck },
      { path: '/bills/history', label: 'Bill History', icon: FaHistory },
      { path: '/settings', label: 'Settings', icon: FaCog },
    ],
    Staff: [
      { path: '/dashboard', label: 'Dashboard', icon: FaHome },
      { path: '/bills/logging', label: 'Upload Electricity Bill', icon: FaFileInvoiceDollar },
      { path: '/bills/history', label: 'Bill History', icon: FaHistory },
      { path: '/settings', label: 'Settings', icon: FaCog },
    ],
    Viewer: [
      { path: '/dashboard', label: 'Dashboard', icon: FaHome },
      { path: '/bills/history', label: 'Bill History', icon: FaHistory },
      { path: '/settings', label: 'Settings', icon: FaCog },
    ],
  }

  const menuItems = roleMenus[user?.role] || roleMenus.Staff

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`)

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-40 lg:hidden text-slate-700"
      >
        {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {sidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white w-64 transition-transform duration-300 z-30 overflow-y-auto flex flex-col',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="px-6 py-8 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-lg font-bold text-white shadow-lg">
              N
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wide">Northstar</h1>
              <p className="text-xs text-slate-400">Bill Management</p>
            </div>
          </div>
        </div>

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
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                )}
              >
                <Icon size={17} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="px-4 py-4 border-t border-slate-700">
          <Button
            onClick={async () => {
              await logout()
              navigate('/login')
            }}
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
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white border-b border-slate-200 z-20">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2">
            <FaBell className="text-slate-500" size={14} />
            <span className="text-sm font-medium text-slate-600">Operations Overview</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative text-slate-600 hover:text-slate-900 transition-colors p-2"
            >
              <FaBell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200">
                <div className="p-4 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-4 text-sm text-slate-600 text-center">
                    3 approvals require attention.
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Avatar name={user?.name || 'User'} src={user?.avatar} size="sm" />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.role}</p>
              </div>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200">
                <Link
                  to="/settings"
                  className="flex items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 border-b border-slate-200"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <FaUser size={14} />
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
                  onClick={async () => {
                    await logout()
                    setUserMenuOpen(false)
                    navigate('/login')
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
