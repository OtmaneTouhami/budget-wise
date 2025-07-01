package com.budgetwise.api.transaction.mapper;

import com.budgetwise.api.transaction.Transaction;
import com.budgetwise.api.transaction.dto.TransactionResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

@Mapper(componentModel = SPRING)
public interface TransactionMapper {

    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "categoryType", source = "category.categoryType")
    TransactionResponse toDto(Transaction transaction);

    List<TransactionResponse> toDtoList(List<Transaction> transactions);

}
