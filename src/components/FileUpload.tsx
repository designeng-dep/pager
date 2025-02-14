'use client'

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  maxSize: number;
}

export function FileUpload({ onFileSelect, maxSize }: FileUploadProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size <= maxSize) {
      onFileSelect(file);
    } else {
      alert('File is too large');
    }
  };

  return (
    <div className="flex justify-center">
      <input
        type="file"
        accept=".pdf"
        onChange={handleChange}
        className="block w-full max-w-md text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />
    </div>
  );
} 