package com.budgetwise.api.receipt.mapper;

import com.budgetwise.api.receipt.Receipt;
import com.budgetwise.api.receipt.dto.ReceiptResponse;
import org.mapstruct.Mapper;

import java.util.List;

import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

@Mapper(componentModel = SPRING)
public interface ReceiptMapper {
    ReceiptResponse toDto(Receipt receipt);

    List<ReceiptResponse> toDtoList(List<Receipt> receipts);
}