package com.buildcon.erp.exception;

import java.util.regex.Pattern;

public class ValidationUtils {

    // Matches any characters that are not alphanumeric, spaces, or standard email symbols (@, ., _, -)
    private static final Pattern SPECIAL_CHAR_PATTERN = Pattern.compile("[^a-zA-Z0-9\\s@\\.\\_\\-]");

    public static void validateNotNull(Object val, String fieldName) {
        if (val == null) {
            throw new CustomValidationException("Field '" + fieldName + "' cannot be null.");
        }
        if (val instanceof String && ((String) val).trim().isEmpty()) {
            throw new CustomValidationException("Field '" + fieldName + "' cannot be empty.");
        }
    }

    public static void validateSpecialCharacters(String val, String fieldName) {
        if (val != null && SPECIAL_CHAR_PATTERN.matcher(val).find()) {
            throw new CustomValidationException("Field '" + fieldName + "' contains invalid special characters.");
        }
    }

    public static void validateEmail(String email) {
        validateNotNull(email, "email");
        if (!email.contains("@") || !email.contains(".")) {
            throw new CustomValidationException("Invalid email format.");
        }
        validateSpecialCharacters(email, "email");
    }
}
