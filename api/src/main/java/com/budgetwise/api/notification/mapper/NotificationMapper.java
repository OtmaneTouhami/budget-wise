package com.budgetwise.api.notification.mapper;

import com.budgetwise.api.notification.Notification;
import com.budgetwise.api.notification.dto.NotificationResponse;
import org.mapstruct.Mapper;

import java.util.List;

import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

@Mapper(componentModel = SPRING)
public interface NotificationMapper {
    NotificationResponse toDto(Notification notification);

    List<NotificationResponse> toDtoList(List<Notification> notifications);
}