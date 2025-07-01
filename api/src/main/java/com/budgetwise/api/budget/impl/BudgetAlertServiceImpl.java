package com.budgetwise.api.budget.impl;

import com.budgetwise.api.budget.Budget;
import com.budgetwise.api.budget.BudgetAlertService;
import com.budgetwise.api.budget.BudgetRepository;
import com.budgetwise.api.notification.EmailService;
import com.budgetwise.api.notification.Notification;
import com.budgetwise.api.notification.NotificationRepository;
import com.budgetwise.api.transaction.Transaction;
import com.budgetwise.api.transaction.TransactionRepository;
import com.budgetwise.api.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BudgetAlertServiceImpl implements BudgetAlertService {

    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;
    private final NotificationRepository notificationRepository;
    private final EmailService emailService;

    @Value("${budget.alert.threshold}")
    private double alertThreshold;

    /**
     * This method is called after a new transaction is created.
     * It checks if the transaction's category has a budget and if that budget has crossed the alert threshold.
     */
    public void checkBudgetAfterTransaction(Transaction transaction) {
        YearMonth transactionMonth = YearMonth.from(transaction.getTransactionDate());

        // Find if a budget exists for this transaction's category and month
        budgetRepository.findByUserAndCategoryAndBudgetMonth(
                transaction.getUser(),
                transaction.getCategory(),
                transactionMonth.atDay(1)
        ).ifPresent(budget -> {
            // A budget exists, now let's calculate the total spending for that month
            List<Transaction> transactionsInMonth = transactionRepository.findByUserAndCategoryAndTransactionDateBetween(
                    transaction.getUser(),
                    transaction.getCategory(),
                    transactionMonth.atDay(1).atStartOfDay(),
                    transactionMonth.atEndOfMonth().atTime(23, 59, 59)
            );

            BigDecimal totalSpent = transactionsInMonth.stream()
                    .map(Transaction::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal budgetAmount = budget.getBudgetAmount();

            // Calculate the spending ratio
            BigDecimal spendingRatio = totalSpent.divide(budgetAmount, 4, RoundingMode.HALF_UP);

            if (spendingRatio.doubleValue() >= alertThreshold) {
                // Threshold reached! Create the notifications.
                createAndSendAlerts(budget, totalSpent);
            }
        });
    }

    private void createAndSendAlerts(Budget budget, BigDecimal totalSpent) {
        String message = String.format(
                "Budget Alert: You have spent $%s of your $%s budget for %s.",
                totalSpent.toPlainString(),
                budget.getBudgetAmount().toPlainString(),
                budget.getCategory().getName()
        );

        // 1. Create In-App Notification
        Notification appNotification = Notification.builder()
                .user(budget.getUser())
                .message(message)
                .build();
        notificationRepository.save(appNotification);

        // 2. Send Email Notification
        User user = budget.getUser();
        String subject = "BudgetWise Alert: " + budget.getCategory().getName();

        try {
            emailService.sendEmail(user.getEmail(), subject, message);
        } catch (IOException e) {
            log.error("Failed to send budget alert email for user {}", user.getUsername(), e);
        }
    }
}