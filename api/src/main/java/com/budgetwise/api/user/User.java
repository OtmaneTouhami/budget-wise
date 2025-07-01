package com.budgetwise.api.user;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.budgetwise.api.budget.Budget;
import com.budgetwise.api.category.Category;
import com.budgetwise.api.global.country.Country;
import com.budgetwise.api.recurringtransaction.RecurringTransaction;
import com.budgetwise.api.transaction.Transaction;
import com.budgetwise.api.transactiontemplate.TransactionTemplate;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

import static org.hibernate.annotations.UuidGenerator.Style.TIME;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class User implements UserDetails {

    @Id
    @GeneratedValue
    @UuidGenerator(style = TIME)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(unique = true, nullable = false, length = 254)
    private String email;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(nullable = false, length = 100)
    private String password;

    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    @Builder.Default
    @Column(name = "date_format", length = 10, columnDefinition = "VARCHAR(10) DEFAULT 'yyyy-MM-dd'")
    private String dateFormat = "yyyy-MM-dd" ;

    @Builder.Default
    @Column(name = "is_active", nullable = false, columnDefinition = "boolean DEFAULT true")
    private boolean isActive = true;

    @Builder.Default
    @Column(name = "is_deleted", nullable = false, columnDefinition = "boolean DEFAULT false")
    private boolean isDeleted = false;

    @Lob
    @Column(name = "refresh_token")
    private String refreshToken;

    private LocalDateTime lastLoginDate;
    private LocalDateTime lastPasswordResetDate;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Category> categories;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Budget> budgets;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<TransactionTemplate> transactionTemplates;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<RecurringTransaction> recurringTransactions;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Transaction> transactions;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id", nullable = false)
    private Country country;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.isActive && !this.isDeleted;
    }
}
