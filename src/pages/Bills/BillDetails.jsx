import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MainLayout } from '../../layouts/MainLayout'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { mockBillHistory } from '../../utils/mockData'
import { formatCurrency, formatDateTime } from '../../utils/helpers'

export function BillDetailsPage() {
  const { id } = useParams()
  const bill = useMemo(() => mockBillHistory.find((item) => item.id === id), [id])

  if (!bill) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Bill not found</h1>
          <p className="mt-3 text-slate-600">This invoice could not be located in the system.</p>
          <Link to="/bills/history" className="mt-6 inline-block">
            <Button>Back to history</Button>
          </Link>
        </div>
      </MainLayout>
    )
  }

  const variantMap = {
    Submitted: 'info',
    'In Review': 'warning',
    Processing: 'slate',
    Approved: 'success',
    Rejected: 'danger',
    Paid: 'success',
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">Bill details</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">{bill.billNumber}</h1>
          </div>
          <div className="flex gap-3">
            <Link to="/bills/history">
              <Button variant="secondary">Back to history</Button>
            </Link>
            <Button>Take action</Button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card header="Bill information">
            <div className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-500">Vendor</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{bill.vendor}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Category</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{bill.category}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Amount</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{formatCurrency(bill.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Billing date</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{new Date(bill.billingDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500">Description</p>
                <p className="mt-2 rounded-xl bg-slate-50 p-4 text-slate-700">{bill.description}</p>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="text-sm text-slate-500">Current status</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{bill.status}</p>
                </div>
                <Badge variant={variantMap[bill.status] || 'default'}>{bill.status}</Badge>
              </div>
            </div>
          </Card>

          <Card header="Uploaded documents">
            <div className="space-y-3">
              {bill.documents.map((document) => (
                <div key={document} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="font-medium text-slate-700">{document}</span>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card header="Processing history">
          <div className="space-y-5">
            {bill.timeline.map((item, index) => (
              <div key={`${item.status}-${index}`} className="flex gap-4 rounded-xl border border-slate-200 p-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                    {index + 1}
                  </div>
                  {index < bill.timeline.length - 1 && <div className="mt-2 h-full w-px bg-slate-200" />}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <Badge variant={variantMap[item.status] || 'default'}>{item.status}</Badge>
                    <span className="text-xs uppercase tracking-wide text-slate-400">{formatDateTime(item.date)}</span>
                  </div>
                  <p className="mt-3 font-medium text-slate-900">Responsible: {item.user}</p>
                  <p className="mt-1 text-slate-600">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}
