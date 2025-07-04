import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

import { useCurrency } from "@/hooks/use-currency";
import type { TransactionResponse } from "@/api/generated/hooks/openAPIDefinition.schemas";
import { getGetReceiptsForTransactionQueryKey } from "@/api/generated/hooks/receipts/receipts";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// --- IMPORT THE NEW COMPONENTS ---
import { ReceiptUploader } from "./ReceiptUploader";
import { ReceiptList } from "./ReceiptList";

interface TransactionDetailsModalProps {
  transaction: TransactionResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionDetailsModal = ({
  transaction,
  isOpen,
  onClose,
}: TransactionDetailsModalProps) => {
  const queryClient = useQueryClient();
  const currencySymbol = useCurrency();

  if (!transaction) return null;

  const isIncome = transaction.categoryType === "INCOME";

  // Callback function to invalidate and refetch receipts after an upload
  const handleUploadSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: getGetReceiptsForTransactionQueryKey(transaction.id!),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            Full details for your transaction from{" "}
            {format(new Date(transaction.transactionDate!), "PPP")}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Transaction Info Table (no changes here) */}
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-semibold">Amount</TableCell>
                <TableCell
                  className={cn(
                    "text-right font-bold",
                    isIncome ? "text-green-600" : "text-red-600"
                  )}
                >
                  {isIncome ? "+" : "-"} {currencySymbol}
                  {transaction.amount?.toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Type</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={isIncome ? "default" : "destructive"}
                    className={cn(isIncome && "bg-green-600")}
                  >
                    {transaction.categoryType}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Category</TableCell>
                <TableCell className="text-right">
                  {transaction.categoryName}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Date</TableCell>
                <TableCell className="text-right">
                  {format(new Date(transaction.transactionDate!), "PPP")}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Description</TableCell>
                <TableCell className="text-right whitespace-normal">
                  {transaction.description || "N/A"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Separator />

          {/* --- NEW RECEIPTS SECTION --- */}
          <div className="space-y-4">
            <ReceiptList transactionId={transaction.id!} />
            <ReceiptUploader
              transactionId={transaction.id!}
              onUploadSuccess={handleUploadSuccess}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
