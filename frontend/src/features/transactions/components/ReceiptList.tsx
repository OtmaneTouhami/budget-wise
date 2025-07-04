import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FileText, Trash2, ExternalLink } from "lucide-react";

import {
  useGetReceiptsForTransaction,
  useDeleteReceipt,
  getGetReceiptsForTransactionQueryKey,
} from "@/api/generated/hooks/receipts/receipts";
import type { ApiErrorResponse } from "@/types/error";
import { Button } from "@/components/ui/button";

interface ReceiptListProps {
  transactionId: string;
}

export const ReceiptList = ({ transactionId }: ReceiptListProps) => {
  const queryClient = useQueryClient();
  const { data: receipts, isLoading } =
    useGetReceiptsForTransaction(transactionId);
  const deleteMutation = useDeleteReceipt();

  const handleDelete = (receiptId: string) => {
    deleteMutation.mutate(
      { receiptId },
      {
        onSuccess: () => {
          toast.success("Receipt deleted.");
          // Invalidate the query to refetch the list
          queryClient.invalidateQueries({
            queryKey: getGetReceiptsForTransactionQueryKey(transactionId),
          });
        },
        onError: (err) => {
          toast.error(
            (err as { data: ApiErrorResponse }).data?.message ||
              "Delete failed."
          );
        },
      }
    );
  };

  if (isLoading)
    return <div className="text-center p-4">Loading receipts...</div>;
  if (!receipts || receipts.length === 0) return null; // Don't render anything if no receipts

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Attached Receipts</h4>
      {receipts.map((receipt) => (
        <div
          key={receipt.id}
          className="flex items-center justify-between rounded-md border p-2"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <FileText className="h-5 w-5 flex-shrink-0" />
            <span className="truncate text-sm" title={receipt.originalFileName}>
              {receipt.originalFileName}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <a href={receipt.fileUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={() => handleDelete(receipt.id!)}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
