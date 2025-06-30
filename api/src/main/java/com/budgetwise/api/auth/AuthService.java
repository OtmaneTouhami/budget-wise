package com.budgetwise.api.auth;

import com.budgetwise.api.auth.dto.AuthenticationRequest;
import com.budgetwise.api.auth.dto.AuthenticationResponse;
import com.budgetwise.api.auth.dto.RegisterRequest;
import jakarta.servlet.http.HttpServletRequest;

public interface AuthService {
    AuthenticationResponse login(AuthenticationRequest request);
    AuthenticationResponse register(RegisterRequest request);
    AuthenticationResponse refreshToken(HttpServletRequest request);
    void logout(HttpServletRequest request);
}
