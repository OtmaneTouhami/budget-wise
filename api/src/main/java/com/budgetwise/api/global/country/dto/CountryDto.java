package com.budgetwise.api.global.dto;

import lombok.Value;

import java.io.Serializable;

/**
 * DTO for {@link com.budgetwise.api.global.Country}
 */
@Value
public class CountryDto implements Serializable {
    Long id;
    String name;
    String alpha2Code;
    String alpha3Code;
    String callingCode;
    String flagUrl;
    String currencyCode;
    String currencyName;
    String currencySymbol;
}