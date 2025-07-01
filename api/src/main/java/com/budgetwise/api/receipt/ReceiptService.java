package com.budgetwise.api.receipt;

import com.budgetwise.api.receipt.dto.ReceiptResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface ReceiptService {
    ReceiptResponse attachReceiptToTransaction(UUID transactionId, MultipartFile file) throws IOException;

    List<ReceiptResponse> getReceiptsForTransaction(UUID transactionId);

    void deleteReceipt(UUID receiptId);
}