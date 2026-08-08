package com.project.autoserve.util;

import java.security.SecureRandom;

public class PasswordUtil {

    private static final String CHARACTERS =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!";

    private static final SecureRandom RANDOM = new SecureRandom();

    public static String generatePassword() {

        StringBuilder password = new StringBuilder();

        for (int i = 0; i < 10; i++) {
            password.append(
                    CHARACTERS.charAt(
                            RANDOM.nextInt(CHARACTERS.length())
                    )
            );
        }

        return password.toString();
    }
}