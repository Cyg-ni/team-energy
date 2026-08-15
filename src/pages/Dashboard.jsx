import { motion } from 'framer-motion'
import { FaChartLine, FaDollarSign, FaClock, FaExclamationTriangle } from 'react-icons/fa'
import { MainLayout } from '../layouts/MainLayout'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Table } from '../components/tables/Table'
import { mockBills, mockDashboardSummary, mockRecentActivity } from '../utils/mockData'
import { formatCurrency, formatDate } from '../utils/helpers'

function SummaryCard({ icon: Icon, title, value, change, changeType = 'positive' }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium mb-2">{title}</p>
            <h3 className="text-3xl font-bold text-slate-900 mb-3">{value}</h3>
            {change && (
              <p
                className={`text-sm font-medium ${
                  changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {changeType === 'positive' ? '↑' : '↓'} {change}
              </p>
            )}
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <Icon size={24} className="text-blue-600" />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export function DashboardPage() {
  const billColumns = [
    {
      key: 'billNumber',
      label: 'Bill Number',
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'vendor',
      label: 'Vendor',
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value) => formatCurrency(value),
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (value) => formatDate(value),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors = {
          paid: 'success',
          pending: 'warning',
          overdue: 'danger',
        }
        return <Badge variant={colors[value] || 'default'}>{value}</Badge>
      },
    },
  ]

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">Welcome back! Here's your bill summary.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard
            icon={FaDollarSign}
            title="Total Bills"
            value={`$${(mockDashboardSummary.totalAmount / 1000).toFixed(1)}k`}
            change="+12% from last month"
          />
          <SummaryCard
            icon={FaClock}
            title="Pending Bills"
            value={mockDashboardSummary.pendingBills}
            change={formatCurrency(mockDashboardSummary.pendingAmount)}
          />
          <SummaryCard
            icon={FaChartLine}
            title="Paid Bills"
            value={mockDashboardSummary.paidBills}
            change={formatCurrency(mockDashboardSummary.paidAmount)}
          />
          <SummaryCard
            icon={FaExclamationTriangle}
            title="Overdue Bills"
            value={mockDashboardSummary.overdueBills}
            change={formatCurrency(mockDashboardSummary.overdueAmount)}
            changeType="negative"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Bills Table */}
          <div className="lg:col-span-2">
            <Card header="Recent Bills">
              <Table
                columns={billColumns}
                data={mockBills.slice(0, 5)}
              />
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card header="Recent Activity">
              <div className="space-y-4">
                {mockRecentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex gap-3 pb-4 border-b border-slate-200 last:border-b-0 last:pb-0"
                  >
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">
                        {activity.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {activity.description}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="text-center">
              <p className="text-slate-600 text-sm mb-2">Average Bill Amount</p>
              <h3 className="text-2xl font-bold text-slate-900">
                {formatCurrency(
                  mockDashboardSummary.totalAmount / mockDashboardSummary.totalBills
                )}
              </h3>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-slate-600 text-sm mb-2">Payment Success Rate</p>
              <h3 className="text-2xl font-bold text-green-600">
                {(
                  (mockDashboardSummary.paidBills /
                    mockDashboardSummary.totalBills) *
                  100
                ).toFixed(0)}
                %
              </h3>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-slate-600 text-sm mb-2">Days Until Next Due</p>
              <h3 className="text-2xl font-bold text-blue-600">5</h3>
              <p className="text-xs text-slate-500 mt-1">Next bill due on Feb 20</p>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
