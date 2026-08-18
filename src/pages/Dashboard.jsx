import { motion } from 'framer-motion'
import {
  FaArrowRight,
  FaChartBar,
  FaCheckCircle,
  FaClock,
  FaFileInvoiceDollar,
  FaSpinner,
  FaTimesCircle,
} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Table } from '../components/tables/Table'
import {
  mockBillHistory,
  mockDashboardMetrics,
  mockRecentActivity,
} from '../utils/mockData'
import { formatCurrency, formatDate } from '../utils/helpers'

const summaryConfig = [
  {
    title: 'Total Bills',
    value: mockDashboardMetrics.totalBills,
    detail: '$142.8K Total Value',
    icon: FaFileInvoiceDollar,
    accent: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Pending Bills',
    value: mockDashboardMetrics.pendingBills,
    detail: '$24.6K awaiting review',
    icon: FaClock,
    accent: 'bg-amber-100 text-amber-600',
  },
  {
    title: 'Processing Bills',
    value: mockDashboardMetrics.processingBills,
    detail: '18 in OCR & validation',
    icon: FaSpinner,
    accent: 'bg-cyan-100 text-cyan-600',
  },
  {
    title: 'Completed Bills',
    value: mockDashboardMetrics.completedBills,
    detail: '87% completion rate',
    icon: FaCheckCircle,
    accent: 'bg-emerald-100 text-emerald-600',
  },
  {
    title: 'Rejected/Failed',
    value: mockDashboardMetrics.rejectedBills,
    detail: '4 require attention',
    icon: FaTimesCircle,
    accent: 'bg-rose-100 text-rose-600',
  },
]

function SummaryCard({ icon: Icon, title, value, detail, accent }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 250 }}>
      <Card className="h-full">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h3 className="mt-3 text-3xl font-bold text-slate-900">{value}</h3>
            <p className="mt-2 text-sm text-slate-500">{detail}</p>
          </div>
          <div className={`rounded-xl p-3 ${accent}`}>
            <Icon size={22} />
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
      label: 'Bill #',
      render: (value) => <span className="font-semibold text-slate-900">{value}</span>,
    },
    {
      key: 'vendor',
      label: 'Vendor',
    },
    {
      key: 'category',
      label: 'Category',
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value) => formatCurrency(value),
    },
    {
      key: 'billingDate',
      label: 'Billing Date',
      render: (value) => formatDate(value),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const statusMap = {
          Submitted: 'info',
          'In Review': 'warning',
          Processing: 'slate',
          Approved: 'success',
          Rejected: 'danger',
          Paid: 'success',
        }
        return <Badge variant={statusMap[value] || 'default'}>{value}</Badge>
      },
    },
  ]

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">Overview</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">Finance dashboard</h1>
          </div>
          <div className="flex gap-3">
            <Link to="/bills/logging">
              <Button>Log a new bill</Button>
            </Link>
            <Link to="/bills/history">
              <Button variant="secondary">View history</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
          {summaryConfig.map((item) => (
            <SummaryCard key={item.title} {...item} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">
          <Card header="Recent bill activity">
            <Table columns={billColumns} data={mockBillHistory.slice(0, 5)} />
          </Card>

          <Card header="Processing status overview">
            <div className="space-y-4">
              {[
                { label: 'Submitted', value: 18, color: 'bg-blue-500', width: '80%' },
                { label: 'In review', value: 11, color: 'bg-amber-500', width: '62%' },
                { label: 'Processing', value: 14, color: 'bg-cyan-500', width: '52%' },
                { label: 'Approved', value: 67, color: 'bg-emerald-500', width: '92%' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-600">{item.label}</span>
                    <span className="text-slate-900 font-semibold">{item.value}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100">
                    <div className={`${item.color} h-full rounded-full`} style={{ width: item.width }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card header="Quick actions">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {[
                { label: 'New bill', link: '/bills/logging', variant: 'primary' },
                { label: 'History', link: '/bills/history', variant: 'secondary' },
                { label: 'Settings', link: '/settings', variant: 'secondary' },
                { label: 'Approvals', link: '/bills/history', variant: 'outline' },
                { label: 'Reports', link: '/dashboard', variant: 'outline' },
              ].map((action) => (
                <Link key={action.label} to={action.link}>
                  <Button variant={action.variant} className="w-full justify-between rounded-xl">
                    <span>{action.label}</span>
                    <FaArrowRight size={12} />
                  </Button>
                </Link>
              ))}
            </div>
          </Card>

          <Card header="Recent notifications">
            <div className="space-y-4">
              {mockRecentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-3 border-b border-slate-200 pb-3 last:border-0 last:pb-0">
                  <div className="mt-1 rounded-full bg-blue-100 p-2 text-blue-600">
                    <FaChartBar size={12} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{activity.description}</p>
                    <p className="mt-2 text-[11px] uppercase tracking-wide text-slate-400">
                      {new Date(activity.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
