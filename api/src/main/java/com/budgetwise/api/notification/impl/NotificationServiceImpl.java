package com.budgetwise.api.notification.impl;

import com.budgetwise.api.exception.ResourceNotFoundException;
import com.budgetwise.api.notification.Notification;
import com.budgetwise.api.notification.NotificationRepository;
import com.budgetwise.api.notification.NotificationService;
import com.budgetwise.api.notification.dto.NotificationResponse;
import com.budgetwise.api.notification.mapper.NotificationMapper;
import com.budgetwise.api.user.User;
import com.budgetwise.api.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;

    @Override
    public List<NotificationResponse> getMyNotifications() {
        User currentUser = getCurrentUser();
        return notificationMapper.toDtoList(notificationRepository.findByUserOrderByCreatedAtDesc(currentUser));
    }

    @Override
    @Transactional
    public void markNotificationAsRead(UUID notificationId) {
        User currentUser = getCurrentUser();
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You do not have permission to access this notification");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    // I need to move getCurrentUser() to a shared utility class later
    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }
}
