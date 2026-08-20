import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaUpload, FaCheckCircle } from 'react-icons/fa'
import { MainLayout } from '../../layouts/MainLayout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { billsService, departmentsService } from '../../services/api'

// Step 1: Upload Image
function UploadStep({ onUploadComplete, isProcessing }) {
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    setFile(selected)

    if (selected.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result)
      reader.readAsDataURL(selected)
    } else {
      setPreview(null)
    }
  }

  const handleProcessImage = async () => {
    if (!file) {
      toast.error('Please upload a file first')
      return
    }
    await onUploadComplete(file)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Step 1: Upload Electricity Bill Image</h3>
        <p className="mb-4 text-sm text-slate-600">
          Upload a photo or scan of your electricity bill. Supported formats: JPG, JPEG, PNG, PDF
        </p>

        <div className="rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 p-8 text-center">
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileChange}
            disabled={isProcessing}
            className="hidden"
            id="bill-upload"
          />
          <label htmlFor="bill-upload" className="cursor-pointer">
            <FaUpload className="mx-auto mb-3 text-3xl text-blue-600" />
            <p className="text-sm font-medium text-slate-900">
              {file ? `Selected: ${file.name}` : 'Click to browse or drag and drop'}
            </p>
            <p className="mt-1 text-xs text-slate-500">JPG, JPEG, PNG, or PDF (Max 10MB)</p>
          </label>
        </div>

        {preview && (
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-slate-700">Image Preview</p>
            <img src={preview} alt="Bill preview" className="max-h-80 w-full rounded-xl object-cover" />
          </div>
        )}
      </div>

      <div className="flex gap-3 border-t border-slate-200 pt-4">
        <Button onClick={handleProcessImage} isLoading={isProcessing} disabled={!file || isProcessing}>
          {isProcessing ? 'Processing with OCR...' : 'Extract Bill Information'}
        </Button>
      </div>
    </div>
  )
}

// Step 2: Validate and Edit OCR Data
function ValidateStep({ ocrData, departments, onSubmit, isSubmitting, onReset }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      departmentId: departments[0]?.id ?? '',
      provider: ocrData.provider || '',
      accountNumber: ocrData.accountNumber || '',
      billingDate: ocrData.billingDate || '',
      billingPeriod: ocrData.billingPeriod || '',
      dueDate: ocrData.dueDate || '',
      totalAmount: ocrData.totalAmount ?? '',
      previousReading: ocrData.previousReading ?? '',
      currentReading: ocrData.currentReading ?? '',
      consumption: ocrData.consumption ?? '',
    },
  })

  const handleFormSubmit = async (data) => {
    await onSubmit(data, setError)
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-4 rounded-lg bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <FaCheckCircle className="mt-1 text-lg text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900">OCR Processing Complete</p>
              <p className="mt-1 text-xs text-blue-800">
                Bill information has been automatically extracted from your image. Please review and correct
                any information if needed{ocrData.ocrConfidence != null &&
                  ` (confidence: ${Math.round(ocrData.ocrConfidence * 100)}%)`}
                . Fields OCR couldn't find are left blank - fill those in from the physical bill.
              </p>
            </div>
          </div>
        </div>

        <h3 className="mb-4 text-lg font-semibold text-slate-900">Step 2: Validate Bill Information</h3>
        <p className="mb-6 text-sm text-slate-600">
          The information below was extracted by OCR. Please verify and edit if necessary, then submit.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Department</label>
            <select
              disabled={departments.length === 0}
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              {...register('departmentId', { required: 'Department is required' })}
            >
              {departments.length === 0 && <option value="">Loading departments...</option>}
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {errors.departmentId && <p className="mt-1 text-sm text-red-600">{errors.departmentId.message}</p>}
          </div>

          <Input
            label="Electricity Provider"
            placeholder="e.g. BENECO"
            {...register('provider', { required: 'Provider is required' })}
            error={errors.provider?.message}
          />

          <Input
            label="Account / Customer Number"
            placeholder="e.g. ACC-4521-8847-3"
            {...register('accountNumber', { required: 'Account number is required' })}
            error={errors.accountNumber?.message}
          />

          <Input
            label="Bill Date"
            type="date"
            {...register('billingDate', { required: 'Bill date is required' })}
            error={errors.billingDate?.message}
          />

          <Input
            label="Billing Period"
            placeholder="e.g. July 1 - July 31, 2026"
            {...register('billingPeriod', { required: 'Billing period is required' })}
            error={errors.billingPeriod?.message}
          />

          <Input
            label="Due Date (optional)"
            type="date"
            {...register('dueDate')}
            error={errors.dueDate?.message}
          />

          <Input
            label="Total Amount (₱)"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('totalAmount', {
              required: 'Amount is required',
              validate: (value) => Number(value) > 0 || 'Amount must be greater than zero',
            })}
            error={errors.totalAmount?.message}
          />

          <Input
            label="Previous Meter Reading (kWh)"
            type="number"
            placeholder="e.g. 12450"
            {...register('previousReading', {
              required: 'Previous reading is required',
              validate: (value) => Number(value) >= 0 || 'Reading cannot be negative',
            })}
            error={errors.previousReading?.message}
          />

          <Input
            label="Current Meter Reading (kWh)"
            type="number"
            placeholder="e.g. 12875"
            {...register('currentReading', {
              required: 'Current reading is required',
              validate: (value) => Number(value) >= 0 || 'Reading cannot be negative',
            })}
            error={errors.currentReading?.message}
          />

          <Input
            label="Electricity Consumption (kWh)"
            type="number"
            placeholder="e.g. 425"
            {...register('consumption', {
              required: 'Consumption is required',
              validate: (value) => Number(value) > 0 || 'Consumption must be greater than zero',
            })}
            error={errors.consumption?.message}
          />
        </div>

        <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-4">
          <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? 'Saving Bill...' : 'Submit & Save Bill'}
          </Button>
          <Button type="button" variant="secondary" onClick={onReset} disabled={isSubmitting}>
            Cancel & Start Over
          </Button>
        </div>
      </form>
    </div>
  )
}

