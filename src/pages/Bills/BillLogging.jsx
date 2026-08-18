import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaUpload, FaCheckCircle } from 'react-icons/fa'
import { MainLayout } from '../../layouts/MainLayout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'

// Simulated OCR extraction function
const extractBillDataFromOCR = (fileName) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        provider: 'BENECO',
        accountNumber: 'ACC-4521-8847-3',
        billingDate: '2026-08-01',
        billingPeriod: 'July 1 - July 31, 2026',
        dueDate: '2026-08-15',
        totalAmount: 3245.50,
        previousReading: 12450,
        currentReading: 12875,
        consumption: 425,
      })
    }, 2000)
  })
}

// Step 1: Upload Image
function UploadStep({ onUploadComplete, isProcessing }) {
  const [preview, setPreview] = useState(null)
  const [fileName, setFileName] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleProcessImage = async () => {
    if (!fileName) {
      toast.error('Please upload an image first')
      return
    }

    const extractedData = await extractBillDataFromOCR(fileName)
    onUploadComplete(extractedData, fileName)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Step 1: Upload Electricity Bill Image</h3>
        <p className="mb-4 text-sm text-slate-600">
          Upload a photo or scan of your electricity bill. Supported formats: JPG, JPEG, PNG
        </p>

        <div className="rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 p-8 text-center">
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
            disabled={isProcessing}
            className="hidden"
            id="bill-upload"
          />
          <label htmlFor="bill-upload" className="cursor-pointer">
            <FaUpload className="mx-auto mb-3 text-3xl text-blue-600" />
            <p className="text-sm font-medium text-slate-900">
              {fileName ? `Selected: ${fileName}` : 'Click to browse or drag and drop'}
            </p>
            <p className="mt-1 text-xs text-slate-500">JPG, JPEG, or PNG (Max 5MB)</p>
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
        <Button onClick={handleProcessImage} isLoading={isProcessing} disabled={!fileName || isProcessing}>
          {isProcessing ? 'Processing with OCR...' : 'Extract Bill Information'}
        </Button>
      </div>
    </div>
  )
}

// Step 2: Validate and Edit OCR Data
function ValidateStep({ ocrData, fileName, onSubmit, isSubmitting, onReset }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      provider: ocrData.provider || '',
      accountNumber: ocrData.accountNumber || '',
      billingDate: ocrData.billingDate || '',
      billingPeriod: ocrData.billingPeriod || '',
      dueDate: ocrData.dueDate || '',
      totalAmount: ocrData.totalAmount || '',
      previousReading: ocrData.previousReading || '',
      currentReading: ocrData.currentReading || '',
      consumption: ocrData.consumption || '',
    },
  })

  const handleFormSubmit = async (data) => {
    await onSubmit(data, fileName)
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
                Bill information has been automatically extracted from your image. Please review and correct any information if needed.
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
            label="Due Date"
            type="date"
            {...register('dueDate', { required: 'Due date is required' })}
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
  const [step, setStep] = useState('upload')
  const [ocrData, setOcrData] = useState(null)
  const [fileName, setFileName] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleUploadComplete = async (extractedData, uploadedFileName) => {
    setIsProcessing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setOcrData(extractedData)
      setFileName(uploadedFileName)
      setStep('validate')
      toast.success('Bill information extracted successfully!')
    } catch (error) {
      toast.error('Failed to process bill image. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleValidateSubmit = async (validatedData, file) => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast.success('Electricity bill saved successfully!')
      console.log('Saved bill data:', validatedData)

      setStep('upload')
      setOcrData(null)
      setFileName(null)
    } catch (error) {
      toast.error('Failed to save bill. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setStep('upload')
    setOcrData(null)
    setFileName(null)
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
              fileName={fileName}
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
