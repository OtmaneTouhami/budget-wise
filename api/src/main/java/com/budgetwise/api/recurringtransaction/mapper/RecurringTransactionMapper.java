package com.budgetwise.api.recurringtransaction.mapper;

import com.budgetwise.api.recurringtransaction.RecurringTransaction;
import com.budgetwise.api.recurringtransaction.dto.RecurringTransactionResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

@Mapper(componentModel = SPRING)
public interface RecurringTransactionMapper {

    @Mapping(target = "scheduleType", source = "scheduleType.name")
    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    RecurringTransactionResponse toDto(RecurringTransaction recurringTransaction);

    List<RecurringTransactionResponse> toDtoList(List<RecurringTransaction> recurringTransactions);
}