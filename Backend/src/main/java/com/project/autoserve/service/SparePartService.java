package com.project.autoserve.service;

import java.util.List;

import com.project.autoserve.dto.sparepart.SparePartResponseDTO;

public interface SparePartService {

    List<SparePartResponseDTO> getAllParts();

}