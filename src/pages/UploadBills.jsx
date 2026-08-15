import { useState } from 'react'
import toast from 'react-hot-toast'
import { MainLayout } from '../layouts/MainLayout'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { FileUpload } from '../components/upload/FileUpload'
import { Alert } from '../components/ui/index'

export function UploadBillsPage() {
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [vendorName, setVendorName] = useState('')
  const [billDate, setBillDate] = useState('')

  const handleFilesSelected = (files) => {
    console.log('Files selected:', files)
  }

  const handleUpload = async (files) => {
    if (!vendorName.trim()) {
      toast.error('Please enter vendor name')
      return
    }

    setIsProcessing(true)

    try {
      // Simulate file upload
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newFiles = files.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        vendor: vendorName,
        date: billDate || new Date().toISOString().split('T')[0],
        size: file.size,
        uploadedAt: new Date().toISOString(),
        status: 'processing', // processing, completed, error
      }))

      setUploadedFiles([...uploadedFiles, ...newFiles])
      toast.success(`${files.length} bill(s) uploaded successfully!`)

      // Simulate OCR processing
      setTimeout(() => {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            newFiles.some((nf) => nf.id === f.id)
              ? { ...f, status: 'completed' }
              : f
          )
        )
        toast.success('Bills processed with OCR')
      }, 3000)

      // Reset form
      setVendorName('')
      setBillDate('')
    } catch (error) {
      toast.error('Upload failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRemoveFile = (id) => {
    setUploadedFiles(uploadedFiles.filter((f) => f.id !== id))
    toast.success('File removed')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'text-yellow-600'
      case 'completed':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-slate-600'
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Upload Bills
          </h1>
          <p className="text-slate-600">
            Upload your bills in PDF, JPG, or PNG format. Our OCR system will
            automatically process and extract information.
          </p>
        </div>

        {/* Upload Card */}
        <Card>
          <div className="space-y-6">
            {/* Information Alert */}
            <Alert
              variant="info"
              title="Supported Formats"
              description="PDF, JPG, PNG. Maximum file size: 10MB per file."
            />

            {/* Vendor Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Vendor Name"
                placeholder="e.g., Electric Company, Water Authority"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
              />
              <Input
                label="Bill Date"
                type="date"
                value={billDate}
                onChange={(e) => setBillDate(e.target.value)}
              />
            </div>

            {/* File Upload */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Select Files to Upload
              </h3>
              <FileUpload
                accept=".pdf,.jpg,.jpeg,.png"
                multiple={true}
                maxSize={10 * 1024 * 1024}
                onFilesSelected={handleFilesSelected}
                onUpload={handleUpload}
              />
            </div>
          </div>
        </Card>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <Card header="Uploaded Files">
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{file.name}</p>
                    <p className="text-sm text-slate-600 mt-1">
                      Vendor: {file.vendor} • Date: {file.date}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-2">
                        {file.status === 'processing' && (
                          <>
                            <svg
                              className="animate-spin h-4 w-4 text-yellow-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            <span className="text-xs text-yellow-600 font-medium">
                              Processing with OCR...
                            </span>
                          </>
                        )}
                        {file.status === 'completed' && (
                          <span className="text-xs text-green-600 font-medium">
                            ✓ Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRemoveFile(file.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Tips */}
        <Card>
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">
              💡 Tips for Best Results
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                • Ensure the bill is clearly visible and well-lit in photos
              </li>
              <li>• PDFs should be properly formatted and not encrypted</li>
              <li>• Include vendor information for better processing</li>
              <li>• Upload one bill per transaction for accurate processing</li>
              <li>• Our system will automatically extract amount, date, and vendor</li>
            </ul>
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}
