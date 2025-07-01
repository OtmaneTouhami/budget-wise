package com.budgetwise.api.global.country;

import com.budgetwise.api.global.country.dto.CountryDto;

import java.util.List;

public interface CountryService {
    List<CountryDto> getAllCounties();
    CountryDto getCountryById(Long id);
}
