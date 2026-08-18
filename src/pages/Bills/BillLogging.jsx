import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { MainLayout } from '../../layouts/MainLayout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { FileUpload } from '../../components/upload/FileUpload'
import { Badge } from '../../components/ui/Badge'

const billCategories = ['Utilities', 'Software', 'Operations', 'Travel', 'Office Supplies', 'Other']

export function BillLoggingPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      billType: 'Utilities',
      vendor: '',
      amount: '',
      billingDate: '',
      description: '',
    },
  })
  const [documents, setDocuments] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState('idle')

  const onSubmit = async (data) => {
    if (!documents.length) {
      toast.error('Please upload at least one supporting document.')
      setStatus('error')
      return
    }

    setIsSubmitting(true)
    setStatus('submitting')

    await new Promise((resolve) => setTimeout(resolve, 1200))

    setIsSubmitting(false)
    setStatus('success')
    toast.success('Bill submitted successfully and sent for review.')
    reset()
    setDocuments([])
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">Bill intake</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Log a new bill</h1>
          </div>
          <Badge variant={status === 'success' ? 'success' : status === 'error' ? 'danger' : 'info'}>
            {status === 'success' ? 'Submitted' : status === 'error' ? 'Needs attention' : 'Draft'}
          </Badge>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Bill type / category</label>
                <select
                  {...register('billType', { required: 'Please choose a bill category' })}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  {billCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.billType && <p className="mt-1 text-sm text-red-600">{errors.billType.message}</p>}
              </div>

              <Input
                label="Vendor / supplier"
                placeholder="e.g. Northwind Logistics"
                {...register('vendor', { required: 'Vendor is required' })}
                error={errors.vendor?.message}
              />

              <Input
                label="Amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('amount', {
                  required: 'Amount is required',
                  validate: (value) => Number(value) > 0 || 'Amount must be greater than zero',
                })}
                error={errors.amount?.message}
              />

              <Input
                label="Billing date"
                type="date"
                {...register('billingDate', { required: 'Billing date is required' })}
                error={errors.billingDate?.message}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Description / remarks</label>
              <textarea
                rows={5}
                placeholder="Add the purpose of the invoice, service period, or special notes for reviewers..."
                {...register('description', { required: 'Please provide a description' })}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold text-slate-900">SUPPORTING DOCUMENTS</h3>
              <FileUpload
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onFilesSelected={(files) => setDocuments(files)}
                onUpload={async () => {
                  toast.success(`${documents.length} file(s) attached.`)
                }}
              />
            </div>

            <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-4">
              <Button type="submit" isLoading={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit for processing'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  reset()
                  setDocuments([])
                  setStatus('idle')
                }}
              >
                Reset form
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </MainLayout>
  )
}
