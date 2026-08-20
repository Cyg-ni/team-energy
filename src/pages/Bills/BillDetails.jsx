import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MainLayout } from '../../layouts/MainLayout'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { billsService } from '../../services/api'
import { formatDateTime } from '../../utils/helpers'

const formatPeso = (amount) =>
  amount == null ? '—' : new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount)

const formatDateOrDash = (value) =>
  value ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(value)) : '—'

const variantMap = {
  UPLOADED: 'slate',
  EXTRACTED: 'slate',
  VALIDATED: 'info',
  SUBMITTED: 'info',
  APPROVED: 'success',
  PAID: 'success',
  REJECTED: 'danger',
}

export function BillDetailsPage() {
  const { id } = useParams()
  const [bill, setBill] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    billsService
      .getById(id)
      .then((res) => setBill(res.data))
      .catch((err) => setError(err.response?.data?.message || 'This invoice could not be located in the system.'))
      .finally(() => setIsLoading(false))
  }, [id])

  if (isLoading) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-slate-600">Loading bill...</p>
        </div>
      </MainLayout>
    )
  }

  if (error || !bill) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Bill not found</h1>
          <p className="mt-3 text-slate-600">{error || 'This invoice could not be located in the system.'}</p>
          <Link to="/bills/history" className="mt-6 inline-block">
            <Button>Back to history</Button>
          </Link>
        </div>
      </MainLayout>
    )
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
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card header="Bill information">
            <div className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-500">Provider</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{bill.provider}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Department</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{bill.departmentName || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Account number</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{bill.accountNumber || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Amount</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{formatPeso(bill.totalAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Billing date</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{formatDateOrDash(bill.billingDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Billing period</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{bill.billingPeriod || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Due date</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{formatDateOrDash(bill.dueDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Consumption</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{bill.consumption} kWh</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Previous / current reading</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {bill.previousReading ?? '—'} → {bill.currentReading ?? '—'} kWh
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Reduction vs baseline</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {bill.reductionPercentVsBaseline == null ? '—' : `${bill.reductionPercentVsBaseline.toFixed(1)}%`}
                  </p>
                </div>
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

          <Card header="OCR source">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="font-medium text-slate-700">
                  {bill.ocrExtracted ? 'Extracted via OCR' : 'Entered manually'}
                </span>
                {bill.ocrConfidence != null && (
                  <Badge variant="info">{Math.round(bill.ocrConfidence * 100)}% confidence</Badge>
                )}
              </div>
            </div>
          </Card>
        </div>

        <Card header="Processing history">
          <div className="space-y-5">
            {(bill.timeline || []).map((item, index) => (
              <div key={`${item.status}-${index}`} className="flex gap-4 rounded-xl border border-slate-200 p-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                    {index + 1}
                  </div>
                  {index < bill.timeline.length - 1 && <div className="mt-2 h-full w-px bg-slate-200" />}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <Badge variant={variantMap[item.status?.toUpperCase()] || 'default'}>{item.status}</Badge>
                    <span className="text-xs uppercase tracking-wide text-slate-400">{formatDateTime(item.occurredAt)}</span>
                  </div>
                  <p className="mt-3 font-medium text-slate-900">Responsible: {item.actor}</p>
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
