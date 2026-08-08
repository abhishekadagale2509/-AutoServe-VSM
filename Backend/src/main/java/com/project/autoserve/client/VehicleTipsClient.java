package com.project.autoserve.client;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.core.ParameterizedTypeReference;

@Component
public class VehicleTipsClient {

    private final RestClient restClient;

    public VehicleTipsClient() {
        this.restClient = RestClient.builder()
                .baseUrl("http://localhost:8081")
                .build();
    }

    public List<String> getTips(String vehicleType) {

        return restClient.get()
                .uri("/api/tips/{vehicleType}", vehicleType)
                .retrieve()
                .body(new ParameterizedTypeReference<List<String>>() {});
    }
}