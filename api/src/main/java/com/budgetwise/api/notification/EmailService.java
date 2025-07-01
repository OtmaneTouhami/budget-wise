package com.budgetwise.api.notification;

import java.io.IOException;

public interface EmailService {
    void sendEmail(String to, String subject, String body) throws IOException;
}
