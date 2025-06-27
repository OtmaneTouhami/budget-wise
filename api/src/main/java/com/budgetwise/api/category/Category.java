package com.budgetwise.api.category;

import com.budgetwise.api.budget.Budget;
import com.budgetwise.api.recurringtransaction.RecurringTransaction;
import com.budgetwise.api.transaction.Transaction;
import com.budgetwise.api.transactiontemplate.TransactionTemplate;
import com.budgetwise.api.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.hibernate.annotations.UuidGenerator.Style.TIME;

@Entity
@Table(name = "categories", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "name"})
})
@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class Category {

    @Id
    @GeneratedValue
    @UuidGenerator(style = TIME)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false, length = 50)
    private String name;

    @Lob
    private String description;

    @Column(name = "category_type", nullable = false, length = 8)
    @Enumerated(EnumType.STRING)
    private CategoryType categoryType;

    @Builder.Default
    @Column(length = 7, columnDefinition = "VARCHAR(7) DEFAULT '#000000'")
    private String color = "#000000";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    private List<Budget> budgets;

    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    private List<TransactionTemplate> transactionTemplates;

    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    private List<RecurringTransaction> recurringTransactions;

    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    private List<Transaction> transactions;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
