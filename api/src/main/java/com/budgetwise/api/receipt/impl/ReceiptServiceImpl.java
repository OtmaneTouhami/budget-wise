package com.budgetwise.api.receipt.impl;

import com.budgetwise.api.exception.ResourceNotFoundException;
import com.budgetwise.api.filestorage.S3Service;
import com.budgetwise.api.receipt.Receipt;
import com.budgetwise.api.receipt.ReceiptRepository;
import com.budgetwise.api.receipt.ReceiptService;
import com.budgetwise.api.receipt.dto.ReceiptResponse;
import com.budgetwise.api.receipt.mapper.ReceiptMapper;
import com.budgetwise.api.security.SecurityUtils;
import com.budgetwise.api.transaction.Transaction;
import com.budgetwise.api.transaction.TransactionRepository;
import com.budgetwise.api.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReceiptServiceImpl implements ReceiptService {

    private final ReceiptRepository receiptRepository;
    private final TransactionRepository transactionRepository;
    private final S3Service s3Service;
    private final ReceiptMapper receiptMapper;
    private final SecurityUtils securityUtils;

    @Override
    @Transactional
    public ReceiptResponse attachReceiptToTransaction(UUID transactionId, MultipartFile file) throws IOException {
        User currentUser = securityUtils.getCurrentUser();
        Transaction transaction = findTransactionAndVerifyOwnership(transactionId, currentUser);

        // Generate a unique key for the S3 object
        String s3Key = String.format("receipts/%s/%s-%s",
                currentUser.getId(),
                UUID.randomUUID(),
                file.getOriginalFilename());

        // Upload file to S3
        String fileUrl = s3Service.uploadFile(s3Key, file);

        // Create and save the receipt entity
        Receipt receipt = Receipt.builder()
                .fileName(s3Key)
                .originalFileName(file.getOriginalFilename())
                .fileUrl(fileUrl)
                .fileSize(file.getSize())
                .mimeType(file.getContentType())
                .uploadedAt(LocalDateTime.now())
                .build();

        // Use the helper method to link the receipt to the transaction
        transaction.addReceipt(receipt);
        transactionRepository.save(transaction); // Saving the parent will cascade save the new receipt

        // The receipt object is now managed and has an ID, so we find the saved instance
        Receipt savedReceipt = transaction.getReceipts().stream()
                .filter(r -> r.getFileName().equals(s3Key))
                .findFirst()
                .orElseThrow(); // Should always be present

        return receiptMapper.toDto(savedReceipt);
    }

    @Override
    public List<ReceiptResponse> getReceiptsForTransaction(UUID transactionId) {
        Transaction transaction = findTransactionAndVerifyOwnership(transactionId, securityUtils.getCurrentUser());
        return receiptMapper.toDtoList(transaction.getReceipts());
    }

    @Override
    @Transactional
    public void deleteReceipt(UUID receiptId) {
        User currentUser = securityUtils.getCurrentUser();
        Receipt receipt = receiptRepository.findById(receiptId)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt not found"));

        // Verify ownership through the parent transaction
        if (!receipt.getTransaction().getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You do not have permission to delete this receipt");
        }

        // Delete from S3 first
        s3Service.deleteFile(receipt.getFileName());

        // Then delete from the database
        receiptRepository.delete(receipt);
    }


    private Transaction findTransactionAndVerifyOwnership(UUID transactionId, User user) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + transactionId));
        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to access this transaction");
        }
        return transaction;
    }
}