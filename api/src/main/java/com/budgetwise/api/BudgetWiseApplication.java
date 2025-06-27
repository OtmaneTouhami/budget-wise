package com.budgetwise.api;

import com.budgetwise.api.global.CountryDataSeeder;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@RequiredArgsConstructor
public class BudgetWiseApplication implements ApplicationRunner {

	private final CountryDataSeeder countryDataSeeder;

	public static void main(String[] args) {
		SpringApplication.run(BudgetWiseApplication.class, args);
	}

	@Override
	public void run(ApplicationArguments args) {
		countryDataSeeder.seedCountries();
	}
}
