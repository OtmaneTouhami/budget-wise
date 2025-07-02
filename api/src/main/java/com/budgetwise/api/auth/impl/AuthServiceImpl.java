package com.budgetwise.api.auth.impl;

import com.budgetwise.api.auth.AuthService;
import com.budgetwise.api.auth.dto.*;
import com.budgetwise.api.auth.mapper.AuthMapper;
import com.budgetwise.api.auth.token.RefreshToken;
import com.budgetwise.api.auth.token.RefreshTokenRepository;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.text.DecimalFormat;
import java.time.Instant;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final CountryRepository countryRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AuthMapper authMapper;
    private final EmailService emailService;

    @Override
    @Transactional
    public AuthenticationResponse login(AuthenticationRequest request) {

        var authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getLoginIdentifier(),
                        request.getPassword()
                )
        );

        // Get the UserDetails (your User object) directly from the authentication result
        User user = (User) authentication.getPrincipal();

        LocalDateTime loginTime = LocalDateTime.now();
        user.setLastLoginDate(loginTime);

        userRepository.save(user);

        var accessToken = jwtService.generateToken(user);
        var refreshToken = createAndSaveRefreshToken(user);

        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
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

        // 6. Send the verification email
        sendVerificationEmail(user.getEmail(), verificationToken);

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
        var refreshToken = createAndSaveRefreshToken(user);

        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .build();
    }

    @Override
    public AuthenticationResponse refreshToken(HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");
        final String refreshToken;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new BadCredentialsException("Refresh token is missing or malformed");
        }

        refreshToken = authHeader.substring(7);

        // Find the token in the database
        return refreshTokenRepository.findByToken(refreshToken)
                .map(this::verifyTokenExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String accessToken = jwtService.generateToken(user);
                    return AuthenticationResponse.builder()
                            .accessToken(accessToken)
                            .refreshToken(refreshToken)
                            .build();
                })
                .orElseThrow(() -> new BadCredentialsException("Invalid refresh token"));
    }

    @Override
    @Transactional
    public void logout(HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");
        final String refreshToken;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return;
        }

        refreshToken = authHeader.substring(7);

        refreshTokenRepository.findByToken(refreshToken).ifPresent(refreshTokenRepository::delete);
        SecurityContextHolder.clearContext();
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
            log.error("Failed to send verification email to {}", email, e);
        }
    }

    private RefreshToken createAndSaveRefreshToken(User user) {

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(jwtService.generateRefreshToken(user))
                .expiryDate(Instant.now().plusMillis(jwtService.getRefreshExpiration()))
                .build();
        return refreshTokenRepository.save(refreshToken);
    }

    private RefreshToken verifyTokenExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new IllegalStateException("Refresh token has expired. Please log in again.");
        }
        return token;
    }

}