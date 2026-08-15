import { useState } from 'react'
import { FaUpload, FaTimes, FaFile, FaFileAlt } from 'react-icons/fa'
import { Button } from '../ui/Button'
import { Alert, Loader } from '../ui/index'
import { cn } from '../../utils/helpers'

export function FileUpload({
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = true,
  onFilesSelected,
  onUpload,
  className,
}) {
  const [files, setFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)
  const [uploadProgress, setUploadProgress] = useState({})

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleFiles = (newFiles) => {
    setError(null)
    const validFiles = []

    newFiles.forEach((file) => {
      const extension = `.${file.name.split('.').pop().toLowerCase()}`

      // Validate file size
      if (file.size > maxSize) {
        setError(
          `${file.name} is too large. Maximum size is ${maxSize / 1024 / 1024}MB`
        )
        return
      }

      // Validate file type
      if (!accept.split(',').some((type) => type.trim().toLowerCase() === extension)) {
        setError(
          `${file.name} is not a supported format. Accepted: ${accept}`
        )
        return
      }

      validFiles.push(file)
    })

    if (!multiple && validFiles.length > 0) {
      setFiles([validFiles[0]])
      onFilesSelected?.([validFiles[0]])
    } else if (multiple) {
      setFiles((prev) => [...prev, ...validFiles])
      onFilesSelected?.([...files, ...validFiles])
    }
  }

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onFilesSelected?.(newFiles)
  }

  const handleSelectFiles = (e) => {
    handleFiles(Array.from(e.target.files))
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select at least one file')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Simulate upload progress
      files.forEach((file, idx) => {
        setUploadProgress((prev) => ({ ...prev, [idx]: 0 }))

        // Simulate progress
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            const current = prev[idx] || 0
            if (current >= 100) {
              clearInterval(interval)
              return prev
            }
            return { ...prev, [idx]: current + Math.random() * 50 }
          })
        }, 500)
      })

      // Call the onUpload callback with files
      await onUpload?.(files)

      setFiles([])
      setUploadProgress({})
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase()
    return ['pdf'].includes(extension) ? <FaFileAlt /> : <FaFile />
  }

  const getFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className={cn('w-full', className)}>
      {error && (
        <Alert
          variant="danger"
          title="Upload Error"
          description={error}
          onClose={() => setError(null)}
          className="mb-4"
        />
      )}

      {/* Drag and Drop Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 mb-4',
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-300 bg-white hover:border-slate-400'
        )}
      >
        <FaUpload className="mx-auto mb-3 text-slate-400 w-12 h-12" />
        <p className="text-slate-900 font-medium mb-1">
          Drag and drop your files here
        </p>
        <p className="text-slate-500 text-sm mb-4">
          or click to browse
        </p>

        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleSelectFiles}
          className="hidden"
          id="file-input"
        />

        <label htmlFor="file-input">
          <Button as="span" variant="primary" size="sm">
            Choose Files
          </Button>
        </label>

        <p className="text-slate-400 text-xs mt-3">
          Supported formats: {accept}
        </p>
      </div>

      {/* Files List */}
      {files.length > 0 && (
        <div className="space-y-2 mb-4">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="text-slate-400 text-lg">
                  {getFileIcon(file.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {getFileSize(file.size)}
                  </p>

                  {/* Progress Bar */}
                  {uploadProgress[idx] !== undefined && (
                    <div className="mt-2 w-full bg-slate-200 rounded-full h-1">
                      <div
                        className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(uploadProgress[idx], 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeFile(idx)}
                disabled={isUploading}
                className="text-slate-400 hover:text-slate-600 disabled:opacity-50 ml-2"
              >
                <FaTimes size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      {files.length > 0 && (
        <div className="flex gap-2">
          <Button
            onClick={handleUpload}
            isLoading={isUploading}
            disabled={files.length === 0}
            size="lg"
          >
            {isUploading ? 'Uploading...' : `Upload ${files.length} ${files.length === 1 ? 'File' : 'Files'}`}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setFiles([])
              setUploadProgress({})
            }}
            disabled={isUploading}
            size="lg"
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  )
}
