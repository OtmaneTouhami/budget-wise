package com.budgetwise.api.category.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CategoryType {
    INCOME("Income"), EXPENSE("Expense");

    private final String name;
}
