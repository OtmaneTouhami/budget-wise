package com.budgetwise.api.global.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class CountryApiResponse {
    private String name;
    private String alpha2Code;
    private String alpha3Code;
    private List<String> callingCodes;
    private Flags flags;
    private List<Currency> currencies;
}
