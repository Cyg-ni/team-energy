import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MainLayout } from '../../layouts/MainLayout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { Table } from '../../components/tables/Table'
import { mockBillHistory } from '../../utils/mockData'
import { formatCurrency, formatDate } from '../../utils/helpers'

const statusOptions = ['All', 'Submitted', 'In Review', 'Processing', 'Approved', 'Rejected', 'Paid']

export function BillHistoryPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [vendorFilter, setVendorFilter] = useState('')

  const filteredBills = useMemo(() => {
    return mockBillHistory.filter((bill) => {
      const matchesSearch =
        bill.billNumber.toLowerCase().includes(search.toLowerCase()) ||
        bill.vendor.toLowerCase().includes(search.toLowerCase()) ||
        bill.description.toLowerCase().includes(search.toLowerCase())

      const matchesStatus = statusFilter === 'All' || bill.status === statusFilter
      const matchesVendor = !vendorFilter || bill.vendor.toLowerCase().includes(vendorFilter.toLowerCase())

      return matchesSearch && matchesStatus && matchesVendor
    })
  }, [search, statusFilter, vendorFilter])

  const billColumns = [
    { key: 'billNumber', label: 'Bill #', render: (value) => <span className="font-semibold text-slate-900">{value}</span> },
    { key: 'vendor', label: 'Vendor' },
    { key: 'category', label: 'Category' },
    { key: 'amount', label: 'Amount', render: (value) => formatCurrency(value) },
    { key: 'billingDate', label: 'Date', render: (value) => formatDate(value) },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const variants = {
          Submitted: 'info',
          'In Review': 'warning',
          Processing: 'slate',
          Approved: 'success',
          Rejected: 'danger',
          Paid: 'success',
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
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">Processing</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Bill history</h1>
          </div>
          <Link to="/bills/logging">
            <Button>Log a new bill</Button>
          </Link>
        </div>

        <Card>
          <div className="grid gap-4 md:grid-cols-4">
            <Input label="Search" placeholder="Bill, vendor, notes" value={search} onChange={(e) => setSearch(e.target.value)} />
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <Input label="Vendor" placeholder="Filter vendor" value={vendorFilter} onChange={(e) => setVendorFilter(e.target.value)} />
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Date range</label>
              <input type="date" className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
          </div>
        </Card>

        <Card header="Submitted bills">
          <Table
            columns={billColumns}
            data={filteredBills}
            onRowClick={(row) => navigate(`/bills/${row.id}`)}
            empty={<div className="py-8 text-center text-slate-500">No bills match your current filters.</div>}
          />
        </Card>
      </div>
    </MainLayout>
  )
}
