package com.budgetwise.api.global.country.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class Currency {
    private String code;
    private String name;
    private String symbol;
}