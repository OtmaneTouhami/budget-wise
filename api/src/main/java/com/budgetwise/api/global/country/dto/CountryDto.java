package com.budgetwise.api.global.country.dto;

import com.budgetwise.api.global.country.Country;
import lombok.Value;

/**
 * DTO for {@link Country}
 */
@Value
public class CountryDto {
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