package com.budgetwise.api.notification;

import com.budgetwise.api.notification.dto.NotificationResponse;

import java.util.List;
import java.util.UUID;

public interface NotificationService {
    List<NotificationResponse> getMyNotifications();

    void markNotificationAsRead(UUID notificationId);

    void markAllAsRead();
}