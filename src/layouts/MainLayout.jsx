import { Sidebar, Navbar } from '../components/layout/Sidebar'

export function MainLayout({ children }) {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-64">
        <Navbar />
        <main className="flex-1 overflow-y-auto mt-16 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      {children}
    </div>
  )
}
