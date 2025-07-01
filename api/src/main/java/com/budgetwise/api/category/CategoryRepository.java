package com.budgetwise.api.category;

import com.budgetwise.api.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
    // Finds all categories for a specific user, ordered by creation date descending
    List<Category> findByUserOrderByCreatedAtDesc(User currentUser);
}