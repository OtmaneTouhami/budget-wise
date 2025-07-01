package com.budgetwise.api.auth;

import com.budgetwise.api.auth.dto.*;
import jakarta.servlet.http.HttpServletRequest;

public interface AuthService {
    AuthenticationResponse login(AuthenticationRequest request);

    AuthenticationResponse register(RegisterRequest request);

    AuthenticationResponse refreshToken(HttpServletRequest request);

    void logout(HttpServletRequest request);

    AuthenticationResponse verifyAccount(VerificationRequest request);

    void resendVerificationToken(ResendVerificationRequest request);
}
