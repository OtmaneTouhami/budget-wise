package com.budgetwise.api.transaction;

import com.budgetwise.api.category.Category;
import com.budgetwise.api.receipt.Receipt;
import com.budgetwise.api.recurringtransaction.RecurringTransaction;
import com.budgetwise.api.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.hibernate.annotations.UuidGenerator.Style.TIME;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue
    @UuidGenerator(style = TIME)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Lob
    private String description;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal amount;

    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime transactionDate;

    @Builder.Default
    @Column(name = "is_created_automatically", nullable = false, columnDefinition = "boolean DEFAULT false")
    private boolean isCreatedAutomatically = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recurring_transaction_id")
    private RecurringTransaction recurringTransaction;

    @OneToMany(mappedBy = "transaction", fetch = FetchType.LAZY)
    private List<Receipt> receipts;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

}
