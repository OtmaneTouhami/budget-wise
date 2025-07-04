import { TransactionsTable } from "@/features/transactions/components/TransactionsTable";
import { Separator } from "@/components/ui/separator";

export const TransactionsPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
                <p className="text-sm text-muted-foreground">
                    View and manage all your income and expenses.
                </p>
            </div>
            
            {/* We will add the templates section here later */}
            <Separator />
            
            <TransactionsTable />
        </div>
    );
};