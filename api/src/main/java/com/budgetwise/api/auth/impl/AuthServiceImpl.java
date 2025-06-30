package com.budgetwise.api.auth.impl;

import com.budgetwise.api.auth.AuthService;
import com.budgetwise.api.auth.dto.AuthenticationRequest;
import com.budgetwise.api.auth.dto.AuthenticationResponse;
import com.budgetwise.api.auth.dto.RegisterRequest;
import com.budgetwise.api.auth.mapper.AuthMapper;
import com.budgetwise.api.global.Country;
import com.budgetwise.api.global.CountryRepository;
import com.budgetwise.api.security.JwtService;
import com.budgetwise.api.user.User;
import com.budgetwise.api.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final CountryRepository countryRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AuthMapper authMapper;

    public AuthenticationResponse login(AuthenticationRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // If the above line doesn't throw an exception, the user is valid
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow();

        LocalDateTime loginTime = LocalDateTime.now();
        user.setLastLoginDate(loginTime);
        userRepository.save(user);

        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder().token(jwtToken).build();
    }


    @Transactional
    public AuthenticationResponse register(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalStateException("Username already taken");
        }

        // 1. Use the mapper to handle the simple field mappings
        User user = authMapper.toUser(request);

        // 2. Fetch the Country object from the database
        Country country = countryRepository.findById(request.getCountryId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Country ID: " + request.getCountryId()));

        // 3. Get the current date and time
        LocalDateTime loginTime = LocalDateTime.now();

        // 4. Manually set the fields that were ignored by the mapper
        user.setCountry(country);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setActive(true);
        user.setDeleted(false);
        user.setLastLoginDate(loginTime);

        // 5. Save the fully constructed user
        userRepository.save(user);

        // 6. Generate and return the JWT
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder().token(jwtToken).build();
    }
}