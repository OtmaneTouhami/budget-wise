import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useGetAllUserTemplates,
  useCreateTemplate,
  getGetAllUserTemplatesQueryKey,
} from "@/api/generated/hooks/transaction-templates/transaction-templates";
import { TemplateCard } from "./TemplateCard";
import { TemplateForm } from "./TemplateForm";
import { useAuthStore } from "@/store/auth-store";
import type { ApiErrorResponse } from "@/types/error";

export const TransactionTemplatesList = () => {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  const accessToken = useAuthStore((state) => state.accessToken);
  const { data: templates, isLoading } = useGetAllUserTemplates({
    query: { enabled: !!accessToken },
  });
  const createTemplateMutation = useCreateTemplate();

  const handleCreateSubmit = (values: any) => {
    createTemplateMutation.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast.success("Template created successfully.");
          queryClient.invalidateQueries({
            queryKey: getGetAllUserTemplatesQueryKey(),
          });
          setIsCreateOpen(false);
        },
        onError: (err) =>
          toast.error((err as { data: ApiErrorResponse }).data.message),
      }
    );
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Quick Add</CardTitle>
          <CardDescription>
            Create transactions from your templates.
          </CardDescription>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
            </DialogHeader>
            <TemplateForm
              onSubmit={handleCreateSubmit}
              isLoading={createTemplateMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading && <p>Loading templates...</p>}
        {!isLoading && templates?.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
            <h3 className="text-xl font-semibold">No Templates Yet</h3>
            <p className="text-muted-foreground">
              Create a template to quickly add frequent transactions.
            </p>
          </div>
        )}
        <div className="flex flex-wrap gap-4">
          {templates?.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
