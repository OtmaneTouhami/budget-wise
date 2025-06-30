package com.budgetwise.api.budget.mapper;

import com.budgetwise.api.budget.Budget;
import com.budgetwise.api.budget.dto.BudgetResponse;
import org.mapstruct.*;

import java.util.List;

import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

@Mapper(componentModel = SPRING)
public interface BudgetMapper {
    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    BudgetResponse toDto(Budget budget);

    List<BudgetResponse> toDtoList(List<Budget> budgets);
}