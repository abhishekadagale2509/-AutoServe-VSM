package com.project.autoserve.util;

import java.security.SecureRandom;

public class OtpUtil {

    private static final SecureRandom random =
            new SecureRandom();

    public static String generateOtp() {

        return String.format(
                "%06d",
                random.nextInt(1000000));
    }

}