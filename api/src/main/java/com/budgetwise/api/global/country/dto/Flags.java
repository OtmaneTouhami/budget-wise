package com.budgetwise.api.global.country.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class Flags {
    private String svg;
    private String png;
}
