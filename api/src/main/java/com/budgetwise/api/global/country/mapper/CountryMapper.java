package com.budgetwise.api.global.country.mapper;


import com.budgetwise.api.global.country.Country;
import com.budgetwise.api.global.country.dto.CountryDto;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = SPRING)
public interface CountryMapper {

    CountryDto toDto(Country country);

    List<CountryDto> toDtoList(List<Country> countries);

}