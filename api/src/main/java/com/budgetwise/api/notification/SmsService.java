package com.budgetwise.api.notification;

public interface SmsService {
    void sendSms(String to, String messageBody);
}
