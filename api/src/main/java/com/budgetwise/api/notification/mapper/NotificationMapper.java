package com.budgetwise.api.notification.mapper;

import com.budgetwise.api.notification.Notification;
import com.budgetwise.api.notification.dto.NotificationResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

@Mapper(componentModel = SPRING)
public interface NotificationMapper {

    @Mapping(target = "isRead", source = "read")
    NotificationResponse toDto(Notification notification);

    List<NotificationResponse> toDtoList(List<Notification> notifications);
}