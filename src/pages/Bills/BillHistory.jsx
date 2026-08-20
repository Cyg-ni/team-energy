import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { MainLayout } from '../../layouts/MainLayout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { Table } from '../../components/tables/Table'
import { billsService } from '../../services/api'

const statusOptions = ['All', 'UPLOADED', 'EXTRACTED', 'VALIDATED', 'SUBMITTED', 'APPROVED', 'REJECTED', 'PAID']
const providerOptions = ['All', 'BENECO', 'NUVELCO', 'MERALCO', 'ILOILO']

// ₱ (PHP), not USD - src/utils/helpers.js's formatCurrency is hardcoded to USD, so amounts
// are formatted directly here instead of reusing it.
const formatPeso = (amount) =>
  amount == null ? '—' : new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount)

const formatDateOrDash = (value) =>
  value ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(value)) : '—'

export function BillHistoryPage() {
  const navigate = useNavigate()
  const [bills, setBills] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [providerFilter, setProviderFilter] = useState('All')

  useEffect(() => {
    billsService
      .getAll()
      .then((res) => setBills(res.data))
      .catch(() => toast.error('Could not load bill history - is the backend running?'))
      .finally(() => setIsLoading(false))
  }, [])

  const filteredBills = useMemo(() => {
    return bills.filter((bill) => {
      const matchesSearch =
        bill.billNumber?.toLowerCase().includes(search.toLowerCase()) ||
        bill.provider?.toLowerCase().includes(search.toLowerCase()) ||
        bill.billingPeriod?.toLowerCase().includes(search.toLowerCase())

      const matchesStatus = statusFilter === 'All' || bill.status === statusFilter
      const matchesProvider = providerFilter === 'All' || bill.provider === providerFilter

      return matchesSearch && matchesStatus && matchesProvider
    })
  }, [bills, search, statusFilter, providerFilter])

  const billColumns = [
    {
      key: 'provider',
      label: 'Provider',
      render: (value) => <span className="font-semibold text-slate-900">{value}</span>,
    },
    {
      key: 'billingPeriod',
      label: 'Billing Period',
    },
    {
      key: 'consumption',
      label: 'Consumption (kWh)',
      render: (value) => <span className="font-medium text-slate-900">{value}</span>,
    },
    {
      key: 'totalAmount',
      label: 'Amount (₱)',
      render: (value) => <span className="font-semibold text-slate-900">{formatPeso(value)}</span>,
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (value) => formatDateOrDash(value),
    },
    {
      key: 'reductionPercentVsBaseline',
      label: 'Reduction vs Baseline',
      render: (value) =>
        value == null ? (
          <span className="text-slate-400">—</span>
        ) : (
          <span className={`inline-flex items-center gap-1 font-medium ${value >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {Math.abs(value).toFixed(1)}% <span>{value >= 0 ? '↓' : '↑'}</span>
          </span>
        ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const variants = {
          SUBMITTED: 'info',
          VALIDATED: 'info',
          APPROVED: 'success',
          PAID: 'success',
          REJECTED: 'danger',
        }
        return <Badge variant={variants[value] || 'default'}>{value}</Badge>
      },
    },
  ]

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">History</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Electricity bill history</h1>
          </div>
          <Link to="/bills/logging">
            <Button>Upload electricity bill</Button>
          </Link>
        </div>

        <Card>
          <div className="grid gap-4 md:grid-cols-4">
            <Input
              label="Search"
              placeholder="Provider, bill #, period"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Provider</label>
              <select
                value={providerFilter}
                onChange={(event) => setProviderFilter(event.target.value)}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                {providerOptions.map((provider) => (
                  <option key={provider} value={provider}>
                    {provider}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Date range</label>
              <input
                type="date"
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </Card>

        <Card header={`Electricity Bills (${filteredBills.length})`}>
          <Table
            columns={billColumns}
            data={filteredBills}
            loading={isLoading}
            onRowClick={(row) => navigate(`/bills/${row.id}`)}
            empty={<div className="py-8 text-center text-slate-500">No electricity bills match your current filters.</div>}
          />
        </Card>
      </div>
    </MainLayout>
  )
}
