import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useCurrency } from "@/hooks/use-currency";
import { type TransactionResponse } from "@/api/generated/hooks/openAPIDefinition.schemas";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
  const currencySymbol = useCurrency();

  if (!transaction) return null;

  const isIncome = transaction.categoryType === "INCOME";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            Full details for your transaction from{" "}
            {format(new Date(transaction.transactionDate!), "PPP")}.
          </DialogDescription>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
};
