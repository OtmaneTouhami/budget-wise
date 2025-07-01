package com.budgetwise.api.global.impl;

import com.budgetwise.api.exception.ResourceNotFoundException;
import com.budgetwise.api.global.Country;
import com.budgetwise.api.global.CountryRepository;
import com.budgetwise.api.global.CountryService;
import com.budgetwise.api.global.dto.CountryDto;
import com.budgetwise.api.global.mapper.CountryMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CountryServiceImpl implements CountryService {

    private final CountryRepository countryRepository;
    private final CountryMapper countryMapper;

    @Override
    public List<CountryDto> getAllCounties() {
        List<Country> countries = countryRepository.findAll();
        return countryMapper.toDtoList(countries);
    }

    @Override
    public CountryDto getCountryById(Long id) {
        Country country = countryRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Country with id " + id + " does not exist.")
        );
        return countryMapper.toDto(country);
    }


}
