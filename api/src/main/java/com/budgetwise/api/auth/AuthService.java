package com.budgetwise.api.auth;

import com.budgetwise.api.auth.dto.AuthenticationRequest;
import com.budgetwise.api.auth.dto.AuthenticationResponse;
import com.budgetwise.api.auth.dto.RegisterRequest;

public interface AuthService {
    AuthenticationResponse login(AuthenticationRequest request);
    AuthenticationResponse register(RegisterRequest request);
}
