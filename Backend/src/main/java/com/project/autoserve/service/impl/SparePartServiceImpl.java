package com.project.autoserve.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.project.autoserve.dto.sparepart.SparePartResponseDTO;
import com.project.autoserve.repository.SparePartRepository;
import com.project.autoserve.service.SparePartService;
import com.project.autoserve.util.MapperUtil;

@Service
public class SparePartServiceImpl implements SparePartService {

    private final SparePartRepository sparePartRepository;

    public SparePartServiceImpl(SparePartRepository sparePartRepository) {
        this.sparePartRepository = sparePartRepository;
    }

    @Override
    public List<SparePartResponseDTO> getAllParts() {

        return sparePartRepository.findAll()
                .stream()
                .map(MapperUtil::toSparePartResponse)
                .toList();

    }

}