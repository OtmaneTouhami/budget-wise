package com.budgetwise.api.security;

import com.budgetwise.api.exception.ResourceNotFoundException;
import com.budgetwise.api.user.User;
import com.budgetwise.api.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityUtils {

    private final UserRepository userRepository;

    /**
     * Retrieves the currently authenticated User entity from the database.
     * This is the main method services should use to get the full User object.
     *
     * @return The fully hydrated User entity for the current session.
     * @throws ResourceNotFoundException if the authenticated user cannot be found in the database.
     */
    public User getCurrentUser() {

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user '" + username + "' not found in the database."));
    }

    /**
     * Retrieves the username of the currently authenticated user directly from the security context.
     * This is a faster alternative if you only need the username and not the full User entity.
     *
     * @return The username of the current user.
     * @throws IllegalStateException if there is no authenticated user.
     */
    public String getCurrentUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else if (principal != null) {
            return principal.toString();
        }
        throw new IllegalStateException("Could not find the username of the currently authenticated user.");
    }
}
