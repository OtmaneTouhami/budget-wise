package com.budgetwise.api.receipt.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ReceiptResponse {
    private UUID id;
    private String originalFileName;
    private String fileUrl;
    private Long fileSize;
    private String mimeType;
    private LocalDateTime uploadedAt;
}
