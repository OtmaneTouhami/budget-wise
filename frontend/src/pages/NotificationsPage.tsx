import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCheck, PartyPopper } from "lucide-react";

import {
  useGetMyNotifications,
  useMarkAllAsRead,
  getGetMyNotificationsQueryKey,
} from "@/api/generated/hooks/notifications/notifications";
import { useAuthStore } from "@/store/auth-store";
import type { ApiErrorResponse } from "@/types/error";
import { NotificationItem } from "@/features/notifications/components/NotificationItem";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const NotificationsPage = () => {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);

  const { data: notifications, isLoading } = useGetMyNotifications({
    query: { enabled: !!accessToken },
  });

  const markAllMutation = useMarkAllAsRead();

  const unreadCount = React.useMemo(
    () => notifications?.filter((n) => !n.read).length || 0,
    [notifications]
  );

  const handleMarkAllAsRead = () => {
    markAllMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("All notifications marked as read.");
        queryClient.invalidateQueries({
          queryKey: getGetMyNotificationsQueryKey(),
        });
      },
      onError: (err) =>
        toast.error((err as { data: ApiErrorResponse }).data.message),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Stay up-to-date with your account activity.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={handleMarkAllAsRead}
            disabled={markAllMutation.isPending}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark All as Read
          </Button>
        )}
      </div>
      <Separator />

      <Card>
        <CardContent className="p-0">
          {isLoading && (
            <p className="p-4 text-center">Loading notifications...</p>
          )}

          {!isLoading && (!notifications || notifications.length === 0) && (
            <div className="flex flex-col items-center justify-center gap-2 p-12 text-center">
              <PartyPopper className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-xl font-semibold">All Caught Up!</h3>
              <p className="text-muted-foreground">
                You have no new notifications.
              </p>
            </div>
          )}

          <div className="divide-y">
            {notifications?.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
