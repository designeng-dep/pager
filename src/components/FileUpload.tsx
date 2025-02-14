'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card } from '@/components/ui/card'
import { Upload, FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  maxSize?: number
}

export function FileUpload({ 
  onFileSelect, 
  maxSize = 5 * 1024 * 1024 
}: FileUploadProps) {
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null)
    const file = acceptedFiles[0]

    if (!file) {
      setError('No file selected')
      return
    }

    if (!file.type.includes('pdf')) {
      setError('Please upload a PDF file')
      return
    }

    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSize / (1024 * 1024)}MB`)
      return
    }

    setCurrentFile(file)
    onFileSelect(file)
    
    // Simulate upload progress
    setUploading(true)
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        setUploading(false)
      }
    }, 200)
  }, [maxSize, onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  })

  const removeFile = () => {
    setCurrentFile(null)
    setUploadProgress(0)
    setError(null)
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {!currentFile ? (
        <Card 
          {...getRootProps()} 
          className={`
            p-8 
            border-2 
            border-dashed 
            hover:border-primary 
            transition-colors 
            cursor-pointer
            relative
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                {isDragActive ? 'Drop your PDF here' : 'Upload your proposal'}
              </h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop your PDF file here or click to browse
              </p>
            </div>
            <div className="border rounded-lg px-4 py-2 bg-background/50">
              <p className="text-xs text-muted-foreground">
                Max file size: {maxSize / (1024 * 1024)}MB
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium truncate max-w-[200px]">
                  {currentFile.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {(currentFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={removeFile}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {uploading && (
            <div className="mt-4 space-y-2">
              <Progress value={uploadProgress} />
              <p className="text-sm text-muted-foreground text-center">
                Processing file...
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}