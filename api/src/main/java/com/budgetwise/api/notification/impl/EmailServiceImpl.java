package com.budgetwise.api.notification.impl;

import com.budgetwise.api.notification.EmailService;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    @Value("${sendgrid.api-key}")
    private String sendGridApiKey;

    @Value("${sendgrid.from-email}")
    private String fromEmail;

    @Override
    public void sendEmail(String to, String subject, String body) throws IOException {
        // 1. Create the required SendGrid objects
        Email from = new Email(fromEmail);
        Email toEmail = new Email(to);
        Content content = new Content("text/plain", body);
        Mail mail = new Mail(from, subject, toEmail, content);

        // 2. Initialize the SendGrid client
        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();

        try {
            // 3. Build the request and send the email
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);

            log.info("Email sent to {}. Status Code: {}", to, response.getStatusCode());

        } catch (IOException ex) {
            log.error("Error sending email to {}: {}", to, ex.getMessage());
            throw ex;
        }
    }
}