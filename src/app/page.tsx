// src/app/page.tsx
'use client'

import { FileUpload } from '@/components/FileUpload'

export default function Home() {
  const handleFileSelect = async (file: File) => {
    // Here we'll later add the logic to process the PDF
    console.log('Selected file:', file.name)
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-8">
        Proposal Evaluator
      </h1>
      <FileUpload 
        onFileSelect={handleFileSelect}
        maxSize={5 * 1024 * 1024} // 5MB
      />
    </div>
  )
}