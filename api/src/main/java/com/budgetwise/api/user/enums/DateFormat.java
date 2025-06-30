package com.budgetwise.api.user.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;

@Getter
@RequiredArgsConstructor
public enum DateFormat {
    // Standard and most common formats
    YYYY_MM_DD("yyyy-MM-dd"), // ISO 8601 - Excellent default
    DD_MM_YYYY("dd/MM/yyyy"),
    MM_DD_YYYY("MM/dd/yyyy"),
    // Formats with a full month name
    DD_MMM_YYYY("dd-MMM-yyyy"), // e.g., 27-Jun-2025
    MMM_DD_YYYY("MMM-dd-yyyy"), // e.g., Jun-27-2025

    // Short year formats (less common for full dates but still used)
    DD_MM_YY("dd/MM/yy"),
    MM_DD_YY("MM/dd/yy");

    private final String pattern;

     /**
     * Checks if a given string value is a valid pattern defined in the enum.
     * @param value The pattern string to check (e.g., "dd/MM/yyyy").
     * @return true if the string matches one of the enum patterns, false otherwise.
     */
    public static boolean isValidPattern(String value) {
        if (value == null || value.isBlank()) {
            return false;
        }
        return Arrays.stream(DateFormat.values())
                .map(DateFormat::getPattern) // Use getPattern() instead of name()
                .anyMatch(pattern -> pattern.equals(value));
    }

}
