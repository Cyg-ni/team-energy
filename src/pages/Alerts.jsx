import { useState } from 'react'
import toast from 'react-hot-toast'
import { FaExclamationTriangle, FaInfoCircle, FaCheckCircle, FaClock } from 'react-icons/fa'
import { MainLayout } from '../layouts/MainLayout'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { mockAlerts } from '../utils/mockData'
import { formatDate } from '../utils/helpers'

function AlertCard({ alert, onMarkAsRead, onDismiss }) {
  const icons = {
    critical: <FaExclamationTriangle className="w-5 h-5" />,
    warning: <FaClock className="w-5 h-5" />,
    info: <FaInfoCircle className="w-5 h-5" />,
  }

  const colors = {
    critical: 'border-red-200 bg-red-50',
    warning: 'border-yellow-200 bg-yellow-50',
    info: 'border-blue-200 bg-blue-50',
  }

  const iconColors = {
    critical: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
  }

  return (
    <div
      className={`border-l-4 p-4 rounded-lg flex items-start justify-between gap-4 ${colors[alert.type]}`}
    >
      <div className="flex items-start gap-3 flex-1">
        <div className={`flex-shrink-0 ${iconColors[alert.type]}`}>
          {icons[alert.type]}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900">{alert.title}</h3>
            {alert.status === 'unread' && (
              <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full font-medium">
                New
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 mb-2">{alert.description}</p>
          {alert.dueDate && (
            <p className="text-xs text-slate-500">
              Due: {formatDate(alert.dueDate)}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2 flex-shrink-0">
        {alert.status === 'unread' && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              onMarkAsRead(alert.id)
              toast.success('Marked as read')
            }}
          >
            Mark Read
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onDismiss(alert.id)
            toast.success('Alert dismissed')
          }}
        >
          ✕
        </Button>
      </div>
    </div>
  )
}

export function AlertsPage() {
  const [alerts, setAlerts] = useState(mockAlerts)
  const [activeFilter, setActiveFilter] = useState('all')

  const handleMarkAsRead = (id) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id ? { ...alert, status: 'read' } : alert
      )
    )
  }

  const handleDismiss = (id) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
  }

  const filteredAlerts =
    activeFilter === 'all'
      ? alerts
      : alerts.filter((alert) => alert.type === activeFilter)

  const unreadCount = alerts.filter((a) => a.status === 'unread').length

  return (
    <MainLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Alerts</h1>
            <p className="text-slate-600">
              Manage your bill notifications and alerts
            </p>
          </div>
          {unreadCount > 0 && (
            <Badge variant="danger" size="lg">
              {unreadCount} New
            </Badge>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'All Alerts' },
            { value: 'critical', label: 'Critical' },
            { value: 'warning', label: 'Warnings' },
            { value: 'info', label: 'Info' },
          ].map((filter) => (
            <Button
              key={filter.value}
              variant={activeFilter === filter.value ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onMarkAsRead={handleMarkAsRead}
                onDismiss={handleDismiss}
              />
            ))
          ) : (
            <Card>
              <div className="text-center py-12">
                <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  All Caught Up!
                </h3>
                <p className="text-slate-600">
                  {activeFilter === 'all'
                    ? 'You have no alerts at this time.'
                    : `You have no ${activeFilter} alerts.`}
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Alert Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {alerts.filter((a) => a.type === 'critical').length}
              </div>
              <p className="text-sm text-slate-600 mt-2">Critical Alerts</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {alerts.filter((a) => a.type === 'warning').length}
              </div>
              <p className="text-sm text-slate-600 mt-2">Warning Alerts</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {alerts.filter((a) => a.type === 'info').length}
              </div>
              <p className="text-sm text-slate-600 mt-2">Info Alerts</p>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
