import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCurrency } from "@/hooks/use-currency";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const amountSchema = z.object({
  amount: z.number().min(0.01, "Amount must be greater than zero."),
});
type AmountSchema = z.infer<typeof amountSchema>;

interface EnterAmountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: AmountSchema) => void;
  isLoading: boolean;
}

export const EnterAmountModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: EnterAmountModalProps) => {
  const currencySymbol = useCurrency();
  const form = useForm<AmountSchema>({
    resolver: zodResolver(amountSchema),
    defaultValues: { amount: 0 },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Amount</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Amount</FormLabel>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                      {currencySymbol}
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                      className="pl-8"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Creating..." : "Create Transaction"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
