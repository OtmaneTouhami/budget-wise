package com.budgetwise.api.auth.impl;

import com.budgetwise.api.auth.AuthService;
import com.budgetwise.api.auth.dto.*;
import com.budgetwise.api.auth.mapper.AuthMapper;
import com.budgetwise.api.exception.ResourceNotFoundException;
import com.budgetwise.api.global.country.Country;
import com.budgetwise.api.global.country.CountryRepository;
import com.budgetwise.api.notification.EmailService;
import com.budgetwise.api.security.JwtService;
import com.budgetwise.api.user.User;
import com.budgetwise.api.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.text.DecimalFormat;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final CountryRepository countryRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AuthMapper authMapper;
    private final EmailService emailService;

    @Override
    @Transactional
    public AuthenticationResponse login(AuthenticationRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getLoginIdentifier(),
                        request.getPassword()
                )
        );

        // If the above line doesn't throw an exception, the user is valid
        var user = userRepository.findByUsername(request.getLoginIdentifier())
                .or(() -> userRepository.findByEmail(request.getLoginIdentifier()))
                .orElseThrow();

        LocalDateTime loginTime = LocalDateTime.now();
        user.setLastLoginDate(loginTime);

        var accessToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Override
    @Transactional
    public AuthenticationResponse register(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalStateException("Username already taken");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalStateException("Email already registered");
        }

        // 1. Use the mapper to handle the simple field mappings
        User user = authMapper.toUser(request);

        // 2. Fetch the Country object from the database
        Country country = countryRepository.findById(request.getCountryId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Country ID: " + request.getCountryId()));

        // 3. Applying the account confirmation mechanism
        String verificationToken = generateVerificationToken();
        user.setVerificationToken(verificationToken);
        user.setVerificationTokenExpiry(LocalDateTime.now().plusMinutes(15));

        // 4. Manually set the fields that were ignored by the mapper
        user.setCountry(country);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setActive(false);
        user.setDeleted(false);

        // 5. Save the new user to the database
        userRepository.save(user);

        return AuthenticationResponse.builder().build();
    }

    @Override
    @Transactional
    public AuthenticationResponse verifyAccount(VerificationRequest request) {
        // Find the user by their username or email
        User user = userRepository.findByUsername(request.getIdentifier())
                .or(() -> userRepository.findByEmail(request.getIdentifier()))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with identifier: " + request.getIdentifier()));

        // Check if the provided token matches the one in the database
        if (!request.getToken().equals(user.getVerificationToken())) {
            throw new BadCredentialsException("Invalid verification token.");
        }

        // Check if the token has expired
        if (user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Verification token has expired. Please request a new one.");
        }

        // --- Success! Activate the user ---
        user.setActive(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);
        userRepository.save(user);

        // Now that the account is active, generate and return login tokens
        var accessToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Override
    public AuthenticationResponse refreshToken(HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");
        final String refreshToken;
        final String username;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new BadCredentialsException("Refresh token is missing or malformed");
        }

        refreshToken = authHeader.substring(7);
        username = jwtService.extractUsername(refreshToken);

        if (username != null) {
            var user = this.userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            if (jwtService.isTokenValid(refreshToken, user) && refreshToken.equals(user.getRefreshToken())) {
                var accessToken = jwtService.generateToken(user);
                return AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .build();
            }
        }
        throw new BadCredentialsException("Invalid refresh token");
    }

    @Override
    public void logout(HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");
        final String refreshToken;
        final String username;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return;
        }

        refreshToken = authHeader.substring(7);
        username = jwtService.extractUsername(refreshToken);

        if (username != null) {
            var user = this.userRepository.findByUsername(username).orElse(null);
            if (user != null) {
                user.setRefreshToken(null);
                userRepository.save(user);
                // Clear the security context
                SecurityContextHolder.clearContext();
            }
        }
    }

    @Override
    @Transactional
    public void resendVerificationToken(ResendVerificationRequest request) {
        // Find the user by their username or email
        User user = userRepository.findByUsername(request.getIdentifier())
                .or(() -> userRepository.findByEmail(request.getIdentifier()))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with identifier: " + request.getIdentifier()));

        // Check if the user's account is already active
        if (user.isActive()) {
            throw new IllegalStateException("This account has already been verified.");
        }

        // Generate a new token and set a new expiry date
        String newVerificationToken = generateVerificationToken();
        user.setVerificationToken(newVerificationToken);
        user.setVerificationTokenExpiry(LocalDateTime.now().plusMinutes(15));

        // Save the updated user with the new token
        userRepository.save(user);

        // Send the new verification email
        sendVerificationEmail(user.getEmail(), newVerificationToken);
    }

    private String generateVerificationToken() {
        // Generate a 6-digit random number
        return new DecimalFormat("000000")
                .format(new SecureRandom().nextInt(999999));
    }

    private void sendVerificationEmail(String email, String token) {
        String subject = "Verify Your BudgetWise Account";
        String body = "Thank you for registering. Please use the following token to activate your account: " + token;
        try {
            emailService.sendEmail(email, subject, body);
        } catch (Exception e) {
            // In a real app, you'd have more robust error handling, maybe a retry queue.
            // For now, we'll log the error. The user can request a new token later.
            log.error("Failed to send verification email to {}", email, e);
        }
    }

}