export function BillLoggingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState('upload')
  const [ocrData, setOcrData] = useState(null)
  const [documentReference, setDocumentReference] = useState(null)
  const [departments, setDepartments] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    departmentsService
      .getAll()
      .then((res) => setDepartments(res.data))
      .catch(() => toast.error('Could not load departments - is the backend running?'))
  }, [])

  const handleUploadComplete = async (file) => {
    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await billsService.extract(formData)

      setOcrData(response.data)
      setDocumentReference(response.data.documentReference)
      setStep('validate')
      toast.success('Bill information extracted successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process bill image. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleValidateSubmit = async (formData, setError) => {
    setIsSubmitting(true)
    try {
      const payload = {
        departmentId: Number(formData.departmentId),
        provider: formData.provider,
        accountNumber: formData.accountNumber,
        billingDate: formData.billingDate,
        billingPeriod: formData.billingPeriod,
        dueDate: formData.dueDate || null,
        totalAmount: Number(formData.totalAmount),
        previousReading: Number(formData.previousReading),
        currentReading: Number(formData.currentReading),
        consumption: Number(formData.consumption),
        documentReference,
        ocrExtracted: true,
        ocrConfidence: ocrData?.ocrConfidence ?? null,
      }

      const response = await billsService.create(payload)

      toast.success('Electricity bill saved successfully!')
      setStep('upload')
      setOcrData(null)
      setDocumentReference(null)
      navigate(`/bills/${response.data.id}`)
    } catch (error) {
      const fieldErrors = error.response?.data?.fieldErrors
      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, message]) => {
          if (field in formData) {
            setError(field, { type: 'server', message })
          }
        })
        toast.error('Please fix the highlighted fields')
      } else {
        toast.error(error.response?.data?.message || 'Failed to save bill. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setStep('upload')
    setOcrData(null)
    setDocumentReference(null)
    setIsProcessing(false)
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">OCR Bill Upload</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Upload Electricity Bill</h1>
            <p className="mt-1 text-slate-600">
              Upload your electricity bill and let OCR automatically extract the information
            </p>
          </div>
          <Badge variant={step === 'validate' ? 'success' : 'info'}>
            {step === 'validate' ? 'Validating' : 'Upload'}
          </Badge>
        </div>

        <Card>
          {step === 'upload' && (
            <UploadStep onUploadComplete={handleUploadComplete} isProcessing={isProcessing} />
          )}
          {step === 'validate' && ocrData && (
            <ValidateStep
              ocrData={ocrData}
              departments={departments}
              onSubmit={handleValidateSubmit}
              isSubmitting={isSubmitting}
              onReset={handleReset}
            />
          )}
        </Card>
      </div>
    </MainLayout>
  )
}
