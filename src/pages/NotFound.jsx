import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Page Not Found
          </h2>
          <p className="text-slate-600 mb-8">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-3">
          <Link to="/dashboard">
            <Button className="w-full">
              Go to Dashboard
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" className="w-full">
              Back to Login
            </Button>
          </Link>
        </div>

        <div className="mt-12">
          <div className="text-6xl opacity-20">
            😕
          </div>
        </div>
      </div>
    </div>
  )
}
