import * as React from "react";
import { toast } from "sonner";
import { UploadCloud, File, X } from "lucide-react";

import { useUploadReceipt } from "@/api/generated/hooks/receipts/receipts";
import type { ApiErrorResponse } from "@/types/error";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ReceiptUploaderProps {
  transactionId: string;
  onUploadSuccess: () => void;
}

export const ReceiptUploader = ({ transactionId, onUploadSuccess }: ReceiptUploaderProps) => {
  const uploadMutation = useUploadReceipt();
  
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    // Create a preview URL when a file is selected
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      // Clean up the object URL when the component unmounts or file changes
      return () => URL.revokeObjectURL(objectUrl);
    }
    setPreview(null);
  }, [file]);

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile) return;
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    uploadMutation.mutate(
      { transactionId, data: formData },
      {
        onSuccess: () => {
          toast.success("Receipt uploaded successfully!");
          onUploadSuccess();
          setFile(null); // Reset after successful upload
        },
        onError: (err) => {
          toast.error((err as { data: ApiErrorResponse }).data?.message || "Upload failed.");
        },
      }
    );
  };
  
  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };
  
  // If a file is selected, show the preview and upload/cancel buttons
  if (file && preview) {
    return (
      <div className="space-y-2">
        <div className="relative rounded-md border p-2">
          {file.type.startsWith("image/") ? (
            <img src={preview} alt="Receipt preview" className="max-h-48 w-full rounded-md object-contain" />
          ) : (
            <div className="flex flex-col items-center justify-center p-4">
              <File className="h-12 w-12 text-muted-foreground" />
              <p className="text-sm font-medium">{file.name}</p>
            </div>
          )}
          <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={() => setFile(null)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={handleUpload} disabled={uploadMutation.isPending} className="w-full">
          {uploadMutation.isPending ? "Uploading..." : "Confirm and Upload"}
        </Button>
      </div>
    );
  }

  // Otherwise, show the dropzone
  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={cn(
        "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 text-center transition-colors hover:border-primary",
        isDragging && "border-primary bg-primary/10"
      )}
    >
      <UploadCloud className="mb-2 h-8 w-8 text-muted-foreground" />
      <p className="text-sm font-semibold">Click or drag file to upload</p>
      <p className="text-xs text-muted-foreground">PNG, JPG, or PDF (max 5MB)</p>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, application/pdf"
        className="hidden"
        onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
      />
    </div>
  );
};