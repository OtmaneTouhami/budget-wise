package com.budgetwise.api.global.country.impl;


import com.budgetwise.api.global.country.Country;
import com.budgetwise.api.global.country.CountryDataSeeder;
import com.budgetwise.api.global.country.CountryRepository;
import com.budgetwise.api.global.country.dto.CountryApiResponse;
import com.budgetwise.api.global.country.dto.Currency;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CountryDataSeederImpl implements CountryDataSeeder {

    private final CountryRepository countryRepository;
    private final WebClient webClient;

    @Value("#{'${seeder.countries.exclude:}'.split(',')}")
    private Set<String> excludedCountries;

    @Override
    public void seedCountries() {
        if (countryRepository.count() > 0) {
            System.out.println("Country data already exists. Skipping seeding.");
        } else {
            System.out.println("Seeding country data...");
            Flux<CountryApiResponse> countryFlux = webClient.get()
                    .uri("countries")
                    .retrieve()
                    .bodyToFlux(CountryApiResponse.class);

            List<Country> countriesToSave = countryFlux
                    .map(this::transformToEntity)
                    .filter(country -> country != null && !excludedCountries.contains(country.getName()))
                    .collectList()
                    .block();

            if (countriesToSave != null && !countriesToSave.isEmpty()) {
                countryRepository.saveAll(countriesToSave);
                System.out.println("Finished seeding " + countriesToSave.size() + " countries.");
            } else {
                System.out.println("No countries were available to seed.");
            }
        }
    }

    private Country transformToEntity(CountryApiResponse apiResponse) {
        if (apiResponse == null || apiResponse.getName() == null) {
            return null;
        }

        Country country = Country.builder()
                .name(apiResponse.getName())
                .alpha2Code(apiResponse.getAlpha2Code())
                .alpha3Code(apiResponse.getAlpha3Code())
                .flagUrl(apiResponse.getFlags() != null ? apiResponse.getFlags().getPng() : null)
                .build();

        if (apiResponse.getCallingCodes() != null && !apiResponse.getCallingCodes().isEmpty()) {
            country.setCallingCode(apiResponse.getCallingCodes().get(0));
        }

        if (apiResponse.getCurrencies() != null && !apiResponse.getCurrencies().isEmpty()) {
            Currency firstCurrency = apiResponse.getCurrencies().get(0);
            if (firstCurrency != null) {
                country.setCurrencyCode(firstCurrency.getCode());
                country.setCurrencyName(firstCurrency.getName());
                country.setCurrencySymbol(firstCurrency.getSymbol());
            }
        }
        return country;
    }
}
