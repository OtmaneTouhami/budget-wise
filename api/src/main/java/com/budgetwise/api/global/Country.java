package com.budgetwise.api.global;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "countries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Country {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "alpha_2_code", nullable = false, unique = true, length = 2)
    private String alpha2Code;

    @Column(name = "alpha_3_code", nullable = false, unique = true, length = 3)
    private String alpha3Code;

    @Column(name = "calling_code", nullable = false, length = 6)
    private String callingCode;

    @Column(name = "flag_url", nullable = false, length = 254)
    private String flagUrl;

    @Builder.Default
    @Column(name = "currency_code", nullable = false, length = 3, columnDefinition = "CHAR(3) DEFAULT 'NCN'")
    private String currencyCode = "NCN";

    @Builder.Default
    @Column(name = "currency_name", nullable = false, length = 100, columnDefinition = "VARCHAR(100) DEFAULT 'No Currency Name'")
    private String currencyName = "No Currency Name";

    @Builder.Default
    @Column(name = "currency_symbol", nullable = false, length = 10, columnDefinition = "CHAR(10) DEFAULT '$'")
    private String currencySymbol = "$";

}
