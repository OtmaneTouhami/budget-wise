// --- File: frontend/src/features/notifications/components/NotificationItem.tsx ---
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

import { cn } from "@/lib/utils";
import {
  useMarkAsRead,
  getGetMyNotificationsQueryKey,
} from "@/api/generated/hooks/notifications/notifications";
import type { NotificationResponse } from "@/api/generated/hooks/openAPIDefinition.schemas";
import type { ApiErrorResponse } from "@/types/error";
import { Button } from "@/components/ui/button";

interface NotificationItemProps {
  notification: NotificationResponse;
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  const queryClient = useQueryClient();
  const markAsReadMutation = useMarkAsRead();

  const handleMarkAsRead = () => {
    markAsReadMutation.mutate(
      { id: notification.id! },
      {
        onSuccess: () => {
          toast.success("Notification marked as read.");
          queryClient.invalidateQueries({
            queryKey: getGetMyNotificationsQueryKey(),
          });
        },
        onError: (err) =>
          toast.error((err as { data: ApiErrorResponse }).data.message),
      }
    );
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-lg",
        !notification.read && "bg-primary/5"
      )}
    >
      {!notification.read && (
        <span className="flex h-2.5 w-2.5 translate-y-1 rounded-full bg-primary" />
      )}
      <div className="grid gap-1 flex-1">
        <p className="text-sm font-medium leading-none">
          {notification.message}
        </p>
        <p className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(notification.createdAt!), {
            addSuffix: true,
          })}
        </p>
      </div>
      {!notification.read && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleMarkAsRead}
          disabled={markAsReadMutation.isPending}
        >
          Mark as Read
        </Button>
      )}
    </div>
  );
};
