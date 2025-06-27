package com.budgetwise.api.receipt;

import com.budgetwise.api.transaction.Transaction;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.hibernate.annotations.UuidGenerator.Style.TIME;

@Entity
@Table(name = "receipts")
@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class Receipt {

    @Id
    @GeneratedValue
    @UuidGenerator(style = TIME)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(name = "file_name", nullable = false, length = 254)
    private String fileName;

    @Column(name = "original_file_name", nullable = false, length = 254)
    private String originalFileName;

    @Column(name = "file_url", nullable = false , length = 254)
    private String fileUrl;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "mime_type", length = 50)
    private String mimeType;

    @Column(name = "uploaded_at", nullable = false)
    private LocalDateTime uploadedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id", nullable = false)
    private Transaction transaction;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
