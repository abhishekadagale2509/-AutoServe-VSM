package com.project.autoserve.service;

import java.util.List;

import com.project.autoserve.dto.servicehistory.ServiceHistoryResponseDTO;

public interface ServiceHistoryService {

    List<ServiceHistoryResponseDTO> getMyServiceHistory();

    List<ServiceHistoryResponseDTO> getAllServiceHistory();

}