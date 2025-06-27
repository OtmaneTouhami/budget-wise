package com.budgetwise.api.budget;

import com.budgetwise.api.category.Category;
import com.budgetwise.api.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import static org.hibernate.annotations.UuidGenerator.Style.TIME;

@Entity
@Table(name = "budgets", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "category_id", "budget_month"})
})
@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class Budget {

    @Id
    @GeneratedValue
    @UuidGenerator(style = TIME)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(name = "budget_month", nullable = false)
    private LocalDate budgetMonth;

    @Column(name = "budget_amount", nullable = false, precision = 19, scale = 4)
    private BigDecimal budgetAmount;

    @Builder.Default
    @Column(name = "auto_renew", nullable = false, columnDefinition = "boolean DEFAULT false")
    private boolean autoRenew = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
