package com.budgetwise.api.global;

import com.budgetwise.api.global.dto.CountryDto;

import java.util.List;

public interface CountryService {
    List<CountryDto> getAllCounties();
    CountryDto getCountryById(Long id);
}
