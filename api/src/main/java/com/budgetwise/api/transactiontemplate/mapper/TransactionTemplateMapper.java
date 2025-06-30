package com.budgetwise.api.transactiontemplate.mapper;

import com.budgetwise.api.transactiontemplate.TransactionTemplate;
import com.budgetwise.api.transactiontemplate.dto.TransactionTemplateResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

@Mapper(componentModel = SPRING)
public interface TransactionTemplateMapper {

    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    TransactionTemplateResponse toDto(TransactionTemplate transactionTemplate);

    List<TransactionTemplateResponse> toDtoList(List<TransactionTemplate> transactionTemplates);
}