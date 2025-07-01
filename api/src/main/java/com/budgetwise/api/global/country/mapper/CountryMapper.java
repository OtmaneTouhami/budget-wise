package com.budgetwise.api.global.mapper;

import com.budgetwise.api.global.Country;
import com.budgetwise.api.global.dto.CountryDto;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = SPRING)
public interface CountryMapper {

    CountryDto toDto(Country country);

    List<CountryDto> toDtoList(List<Country> countries);

}