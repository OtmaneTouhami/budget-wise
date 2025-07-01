package com.budgetwise.api.scheduler;

import com.budgetwise.api.budget.Budget;
import com.budgetwise.api.budget.BudgetRepository;
import com.budgetwise.api.budget.impl.BudgetAlertServiceImpl;
import com.budgetwise.api.recurringtransaction.RecurringTransaction;
import com.budgetwise.api.recurringtransaction.RecurringTransactionRepository;
import com.budgetwise.api.recurringtransaction.enums.ScheduleType;
import com.budgetwise.api.transaction.Transaction;
import com.budgetwise.api.transaction.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduledTasksService {

    private final RecurringTransactionRepository recurringRepository;
    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;
    private final BudgetAlertServiceImpl budgetAlertService;

    /**
     * This scheduled task runs once every day at 1:00 AM server time.
     * It processes all recurring transactions that are due.
     * The cron expression means: (second, minute, hour, day of month, month, day of week)
     */
    @Scheduled(cron = "0 0 1 * * *")
    @Transactional
    public void processRecurringTransactions() {
        log.info("Starting daily recurring transactions job...");
        LocalDate today = LocalDate.now();

        // Find all active recurring transactions that are due on or before today
        List<RecurringTransaction> dueTransactions = recurringRepository.findDueRecurringTransactions(today);

        if (dueTransactions.isEmpty()) {
            log.info("No recurring transactions are due today.");
            return;
        }

        log.info("Found {} recurring transactions to process.", dueTransactions.size());

        for (RecurringTransaction rule : dueTransactions) {
            // Check if the rule has an end date and if it has passed
            if (rule.getEndDate() != null && today.isAfter(rule.getEndDate())) {
                rule.setActive(false); // Deactivate the rule as it has expired
                recurringRepository.save(rule);
                continue; // Skip to the next rule
            }

            // Create a new transaction from the rule
            Transaction newTransaction = Transaction.builder()
                    .amount(rule.getAmount())
                    .description(rule.getDescription())
                    .transactionDate(rule.getNextExecutionDate().atStartOfDay())
                    .user(rule.getUser())
                    .category(rule.getCategory())
                    .isCreatedAutomatically(true) // Set the flag
                    .recurringTransaction(rule) // Link back to the parent rule
                    .build();

            Transaction savedTransaction = transactionRepository.save(newTransaction);
            log.info("Created new transaction {} from recurring rule {}.", savedTransaction.getId(), rule.getName());

            // Check for budget alerts after creation
            budgetAlertService.checkBudgetAfterTransaction(savedTransaction);

            // CRITICAL: Update the next execution date for the rule
            LocalDate nextDate = calculateNextExecutionDate(rule.getNextExecutionDate(), rule.getScheduleType());
            rule.setNextExecutionDate(nextDate);
            recurringRepository.save(rule);
        }

        log.info("Finished recurring transactions job.");
    }

    /**
     * This scheduled task runs on the first day of every month at 2:00 AM server time.
     * It finds all budgets from the previous month marked for auto-renewal and creates them for the current month.
     */
    @Scheduled(cron = "0 0 2 1 * *")
    @Transactional
    public void renewBudgets() {
        log.info("Starting monthly budget renewal job...");
        YearMonth lastMonth = YearMonth.now().minusMonths(1);
        LocalDate lastMonthStart = lastMonth.atDay(1);
        LocalDate lastMonthEnd = lastMonth.atEndOfMonth();

        // Find all budgets from the previous month that are marked for auto-renewal
        List<Budget> budgetsToRenew = budgetRepository.findBudgetsToRenew(lastMonthStart, lastMonthEnd);

        if (budgetsToRenew.isEmpty()) {
            log.info("No budgets to renew for this month.");
            return;
        }

        log.info("Found {} budgets to renew.", budgetsToRenew.size());
        List<Budget> newBudgets = new ArrayList<>();

        for (Budget oldBudget : budgetsToRenew) {
            Budget newBudget = Budget.builder()
                    .user(oldBudget.getUser())
                    .category(oldBudget.getCategory())
                    .budgetAmount(oldBudget.getBudgetAmount())
                    .budgetMonth(oldBudget.getBudgetMonth().plusMonths(1)) // Set for the current month
                    .autoRenew(true) // Keep auto-renew enabled
                    .build();
            newBudgets.add(newBudget);
        }

        // Save all new budgets in a single batch operation
        budgetRepository.saveAll(newBudgets);
        log.info("Finished renewing {} budgets.", newBudgets.size());
    }

    private LocalDate calculateNextExecutionDate(LocalDate currentDate, ScheduleType scheduleType) {
        return switch (scheduleType) {
            case DAILY -> currentDate.plusDays(1);
            case WEEKLY -> currentDate.plusWeeks(1);
            case MONTHLY -> currentDate.plusMonths(1);
            case YEARLY -> currentDate.plusYears(1);
        };
    }
}