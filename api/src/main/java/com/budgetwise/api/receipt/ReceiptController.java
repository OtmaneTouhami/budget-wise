package com.budgetwise.api.receipt;

import com.budgetwise.api.receipt.dto.ReceiptResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Tag(name = "Receipts", description = "Endpoints for managing receipts")
public class ReceiptController {

    private final ReceiptService receiptService;

    // The endpoint to upload and attach a receipt to a specific transaction
    @PostMapping("/transactions/{transactionId}/receipts")
    public ResponseEntity<ReceiptResponse> uploadReceipt(
            @PathVariable UUID transactionId,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        return new ResponseEntity<>(receiptService.attachReceiptToTransaction(transactionId, file), HttpStatus.CREATED);
    }

    // Get all receipts for a specific transaction
    @GetMapping("/transactions/{transactionId}/receipts")
    public ResponseEntity<List<ReceiptResponse>> getReceiptsForTransaction(@PathVariable UUID transactionId) {
        return ResponseEntity.ok(receiptService.getReceiptsForTransaction(transactionId));
    }

    // Delete a specific receipt by its own ID
    @DeleteMapping("/receipts/{receiptId}")
    public ResponseEntity<Void> deleteReceipt(@PathVariable UUID receiptId) {
        receiptService.deleteReceipt(receiptId);
        return ResponseEntity.noContent().build();
    }
}